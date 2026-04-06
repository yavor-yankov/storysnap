import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Call at the top of every /api/admin/* route handler.
 * Returns null if the caller is an authorised admin.
 * Returns a 401/403 NextResponse if not — the caller must return it immediately.
 */
export async function requireAdminApi(): Promise<NextResponse | null> {
  // Skip auth when Supabase is not configured (local dev without .env.local)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allowedEmails.length === 0 || !allowedEmails.includes(user.email?.toLowerCase() ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null; // authorised
}
