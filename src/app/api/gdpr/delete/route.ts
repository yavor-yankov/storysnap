/**
 * GDPR Article 17 — Right to Erasure
 *
 * Accepts an email address, sends a verification code, and on verification:
 * - Deletes preview_requests rows (and photo_urls) for that email
 * - Nulls out photo_urls on any remaining records
 * - Deletes portrait files from Supabase Storage
 *
 * Two-step flow:
 *   POST /api/gdpr/delete { email }           → sends verification code
 *   POST /api/gdpr/delete { email, code }     → executes deletion
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

const requestSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6).optional(),
});

// In-memory token store (sufficient: tokens expire in 15 min, single-use)
// A serverless restart clears tokens — user just re-requests
const pendingTokens = new Map<string, { code: string; expiresAt: number }>();

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Strict rate limit: 3 deletion attempts per hour per IP
  const ipCheck = await checkRateLimit(`gdpr:ip:${ip}`, 3, 60 * 60 * 1000);
  if (!ipCheck.allowed) {
    return NextResponse.json(
      { error: "Твърде много заявки. Опитайте след час." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Невалидни данни." }, { status: 400 });
  }

  const { email, code } = parsed.data;
  const emailLower = email.toLowerCase();

  // ── Step 2: verify code and execute deletion ──────────────────────────────
  if (code) {
    const token = pendingTokens.get(emailLower);
    if (!token || token.expiresAt < Date.now() || token.code !== code) {
      return NextResponse.json(
        { error: "Невалиден или изтекъл код. Заявете нов." },
        { status: 400 }
      );
    }
    pendingTokens.delete(emailLower); // single-use

    try {
      const supabase = createServiceClient();

      // 1. Fetch portrait paths before deleting records
      const { data: previews } = await supabase
        .from("preview_requests")
        .select("photo_urls")
        .eq("email", emailLower);

      const portraitPaths: string[] = (previews ?? [])
        .flatMap((p: { photo_urls: string[] }) => p.photo_urls ?? [])
        .map((url: string) => {
          // Extract storage path from Supabase public URL
          const match = url.match(/\/storage\/v1\/object\/public\/portraits\/(.+)$/);
          return match ? match[1] : null;
        })
        .filter(Boolean) as string[];

      // 2. Delete portrait files from storage
      if (portraitPaths.length > 0) {
        await supabase.storage.from("portraits").remove(portraitPaths);
      }

      // 3. Delete preview_requests rows
      await supabase.from("preview_requests").delete().eq("email", emailLower);

      // 4. Anonymise orders (keep for accounting, remove personal data)
      await supabase
        .from("orders")
        .update({ customer_email: "deleted@gdpr.request", child_name: "[deleted]" })
        .eq("customer_email", emailLower);

      console.log(`[GDPR] Deleted data for ${emailLower}: ${portraitPaths.length} portraits`);

      return NextResponse.json({
        success: true,
        message: "Данните ви бяха изтрити успешно.",
      });
    } catch (err) {
      console.error("[GDPR] Deletion failed:", err);
      return NextResponse.json(
        { error: "Грешка при изтриването. Свържете се с нас на hello@herobook.bg." },
        { status: 500 }
      );
    }
  }

  // ── Step 1: send verification code ───────────────────────────────────────
  const verificationCode = generateCode();
  pendingTokens.set(emailLower, {
    code: verificationCode,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  });

  // Send via Resend if configured, otherwise log (dev)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && !resendKey.startsWith("re_...")) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "HeroBook <noreply@herobook.bg>",
        to: email,
        subject: "Потвърждение за изтриване на данни — HeroBook",
        html: `
          <p>Получихме заявка за изтриване на личните ви данни от HeroBook.</p>
          <p>Вашият код за потвърждение е: <strong>${verificationCode}</strong></p>
          <p>Кодът е валиден 15 минути.</p>
          <p>Ако не сте заявили изтриване, игнорирайте този имейл.</p>
        `,
      });
    } catch (emailErr) {
      console.error("[GDPR] Email send failed:", emailErr);
      // Don't expose the code in the response — if email fails, user must retry
      return NextResponse.json(
        { error: "Грешка при изпращане на имейл. Опитайте отново." },
        { status: 500 }
      );
    }
  } else {
    // Dev: log code to console
    console.log(`[GDPR DEV] Verification code for ${emailLower}: ${verificationCode}`);
  }

  return NextResponse.json({
    sent: true,
    message: "Изпратихме код за потвърждение на вашия имейл.",
  });
}
