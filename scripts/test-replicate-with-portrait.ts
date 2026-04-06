/**
 * Downloads a sample child portrait, uploads it to Supabase,
 * then runs a single Replicate flux-kontext-dev generation.
 *
 * Usage: npx tsx scripts/test-replicate-with-portrait.ts
 */
import { config } from "dotenv";
import path from "path";
import fs from "fs";
config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const { createServiceClient } = await import("../src/lib/supabase/server");
  const { generateReplicatePage } = await import("../src/lib/ai/replicate");

  const sb = createServiceClient();

  // 1. Download a sample portrait (free stock photo of a child)
  console.log("Downloading sample portrait…");
  const portraitRes = await fetch(
    "https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?w=400&h=400&fit=crop"
  );
  if (!portraitRes.ok) throw new Error(`Portrait fetch failed: ${portraitRes.status}`);
  const portraitBuffer = Buffer.from(await portraitRes.arrayBuffer());

  // 2. Upload to Supabase portraits bucket
  console.log("Uploading portrait to Supabase…");
  const portraitPath = `test/portrait-${Date.now()}.jpg`;
  const { error: uploadErr } = await sb.storage
    .from("portraits")
    .upload(portraitPath, portraitBuffer, { contentType: "image/jpeg", upsert: true });

  if (uploadErr) throw new Error(`Supabase upload failed: ${uploadErr.message}`);

  const { data: { publicUrl } } = sb.storage.from("portraits").getPublicUrl(portraitPath);
  console.log(`Portrait URL: ${publicUrl}`);

  // 3. Generate one page with Replicate flux-kontext-dev
  console.log(`\nGenerating page 1 with ${process.env.REPLICATE_MODEL}…`);
  const seed = 42;
  const imageUrl = await generateReplicatePage({
    prompt:
      "Page 1: A brave child inside a colorful rocket ship launching into outer space. " +
      "Setting: outer space, colourful nebulas, alien planets. " +
      "Colour palette: deep indigo sky, golden stars, bright teal spaceship panels. " +
      "Mood: wonder, excitement, discovery. " +
      "The same child character with exact same face from reference portrait photo appears as the story hero. " +
      "beautiful professional children's picture book illustration, semi-realistic Disney Pixar CGI art style, " +
      "rich vibrant cel-shading, lush detailed painterly background, soft warm cinematic lighting, " +
      "cute cartoon-realistic child character with big expressive eyes, no text, no watermark",
    portraitUrl: publicUrl,
    pageNumber: 1,
    seed,
    isPreview: true,
  });

  console.log(`\n✅ Image URL: ${imageUrl}`);

  // 4. Save result locally
  fs.mkdirSync("./test-books", { recursive: true });
  const imgRes = await fetch(imageUrl);
  const imgBuf = Buffer.from(await imgRes.arrayBuffer());
  fs.writeFileSync("./test-books/replicate-test.jpg", imgBuf);
  console.log(`   Saved to test-books/replicate-test.jpg (${Math.round(imgBuf.byteLength / 1024)} KB)`);
}

main().catch(e => { console.error("FAILED:", e.message); process.exit(1); });
