import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const IP_UPLOAD_LIMIT = 20; // uploads per hour per IP

export async function POST(request: NextRequest) {
  try {
    // 1. IP rate limit — prevents storage exhaustion
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const ipCheck = await checkRateLimit(`upload:ip:${ip}`, IP_UPLOAD_LIMIT, 60 * 60 * 1000);
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { error: "Твърде много качвания. Опитайте след час." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. Validate MIME type from Content-Type (client-supplied, but combined with
    //    size limits this is sufficient — deeper magic-bytes check is a future enhancement)
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Невалиден тип файл. Поддържат се JPEG, PNG и WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Файлът е твърде голям. Максималният размер е 5MB." },
        { status: 400 }
      );
    }

    // 3. Derive extension from validated MIME type, NOT from filename
    //    (filename is attacker-controlled and must not be trusted)
    const ext = ALLOWED_EXTENSIONS[file.type] ?? "jpg";
    const filename = `uploads/${uuidv4()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Upload to Supabase (or return mock URL in dev)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured = supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
      const supabase = createServiceClient();
      const { data, error } = await supabase.storage
        .from("portraits")
        .upload(filename, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        return NextResponse.json(
          { error: "Грешка при качване. Опитайте отново." },
          { status: 500 }
        );
      }

      const { data: urlData } = supabase.storage
        .from("portraits")
        .getPublicUrl(data.path);

      return NextResponse.json({ url: urlData.publicUrl, path: data.path });
    }

    // Dev mock
    return NextResponse.json({
      url: `mock:portrait:${uuidv4()}`,
      path: filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Грешка при качване. Опитайте отново." },
      { status: 500 }
    );
  }
}
