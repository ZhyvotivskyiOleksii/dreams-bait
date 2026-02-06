# Supabase setup

1) Open Supabase SQL editor and run `supabase/schema.sql`.

**Перевірка бази:** після виконання schema мають бути таблиці та колонки:
- **admins**: id, user_id, created_at
- **categories**: id, slug, name_uk, name_pl, name_en, image_url, created_at
- **products**: id, category_id, slug, code, name_uk, name_pl, name_en, description_uk/pl/en, price, old_price, discount, image_url, badge, gallery, is_active, **purchased_count**, **stock_count**, created_at, updated_at
- **profiles**: id, email, first_name, last_name, phone, country, address, postal_code, city, favorites, created_at, updated_at
- **cart_items**: id, user_id, product_id, name, image_url, price, qty, created_at, updated_at
- **storage**: bucket `product-images` (public)
Якщо колонок `purchased_count` або `stock_count` немає в `products`, виконайте:
```sql
alter table public.products add column if not exists purchased_count integer not null default 0;
alter table public.products add column if not exists stock_count integer not null default 0;
```

2) Create admin user:
- Go to Authentication → Users → Invite user
- Email: `biuroarians@gmail.com`
- Set a password

3) Add admin user to `admins` table:
- After the user is created, copy their UUID.
- Run:
```sql
insert into public.admins (user_id) values ('PASTE-USER-UUID-HERE');
```

4) Create storage bucket (already in SQL):
`product-images` is public; admins can upload.

5) Start the app:
```
npm run dev
```

Admin panel is available at:
`/uk/admin`, `/pl/admin`, `/en/admin`
