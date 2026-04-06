/**
 * Distributed rate limiter backed by Supabase.
 *
 * Uses an `ip_rate_limits` table with upsert so counters survive serverless
 * cold starts and are shared across all function instances.
 *
 * Falls back to in-memory (best-effort) when Supabase is not configured,
 * so local dev without .env.local still works.
 *
 * Schema (add to supabase/schema.sql):
 *   CREATE TABLE IF NOT EXISTS ip_rate_limits (
 *     key       TEXT PRIMARY KEY,
 *     count     INT  NOT NULL DEFAULT 1,
 *     reset_at  TIMESTAMPTZ NOT NULL
 *   );
 *   -- Auto-clean expired rows (optional cron or pg_cron)
 *   CREATE INDEX IF NOT EXISTS ip_rate_limits_reset_at ON ip_rate_limits (reset_at);
 */

import { createServiceClient } from "@/lib/supabase/server";

// ── In-memory fallback (local dev only) ──────────────────────────────────────
interface RateEntry { count: number; resetAt: number }
const memStore = new Map<string, RateEntry>();
setInterval(() => {
  const now = Date.now();
  for (const [k, e] of memStore.entries()) if (e.resetAt < now) memStore.delete(k);
}, 60_000);

function memCheck(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const e = memStore.get(key);
  if (!e || e.resetAt < now) {
    memStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  if (e.count >= limit) return { allowed: false, remaining: 0, resetAt: e.resetAt };
  e.count++;
  return { allowed: true, remaining: limit - e.count, resetAt: e.resetAt };
}

// ── Bypass list for dev/testing ──────────────────────────────────────────────
// Set RATE_LIMIT_BYPASS_IPS=127.0.0.1,::1 in .env.local to skip limits for those IPs.
// Never set this in production.
function isBypassed(key: string): boolean {
  const bypass = process.env.RATE_LIMIT_BYPASS_IPS ?? "";
  if (!bypass) return false;
  const allowed = bypass.split(",").map((s) => s.trim()).filter(Boolean);
  return allowed.some((ip) => key.includes(ip));
}

// ── Distributed check via Supabase ───────────────────────────────────────────
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  // Bypass for dev/testing IPs
  if (isBypassed(key)) {
    return { allowed: true, remaining: limit, resetAt: Date.now() + windowMs };
  }

  // Fall back to in-memory when Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return memCheck(key, limit, windowMs);
  }

  try {
    const supabase = createServiceClient();
    const now = new Date();
    const resetAt = new Date(now.getTime() + windowMs);

    // Atomic upsert: insert count=1 on new key, increment on existing unexpired key
    const { data, error } = await supabase.rpc("upsert_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_reset_at: resetAt.toISOString(),
    });

    if (error) {
      // RPC not available yet (migration not run) — fall back gracefully
      console.warn("[RateLimit] upsert_rate_limit RPC unavailable, using in-memory fallback:", error.message);
      return memCheck(key, limit, windowMs);
    }

    // RPC returns { count, reset_at, allowed }
    const result = data as { count: number; reset_at: string; allowed: boolean };
    return {
      allowed: result.allowed,
      remaining: Math.max(0, limit - result.count),
      resetAt: new Date(result.reset_at).getTime(),
    };
  } catch (err) {
    console.warn("[RateLimit] Supabase error, using in-memory fallback:", err);
    return memCheck(key, limit, windowMs);
  }
}
