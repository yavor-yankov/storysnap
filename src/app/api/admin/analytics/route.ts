import { NextResponse } from "next/server";
import { MOCK_ADMIN_ORDERS, computeAnalytics } from "@/lib/admin-data";
import { orderStore } from "@/app/api/stripe/webhook/route";
import type { AdminOrder } from "@/lib/admin-data";

export async function GET() {
  const stripeOrders: AdminOrder[] = [...orderStore.values()].map((o) => ({
    id: o.id,
    order_number: o.orderNumber,
    story_title: o.storyTitle,
    story_slug: o.storySlug,
    child_name: o.childName,
    customer_email: o.customerEmail,
    product_type: o.productType as "digital" | "physical",
    status: o.status as AdminOrder["status"],
    amount_cents: o.amountCents,
    currency: "EUR",
    pdf_url: o.pdfUrl ?? null,
    tracking_number: null,
    shipping_address: null,
    created_at: o.createdAt,
    updated_at: o.createdAt,
  }));

  const allOrders = [...stripeOrders, ...MOCK_ADMIN_ORDERS];
  return NextResponse.json(computeAnalytics(allOrders));
}
