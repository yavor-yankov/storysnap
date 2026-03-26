import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getStripe } from "@/lib/payments/stripe"
import { headers } from "next/headers"

export async function POST(request: Request) {
  const stripe = await getStripe()

  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    )
  }

  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: import("stripe").Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error("Stripe webhook error:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as import("stripe").Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const credits = parseInt(session.metadata?.credits || "0")

    if (userId && credits > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: credits } },
      })

      await prisma.order.create({
        data: {
          userId,
          bookId: session.metadata?.bookId || "credit-purchase",
          amount: session.amount_total || 0,
          currency: session.currency || "usd",
          status: "paid",
          stripePaymentId: session.payment_intent as string,
        },
      }).catch(() => {
        // Order creation is optional - ignore errors
      })
    }
  }

  return NextResponse.json({ received: true })
}
