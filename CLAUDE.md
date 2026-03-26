@AGENTS.md

# PicTale — AI Portrait-to-Book Web App

## Project Overview

PicTale is a web app where users upload portrait photos and get AI-generated illustrated books. Users choose an art style (comic, anime, watercolor, manga, storybook, pop-art), a short story is generated featuring their character, and the result is a downloadable book with illustrations.

## Tech Stack

- **Framework:** Next.js 15+ (App Router, Server Actions, TypeScript)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Auth:** NextAuth.js v4 (credentials + optional OAuth)
- **Database:** SQLite via Prisma ORM (schema in prisma/schema.prisma)
- **AI Images:** Mock mode for dev (src/lib/ai/image-generator.ts) — pluggable for Replicate later
- **AI Stories:** Mock story generation for dev (src/lib/ai/story-generator.ts) — pluggable for Claude API later
- **Email:** React Email templates (preview mode, no sending in dev)
- **Payments:** Stripe test mode
- **Storage:** Local filesystem (public/uploads/, public/books/)
- **PDF:** @react-pdf/renderer
- **Animations:** framer-motion

## IMPORTANT: Read Next.js Docs First

This uses Next.js 16+ which has breaking changes. Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/01-app/` to understand current APIs.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth endpoints
│   │   ├── books/         # Book CRUD
│   │   ├── upload/        # Portrait upload
│   │   ├── generate/      # AI generation trigger
│   │   └── stripe/        # Stripe webhooks
│   ├── auth/              # Auth pages (signin, signup)
│   ├── create/            # Book creation flow
│   │   ├── upload/        # Step 1: Upload portrait
│   │   ├── style/         # Step 2: Choose art style
│   │   ├── generate/      # Step 3: Generate book
│   │   └── preview/       # Step 4: Preview result
│   ├── dashboard/         # User dashboard
│   │   ├── books/         # My books list
│   │   ├── settings/      # Account settings
│   │   └── [bookId]/      # Individual book detail
│   ├── book/[bookId]/     # Public book viewer
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── layout/            # Header, Footer, Sidebar, Navigation
│   ├── landing/           # Hero, Features, Pricing, Testimonials
│   ├── upload/            # PortraitUploader, StyleSelector
│   ├── book/              # BookViewer, PageFlip, BookCard
│   ├── dashboard/         # BooksList, StatsCards, OrderHistory
│   └── auth/              # SignInForm, SignUpForm
├── lib/
│   ├── ai/
│   │   ├── image-generator.ts  # Mock + pluggable real AI
│   │   └── story-generator.ts  # Mock + pluggable Claude API
│   ├── book/
│   │   └── assembler.ts        # Combine images + story into book
│   ├── email/
│   │   └── templates.tsx        # React Email templates
│   ├── payments/
│   │   └── stripe.ts           # Stripe client + helpers
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth config
│   └── utils.ts                # cn() helper, misc utils
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── generated/prisma/      # Prisma generated client
```

## Database Schema

Already set up in prisma/schema.prisma with models:
- **User** — auth, credits (3 free to start)
- **Account/Session/VerificationToken** — NextAuth
- **Book** — title, artStyle, status, portraitUrl, coverUrl, pdfUrl
- **BookPage** — pageNum, imageUrl, text, prompt
- **Order** — Stripe billing

## Design Requirements

- **Visually aesthetic** — modern, clean, with gradients and subtle animations
- **Color palette:** Deep purple/indigo primary, warm accent colors
- **Dark mode support**
- **Mobile-first responsive design**
- **Smooth page transitions with framer-motion**
- **Professional landing page** with hero, features grid, pricing cards, testimonials
- **Book creation flow** should feel like a wizard/stepper

## Art Styles to Support

1. **Comic Book** — Bold lines, halftone dots, vibrant colors
2. **Anime/Manga** — Japanese animation style
3. **Watercolor** — Soft, painterly style
4. **Storybook** — Classic children's book illustration
5. **Pop Art** — Bold, Warhol-inspired
6. **Pixel Art** — Retro game style

## Mock AI Services

Since we're in local/free dev mode:

### Image Generator (src/lib/ai/image-generator.ts)
- Mock mode: Return placeholder colored SVGs or gradient images per art style
- Each style should produce visually distinct placeholder images
- Interface should be pluggable for Replicate/DALL-E later:
  ```typescript
  interface ImageGenerator {
    generateCharacter(portraitUrl: string, style: ArtStyle): Promise<string>
    generateScene(character: string, scene: string, style: ArtStyle): Promise<string>
  }
  ```

