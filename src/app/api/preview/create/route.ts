import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes for AI generation
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { generatePreviewPages } from "@/lib/ai/face-swap";
import { getStoryBySlug } from "@/lib/stories";

const schema = z.object({
  email: z.string().email(),
  childName: z.string().min(1).max(50),
  storySlug: z.string().min(1),
  photoUrls: z.array(z.string()).min(1).max(2),
  turnstileToken: z.string().optional(),
});

const PREVIEW_LIMIT_PER_EMAIL = 2;
const IP_LIMIT_PER_HOUR = 5;

// In-memory email tracking (use Supabase in production for persistence)
const emailPreviewCounts = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Невалидни данни." },
        { status: 400 }
      );
    }

    const { email, childName, storySlug, photoUrls, turnstileToken } = parsed.data;

    // 1. Verify Turnstile CAPTCHA (if configured)
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret && turnstileSecret !== "your-secret-key" && turnstileToken) {
      const verifyRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: turnstileSecret, response: turnstileToken }),
        }
      );
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return NextResponse.json(
          { error: "Потвърждението не бе успешно. Опитайте отново." },
          { status: 403 }
        );
      }
    }

    // 2. IP rate limit (5 previews per hour per IP)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const ipCheck = checkRateLimit(`preview:ip:${ip}`, IP_LIMIT_PER_HOUR, 60 * 60 * 1000);
    if (!ipCheck.allowed) {
      return NextResponse.json(
        {
          error: "Достигнахте лимита за безплатни прегледи от вашия IP адрес. Опитайте след час.",
          retryAfter: ipCheck.resetAt,
        },
        { status: 429 }
      );
    }

    // 3. Email preview limit (2 per email lifetime)
    // In production, check Supabase preview_requests table
    const emailCount = emailPreviewCounts.get(email.toLowerCase()) ?? 0;
    if (emailCount >= PREVIEW_LIMIT_PER_EMAIL) {
      return NextResponse.json(
        {
          error:
            "Достигнахте лимита от 2 безплатни прегледа на имейл. Закупете книжката, за да продължите.",
          limitReached: true,
        },
        { status: 403 }
      );
    }

    // 4. Get story
    const story = getStoryBySlug(storySlug);
    if (!story) {
      return NextResponse.json({ error: "Книжката не е намерена." }, { status: 404 });
    }

    // 5. Generate preview pages (mock or real Replicate)
    const previewId = crypto.randomUUID();

    // Update email count
    emailPreviewCounts.set(email.toLowerCase(), emailCount + 1);

    // Generate pages (simulated delay for realism)
    await new Promise((r) => setTimeout(r, 1500));

    const rawPages = await generatePreviewPages({
      storySlug,
      storyId: story.id,
      portraitUrls: photoUrls,
      childName,
      pageCount: 5,
    });

    const pages = rawPages.map((p) => ({
      page_number: p.pageNumber,
      image_url: p.imageUrl,
      text_content: p.textContent,
    }));

    return NextResponse.json({
      previewId,
      status: "complete",
      pages,
      storyTitle: story.title,
      childName,
      remainingPreviews: PREVIEW_LIMIT_PER_EMAIL - emailCount - 1,
    });
  } catch (error) {
    console.error("Preview creation error:", error);
    return NextResponse.json(
      { error: "Нещо се обърка. Опитайте отново." },
      { status: 500 }
    );
  }
}
