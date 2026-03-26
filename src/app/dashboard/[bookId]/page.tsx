import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookViewerClient } from "@/components/book/BookViewerClient"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Loader2 } from "lucide-react"

const styleEmojis: Record<string, string> = {
  comic: "💥",
  anime: "✨",
  watercolor: "🎨",
  storybook: "📖",
  "pop-art": "🎭",
  pixel: "🕹️",
}

export default async function DashboardBookPage({
  params,
}: {
  params: Promise<{ bookId: string }>
}) {
  const { bookId } = await params
  const session = await getServerSession(authOptions)

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      pages: {
        orderBy: { pageNum: "asc" },
      },
    },
  })

  if (!book) {
    notFound()
  }

  if (book.userId !== session!.user!.id) {
    redirect("/dashboard")
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/books">
            <ArrowLeft className="w-4 h-4" />
            My Books
          </Link>
        </Button>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{book.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="capitalize">
              {styleEmojis[book.artStyle]} {book.artStyle}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {book.status}
            </Badge>
            {book.pageCount > 0 && (
              <span className="text-sm text-muted-foreground">{book.pageCount} pages</span>
            )}
          </div>
        </div>

        {book.status === "complete" && (
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          >
            <Link href={`/book/${book.id}`}>
              <Eye className="w-4 h-4" />
              Full View
            </Link>
          </Button>
        )}
      </div>

      {book.status === "generating" && (
        <div className="text-center py-16 bg-muted/30 rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="font-medium">Generating your book...</p>
          <p className="text-sm text-muted-foreground mt-1">This usually takes about 10-15 seconds</p>
        </div>
      )}

      {book.status === "complete" && book.pages.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <BookViewerClient book={book} />
        </div>
      )}

      {book.status === "failed" && (
        <div className="text-center py-16 bg-destructive/5 rounded-2xl border border-destructive/20">
          <p className="font-medium text-destructive mb-2">Book generation failed</p>
          <p className="text-sm text-muted-foreground mb-4">Please try creating a new book</p>
          <Button asChild variant="outline">
            <Link href="/create/upload">Try Again</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
