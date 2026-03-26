export type ArtStyle = "comic" | "anime" | "watercolor" | "storybook" | "pop-art" | "pixel"

export interface Story {
  title: string
  characterName: string
  pages: StoryPage[]
}

export interface StoryPage {
  pageNum: number
  text: string
  sceneDescription: string
}

export interface GeneratedBook {
  title: string
  coverUrl: string
  pages: GeneratedPage[]
}

export interface GeneratedPage {
  pageNum: number
  imageUrl: string
  text: string
  prompt: string
}
