import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookCard } from "@/components/book/BookCard"
import { Plus, BookOpen, Star, Zap } from "lucide-react"

export const metadata = {
  title: "Dashboard — StorySnap",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { id: session!.user!.id as string },
  })

  const recentBooks = await prisma.book.findMany({
    where: { userId: session!.user!.id as string },
    orderBy: { createdAt: "desc" },
    take: 4,
  })

  const totalBooks = await prisma.book.count({
    where: { userId: session!.user!.id as string },
  })

  const completedBooks = await prisma.book.count({
    where: { userId: session!.user!.id as string, status: "complete" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {session?.user?.name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your story books</p>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Books</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{totalBooks}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Completed</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{completedBooks}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center">
              <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Credits Left</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{user?.credits ?? 0}</p>
        </div>
      </div>

      {/* Recent books */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Recent Books</h2>
        {totalBooks > 4 && (
          <Link href="/dashboard/books" className="text-sm text-primary hover:underline">
            View all →
          </Link>
        )}
      </div>

      {recentBooks.length === 0 ? (
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recentBooks.map((book, index) => (
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
