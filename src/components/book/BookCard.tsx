"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, CheckCircle, XCircle, Loader2, Eye } from "lucide-react"

interface Book {
  id: string
  title: string
  artStyle: string
  status: string
  coverUrl: string | null
  pageCount: number
  createdAt: string
}

interface BookCardProps {
  book: Book
  index?: number
}

const styleColors: Record<string, string> = {
  comic: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  anime: "bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400",
  watercolor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400",
  storybook: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
  "pop-art": "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  pixel: "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
}

const styleEmojis: Record<string, string> = {
  comic: "💥",
  anime: "✨",
  watercolor: "🎨",
  storybook: "📖",
  "pop-art": "🎭",
  pixel: "🕹️",
}

const statusConfig = {
  draft: { icon: Clock, label: "Draft", className: "text-muted-foreground" },
  generating: { icon: Loader2, label: "Generating", className: "text-blue-500 animate-spin" },
  complete: { icon: CheckCircle, label: "Complete", className: "text-green-500" },
  failed: { icon: XCircle, label: "Failed", className: "text-destructive" },
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  const statusInfo = statusConfig[book.status as keyof typeof statusConfig] || statusConfig.draft
  const StatusIcon = statusInfo.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Cover image */}
        <div className="aspect-[3/4] relative bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <div className="text-5xl mb-3">{styleEmojis[book.artStyle] || "📚"}</div>
                <p className="text-sm text-muted-foreground">{book.status === "generating" ? "Generating..." : "No cover"}</p>
              </div>
            </div>
          )}

          {/* Status overlay */}
          {book.status === "generating" && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                <p className="text-sm font-medium">Generating...</p>
              </div>
            </div>
          )}

          {/* Hover overlay */}
          {book.status === "complete" && (
            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              >
                <Link href={`/book/${book.id}`}>
                  <Eye className="w-4 h-4" />
                  View Book
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Card content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
              {book.title}
            </h3>
          </div>

          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="secondary"
              className={`text-xs ${styleColors[book.artStyle] || ""}`}
            >
              {styleEmojis[book.artStyle]} {book.artStyle}
            </Badge>

            <div className="flex items-center gap-1">
              <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.className}`} />
              <span className="text-xs text-muted-foreground">{statusInfo.label}</span>
            </div>
          </div>

          {book.pageCount > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <BookOpen className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{book.pageCount} pages</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
