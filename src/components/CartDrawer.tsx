"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import clsx from "clsx";
import { useCart } from "./CartProvider";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { items, total, updateQty, removeItem, clear } = useCart();
  const freeShippingThreshold = 200;
  const remainingToFree = Math.max(freeShippingThreshold - total, 0);

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

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />

      <aside
        className={clsx(
          "fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-[60] transition-transform duration-300 ease-out flex flex-col rounded-none sm:rounded-l-2xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label={t("cart.drawerLabel")}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="font-heading text-xl text-slate-900">{t("cart.title")}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t("cart.close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 space-y-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 px-6 py-6">
              <div className="relative h-52 w-52 sm:h-60 sm:w-60">
                <Image
                  src="/korzyna/korzyna.png"
                  alt={t("cart.empty")}
                  fill
                  sizes="240px"
                  className="object-contain"
                />
              </div>
              <p className="mt-6 text-lg font-semibold text-slate-800">
                {t("cart.empty")}
              </p>
              <p className="mt-2 max-w-[260px] text-sm text-slate-500">
                {t("cart.emptySubtitle")}
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.lineId} className="flex gap-3 border-b border-gray-100 pb-4">
                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-white flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-2 min-w-0">{item.name}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeItem(item.lineId);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label={t("cart.remove")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-2">
                    <span className="text-base sm:text-lg font-bold text-black">
                      {item.price} {t("currency.uah")}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQty(item.lineId, item.qty - 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label={t("cart.decrease")}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="min-w-[24px] text-center text-sm font-semibold text-slate-700">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.lineId, item.qty + 1)}
                        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label={t("cart.increase")}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-5 py-4 border-t border-gray-200 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <span className="icon-usp-freedelivery" aria-hidden="true" />
              {t("cart.freeDeliveryTitle")}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {remainingToFree > 0
                ? t("cart.freeDeliveryRemaining", {
                    amount: remainingToFree.toFixed(2),
                    currency: t("currency.uah"),
                  })
                : t("cart.freeDeliveryUnlocked")}
            </div>
          </div>
          <button
            onClick={clear}
            className="w-full text-sm text-slate-500 hover:text-slate-800 transition-colors"
            disabled={items.length === 0}
          >
            {t("cart.clear")}
          </button>
          <Link
            href={`/${locale}/cart`}
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#7dd3fc] text-black font-bold hover:bg-[#f5c542] transition-colors"
          >
            <span>{t("cart.view")}</span>
            <span className="text-sm font-semibold text-black/70">
              {total} {t("currency.uah")}
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}
