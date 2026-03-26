import { StyleSelector } from "@/components/upload/StyleSelector"
import { Header } from "@/components/layout/Header"

export const metadata = {
  title: "Choose Style — PicTale",
}

export default function StylePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <StyleSelector />
      </main>
    </div>
  )
}
