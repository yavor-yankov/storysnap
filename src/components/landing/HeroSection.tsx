"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Sparkles, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-background to-indigo-50 dark:from-purple-950/20 dark:via-background dark:to-indigo-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(139,92,246,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(139,92,246,0.08),transparent)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800 px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Story Books
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-foreground">Your portrait.</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Your story.
              </span>
              <br />
              <span className="text-foreground">Your book.</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Upload a portrait photo, choose an art style, and watch AI transform you into the hero of a beautifully illustrated personalized story book.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white h-12 px-8 text-base font-medium shadow-lg shadow-purple-200 dark:shadow-purple-950/50"
              >
                <Link href="/auth/signup">
                  Create Your Book
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950/30"
              >
                <Link href="/#how-it-works">
                  See How It Works
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span>10,000+ books created</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Book Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              {/* Floating book mockup */}
              <div className="relative mx-auto">
                {/* Book shadow */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-purple-400/20 dark:bg-purple-600/20 blur-2xl rounded-full" />

                {/* Main book */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-300/40 dark:shadow-purple-900/60 aspect-[3/4] w-72 mx-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
                    <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-4">
                      <span className="text-5xl">🦸</span>
                    </div>
                    <h3 className="text-xl font-bold text-center mb-2">The Adventure of Alex</h3>
                    <p className="text-white/70 text-sm text-center">An epic tale in Comic Book style</p>
                    <div className="flex gap-1 mt-4">
                      {[0,1,2,3,4,5,6].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                      ))}
                    </div>
                  </div>
                  {/* Book spine effect */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/20" />
                </motion.div>

                {/* Floating cards */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -left-8 top-1/4 bg-card border border-border rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-sm">🎨</div>
                    <div>
                      <p className="text-xs font-semibold">Art Style</p>
                      <p className="text-xs text-muted-foreground">Comic Book</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="absolute -right-8 top-1/2 bg-card border border-border rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm">⭐</div>
                    <div>
                      <p className="text-xs font-semibold">8 Pages</p>
                      <p className="text-xs text-muted-foreground">Custom story</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
