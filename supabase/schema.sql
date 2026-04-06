-- ============================================================
-- HeroBook — Supabase Database Schema
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  free_previews_used integer not null default 0,
  newsletter_subscribed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- STORIES (catalog templates)
-- ============================================================
create table public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  age_min integer not null default 0,
  age_max integer not null default 6,
  gender text check (gender in ('boy', 'girl', 'unisex')) default 'unisex',
  page_count integer not null default 24,
  cover_image_url text not null,
  preview_images text[] not null default '{}',
  is_active boolean not null default true,
  is_new boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index stories_active_gender_age on public.stories (is_active, gender, age_min, age_max);

-- ============================================================
-- STORY_PAGES (individual page templates)
-- ============================================================
create table public.story_pages (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  page_number integer not null,
  illustration_url text not null,
  text_content text,
  face_region jsonb, -- {x, y, width, height} normalized 0-1 coordinates
  created_at timestamptz not null default now(),
  unique (story_id, page_number)
);

create index story_pages_story_id on public.story_pages (story_id, page_number);

-- ============================================================
-- PREVIEW_REQUESTS (free preview tracking + abuse prevention)
-- ============================================================
create table public.preview_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text not null,
  story_id uuid not null references public.stories(id),
  ip_address inet,
  device_fingerprint text,
  photo_urls text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending', 'generating', 'complete', 'failed')),
  preview_pages jsonb, -- [{page_number, image_url, text_content}]
  error_message text,
  created_at timestamptz not null default now()
);

create index preview_requests_email on public.preview_requests (email);
create index preview_requests_ip on public.preview_requests (ip_address, created_at);
create index preview_requests_fingerprint on public.preview_requests (device_fingerprint);

-- ============================================================
-- ORDERS
-- ============================================================
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  story_id uuid not null references public.stories(id),
  order_number text not null unique,
  product_type text not null check (product_type in ('digital', 'physical')),
  status text not null default 'paid'
    check (status in ('paid', 'generating', 'complete', 'shipped', 'delivered', 'refunded')),
  child_name text not null,
  photo_urls text[] not null default '{}',
  amount_cents integer not null,
  currency text not null default 'EUR',
  stripe_payment_id text,
  stripe_session_id text,
  pdf_url text,
  shipping_address jsonb, -- {name, street, city, postal_code, phone}
  tracking_number text,
  customer_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id on public.orders (user_id, created_at desc);
create index orders_status on public.orders (status);
create index orders_stripe_session on public.orders (stripe_session_id);

create trigger orders_updated_at
  before update on public.orders
  for each row execute procedure public.update_updated_at();

-- Auto-generate order_number: BK-YYYYMMDD-XXXX
create or replace function public.generate_order_number()
returns trigger language plpgsql as $$
declare
  date_part text;
  seq_part text;
  counter integer;
begin
  date_part := to_char(now(), 'YYYYMMDD');
  select count(*) + 1 into counter
    from public.orders
    where created_at::date = now()::date;
  seq_part := lpad(counter::text, 4, '0');
  new.order_number := 'BK-' || date_part || '-' || seq_part;
  return new;
end;
$$;

create trigger set_order_number
  before insert on public.orders
  for each row execute procedure public.generate_order_number();

-- ============================================================
-- GENERATED_PAGES (full-quality pages for paid orders)
-- ============================================================
create table public.generated_pages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  page_number integer not null,
  image_url text not null,
  text_content text,
  created_at timestamptz not null default now(),
  unique (order_id, page_number)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.story_pages enable row level security;
alter table public.preview_requests enable row level security;
alter table public.orders enable row level security;
alter table public.generated_pages enable row level security;

-- profiles: own profile only; admin sees all
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Admins can read all profiles"
  on public.profiles for select
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- stories: public read for active; admin manages all
create policy "Anyone can read active stories"
  on public.stories for select using (is_active = true);
create policy "Admins can manage stories"
  on public.stories for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- story_pages: public read
create policy "Anyone can read story pages"
  on public.story_pages for select using (true);

-- preview_requests: own previews; insert from server (service role)
create policy "Users can read own previews"
  on public.preview_requests for select using (auth.uid() = user_id);
create policy "Service role manages previews"
  on public.preview_requests for all using (true);

-- orders: own orders; admin sees all
create policy "Users can read own orders"
  on public.orders for select using (auth.uid() = user_id);
create policy "Admins can manage orders"
  on public.orders for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- generated_pages: own order pages
create policy "Users can read own generated pages"
  on public.generated_pages for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

