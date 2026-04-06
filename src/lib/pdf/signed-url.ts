import { createServiceClient } from "@/lib/supabase/server";

/**
 * Resolves a "supabase-storage:pdfs/<path>" internal reference to a real signed URL.
 * @param rawUrl  - the value stored in orders.pdf_url
 * @param ttlSeconds - how long the signed URL should be valid (default 1 hour)
 * @param childName / storyTitle - used to set the download filename
 */
export async function resolveSignedPdfUrl(
  rawUrl: string | null | undefined,
  ttlSeconds = 3600,
  childName?: string,
  storyTitle?: string
): Promise<string | null> {
  if (!rawUrl) return null;
  if (!rawUrl.startsWith("supabase-storage:pdfs/")) return rawUrl; // legacy or mock

  const storagePath = rawUrl.replace("supabase-storage:pdfs/", "");

  const safe = (s: string) =>
    s.replace(/[^a-zA-Z0-9а-яА-ЯёЁ\s\-]/gu, "").trim();
  const filename =
    childName && storyTitle
      ? `HeroBook - ${safe(storyTitle)} - ${safe(childName)}.pdf`
      : "HeroBook.pdf";

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.storage
      .from("pdfs")
      .createSignedUrl(storagePath, ttlSeconds, { download: filename });
    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}
