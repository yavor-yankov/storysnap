import { NextResponse } from "next/server";
import { MOCK_ADMIN_ORDERS, computeAnalytics } from "@/lib/admin-data";
import { orderStore } from "@/app/api/stripe/webhook/route";
import { requireAdminApi } from "@/lib/admin-auth";
import type { AdminOrder } from "@/lib/admin-data";

export async function GET() {
  const authError = await requireAdminApi();
  if (authError) return authError;
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

  // Only include mock orders in development — never in production
  const mockOrders = process.env.NODE_ENV === "development" ? MOCK_ADMIN_ORDERS : [];
  const allOrders = [...stripeOrders, ...mockOrders];
  return NextResponse.json(computeAnalytics(allOrders));
}
