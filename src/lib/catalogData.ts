import { unstable_cache } from "next/cache";
import { supabase } from "./supabaseClient";

const CACHE_REVALIDATE = 60;

export type Locale = "uk" | "pl" | "en";

export type CatalogCategory = {
  id: string;
  slug: string;
  titleKey: string;
  image: string;
  name: Record<Locale, string>;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  categorySlug: string;
  name: Record<Locale, string>;
  description?: Record<Locale, string>;
  code: string;
  price: number;
  oldPrice?: number;
  badge?: "hit" | "super-price" | "new";
  purchasedCount?: number;
  stockCount?: number;
  image: string;
  gallery: string[];
};

type ProductRowBase = {
  id: string;
  slug: string | null;
  code: string | null;
  name_uk: string;
  name_pl: string;
  name_en: string;
  description_uk: string | null;
  description_pl: string | null;
  description_en: string | null;
  price: number;
  old_price: number | null;
  badge: string | null;
  image_url: string | null;
  gallery: unknown;
  category: { slug: string | null }[];
};

type ProductRow = ProductRowBase & {
  purchased_count: number | null;
  stock_count: number | null;
};

const categoryMeta: Record<
  string,
  { titleKey: string; image: string }
> = {
  "carp-rods": {
    titleKey: "megaMenu.subcategories.carpRods",
    image: "/category/karpowa-wendka.webp",
  },
  "feeder-rods": {
    titleKey: "megaMenu.subcategories.feederRods",
    image: "/category/fider-wendka.webp",
  },
  "carp-reels": {
    titleKey: "megaMenu.subcategories.carpReels",
    image: "/category/karp-kolowrotek.webp",
  },
  "feeder-reels": {
    titleKey: "megaMenu.subcategories.feederReels",
    image: "/category/fider-kolowrotek.png",
  },
  lines: {
    titleKey: "megaMenu.categories.lines",
    image: "/category/zylki.jpg",
  },
  hooks: {
    titleKey: "home.categories.hooks",
    image: "/category/aksesoria.jpg",
  },
  baits: {
    titleKey: "home.categories.baits",
    image: "/category/zenety.jpg",
  },
  accessories: {
    titleKey: "megaMenu.categories.accessories",
    image: "/category/aksesoria.jpg",
  },
  clothing: {
    titleKey: "home.categories.clothing",
    image: "/category/camping.webp",
  },
  camping: {
    titleKey: "megaMenu.categories.camping",
    image: "/category/camping.webp",
  },
  rods: {
    titleKey: "megaMenu.categories.rods",
    image: "/category/wendka.webp",
  },
  reels: {
    titleKey: "megaMenu.categories.reels",
    image: "/category/kolowrotek.webp",
  },
  bait: {
    titleKey: "megaMenu.categories.bait",
    image: "/category/zenety.jpg",
  },
  "landing-nets": {
    titleKey: "megaMenu.subcategories.landingNets",
    image: "/category/podbierak.jpg",
  },
  "rod-pods": {
    titleKey: "megaMenu.subcategories.rodPods",
    image: "/category/rodpod.webp",
  },
  "bite-alarms": {
    titleKey: "megaMenu.subcategories.biteAlarms",
    image: "/category/sygnalizator.jpg",
  },
  "boilie-ingredients": {
    titleKey: "megaMenu.subcategories.boilieIngredients",
    image: "/category/carp_boilies.png",
  },
};

export const catalogSlugs = Object.keys(categoryMeta);

const mapProduct = (row: ProductRow): CatalogProduct => ({
  id: row.id,
  slug: row.slug ?? row.id,
  categorySlug: row.category?.[0]?.slug ?? "",
  name: {
    uk: row.name_uk,
    pl: row.name_pl,
    en: row.name_en,
  },
  description: {
    uk: row.description_uk ?? "",
    pl: row.description_pl ?? "",
    en: row.description_en ?? "",
  },
  code: row.code ?? "",
  price: Number(row.price),
  oldPrice: row.old_price ? Number(row.old_price) : undefined,
  badge:
    row.badge === "hit"
      ? "hit"
      : row.badge === "super" ||
        row.badge === "price" ||
        row.badge === "super-price"
      ? "super-price"
      : row.badge === "new"
      ? "new"
      : undefined,
  purchasedCount:
    typeof row.purchased_count === "number" ? row.purchased_count : undefined,
  stockCount: typeof row.stock_count === "number" ? row.stock_count : undefined,
  image: row.image_url ?? "",
  gallery: Array.isArray(row.gallery) ? (row.gallery as string[]) : [],
});

