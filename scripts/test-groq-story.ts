import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), ".env.local") });

async function test() {
  const { generateStory } = await import("../src/lib/story/generator");

  console.log("Calling Groq to generate a 5-page story for Александър...\n");
  const t0 = Date.now();

  const pages = await generateStory({
    childName: "Александър",
    storySlug: "kosmichesko-priklyuchenie",
    storyTitle: "Космическото приключение на Александър",
    pageCount: 5,
    childAge: 5,
    childGender: "boy",
  });

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`Generated in ${elapsed}s\n`);

  for (const p of pages) {
    console.log(`─── Page ${p.pageNumber} ───`);
    console.log(`BG:  ${p.storyText}`);
    console.log(`IMG: ${p.imagePrompt.slice(0, 120)}…`);
    console.log();
  }
}

test().catch((e) => { console.error(e); process.exit(1); });
