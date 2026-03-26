"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreationStepper } from "./CreationStepper"
import { Upload, ImageIcon, X, ArrowRight, Loader2 } from "lucide-react"

export function PortraitUploader() {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [characterName, setCharacterName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const droppedFile = acceptedFiles[0]
    if (droppedFile) {
      setFile(droppedFile)
      const url = URL.createObjectURL(droppedFile)
      setPreview(url)
      setError("")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  })

  async function handleNext() {
    if (!file) {
      setError("Please upload a portrait photo")
      return
    }
    if (!characterName.trim()) {
      setError("Please enter a character name")
      return
    }

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("portrait", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Upload failed")
        setLoading(false)
        return
      }

      // Store in session storage for the flow
      sessionStorage.setItem("portraitUrl", data.portraitUrl)
      sessionStorage.setItem("characterName", characterName.trim())

      router.push("/create/style")
    } catch {
      setError("Upload failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <CreationStepper currentStep={1} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Upload Your Portrait</h1>
          <p className="text-muted-foreground">
            Upload a clear photo of yourself to become the hero of your story
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3 mb-4 border border-destructive/20">
            {error}
          </div>
        )}

        {!preview ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? "border-primary bg-primary/5 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                isDragActive ? "bg-primary/20" : "bg-muted"
              }`}>
                {isDragActive ? (
                  <ImageIcon className="w-8 h-8 text-primary" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground mb-1">
                  {isDragActive ? "Drop it here!" : "Drag & drop your photo"}
                </p>
                <p className="text-muted-foreground text-sm">
                  or click to browse files
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                JPEG, PNG, WebP — max 5MB
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-muted aspect-square max-w-xs mx-auto shadow-xl">
              <Image
                src={preview}
                alt="Portrait preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={() => { setPreview(null); setFile(null) }}
              className="absolute top-2 right-2 sm:right-[calc(50%-160px+8px)] w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mt-6 space-y-2">
          <Label htmlFor="characterName">Character Name</Label>
          <Input
            id="characterName"
            placeholder="What should we call your hero? (e.g., Alex, Sam, Jordan)"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            className="h-11"
            maxLength={30}
          />
          <p className="text-xs text-muted-foreground">
            This name will be used throughout your story
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={loading || !file || !characterName.trim()}
          className="w-full mt-6 h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              Continue to Style Selection
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  )
}
