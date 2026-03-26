import { notFound } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BookViewerClient } from "@/components/book/BookViewerClient"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"

export default async function BookPage({
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
      user: {
        select: { name: true },
      },
    },
  })

  if (!book || book.status !== "complete") {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Button asChild variant="outline" size="sm">
              <Link href={session ? "/dashboard" : "/"}>
                <ArrowLeft className="w-4 h-4" />
                {session ? "Dashboard" : "Back"}
              </Link>
            </Button>
            {book.pdfUrl && (
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
              >
                <a href={book.pdfUrl} download>
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </Button>
            )}
          </div>

          <BookViewerClient book={book} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
