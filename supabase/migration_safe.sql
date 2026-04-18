-- ============================================================
-- HeroBook — Safe Migration (run on existing DB)
-- Uses IF NOT EXISTS everywhere — safe to re-run
-- v2 additions at the bottom (migration_v2_personalization.sql)
-- ============================================================

-- ============================================================
-- STORIES
-- ============================================================
create table if not exists public.stories (
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

create index if not exists stories_active_gender_age on public.stories (is_active, gender, age_min, age_max);

-- ============================================================
-- STORY_PAGES
-- ============================================================
create table if not exists public.story_pages (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  page_number integer not null,
  illustration_url text not null,
  text_content text,
  face_region jsonb,
  created_at timestamptz not null default now(),
  unique (story_id, page_number)
);

create index if not exists story_pages_story_id on public.story_pages (story_id, page_number);

-- ============================================================
-- PREVIEW_REQUESTS
-- ============================================================
create table if not exists public.preview_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text not null,
  story_id uuid not null references public.stories(id),
  ip_address inet,
  device_fingerprint text,
  photo_urls text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending', 'generating', 'complete', 'failed')),
  preview_pages jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists preview_requests_email on public.preview_requests (email);
create index if not exists preview_requests_ip on public.preview_requests (ip_address, created_at);
create index if not exists preview_requests_fingerprint on public.preview_requests (device_fingerprint);

-- ============================================================
-- ORDERS
-- ============================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  story_id uuid not null references public.stories(id),
  order_number text not null unique,
  product_type text not null check (product_type in ('digital', 'physical')),
  status text not null default 'paid'
    check (status in ('paid', 'generating', 'complete', 'shipped', 'delivered', 'refunded', 'failed')),
  child_name text not null,
  photo_urls text[] not null default '{}',
  amount_cents integer not null,
  currency text not null default 'EUR',
  stripe_payment_id text,
  stripe_session_id text,
  pdf_url text,
  shipping_address jsonb,
  tracking_number text,
  customer_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id on public.orders (user_id, created_at desc);
create index if not exists orders_status on public.orders (status);
create index if not exists orders_stripe_session on public.orders (stripe_session_id);

-- update_updated_at trigger function (shared)
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Only create trigger if it doesn't exist
do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'orders_updated_at'
  ) then
    create trigger orders_updated_at
      before update on public.orders
      for each row execute procedure public.update_updated_at();
  end if;
end $$;

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

do $$ begin
  if not exists (
    select 1 from pg_trigger where tgname = 'set_order_number'
  ) then
    create trigger set_order_number
      before insert on public.orders
      for each row execute procedure public.generate_order_number();
  end if;
end $$;

-- ============================================================
-- GENERATED_PAGES
-- ============================================================
create table if not exists public.generated_pages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  page_number integer not null,
  image_url text not null,
  text_content text,
  created_at timestamptz not null default now(),
  unique (order_id, page_number)
);

-- ============================================================
-- RLS (enable — safe if already enabled)
-- ============================================================
alter table public.stories enable row level security;
alter table public.story_pages enable row level security;
alter table public.preview_requests enable row level security;
alter table public.orders enable row level security;
alter table public.generated_pages enable row level security;

-- Drop and recreate policies (idempotent)
drop policy if exists "Anyone can read active stories" on public.stories;
create policy "Anyone can read active stories"
  on public.stories for select using (is_active = true);

drop policy if exists "Admins can manage stories" on public.stories;
create policy "Admins can manage stories"
  on public.stories for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Anyone can read story pages" on public.story_pages;
create policy "Anyone can read story pages"
  on public.story_pages for select using (true);

drop policy if exists "Users can read own previews" on public.preview_requests;
create policy "Users can read own previews"
  on public.preview_requests for select using (auth.uid() = user_id);

drop policy if exists "Service role manages previews" on public.preview_requests;
create policy "Service role manages previews"
  on public.preview_requests for all using (true);

drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders"
  on public.orders for select using (auth.uid() = user_id);

drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders"
  on public.orders for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Users can read own generated pages" on public.generated_pages;
create policy "Users can read own generated pages"
  on public.generated_pages for select
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portraits', 'portraits', true, 10485760, ARRAY['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pdfs', 'pdfs', false, 52428800, ARRAY['application/pdf'])
on conflict (id) do update set public = false;

drop policy if exists "Service role can manage portraits" on storage.objects;
create policy "Service role can manage portraits"
  on storage.objects for all
  using (bucket_id = 'portraits');

