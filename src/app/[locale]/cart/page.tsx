"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, User, Truck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useLocale, useTranslations } from "next-intl";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function CartPage() {
  const locale = useLocale();
  const breadcrumbsT = useTranslations("breadcrumbs");
  const navT = useTranslations("nav");
  const t = useTranslations();
  const { items, total, updateQty, removeItem, clear } = useCart();
  const [isAuthed, setIsAuthed] = useState(false);
  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(freeShippingThreshold - total, 0);
  const progress = Math.min((total / freeShippingThreshold) * 100, 100);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) setIsAuthed(Boolean(data.session));
    });
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) setIsAuthed(Boolean(session));
      }
    );
    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-10">
        <BreadcrumbsBar
          items={[
            {
              label: breadcrumbsT("home"),
              href: `/${locale}`,
              isHome: true,
            },
            {
              label: navT("cart"),
            },
          ]}
        />
        <div className="mb-8 rounded-2xl bg-white px-4 py-4 sm:px-6">
          {(() => {
            const steps = [
              { icon: ShoppingCart, title: t("cart.stepCart"), subtitle: t("cart.stepCartNote") },
              { icon: User, title: t("cart.stepDetails"), subtitle: t("cart.stepDetailsNote") },
              { icon: Truck, title: t("cart.stepDelivery"), subtitle: t("cart.stepDeliveryNote") },
              { icon: CheckCircle2, title: t("cart.stepConfirm"), subtitle: t("cart.stepConfirmNote") },
            ];
            const currentStep = 0;
            const progressPercent =
              steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;
            return (
              <div className="relative">
                <div className="absolute left-10 right-10 top-8 h-px rounded-full bg-slate-200" />
                <div className="absolute left-10 right-10 top-8 h-px rounded-full">
                  <div
                    className="h-full rounded-full bg-[#0ea5e9] transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="relative grid gap-4 sm:grid-cols-4">
                  {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                    <div key={step.title} className="flex items-start gap-5">
                  <div
                        className={`flex h-16 w-16 items-center justify-center rounded-full ${
                          index === 0 ? "bg-[#0ea5e9] text-white" : "bg-slate-100 text-slate-600"
                        }`}
                  >
                        <Icon className="h-8 w-8" />
                  </div>
                      <div className="pt-1">
                        <div className="text-[15px] font-semibold text-slate-900">
                          {step.title}
                        </div>
                        <div className="mt-2 text-[12px] text-slate-500">
                          {step.subtitle}
                        </div>
                  </div>
                </div>
              );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-heading text-3xl text-slate-900">
                  {t("cart.cartTitle")}
                </h1>
                <p className="text-sm text-slate-500">{t("cart.cartSubtitle")}</p>
              </div>
              {items.length > 0 && (
                <button
                  onClick={clear}
                  className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {t("cart.clear")}
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <div className="border border-gray-200 rounded-2xl p-10 text-center">
                <p className="text-slate-800 font-semibold mb-2">
                  {t("cart.empty")}
                </p>
                <p className="text-slate-500 mb-4">{t("cart.emptySubtitle")}</p>
                <Link
                  href={`/${locale}/catalog`}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#7dd3fc] text-black font-bold hover:bg-[#f5c542] transition-colors"
                >
                  {t("cart.browseCatalog")}
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row gap-4 border border-gray-200 rounded-2xl p-4"
                  >
                    <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <p className="text-slate-800 font-semibold">{item.name}</p>
                        <p className="text-sm text-black">
                          {item.price} {t("currency.uah")}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="min-w-[32px] text-center font-semibold text-slate-700">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="w-full lg:w-80">
            <div className="border border-gray-200 rounded-2xl p-6 space-y-4 sticky top-24">
              <h2 className="font-heading text-xl text-slate-900">{t("cart.summaryTitle")}</h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="icon-usp-freedelivery" aria-hidden="true" />
                  {t("cart.freeDeliveryTitle")}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {remainingForFreeShipping > 0
                    ? t("cart.freeDeliveryRemaining", {
                        amount: remainingForFreeShipping.toFixed(2),
                        currency: t("currency.uah"),
                      })
                    : t("cart.freeDeliveryUnlocked")}
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0ea5e9] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{t("cart.totalLabel")}</span>
                <span className="font-semibold text-slate-900">
                  {total} {t("currency.uah")}
                </span>
              </div>
              <button
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#7dd3fc] text-black font-bold hover:bg-[#f5c542] transition-colors disabled:opacity-60"
                disabled={items.length === 0}
              >
                {t("cart.checkout")}
              </button>
              <p className="text-xs text-slate-500">
                {t("cart.checkoutNote")}
              </p>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}
