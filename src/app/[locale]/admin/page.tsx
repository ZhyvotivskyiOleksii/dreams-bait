"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { supabase } from "@/lib/supabaseClient";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { CheckCircle2, AlertTriangle, X, PlusCircle, List, Fish, Waves, Eye, Pencil, Trash2 } from "lucide-react";

type Category = {
  id: string;
  slug: string;
  name_uk: string;
  name_pl: string;
  name_en: string;
  image_url: string | null;
};

type Product = {
  id: string;
  slug?: string | null;
  code?: string | null;
  category_id: string | null;
  name_uk: string;
  name_pl: string;
  name_en: string;
  description_uk: string | null;
  description_pl: string | null;
  description_en: string | null;
  price: number;
  old_price: number | null;
  discount: number | null;
  image_url: string | null;
  is_active: boolean;
  purchased_count: number | null;
  stock_count: number | null;
  badge?: string | null;
};

const defaultCategories = [
  { slug: "rods", name_uk: "ВУДКИ", name_pl: "WĘDKI", name_en: "RODS", image_url: "/category/wendka.webp" },
  { slug: "reels", name_uk: "КОТУШКИ", name_pl: "KOŁOWROTKI", name_en: "REELS", image_url: "/category/kolowrotek.webp" },
  { slug: "lines", name_uk: "ЖИЛКИ I ПЛЕТІНКИ", name_pl: "ŻYŁKI I PLECIONKI", name_en: "LINES & BRAIDS", image_url: "/category/zylki.jpg" },
  { slug: "bait", name_uk: "ЗАНЕТИ ТА ПРИМАНКИ", name_pl: "ZANĘTY I PRZYNĘTY", name_en: "BAIT & LURES", image_url: "/category/zenety.jpg" },
  { slug: "accessories", name_uk: "АКСЕСУАРИ", name_pl: "AKCESORIA", name_en: "ACCESSORIES", image_url: "/category/aksesoria.jpg" },
  { slug: "landing-nets", name_uk: "ПІДБИРАКИ", name_pl: "PODBIERAKI", name_en: "LANDING NETS", image_url: "/category/podbierak.jpg" },
  { slug: "rod-pods", name_uk: "РОДПОДИ", name_pl: "RODPODY", name_en: "ROD PODS", image_url: "/category/rodpod.webp" },
  { slug: "bite-alarms", name_uk: "СИГНАЛІЗАТОРИ", name_pl: "SYGNALIZATORY", name_en: "BITE ALARMS", image_url: "/category/sygnalizator.jpg" },
  { slug: "camping", name_uk: "КЕМПІНГ", name_pl: "CAMPING", name_en: "CAMPING", image_url: "/category/camping.webp" },
  { slug: "carp-rods", name_uk: "КАРПОВІ ВУДКИ", name_pl: "WĘDKI KARPIOWE", name_en: "CARP RODS", image_url: "/category/karpowa-wendka.webp" },
  { slug: "feeder-rods", name_uk: "ФІДЕРНІ ВУДКИ", name_pl: "WĘDKI FEEDEROWE", name_en: "FEEDER RODS", image_url: "/category/fider-wendka.webp" },
  { slug: "carp-reels", name_uk: "КАРПОВІ КОТУШКИ", name_pl: "KOŁOWROTKI KARPIOWE", name_en: "CARP REELS", image_url: "/category/karp-kolowrotek.webp" },
  { slug: "feeder-reels", name_uk: "ФІДЕРНІ КОТУШКИ", name_pl: "KOŁOWROTKI FEEDEROWE", name_en: "FEEDER REELS", image_url: "/category/fider-kolowrotek.png" },
  { slug: "mono", name_uk: "МОНО ЛІСКА", name_pl: "ŻYŁKA MONO", name_en: "MONO LINE", image_url: "/category/zylki.jpg" },
  { slug: "braided", name_uk: "ПЛЕТЕНІ ЛІСКИ", name_pl: "PLECIONKI", name_en: "BRAIDED LINE", image_url: "/category/zylki.jpg" },
  { slug: "fluoro", name_uk: "ФЛЮОРОКАРБОН", name_pl: "FLUOROCARBON", name_en: "FLUOROCARBON", image_url: "/category/zylki.jpg" },
  { slug: "leadcore", name_uk: "ЛІДКОР", name_pl: "LEADCORE", name_en: "LEADCORE", image_url: "/category/zylki.jpg" },
  { slug: "nozzles-liquids", name_uk: "НАСАДКИ I ЛІКВІДИ", name_pl: "PRZYNĘTY I LIQUIDY", name_en: "NOZZLES & LIQUIDS", image_url: "/category/zenety.jpg" },
  { slug: "liquids-components", name_uk: "РІДИНИ I КОМПОНЕНТИ", name_pl: "PŁYNY I KOMPONENTY", name_en: "LIQUIDS & COMPONENTS", image_url: "/category/zenety.jpg" },
  { slug: "all-for-fishing", name_uk: "ВСЕ ДЛЯ РИБАЛКИ", name_pl: "WSZYSTKO DLA WĘDKARZA", name_en: "ALL FOR FISHING", image_url: "/category/zenety.jpg" },
  { slug: "ingredients", name_uk: "ІНГРЕДІЄНТИ", name_pl: "SKŁADNIKI", name_en: "INGREDIENTS", image_url: "/category/zenety.jpg" },
  { slug: "boilie-ingredients", name_uk: "ІНГРЕДІЄНТИ ДЛЯ БОЙЛІВ", name_pl: "SKŁADNIKI DO BOILI", name_en: "BOILIE INGREDIENTS", image_url: "/category/carp_boilies.png" },
  { slug: "tents", name_uk: "НАМЕТИ", name_pl: "NAMOTY", name_en: "TENTS", image_url: "/category/camping.webp" },
  { slug: "bedchairs", name_uk: "РОЗКЛАДАЧКИ", name_pl: "ŁÓŻKA POLOWE", name_en: "BEDCHAIRS", image_url: "/category/camping.webp" },
  { slug: "sleeping-bags", name_uk: "СПАЛЬНИКИ", name_pl: "ŚPIWORY", name_en: "SLEEPING BAGS", image_url: "/category/camping.webp" },
  { slug: "chairs", name_uk: "КРІСЛА", name_pl: "KRZESŁA", name_en: "CHAIRS", image_url: "/category/camping.webp" },
];

