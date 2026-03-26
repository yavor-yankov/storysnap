import { Suspense } from "react"
import { PreviewPage } from "@/components/book/PreviewPage"
import { Header } from "@/components/layout/Header"
import { Loader2 } from "lucide-react"

export const metadata = {
  title: "Preview Your Book — StorySnap",
}

export default function PreviewPageRoute() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }>
          <PreviewPage />
        </Suspense>
      </main>
    </div>
  )
}
