import { PortraitUploader } from "@/components/upload/PortraitUploader"
import { Header } from "@/components/layout/Header"

export const metadata = {
  title: "Upload Portrait — PixTales",
}

export default function UploadPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <PortraitUploader />
      </main>
    </div>
  )
}