const categoryImageBySlug: Record<string, string> = {
  rods: "/category/wendka.webp",
  reels: "/category/kolowrotek.webp",
  lines: "/category/zylki.jpg",
  bait: "/category/zenety.jpg",
  accessories: "/category/aksesoria.jpg",
  "landing-nets": "/category/podbierak.jpg",
  "rod-pods": "/category/rodpod.webp",
  "bite-alarms": "/category/sygnalizator.jpg",
  camping: "/category/camping.webp",
  "carp-rods": "/category/karpowa-wendka.webp",
  "feeder-rods": "/category/fider-wendka.webp",
  "carp-reels": "/category/karp-kolowrotek.webp",
  "feeder-reels": "/category/fider-kolowrotek.png",
  mono: "/category/zylki.jpg",
  braided: "/category/zylki.jpg",
  fluoro: "/category/zylki.jpg",
  leadcore: "/category/zylki.jpg",
  "nozzles-liquids": "/category/zenety.jpg",
  "liquids-components": "/category/zenety.jpg",
  "all-for-fishing": "/category/zenety.jpg",
  ingredients: "/category/zenety.jpg",
  "boilie-ingredients": "/category/carp_boilies.png",
  tents: "/category/camping.webp",
  bedchairs: "/category/camping.webp",
  "sleeping-bags": "/category/camping.webp",
  chairs: "/category/camping.webp",
};

const menuCategoryOrder = [
  "rods",
  "reels",
  "lines",
  "bait",
  "boilie-ingredients",
  "accessories",
  "landing-nets",
  "rod-pods",
  "bite-alarms",
  "camping",
];

const subcategoryByMenuSlug: Record<string, string[]> = {
  rods: ["carp-rods", "feeder-rods"],
  reels: ["carp-reels", "feeder-reels"],
  camping: ["tents", "bedchairs", "sleeping-bags", "chairs"],
};
/** Колишні підкатегорії — у формі показуємо як головну категорію без підкатегорії */
const legacyLinesSubcategorySlugs = ["mono", "braided", "fluoro", "leadcore"];
const legacyBaitSubcategorySlugs = ["nozzles-liquids", "liquids-components", "all-for-fishing", "ingredients"];

