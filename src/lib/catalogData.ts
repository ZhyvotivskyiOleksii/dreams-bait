import { supabase } from "./supabaseClient";

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
  mono: {
    titleKey: "megaMenu.subcategories.mono",
    image: "/category/zylki.jpg",
  },
  braided: {
    titleKey: "megaMenu.subcategories.braided",
    image: "/category/zylki.jpg",
  },
  fluoro: {
    titleKey: "megaMenu.subcategories.fluoro",
    image: "/category/zylki.jpg",
  },
  leadcore: {
    titleKey: "megaMenu.subcategories.leadcore",
    image: "/category/zylki.jpg",
  },
  "nozzles-liquids": {
    titleKey: "megaMenu.subcategories.nozzlesLiquids",
    image: "/category/zenety.jpg",
  },
  "liquids-components": {
    titleKey: "megaMenu.subcategories.liquidsComponents",
    image: "/category/zenety.jpg",
  },
  "all-for-fishing": {
    titleKey: "megaMenu.subcategories.allForFishing",
    image: "/category/zenety.jpg",
  },
  tents: {
    titleKey: "megaMenu.subcategories.tents",
    image: "/category/camping.webp",
  },
  bedchairs: {
    titleKey: "megaMenu.subcategories.bedchairs",
    image: "/category/camping.webp",
  },
  "sleeping-bags": {
    titleKey: "megaMenu.subcategories.sleepingBags",
    image: "/category/camping.webp",
  },
  chairs: {
    titleKey: "megaMenu.subcategories.chairs",
    image: "/category/camping.webp",
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

export const getCategoryBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name_uk, name_pl, name_en, image_url")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
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
};

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

export const getProductsByCategory = async (slug: string) => {
  const category = await getCategoryBySlug(slug);
  if (!category) return [];
  let { data, error } = await supabase
    .from("products")
    .select(productSelectWithCount)
    .eq("is_active", true)
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });
  if (error && shouldRetryWithoutCount(error)) {
    const retry = await supabase
      .from("products")
      .select(baseProductSelect)
      .eq("is_active", true)
      .eq("category_id", category.id)
      .order("created_at", { ascending: false });
    if (retry.error || !retry.data) return [];
    return retry.data.map((row) => mapProduct(withCountDefaults(row)));
  }
  if (error || !data) return [];
  return data.map(mapProduct);
};

export const getProductBySlugOrId = async (slugOrId: string) => {
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
};

export const getProductSlugs = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true)
    .not("slug", "is", null);
  if (error || !data) {
    return [];
  }
  return data
    .map((row) => row.slug)
    .filter((slug): slug is string => Boolean(slug));
};
