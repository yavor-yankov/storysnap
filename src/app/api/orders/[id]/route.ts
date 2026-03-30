import { NextRequest, NextResponse } from "next/server";
import { orderStore } from "@/app/api/stripe/webhook/route";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  // `id` is either a sessionId or orderId
  const order =
    orderStore.get(id) ??
    [...orderStore.values()].find((o) => o.id === id);

  if (!order) {
    // Return a mock order for dev (no webhook fired)
    return NextResponse.json({
      id: "dev-order",
      orderNumber: "BK-20260330-0001",
      status: "complete",
      productType: "digital",
      storyTitle: "Книжката ви",
      childName: "вашето дете",
      amountCents: 990,
      pdfUrl: null,
      createdAt: new Date().toISOString(),
    });
  }

  return NextResponse.json(order);
}
