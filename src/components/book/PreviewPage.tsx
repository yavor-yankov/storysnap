"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { BookViewer } from "./BookViewer"
import { CreationStepper } from "@/components/upload/CreationStepper"
import { BookOpen, Download, LayoutDashboard, Loader2, Share2 } from "lucide-react"

export function PreviewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookId = searchParams.get("bookId")
  const [book, setBook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!bookId) {
      router.push("/create/upload")
      return
    }

    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${bookId}`)
        if (!res.ok) {
          setError("Book not found")
          setLoading(false)
          return
        }
        const data = await res.json()
        setBook(data.book)
        setLoading(false)
      } catch {
        setError("Failed to load book")
        setLoading(false)
      }
    }

    fetchBook()
  }, [bookId, router])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <CreationStepper currentStep={4} />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <CreationStepper currentStep={4} />
        <div className="text-center py-12">
          <p className="text-destructive">{error || "Book not found"}</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/create/upload">Start Over</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <CreationStepper currentStep={4} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Your book is ready!
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Preview Your Story Book</h1>
          <p className="text-muted-foreground">
            Flip through your personalized illustrated story
          </p>
        </div>

        <BookViewer book={book} />

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium"
          >
            <Link href={`/book/${book.id}`}>
              <Eye className="w-4 h-4" />
              Full Screen View
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 h-11"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <Link href="/create/upload">
              Create Another Book
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

function Eye({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
