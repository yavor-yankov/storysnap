"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out PicTale",
    badge: null,
    features: [
      "3 free story books",
      "All 6 art styles",
      "8 pages per book",
      "PDF download",
      "Basic support",
    ],
    cta: "Get Started Free",
    ctaHref: "/auth/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per book",
    description: "Create as many books as you want",
    badge: "Most Popular",
    features: [
      "Unlimited story books",
      "All 6 art styles",
      "8-12 pages per book",
      "HD PDF download",
      "Priority AI generation",
      "Priority support",
      "Commercial usage rights",
    ],
    cta: "Start Creating",
    ctaHref: "/auth/signup",
    highlighted: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, pay only when you want more books
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div
                className={`relative rounded-2xl p-8 h-full flex flex-col ${
                  plan.highlighted
                    ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-2xl shadow-purple-300/50 dark:shadow-purple-900/50 scale-105"
                    : "bg-card border border-border shadow-lg"
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-purple-700 border-0 shadow-md px-4">
                    {plan.badge}
                  </Badge>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-foreground"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.highlighted ? "text-purple-100" : "text-muted-foreground"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <span className={`text-5xl font-black ${plan.highlighted ? "text-white" : "text-foreground"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ml-1 ${plan.highlighted ? "text-purple-100" : "text-muted-foreground"}`}>
                    /{plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.highlighted ? "bg-white/20" : "bg-primary/10"
                      }`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? "text-white" : "text-primary"}`} />
                      </div>
                      <span className={`text-sm ${plan.highlighted ? "text-purple-50" : "text-foreground"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={
                    plan.highlighted
                      ? "bg-white text-purple-700 hover:bg-purple-50 font-semibold h-11"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold h-11"
                  }
                >
                  <Link href={plan.ctaHref}>{plan.cta}</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
