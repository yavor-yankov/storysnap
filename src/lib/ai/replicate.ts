/**
 * HeroBook — Replicate Image Generation
 *
 * Model priority (configurable via REPLICATE_MODEL env var):
 *
 *   flux-kontext-dev  — PRIMARY (recommended)
 *     Best for character consistency: accepts a reference portrait image and
 *     maintains the child's facial features across all 24 book pages.
 *     Cost: ~$0.01/image. Free trial runs available on Replicate.
 *
 *   flux-dev  — GOOD QUALITY (img2img mode)
 *     High quality without kontext reference support.
 *     Cost: ~$0.004/image.
 *
 *   flux-schnell  — FAST TESTING
 *     4 inference steps, very fast (~3s/image). Ideal for local dev.
 *     Cost: ~$0.001/image. Often free on trial account.
 *
 * Character consistency tips:
 *   1. Pass the portrait as `input_image` (kontext) — model reads face from photo.
 *   2. Use a fixed `seed` across all pages of the same book → consistent art style.
 *   3. Describe the child briefly in every prompt: "a [age]-year-old child".
 *   4. Keep style tags identical on every page: same palette, brushstroke style.
 *   5. For flux-dev img2img, `prompt_strength` 0.65–0.75 balances face vs scene.
 */

import Replicate from "replicate";
import { createServiceClient } from "@/lib/supabase/server";

// ─── Client ──────────────────────────────────────────────────────────────────

function getClient(): Replicate {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) throw new Error("REPLICATE_API_TOKEN is not set");
  return new Replicate({ auth: token });
}

// ─── Model config ─────────────────────────────────────────────────────────────

type ModelId =
  | "black-forest-labs/flux-kontext-dev"
  | "black-forest-labs/flux-dev"
  | "black-forest-labs/flux-schnell";

function resolveModel(): ModelId {
  const env = process.env.REPLICATE_MODEL;
  const allowed: ModelId[] = [
    "black-forest-labs/flux-kontext-dev",
    "black-forest-labs/flux-dev",
    "black-forest-labs/flux-schnell",
  ];
  if (env && allowed.includes(env as ModelId)) return env as ModelId;
  return "black-forest-labs/flux-kontext-dev"; // safest default for character consistency
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReplicatePageInput {
  prompt: string;
  portraitUrl?: string;   // child's uploaded photo — drives character consistency
  pageNumber: number;
  seed?: number;          // shared seed keeps style consistent across all pages
  isPreview?: boolean;
}

export interface ReplicatePageOutput {
  pageNumber: number;
  imageUrl: string;       // Replicate CDN URL or uploaded Supabase URL
}

// ─── Model-specific input builders ───────────────────────────────────────────

function buildInput(
  model: ModelId,
  params: ReplicatePageInput
): Record<string, unknown> {
  const { prompt, portraitUrl, seed, isPreview } = params;

  const sharedQuality = {
    aspect_ratio: "3:4",
    output_format: "jpg",
    output_quality: isPreview ? 80 : 92,
    seed: seed ?? undefined,
  };

  if (model === "black-forest-labs/flux-kontext-dev") {
    // flux-kontext-dev: reference portrait → face consistency
    return {
      prompt,
      ...(portraitUrl ? { input_image: portraitUrl } : {}),
      ...sharedQuality,
      steps: isPreview ? 20 : 28,
      guidance: 3.5,
    };
  }

  if (model === "black-forest-labs/flux-dev") {
    // flux-dev: img2img when portrait provided
    return {
      prompt,
      ...(portraitUrl
        ? {
            image: portraitUrl,
            prompt_strength: 0.70, // 0.65–0.75 = good balance face vs scene
          }
        : {}),
      ...sharedQuality,
      num_inference_steps: isPreview ? 20 : 28,
      guidance: 3.5,
    };
  }

  // flux-schnell: fast testing (4 steps)
  return {
    prompt,
    ...(portraitUrl ? { image: portraitUrl } : {}),
    ...sharedQuality,
    num_inference_steps: 4,
    go_fast: true,
  };
}

// ─── Single page generation ───────────────────────────────────────────────────

export async function generateReplicatePage(
  params: ReplicatePageInput
): Promise<string> {
  const model = resolveModel();
  const client = getClient();
  const input = buildInput(model, params);

  console.log(
    `[Replicate] p${params.pageNumber} model=${model} seed=${params.seed ?? "random"}`
  );
  const t0 = Date.now();

  const output = await client.run(model, { input });

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`[Replicate] p${params.pageNumber} done in ${elapsed}s`);

  // Replicate SDK can return: FileOutput | FileOutput[] | string | string[]
  // FileOutput may expose URL as .url() method OR as .url string property
  const raw = Array.isArray(output) ? output[0] : output;

  if (raw == null) throw new Error("Replicate returned null output");

  // .url() method returns a URL object in newer SDK — extract .href
  if (typeof (raw as { url?: unknown }).url === "function") {
    const result = (raw as { url: () => URL | string }).url();
    return result instanceof URL ? result.href : String(result);
  }
  // .url string property
  if (typeof (raw as { url?: unknown }).url === "string") {
    return (raw as { url: string }).url;
  }
  // Plain string
  if (typeof raw === "string") return raw;

  // Last resort: toString / String coercion (works for FileOutput)
  const coerced = String(raw);
  if (coerced.startsWith("http")) return coerced;

  throw new Error(`Unexpected Replicate output type: ${typeof raw} value: ${coerced}`);
}

