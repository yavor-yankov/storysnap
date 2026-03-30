// AI face-swap pipeline
// Mock mode for development — swap REPLICATE_API_TOKEN in .env.local to go live

export interface FaceSwapInput {
  storyId: string;
  pageNumber: number;
  illustrationUrl: string;
  portraitUrls: string[];
  childName: string;
  isPreview: boolean; // true = watermarked low-res, false = full quality
}

export interface FaceSwapResult {
  pageNumber: number;
  imageUrl: string; // URL saved to Supabase Storage
  textContent: string;
}

// Story page text content (placeholder — will come from DB)
const PAGE_TEXTS: Record<string, string[]> = {
  default: [
    "Имало едно време...",
    "Детето тръгнало на вълшебно приключение.",
    "По пътя срещнало нови приятели.",
    "Заедно преодолели трудностите.",
    "И всички живели щастливо.",
  ],
};

function getPageText(storySlug: string, pageNum: number): string {
  const texts = PAGE_TEXTS[storySlug] ?? PAGE_TEXTS.default;
  return texts[(pageNum - 1) % texts.length];
}

// Generates a color placeholder image as a data URL (used in mock mode)
// In production this is replaced by Replicate API call
async function generateMockPage(
  input: FaceSwapInput,
  gradientColors: [string, string]
): Promise<string> {
  // In mock mode we return a placeholder color identifier
  // The actual rendering happens client-side via CSS gradients
  return `mock:${gradientColors[0]}:${gradientColors[1]}:${input.pageNumber}`;
}

export async function generatePreviewPages(params: {
  storySlug: string;
  storyId: string;
  portraitUrls: string[];
  childName: string;
  pageCount?: number;
}): Promise<FaceSwapResult[]> {
  const { storySlug, storyId, childName, pageCount = 5 } = params;

  const replicateToken = process.env.REPLICATE_API_TOKEN;
  const useMock = !replicateToken || replicateToken === "r8_...";

  if (useMock) {
    return generateMockPages({ storySlug, storyId, childName, pageCount, isPreview: true });
  }

  // TODO: Real Replicate integration
  // return await generateWithReplicate(params);
  return generateMockPages({ storySlug, storyId, childName, pageCount, isPreview: true });
}

export async function generateFullPages(params: {
  storySlug: string;
  storyId: string;
  portraitUrls: string[];
  childName: string;
}): Promise<FaceSwapResult[]> {
  const { storySlug, storyId, childName } = params;

  const replicateToken = process.env.REPLICATE_API_TOKEN;
  const useMock = !replicateToken || replicateToken === "r8_...";

  if (useMock) {
    return generateMockPages({ storySlug, storyId, childName, pageCount: 24, isPreview: false });
  }

  // TODO: Real Replicate integration
  return generateMockPages({ storySlug, storyId, childName, pageCount: 24, isPreview: false });
}

function generateMockPages(params: {
  storySlug: string;
  storyId: string;
  childName: string;
  pageCount: number;
  isPreview: boolean;
}): FaceSwapResult[] {
  const { storySlug, childName, pageCount, isPreview } = params;
  const pages: FaceSwapResult[] = [];

  // Simulate processing delay (in real pipeline this would be async Replicate calls)
  for (let i = 1; i <= pageCount; i++) {
    pages.push({
      pageNumber: i,
      imageUrl: `mock:page:${storySlug}:${i}:${isPreview ? "preview" : "full"}`,
      textContent: getPageText(storySlug, i).replace("детето", childName),
    });
  }

  return pages;
}

// Real Replicate integration (to be activated when REPLICATE_API_TOKEN is set)
// async function generateWithReplicate(params: {...}): Promise<FaceSwapResult[]> {
//   const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
//   // Model: fofr/face-to-many or lucataco/ip-adapter-faceid
//   const output = await replicate.run("fofr/face-to-many:...", {
//     input: {
//       image: params.portraitUrls[0],
//       style: "Watercolor",
//       prompt: `children's book illustration, ${params.childName} as the hero`,
//       negative_prompt: "ugly, blurry, low quality",
//       num_outputs: params.pageCount,
//     }
//   });
//   ...
// }
