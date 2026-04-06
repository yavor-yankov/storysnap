/**
 * Checks Supabase: reads story UUIDs, verifies buckets exist.
 * Run: npx tsx scripts/check-supabase.ts
 */
import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const { createServiceClient } = await import("../src/lib/supabase/server");
  const sb = createServiceClient();

  // 1. Read stories
  console.log("── Stories ──");
  const { data: stories, error: storiesErr } = await sb
    .from("stories")
    .select("id, slug, title")
    .order("sort_order");
  if (storiesErr) { console.error("Stories error:", storiesErr.message); }
  else { stories?.forEach(s => console.log(`  ${s.slug}: ${s.id}`)); }

  // 2. Check storage buckets
  console.log("\n── Storage buckets ──");
  const { data: buckets, error: bucketsErr } = await sb.storage.listBuckets();
  if (bucketsErr) { console.error("Buckets error:", bucketsErr.message); }
  else { buckets?.forEach(b => console.log(`  ${b.id} (public=${b.public})`)); }

  // 3. Check preview_requests table exists
  console.log("\n── preview_requests count ──");
  const { count, error: prErr } = await sb
    .from("preview_requests")
    .select("*", { count: "exact", head: true });
  if (prErr) { console.error("preview_requests error:", prErr.message); }
  else { console.log(`  rows: ${count}`); }
}

main().catch(e => { console.error(e); process.exit(1); });
