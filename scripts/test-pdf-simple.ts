import { config } from "dotenv";
import path from "path";
import fs from "fs";

config({ path: path.resolve(process.cwd(), ".env.local") });

async function test() {
  const { generateBookPdf } = await import("../src/lib/pdf/book-pdf");
  fs.mkdirSync("./test-books", { recursive: true });

  console.log("Generating test PDF with Cyrillic text...");
  const buf = await generateBookPdf({
    storyTitle: "Космическото приключение",
    childName: "Ивана",
    storySlug: "kosmichesko-priklyuchenie",
    pages: [
      { pageNumber: 1, textContent: "Имало едно време едно храбро дете на име Ивана, което обичало да гледа звездите." },
      { pageNumber: 2, textContent: "Една нощ Ивана забелязало светлина в градината — малка ракета, готова за полет!" },
      { pageNumber: 3, textContent: "БУМ! Ракетата профучала нагоре и Ивана видяло как Земята ставала все по-малка." },
      { pageNumber: 4, textContent: "Около Ивана блестели милиони звезди — всяка от тях криела своя тайна." },
    ],
  });

  fs.writeFileSync("./test-books/test-cyrillic.pdf", buf);
  console.log(`✅ Done! Size: ${Math.round(buf.byteLength / 1024)} KB`);
  console.log(`   → test-books/test-cyrillic.pdf`);
}

test().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
