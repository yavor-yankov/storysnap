"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react"

interface BookPage {
  id: string
  pageNum: number
  imageUrl: string | null
  text: string
}

interface Book {
  id: string
  title: string
  artStyle: string
  coverUrl: string | null
  pages: BookPage[]
}

interface BookViewerProps {
  book: Book
}

export function BookViewer({ book }: BookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0) // 0 = cover
  const totalPages = book.pages.length + 1 // +1 for cover

  const goNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1)
    }
  }

  const goPrev = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1)
    }
  }

  const isCover = currentPage === 0
  const currentBookPage = isCover ? null : book.pages[currentPage - 1]

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-foreground text-center">{book.title}</h1>

      {/* Book display */}
      <div className="relative w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Page image */}
            <div className="aspect-[3/2] relative bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
              {isCover && book.coverUrl ? (
                <Image src={book.coverUrl} alt={book.title} fill className="object-cover" />
              ) : currentBookPage?.imageUrl ? (
                <Image src={currentBookPage.imageUrl} alt={`Page ${currentBookPage.pageNum}`} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BookOpen className="w-12 h-12 text-muted-foreground/40" />
                </div>
              )}

              {isCover && (
                <div className="absolute inset-0 bg-black/30 flex items-end p-6">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Your Story</p>
                    <h2 className="text-white text-2xl font-bold">{book.title}</h2>
                    <p className="text-white/60 text-sm capitalize mt-1">{book.artStyle} style</p>
                  </div>
                </div>
              )}
            </div>

            {/* Page text */}
            {!isCover && currentBookPage && (
              <div className="p-6">
                <p className="text-foreground/80 leading-relaxed">{currentBookPage.text}</p>
              </div>
            )}

            {/* Page number */}
            <div className="px-6 pb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {isCover ? "Cover" : `Page ${currentBookPage?.pageNum} of ${book.pages.length}`}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === currentPage ? "bg-primary w-4" : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={goPrev}
          disabled={currentPage === 0}
          className="rounded-full w-10 h-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-sm text-muted-foreground min-w-20 text-center">
          {currentPage === 0 ? "Cover" : `${currentPage} / ${book.pages.length}`}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={goNext}
          disabled={currentPage === totalPages - 1}
          className="rounded-full w-10 h-10"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
