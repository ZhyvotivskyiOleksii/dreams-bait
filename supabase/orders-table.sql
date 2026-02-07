-- Таблиця замовлень для особистого кабінету
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  total numeric(10, 2) not null default 0,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

drop policy if exists "Users see own orders" on public.orders;
create policy "Users see own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create or replace function public.set_orders_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_orders_updated_at();
