"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const easeOut = [0.0, 0.0, 0.2, 1] as const;

const badges = [
  { icon: Star, text: "500+ щастливи деца" },
  { icon: Shield, text: "30 дни гаранция" },
  { icon: Truck, text: "Безплатна доставка" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-beige">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-orange/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-[400px] w-[400px] rounded-full bg-brand-gold/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text content */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: easeOut, delay: 0 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-orange/10 px-4 py-1.5"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-orange" />
              <span className="text-sm font-bold text-brand-orange">
                Произведено в България
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: easeOut, delay: 0.1 }}
              className="text-4xl font-black leading-tight tracking-tight text-brand-brown sm:text-5xl lg:text-6xl"
            >
              Направи{" "}
              <span className="relative inline-block">
                <span className="relative z-10">ДЕТЕТО</span>
                <span
                  aria-hidden
                  className="absolute bottom-1 left-0 z-0 h-3 w-full rounded bg-brand-gold"
                />
              </span>{" "}
              си{" "}
              <span className="text-brand-orange">ГЕРОЯ</span>
              <br />
              на своята книжка!
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: easeOut, delay: 0.2 }}
              className="mt-5 max-w-lg text-lg leading-relaxed text-brand-brown-body"
            >
              Детето ви открива, че{" "}
              <strong className="font-bold text-brand-brown-sub">то е героят</strong>.
              Усмивката? Безценна. Качете снимка и получете персонализирана
              книжка с лицето на вашето дете.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: easeOut, delay: 0.3 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link href="/stories">
                <Button
                  size="lg"
                  className="group h-12 w-full rounded-[20px] bg-brand-orange px-7 text-base font-bold text-white shadow-none transition-all duration-200 hover:bg-brand-orange-hover hover:shadow-lg sm:w-auto"
                >
                  Виж книжките
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-12 w-full rounded-[20px] border border-brand-orange/30 font-semibold text-brand-orange transition-all duration-200 hover:border-brand-orange hover:bg-brand-orange/5 sm:w-auto"
                >
                  Как работи?
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: easeOut, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              {badges.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-brand-orange" />
                  <span className="text-sm font-semibold text-brand-brown-sub">
                    {text}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Book mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.15 }}
            className="relative flex items-center justify-center"
          >
            {/* Glow behind books */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-orange/15 via-brand-gold/20 to-brand-pink/15 blur-2xl"
            />

            {/* Book stack mockup */}
            <div className="relative flex items-end justify-center gap-3">
              {/* Back book */}
              <div
                aria-hidden
                className="relative h-[340px] w-[220px] -translate-y-4 overflow-hidden rounded-[8px] shadow-xl"
                style={{
                  transform: "rotate(-6deg) translateY(-16px)",
                  boxShadow: "0 20px 50px rgba(26,12,6,0.2)",
                }}
              >
                <div className="h-full w-full bg-gradient-to-br from-brand-purple/60 to-brand-teal/60" />
                <div className="absolute left-0 top-0 h-full w-3 bg-black/20" />
              </div>

              {/* Front book */}
              <div
                className="relative h-[380px] w-[245px] overflow-hidden rounded-[8px]"
                style={{ boxShadow: "0 24px 60px rgba(26,12,6,0.25)" }}
              >
                <div className="h-full w-full bg-gradient-to-br from-brand-orange/80 via-brand-gold to-brand-yellow" />
                <div className="absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-black/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6">
                  <div className="mb-2 h-2 w-24 rounded-full bg-white/60" />
                  <div className="h-2 w-16 rounded-full bg-white/40" />
                </div>
                <div className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-center shadow-md">
                  <span className="text-xs font-black leading-tight text-white">
                    МОЯ
                    <br />
                    КНИГА
                  </span>
                </div>
              </div>
            </div>

            {/* Floating label — bottom left */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: [0.45, 0, 0.55, 1] as const }}
              className="absolute -bottom-4 left-4 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(17,24,39,0.12)]"
            >
              <p className="text-xs font-semibold text-brand-brown-sub">
                ✨ Персонализирана само за
              </p>
              <p className="text-sm font-black text-brand-brown">Вашето дете</p>
            </motion.div>

            {/* Floating label — top right */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: [0.45, 0, 0.55, 1] as const, delay: 0.5 }}
              className="absolute -right-2 top-8 rounded-2xl bg-white px-4 py-3 shadow-[0_8px_24px_rgba(17,24,39,0.12)]"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br from-brand-orange/60 to-brand-gold"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex text-brand-orange">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-brand-brown-body">500+ родители</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
