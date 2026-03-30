"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-brand-beige py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-orange via-[#ff8f5e] to-[#ffa57a] px-8 py-14 text-center shadow-[0_24px_60px_rgba(255,114,59,0.3)] sm:px-16 lg:py-20"
        >
          {/* Decorative circles */}
          <div aria-hidden className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div aria-hidden className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-white/8" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold text-white">
              <Sparkles className="h-4 w-4" />
              Безплатен преглед — без кредитна карта
            </span>

            <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              Изненадайте детето си
              <br />
              с магическа книжка
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85">
              Качете снимка и вижте как детето ви се превръща в главния герой —
              напълно безплатно. Без регистрация. Само вълшебство.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/stories">
                <Button
                  size="lg"
                  className="group h-12 w-full rounded-[20px] bg-white px-8 text-base font-bold text-brand-orange shadow-none transition-all duration-200 hover:bg-brand-beige hover:shadow-lg sm:w-auto"
                >
                  Започни безплатно
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/65">
              🇧🇬 Произведено в България · 30 дни гаранция · Безплатна доставка
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
