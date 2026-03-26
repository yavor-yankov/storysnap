"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Parent",
    avatar: "SC",
    rating: 5,
    text: "My daughter absolutely loves her personalized watercolor story book! She carries it everywhere. The illustrations are absolutely magical.",
  },
  {
    name: "Marcus Johnson",
    role: "Gift Buyer",
    avatar: "MJ",
    rating: 5,
    text: "Used this for a birthday gift. The comic book style was perfect! My friend couldn't believe it was AI-generated. Will definitely use again.",
  },
  {
    name: "Elena Rodriguez",
    role: "Teacher",
    avatar: "ER",
    rating: 5,
    text: "I created books for all my students with their portraits. The storybook style is so charming and the kids are obsessed with reading their own adventures.",
  },
  {
    name: "James Park",
    role: "Anime Fan",
    avatar: "JP",
    rating: 5,
    text: "The anime style is incredibly accurate! I look exactly like an anime character. The story was creative and really fun to read.",
  },
  {
    name: "Olivia Williams",
    role: "Artist",
    avatar: "OW",
    rating: 5,
    text: "As an artist, I was skeptical, but the watercolor style genuinely impressed me. The AI has real artistic sensibility. Highly recommend.",
  },
  {
    name: "David Kim",
    role: "Gaming Enthusiast",
    avatar: "DK",
    rating: 5,
    text: "Pixel art mode is *chef's kiss*. I look like a retro game hero. Shared it online and everyone wanted to know how to make one.",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Loved by{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our happy readers are saying about their personalized books
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-6">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white text-sm font-medium">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
