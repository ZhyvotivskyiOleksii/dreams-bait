-- Що змінити в базі: додати категорію "Інгредієнти для бойлів" (головна категорія в меню).
-- Таблицю categories міняти не потрібно — тільки один INSERT нижче.
-- Варіант 1: запустіть цей файл в Supabase → SQL Editor.
-- Варіант 2: в адмінці натисніть "Завантажити категорії" — категорія створиться через upsert.

INSERT INTO public.categories (slug, name_uk, name_pl, name_en, image_url)
VALUES (
  'boilie-ingredients',
  'ІНГРЕДІЄНТИ ДЛЯ БОЙЛІВ',
  'SKŁADNIKI DO BOILI',
  'BOILIE INGREDIENTS',
  '/category/carp_boilies.png'
)
ON CONFLICT (slug) DO UPDATE SET
  name_uk = EXCLUDED.name_uk,
  name_pl = EXCLUDED.name_pl,
  name_en = EXCLUDED.name_en,
  image_url = EXCLUDED.image_url;
