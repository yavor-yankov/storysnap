import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { generateFullPages } from "@/lib/ai/face-swap";
import { sendOrderConfirmation, sendBookReady } from "@/lib/email/sender";
import { getStoryBySlug } from "@/lib/stories";
import { createServiceClient } from "@/lib/supabase/server";

export const maxDuration = 300;

// Fallback in-memory store for dev (when Supabase is not available)
export const orderStore = new Map<string, {
  id: string;
  orderNumber: string;
  sessionId: string;
  storySlug: string;
  storyTitle: string;
  productType: string;
  childName: string;
  customerEmail: string;
  amountCents: number;
  status: string;
  pdfUrl?: string;
  createdAt: string;
}>();

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Dev mode without Stripe keys
  if (!stripeKey || stripeKey === "sk_test_...") {
    return NextResponse.json({ received: true });
  }

  // In production (live key), STRIPE_WEBHOOK_SECRET is mandatory.
  // Fail hard rather than silently accept unverified events.
  const isLiveKey = stripeKey.startsWith("sk_live_");
  if (isLiveKey && !webhookSecret) {
    console.error("[Webhook] STRIPE_WEBHOOK_SECRET is not set in production — rejecting all events");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(stripeKey);

    if (webhookSecret) {
      // Always verify when secret is available (test and production)
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Local dev without Stripe CLI: parse without verification (test keys only)
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const meta = session.metadata ?? {};
  const { storySlug, productType, childName, customerEmail, previewId } = meta;
  const childAge = parseInt(meta.childAge ?? "4", 10);
  const childGender = (meta.childGender ?? "unisex") as "boy" | "girl" | "unisex";

  if (!storySlug || !customerEmail) return;

  const story = getStoryBySlug(storySlug);
  if (!story) return;

  const supabase = createServiceClient();
  const orderId = crypto.randomUUID();
  const orderNumber = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 9000) + 1000}`;

  // Insert order into Supabase
  let dbOrderId: string | null = null;
  try {
    const { data: insertedOrder, error } = await supabase
      .from("orders")
      .insert({
        story_id: story.id,
        product_type: productType,
        child_name: childName,
        customer_email: customerEmail,
        amount_cents: session.amount_total ?? 0,
        currency: "EUR",
        stripe_session_id: session.id,
        stripe_payment_id: session.payment_intent as string ?? "",
        status: "generating",
        photo_urls: [],
        shipping_address: meta.shippingAddress ? JSON.parse(meta.shippingAddress) : null,
      })
      .select("id, order_number")
      .single();

    if (!error && insertedOrder) {
      dbOrderId = insertedOrder.id;
    }
  } catch (dbErr) {
    console.warn("Order DB insert failed:", dbErr);
  }

  // Also track in-memory for the polling endpoint
  const memOrder: {
    id: string;
    orderNumber: string;
    sessionId: string;
    storySlug: string;
    storyTitle: string;
    productType: string;
    childName: string;
    customerEmail: string;
    amountCents: number;
    status: string;
    pdfUrl?: string;
    createdAt: string;
  } = {
    id: dbOrderId ?? orderId,
    orderNumber,
    sessionId: session.id,
    storySlug,
    storyTitle: story.title,
    productType,
    childName,
    customerEmail,
    amountCents: session.amount_total ?? 0,
    status: "generating",
    createdAt: new Date().toISOString(),
  };
  orderStore.set(session.id, memOrder);

  // 1. Send order confirmation email
  try {
    await sendOrderConfirmation({ order: memOrder });
  } catch (e) {
    console.error("Confirmation email failed:", e);
  }

  // 2. Fetch portrait URLs from preview request
  let portraitUrls: string[] = [];
  if (previewId) {
    try {
      const { data: preview } = await supabase
        .from("preview_requests")
        .select("photo_urls")
        .eq("id", previewId)
        .single();
      if (preview?.photo_urls?.length) {
        portraitUrls = preview.photo_urls;
      }
    } catch (e) {
      console.warn("Could not fetch portrait URLs:", e);
    }
  }

  // portraitUrlsJson fallback removed — it was silently truncated at 490 chars (issue #9).
  // previewId → Supabase is the only reliable source of portrait URLs.

  // 3. Generate full 24-page book (async, don't block HTTP response)
  setImmediate(async () => {
    try {
      // 3a. Generate personalised story text + per-page Flux image prompts via Claude
      //     Falls back to predefined texts if ANTHROPIC_API_KEY not set.
      const { generateStory } = await import("@/lib/story/generator");
      console.log(`[Webhook] Generating story for "${childName}" / ${storySlug}`);
      const storyPages = await generateStory({
        childName,
        storySlug,
        storyTitle: story.title,
        pageCount: 24,
        childAge,
        childGender,
      });

      // 3b. Generate illustrations (Replicate → fal.ai → HuggingFace → mock)
      console.log(`[Webhook] Generating 24 illustrations for order ${memOrder.orderNumber}`);
      const pages = await generateFullPages({
        storySlug,
        storyId: story.id,
        portraitUrls,
        childName,
        storyPages, // pass Claude-generated prompts
      });

      // 4. Generate PDF
      const { generateBookPdf } = await import("@/lib/pdf/book-pdf");
      const pdfBuffer = await generateBookPdf({
        storyTitle: story.title,
        childName,
        storySlug,
        pages: pages.map((p) => ({
          pageNumber: p.pageNumber,
          textContent: p.textContent,
          imageUrl: p.imageUrl.startsWith("mock:") ? undefined : p.imageUrl,
        })),
      });

      // 5. Upload PDF to Supabase Storage
      let pdfUrl: string | null = null;
      const pdfPath = `orders/${dbOrderId ?? orderId}/book.pdf`;
      try {
        const { error: uploadError } = await supabase.storage
          .from("pdfs")
          .upload(pdfPath, pdfBuffer, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (!uploadError) {
          // Store the storage path, NOT a public URL.
          // Signed URLs are generated on-demand in /api/orders/[id] (short TTL).
          pdfUrl = `supabase-storage:pdfs/${pdfPath}`;
        } else {
          console.error("PDF upload error:", uploadError);
        }
      } catch (uploadErr) {
        console.error("PDF upload exception:", uploadErr);
      }

      // 6. Update order status in Supabase
      if (dbOrderId) {
        try {
          await supabase
            .from("orders")
            .update({
              status: "complete",
              pdf_url: pdfUrl,
            })
            .eq("id", dbOrderId);

          // Save generated pages
          const pageInserts = pages.map((p) => ({
            order_id: dbOrderId,
            page_number: p.pageNumber,
            image_url: p.imageUrl,
            text_content: p.textContent,
          }));
          await supabase.from("generated_pages").insert(pageInserts);
        } catch (dbErr) {
          console.error("Order update failed:", dbErr);
        }
      }

      // Update in-memory store too
      memOrder.status = "complete";
      memOrder.pdfUrl = pdfUrl ?? undefined;
      orderStore.set(session.id, memOrder);

      // 7. Send book-ready email with download link
      await sendBookReady({ order: { ...memOrder, pdfUrl: pdfUrl ?? undefined } });

      console.log(`✅ Order complete: ${memOrder.orderNumber} | PDF: ${pdfUrl ?? "not uploaded"}`);
    } catch (e) {
      console.error("Book generation failed:", e);
      memOrder.status = "failed";
      orderStore.set(session.id, memOrder);

      if (dbOrderId) {
        try {
          // Fixed: was incorrectly setting "generating" instead of "failed" (issue #14)
          await supabase.from("orders").update({ status: "failed" }).eq("id", dbOrderId);
        } catch {}
      }
    }
  });
}
