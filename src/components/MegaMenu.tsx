"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { X, ChevronRight } from "lucide-react";
import clsx from "clsx";

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
      subcategories: [
        { name: t("megaMenu.subcategories.mono"), slug: "mono" },
        { name: t("megaMenu.subcategories.braided"), slug: "braided" },
        { name: t("megaMenu.subcategories.fluoro"), slug: "fluoro" },
        { name: t("megaMenu.subcategories.leadcore"), slug: "leadcore" },
      ],
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
      ],
    },
    {
      id: "bait",
      name: t("megaMenu.categories.bait"),
      image: "/category/zenety.jpg",
      subcategories: [
        { name: t("megaMenu.subcategories.nozzlesLiquids"), slug: "nozzles-liquids" },
        { name: t("megaMenu.subcategories.liquidsComponents"), slug: "liquids-components" },
        { name: t("megaMenu.subcategories.allForFishing"), slug: "all-for-fishing" },
      ],
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
      ],
    },
    {
      id: "accessories",
      name: t("megaMenu.categories.accessories"),
      image: "/category/aksesoria.jpg",
      subcategories: [
        { name: t("megaMenu.subcategories.landingNets"), slug: "landing-nets" },
        { name: t("megaMenu.subcategories.rodPods"), slug: "rod-pods" },
        { name: t("megaMenu.subcategories.biteAlarms"), slug: "bite-alarms" },
      ],
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
      subcategories: [
        { name: t("megaMenu.subcategories.tents"), slug: "tents" },
        { name: t("megaMenu.subcategories.bedchairs"), slug: "bedchairs" },
        { name: t("megaMenu.subcategories.sleepingBags"), slug: "sleeping-bags" },
        { name: t("megaMenu.subcategories.chairs"), slug: "chairs" },
      ],
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
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile("matches" in event ? event.matches : event.matches);
    };
    handleChange(mediaQuery);
    if ("addEventListener" in mediaQuery) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

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
          "fixed top-0 left-0 h-full w-full sm:max-w-6xl bg-white z-50 shadow-2xl transition-transform duration-200 ease-out flex flex-col sm:flex-row overflow-y-auto sm:overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Ліва колонка - Категорії */}
        <div className="w-full sm:w-72 bg-slate-50 border-r border-slate-200 flex flex-col">
          {/* Шапка */}
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-200">
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-semibold text-sm">{category.name}</span>
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

          {/* Нижні посилання */}
          <div className="p-4 border-t border-slate-200 space-y-1">
            <Link
              href={`/${locale}/about`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-colors text-sm"
            >
              {t("nav.about")}
            </Link>
            <Link
              href={`/${locale}/contact`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded-lg transition-colors text-sm"
            >
              {t("nav.contact")}
            </Link>
          </div>
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

                {/* Топ продажів */}
                <div>
                  <h3 className="font-heading text-lg text-slate-800 mb-4 flex items-center gap-2">
                    🔥 {t("megaMenu.topSales")}
                  </h3>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeData.topProducts.map((product, index) => (
                      <Link
                        key={index}
                        href={product.href}
                        onClick={onClose}
                        className="group bg-white border border-slate-200 rounded-2xl p-2.5 hover:shadow-lg hover:border-slate-300 transition-all duration-300"
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-50 mb-2.5">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={150}
                            height={150}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="text-[13px] text-slate-700 font-medium line-clamp-2 mb-1.5 min-h-[34px]">
                          {product.name}
                        </h4>
                        <div className="text-[15px] font-bold text-black">
                          {product.price} {t("currency.uah")}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
