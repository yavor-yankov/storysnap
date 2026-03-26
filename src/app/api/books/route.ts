import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const books = await prisma.book.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        pages: {
          orderBy: { pageNum: "asc" },
          take: 1,
        },
      },
    })

    return NextResponse.json({ books }, { status: 200 })
  } catch (error) {
    console.error("Books fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}
