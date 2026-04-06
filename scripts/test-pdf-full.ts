/**
 * Full layout test — generates a 12-spread book (cover + 12 pages + back cover)
 * with placeholder images (no AI), to visually verify the PDF layout matches
 * the childbook.ai reference style.
 *
 * Usage: npx tsx scripts/test-pdf-full.ts
 */

import { config } from "dotenv";
import path from "path";
import fs from "fs";

config({ path: path.resolve(process.cwd(), ".env.local") });

async function test() {
  const { generateBookPdf } = await import("../src/lib/pdf/book-pdf");
  fs.mkdirSync("./test-books", { recursive: true });

  console.log("Generating full-layout test PDF (12 pages, no images)…");

  const TEXTS = [
    "Имало едно време едно храбро дете на име Александър, което обичало да гледа звездите.",
    "Една нощ Александър забелязало светлина в градината — малка ракета, готова за полет!",
    "С биещо сърце той се качил вътре и натиснал големия червен бутон.",
    "БУМ! Ракетата профучала нагоре и Александър видял как Земята ставала все по-малка.",
    "Около него блестели милиони звезди — всяка от тях криела своя тайна.",
    "Изведнъж нещо зелено и кръгло се появило пред иллюминатора. Зорко!",
    "Зорко поканил Александър да разгледат неговата планета с розови дървета.",
    "Планетата Зора имала лилави реки от сладък сок и пеещи кристали.",
    "Александър и Зорко яли плодове с вкус на дъга и се смеели до сълзи.",
    "Заедно открили нова звезда и я нарекли на Александър — за вечни времена!",
    "Дошло времето за сбогуване. Зорко дал на Александър кристал, който светел в тъмното.",
    "Тази нощ Александър заспал с поглед към прозореца, където мигала новата му звезда.",
  ];

  const buf = await generateBookPdf({
    storyTitle: "Космическото приключение на Александър",
    childName: "Александър",
    storySlug: "kosmichesko-priklyuchenie",
    pages: TEXTS.map((text, i) => ({
      pageNumber: i + 1,
      textContent: text,
      // No imageUrl → shows placeholder emoji
    })),
  });

  fs.writeFileSync("./test-books/test-full-layout.pdf", buf);
  const kb = Math.round(buf.byteLength / 1024);
  console.log(`✅ Done! ${kb} KB → test-books/test-full-layout.pdf`);
  console.log(`   Pages in PDF: cover + ${TEXTS.length * 2} story pages + back cover = ${TEXTS.length * 2 + 2} total`);
}

test().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
