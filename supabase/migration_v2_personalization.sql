-- ============================================================
-- HeroBook — Migration v2: Personalization
-- Adds child attributes + rich template columns
-- Safe to re-run — all statements use IF NOT EXISTS / DO blocks
-- ============================================================

-- ============================================================
-- 1. CHILD ATTRIBUTES on preview_requests
-- ============================================================
-- Shape: { hairColor, hairStyle, eyeColor, skinTone, favoriteColor,
--          interests, personalityTraits, dedication }
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'preview_requests'
      and column_name  = 'child_attributes'
  ) then
    alter table public.preview_requests add column child_attributes jsonb;
  end if;
end $$;

-- child_name is needed by the webhook when copying from preview → order
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'preview_requests'
      and column_name  = 'child_name'
  ) then
    alter table public.preview_requests add column child_name text;
  end if;
end $$;

-- child_age + child_gender on preview_requests (if not already there)
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'preview_requests'
      and column_name  = 'child_age'
  ) then
    alter table public.preview_requests add column child_age integer;
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'preview_requests'
      and column_name  = 'child_gender'
  ) then
    alter table public.preview_requests
      add column child_gender text check (child_gender in ('boy', 'girl', 'unisex'));
  end if;
end $$;

-- ============================================================
-- 2. CHILD ATTRIBUTES on orders
-- ============================================================
-- Copied from preview_request at checkout so it's permanently on the order.
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'orders'
      and column_name  = 'child_attributes'
  ) then
    alter table public.orders add column child_attributes jsonb;
  end if;
end $$;

-- child_age + child_gender on orders (previously only in Stripe metadata)
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'orders'
      and column_name  = 'child_age'
  ) then
    alter table public.orders add column child_age integer;
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'orders'
      and column_name  = 'child_gender'
  ) then
    alter table public.orders
      add column child_gender text check (child_gender in ('boy', 'girl', 'unisex'));
  end if;
end $$;

-- ============================================================
-- 3. RICH TEMPLATE COLUMNS on stories
-- ============================================================

-- Large hero image used on the catalog card (e.g. Flux-generated branded art)
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'stories'
      and column_name  = 'hero_image_url'
  ) then
    alter table public.stories add column hero_image_url text;
  end if;
end $$;

-- Smaller variant used in dropdowns / search results
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'stories'
      and column_name  = 'card_image_url'
  ) then
    alter table public.stories add column card_image_url text;
  end if;
end $$;

-- One-liner tagline shown under the title on catalog cards
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'stories'
      and column_name  = 'summary_short'
  ) then
    alter table public.stories add column summary_short text;
  end if;
end $$;

-- e.g. ARRAY['Adventure','Animals','Friendship']
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'stories'
      and column_name  = 'tags'
  ) then
    alter table public.stories add column tags text[] not null default '{}';
  end if;
end $$;

-- Bulgarian teaser (3–5 sentences) shown on the catalog page
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'stories'
      and column_name  = 'sample_first_page'
  ) then
    alter table public.stories add column sample_first_page text;
  end if;
end $$;

-- Story skeleton passed to Claude/Groq so every order of the same template
-- has the same beats but different details.
-- Shape: [{ page: number, beat: string, image_concept: string }]
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'stories'
      and column_name  = 'seed_prompts'
  ) then
    alter table public.stories add column seed_prompts jsonb;
  end if;
end $$;

-- Tone/style guidance injected into the Claude system prompt for this template
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'stories'
      and column_name  = 'style_notes'
  ) then
    alter table public.stories add column style_notes text;
  end if;
end $$;

-- Pool of variation "twists" — one is picked at random per order so no two
-- orders of the same template are identical.
-- Shape: string[]  (each entry is a 1-2 sentence variation instruction)
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'stories'
      and column_name  = 'variation_twists'
  ) then
    alter table public.stories
      add column variation_twists text[] not null default '{}';
  end if;
end $$;

-- ============================================================
-- 4. INDEX: fast tag filtering
-- ============================================================
create index if not exists stories_tags on public.stories using gin (tags);
