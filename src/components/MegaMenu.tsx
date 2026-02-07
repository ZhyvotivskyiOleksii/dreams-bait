"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { X, ChevronRight, ShoppingCart } from "lucide-react";
import clsx from "clsx";
import { supabase } from "@/lib/supabaseClient";
import FavoriteButton from "@/components/FavoriteButton";
import { useCart } from "@/components/CartProvider";

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Category {
  id: string;
  name: string;
  image: string;
  subcategories: { name: string; slug: string }[];
  topProducts: { name: string; image: string; price: number; href: string }[];
}

export default function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<string>("rods");
  const [isMobile, setIsMobile] = useState(false);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const STORAGE_KEY = "mega-menu-top-products";
  type TopProductsMap = Record<string, { id?: string; slug?: string; name: string; image: string; price: number; href: string; badge?: string; oldPrice?: number; code?: string }[]>;
  const [randomTopProducts, setRandomTopProducts] = useState<TopProductsMap>({});

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s) as TopProductsMap;
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
          setRandomTopProducts(parsed);
        }
      }
    } catch (_) {}
  }, []);

  const { addItem } = useCart();

  const categoryToSlugs: Record<string, string[]> = {
    rods: ["carp-rods", "feeder-rods"],
    reels: ["carp-reels", "feeder-reels"],
    lines: ["lines"],
    bait: ["bait"],
    "boilie-ingredients": ["boilie-ingredients"],
    accessories: ["accessories"],
    "landing-nets": ["landing-nets"],
    "rod-pods": ["rod-pods"],
    "bite-alarms": ["bite-alarms"],
    camping: ["camping"],
  };

  const categories: Category[] = [
    {
      id: "rods",
      name: t("megaMenu.categories.rods"),
      image: "/category/wendka.webp",
      subcategories: [
        { name: t("megaMenu.subcategories.carpRods"), slug: "carp-rods" },
        { name: t("megaMenu.subcategories.feederRods"), slug: "feeder-rods" },
      ],
      topProducts: [
        {
          name: t("megaMenu.topProducts.rods.item1"),
          image: "/category/wendka.webp",
          price: 2850,
          href: `/${locale}/product/1`,
        },
        {
          name: t("megaMenu.topProducts.rods.item2"),
          image: "/category/wendka.webp",
          price: 1950,
          href: `/${locale}/product/2`,
        },
        {
          name: t("megaMenu.topProducts.rods.item3"),
          image: "/category/wendka.webp",
          price: 4200,
          href: `/${locale}/product/3`,
        },
      ],
    },
    {
      id: "reels",
      name: t("megaMenu.categories.reels"),
      image: "/category/kolowrotek.webp",
      subcategories: [
        { name: t("megaMenu.subcategories.carpReels"), slug: "carp-reels" },
        { name: t("megaMenu.subcategories.feederReels"), slug: "feeder-reels" },
      ],
      topProducts: [
        {
          name: t("megaMenu.topProducts.reels.item1"),
          image: "/category/kolowrotek.webp",
          price: 3250,
          href: `/${locale}/product/4`,
        },
        {
          name: t("megaMenu.topProducts.reels.item2"),
          image: "/category/kolowrotek.webp",
          price: 1850,
          href: `/${locale}/product/5`,
        },
        {
          name: t("megaMenu.topProducts.reels.item3"),
          image: "/category/kolowrotek.webp",
          price: 1450,
          href: `/${locale}/product/6`,
        },
      ],
    },
    {
      id: "lines",
      name: t("megaMenu.categories.lines"),
      image: "/category/zylki.jpg",
      subcategories: [],
      topProducts: [
        {
          name: t("megaMenu.topProducts.lines.item1"),
          image: "/category/zylki.jpg",
          price: 320,
          href: `/${locale}/product/7`,
        },
        {
          name: t("megaMenu.topProducts.lines.item2"),
          image: "/category/zylki.jpg",
          price: 450,
          href: `/${locale}/product/8`,
        },
        {
          name: t("megaMenu.topProducts.lines.item3"),
          image: "/category/zylki.jpg",
          price: 380,
          href: `/${locale}/product/9`,
        },
        {
          name: t("megaMenu.topProducts.lines.item4"),
          image: "/category/zylki.jpg",
          price: 290,
          href: `/${locale}/catalog/lines`,
        },
      ],
    },
    {
      id: "bait",
      name: t("megaMenu.categories.bait"),
      image: "/category/zenety.jpg",
      subcategories: [],
      topProducts: [
        {
          name: t("megaMenu.topProducts.bait.item1"),
          image: "/category/zenety.jpg",
          price: 280,
          href: `/${locale}/product/10`,
        },
        {
          name: t("megaMenu.topProducts.bait.item2"),
          image: "/category/zenety.jpg",
          price: 320,
          href: `/${locale}/product/11`,
        },
        {
          name: t("megaMenu.topProducts.bait.item3"),
          image: "/category/zenety.jpg",
          price: 195,
          href: `/${locale}/product/12`,
        },
        {
          name: t("megaMenu.topProducts.bait.item4"),
          image: "/category/zenety.jpg",
          price: 220,
          href: `/${locale}/catalog/bait`,
        },
      ],
    },
    {
      id: "boilie-ingredients",
      name: t("megaMenu.subcategories.boilieIngredients"),
      image: "/category/carp_boilies.png",
      subcategories: [],
      topProducts: [
        {
          name: t("megaMenu.topProducts.bait.item1"),
          image: "/category/carp_boilies.png",
          price: 280,
          href: `/${locale}/catalog/boilie-ingredients`,
        },
        {
          name: t("megaMenu.topProducts.bait.item2"),
          image: "/category/carp_boilies.png",
          price: 320,
          href: `/${locale}/catalog/boilie-ingredients`,
        },
        {
          name: t("megaMenu.topProducts.bait.item3"),
          image: "/category/carp_boilies.png",
          price: 195,
          href: `/${locale}/catalog/boilie-ingredients`,
        },
        {
          name: t("megaMenu.topProducts.bait.item4"),
          image: "/category/carp_boilies.png",
          price: 220,
          href: `/${locale}/catalog/boilie-ingredients`,
        },
      ],
    },
    {
      id: "accessories",
      name: t("megaMenu.categories.accessories"),
      image: "/category/aksesoria.jpg",
      subcategories: [],
      topProducts: [
        {
          name: t("megaMenu.topProducts.accessories.item1"),
          image: "/category/aksesoria.jpg",
          price: 8500,
          href: `/${locale}/product/13`,
        },
        {
          name: t("megaMenu.topProducts.accessories.item2"),
          image: "/category/aksesoria.jpg",
          price: 1250,
          href: `/${locale}/product/14`,
        },
        {
          name: t("megaMenu.topProducts.accessories.item3"),
          image: "/category/aksesoria.jpg",
          price: 2100,
          href: `/${locale}/product/15`,
        },
        {
          name: t("megaMenu.topProducts.accessories.item4"),
          image: "/category/aksesoria.jpg",
          price: 1800,
          href: `/${locale}/catalog/accessories`,
        },
      ],
    },
    {
      id: "landing-nets",
      name: t("megaMenu.subcategories.landingNets"),
      image: "/category/podbierak.jpg",
      subcategories: [],
      topProducts: [],
    },
    {
      id: "rod-pods",
      name: t("megaMenu.subcategories.rodPods"),
      image: "/category/rodpod.webp",
      subcategories: [],
      topProducts: [],
    },
    {
      id: "bite-alarms",
      name: t("megaMenu.subcategories.biteAlarms"),
      image: "/category/sygnalizator.jpg",
      subcategories: [],
      topProducts: [],
    },
    {
      id: "camping",
      name: t("megaMenu.categories.camping"),
      image: "/category/camping.webp",
      subcategories: [],
      topProducts: [
        {
          name: t("megaMenu.topProducts.camping.item1"),
          image: "/category/camping.webp",
          price: 16200,
          href: `/${locale}/product/19`,
        },
        {
          name: t("megaMenu.topProducts.camping.item2"),
          image: "/category/camping.webp",
          price: 12500,
          href: `/${locale}/product/20`,
        },
        {
          name: t("megaMenu.topProducts.camping.item3"),
          image: "/category/camping.webp",
          price: 8900,
          href: `/${locale}/product/21`,
        },
      ],
    },
  ];

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      return () => {
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const update = (mql: MediaQueryList) => setIsMobile(mql.matches);
    update(mediaQuery);
    const handler = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, []);

  useEffect(() => {
    if (!isOpen || !activeCategory) return;
    if (randomTopProducts[activeCategory]?.length) return;
    const slugs = categoryToSlugs[activeCategory];
    if (!slugs?.length) return;
    let cancelled = false;
    (async () => {
      const { data: cats } = await supabase
        .from("categories")
        .select("id")
        .in("slug", slugs);
      if (!cats?.length || cancelled) return;
      const categoryIds = cats.map((c) => c.id);
      const { data: rows } = await supabase
        .from("products")
        .select("id, slug, name_uk, name_pl, name_en, image_url, price, old_price, code, badge")
        .eq("is_active", true)
        .in("category_id", categoryIds);
      if (!rows?.length || cancelled) return;
      const shuffled = [...rows].sort(() => Math.random() - 0.5);
      const four = shuffled.slice(0, 4);
      const nameKey = `name_${locale}` as "name_uk" | "name_pl" | "name_en";
      const defaultImg: Record<string, string> = {
          accessories: "/category/aksesoria.jpg",
          camping: "/category/camping.webp",
          rods: "/category/wendka.webp",
          reels: "/category/kolowrotek.webp",
          lines: "/category/zylki.jpg",
          bait: "/category/zenety.jpg",
          "boilie-ingredients": "/category/carp_boilies.png",
          "landing-nets": "/category/podbierak.jpg",
          "rod-pods": "/category/rodpod.webp",
          "bite-alarms": "/category/sygnalizator.jpg",
        };
        const defaultImage = defaultImg[activeCategory] ?? "/category/aksesoria.jpg";
      const list = four.map((p) => {
        const rawBadge = (p as { badge?: string | null }).badge;
        const badge =
          rawBadge === "hit" || rawBadge === "new"
            ? rawBadge
            : rawBadge === "super" || rawBadge === "price" || rawBadge === "super-price"
            ? "super-price"
            : undefined;
        const row = p as { old_price?: number | null; code?: string | null };
        return {
          id: String(p.id),
          slug: (p.slug || String(p.id)) as string,
          name: (p[nameKey] ?? p.name_pl) as string,
          image: p.image_url || defaultImage,
          price: Number(p.price),
          href: `/${locale}/product/${p.slug || p.id}`,
          ...(badge ? { badge } : {}),
          ...(row.old_price != null && Number(row.old_price) > 0 ? { oldPrice: Number(row.old_price) } : {}),
          ...(row.code ? { code: row.code } : {}),
        };
      });
      if (!cancelled) {
        setRandomTopProducts((prev) => {
          const next = { ...prev, [activeCategory]: list };
          try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch (_) {}
          return next;
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, activeCategory, locale]);

  const activeData = categories.find((category) => category.id === activeCategory);
  const getCategoryHref = (category: Category) => {
    if (category.subcategories.length > 0) {
      return `/${locale}/catalog/${category.subcategories[0].slug}`;
    }
    return `/${locale}/catalog/${category.id}`;
  };

  return (
    <>
      {/* Оверлей */}
      <div
        className={clsx(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Панель меню */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-full w-full sm:max-w-6xl bg-white z-50 transition-transform duration-200 ease-out flex flex-col sm:flex-row overflow-y-auto overflow-x-hidden sm:overflow-hidden no-scrollbar",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Ліва колонка - Категорії */}
        <div className="w-full sm:w-72 bg-slate-50 border-r border-slate-200 flex flex-col">
          {/* Шапка */}
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-slate-200">
                  <Image src="/logo.png" alt={t("common.logoAlt")} width={40} height={40} />
                </div>
                <div>
                  <span className="font-heading text-lg text-slate-900">{t("megaMenu.title")}</span>
                  <div
                    className="text-[10px] font-medium tracking-wider"
                    style={{ color: "#0ea5e9" }}
                  >
                    {t("megaMenu.subtitle")}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label={t("common.closeMenu")}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Список категорій */}
          <nav className="flex-1 overflow-visible sm:overflow-y-auto py-3 px-3 space-y-2">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              const content = (
                <>
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="flex-1 min-w-0 font-semibold text-sm leading-tight text-left break-words">
                      {category.name}
                    </span>
                  </div>
                  <ChevronRight
                    className={clsx("w-4 h-4 transition-transform", isActive ? "translate-x-1" : "")}
                    style={{ color: isActive ? "#0ea5e9" : "#94a3b8" }}
                  />
                </>
              );

              if (isMobile) {
                return (
                  <Link
                    key={category.id}
                    href={getCategoryHref(category)}
                    onClick={onClose}
                    className={clsx(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all duration-200",
                      isActive
                        ? "bg-[#e0f2fe] text-slate-900 border border-[#7dd3fc]"
                        : "text-slate-700 border border-transparent hover:bg-white hover:border-slate-200"
                    )}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={category.id}
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onPointerEnter={() => setActiveCategory(category.id)}
                  onFocus={() => setActiveCategory(category.id)}
                  onClick={() => setActiveCategory(category.id)}
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all duration-200",
                    isActive
                      ? "bg-[#e0f2fe] text-slate-900 border border-[#7dd3fc]"
                      : "text-slate-700 border border-transparent hover:bg-white hover:border-slate-200"
                  )}
                >
                  {content}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Права колонка - Підкатегорії */}
        <div
          ref={rightPanelRef}
          className="hidden sm:flex flex-1 flex-col bg-white overflow-hidden"
        >
          {activeData && (
            <>
              {/* Заголовок з картинкою */}
              <div className="relative h-28 sm:h-36 overflow-hidden">
                <Image
                  src={activeData.image}
                  alt={activeData.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent" />
                <div className="absolute inset-0 flex items-center px-6">
                  <h2 className="font-heading text-2xl sm:text-3xl text-slate-900">{activeData.name}</h2>
                </div>
              </div>

              {/* Контент */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto">
                {/* Підкатегорії */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {activeData.subcategories.map((sub, index) => (
                    <Link
                      key={index}
                      href={`/${locale}/catalog/${sub.slug}`}
                      onClick={onClose}
                      className="group flex items-center justify-between p-3 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl transition-all duration-200"
                    >
                      <span className="text-slate-700 group-hover:text-slate-900 font-medium text-sm">
                        {sub.name}
                      </span>
                      <ChevronRight
                        className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-all"
                        style={{ color: "#0ea5e9" }}
                      />
                    </Link>
                  ))}
                </div>

                {/* Топ товарів — у кожній категорії 4 випадкові з бази */}
                <div>
                  <h3 className="font-heading text-lg text-slate-800 mb-4 flex items-center gap-2">
                    🔥 {t("megaMenu.topProductsInCategory")}
                  </h3>
                  {(() => {
                    const fromDb = randomTopProducts[activeCategory];
                    const displayProducts = fromDb && fromDb.length > 0 ? fromDb : [];
                    const isLoading = displayProducts.length === 0 && activeCategory != null;
                    return (
                      <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {isLoading ? (
                            [...Array(4)].map((_, i) => (
                              <div key={i} className="rounded-2xl border border-slate-200 p-2.5 animate-pulse bg-slate-50">
                                <div className="aspect-square rounded-lg bg-slate-200 mb-2.5" />
                                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                                <div className="h-5 bg-slate-200 rounded w-1/3" />
                              </div>
                            ))
                          ) : (
                          displayProducts.map((product, index) => {
                            const badge = "badge" in product ? (product as { badge?: string }).badge : undefined;
                            const fromDb = "id" in product && product.id;
                            const categorySlug = activeData.subcategories[0]?.slug ?? activeCategory;

                            const imageBlock = (
                              <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 mb-2.5 relative">
                                {badge ? (
                                  <span
                                    className={`absolute top-1.5 left-1.5 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${
                                      badge === "super-price"
                                        ? "bg-amber-500"
                                        : badge === "new"
                                        ? "bg-emerald-500"
                                        : "bg-[#0ea5e9]"
                                    }`}
                                  >
                                    {badge === "super-price"
                                      ? t("catalogPage.badges.super")
                                      : badge === "new"
                                      ? t("catalogPage.badges.new")
                                      : t("catalogPage.badges.hit")}
                                  </span>
                                ) : null}
                                {fromDb && (
                                  <div className="absolute top-1.5 right-1.5 z-20">
                                    <FavoriteButton
                                      ariaLabel={t("catalogPage.favorites")}
                                      item={{
                                        id: product.id!,
                                        slug: product.slug!,
                                        name: product.name,
                                        image: product.image,
                                        price: product.price,
                                        categorySlug,
                                      }}
                                      className="w-7 h-7 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900"
                                      iconClassName="w-3.5 h-3.5"
                                    />
                                  </div>
                                )}
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={150}
                                  height={150}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            );
                            const priceRow = (
                              <div className="flex items-end justify-between gap-1 mt-2">
                                <div>
                                  {"oldPrice" in product && product.oldPrice != null && product.oldPrice > product.price && (
                                    <span className="text-slate-400 line-through text-[11px] block">
                                      {product.oldPrice} {t("currency.uah")}
                                    </span>
                                  )}
                                  <span className="text-[15px] font-bold text-black">
                                    {product.price} {t("currency.uah")}
                                  </span>
                                </div>
                                {fromDb ? (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      addItem({
                                        id: product.id!,
                                        name: product.name,
                                        price: product.price,
                                        image: product.image,
                                      });
                                    }}
                                    className="w-7 h-7 rounded-full flex items-center justify-center bg-[#7dd3fc] text-black hover:bg-[#f5c542] flex-shrink-0"
                                    aria-label={t("catalogPage.addToCart")}
                                  >
                                    <ShoppingCart className="w-3.5 h-3.5" />
                                  </button>
                                ) : null}
                              </div>
                            );

                            if (fromDb) {
                              return (
                                <div
                                  key={product.id ?? product.href ?? index}
                                  className="group relative bg-white border border-slate-200 rounded-2xl p-2.5 hover:border-slate-300 transition-all duration-300"
                                >
                                  <Link href={product.href} onClick={onClose} className="block">
                                    {imageBlock}
                                    {"code" in product && product.code && (
                                      <div className="text-[10px] text-slate-400 text-right mb-0.5">
                                        {t("catalogPage.codeLabel")} {product.code}
                                      </div>
                                    )}
                                    <h4 className="text-[13px] text-slate-700 font-medium line-clamp-2 mb-1.5 min-h-[34px]">
                                      {product.name}
                                    </h4>
                                  </Link>
                                  {priceRow}
                                </div>
                              );
                            }
                            return (
                              <Link
                                key={product.href + index}
                                href={product.href}
                                onClick={onClose}
                                className="group relative bg-white border border-slate-200 rounded-2xl p-2.5 hover:border-slate-300 transition-all duration-300 block"
                              >
                                {imageBlock}
                                {"code" in product && product.code && (
                                  <div className="text-[10px] text-slate-400 text-right mb-0.5">
                                    {t("catalogPage.codeLabel")} {product.code}
                                  </div>
                                )}
                                <h4 className="text-[13px] text-slate-700 font-medium line-clamp-2 mb-1.5 min-h-[34px]">
                                  {product.name}
                                </h4>
                                {priceRow}
                              </Link>
                            );
                          })
                          )}
                        </div>
                        {displayProducts.length > 0 && (
                          <Link
                            href={getCategoryHref(activeData)}
                            onClick={onClose}
                            className="mt-4 inline-flex items-center justify-center w-full py-3 rounded-xl font-semibold text-sm border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          >
                            {t("home.bestsellers.viewAll")}
                          </Link>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
