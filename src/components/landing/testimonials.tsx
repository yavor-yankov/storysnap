"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Мария Тодорова",
    role: "Майка на 4-годишен Никола",
    text: "Нямам думи! Когато Никола видя себе си като главния герой, очичките му светнаха! Толкова красива книжка — качеството е невероятно. Поръчваме и за рождения ден!",
    rating: 5,
    city: "София",
  },
  {
    id: 2,
    name: "Иван Петров",
    role: "Баща на 3-годишна Ива",
    text: "Вземах ги за подарък за дъщеря ми. Тя изобщо не искаше да я оставим да си легне — все исках да четем книжката. Илюстрациите са прекрасни и качеството е чудесно.",
    rating: 5,
    city: "Пловдив",
  },
  {
    id: 3,
    name: "Снежана Димитрова",
    role: "Майка на 5-годишния Борис",
    text: "Поръчах за Коледа — напълно го изненадах! Дори не исках да повярвам, че ще е толкова добре направено. Лицето му е перфектно поставено. Много сме доволни!",
    rating: 5,
    city: "Варна",
  },
  {
    id: 4,
    name: "Ана Колева",
    role: "Баба на 2-годишна Ели",
    text: "За рожден ден на внучката — по-хубав подарък не бях намерила. Цялото семейство се разплака от умиление. Книжката е прекрасна, а доставката — бърза!",
    rating: 5,
    city: "Бургас",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1));

  const t = TESTIMONIALS[current];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">
            Отзиви
          </p>
          <h2 className="mt-3 text-3xl font-black text-brand-brown sm:text-4xl">
            Какво казват родителите?
          </h2>
        </div>

        {/* Carousel */}
        <div className="mt-12 flex flex-col items-center">
          <div className="relative w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl bg-brand-beige p-8 shadow-[0_6px_24px_rgba(17,24,39,0.07)] sm:p-10"
              >
                {/* Quote icon */}
                <Quote className="mb-4 h-8 w-8 text-brand-orange/30" />

                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-brand-orange text-brand-orange" />
                  ))}
                </div>

                {/* Text */}
                <blockquote className="mt-4 text-lg font-semibold leading-relaxed text-brand-brown-sub">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/15 text-lg font-black text-brand-orange">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-brand-brown">{t.name}</p>
                    <p className="text-sm text-brand-brown-body">
                      {t.role} · {t.city}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              onClick={prev}
              aria-label="Предишен отзив"
              className="absolute -left-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(17,24,39,0.12)] transition-shadow hover:shadow-[0_6px_18px_rgba(17,24,39,0.18)]"
            >
              <ChevronLeft className="h-5 w-5 text-brand-brown-sub" />
            </button>
            <button
              onClick={next}
              aria-label="Следващ отзив"
              className="absolute -right-5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_12px_rgba(17,24,39,0.12)] transition-shadow hover:shadow-[0_6px_18px_rgba(17,24,39,0.18)]"
            >
              <ChevronRight className="h-5 w-5 text-brand-brown-sub" />
            </button>
          </div>

          {/* Dots */}
          <div className="mt-6 flex gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Отзив ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === current
                    ? "w-6 bg-brand-orange"
                    : "w-2 bg-brand-brown/20 hover:bg-brand-brown/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