async function getCategoryBySlugUncached(slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name_uk, name_pl, name_en, image_url")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  const meta = categoryMeta[slug] ?? {
    titleKey: "breadcrumbs.catalog",
    image: "/category/wendka.webp",
  };
  return {
    id: data.id,
    slug: data.slug,
    titleKey: meta.titleKey,
    image: data.image_url || meta.image,
    name: {
      uk: data.name_uk,
      pl: data.name_pl,
      en: data.name_en,
    },
  } as CatalogCategory;
}

export const getCategoryBySlug = (slug: string) =>
  unstable_cache(
    () => getCategoryBySlugUncached(slug),
    ["catalog", "category", slug],
    { revalidate: CACHE_REVALIDATE }
  )();

const baseProductSelect =
  "id, slug, code, name_uk, name_pl, name_en, description_uk, description_pl, description_en, price, old_price, badge, image_url, gallery, category:categories(slug)";

const productSelectWithCount = `${baseProductSelect}, purchased_count, stock_count`;

const withCountDefaults = (row: ProductRowBase): ProductRow => ({
  ...row,
  purchased_count: null,
  stock_count: null,
});

const shouldRetryWithoutCount = (error: { message?: string } | null) =>
  Boolean(
    error?.message &&
      (error.message.includes("purchased_count") ||
        error.message.includes("stock_count"))
  );

const parentCategorySlugs: Record<string, string[]> = {
  rods: ["carp-rods", "feeder-rods"],
  reels: ["carp-reels", "feeder-reels"],
  lines: ["lines"],
  bait: ["bait"],
  "boilie-ingredients": ["boilie-ingredients"],
  camping: ["camping"],
};

const getCategoryIdsBySlugs = async (slugs: string[]) => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug")
    .in("slug", slugs);
  if (error || !data) return [];
  return data.map((row) => row.id);
};

const getProductsByCategoryIds = async (categoryIds: string[]) => {
  if (categoryIds.length === 0) return [];
  let { data, error } = await supabase
    .from("products")
    .select(productSelectWithCount)
    .eq("is_active", true)
    .in("category_id", categoryIds)
    .order("created_at", { ascending: false });
  if (error && shouldRetryWithoutCount(error)) {
    const retry = await supabase
      .from("products")
      .select(baseProductSelect)
      .eq("is_active", true)
      .in("category_id", categoryIds)
      .order("created_at", { ascending: false });
    if (retry.error || !retry.data) return [];
    return retry.data.map((row) => mapProduct(withCountDefaults(row)));
  }
  if (error || !data) return [];
  return data.map(mapProduct);
};

async function getProductsByCategoryUncached(slug: string) {
  const targetSlugs = parentCategorySlugs[slug] ?? [slug];
  const categoryIds = await getCategoryIdsBySlugs(targetSlugs);
  return getProductsByCategoryIds(categoryIds);
}

export const getProductsByCategory = (slug: string) =>
  unstable_cache(
    () => getProductsByCategoryUncached(slug),
    ["catalog", "products-by-cat", slug],
    { revalidate: CACHE_REVALIDATE }
  )();

