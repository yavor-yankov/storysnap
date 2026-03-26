import { prisma } from "@/lib/prisma"
import { imageGenerator } from "@/lib/ai/image-generator"
import { storyGenerator } from "@/lib/ai/story-generator"
import type { ArtStyle } from "@/types"

export async function assembleBook(
  bookId: string,
  portraitUrl: string,
  artStyle: ArtStyle,
  characterName: string
): Promise<void> {
  try {
    // Update status to generating
    await prisma.book.update({
      where: { id: bookId },
      data: { status: "generating" },
    })

    // Generate story
    const story = await storyGenerator.generateStory(characterName, artStyle)

    // Update book title
    await prisma.book.update({
      where: { id: bookId },
      data: { title: story.title },
    })

    // Generate cover image
    const coverUrl = await imageGenerator.generateCover(story.title, artStyle)

    await prisma.book.update({
      where: { id: bookId },
      data: { coverUrl },
    })

    // Generate character illustration
    const characterUrl = await imageGenerator.generateCharacter(portraitUrl, artStyle)

    // Generate page illustrations and save pages
    const pagePromises = story.pages.map(async (page) => {
      const imageUrl = await imageGenerator.generateScene(
        characterUrl,
        page.sceneDescription,
        artStyle
      )

      return prisma.bookPage.create({
        data: {
          bookId,
          pageNum: page.pageNum,
          imageUrl,
          text: page.text,
          prompt: page.sceneDescription,
        },
      })
    })

    await Promise.all(pagePromises)

    // Mark as complete
    await prisma.book.update({
      where: { id: bookId },
      data: {
        status: "complete",
        pageCount: story.pages.length,
      },
    })
  } catch (error) {
    console.error("Book assembly error:", error)
    await prisma.book.update({
      where: { id: bookId },
      data: { status: "failed" },
    })
    throw error
  }
}
