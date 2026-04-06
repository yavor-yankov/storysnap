import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes for AI generation

import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { generatePreviewPages } from "@/lib/ai/face-swap";
import { generateStory } from "@/lib/story/generator";
import { getStoryBySlug } from "@/lib/stories";
import { createServiceClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email(),
  childName: z.string().min(1).max(50),
  storySlug: z.string().min(1),
  photoUrls: z.array(z.string()).min(1).max(2),
  turnstileToken: z.string().optional(),
  childAge: z.number().int().min(1).max(12).optional(),
  childGender: z.enum(["boy", "girl", "unisex"]).optional(),
});

const PREVIEW_LIMIT_PER_EMAIL = 2;
const IP_LIMIT_PER_HOUR = 5;
const PREVIEW_PAGE_COUNT = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Невалидни данни." }, { status: 400 });
    }

    const { email, childName, storySlug, photoUrls, turnstileToken, childAge, childGender } = parsed.data;

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

    // 2. IP rate limit
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const ipCheck = await checkRateLimit(`preview:ip:${ip}`, IP_LIMIT_PER_HOUR, 60 * 60 * 1000);
    if (!ipCheck.allowed) {
      return NextResponse.json(
        {
          error: "Достигнахте лимита за безплатни прегледи от вашия IP адрес. Опитайте след час.",
          retryAfter: ipCheck.resetAt,
        },
        { status: 429 }
      );
    }

    // 3. Lookup story
    const story = getStoryBySlug(storySlug);
    if (!story) {
      return NextResponse.json({ error: "Книжката не е намерена." }, { status: 404 });
    }

    // 4. Email preview limit (Supabase — persistent)
    // PREVIEW_BYPASS_EMAILS: comma-separated emails that skip the limit (DEV ONLY)
    const bypassEmails = (process.env.PREVIEW_BYPASS_EMAILS ?? "")
      .split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
    const emailBypassed = bypassEmails.includes(email.toLowerCase());

    const supabase = createServiceClient();
    let emailCount = 0;
    let remainingPreviews = PREVIEW_LIMIT_PER_EMAIL;

    if (!emailBypassed) {
      try {
        const { count } = await supabase
          .from("preview_requests")
          .select("*", { count: "exact", head: true })
          .eq("email", email.toLowerCase())
          .eq("status", "complete");

        emailCount = count ?? 0;
        if (emailCount >= PREVIEW_LIMIT_PER_EMAIL) {
          return NextResponse.json(
            {
              error: "Достигнахте лимита от 2 безплатни прегледа. Закупете книжката, за да продължите.",
              limitReached: true,
            },
            { status: 403 }
          );
        }
        remainingPreviews = PREVIEW_LIMIT_PER_EMAIL - emailCount - 1;
      } catch (dbErr) {
        console.warn("[Preview] DB limit check skipped:", dbErr);
      }
    }

    // 5. Create preview_request record
    let previewId = crypto.randomUUID();
    try {
      const { data: rec, error } = await supabase
        .from("preview_requests")
        .insert({
          email: email.toLowerCase(),
          story_id: story.id,
          photo_urls: photoUrls,
          status: "generating",
          ip_address: ip === "unknown" ? null : ip,
        })
        .select("id")
        .single();

      if (!error && rec?.id) previewId = rec.id;
    } catch (dbErr) {
      console.warn("[Preview] DB insert skipped:", dbErr);
    }

    // 6. Generate personalized story (5 pages for preview)
    //    Claude writes the text + per-page Flux image prompts.
    //    Falls back to predefined texts if ANTHROPIC_API_KEY not set.
    console.log(`[Preview] Generating story for "${childName}" / ${storySlug}`);
    const storyPages = await generateStory({
      childName,
      storySlug,
      storyTitle: story.title,
      pageCount: PREVIEW_PAGE_COUNT,
      childAge: childAge ?? 4,
      childGender: childGender ?? "unisex",
    });

    // 7. Generate AI illustrations
    //    Provider priority: Replicate → fal.ai → HuggingFace → mock
    console.log(`[Preview] Generating ${PREVIEW_PAGE_COUNT} illustrations…`);
    const rawPages = await generatePreviewPages({
      storySlug,
      storyId: story.id,
      portraitUrls: photoUrls,
      childName,
      pageCount: PREVIEW_PAGE_COUNT,
      storyPages, // pass pre-generated prompts straight through
    });

    const pages = rawPages.map((p) => ({
      page_number: p.pageNumber,
      image_url: p.imageUrl,
      text_content: p.textContent,
    }));

    // 8. Persist completed preview to Supabase
    try {
      await supabase
        .from("preview_requests")
        .update({ status: "complete", preview_pages: pages })
        .eq("id", previewId);
    } catch (dbErr) {
      console.warn("[Preview] DB update skipped:", dbErr);
    }

    return NextResponse.json({
      previewId,
      status: "complete",
      pages,
      storyTitle: story.title,
      childName,
      remainingPreviews,
    });
  } catch (error) {
    console.error("[Preview] Error:", error);
    return NextResponse.json({ error: "Нещо се обърка. Опитайте отново." }, { status: 500 });
  }
}
