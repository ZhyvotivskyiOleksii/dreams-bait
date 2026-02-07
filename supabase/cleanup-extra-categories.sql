-- Скрипт видалення зайвих категорій з бази.
-- На сайті лишаються тільки: 10 основних + 2 підкатегорії у Вудилищах + 2 у Котушках.
-- Спершу переносимо товари в батьківські категорії, потім видаляємо категорії.

-- 1) Товари з категорій кемпінгу (намети, розкладачки, спальники, крісла) → Кемпінг
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'camping' LIMIT 1)
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('tents', 'bedchairs', 'sleeping-bags', 'chairs'));

-- 2) Товари з підкатегорій волосні (моно, плетені, флюор, лідкор) → Волосінь та шнури
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'lines' LIMIT 1)
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('mono', 'braided', 'fluoro', 'leadcore'));

-- 3) Товари з підкатегорій прикормок (насідки, рідини, інгредієнти тощо) → Прикормки та насадки
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'bait' LIMIT 1)
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('nozzles-liquids', 'liquids-components', 'all-for-fishing', 'ingredients'));

-- 4) Видаляємо зайві категорії
DELETE FROM categories
WHERE slug IN (
  'tents', 'bedchairs', 'sleeping-bags', 'chairs',
  'mono', 'braided', 'fluoro', 'leadcore',
  'nozzles-liquids', 'liquids-components', 'all-for-fishing', 'ingredients'
);

-- 5) Назви укр як на сайті: Вудилища (не Вудки), Підсаки (не Підбираки), підкатегорії вудилищ
UPDATE categories SET name_uk = 'Вудилища' WHERE slug = 'rods';
UPDATE categories SET name_uk = 'Підсаки' WHERE slug = 'landing-nets';
UPDATE categories SET name_uk = 'Карпові вудилища' WHERE slug = 'carp-rods';
UPDATE categories SET name_uk = 'Фідерні вудилища' WHERE slug = 'feeder-rods';
