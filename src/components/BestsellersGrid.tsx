"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "./CartProvider";

type Product = {
  id: string;
  name: string;
  oldPrice: number;
  price: number;
  discount: number;
  image: string;
  slug?: string;
};

function ProductCard({
  product,
  t,
  locale,
  addItem,
}: {
  product: Product;
  t: (key: string, values?: Record<string, string | number>) => string;
  locale: string;
  addItem: (item: { id: string; name: string; price: number; image: string }) => void;
}) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-200 p-4 transition-all duration-300 hover:-translate-y-1">
      <span className="absolute top-3 left-3 z-10 bg-[#7dd3fc] text-white text-xs font-bold px-2 py-1 rounded">
        {t("home.bestsellers.hitBadge")}
      </span>
      <div className="h-32 relative mb-4 rounded-lg overflow-hidden">
        {product.slug ? (
          <Link href={`/${locale}/product/${product.slug}`} className="block h-full relative">
            <Image src={product.image} alt={product.name} fill sizes="200px" className="object-contain p-2" />
          </Link>
        ) : (
          <Image src={product.image} alt={product.name} fill sizes="200px" className="object-contain p-2" />
        )}
      </div>
      <h3 className="text-sm text-gray-800 mb-3 line-clamp-2 min-h-[40px] font-medium">
        {product.slug ? (
          <Link href={`/${locale}/product/${product.slug}`} className="hover:text-[#7dd3fc] transition-colors">
            {product.name}
          </Link>
        ) : (
          product.name
        )}
      </h3>
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-400 line-through text-xs">{product.oldPrice}</span>
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">-{product.discount}%</span>
          </div>
          <span className="text-black font-bold text-base">
            {product.price} {t("currency.uah")}
          </span>
        </div>
        <button
          type="button"
          onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
          className="w-9 h-9 rounded-full border-2 border-[#7dd3fc] text-[#7dd3fc] flex items-center justify-center hover:bg-[#7dd3fc] hover:text-white transition-colors"
          aria-label={t("cart.add", { name: product.name })}
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function BestsellersGrid({ products }: { products: Product[] }) {
  const t = useTranslations();
  const locale = useLocale();
  const { addItem } = useCart();
  const mobileProducts = products;
  const desktopProducts = products.slice(0, 5);

  return (
    <>
      {/* Мобільна сітка: 6 товарів, 2 колонки */}
      <div className="grid grid-cols-2 gap-4 lg:hidden">
        {mobileProducts.map((product) => (
          <ProductCard key={product.id} product={product} t={t} locale={locale} addItem={addItem} />
        ))}
      </div>
      {/* Десктопна сітка: 5 товарів, 5 колонок */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4">
        {desktopProducts.map((product) => (
          <ProductCard key={product.id} product={product} t={t} locale={locale} addItem={addItem} />
        ))}
      </div>
    </>
  );
}
