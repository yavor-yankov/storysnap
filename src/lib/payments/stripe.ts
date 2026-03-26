// Stripe client - configured for test mode
// Set STRIPE_SECRET_KEY in .env.local for real payments

let stripeInstance: import("stripe").default | null = null

export async function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn("STRIPE_SECRET_KEY not configured - payment features disabled")
    return null
  }

  if (!stripeInstance) {
    const Stripe = (await import("stripe")).default
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-03-25.dahlia",
    })
  }

  return stripeInstance
}

export const CREDIT_PACKAGES = [
  { credits: 3, price: 999, label: "3 Books", priceLabel: "$9.99" },
  { credits: 10, price: 2499, label: "10 Books", priceLabel: "$24.99" },
  { credits: 25, price: 4999, label: "25 Books", priceLabel: "$49.99" },
]
