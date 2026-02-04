"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/CartProvider";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const t = useTranslations();
  const breadcrumbsT = useTranslations("breadcrumbs");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const { total, items } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    const startPayment = async () => {
      if (items.length === 0 || isSubmitting) return;
      setIsSubmitting(true);
      try {
        const response = await fetch("/api/payu/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale,
            items: items.map((item) => ({
              name: item.name,
              price: item.price,
              qty: item.qty,
            })),
          }),
        });
        const data = await response.json();
        if (!response.ok || !data?.redirectUri) {
          if (isActive) setError(t("payment.error"));
        } else {
          window.location.href = data.redirectUri;
        }
      } catch {
        if (isActive) setError(t("payment.error"));
      } finally {
        if (isActive) setIsSubmitting(false);
      }
    };
    startPayment();
    return () => {
      isActive = false;
    };
  }, [items, locale, isSubmitting, t]);

  const paymentMethods = [
    { label: "Visa", src: "/paymant/visa.svg" },
    { label: "Mastercard", src: "/paymant/mastercard.svg" },
    { label: "BLIK", src: "/paymant/blik.svg" },
    { label: "Apple Pay", src: "/paymant/icons8-apple-pay-100.png" },
    { label: "Google Pay", src: "/paymant/google-pay-96.png" },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <BreadcrumbsBar
          items={[
            { label: breadcrumbsT("home"), href: `/${locale}`, isHome: true },
            { label: navT("cart"), href: `/${locale}/cart` },
            { label: t("payment.title") },
          ]}
        />
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8">
          <h1 className="text-3xl font-heading text-slate-900">{t("payment.title")}</h1>
          <p className="mt-2 text-slate-500">{t("payment.subtitle")}</p>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-800">{t("payment.methods")}</div>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {paymentMethods.map((method) => (
                <span key={method.label} className="relative h-8 w-16">
                  <Image
                    src={method.src}
                    alt={method.label}
                    fill
                    sizes="64px"
                    className="object-contain"
                  />
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={async () => {
              setError(null);
              if (items.length === 0) {
                setError(t("cart.empty"));
                return;
              }
              setIsSubmitting(true);
              try {
                const response = await fetch("/api/payu/create", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    locale,
                    items: items.map((item) => ({
                      name: item.name,
                      price: item.price,
                      qty: item.qty,
                    })),
                  }),
                });
                const data = await response.json();
                if (!response.ok || !data?.redirectUri) {
                  setError(t("payment.error"));
                } else {
                  window.location.href = data.redirectUri;
                }
              } catch {
                setError(t("payment.error"));
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="mt-6 w-full inline-flex items-center justify-center rounded-2xl bg-[#7dd3fc] text-black px-6 py-4 text-lg font-semibold hover:bg-[#f5c542] transition-colors disabled:opacity-70"
          >
            {isSubmitting
              ? t("payment.processing")
              : t("payment.payWithTotal", { total, currency: "PLN" })}
          </button>
        </div>
      </div>
    </div>
  );
}
