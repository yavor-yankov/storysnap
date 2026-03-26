import type { ArtStyle } from "@/types"
import * as fs from "fs"
import * as path from "path"

export interface ImageGenerator {
  generateCharacter(portraitUrl: string, style: ArtStyle): Promise<string>
  generateScene(character: string, scene: string, style: ArtStyle): Promise<string>
  generateCover(title: string, style: ArtStyle): Promise<string>
}

const styleConfigs: Record<ArtStyle, { bg: string; accent: string; pattern: string; emoji: string }> = {
  comic: {
    bg: "#FF4444",
    accent: "#FFE600",
    pattern: "halftone",
    emoji: "💥",
  },
  anime: {
    bg: "#FF69B4",
    accent: "#9370DB",
    pattern: "sparkles",
    emoji: "✨",
  },
  watercolor: {
    bg: "#4ECDC4",
    accent: "#45B7D1",
    pattern: "wash",
    emoji: "🎨",
  },
  storybook: {
    bg: "#F7B731",
    accent: "#FF6B35",
    pattern: "book",
    emoji: "📖",
  },
  "pop-art": {
    bg: "#FF006E",
    accent: "#00F5D4",
    pattern: "dots",
    emoji: "🎭",
  },
  pixel: {
    bg: "#2ECC71",
    accent: "#3498DB",
    pattern: "pixels",
    emoji: "🕹️",
  },
}

function generateSVGImage(
  style: ArtStyle,
  width: number,
  height: number,
  label: string,
  scene?: string
): string {
  const config = styleConfigs[style]

  const patterns: Record<string, string> = {
    halftone: `
      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="4" fill="${config.accent}22"/>
      </pattern>
    `,
    sparkles: `
      <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <polygon points="15,2 17,11 26,11 19,17 21,26 15,20 9,26 11,17 4,11 13,11" fill="${config.accent}33"/>
      </pattern>
    `,
    wash: `
      <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <ellipse cx="20" cy="20" rx="18" ry="14" fill="${config.accent}22"/>
      </pattern>
    `,
    book: `
      <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect x="4" y="4" width="16" height="16" rx="2" fill="${config.accent}22"/>
      </pattern>
    `,
    dots: `
      <pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="8" height="8" fill="${config.accent}33"/>
      </pattern>
    `,
    pixels: `
      <pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="8" height="8" fill="${config.accent}44"/>
        <rect x="8" y="8" width="8" height="8" fill="${config.accent}22"/>
      </pattern>
    `,
  }

  const patternDef = patterns[config.pattern] || patterns.halftone

  const truncatedScene = scene ? scene.substring(0, 60) : ""
  const sceneLines = truncatedScene.match(/.{1,30}/g) || []

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${config.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${config.accent};stop-opacity:1" />
    </linearGradient>
    ${patternDef}
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grad)"/>
  <rect width="${width}" height="${height}" fill="url(#dots)" opacity="0.5"/>
  <rect x="20" y="20" width="${width - 40}" height="${height - 40}" rx="16" fill="rgba(0,0,0,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <text x="${width / 2}" y="${height / 2 - 30}" text-anchor="middle" font-size="${Math.min(width, height) * 0.25}" font-family="Arial">${config.emoji}</text>
  <text x="${width / 2}" y="${height / 2 + 20}" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="18" fill="white" opacity="0.9">${label}</text>
  ${sceneLines.map((line, i) =>
    `<text x="${width / 2}" y="${height / 2 + 44 + i * 20}" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="white" opacity="0.7">${line}</text>`
  ).join("\n  ")}
</svg>`
}

async function saveSVG(svg: string, filename: string): Promise<string> {
  const booksDir = path.join(process.cwd(), "public", "books")
  if (!fs.existsSync(booksDir)) {
    fs.mkdirSync(booksDir, { recursive: true })
  }

  const filepath = path.join(booksDir, filename)
  fs.writeFileSync(filepath, svg)
  return `/books/${filename}`
}

export const mockImageGenerator: ImageGenerator = {
  async generateCharacter(portraitUrl: string, style: ArtStyle): Promise<string> {
    const id = Date.now()
    const svg = generateSVGImage(style, 400, 400, "Character", `${style} style character`)
    return saveSVG(svg, `char-${style}-${id}.svg`)
  },

  async generateScene(character: string, scene: string, style: ArtStyle): Promise<string> {
    const id = Date.now() + Math.random() * 1000 | 0
    const svg = generateSVGImage(style, 600, 400, `Scene`, scene)
    return saveSVG(svg, `scene-${style}-${id}.svg`)
  },

  async generateCover(title: string, style: ArtStyle): Promise<string> {
    const id = Date.now()
    const shortTitle = title.length > 25 ? title.substring(0, 25) + "..." : title
    const svg = generateSVGImage(style, 600, 800, shortTitle, `${style} art style`)
    return saveSVG(svg, `cover-${style}-${id}.svg`)
  },
}

export const imageGenerator = mockImageGenerator
