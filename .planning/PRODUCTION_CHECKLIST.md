# HeroBook — Production Checklist

## ✅ DONE (local)
- [x] Supabase project + schema deployed
- [x] Supabase Storage `portraits` bucket (public)
- [x] Resend API key configured
- [x] Cloudflare Turnstile keys configured
- [x] HuggingFace AI (free, working)
- [x] fal.ai IP-Adapter (production face-swap, needs credits)
- [x] PDF generation (210x210mm, print-ready)
- [x] Full 24-page story text for all 8 stories
- [x] Admin dashboard (orders + analytics)
- [x] Auth (Google OAuth + email/password)
- [x] Stripe keys + price IDs configured
- [x] Preview saves to Supabase `preview_requests` table (persistent rate limiting)
- [x] Portrait URLs flow: preview → order URL → checkout API → Stripe metadata → webhook
- [x] Webhook fully persists orders to Supabase `orders` table
- [x] PDF uploaded to Supabase Storage `pdfs` bucket after generation
- [x] `orders/[id]` API queries Supabase (not just in-memory)
- [x] Test PDF generator script: `npm run generate-pdf`

---

## 🔴 CRITICAL — Must complete before launch

### 1. Stripe (payments)
- [x] Stripe keys configured (`pk_test_`, `rk_test_`)
- [x] Price IDs set (`STRIPE_PRICE_DIGITAL`, `STRIPE_PRICE_PHYSICAL`)
- [ ] **Stripe webhook for local testing** — see `scripts/setup-stripe-webhook.md`:
  ```
  winget install Stripe.StripeCLI
  stripe login
  stripe listen --forward-to localhost:3000/api/stripe/webhook
  # Copy whsec_... → STRIPE_WEBHOOK_SECRET in .env.local
  ```
- [ ] After Vercel deploy: add webhook endpoint `https://yourdomain.com/api/stripe/webhook`
  - Events: `checkout.session.completed`
  - Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### 2. Domain + Vercel deployment
- [ ] Buy domain: `herobook.bg` (register at SuperHosting.bg or Superhosting.bg ~€15/yr)
- [ ] Create Vercel project: `vercel.com/new` → import from GitHub
- [ ] Add all `.env.local` values to Vercel Environment Variables
- [ ] Set `NEXT_PUBLIC_APP_URL=https://herobook.bg`
- [ ] Add custom domain in Vercel → configure DNS at registrar
- [ ] Enable Vercel Edge Functions for API routes (maxDuration 300s)

### 3. fal.ai credits for production
- [ ] Top up fal.ai balance at fal.ai/dashboard/billing
  - Suggested: €20-50 to start (~100-500 face-swap generations)
- [ ] The code already prioritises fal.ai over HuggingFace automatically

### 4. Admin protection
- [ ] Add `ADMIN_EMAIL=your@email.com` to env
- [ ] Protect `/admin/*` routes — check if logged-in user email matches ADMIN_EMAIL
  - Currently anyone can access /admin in dev
  - Quick fix: middleware check in `proxy.ts`

### 5. Email domain
- [ ] Add `herobook.bg` domain to Resend → verify DNS records
- [ ] Update `RESEND_FROM_EMAIL=noreply@herobook.bg`
- [ ] Test order confirmation email end-to-end

---

## 🟡 IMPORTANT — Before first real customer

### 6. Real book illustrations
- [ ] Commission 8 watercolor illustration sets (24 pages each) from a Bulgarian illustrator
  - Budget: ~€200-500 per book (or use AI-generated set as placeholder)
  - Formats: 1024x1024px minimum, JPG/PNG
- [ ] Upload to Supabase Storage `illustrations` bucket
- [ ] Update `story_pages` table in Supabase with real illustration URLs
- [ ] Update `STORY_STYLES` in `face-swap.ts` with real style descriptions per book

### 7. Supabase RLS hardening
- [ ] Review all RLS policies in `supabase/schema.sql`
- [ ] Test that unauthenticated users cannot read/write orders
- [ ] Enable Row Level Security on all tables (check `supabase dashboard → Table Editor → RLS`)

