import { NextRequest, NextResponse } from "next/server";
import { orderStore } from "@/app/api/stripe/webhook/route";
import { createServiceClient } from "@/lib/supabase/server";
import { resolveSignedPdfUrl } from "@/lib/pdf/signed-url";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);

  // Caller must supply the email used at checkout.
  // Prevents enumeration even if a session_id leaks via referrer headers.
  const email = searchParams.get("email")?.toLowerCase().trim();
  const isDev = process.env.NODE_ENV === "development";

  // 1. Try Supabase first (persistent, authoritative)
  try {
    const supabase = createServiceClient();
    const { data: order } = await supabase
      .from("orders")
      .select("id, order_number, status, product_type, child_name, customer_email, amount_cents, pdf_url, created_at, story_id")
      .or(`stripe_session_id.eq.${id},id.eq.${id}`)
      .maybeSingle();

    if (order) {
      // Verify ownership via email (skip in dev for ease of testing)
      if (!isDev && email !== order.customer_email?.toLowerCase()) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const { data: story } = await supabase
        .from("stories")
        .select("title")
        .eq("id", order.story_id)
        .maybeSingle();

      const storyTitle = story?.title ?? "Вашата книжка";
      const pdfUrl = await resolveSignedPdfUrl(order.pdf_url, 3600, order.child_name, storyTitle);

      return NextResponse.json({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        productType: order.product_type,
        storyTitle,
        childName: order.child_name,
        amountCents: order.amount_cents,
        pdfUrl,
        createdAt: order.created_at,
      });
    }
  } catch (dbErr) {
    console.warn("Order DB lookup failed:", dbErr);
  }

  // 2. Fall back to in-memory store (dev / immediate post-webhook polling)
  const memOrder =
    orderStore.get(id) ??
    [...orderStore.values()].find((o) => o.id === id);

  if (memOrder) {
    if (!isDev && email !== memOrder.customerEmail?.toLowerCase()) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pdfUrl = await resolveSignedPdfUrl(memOrder.pdfUrl ?? null, 3600, memOrder.childName, memOrder.storyTitle);

    return NextResponse.json({
      id: memOrder.id,
      orderNumber: memOrder.orderNumber,
      status: memOrder.status,
      productType: memOrder.productType,
      storyTitle: memOrder.storyTitle,
      childName: memOrder.childName,
      amountCents: memOrder.amountCents,
      pdfUrl,
      createdAt: memOrder.createdAt,
    });
  }

  return NextResponse.json({ error: "Order not found" }, { status: 404 });
}
