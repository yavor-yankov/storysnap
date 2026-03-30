import { NextRequest, NextResponse } from "next/server";
import { MOCK_ADMIN_ORDERS, type AdminOrder } from "@/lib/admin-data";
import { orderStore } from "@/app/api/stripe/webhook/route";

// Merge in-memory Stripe orders with mock seed for dev
function getAllOrders(): AdminOrder[] {
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

  return [...stripeOrders, ...MOCK_ADMIN_ORDERS].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");
  const search = searchParams.get("search")?.toLowerCase();
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  let orders = getAllOrders();

  if (status && status !== "all") {
    orders = orders.filter((o) => o.status === status);
  }
  if (type && type !== "all") {
    orders = orders.filter((o) => o.product_type === type);
  }
  if (search) {
    orders = orders.filter(
      (o) =>
        o.order_number.toLowerCase().includes(search) ||
        o.child_name.toLowerCase().includes(search) ||
        o.customer_email.toLowerCase().includes(search) ||
        o.story_title.toLowerCase().includes(search)
    );
  }

  const total = orders.length;
  const paginated = orders.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ orders: paginated, total, page, limit });
}