### 8. Rate limiting persistence
- [ ] Current rate limiting is in-memory (resets on server restart)
- [ ] For production: move `emailPreviewCounts` to Supabase `preview_requests` table
  - Already exists in schema, just needs to be wired up in `/api/preview/create/route.ts`

### 9. Error monitoring
- [ ] Add Sentry: `npm install @sentry/nextjs` + `npx @sentry/wizard@latest -i nextjs`
- [ ] Or use Vercel Analytics (free, built-in)

### 10. Legal pages
- [ ] `/privacy` — Privacy Policy (GDPR compliant, mention Supabase/Stripe/Resend)
- [ ] `/terms` — Terms of Service
- [ ] Cookie consent banner (Cloudflare Turnstile covers CAPTCHA, but cookies need consent)
- [ ] Add links to footer

---

## 🟢 NICE TO HAVE — Post-launch improvements

### Performance
- [ ] Fix AI generation speed (biggest UX pain point)
  - Option A: Queue-based — generate in background, email user when ready
  - Option B: Switch to faster model (`fal-ai/flux-schnell` ~3s/image)
  - Option C: Pre-generate sample pages per story, only face-swap the hero

### Features
- [ ] Real book covers (uploaded to Supabase, shown in catalog)
- [ ] Customer reviews system
- [ ] Gift cards / promo codes (Stripe Promotion Codes)
- [ ] Multi-language support (EN for expats)
- [ ] WhatsApp/Viber support button

### Printing company integration
- [ ] Contact printing companies:
  - **Print Express Bulgaria** (printexpressbg.com)
  - **Color Print** (colorprint.bg)
  - **Artprint** (artprint.bg)
- [ ] Get specs: paper type, trim size, bleed, file format requirements
- [ ] Current PDF: 210x210mm square, RGB — confirm they accept this
- [ ] Consider adding crop marks and bleed area to PDF

---

## 📦 PDF READY TO SEND TO PRINTER

The current PDF generator creates:
- **Size**: 210x210mm (square children's book)
- **Cover**: HeroBook orange with title, child name, spine
- **Pages**: AI illustration (72% height) + story text (28% bottom)
- **Back cover**: Dark brown with HeroBook branding

**To generate a sample PDF for the printer:**
1. Complete the create flow with a real photo (HuggingFace will generate images)
2. Place a test order (dev mode skips Stripe)
3. The PDF is generated in `/api/stripe/webhook` (or call `generateBookPdf` directly)
4. Download from `/order/success` page

**To trigger PDF generation without payment flow:**
```bash
# Using the built-in script:
npm run generate-pdf kosmichesko-priklyuchenie "Ивана" ./test-books/ivana-space.pdf
npm run generate-pdf supergerojski-den "Никола" ./test-books/nikola-hero.pdf
npm run generate-pdf printsesata-ot-izgreva "Мария" ./test-books/maria-princess.pdf
```
This uses HuggingFace (free) and takes ~2-5 minutes per book.

---

## 🔑 Environment Variables Summary

| Variable | Status | Where to get |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Set | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Set | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Set | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ⏳ Pending | Stripe Dashboard → Developers → API Keys |
| `STRIPE_SECRET_KEY` | ⏳ Pending | Stripe Dashboard → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | ⏳ Pending | After deploy: Stripe Dashboard → Webhooks |
| `STRIPE_PRICE_DIGITAL` | ⏳ Pending | Stripe Dashboard → Product Catalog |
| `STRIPE_PRICE_PHYSICAL` | ⏳ Pending | Stripe Dashboard → Product Catalog |
| `FAL_KEY` | ✅ Set (no credits) | fal.ai → Dashboard → API Keys |
| `HF_TOKEN` | ✅ Set | huggingface.co → Settings → Access Tokens |
| `RESEND_API_KEY` | ✅ Set | resend.com → API Keys |
| `RESEND_FROM_EMAIL` | ⚠️ Sandbox | Add domain to Resend |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✅ Set | Cloudflare → Turnstile |
| `TURNSTILE_SECRET_KEY` | ✅ Set | Cloudflare → Turnstile |
| `NEXT_PUBLIC_APP_URL` | ⏳ Update after deploy | Your production domain |
