import { GeneratePage } from "@/components/upload/GeneratePage"
import { Header } from "@/components/layout/Header"

export const metadata = {
  title: "Generating Your Book — StorySnap",
}

export default function GeneratePageRoute() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <GeneratePage />
      </main>
    </div>
  )
}
