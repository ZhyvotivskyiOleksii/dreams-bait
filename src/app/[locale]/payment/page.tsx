"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/CartProvider";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

export default function PaymentPage() {
  const t = useTranslations();
  const breadcrumbsT = useTranslations("breadcrumbs");
  const navT = useTranslations("nav");
  const locale = useLocale();
  const { total } = useCart();

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

          <button
            type="button"
            className="mt-6 w-full inline-flex items-center justify-center rounded-2xl bg-[#7dd3fc] text-black px-6 py-4 text-lg font-semibold hover:bg-[#f5c542] transition-colors"
          >
            {t("payment.payWithTotal", { total, currency: t("currency.uah") })}
          </button>
        </div>
      </div>
    </div>
  );
}
