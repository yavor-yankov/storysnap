"use client";

import { useState, Suspense, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhotoUpload } from "@/components/create/photo-upload";
import { getStoryBySlug } from "@/lib/stories";
import type { GeneratedPage } from "@/types";

interface UploadedPhoto {
  file: File;
  preview: string;
  url?: string;
  uploading: boolean;
  error?: string;
}

type Step = "info" | "upload" | "generating" | "preview";

const STEPS: { id: Step; label: string }[] = [
  { id: "info", label: "Данни" },
  { id: "upload", label: "Снимка" },
  { id: "generating", label: "Генерация" },
  { id: "preview", label: "Преглед" },
];

function CreatePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const storySlug = searchParams.get("story") ?? "";
  const story = getStoryBySlug(storySlug);

  const [step, setStep] = useState<Step>("info");
  const [email, setEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [previewPages, setPreviewPages] = useState<GeneratedPage[]>([]);
  const [previewPageIdx, setPreviewPageIdx] = useState(0);

  // Pre-started generation promise — fires as soon as photo is uploaded
  const generationPromiseRef = useRef<Promise<Response> | null>(null);
  const generationStartedForRef = useRef<string>(""); // tracks which photoUrl we started for

  const currentStepIdx = STEPS.findIndex((s) => s.id === step);

  // Start generation in background the moment a photo finishes uploading
  useEffect(() => {
    const uploaded = photos.filter((p) => p.url && !p.uploading && !p.error);
    if (uploaded.length === 0 || !email || !childName) return;

    const photoUrls = uploaded.map((p) => p.url as string);
    const key = photoUrls.join(",");
    if (generationStartedForRef.current === key) return; // already started for these photos

    generationStartedForRef.current = key;
    generationPromiseRef.current = fetch("/api/preview/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, childName, storySlug, photoUrls }),
    });
  }, [photos, email, childName, storySlug]);

  function validateInfo() {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Въведете валиден имейл адрес.");
      return false;
    }
    if (!childName.trim()) {
      setError("Въведете името на детето.");
      return false;
    }
    setError("");
    return true;
  }

  function validateUpload() {
    const uploaded = photos.filter((p) => !p.uploading && !p.error && p.url);
    if (uploaded.length === 0) {
      setError("Качете поне една снимка преди да продължите.");
      return false;
    }
    setError("");
    return true;
  }

  async function startGeneration() {
    setStep("generating");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => (p >= 92 ? (clearInterval(interval), 92) : p + Math.random() * 6));
    }, 600);

    try {
      // Use the pre-started promise if available, otherwise start fresh
      const photoUrls = photos.filter((p) => p.url).map((p) => p.url as string);
      const fetchPromise =
        generationPromiseRef.current ??
        fetch("/api/preview/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, childName, storySlug, photoUrls }),
        });

      const res = await fetchPromise;
      clearInterval(interval);
      setProgress(100);

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Нещо се обърка. Опитайте отново.");
        setStep("upload");
        return;
      }

      await new Promise((r) => setTimeout(r, 400));
      setPreviewPages(data.pages);
      setStep("preview");
    } catch {
      clearInterval(interval);
      setError("Нещо се обърка. Опитайте отново.");
      setStep("upload");
    }
  }

  if (!story) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-brand-brown">
            Книжката не е намерена.
          </p>
          <Button
            className="mt-4 rounded-[20px] bg-brand-orange text-white"
            onClick={() => router.push("/stories")}
          >
            Виж всички книжки
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
        {/* Back */}
        {step !== "generating" && step !== "preview" && (
          <button
            onClick={() =>
              step === "info"
                ? router.push(`/stories/${storySlug}`)
                : setStep("info")
            }
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-brown-body hover:text-brand-orange"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </button>
        )}

        {/* Stepper */}
        {step !== "preview" && (
          <div className="mb-8 flex items-center gap-2">
            {STEPS.filter((s) => s.id !== "preview").map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${
                    i <= currentStepIdx
                      ? "bg-brand-orange text-white"
                      : "bg-brand-gold/30 text-brand-brown-body"
                  }`}
                >
                  {i < currentStepIdx ? "✓" : i + 1}
                </div>
                <span
                  className={`hidden text-xs font-semibold sm:block ${
                    i === currentStepIdx ? "text-brand-brown" : "text-brand-brown-body"
                  }`}
                >
                  {s.label}
                </span>
                {i < STEPS.filter((s) => s.id !== "preview").length - 1 && (
                  <div className="h-px w-8 bg-brand-gold/30 sm:w-12" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Story info strip */}
        {step !== "preview" && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_4px_12px_rgba(17,24,39,0.07)]">
            <div className="h-12 w-10 shrink-0 rounded-[6px] bg-gradient-to-br from-brand-orange/70 to-brand-gold" />
            <div>
              <p className="text-xs font-semibold text-brand-brown-body">Избрана книжка</p>
              <p className="text-sm font-black text-brand-brown">{story.title}</p>
            </div>
          </div>
        )}

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-3xl bg-white p-6 shadow-[0_6px_24px_rgba(17,24,39,0.08)]">
                <h1 className="text-xl font-black text-brand-brown">
                  Данни за книжката
                </h1>
                <p className="mt-1 text-sm text-brand-brown-body">
                  Ще използваме тези данни, за да персонализираме историята.
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label className="font-semibold text-brand-brown-sub">
                      Вашият имейл
                    </Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vashiyat@email.com"
                      className="mt-1.5 rounded-xl border-brand-brown/20 focus:border-brand-orange"
                    />
                    <p className="mt-1 text-xs text-brand-brown-body">
                      Ще изпратим прегледа тук. Не изпращаме спам.
                    </p>
                  </div>
                  <div>
                    <Label className="font-semibold text-brand-brown-sub">
                      Името на детето
                    </Label>
                    <Input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="Ивана, Никола..."
                      className="mt-1.5 rounded-xl border-brand-brown/20 focus:border-brand-orange"
                    />
                    <p className="mt-1 text-xs text-brand-brown-body">
                      Ще се появи в историята.
                    </p>
                  </div>
                </div>

                {error && (
                  <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                <Button
                  onClick={() => {
                    if (validateInfo()) setStep("upload");
                  }}
                  className="mt-6 h-12 w-full rounded-[20px] bg-brand-orange font-bold text-white hover:bg-brand-orange-hover"
                >
                  Напред — Качи снимка
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="rounded-3xl bg-white p-6 shadow-[0_6px_24px_rgba(17,24,39,0.08)]">
                <h1 className="text-xl font-black text-brand-brown">
                  Качете снимка на {childName}
                </h1>
                <p className="mt-1 text-sm text-brand-brown-body">
                  Качете 1–2 снимки за по-добър резултат.
                </p>

                <div className="mt-5">
                  <PhotoUpload photos={photos} onChange={setPhotos} maxPhotos={2} />
                </div>

                {error && (
                  <p className="mt-4 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}

                <Button
                  onClick={() => {
                    if (validateUpload()) startGeneration();
                  }}
                  className="mt-6 h-12 w-full rounded-[20px] bg-brand-orange font-bold text-white hover:bg-brand-orange-hover"
                  disabled={photos.some((p) => p.uploading)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Генерирай безплатен преглед
                </Button>
                <p className="mt-2 text-center text-xs text-brand-brown-body">
                  Отнема около 20–40 секунди · Напълно безплатно
                </p>
              </div>
            </motion.div>
          )}

          {step === "generating" && (
            <GeneratingStep childName={childName} progress={progress} />
          )}

          {step === "preview" && previewPages.length > 0 && (
            <PreviewStep
              pages={previewPages}
              childName={childName}
              storyTitle={story.title}
              storySlug={storySlug}
              currentIdx={previewPageIdx}
              onIdxChange={setPreviewPageIdx}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const AI_MESSAGES = [
  "Анализираме чертите на лицето...",
  "Разпознаваме очите и усмивката...",
  "Изграждаме уникален профил...",
  "Поставяме лицето в илюстрациите...",
  "Рисуваме в акварелен стил...",
  "Добавяме магически детайли...",
  "Оцветяваме страниците...",
  "Проверяваме всяка страница...",
  "Финални щрихи...",
  "Почти готово...",
];

function GeneratingStep({ childName, progress }: { childName: string; progress: number }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setDone((prev) => [...prev, AI_MESSAGES[msgIdx]]);
        setMsgIdx((i) => (i + 1) % AI_MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 2200);
    return () => clearInterval(cycle);
  }, [msgIdx]);

  return (
    <motion.div
      key="generating"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="py-6 text-center"
    >
      <div className="mb-5 flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-brand-orange/10">
        <Sparkles className="h-10 w-10 animate-pulse text-brand-orange" />
      </div>
      <h2 className="text-xl font-black text-brand-brown">Магията работи...</h2>
      <p className="mt-1 text-sm text-brand-brown-body">
        Поставяме лицето на {childName} в книжката
      </p>

      {/* Progress bar */}
      <div className="mt-6 overflow-hidden rounded-full bg-brand-gold/30 h-2.5">
        <motion.div
          className="h-full rounded-full bg-brand-orange"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <p className="mt-2 text-xs font-semibold text-brand-brown/40">{Math.round(progress)}%</p>

      {/* AI message feed */}
      <div className="mt-6 mx-auto max-w-xs space-y-1.5 text-left">
        {done.slice(-3).map((msg, i) => (
          <div key={msg + i} className="flex items-center gap-2 text-sm text-brand-brown/50">
            <span className="text-green-500 font-bold">✓</span>
            <span className="line-through">{msg}</span>
          </div>
        ))}
        <motion.div
          key={AI_MESSAGES[msgIdx]}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-sm font-semibold text-brand-brown"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-brand-orange animate-pulse" />
          {AI_MESSAGES[msgIdx]}
        </motion.div>
      </div>
    </motion.div>
  );
}

const MOCK_GRADIENTS: Record<string, string> = {
  "kosmichesko-priklyuchenie": "from-indigo-300 to-purple-400",
  "printsesata-ot-izgreva": "from-pink-300 to-rose-400",
  "supergerojski-den": "from-blue-300 to-cyan-400",
  "v-dzhunglata-na-priyatelite": "from-green-300 to-emerald-400",
  "malkiyat-gotvach": "from-orange-300 to-amber-400",
  "piratite-na-cherno-more": "from-slate-400 to-teal-400",
  "feyata-na-gorite": "from-purple-200 to-pink-300",
  "dinozavarat-priyatel": "from-lime-300 to-green-400",
};

function PreviewStep({
  pages,
  childName,
  storyTitle,
  storySlug,
  currentIdx,
  onIdxChange,
}: {
  pages: GeneratedPage[];
  childName: string;
  storyTitle: string;
  storySlug: string;
  currentIdx: number;
  onIdxChange: (i: number) => void;
}) {
  const page = pages[currentIdx];
  const isMock = page.image_url.startsWith("mock:");
  const gradient = MOCK_GRADIENTS[storySlug] ?? "from-brand-orange/40 to-brand-gold/40";

  const prev = useCallback(() => onIdxChange(Math.max(0, currentIdx - 1)), [currentIdx, onIdxChange]);
  const next = useCallback(() => onIdxChange(Math.min(pages.length - 1, currentIdx + 1)), [currentIdx, pages.length, onIdxChange]);

  // Keyboard arrow navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Header */}
      <div className="mb-5 text-center">
        <h2 className="text-2xl font-black text-brand-brown">
          🎉 Ето {childName} в книжката!
        </h2>
        <p className="mt-1 text-sm text-brand-brown-body">{storyTitle}</p>
      </div>

      {/* Page viewer with side arrows */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={prev}
          disabled={currentIdx === 0}
          className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-30 hover:bg-gray-50 transition-all"
          aria-label="Предишна страница"
        >
          <ChevronLeft className="h-5 w-5 text-brand-brown" />
        </button>

        {/* Right arrow */}
        <button
          onClick={next}
          disabled={currentIdx === pages.length - 1}
          className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md disabled:opacity-30 hover:bg-gray-50 transition-all"
          aria-label="Следваща страница"
        >
          <ChevronRight className="h-5 w-5 text-brand-brown" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_32px_rgba(17,24,39,0.1)]"
          >
            {/* Page image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              {isMock ? (
                <div className={`h-full w-full bg-gradient-to-br ${gradient}`} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={page.image_url}
                  alt={`Страница ${currentIdx + 1}`}
                  className="h-full w-full object-cover"
                />
              )}

              {/* Watermark */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="rotate-[-30deg] select-none text-center">
                  <p className="text-2xl font-black uppercase tracking-widest text-white/25">
                    HeroBook
                  </p>
                  <p className="text-sm font-bold uppercase tracking-widest text-white/20">
                    Безплатен преглед
                  </p>
                </div>
              </div>

              {/* Page counter */}
              <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                {currentIdx + 1} / {pages.length}
              </div>
            </div>

            {/* Page text */}
            <div className="border-t border-brand-gold/20 bg-brand-beige/50 px-6 py-4">
              <p className="text-center text-sm font-semibold leading-relaxed text-brand-brown-sub italic">
                {page.text_content}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots + swipe hint */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => onIdxChange(i)}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === currentIdx ? "w-6 bg-brand-orange" : "w-2 bg-brand-brown/20 hover:bg-brand-brown/40"
              }`}
              aria-label={`Страница ${i + 1}`}
            />
          ))}
        </div>
        <p className="text-xs text-brand-brown/40">← → за навигация</p>
      </div>

      {/* CTA */}
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-[0_4px_16px_rgba(17,24,39,0.07)]">
        <p className="text-center text-sm font-semibold text-brand-brown-sub">
          Харесвате как изглежда? Вземете пълната версия:
        </p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a href={`/order?story=${storySlug}&type=digital`}>
            <Button className="h-12 w-full rounded-[20px] bg-brand-orange font-bold text-white hover:bg-brand-orange-hover">
              📄 PDF — €9.90
            </Button>
          </a>
          <a href={`/order?story=${storySlug}&type=physical`}>
            <Button
              variant="outline"
              className="h-12 w-full rounded-[20px] border-brand-orange/50 font-bold text-brand-orange hover:border-brand-orange hover:bg-brand-orange hover:text-white"
            >
              📦 Твърда корица — €34.00
            </Button>
          </a>
        </div>
        <p className="mt-3 text-center text-xs text-brand-brown-body">
          🇧🇬 Произведено в България · 30 дни гаранция · Безплатна доставка
        </p>
      </div>
    </motion.div>
  );
}

export default function CreatePage() {
  return (
    <Suspense>
      <CreatePageInner />
    </Suspense>
  );
}