export default function AdminPage() {
  const t = useTranslations("admin");
  const rootT = useTranslations();
  const commonT = useTranslations("common");
  const breadcrumbsT = useTranslations("breadcrumbs");
  const navT = useTranslations("nav");
  const locale = useLocale();

  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [hasAutoSeeded, setHasAutoSeeded] = useState(false);
  const [activeMenuSlug, setActiveMenuSlug] = useState<string | null>(
    menuCategoryOrder[0] ?? null
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getEmptyForm = () => ({
    slug: "",
    autoSlug: true,
    code: "",
    name_uk: "",
    name_pl: "",
    name_en: "",
    description_uk: "",
    description_pl: "",
    description_en: "",
    price: "",
    old_price: "",
    discount: "",
    purchased_count: "",
    stock_count: "",
    stock_add: "",
    category_id: "",
    is_active: true,
    image: null as File | null,
    existingImageUrl: null as string | null,
    badge: "",
    existingGallery: [] as string[],
    galleryFiles: [] as File[],
  });

  const [productForm, setProductForm] = useState(getEmptyForm());
  const [formByCategoryId, setFormByCategoryId] = useState<Record<string, ReturnType<typeof getEmptyForm>>>({});
  const [activeProductTab, setActiveProductTab] = useState<"form" | "list">("form");

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showUpdated, setShowUpdated] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    | {
        type: "deleteAll";
      }
    | {
        type: "deleteOne";
        productId: string;
      }
    | null
  >(null);

  const activeCategory = useMemo(
    () => categories.find((cat) => cat.id === activeCategoryId) || null,
    [categories, activeCategoryId]
  );
  const subcategoryLabels = useMemo<Record<string, string>>(
    () => ({
      "carp-rods": rootT("megaMenu.subcategories.carpRods"),
      "feeder-rods": rootT("megaMenu.subcategories.feederRods"),
      "carp-reels": rootT("megaMenu.subcategories.carpReels"),
      "feeder-reels": rootT("megaMenu.subcategories.feederReels"),
      mono: rootT("megaMenu.subcategories.mono"),
      braided: rootT("megaMenu.subcategories.braided"),
      fluoro: rootT("megaMenu.subcategories.fluoro"),
      leadcore: rootT("megaMenu.subcategories.leadcore"),
      "nozzles-liquids": rootT("megaMenu.subcategories.nozzlesLiquids"),
      "liquids-components": rootT("megaMenu.subcategories.liquidsComponents"),
      "all-for-fishing": rootT("megaMenu.subcategories.allForFishing"),
      ingredients: rootT("megaMenu.subcategories.ingredients"),
      "boilie-ingredients": rootT("megaMenu.subcategories.boilieIngredients"),
      tents: rootT("megaMenu.subcategories.tents"),
      bedchairs: rootT("megaMenu.subcategories.bedchairs"),
      "sleeping-bags": rootT("megaMenu.subcategories.sleepingBags"),
      chairs: rootT("megaMenu.subcategories.chairs"),
    }),
    [rootT]
  );

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, slug, name_uk, name_pl, name_en, image_url")
      .order("created_at", { ascending: false });
    if (!error && data) {
      const all = data as Category[];
      setAllCategories(all);
      const filtered = all
        .filter((item) => menuCategoryOrder.includes(item.slug))
        .sort(
          (a, b) =>
            menuCategoryOrder.indexOf(a.slug) -
            menuCategoryOrder.indexOf(b.slug)
        );
      setCategories(filtered);
      if (!hasAutoSeeded && filtered.length < menuCategoryOrder.length) {
        setHasAutoSeeded(true);
        seedCategories();
        return;
      }
      if (!activeMenuSlug && filtered.length > 0) {
        setActiveMenuSlug(filtered[0].slug);
      }
    }
  };

  const seedCategories = async () => {
    await supabase
      .from("categories")
      .upsert(defaultCategories, { onConflict: "slug" });
    fetchCategories();
  };

  const fetchProducts = async (categoryId?: string | null) => {
    if (!categoryId) return;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });
    if (!error && data) setProducts(data as Product[]);
  };

  const checkAdmin = async (userId: string) => {
    const { data } = await supabase
      .from("admins")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    setIsAdmin(Boolean(data));
  };

  const loadSession = async () => {
    if (isInitialLoading) {
      setLoading(true);
    }
    setAuthError(null);
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      setSessionEmail(null);
      setIsAdmin(false);
      setLoading(false);
      setIsInitialLoading(false);
      return;
    }
    setSessionEmail(session.user.email ?? null);
    await checkAdmin(session.user.id);
    await fetchCategories();
    setLoading(false);
    setIsInitialLoading(false);
  };

  useEffect(() => {
    loadSession();
    const { data } = supabase.auth.onAuthStateChange(() => {
      loadSession();
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (activeCategoryId) {
      fetchProducts(activeCategoryId);
    }
  }, [activeCategoryId]);

  useEffect(() => {
    if (!activeCategoryId) return;
    setFormByCategoryId((prev) => ({ ...prev, [activeCategoryId]: productForm }));
  }, [productForm, activeCategoryId]);

  useEffect(() => {
    if (!activeCategoryId) return;
    const saved = formByCategoryId[activeCategoryId];
    setEditingProductId(null);
    setProductForm(saved ? { ...saved, category_id: activeCategoryId } : { ...getEmptyForm(), category_id: activeCategoryId });
  }, [activeCategoryId]);

  useEffect(() => {
    if (activeProductTab === "list" && activeCategoryId) {
      fetchProducts(activeCategoryId);
    }
  }, [activeProductTab, activeCategoryId]);

  useEffect(() => {
    if (!activeMenuSlug || allCategories.length === 0) return;
    const subcategories = subcategoryByMenuSlug[activeMenuSlug] ?? [];
    const preferredSlug = subcategories[0] ?? activeMenuSlug;
    const preferred = allCategories.find((item) => item.slug === preferredSlug);
    if (preferred && preferred.id !== activeCategoryId) {
      setActiveCategoryId(preferred.id);
    }
  }, [activeMenuSlug, allCategories]);

  useEffect(() => {
    if (!productForm.autoSlug) return;
    const nextName = productForm.name_en.trim();
    if (!nextName) {
      setProductForm((prev) => ({ ...prev, slug: "" }));
      return;
    }
    setProductForm((prev) => ({
      ...prev,
      slug: slugify(prev.name_en),
    }));
  }, [productForm.name_en, productForm.autoSlug]);

  useEffect(() => {
    const price = Number(productForm.price || 0);
    const oldPrice = Number(productForm.old_price || 0);
    if (!price || !oldPrice || oldPrice <= price) {
      setProductForm((prev) => ({ ...prev, discount: "" }));
      return;
    }
    const nextDiscount = Math.round(((oldPrice - price) / oldPrice) * 100);
    setProductForm((prev) => ({
      ...prev,
      discount: String(nextDiscount),
    }));
  }, [productForm.price, productForm.old_price]);

  useEffect(() => {
    if (!productForm.image) {
      setPreviewImageUrl(productForm.existingImageUrl);
      return;
    }
    const objectUrl = URL.createObjectURL(productForm.image);
    setPreviewImageUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [productForm.image, productForm.existingImageUrl]);

  useEffect(() => {
    if (!showSuccess) return;
    const timer = window.setTimeout(() => setShowSuccess(false), 3500);
    return () => window.clearTimeout(timer);
  }, [showSuccess]);

  useEffect(() => {
    if (!showUpdated) return;
    const timer = window.setTimeout(() => setShowUpdated(false), 3500);
    return () => window.clearTimeout(timer);
  }, [showUpdated]);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }
    setEmail("");
    setPassword("");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const uploadImage = async (file: File, folder = "products") => {
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const uploadGalleryImages = async (files: File[]) => {
    if (files.length === 0) return [];
    const limitedFiles = files.slice(0, 8);
    const uploads = await Promise.all(
      limitedFiles.map((file) => uploadImage(file, "products"))
    );
    return uploads.filter(Boolean);
  };

  const generateProductCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letterValues = new Uint32Array(3);
    const digitValues = new Uint32Array(3);
    crypto.getRandomValues(letterValues);
    crypto.getRandomValues(digitValues);
    const codeLetters = Array.from(letterValues)
      .map((value) => letters[value % letters.length])
      .join("");
    const codeDigits = Array.from(digitValues)
      .map((value) => String(value % 10))
      .join("");
    return `DB${codeLetters}${codeDigits}`;
  };

  const slugify = (value: string) => {
    const map: Record<string, string> = {
      а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye", ж: "zh", з: "z",
      и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
      п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch",
      ш: "sh", щ: "shch", ь: "", ю: "yu", я: "ya",
      ć: "c", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z", ą: "a", ę: "e",
    };
    return value
      .toLowerCase()
      .split("")
      .map((char) => map[char] ?? char)
      .join("")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  };

  const handleProductSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let imageUrl: string | null = productForm.existingImageUrl;
    if (productForm.image) {
      imageUrl = await uploadImage(productForm.image);
    }
    const galleryUploads = await uploadGalleryImages(productForm.galleryFiles);
    const mergedGallery = Array.from(
      new Set([...(productForm.existingGallery || []), ...galleryUploads])
    );

    const nextCode = productForm.code.trim() || generateProductCode();
    const basePayload = {
      slug: productForm.slug.trim() || null,
      code: nextCode,
      name_uk: productForm.name_uk,
      name_pl: productForm.name_pl,
      name_en: productForm.name_en,
      description_uk: productForm.description_uk || null,
      description_pl: productForm.description_pl || null,
      description_en: productForm.description_en || null,
      price: Number(productForm.price || 0),
      old_price: productForm.old_price ? Number(productForm.old_price) : null,
      discount: productForm.discount ? Number(productForm.discount) : null,
      category_id: productForm.category_id || null,
      image_url: imageUrl,
      badge: productForm.badge || null,
      gallery: mergedGallery,
      is_active: productForm.is_active,
    };
    const payload = {
      ...basePayload,
      purchased_count: productForm.purchased_count
        ? Number(productForm.purchased_count)
        : 0,
      stock_count: (() => {
        const baseStock = Number(productForm.stock_count || 0);
        const addStock = Number(productForm.stock_add || 0);
        if (editingProductId && addStock > 0) return baseStock + addStock;
        return baseStock;
      })(),
    };

    if (editingProductId) {
      let { error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingProductId);
      if (
        error?.message?.includes("stock_count") ||
        error?.message?.includes("purchased_count")
      ) {
        const retry = await supabase
          .from("products")
          .update(basePayload)
          .eq("id", editingProductId);
        error = retry.error;
      }
      if (!error) {
        const savedCategoryId = productForm.category_id || null;
        setShowUpdated(true);
        setEditingProductId(null);
        setProductForm({ ...getEmptyForm(), category_id: savedCategoryId ?? "" });
        setActiveCategoryId(savedCategoryId);
        fetchProducts(savedCategoryId);
      } else {
        setProductForm((prev) => ({ ...prev, code: nextCode }));
      }
      return;
    }

    let { error } = await supabase.from("products").insert(payload);
    if (
      error?.message?.includes("stock_count") ||
      error?.message?.includes("purchased_count")
    ) {
      const retry = await supabase.from("products").insert(basePayload);
      error = retry.error;
    }
    if (!error) {
      const savedCategoryId = productForm.category_id || null;
      setProductForm({ ...getEmptyForm(), category_id: savedCategoryId ?? "" });
      setActiveCategoryId(savedCategoryId);
      fetchProducts(savedCategoryId);
      setShowSuccess(true);
    } else {
      setProductForm((prev) => ({ ...prev, code: nextCode }));
    }
  };

  const handleEditProduct = (product: Product) => {
    setActiveProductTab("form");
    setEditingProductId(product.id);
    setProductForm({
      slug: product.slug ?? "",
      autoSlug: false,
      code: product.code ?? "",
      name_uk: product.name_uk,
      name_pl: product.name_pl,
      name_en: product.name_en,
      description_uk: product.description_uk ?? "",
      description_pl: product.description_pl ?? "",
      description_en: product.description_en ?? "",
      price: String(product.price ?? ""),
      old_price: product.old_price ? String(product.old_price) : "",
      discount: product.discount ? String(product.discount) : "",
      purchased_count: product.purchased_count ? String(product.purchased_count) : "",
      stock_count: product.stock_count ? String(product.stock_count) : "",
      stock_add: "",
      category_id: product.category_id ?? "",
      is_active: product.is_active,
      image: null,
      existingImageUrl: product.image_url ?? null,
      badge:
        product.badge === "super" || product.badge === "price"
          ? "super-price"
          : product.badge ?? "",
      existingGallery: Array.isArray((product as any).gallery)
        ? ((product as any).gallery as string[])
        : [],
      galleryFiles: [],
    });
    if (product.category_id) {
      setActiveCategoryId(product.category_id);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts(activeCategoryId);
  };

  const handleMoveProductToCategory = async (productId: string, newCategoryId: string) => {
    const { error } = await supabase
      .from("products")
      .update({ category_id: newCategoryId })
      .eq("id", productId);
    if (!error) {
      fetchProducts(activeCategoryId);
      const oldSlug = allCategories.find((c) => c.id === activeCategoryId)?.slug;
      const newSlug = allCategories.find((c) => c.id === newCategoryId)?.slug;
      const slugs = [oldSlug, newSlug].filter(Boolean) as string[];
      if (slugs.length > 0) {
        try {
          await fetch("/api/revalidate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slugs }),
          });
        } catch (_) {}
      }
    }
  };

  const moveCategoryOptions = useMemo(() => {
    const mainSlugs = [...menuCategoryOrder];
    const out: { id: string; label: string }[] = [];
    for (const slug of mainSlugs) {
      const cat = allCategories.find((c) => c.slug === slug);
      if (!cat) continue;
      const subs = subcategoryByMenuSlug[slug];
      if (subs?.length) {
        for (const subSlug of subs) {
          const sub = allCategories.find((c) => c.slug === subSlug);
          if (sub) out.push({ id: sub.id, label: (sub[`name_${locale}` as keyof Category] as string) || sub.slug });
        }
      } else {
        out.push({ id: cat.id, label: (cat[`name_${locale}` as keyof Category] as string) || cat.slug });
      }
    }
    return out;
  }, [allCategories, locale]);

  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center text-slate-600">{commonT("loading")}</div>;
  }

  if (!sessionEmail) {
    return (
      <div className="min-h-screen bg-slate-50 pt-0 pb-16">
        <div className="container mx-auto px-4 max-w-lg">
          <BreadcrumbsBar
            items={[
              {
                label: breadcrumbsT("home"),
                href: `/${locale}`,
                isHome: true,
              },
              {
                label: navT("admin"),
              },
            ]}
          />
          <h1 className="text-2xl font-heading mb-6">{t("loginTitle")}</h1>
          <form onSubmit={handleSignIn} className="space-y-4 bg-white border border-gray-200 rounded-xl p-6">
            <label className="block text-sm font-medium text-slate-700">
              {t("email")}
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              {t("password")}
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </label>
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <button className="w-full rounded-lg bg-[#7dd3fc] text-black font-semibold py-2 hover:bg-[#f5c542] transition-colors">
              {t("signIn")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 pt-0 pb-16">
        <div className="container mx-auto px-4 text-center">
          <BreadcrumbsBar
            items={[
              {
                label: breadcrumbsT("home"),
                href: `/${locale}`,
                isHome: true,
              },
              {
                label: navT("admin"),
              },
            ]}
          />
          <p className="text-lg text-slate-700">{t("notAllowed")}</p>
          <button
            onClick={handleSignOut}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 text-slate-700 hover:bg-gray-100"
          >
            {t("signOut")}
          </button>
        </div>
      </div>
    );
  }

  const previewName = productForm[
    `name_${locale}` as "name_uk" | "name_pl" | "name_en"
  ];
  const previewPrice = Number(productForm.price || 0);
  const previewOldPrice = productForm.old_price
    ? Number(productForm.old_price)
    : null;
  const previewDiscount = productForm.discount
    ? Number(productForm.discount)
    : null;
  const previewBadge = productForm.badge;
  const previewBadgeLabel =
    previewBadge === "hit"
      ? t("badgeHit")
      : previewBadge === "super-price"
      ? t("badgeSuper")
      : previewBadge === "new"
      ? t("badgeNew")
      : null;

  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16">
      <div className="container mx-auto px-4 space-y-4">
        <BreadcrumbsBar
          items={[
            {
              label: breadcrumbsT("home"),
              href: `/${locale}`,
              isHome: true,
            },
            {
              label: navT("admin"),
            },
          ]}
        />
        <div className="sticky top-16 z-30 -mx-4 bg-slate-50 px-4 py-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-heading">{t("dashboardTitle")}</h1>
            <p className="text-sm text-slate-500">{t("signedInAs", { email: sessionEmail })}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] h-[calc(100vh-220px)]">
          <aside className="rounded-2xl border border-gray-200 bg-white p-4 h-full overflow-y-auto no-scrollbar">
            <h2 className="text-lg font-heading mb-2">{t("categoriesTitle")}</h2>
            {categories.length === 0 ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-slate-500">{t("categoriesEmpty")}</p>
                <button
                  type="button"
                  onClick={seedCategories}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold"
                >
                  {t("categoriesSeed")}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => {
                  const categoryName = category[`name_${locale}` as keyof Category];
                  const isOpen = activeMenuSlug === category.slug;
                  const subcategories = subcategoryByMenuSlug[category.slug] ?? [];
                  return (
                    <div
                      key={category.id}
                      className={`rounded-2xl border transition-all ${
                        isOpen
                          ? "border-[#7dd3fc] bg-[#e6f6fe] text-slate-900"
                          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 px-3 py-2">
                        <div className={`relative h-9 w-9 overflow-hidden rounded-xl ${
                          isOpen ? "bg-white" : "bg-slate-50"
                        }`}>
                          {(() => {
                            const imageUrl =
                              category.image_url || categoryImageBySlug[category.slug];
                            return imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={String(categoryName)}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-[9px] text-slate-400">
                                {t("noImage")}
                              </span>
                            );
                          })()}
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveMenuSlug(category.slug)}
                          className="flex-1 text-left text-sm font-semibold tracking-tight"
                        >
                          {categoryName}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 h-full overflow-y-auto no-scrollbar">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 p-1.5">
                <button
                  type="button"
                  onClick={() => setActiveProductTab("form")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    activeProductTab === "form"
                      ? "bg-[#7dd3fc] text-slate-900"
                      : "bg-transparent text-slate-600"
                  }`}
                >
                  <PlusCircle className="h-4 w-4" />
                  {t("productsTitle")}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveProductTab("list")}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    activeProductTab === "list"
                      ? "bg-[#7dd3fc] text-slate-900"
                      : "bg-transparent text-slate-600"
                  }`}
                >
                  <List className="h-4 w-4" />
                  {t("productListTitle")}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Eye className="h-4 w-4" />
                {t("previewOpen")}
              </button>
            </div>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-800">
                {activeCategory
                  ? t("activeCategory", { name: activeCategory[`name_${locale}` as keyof Category] })
                  : t("selectCategory")}
              </p>
              <p className="text-xs text-slate-500 mt-1">{t("productsHelp")}</p>
              {activeMenuSlug &&
                (subcategoryByMenuSlug[activeMenuSlug]?.length ?? 0) > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {subcategoryByMenuSlug[activeMenuSlug].map((slug) => {
                      const category = allCategories.find((item) => item.slug === slug);
                      if (!category) return null;
                      const label =
                        (category[`name_${locale}` as keyof Category] as string) ||
                        subcategoryLabels[slug] ||
                        slug;
                      const isActive = category.id === activeCategoryId;
                      const Icon = slug.includes("carp") ? Fish : slug.includes("feeder") ? Waves : null;
                      return (
                        <button
                          key={slug}
                          type="button"
                          onClick={() => setActiveCategoryId(category.id)}
                          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                            isActive
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          {label}
                        </button>
                      );
                    })}
                  </div>
                )}
              {products.length > 0 && (
                <p className="mt-2 text-xs text-slate-400">
                  {t("recentProducts")}{" "}
                  {products
                    .slice(0, 3)
                    .map((product) => product[`name_${locale}` as keyof Product])
                    .join(" • ")}
                </p>
              )}
            </div>

            {activeProductTab === "form" ? (
              <form onSubmit={handleProductSubmit} className="mt-4 grid gap-4">
              <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("basicSection")}
              </div>
              <label className="text-sm font-medium text-slate-700">
                {t("slug")}
                <input
                  type="text"
                  value={productForm.slug}
                  onChange={(e) => {
                    const nextSlug = e.target.value;
                    setProductForm((prev) => ({
                      ...prev,
                      slug: nextSlug,
                      autoSlug: nextSlug.trim() === "",
                    }));
                  }}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={t("slug")}
                />
                <span className="mt-1 block text-xs text-slate-400">{t("helpSlug")}</span>
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t("code")}
                <input
                  type="text"
                  value={productForm.code}
                  onChange={(e) => setProductForm({ ...productForm, code: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={t("code")}
                />
                <span className="mt-1 block text-xs text-slate-400">{t("helpCode")}</span>
              </label>

              {/* Категорія — тільки з меню (як на сайті); підкатегорія з’являється, коли є підкатегорії */}
              {(() => {
                const mainCategories = allCategories
                  .filter((c) => menuCategoryOrder.includes(c.slug))
                  .sort(
                    (a, b) =>
                      menuCategoryOrder.indexOf(a.slug) - menuCategoryOrder.indexOf(b.slug)
                  );
                const selectedCat = allCategories.find((c) => c.id === productForm.category_id);
                const selectedMainSlug = selectedCat
                  ? menuCategoryOrder.includes(selectedCat.slug)
                    ? selectedCat.slug
                    : (Object.keys(subcategoryByMenuSlug).find((m) =>
                        subcategoryByMenuSlug[m]?.includes(selectedCat.slug)
                      ) ?? (legacyLinesSubcategorySlugs.includes(selectedCat.slug) ? "lines" : legacyBaitSubcategorySlugs.includes(selectedCat.slug) ? "bait" : null))
                  : null;
                const selectedSubSlug =
                  selectedCat &&
                  selectedMainSlug &&
                  subcategoryByMenuSlug[selectedMainSlug]?.includes(selectedCat.slug)
                    ? selectedCat.slug
                    : "";
                const mainCategoryId = selectedMainSlug
                  ? allCategories.find((c) => c.slug === selectedMainSlug)?.id ?? ""
                  : "";
                const subcategorySlugs = selectedMainSlug
                  ? subcategoryByMenuSlug[selectedMainSlug] ?? []
                  : [];
                return (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-4 items-end">
                      <label className="flex-1 min-w-[180px] text-sm font-medium text-slate-700">
                        {t("category")}
                        <select
                          value={mainCategoryId}
                          onChange={(e) => {
                            const id = e.target.value || "";
                            const mainCat = allCategories.find((c) => c.id === id);
                            const newMainSlug = mainCat?.slug ?? null;
                            const newCategoryId = id || "";
                            setProductForm((prev) => ({ ...prev, category_id: newCategoryId }));
                            if (newCategoryId) setActiveCategoryId(newCategoryId);
                          }}
                          className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="">—</option>
                          {mainCategories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat[`name_${locale}` as keyof Category] as string} ({cat.slug})
                            </option>
                          ))}
                        </select>
                        <span className="mt-1 block text-xs text-slate-400">{t("helpCategory")}</span>
                      </label>
                      {subcategorySlugs.length > 0 && (
                        <label className="flex-1 min-w-[180px] text-sm font-medium text-slate-700">
                          {t("subcategory")}
                          <select
                            value={selectedSubSlug ? productForm.category_id : ""}
                            onChange={(e) => {
                              const id = e.target.value || "";
                              const mainId = allCategories.find((c) => c.slug === selectedMainSlug)?.id;
                              const finalId = id || mainId || "";
                              setProductForm((prev) => ({ ...prev, category_id: finalId }));
                              if (finalId) setActiveCategoryId(finalId);
                            }}
                            className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="">{t("subcategoryUseMain")}</option>
                            {subcategorySlugs.map((subSlug) => {
                              const subCat = allCategories.find((c) => c.slug === subSlug);
                              if (!subCat) return null;
                              return (
                                <option key={subCat.id} value={subCat.id}>
                                  {subCat[`name_${locale}` as keyof Category] as string} ({subCat.slug})
                                </option>
                              );
                            })}
                          </select>
                          <span className="mt-1 block text-xs text-slate-400">{t("helpSubcategory")}</span>
                        </label>
                      )}
                    </div>
                  </div>
                );
              })()}

              <label className="text-sm font-medium text-slate-700">
                {t("nameUk")}
                <input
                  type="text"
                  value={productForm.name_uk}
                  onChange={(e) => setProductForm({ ...productForm, name_uk: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={t("nameUk")}
                  required
                />
                <span className="mt-1 block text-xs text-slate-400">{t("helpName")}</span>
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t("namePl")}
                <input
                  type="text"
                  value={productForm.name_pl}
                  onChange={(e) => setProductForm({ ...productForm, name_pl: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={t("namePl")}
                  required
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t("nameEn")}
                <input
                  type="text"
                  value={productForm.name_en}
                  onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={t("nameEn")}
                  required
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                {t("descriptionUk")}
                <textarea
                  value={productForm.description_uk}
                  onChange={(e) => setProductForm({ ...productForm, description_uk: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows={2}
                />
                <span className="mt-1 block text-xs text-slate-400">{t("helpDescription")}</span>
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t("descriptionPl")}
                <textarea
                  value={productForm.description_pl}
                  onChange={(e) => setProductForm({ ...productForm, description_pl: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows={2}
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t("descriptionEn")}
                <textarea
                  value={productForm.description_en}
                  onChange={(e) => setProductForm({ ...productForm, description_en: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows={2}
                />
              </label>
              </div>
              <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("priceSection")}
              </div>

              <label className="text-sm font-medium text-slate-700">
                {t("price")}
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={t("price")}
                  required
                />
                <span className="mt-1 block text-xs text-slate-400">{t("helpPrice")}</span>
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t("oldPrice")}
                <input
                  type="number"
                  value={productForm.old_price}
                  onChange={(e) => setProductForm({ ...productForm, old_price: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={t("oldPrice")}
                />
                <span className="mt-1 block text-xs text-slate-400">{t("helpOldPrice")}</span>
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t("discount")}
                <input
                  type="number"
                  value={productForm.discount}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={t("discount")}
                  disabled
                />
                <span className="mt-1 block text-xs text-slate-400">{t("helpDiscount")}</span>
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t("badgeNone")}
                <select
                  value={productForm.badge}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">{t("badgeNone")}</option>
                  <option value="hit">{t("badgeHit")}</option>
                  <option value="super-price">{t("badgeSuper")}</option>
                  <option value="new">{t("badgeNew")}</option>
                </select>
                <span className="mt-1 block text-xs text-slate-400">{t("helpBadge")}</span>
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t("purchasedCount")}
                <input
                  type="number"
                  value={productForm.purchased_count}
                  onChange={(e) => setProductForm({ ...productForm, purchased_count: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={t("purchasedCount")}
                  min={0}
                />
                <span className="mt-1 block text-xs text-slate-400">
                  {t("helpPurchasedCount")}
                </span>
              </label>
              <label className="text-sm font-medium text-slate-700">
                {t("stockCount")}
                <input
                  type="number"
                  value={productForm.stock_count}
                  onChange={(e) => setProductForm({ ...productForm, stock_count: e.target.value })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={t("stockCount")}
                  min={0}
                />
                <span className="mt-1 block text-xs text-slate-400">
                  {t("helpStockCount")}
                </span>
              </label>
              {editingProductId && (
                <label className="text-sm font-medium text-slate-700">
                  {t("stockAdd")}
                  <input
                    type="number"
                    value={productForm.stock_add}
                    onChange={(e) => setProductForm({ ...productForm, stock_add: e.target.value })}
                    className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder={t("stockAdd")}
                    min={0}
                  />
                  <span className="mt-1 block text-xs text-slate-400">
                    {t("helpStockAdd")}
                  </span>
                </label>
              )}
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={productForm.is_active}
                  onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                />
                {t("active")}
                <span className="text-xs text-slate-400">{t("helpActive")}</span>
              </label>

              <label className="text-sm font-medium text-slate-700">
                {t("mainImage")}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.files?.[0] ?? null })}
                  className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <span className="mt-1 block text-xs text-slate-400">{t("helpMainImage")}</span>
              </label>

              <label className="text-sm font-medium text-slate-700">
                {t("galleryFiles")}
                <div className="mt-2 flex flex-wrap items-center gap-3 rounded-lg border border-gray-300 px-3 py-2">
                  <label
                    htmlFor="gallery-files"
                    className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    {t("pickPhotos")}
                  </label>
                  <span className="text-xs text-slate-500">
                    {productForm.galleryFiles.length > 0
                      ? t("selectedPhotos", { count: productForm.galleryFiles.length })
                      : t("noPhotosSelected")}
                  </span>
                  <input
                    id="gallery-files"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        galleryFiles: Array.from(e.target.files ?? []).slice(0, 8),
                      })
                    }
                    className="hidden"
                  />
                </div>
                <span className="mt-1 block text-xs text-slate-400">{t("helpGalleryFilesLimit")}</span>
              </label>
              </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                {editingProductId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm({ ...getEmptyForm(), category_id: activeCategoryId ?? "" });
                    }}
                    className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  >
                    {t("cancelEdit")}
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-full bg-[#7dd3fc] px-6 py-2.5 text-xs font-semibold text-slate-900 hover:bg-[#5cc4f7] disabled:opacity-60"
                  disabled={!activeCategoryId}
                >
                  {editingProductId ? t("updateProduct") : t("addProduct")}
                </button>
              </div>

              </form>
            ) : (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-700">
                    {activeCategory
                      ? t("activeCategory", { name: activeCategory[`name_${locale}` as keyof Category] })
                      : t("selectCategory")}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setConfirmAction({ type: "deleteAll" })}
                    className="inline-flex items-center justify-center rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    {t("deleteAll")}
                  </button>
                </div>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {!activeCategoryId ? (
                    <p className="text-sm text-slate-500">{t("selectCategory")}</p>
                  ) : (
                  products.map((product) => (
                  <div
                    key={product.id}
                    className="border border-gray-200 rounded-xl p-3 space-y-2 bg-white hover:border-slate-300 transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => handleEditProduct(product)}
                      className="w-full text-left block rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] focus:ring-inset"
                    >
                      {product.image_url && (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-50">
                          <Image src={product.image_url} alt={product.name_en} fill className="object-cover" />
                        </div>
                      )}
                      <div className="mt-2">
                        <p className="font-semibold text-slate-800 text-sm line-clamp-2">
                          {product[`name_${locale}` as keyof Product]}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {product.price} {rootT("currency.uah")}
                        </p>
                      </div>
                    </button>
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <label className="block text-[11px] font-medium text-slate-500">
                        {t("moveToCategory")}
                      </label>
                      <select
                        value=""
                        onChange={(e) => {
                          const id = e.target.value;
                          if (id) {
                            handleMoveProductToCategory(product.id, id);
                            e.target.value = "";
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 bg-white"
                      >
                        <option value="">—</option>
                        {moveCategoryOptions
                          .filter((opt) => opt.id !== product.category_id)
                          .map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-1 text-[11px] pt-1 min-w-0">
                      <span className={`flex-shrink-0 truncate ${product.is_active ? "text-green-600" : "text-slate-400"}`}>
                        {product.is_active ? t("statusActive") : t("statusInactive")}
                      </span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          title={t("edit")}
                          onClick={() => handleEditProduct(product)}
                          className="rounded border border-slate-200 bg-slate-50 p-1.5 text-slate-600 hover:bg-[#e0f2fe] hover:border-[#7dd3fc] hover:text-slate-900"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          title={t("delete")}
                          onClick={() => setConfirmAction({ type: "deleteOne", productId: product.id })}
                          className="rounded p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  )))}
                  {activeCategoryId && products.length === 0 && (
                    <p className="text-sm text-slate-500">{t("noProducts")}</p>
                  )}
                </div>
              </div>
            )}
          </section>

        </div>

        {confirmAction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-slate-950/40"
              onClick={() => setConfirmAction(null)}
            />
            <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {t("confirmTitle")}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {confirmAction.type === "deleteAll"
                        ? t("confirmDeleteAll")
                        : t("confirmDeleteOne")}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (confirmAction.type === "deleteAll") {
                      await supabase.from("products").delete().neq("id", "");
                      fetchProducts(activeCategoryId);
                    } else {
                      await handleDeleteProduct(confirmAction.productId);
                    }
                    setConfirmAction(null);
                  }}
                  className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
                >
                  {t("confirm")}
                </button>
              </div>
            </div>
          </div>
        )}

        {(showSuccess || showUpdated) && (
          <div className="fixed right-6 top-24 z-50 flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            <span>{showUpdated ? t("productUpdated") : t("productAdded")}</span>
          </div>
        )}

        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-slate-950/40"
              onClick={() => setShowPreview(false)}
            />
            <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading">{t("previewTitle")}</h3>
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="relative h-48 w-full overflow-hidden rounded-xl bg-slate-50">
                    {previewImageUrl ? (
                      <img src={previewImageUrl} alt="preview" className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                        {t("previewNoImage")}
                      </div>
                    )}
                  </div>
                  {previewBadgeLabel && (
                    <span className="mt-3 inline-flex rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white">
                      {previewBadgeLabel}
                    </span>
                  )}
                  <div className="mt-3 text-sm font-semibold text-slate-800">
                    {previewName || t("previewName")}
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    {previewPrice > 0 ? `${previewPrice} ${rootT("currency.uah")}` : t("previewPrice")}
                    {previewOldPrice ? (
                      <span className="ml-2 text-xs text-slate-400 line-through">
                        {previewOldPrice} {rootT("currency.uah")}
                      </span>
                    ) : null}
                    {previewDiscount ? (
                      <span className="ml-2 text-xs text-red-500 font-semibold">
                        -{previewDiscount}%
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500 mb-2">{t("previewPage")}</div>
                  <div className="text-sm font-semibold text-slate-800">
                    {previewName || t("previewName")}
                  </div>
                  <div className="mt-2 text-xs text-slate-500 line-clamp-5">
                    {productForm.description_uk || t("previewDescription")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