async function getProductBySlugOrIdUncached(slugOrId: string) {
  let { data, error } = await supabase
    .from("products")
    .select(productSelectWithCount)
    .eq("is_active", true)
    .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
    .maybeSingle();
  if (error && shouldRetryWithoutCount(error)) {
    const retry = await supabase
      .from("products")
      .select(baseProductSelect)
      .eq("is_active", true)
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .maybeSingle();
    if (!retry.error && retry.data) {
      return mapProduct(withCountDefaults(retry.data));
    }
  }
  if (!error && data) {
    return mapProduct(data);
  }

  let { data: fallbackData, error: fallbackError } = await supabase
    .from("products")
    .select(productSelectWithCount)
    .eq("is_active", true)
    .like("slug", `${slugOrId}%`)
    .limit(10);
  if (fallbackError && shouldRetryWithoutCount(fallbackError)) {
    const retry = await supabase
      .from("products")
      .select(baseProductSelect)
      .eq("is_active", true)
      .like("slug", `${slugOrId}%`)
      .limit(10);
    fallbackData = retry.data?.map(withCountDefaults) ?? null;
    fallbackError = retry.error;
  }

  if (fallbackError || !fallbackData || fallbackData.length === 0) return null;

  const match =
    fallbackData
      .filter((row) => typeof row.slug === "string" && slugOrId.startsWith(row.slug))
      .sort((a, b) => (b.slug?.length ?? 0) - (a.slug?.length ?? 0))[0] ??
    fallbackData[0];

  return mapProduct(match);
}

export const getProductBySlugOrId = (slugOrId: string) =>
  unstable_cache(
    () => getProductBySlugOrIdUncached(slugOrId),
    ["catalog", "product", slugOrId],
    { revalidate: CACHE_REVALIDATE }
  )();

async function getProductSlugsUncached() {
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true)
    .not("slug", "is", null);
  if (error || !data) return [];
  return data
    .map((row) => row.slug)
    .filter((slug): slug is string => Boolean(slug));
}

export const getProductSlugs = () =>
  unstable_cache(
    getProductSlugsUncached,
    ["catalog", "product-slugs"],
    { revalidate: CACHE_REVALIDATE }
  )();

/** Пріоритет категорій для хітів */
const BESTSELLERS_CATEGORY_PRIORITY = [
  "camping",
  "rod-pods",
  "bait",
  "baits",
  "boilie-ingredients",
  "carp-rods",
  "feeder-rods",
];

export type BestsellerItem = {
  id: string;
  slug: string;
  categorySlug: string;
  name: string;
  oldPrice: number;
  price: number;
  discount: number;
  image: string;
  badge: "hit";
};

async function getBestsellersHitProductsUncached(locale: Locale): Promise<BestsellerItem[]> {
  const { data, error } = await supabase
    .from("products")
    .select(baseProductSelect)
    .eq("is_active", true)
    .eq("badge", "hit")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  const products = data.map((row) => {
    const rawRow = withCountDefaults(row as ProductRowBase);
    const p = mapProduct(rawRow);
    const cat = (row as { category?: { slug: string | null } | { slug: string | null }[] }).category;
    const categorySlug = Array.isArray(cat) ? cat[0]?.slug ?? "" : cat?.slug ?? "";
    const priority =
      BESTSELLERS_CATEGORY_PRIORITY.indexOf(categorySlug) >= 0
        ? BESTSELLERS_CATEGORY_PRIORITY.indexOf(categorySlug)
        : 999;
    return { product: p, categorySlug, priority };
  });
  products.sort((a, b) => a.priority - b.priority);
  return products
    .slice(0, 6)
    .map(({ product }) => {
      const oldPrice = product.oldPrice ?? product.price;
      const discount =
        oldPrice > product.price
          ? Math.round((1 - product.price / oldPrice) * 100)
          : 0;
      return {
        id: product.id,
        slug: product.slug,
        categorySlug: product.categorySlug,
        name: product.name[locale],
        oldPrice,
        price: product.price,
        discount,
        image: product.image || "/category/zenety.jpg",
        badge: "hit" as const,
      };
    });
}

export function getBestsellersHitProducts(locale: Locale) {
  return unstable_cache(
    () => getBestsellersHitProductsUncached(locale),
    ["catalog", "bestsellers-hit", locale],
    { revalidate: 300 }
  )();
}

async function getProductsWithDiscountUncached(): Promise<CatalogProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(baseProductSelect)
    .eq("is_active", true)
    .not("old_price", "is", null)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data
    .map((row) => mapProduct(withCountDefaults(row as ProductRowBase)))
    .filter((p) => p.oldPrice != null && p.oldPrice > p.price);
}

export function getProductsWithDiscount() {
  return unstable_cache(
    getProductsWithDiscountUncached,
    ["catalog", "products-with-discount"],
    { revalidate: CACHE_REVALIDATE }
  )();
}
