import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { assembleBook } from "@/lib/book/assembler"
import type { ArtStyle } from "@/types"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { portraitUrl, artStyle, characterName } = await request.json()

    if (!portraitUrl || !artStyle || !characterName) {
      return NextResponse.json(
        { error: "Missing required fields: portraitUrl, artStyle, characterName" },
        { status: 400 }
      )
    }

    const validStyles: ArtStyle[] = ["comic", "anime", "watercolor", "storybook", "pop-art", "pixel"]
    if (!validStyles.includes(artStyle as ArtStyle)) {
      return NextResponse.json({ error: "Invalid art style" }, { status: 400 })
    }

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.credits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits. Please purchase more credits." },
        { status: 402 }
      )
    }

    // Create book record
    const book = await prisma.book.create({
      data: {
        title: `${characterName}'s Story`,
        userId: session.user.id,
        artStyle,
        portraitUrl,
        status: "draft",
      },
    })

    // Deduct credit
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: 1 } },
    })

    // Assemble book (in background - non-blocking response)
    assembleBook(book.id, portraitUrl, artStyle as ArtStyle, characterName).catch((err) => {
      console.error("Book assembly failed:", err)
    })

    return NextResponse.json({ bookId: book.id }, { status: 201 })
  } catch (error) {
    console.error("Generate error:", error)
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}
