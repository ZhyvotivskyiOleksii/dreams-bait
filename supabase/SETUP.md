# Supabase setup

1) Open Supabase SQL editor and run `supabase/schema.sql`.

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
