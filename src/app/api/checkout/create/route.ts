import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { getStoryBySlug } from "@/lib/stories";
import { createServiceClient } from "@/lib/supabase/server";

const schema = z.object({
  storySlug: z.string().min(1),
  productType: z.enum(["digital", "physical"]),
  email: z.string().email(),
  childName: z.string().min(1).max(50),
  previewId: z.string().uuid().optional(),
  childAge: z.number().int().min(1).max(12).optional(),
  childGender: z.enum(["boy", "girl", "unisex"]).optional(),
  shippingAddress: z
    .object({
      name: z.string(),
      street: z.string(),
      city: z.string(),
      postalCode: z.string(),
      phone: z.string(),
    })
    .optional(),
});

const PRICES: Record<string, { amount: number; name: string }> = {
  digital: { amount: 990, name: "HeroBook — Дигитален PDF" },
  physical: { amount: 3400, name: "HeroBook — Твърда корица" },
};

export async function POST(request: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey || stripeKey === "sk_test_...") {
    // Dev mode — return a mock redirect to success page
    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/order/success?session_id=mock_session_dev`,
    });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Невалидни данни." }, { status: 400 });
    }

    const { storySlug, productType, email, childName, previewId, childAge, childGender, shippingAddress } = parsed.data;

    const story = getStoryBySlug(storySlug);
    if (!story) {
      return NextResponse.json({ error: "Книжката не е намерена." }, { status: 404 });
    }

    // Fetch portrait URLs from preview request (if we have a previewId)
    let portraitUrls: string[] = [];
    if (previewId) {
      try {
        const supabase = createServiceClient();
        const { data: preview } = await supabase
          .from("preview_requests")
          .select("photo_urls")
          .eq("id", previewId)
          .single();
        if (preview?.photo_urls) {
          portraitUrls = preview.photo_urls;
        }
      } catch (e) {
        console.warn("Could not fetch preview portrait URLs:", e);
      }
    }

    const price = PRICES[productType];
    const stripe = new Stripe(stripeKey);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: price.amount,
            product_data: {
              name: price.name,
              description: `„${story.title}" — за ${childName}`,
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        storySlug,
        storyId: story.id,
        productType,
        childName,
        customerEmail: email,
        previewId: previewId ?? "",
        childAge: String(childAge ?? 4),
        childGender: childGender ?? "unisex",
        // Portrait URLs are fetched in the webhook via previewId (reliable Supabase path).
        // Removed portraitUrlsJson: it was silently truncated at 490 chars causing lost portraits.
        shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : "",
      },
      success_url: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(email)}`,
      cancel_url: `${appUrl}/order?story=${storySlug}&type=${productType}`,
      payment_method_types: ["card"],
      ...(productType === "physical"
        ? {
            shipping_address_collection: { allowed_countries: ["BG"] },
          }
        : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Грешка при създаване на поръчката. Опитайте отново." },
      { status: 500 }
    );
  }
}