drop policy if exists "Service role can manage pdfs" on storage.objects;
create policy "Service role can manage pdfs"
  on storage.objects for all
  using (bucket_id = 'pdfs');

drop policy if exists "Anon cannot read portraits" on storage.objects;
create policy "Anon cannot read portraits"
  on storage.objects for select
  using (bucket_id = 'portraits' and auth.role() != 'anon');

drop policy if exists "Anon cannot read pdfs" on storage.objects;
create policy "Anon cannot read pdfs"
  on storage.objects for select
  using (bucket_id = 'pdfs' and auth.role() != 'anon');

-- ============================================================
-- RATE LIMITING
-- ============================================================
create table if not exists public.ip_rate_limits (
  key       text primary key,
  count     int  not null default 1,
  reset_at  timestamptz not null
);
create index if not exists ip_rate_limits_reset_at on public.ip_rate_limits (reset_at);

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
  delete from public.ip_rate_limits where key = p_key and reset_at < now();
  insert into public.ip_rate_limits (key, count, reset_at)
  values (p_key, 1, p_reset_at)
  on conflict (key) do update
    set count = ip_rate_limits.count + 1
  returning count, reset_at into v_count, v_reset;
  v_allowed := v_count <= p_limit;
  return jsonb_build_object('count', v_count, 'reset_at', v_reset, 'allowed', v_allowed);
end;
$$;

alter table public.ip_rate_limits enable row level security;

-- ============================================================
-- SEED: Sample stories (skip if already present)
-- ============================================================
insert into public.stories (title, slug, description, age_min, age_max, gender, page_count, cover_image_url, preview_images, is_active, is_new, sort_order)
values
  ('Космическото приключение', 'kosmichesko-priklyuchenie', 'Твоето дете лети до звездите и открива нова планета!', 3, 7, 'unisex', 24, '/images/stories/space-cover.jpg', ARRAY['/images/stories/space-p1.jpg', '/images/stories/space-p2.jpg', '/images/stories/space-p3.jpg'], true, true, 1),
  ('Принцесата от Изгрева', 'printsesata-ot-izgreva', 'Малката принцеса спасява вълшебното кралство с доброта и смелост.', 2, 6, 'girl', 24, '/images/stories/princess-cover.jpg', ARRAY['/images/stories/princess-p1.jpg', '/images/stories/princess-p2.jpg'], true, false, 2),
  ('Суперхеройски ден', 'supergerojski-den', 'Днес твоето дете е супергерой! Спасява града, помага на приятели.', 3, 8, 'boy', 24, '/images/stories/hero-cover.jpg', ARRAY['/images/stories/hero-p1.jpg', '/images/stories/hero-p2.jpg'], true, false, 3),
  ('В джунглата на приятелите', 'v-dzhunglata-na-priyatelite', 'Магическо пътуване в джунглата, където животните стават най-добри приятели.', 0, 4, 'unisex', 20, '/images/stories/jungle-cover.jpg', ARRAY['/images/stories/jungle-p1.jpg', '/images/stories/jungle-p2.jpg'], true, false, 4),
  ('Малкият готвач', 'malkiyat-gotvach', 'В магическата кухня твоето дете готви вкусотии за цялото село!', 2, 5, 'unisex', 20, '/images/stories/chef-cover.jpg', ARRAY['/images/stories/chef-p1.jpg'], true, true, 5),
  ('Пиратите на Черно море', 'piratite-na-cherno-more', 'Авантюра по морето с приятелски пирати. Твоето дете открива съкровищата!', 4, 8, 'boy', 24, '/images/stories/pirate-cover.jpg', ARRAY['/images/stories/pirate-p1.jpg', '/images/stories/pirate-p2.jpg'], true, false, 6),
  ('Феята на горите', 'feyata-na-gorite', 'Вълшебна приказка за малката фея, която пази горите и животинките.', 2, 5, 'girl', 20, '/images/stories/fairy-cover.jpg', ARRAY['/images/stories/fairy-p1.jpg'], true, false, 7),
  ('Динозавърът приятел', 'dinozavarat-priyatel', 'Какво ще стане, ако твоето дете намери динозавърче? Приятелство без граници!', 1, 5, 'unisex', 20, '/images/stories/dino-cover.jpg', ARRAY['/images/stories/dino-p1.jpg', '/images/stories/dino-p2.jpg'], true, true, 8)
on conflict (slug) do nothing;

-- ============================================================
-- V2: Run migration_v2_personalization.sql next
-- (child_attributes + story template columns)
-- ============================================================