### Story Generator (src/lib/ai/story-generator.ts)
- Mock mode: Return pre-written short stories (6-8 pages) with different themes
- Each story should have: title, character name placeholder, 6-8 page texts
- Interface for Claude API later:
  ```typescript
  interface StoryGenerator {
    generateStory(characterName: string, style: ArtStyle): Promise<Story>
  }
  ```

## Build Phases (in order)

### Phase 1: Foundation
- [x] Next.js project initialized
- [x] Dependencies installed
- [x] Prisma schema + SQLite migration done
- [x] Folder structure created
- [ ] Set up shadcn/ui (run: npx shadcn@latest init, then add button, card, input, label, badge, dialog, dropdown-menu, avatar, separator, tabs, toast, skeleton)
- [ ] Create lib/prisma.ts (Prisma client singleton)
- [ ] Create lib/utils.ts (cn helper)
- [ ] Create lib/auth.ts (NextAuth config with credentials provider + Prisma adapter)
- [ ] Create API route: api/auth/[...nextauth]/route.ts
- [ ] Create auth pages (signin, signup) with forms
- [ ] Create root layout with providers (SessionProvider, ThemeProvider)
- [ ] Create Header component (logo, nav, auth buttons)
- [ ] Create Footer component

### Phase 2: Landing Page
- [ ] Hero section with animated headline, CTA, and sample book preview
- [ ] "How it Works" section (3-step visual: Upload → Choose Style → Get Book)
- [ ] Features grid (6 art styles with preview thumbnails)
- [ ] Pricing section (Free: 3 books, Pro: unlimited)
- [ ] Testimonials/social proof section
- [ ] Final CTA section

### Phase 3: Book Creation Flow
- [ ] Create portrait upload page with react-dropzone
- [ ] Create art style selection page (grid of style cards with previews)
- [ ] Create generation page (progress UI, mock AI pipeline)
- [ ] Create lib/ai/image-generator.ts (mock mode)
- [ ] Create lib/ai/story-generator.ts (mock mode with pre-written stories)
- [ ] Create lib/book/assembler.ts (combine images + story into BookPage records)
- [ ] Create book preview page with page-flip viewer
- [ ] Save book to database through the flow

### Phase 4: PDF & Book Viewer
- [ ] Create PDF generation with @react-pdf/renderer
- [ ] Create public book viewer page (book/[bookId])
- [ ] Add download PDF button
- [ ] Create BookCard component for dashboard

### Phase 5: Dashboard
- [ ] User dashboard layout with sidebar
- [ ] "My Books" page with book grid
- [ ] Individual book detail page
- [ ] Account settings page
- [ ] Order history

### Phase 6: Billing
- [ ] Create lib/payments/stripe.ts
- [ ] Stripe checkout for per-book purchase
- [ ] Credit system (3 free, buy more)
- [ ] Stripe webhook handler
- [ ] Purchase flow integrated into book creation

### Phase 7: Email
- [ ] Welcome email template
- [ ] Book ready notification template
- [ ] Receipt/payment confirmation template
- [ ] React Email preview setup

### Phase 8: Polish
- [ ] framer-motion page transitions
- [ ] Loading skeletons everywhere
- [ ] Error boundaries and error pages
- [ ] Mobile responsive pass on all pages
- [ ] Dark mode toggle
- [ ] SEO meta tags and OG images
- [ ] Git commit and push to GitHub after each phase

## Commands

```bash
npm run dev          # Start dev server
npx prisma studio   # Browse database
npx prisma migrate dev --name <name>  # New migration
```

## Environment

- .env.local already configured for local dev
- SQLite database at prisma/dev.db
- All file storage in public/ directory

## Git

- Repo: https://github.com/yavor-yankov/storysnap
- Commit after completing each phase
- Push all changes when done

## Important Notes

- ALWAYS run `npm run build` after major changes to verify no errors
- ALWAYS test that `npm run dev` works
- Use Server Actions for form submissions where possible
- Use Server Components by default, Client Components only when needed
- Keep the design visually stunning — this is a creative product
- Mock AI services should still produce visually interesting output (colorful placeholders, not gray boxes)
