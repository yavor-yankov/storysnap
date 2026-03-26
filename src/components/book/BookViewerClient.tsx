"use client"

import { BookViewer } from "./BookViewer"

interface BookViewerClientProps {
  book: {
    id: string
    title: string
    artStyle: string
    coverUrl: string | null
    pages: Array<{
      id: string
      pageNum: number
      imageUrl: string | null
      text: string
    }>
  }
}

export function BookViewerClient({ book }: BookViewerClientProps) {
  return <BookViewer book={book} />
}
