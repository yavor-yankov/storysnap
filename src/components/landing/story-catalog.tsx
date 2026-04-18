"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StoryFilters } from "@/types";

// Placeholder story data (will come from Supabase)
const PLACEHOLDER_STORIES = [
  { id: "1", title: "Космическото приключение", slug: "kosmichesko-priklyuchenie", ageMin: 3, ageMax: 7, gender: "unisex", isNew: true, coverColor: "from-indigo-400 to-purple-500" },
  { id: "2", title: "Принцесата от Изгрева", slug: "printsesata-ot-izgreva", ageMin: 2, ageMax: 6, gender: "girl", isNew: false, coverColor: "from-pink-400 to-rose-500" },
  { id: "3", title: "Суперхеройски ден", slug: "supergerojski-den", ageMin: 3, ageMax: 8, gender: "boy", isNew: false, coverColor: "from-blue-500 to-cyan-400" },
  { id: "4", title: "В джунглата на приятелите", slug: "v-dzhunglata-na-priyatelite", ageMin: 0, ageMax: 4, gender: "unisex", isNew: false, coverColor: "from-green-400 to-emerald-500" },
  { id: "5", title: "Малкият готвач", slug: "malkiyat-gotvach", ageMin: 2, ageMax: 5, gender: "unisex", isNew: true, coverColor: "from-orange-400 to-amber-500" },
  { id: "6", title: "Пиратите на Черно море", slug: "piratite-na-cherno-more", ageMin: 4, ageMax: 8, gender: "boy", isNew: false, coverColor: "from-slate-600 to-teal-500" },
  { id: "7", title: "Феята на горите", slug: "feyata-na-gorite", ageMin: 2, ageMax: 5, gender: "girl", isNew: false, coverColor: "from-purple-300 to-pink-400" },
  { id: "8", title: "Динозавърът приятел", slug: "dinozavarat-priyatel", ageMin: 1, ageMax: 5, gender: "unisex", isNew: true, coverColor: "from-lime-400 to-green-500" },
];

const AGE_FILTERS: { label: string; value: StoryFilters["ageGroup"] }[] = [
  { label: "Всички", value: "all" },
  { label: "0–2 год.", value: "0-2" },
  { label: "2–4 год.", value: "2-4" },
  { label: "4–6 год.", value: "4-6" },
];

const GENDER_FILTERS: { label: string; value: StoryFilters["gender"] }[] = [
  { label: "Всички", value: "all" },
  { label: "За момче", value: "boy" },
  { label: "За момиче", value: "girl" },
];

function StoryCard({ story }: { story: (typeof PLACEHOLDER_STORIES)[0] }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="group relative"
    >
      {/* NEW badge */}
      {story.isNew && (
        <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-brand-red px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow">
          Ново
        </span>
      )}

      {/* Book card */}
      <div
        className="relative overflow-hidden rounded-[8px] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_rgba(17,24,39,0.15)]"
        style={{
          aspectRatio: "223/324",
          boxShadow: "0 6px 18px 0 rgba(17,24,39,0.08)",
        }}
      >
        {/* Cover gradient (placeholder until real images) */}
        <div className={`h-full w-full bg-gradient-to-br ${story.coverColor}`} />

        {/* Book spine effect */}
        <div className="absolute left-0 top-0 h-full w-3 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
        <div className="absolute left-3 top-0 h-full w-0.5 bg-white/10" />

        {/* Age badge */}
        <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-brand-brown-sub shadow-sm">
          {story.ageMin}–{story.ageMax} год.
        </div>

        {/* Title overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent p-3 pt-8">
          <p className="text-xs font-extrabold leading-tight text-white">
            {story.title}
          </p>
        </div>
      </div>

      {/* CTA button below card */}
      <Link href={`/stories/${story.slug}`}>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full rounded-[16px] border-brand-orange/40 font-semibold text-brand-orange transition-all duration-200 hover:border-brand-orange hover:bg-brand-orange hover:text-white"
        >
          Виж детето си тук
        </Button>
      </Link>
    </motion.div>
  );
}

export function StoryCatalog() {
  const [filters, setFilters] = useState<StoryFilters>({
    ageGroup: "all",
    gender: "all",
    tag: null,
  });

  const filtered = PLACEHOLDER_STORIES.filter((s) => {
    const ageOk =
      filters.ageGroup === "all"
        ? true
        : filters.ageGroup === "0-2"
        ? s.ageMin <= 2 && s.ageMax >= 0
        : filters.ageGroup === "2-4"
        ? s.ageMin <= 4 && s.ageMax >= 2
        : s.ageMin <= 6 && s.ageMax >= 4;
    const genderOk =
      filters.gender === "all" ||
      s.gender === filters.gender ||
      s.gender === "unisex";
    return ageOk && genderOk;
  });

  return (
    <section id="catalog" className="bg-brand-beige py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-brand-orange">
              Каталог
            </p>
            <h2 className="mt-2 text-3xl font-black text-brand-brown sm:text-4xl">
              Избери книжка
            </h2>
          </div>
          <Link
            href="/stories"
            className="group flex items-center gap-1 text-sm font-bold text-brand-orange transition-opacity hover:opacity-80"
          >
            Виж всички
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap items-center gap-6">
          {/* Age filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-brown-body">
              Възраст:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {AGE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilters((prev) => ({ ...prev, ageGroup: f.value }))}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${
                    filters.ageGroup === f.value
                      ? "bg-brand-orange text-white shadow-sm"
                      : "bg-white text-brand-brown-sub hover:bg-brand-gold/30"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gender filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-brown-body">
              За:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {GENDER_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilters((prev) => ({ ...prev, gender: f.value }))}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150 ${
                    filters.gender === f.value
                      ? "bg-brand-orange text-white shadow-sm"
                      : "bg-white text-brand-brown-sub hover:bg-brand-gold/30"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="mt-16 py-12 text-center">
            <p className="text-lg font-semibold text-brand-brown-body">
              Няма книжки за тези филтри.
            </p>
            <button
              onClick={() => setFilters({ ageGroup: "all", gender: "all", tag: null })}
              className="mt-4 text-sm font-bold text-brand-orange underline"
            >
              Изчисти филтрите
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
