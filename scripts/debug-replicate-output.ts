import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const Replicate = (await import("replicate")).default;
  const client = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  const portraitUrl = "https://qglkdhvrudkbdknxxbvj.supabase.co/storage/v1/object/public/portraits/test/portrait-1775053025255.jpg";

  const output = await client.run("black-forest-labs/flux-kontext-dev", {
    input: {
      prompt: "a child in a rocket ship, children's book illustration",
      input_image: portraitUrl,
      aspect_ratio: "3:4",
      output_format: "jpg",
      steps: 4,
      guidance: 3.5,
    }
  });

  console.log("typeof output:", typeof output);
  console.log("Array.isArray:", Array.isArray(output));
  const item = Array.isArray(output) ? output[0] : output;
  console.log("item type:", typeof item);
  console.log("item constructor:", (item as object)?.constructor?.name);
  console.log("typeof item.url:", typeof (item as { url?: unknown })?.url);
  console.log("item.url value:", (item as { url?: unknown })?.url);
  console.log("String(item):", String(item));
  console.log("item?.toString():", item?.toString?.());
  // Check if it's a URL object
  if (item instanceof URL) console.log("IS URL instance, href:", item.href);
}

main().catch(e => { console.error(e.message); process.exit(1); });
