import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Clock, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoryBySlug, STORY_GRADIENTS } from "@/lib/stories";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const GENDER_LABEL: Record<string, string> = {
  boy: "За момче",
  girl: "За момиче",
  unisex: "За всички",
};

// Sample page spreads (placeholder colors)
const SPREADS = [
  { from: "from-indigo-200", to: "to-purple-300", label: "Страница 1" },
  { from: "from-pink-200", to: "to-rose-300", label: "Страница 2" },
  { from: "from-amber-200", to: "to-orange-300", label: "Страница 3" },
  { from: "from-teal-200", to: "to-cyan-300", label: "Страница 4" },
];

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) notFound();

  const gradient = STORY_GRADIENTS[slug] ?? "from-brand-orange/60 to-brand-gold";

  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Back nav */}
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-brown-body transition-colors hover:text-brand-orange"
        >
          <ArrowLeft className="h-4 w-4" />
          Обратно към книжките
        </Link>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Book cover */}
          <div className="flex items-start justify-center">
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 scale-105 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-gold/20 blur-2xl" />

              {/* Cover */}
              <div
                className="relative h-[420px] w-[290px] overflow-hidden rounded-[8px]"
                style={{ boxShadow: "0 24px 60px rgba(26,12,6,0.22)" }}
              >
                <div className={`h-full w-full bg-gradient-to-br ${gradient}`} />
                {/* Spine */}
                <div className="absolute left-0 top-0 h-full w-4 bg-gradient-to-r from-black/30 to-transparent" />
                <div className="absolute left-4 top-0 h-full w-0.5 bg-white/10" />

                {/* Title overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 pt-12">
                  <p className="text-lg font-extrabold leading-tight text-white">
                    {story.title}
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    {story.age_min}–{story.age_max} год. · {GENDER_LABEL[story.gender]}
                  </p>
                </div>

                {/* NEW badge */}
                {story.is_new && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-black uppercase text-white shadow">
                      Ново
                    </span>
                  </div>
                )}
              </div>

              {/* 5 stars below */}
              <div className="mt-4 flex items-center justify-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand-orange text-brand-orange" />
                ))}
                <span className="ml-1.5 text-sm font-semibold text-brand-brown-body">
                  4.9 (87 отзива)
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-bold text-brand-orange">
                {story.age_min}–{story.age_max} год.
              </span>
              <span className="rounded-full bg-brand-teal-light px-3 py-1 text-xs font-bold text-brand-teal">
                {GENDER_LABEL[story.gender]}
              </span>
              <span className="rounded-full bg-brand-gold/40 px-3 py-1 text-xs font-bold text-brand-brown-sub">
                {story.page_count} стр.
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black leading-tight text-brand-brown sm:text-4xl">
              {story.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-brand-brown-body">
              {story.description}
            </p>

            {/* Features */}
            <div className="mt-6 space-y-3">
              {[
                { icon: BookOpen, text: `${story.page_count} красиво илюстрирани страници` },
                { icon: Star, text: "Лицето на детето поставено в илюстрациите с AI" },
                { icon: Clock, text: "Безплатен преглед за 4–6 страници преди покупка" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10">
                    <Icon className="h-4 w-4 text-brand-orange" />
                  </div>
                  <span className="text-sm font-semibold text-brand-brown-sub">{text}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-brand-gold/30 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-brown-body">
                  Дигитален PDF
                </p>
                <p className="text-2xl font-black text-brand-brown">€9.90</p>
              </div>
              <div className="h-px bg-brand-gold/30 sm:h-10 sm:w-px" />
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-brown-body">
                  Твърда корица (печат)
                </p>
                <p className="text-2xl font-black text-brand-brown">€34.00</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={`/create?story=${story.slug}`} className="flex-1">
                <Button className="group h-13 w-full rounded-[20px] bg-brand-orange text-base font-bold text-white shadow-none transition-all duration-200 hover:bg-brand-orange-hover hover:shadow-lg">
                  ✨ Виж детето си в книжката
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <p className="mt-2 text-center text-xs text-brand-brown-body">
              Безплатен преглед — без кредитна карта. Плащате само ако харесате.
            </p>
          </div>
        </div>

        {/* Sample pages */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-black text-brand-brown">
            Примерни страници
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SPREADS.map((s) => (
              <div key={s.label} className="group relative">
                <div
                  className="relative aspect-[3/4] overflow-hidden rounded-xl transition-transform duration-200 group-hover:-translate-y-1"
                  style={{ boxShadow: "0 6px 18px rgba(17,24,39,0.1)" }}
                >
                  <div className={`h-full w-full bg-gradient-to-br ${s.from} ${s.to}`} />
                  {/* Watermark overlay on sample pages */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rotate-[-30deg] text-sm font-black uppercase tracking-widest text-white/30 select-none">
                      HeroBook
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs font-semibold text-brand-brown-body">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-brand-brown-body">
              Качете снимка и вижте{" "}
              <strong className="text-brand-brown-sub">лицето на вашето дете</strong>{" "}
              на тези страници.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA on mobile */}
      <div className="sticky bottom-0 border-t border-brand-gold/20 bg-white/95 px-4 py-4 backdrop-blur-sm sm:hidden">
        <Link href={`/create?story=${story.slug}`}>
          <Button className="h-12 w-full rounded-[20px] bg-brand-orange text-base font-bold text-white transition-all duration-200 hover:bg-brand-orange-hover">
            ✨ Виж детето си в книжката — безплатно
          </Button>
        </Link>
      </div>
    </div>
  );
}
