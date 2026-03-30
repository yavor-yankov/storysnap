import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { generateFullPages } from "@/lib/ai/face-swap";
import { sendOrderConfirmation, sendBookReady } from "@/lib/email/sender";
import { getStoryBySlug } from "@/lib/stories";

// Order store (in-memory for dev — use Supabase in production)
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

  // Dev mode — handle mock sessions
  if (!stripeKey || stripeKey === "sk_test_...") {
    return NextResponse.json({ received: true });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(stripeKey);
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret ?? "");
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
  const { storySlug, productType, childName, customerEmail } = meta;

  if (!storySlug || !customerEmail) return;

  const story = getStoryBySlug(storySlug);
  if (!story) return;

  const orderId = crypto.randomUUID();
  const orderNumber = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 9000) + 1000}`;

  const order: {
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
    id: orderId,
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
  orderStore.set(session.id, order);

  // 1. Send order confirmation email
  try {
    await sendOrderConfirmation({ order });
  } catch (e) {
    console.error("Confirmation email failed:", e);
  }

  // 2. Generate full pages (async, don't block response)
  setImmediate(async () => {
    try {
      const pages = await generateFullPages({
        storySlug,
        storyId: story.id,
        portraitUrls: [],
        childName,
      });

      // 3. Generate PDF
      const { generateBookPdf } = await import("@/lib/pdf/book-pdf");
      const pdfBuffer = await generateBookPdf({
        storyTitle: story.title,
        childName,
        pages: pages.map((p) => ({
          pageNumber: p.pageNumber,
          textContent: p.textContent,
          gradient: "from-brand-orange/60 to-brand-gold",
        })),
      });

      // 4. Upload PDF to Supabase Storage (or mock)
      const pdfUrl = `mock:pdf:${orderId}`;
      order.pdfUrl = pdfUrl;
      order.status = "complete";
      orderStore.set(session.id, order);

      // 5. Send book-ready email with download link
      await sendBookReady({ order: { ...order, pdfUrl } });
    } catch (e) {
      console.error("Book generation failed:", e);
      order.status = "failed";
      orderStore.set(session.id, order);
    }
  });
}
