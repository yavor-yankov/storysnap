"use client"

import { motion } from "framer-motion"

const artStyles = [
  {
    name: "Comic Book",
    emoji: "💥",
    description: "Bold lines, halftone dots, vibrant colors. Become a superhero!",
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    bg: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30",
  },
  {
    name: "Anime",
    emoji: "✨",
    description: "Japanese animation style with expressive eyes and dynamic poses.",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    bg: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
  },
  {
    name: "Watercolor",
    emoji: "🎨",
    description: "Soft, painterly style with gentle washes and artistic brushwork.",
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    bg: "bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30",
  },
  {
    name: "Storybook",
    emoji: "📖",
    description: "Classic children's book illustrations, warm and whimsical.",
    gradient: "from-amber-500 via-yellow-500 to-lime-500",
    bg: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
  },
  {
    name: "Pop Art",
    emoji: "🎭",
    description: "Bold, Warhol-inspired graphics with vivid flat colors.",
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    bg: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30",
  },
  {
    name: "Pixel Art",
    emoji: "🕹️",
    description: "Retro game-inspired pixel graphics, nostalgic and charming.",
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            6 Stunning{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Art Styles
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Each style creates a completely unique visual experience for your personalized story
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artStyles.map((style, index) => (
            <motion.div
              key={style.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ scale: 1.02, translateY: -4 }}
              className="group cursor-pointer"
            >
              <div className={`${style.bg} border border-border/60 rounded-2xl p-6 h-full transition-shadow duration-300 group-hover:shadow-xl`}>
                <div className="relative mb-6">
                  <div className={`w-full h-40 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center overflow-hidden relative`}>
                    {/* Decorative elements */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-2 left-2 w-12 h-12 rounded-full bg-white/30" />
                      <div className="absolute bottom-2 right-2 w-8 h-8 rounded-lg bg-white/30" />
                      <div className="absolute top-1/2 right-4 w-6 h-6 rounded-full bg-white/20" />
                    </div>
                    <span className="text-7xl relative z-10">{style.emoji}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{style.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{style.description}</p>
                <div className={`mt-4 inline-flex items-center gap-1 text-xs font-medium bg-gradient-to-r ${style.gradient} bg-clip-text text-transparent`}>
                  <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${style.gradient}`} />
                  Choose this style →
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
