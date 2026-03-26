"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CreationStepper } from "./CreationStepper"
import { BookOpen, Sparkles, Image as ImageIcon, FileText, Wand2 } from "lucide-react"

const generationSteps = [
  { id: "analyzing", label: "Analyzing your portrait", icon: Sparkles, duration: 1500 },
  { id: "character", label: "Creating your character", icon: Wand2, duration: 2000 },
  { id: "story", label: "Writing your story", icon: FileText, duration: 2500 },
  { id: "illustrations", label: "Generating illustrations", icon: ImageIcon, duration: 3000 },
  { id: "assembling", label: "Assembling your book", icon: BookOpen, duration: 1500 },
]

export function GeneratePage() {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const portraitUrl = sessionStorage.getItem("portraitUrl")
    const artStyle = sessionStorage.getItem("artStyle")
    const characterName = sessionStorage.getItem("characterName")

    if (!portraitUrl || !artStyle || !characterName) {
      router.push("/create/upload")
      return
    }

    startGeneration(portraitUrl, artStyle, characterName)
  }, [])

  async function startGeneration(portraitUrl: string, artStyle: string, characterName: string) {
    setGenerating(true)
    setStarted(true)

    // Start animated progress
    animateProgress()

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portraitUrl, artStyle, characterName }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Generation failed")
        setGenerating(false)
        return
      }

      const bookId = data.bookId

      // Poll for completion
      let attempts = 0
      const maxAttempts = 30

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const statusRes = await fetch(`/api/books/${bookId}`)
        if (statusRes.ok) {
          const statusData = await statusRes.json()
          const book = statusData.book

          if (book.status === "complete") {
            // Clear session storage
            sessionStorage.removeItem("portraitUrl")
            sessionStorage.removeItem("artStyle")
            sessionStorage.removeItem("characterName")

            setProgress(100)
            setCurrentStepIndex(generationSteps.length - 1)

            await new Promise((resolve) => setTimeout(resolve, 500))
            router.push(`/create/preview?bookId=${bookId}`)
            return
          } else if (book.status === "failed") {
            setError("Book generation failed. Please try again.")
            setGenerating(false)
            return
          }
        }

        attempts++
      }

      setError("Generation timed out. Please try again.")
      setGenerating(false)
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
      setGenerating(false)
    }
  }

  function animateProgress() {
    let totalTime = 0
    const totalDuration = generationSteps.reduce((acc, s) => acc + s.duration, 0)

    generationSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStepIndex(index)
      }, totalTime)

      totalTime += step.duration

      // Animate progress smoothly
      const startTime = totalTime - step.duration
      const startProgress = (startTime / totalDuration) * 90
      const endProgress = (totalTime / totalDuration) * 90

      const intervalId = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(prev + 1, endProgress)
          if (next >= endProgress) clearInterval(intervalId)
          return next
        })
      }, step.duration / (endProgress - startProgress))
    })
  }

  const currentStep = generationSteps[currentStepIndex]

  return (
    <div className="max-w-2xl mx-auto px-4">
      <CreationStepper currentStep={3} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">Creating Your Book</h1>
          <p className="text-muted-foreground">
            Our AI is working its magic. This usually takes about 10 seconds.
          </p>
        </div>

        {error ? (
          <div className="bg-destructive/10 text-destructive rounded-2xl p-8 border border-destructive/20">
            <p className="font-medium mb-4">{error}</p>
            <Button
              onClick={() => router.push("/create/upload")}
              variant="outline"
            >
              Start Over
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Animated book icon */}
            <div className="flex justify-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-300/50 dark:shadow-purple-900/50"
              >
                <BookOpen className="w-12 h-12 text-white" />
              </motion.div>
            </div>

            {/* Progress bar */}
            <div className="space-y-3">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-muted-foreground">{Math.round(progress)}% complete</p>
            </div>

            {/* Current step */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center gap-3 text-foreground"
              >
                {currentStep && (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent"
                    />
                    <span className="font-medium">{currentStep.label}...</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Steps list */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-lg mx-auto">
              {generationSteps.map((step, index) => {
                const Icon = step.icon
                const isCompleted = index < currentStepIndex
                const isActive = index === currentStepIndex

                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      isCompleted
                        ? "opacity-100"
                        : isActive
                        ? "opacity-100"
                        : "opacity-30"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-100 dark:bg-green-950/40 text-green-600"
                        : isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{step.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
