import { NextRequest, NextResponse } from "next/server";
import { MOCK_ADMIN_ORDERS } from "@/lib/admin-data";
import { orderStore } from "@/app/api/stripe/webhook/route";
import { requireAdminApi } from "@/lib/admin-auth";
import { z } from "zod";

// In-memory patch store for mock orders (dev)
const patchStore = new Map<string, Record<string, unknown>>();

const patchSchema = z.object({
  status: z
    .enum(["paid", "generating", "complete", "shipped", "delivered", "refunded"])
    .optional(),
  tracking_number: z.string().optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const { id } = await params;

  // Check Stripe orderStore first
  const stripeOrder = [...orderStore.values()].find(
    (o) => o.id === id || o.orderNumber === id
  );
  if (stripeOrder) {
    return NextResponse.json(stripeOrder);
  }

  // Then mock data
  const mock = MOCK_ADMIN_ORDERS.find((o) => o.id === id);
  if (!mock) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const patched = { ...mock, ...(patchStore.get(id) ?? {}) };
  return NextResponse.json(patched);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const authError = await requireAdminApi();
  if (authError) return authError;

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const updates = parsed.data;

  // Update Stripe orderStore if found
  const stripeOrder = [...orderStore.values()].find((o) => o.id === id);
  if (stripeOrder) {
    if (updates.status) stripeOrder.status = updates.status;
    return NextResponse.json({ success: true });
  }

  // Update mock patchStore
  const existing = MOCK_ADMIN_ORDERS.find((o) => o.id === id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const current = patchStore.get(id) ?? {};
  patchStore.set(id, { ...current, ...updates, updated_at: new Date().toISOString() });

  return NextResponse.json({ success: true });
}
