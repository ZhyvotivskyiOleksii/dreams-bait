"use client";

import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "./CartProvider";

type Product = {
  id: string;
  name: string;
  oldPrice: number;
  price: number;
  discount: number;
  image: string;
};

export default function BestsellersGrid({ products }: { products: Product[] }) {
  const t = useTranslations();
  const { addItem } = useCart();

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <div key={product.id} className="relative bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Бейдж ХІТ */}
          <span className="absolute top-3 left-3 z-10 bg-[#7dd3fc] text-white text-xs font-bold px-2 py-1 rounded">
            {t("home.bestsellers.hitBadge")}
          </span>

          {/* Зображення */}
          <div className="h-32 relative mb-4 rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="200px"
              className="object-contain p-2"
            />
          </div>

          {/* Назва */}
          <h3 className="text-sm text-gray-800 mb-3 line-clamp-2 min-h-[40px] font-medium">
            {product.name}
          </h3>

          {/* Ціни */}
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
              onClick={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
              className="w-9 h-9 rounded-full border-2 border-[#7dd3fc] text-[#7dd3fc] flex items-center justify-center hover:bg-[#7dd3fc] hover:text-white transition-colors"
              aria-label={t("cart.add", { name: product.name })}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
