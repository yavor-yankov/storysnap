"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CreationStepper } from "./CreationStepper"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"
import type { ArtStyle } from "@/types"

const artStyles: Array<{
  id: ArtStyle
  name: string
  emoji: string
  description: string
  gradient: string
  bg: string
  border: string
  selectedBg: string
}> = [
  {
    id: "comic",
    name: "Comic Book",
    emoji: "💥",
    description: "Bold lines, halftone dots, superhero vibes",
    gradient: "from-red-500 to-orange-500",
    bg: "bg-red-50 dark:bg-red-950/20",
    border: "border-red-200 dark:border-red-800",
    selectedBg: "bg-red-100 dark:bg-red-900/30",
  },
  {
    id: "anime",
    name: "Anime",
    emoji: "✨",
    description: "Japanese animation with expressive characters",
    gradient: "from-pink-500 to-rose-500",
    bg: "bg-pink-50 dark:bg-pink-950/20",
    border: "border-pink-200 dark:border-pink-800",
    selectedBg: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    id: "watercolor",
    name: "Watercolor",
    emoji: "🎨",
    description: "Soft painterly style with artistic washes",
    gradient: "from-cyan-500 to-teal-500",
    bg: "bg-cyan-50 dark:bg-cyan-950/20",
    border: "border-cyan-200 dark:border-cyan-800",
    selectedBg: "bg-cyan-100 dark:bg-cyan-900/30",
  },
  {
    id: "storybook",
    name: "Storybook",
    emoji: "📖",
    description: "Classic children's book illustration style",
    gradient: "from-amber-500 to-yellow-500",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800",
    selectedBg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    id: "pop-art",
    name: "Pop Art",
    emoji: "🎭",
    description: "Bold Warhol-inspired graphics with vivid colors",
    gradient: "from-purple-500 to-violet-500",
    bg: "bg-purple-50 dark:bg-purple-950/20",
    border: "border-purple-200 dark:border-purple-800",
    selectedBg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "pixel",
    name: "Pixel Art",
    emoji: "🕹️",
    description: "Retro game-inspired 8-bit pixel graphics",
    gradient: "from-green-500 to-emerald-500",
    bg: "bg-green-50 dark:bg-green-950/20",
    border: "border-green-200 dark:border-green-800",
    selectedBg: "bg-green-100 dark:bg-green-900/30",
  },
]

export function StyleSelector() {
  const router = useRouter()
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle | null>(null)

  function handleContinue() {
    if (!selectedStyle) return
    sessionStorage.setItem("artStyle", selectedStyle)
    router.push("/create/generate")
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <CreationStepper currentStep={2} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Choose Your Art Style</h1>
          <p className="text-muted-foreground">
            Pick the visual style for your illustrated story book
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {artStyles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <button
                onClick={() => setSelectedStyle(style.id)}
                className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 relative ${
                  selectedStyle === style.id
                    ? `${style.selectedBg} border-current shadow-lg scale-[1.02]`
                    : `${style.bg} ${style.border} hover:scale-[1.01] hover:shadow-md`
                }`}
                style={{
                  borderColor: selectedStyle === style.id ? undefined : undefined,
                }}
              >
                {selectedStyle === style.id && (
                  <div className={`absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center text-3xl mb-3 shadow-md`}>
                  {style.emoji}
                </div>
                <h3 className="font-bold text-foreground mb-1">{style.name}</h3>
                <p className="text-sm text-muted-foreground">{style.description}</p>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-11 px-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedStyle}
            className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium"
          >
            Generate My Book
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
