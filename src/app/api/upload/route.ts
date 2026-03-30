import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

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

    const supabase = createServiceClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `uploads/${uuidv4()}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try Supabase Storage — fall back to a mock URL in dev (no Supabase configured)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const isSupabaseConfigured =
      supabaseUrl && !supabaseUrl.includes("your-project");

    if (isSupabaseConfigured) {
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

    // Dev mock: return a placeholder URL
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