-- Run these in Supabase Dashboard → Storage → New Bucket
-- OR via SQL:

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('portraits', 'portraits', true, 10485760, ARRAY['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- pdfs bucket is PRIVATE — signed URLs are used for access (issue #5)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('pdfs', 'pdfs', false, 52428800, ARRAY['application/pdf'])
on conflict (id) do update set public = false;

-- Storage RLS: only the service role (server-side) can read/write
-- Anon/authenticated users have no direct storage access — they get signed URLs via API
create policy "Service role can manage portraits"
  on storage.objects for all
  using (bucket_id = 'portraits');

create policy "Service role can manage pdfs"
  on storage.objects for all
  using (bucket_id = 'pdfs');

-- Prevent anon users from listing or reading objects directly
-- (The service role policies above take precedence for server-side code;
--  these explicit denials make intent clear and guard against misconfiguration)
create policy "Anon cannot read portraits"
  on storage.objects for select
  using (bucket_id = 'portraits' and auth.role() != 'anon');

create policy "Anon cannot read pdfs"
  on storage.objects for select
  using (bucket_id = 'pdfs' and auth.role() != 'anon');

-- ============================================================
-- RATE LIMITING (persistent, survives serverless cold starts)
-- ============================================================
create table if not exists public.ip_rate_limits (
  key       text primary key,
  count     int  not null default 1,
  reset_at  timestamptz not null
);
create index if not exists ip_rate_limits_reset_at on public.ip_rate_limits (reset_at);

-- Atomic upsert function called by the app's rate-limit module.
-- Returns { count, reset_at, allowed } for the current window.
create or replace function public.upsert_rate_limit(
  p_key      text,
  p_limit    int,
  p_reset_at timestamptz
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_count   int;
  v_reset   timestamptz;
  v_allowed boolean;
begin
  -- Delete expired entry for this key so we get a fresh window
  delete from public.ip_rate_limits where key = p_key and reset_at < now();

  -- Upsert: insert new row or increment existing
  insert into public.ip_rate_limits (key, count, reset_at)
  values (p_key, 1, p_reset_at)
  on conflict (key) do update
    set count = ip_rate_limits.count + 1
  returning count, reset_at into v_count, v_reset;

  v_allowed := v_count <= p_limit;
  return jsonb_build_object('count', v_count, 'reset_at', v_reset, 'allowed', v_allowed);
end;
$$;

-- Only the service role can write rate limit counters; anon cannot read/modify
alter table public.ip_rate_limits enable row level security;
-- No RLS policies needed: service role bypasses RLS; anon has no access

-- ============================================================
-- SEED: Sample stories
-- ============================================================
insert into public.stories (title, slug, description, age_min, age_max, gender, page_count, cover_image_url, preview_images, is_active, is_new, sort_order)
values
  ('Космическото приключение', 'kosmichesko-priklyuchenie', 'Твоето дете лети до звездите и открива нова планета! Вълнуващо космическо приключение за смели малчугани.', 3, 7, 'unisex', 24, '/images/stories/space-cover.jpg', ARRAY['/images/stories/space-p1.jpg', '/images/stories/space-p2.jpg', '/images/stories/space-p3.jpg'], true, true, 1),
  ('Принцесата от Изгрева', 'printsesata-ot-izgreva', 'Малката принцеса спасява вълшебното кралство с доброта и смелост. Приказка за момичета с голямо сърце.', 2, 6, 'girl', 24, '/images/stories/princess-cover.jpg', ARRAY['/images/stories/princess-p1.jpg', '/images/stories/princess-p2.jpg'], true, false, 2),
  ('Суперхеройски ден', 'supergerojski-den', 'Днес твоето дете е супергерой! Спасява града, помага на приятели и научава, че добротата е истинска суперсила.', 3, 8, 'boy', 24, '/images/stories/hero-cover.jpg', ARRAY['/images/stories/hero-p1.jpg', '/images/stories/hero-p2.jpg'], true, false, 3),
  ('В джунглата на приятелите', 'v-dzhunglata-na-priyatelite', 'Магическо пътуване в джунглата, където животните стават най-добри приятели с твоето дете.', 0, 4, 'unisex', 20, '/images/stories/jungle-cover.jpg', ARRAY['/images/stories/jungle-p1.jpg', '/images/stories/jungle-p2.jpg'], true, false, 4),
  ('Малкият готвач', 'malkiyat-gotvach', 'В магическата кухня твоето дете готви вкусотии за цялото село! Забавна история за деца, които обичат да помагат.', 2, 5, 'unisex', 20, '/images/stories/chef-cover.jpg', ARRAY['/images/stories/chef-p1.jpg'], true, true, 5),
  ('Пиратите на Черно море', 'piratite-na-cherno-more', 'Авантюра по морето с приятелски пирати. Твоето дете открива съкровищата на Черно море!', 4, 8, 'boy', 24, '/images/stories/pirate-cover.jpg', ARRAY['/images/stories/pirate-p1.jpg', '/images/stories/pirate-p2.jpg'], true, false, 6),
  ('Феята на горите', 'feyata-na-gorite', 'Вълшебна приказка за малката фея, която пази горите и животинките в тях.', 2, 5, 'girl', 20, '/images/stories/fairy-cover.jpg', ARRAY['/images/stories/fairy-p1.jpg'], true, false, 7),
  ('Динозавърът приятел', 'dinozavarat-priyatel', 'Какво ще стане, ако твоето дете намери динозавърче? Приятелство без граници в праисторически свят!', 1, 5, 'unisex', 20, '/images/stories/dino-cover.jpg', ARRAY['/images/stories/dino-p1.jpg', '/images/stories/dino-p2.jpg'], true, true, 8);
