import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/book/BookCard"
import { Plus, BookOpen } from "lucide-react"

export const metadata = {
  title: "My Books — StorySnap",
}

export default async function BooksPage() {
  const session = await getServerSession(authOptions)

  const books = await prisma.book.findMany({
    where: { userId: session!.user!.id as string },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Books</h1>
          <p className="text-muted-foreground mt-1">
            {books.length} book{books.length !== 1 ? "s" : ""} created
          </p>
        </div>
        <Button
          asChild
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
        >
          <Link href="/create/upload">
            <Plus className="w-4 h-4" />
            New Book
          </Link>
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No books yet</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Create your first personalized story book!
          </p>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            <Link href="/create/upload">
              <Plus className="w-4 h-4" />
              Create Your First Book
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {books.map((book, index) => (
            <BookCard
              key={book.id}
              book={{
                ...book,
                createdAt: book.createdAt.toISOString(),
              }}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