// ─── Batch page generation ────────────────────────────────────────────────────
// Generates pages in parallel batches to stay within API limits.
// Preview: 5 pages at once.  Full book: 6 at a time (4 batches × 6 = 24).

export async function generateReplicatePages(
  pages: ReplicatePageInput[],
  batchSize = 6
): Promise<ReplicatePageOutput[]> {
  const results: ReplicatePageOutput[] = [];
  const seed = pages[0]?.seed ?? Math.floor(Math.random() * 999999);

  // Inject shared seed so all pages share the same art style
  const pagesWithSeed = pages.map((p) => ({ ...p, seed: p.seed ?? seed }));

  for (let i = 0; i < pagesWithSeed.length; i += batchSize) {
    const batch = pagesWithSeed.slice(i, i + batchSize);
    console.log(
      `[Replicate] batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(pages.length / batchSize)} (pages ${batch[0].pageNumber}–${batch[batch.length - 1].pageNumber})`
    );

    const batchResults = await Promise.all(
      batch.map(async (p) => {
        try {
          const rawUrl = await generateReplicatePage(p);
          // Re-upload to Supabase immediately — Replicate CDN URLs expire in ~1h
          const folder = p.isPreview ? "previews" : "books";
          const imageUrl = await uploadReplicateImageToSupabase(
            rawUrl,
            `${folder}/page-${p.pageNumber}-${p.seed ?? Date.now()}.jpg`
          );
          return { pageNumber: p.pageNumber, imageUrl };
        } catch (err) {
          console.error(`[Replicate] page ${p.pageNumber} failed:`, err);
          return { pageNumber: p.pageNumber, imageUrl: `mock:replicate-error:${p.pageNumber}` };
        }
      })
    );

    results.push(...batchResults);
  }

  return results;
}

// ─── Upload Replicate URL → Supabase Storage ──────────────────────────────────
// Replicate CDN URLs expire after ~1 hour. For permanent storage we fetch the
// image bytes and re-upload to our own Supabase bucket.

export async function uploadReplicateImageToSupabase(
  imageUrl: string,
  path: string // e.g. "previews/{previewId}/page-1.jpg"
): Promise<string> {
  if (!imageUrl || imageUrl.startsWith("mock:")) return imageUrl;

  try {
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());

    const supabase = createServiceClient();
    const { error } = await supabase.storage
      .from("portraits") // reusing portraits bucket; switch to "illustrations" if preferred
      .upload(path, buffer, { contentType: "image/jpeg", upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from("portraits").getPublicUrl(path);
    return data.publicUrl;
  } catch (err) {
    console.warn(`[Replicate] upload to Supabase failed for ${path}:`, err);
    return imageUrl; // fall back to Replicate URL (expires in ~1h)
  }
}
