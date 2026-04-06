/**
 * HeroBook — Test PDF Generator
 *
 * Generates a sample PDF for a given story WITHOUT going through payment.
 * Uses HuggingFace (free) to generate illustrations.
 *
 * Usage:
 *   npx tsx scripts/generate-test-pdf.ts [storySlug] [childName] [outputPath]
 *
 * Examples:
 *   npx tsx scripts/generate-test-pdf.ts kosmichesko-priklyuchenie "Ивана" ./test-books/ivana-space.pdf
 *   npx tsx scripts/generate-test-pdf.ts supergerojski-den "Никола" ./test-books/nikola-hero.pdf
 */

import { config } from "dotenv";
import path from "path";
import fs from "fs";

// Load .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });

const STORIES: Record<string, string> = {
  "kosmichesko-priklyuchenie": "Космическото приключение",
  "printsesata-ot-izgreva": "Принцесата от Изгрева",
  "supergerojski-den": "Суперхеройски ден",
  "v-dzhunglata-na-priyatelite": "В джунглата на приятелите",
  "malkiyat-gotvach": "Малкият готвач",
  "piratite-na-cherno-more": "Пиратите на Черно море",
  "feyata-na-gorite": "Феята на горите",
  "dinozavarat-priyatel": "Динозавърът приятел",
};

async function main() {
  const storySlug = process.argv[2] ?? "kosmichesko-priklyuchenie";
  const childName = process.argv[3] ?? "Ивана";
  const outputPath = process.argv[4] ?? `./test-books/${storySlug}-${childName.toLowerCase()}.pdf`;

  const storyTitle = STORIES[storySlug];
  if (!storyTitle) {
    console.error(`Unknown story slug: ${storySlug}`);
    console.error("Available slugs:", Object.keys(STORIES).join(", "));
    process.exit(1);
  }

  console.log(`\n📚 Generating PDF for "${storyTitle}" — ${childName}`);
  console.log(`   Output: ${outputPath}\n`);

  // Ensure output directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  console.log("🎨 Generating AI illustrations (this takes 2-5 minutes)...");

  // Dynamic imports to avoid TS issues with ESM
  const { generateFullPages } = await import("../src/lib/ai/face-swap");
  const { generateBookPdf } = await import("../src/lib/pdf/book-pdf");

  const pages = await generateFullPages({
    storySlug,
    storyId: "test-id",
    portraitUrls: [], // No portrait for test — will generate without face swap
    childName,
  });

  console.log(`✅ Generated ${pages.length} pages`);
  console.log("📄 Generating PDF...");

  const pdfBuffer = await generateBookPdf({
    storyTitle,
    childName,
    storySlug,
    pages: pages.map((p) => ({
      pageNumber: p.pageNumber,
      textContent: p.textContent,
      imageUrl: p.imageUrl.startsWith("mock:") ? undefined : p.imageUrl,
    })),
  });

  fs.writeFileSync(outputPath, pdfBuffer);

  const sizeKb = Math.round(pdfBuffer.byteLength / 1024);
  console.log(`\n✅ PDF saved to: ${outputPath}`);
  console.log(`   Size: ${sizeKb} KB`);
  console.log(`   Pages: ${pages.length + 2} (cover + ${pages.length} story pages + back cover)`);
  console.log("\n🖨️  Ready to send to the printer!");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
