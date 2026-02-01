"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, SlidersHorizontal, X } from "lucide-react";
import type { CatalogProduct, Locale } from "@/lib/catalogData";
import FavoriteButton from "@/components/FavoriteButton";
import { useCart } from "@/components/CartProvider";

type CatalogClientProps = {
  locale: Locale;
  activeCategorySlug: string;
  categories: { slug: string; label: string }[];
  products: CatalogProduct[];
  labels: {
    categoriesTitle: string;
    tagsTitle: string;
    priceTitle: string;
    from: string;
    to: string;
    apply: string;
    filterTitle: string;
    filterOpen: string;
    filterClose: string;
    filterBack: string;
    filterShow: string;
    empty: string;
    favorites: string;
    addToCart: string;
    codeLabel: string;
    boughtLabel: string;
    outOfStock: string;
    badgeHit: string;
    badgeSuper: string;
    badgeNew: string;
    currency: string;
  };
};

const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function CatalogClient({
  locale,
  activeCategorySlug,
  categories,
  products,
  labels,
}: CatalogClientProps) {
  const { addItem } = useCart();
  const prices = products.map((product) => product.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const [draftMin, setDraftMin] = useState(minPrice);
  const [draftMax, setDraftMax] = useState(maxPrice);
  const [activeMin, setActiveMin] = useState(minPrice);
  const [activeMax, setActiveMax] = useState(maxPrice);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const inPrice = product.price >= activeMin && product.price <= activeMax;
        if (!inPrice) return false;
        if (selectedTags.length === 0) return true;
        return product.badge ? selectedTags.includes(product.badge) : false;
      }),
    [products, activeMin, activeMax, selectedTags]
  );

  const range = Math.max(maxPrice - minPrice, 1);
  const minPercent = ((draftMin - minPrice) / range) * 100;
  const maxPercent = ((draftMax - minPrice) / range) * 100;

  const applyFilters = () => {
    setActiveMin(draftMin);
    setActiveMax(draftMax);
  };

  const renderTagsFilter = () => (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="text-xs sm:text-sm font-semibold text-slate-900 mb-3">
        {labels.tagsTitle}
      </div>
      <div className="space-y-2">
        {[
          { value: "hit", label: labels.badgeHit },
          { value: "super-price", label: labels.badgeSuper },
          { value: "new", label: labels.badgeNew },
        ].map((tag) => {
          const isActive = selectedTags.includes(tag.value);
          return (
            <label
              key={tag.value}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm transition-colors border ${
                isActive
                  ? "bg-[#e0f2fe] text-slate-900 border-[#7dd3fc]"
                  : "text-slate-700 border-transparent hover:bg-slate-50"
              }`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() =>
                    setSelectedTags((prev) =>
                      prev.includes(tag.value)
                        ? prev.filter((item) => item !== tag.value)
                        : [...prev, tag.value]
                    )
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#0ea5e9] focus:ring-[#7dd3fc]"
                />
                {tag.label}
              </span>
              <span className="text-[11px] text-slate-400">
                {products.filter((product) => {
                  if (tag.value === "super-price") {
                    return product.badge === "super-price";
                  }
                  return product.badge === tag.value;
                }).length}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );

  const renderPriceFilter = (showApplyButton: boolean) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="text-xs sm:text-sm font-semibold text-slate-900 mb-3 sm:mb-4">
        {labels.priceTitle}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <label className="text-[11px] sm:text-xs text-slate-500">
          {labels.from}
          <input
            type="number"
            min={minPrice}
            max={draftMax}
            value={draftMin}
            onChange={(event) =>
              setDraftMin(
                clampValue(Number(event.target.value), minPrice, draftMax)
              )
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1 text-xs sm:text-sm text-slate-700 focus:border-[#7dd3fc] focus:outline-none"
          />
        </label>
        <label className="text-[11px] sm:text-xs text-slate-500">
          {labels.to}
          <input
            type="number"
            min={draftMin}
            max={maxPrice}
            value={draftMax}
            onChange={(event) =>
              setDraftMax(
                clampValue(Number(event.target.value), draftMin, maxPrice)
              )
            }
            className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1 text-xs sm:text-sm text-slate-700 focus:border-[#7dd3fc] focus:outline-none"
          />
        </label>
      </div>

      <div className="mt-3 sm:mt-4">
        <div className="relative h-9 sm:h-10 rounded-2xl bg-slate-50 border border-slate-200 px-2 sm:px-3 py-2.5 sm:py-3">
          <div className="absolute left-3 right-3 sm:left-4 sm:right-4 top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-200" />
          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-amber-400"
            style={{
              left: `calc(${minPercent}% + 12px)`,
              right: `calc(${100 - maxPercent}% + 12px)`,
            }}
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={draftMin}
            onChange={(event) =>
              setDraftMin(
                clampValue(Number(event.target.value), minPrice, draftMax)
              )
            }
            className="price-range absolute left-3 right-3 sm:left-4 sm:right-4 top-1/2 h-2 -translate-y-1/2 bg-transparent pointer-events-auto"
            style={{ zIndex: draftMin > maxPrice - 50 ? 5 : 6 }}
          />
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={draftMax}
            onChange={(event) =>
              setDraftMax(
                clampValue(Number(event.target.value), draftMin, maxPrice)
              )
            }
            className="price-range absolute left-3 right-3 sm:left-4 sm:right-4 top-1/2 h-2 -translate-y-1/2 bg-transparent pointer-events-auto"
            style={{ zIndex: 7 }}
          />
        </div>
        <div className="mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
          <span>
            {minPrice} {labels.currency}
          </span>
          <span>
            {maxPrice} {labels.currency}
          </span>
        </div>
      </div>

      {showApplyButton && (
        <button
          type="button"
          onClick={applyFilters}
          className="mt-4 sm:mt-5 w-full rounded-full bg-[#7dd3fc] text-slate-900 py-1.5 text-sm font-semibold hover:bg-[#5cc4f7] transition-colors"
        >
          {labels.apply}
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-2 sm:gap-6 lg:grid-cols-[260px_minmax(0,1fr)] mt-3 sm:mt-6">
      <div className="lg:hidden flex justify-start">
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0ea5e9] text-white font-semibold px-3 py-1.5 text-[13px]"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {labels.filterOpen}
        </button>
      </div>

      <aside className="hidden lg:block space-y-5 lg:space-y-6 lg:sticky lg:top-32 lg:self-start">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="text-xs sm:text-sm font-semibold text-slate-900 mb-3">
            {labels.categoriesTitle}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:block sm:space-y-2">
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={`/${locale}/catalog/${item.slug}`}
                className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-xs sm:text-sm whitespace-nowrap transition-colors ${
                  activeCategorySlug === item.slug
                    ? "bg-[#e0f2fe] text-slate-900 border border-[#7dd3fc]"
                    : "text-slate-700 border border-transparent hover:bg-slate-50"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-xs text-slate-400">›</span>
              </Link>
            ))}
          </div>
        </div>
        {renderTagsFilter()}
        {renderPriceFilter(true)}
      </aside>

      <div>
        {filteredProducts.length === 0 ? (
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-slate-600">{labels.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5 sm:gap-4">
            {filteredProducts.map((product) => {
              const discount =
                product.oldPrice && product.oldPrice > product.price
                  ? Math.round(
                      ((product.oldPrice - product.price) / product.oldPrice) * 100
                    )
                  : 0;

              const isOutOfStock =
                typeof product.stockCount === "number" &&
                typeof product.purchasedCount === "number" &&
                product.purchasedCount >= product.stockCount;

              return (
                <div
                  key={product.id}
                  className="relative w-full max-w-[175px] sm:max-w-none lg:max-w-[266px] bg-white rounded-2xl border border-slate-200 p-2.5 sm:p-3 hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute top-2 left-2 z-10 flex flex-wrap items-center gap-1">
                    {product.badge && (
                      <span
                        className={`text-[9px] font-bold px-2 py-1 rounded-full ${
                          product.badge === "super-price"
                            ? "bg-sky-100 text-sky-700"
                            : product.badge === "new"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {product.badge === "super-price"
                          ? labels.badgeSuper
                          : product.badge === "new"
                          ? labels.badgeNew
                          : labels.badgeHit}
                      </span>
                    )}
                    {typeof product.purchasedCount === "number" && product.purchasedCount > 0 && (
                      <span className="text-[9px] font-semibold px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-500">
                        {labels.boughtLabel} {product.purchasedCount}
                      </span>
                    )}
                  </div>
                  <FavoriteButton
                    ariaLabel={labels.favorites}
                    item={{
                      id: product.id,
                      slug: product.slug,
                      name: product.name[locale],
                      image: product.image,
                      price: product.price,
                      categorySlug: product.categorySlug,
                    }}
                    className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors pointer-events-auto cursor-pointer"
                    iconClassName="w-4 h-4 mx-auto"
                  />

                  <Link href={`/${locale}/product/${product.slug}`} className="block">
                    <div className="relative h-36 sm:h-48 overflow-hidden rounded-xl bg-slate-50 mb-2">
                      <Image
                        src={product.image}
                        alt={product.name[locale]}
                        fill
                        sizes="320px"
                        className="object-cover"
                      />
                    </div>
                    <div className="hidden sm:flex items-center justify-end text-[10px] font-semibold text-slate-400">
                      {labels.codeLabel} {product.code}
                    </div>
                    <h3 className="mt-1 text-[12px] leading-snug text-slate-700 font-semibold line-clamp-3">
                      {product.name[locale]}
                    </h3>
                  </Link>

                  <div className="flex items-end justify-between mt-2">
                    <div>
                      {product.oldPrice && (
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-slate-400 line-through text-[10px]">
                            {product.oldPrice} {labels.currency}
                          </span>
                          {discount > 0 && (
                            <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      )}
                      <span className="text-black font-bold text-[14px]">
                        {product.price} {labels.currency}
                      </span>
                      {isOutOfStock && (
                        <div className="mt-1 text-[10px] font-semibold text-rose-500">
                          {labels.outOfStock}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name[locale],
                          price: product.price,
                          image: product.image,
                        })
                      }
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        isOutOfStock
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-[#7dd3fc] text-black hover:bg-[#f5c542]"
                      }`}
                      aria-label={labels.addToCart}
                    >
                      <ShoppingCart className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden">
          <div className="absolute inset-0 bg-slate-50 overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
              <div className="text-lg font-semibold text-slate-900">
                {labels.filterTitle}
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-2"
              >
                {labels.filterClose}
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-4">
              {renderTagsFilter()}
              {renderPriceFilter(false)}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 rounded-xl border border-[#7dd3fc] py-3 text-[#0ea5e9] font-semibold"
              >
                {labels.filterBack}
              </button>
              <button
                type="button"
                onClick={() => {
                  applyFilters();
                  setIsFilterOpen(false);
                }}
                className="flex-1 rounded-xl bg-[#0ea5e9] text-white py-3 font-semibold"
              >
                {labels.filterShow}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
