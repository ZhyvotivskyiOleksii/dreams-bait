create extension if not exists "pgcrypto";

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_uk text not null,
  name_pl text not null,
  name_en text not null,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.categories
  add column if not exists image_url text;

insert into public.categories (slug, name_uk, name_pl, name_en)
values
  ('carp-rods', 'КАРПОВІ ВУДКИ', 'WĘDKI KARPIOWE', 'CARP RODS'),
  ('carp-reels', 'КАРПОВІ КОТУШКИ', 'KOŁOWROTKI KARPIOWE', 'CARP REELS'),
  ('feeder-rods', 'ФІДЕРНІ ВУДКИ', 'WĘDKI FEEDEROWE', 'FEEDER RODS'),
  ('feeder-reels', 'ФІДЕРНІ КОТУШКИ', 'KOŁOWROTKI FEEDEROWE', 'FEEDER REELS'),
  ('lines', 'ЛЕСКИ, ШНУРИ', 'ŻYŁKI, PLECIONKI', 'LINES & BRAIDS'),
  ('hooks', 'ГАЧКИ', 'HACZYKI', 'HOOKS'),
  ('baits', 'ПРИМАНКИ', 'PRZYNĘTY', 'BAITS'),
  ('accessories', 'ЗИМОВЕ ОСНАЩЕННЯ', 'WYPOSAŻENIE ZIMOWE', 'WINTER GEAR'),
  ('clothing', 'ОДЯГ, ВЗУТТЯ', 'ODZIEŻ, OBUWIE', 'CLOTHING & FOOTWEAR'),
  ('camping', 'ТУРИЗМ, КЕМПІНГ', 'TURYSTYKA, CAMPING', 'TOURISM & CAMPING')
on conflict (slug) do nothing;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text unique,
  code text,
  name_uk text not null,
  name_pl text not null,
  name_en text not null,
  description_uk text,
  description_pl text,
  description_en text,
  price numeric(10, 2) not null,
  old_price numeric(10, 2),
  discount integer,
  image_url text,
  badge text,
  gallery jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
  add column if not exists slug text unique;

alter table public.products
  add column if not exists code text;

alter table public.products
  add column if not exists badge text;

alter table public.products
  add column if not exists purchased_count integer not null default 0;

alter table public.products
  add column if not exists stock_count integer not null default 0;

do $$
begin
  update public.products
  set badge = 'super-price'
  where badge in ('super', 'price');

  if exists (
    select 1
    from pg_constraint
    where conname = 'products_badge_check'
  ) then
    alter table public.products
      drop constraint products_badge_check;
  end if;

  alter table public.products
    add constraint products_badge_check
    check (badge in ('hit', 'super-price', 'new'));
end $$;

alter table public.products
  add column if not exists gallery jsonb not null default '[]'::jsonb;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  phone text,
  country text,
  address text,
  postal_code text,
  city text,
  favorites jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  image_url text,
  price numeric(10, 2) not null,
  qty integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, product_id)
);

alter table public.profiles
  add column if not exists favorites jsonb not null default '[]'::jsonb;

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.cart_items enable row level security;

drop policy if exists "Admins can view admin list" on public.admins;
create policy "Admins can view admin list"
  on public.admins for select
  using (auth.uid() is not null);

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
  on public.categories for select
  using (true);

drop policy if exists "Public read products" on public.products;
create policy "Public read products"
  on public.products for select
  using (true);

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories"
  on public.categories for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
  on public.products for all
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "Users manage own profile" on public.profiles;
create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users manage own cart items" on public.cart_items;
create policy "Users manage own cart items"
  on public.cart_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_cart_items_updated_at on public.cart_items;
create trigger set_cart_items_updated_at
before update on public.cart_items
for each row execute procedure public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );
