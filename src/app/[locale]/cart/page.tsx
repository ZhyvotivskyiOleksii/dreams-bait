"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, User, Truck, CheckCircle2, Heart, ChevronDown } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { supabase } from "@/lib/supabaseClient";
import { Suspense, useEffect, useMemo, useState } from "react";

function CartPageContent() {
  const locale = useLocale();
  const breadcrumbsT = useTranslations("breadcrumbs");
  const navT = useTranslations("nav");
  const t = useTranslations();
  const commonT = useTranslations("common");
  const { items, total, updateQty, removeItem, clear } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthed, setIsAuthed] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    address: "",
    postalCode: "",
    city: "",
  });
  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(freeShippingThreshold - total, 0);
  const progress = Math.min((total / freeShippingThreshold) * 100, 100);
  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.qty, 0),
    [items]
  );
  const stepParam = searchParams.get("step");
  const showTotalOnButton = stepParam === "delivery";
  const isConfirmStep = stepParam === "confirm";
  const showAuthStep = stepParam === "details" && !isAuthed;
  const showDetailsForm =
    isAuthed && (stepParam === "details" || stepParam === "confirm");
  const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    );
  const paymentMethods = [
    { label: "Visa", src: "/paymant/visa.svg" },
    { label: "Mastercard", src: "/paymant/mastercard.svg" },
    { label: "BLIK", src: "/paymant/blik.svg" },
    { label: "Apple Pay", src: "/paymant/icons8-apple-pay-100.png" },
    { label: "Google Pay", src: "/paymant/google-pay-96.png" },
  ];

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

  useEffect(() => {
    if (!isAuthed) return;
    let isActive = true;
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId || !isActive) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone, country, address, postal_code, city")
        .eq("id", userId)
        .single();
      if (!profile || !isActive) return;
      setProfileForm({
        firstName: profile.first_name ?? "",
        lastName: profile.last_name ?? "",
        phone: profile.phone ?? "",
        country: profile.country ?? "",
        address: profile.address ?? "",
        postalCode: profile.postal_code ?? "",
        city: profile.city ?? "",
      });
    };
    loadProfile();
    return () => {
      isActive = false;
    };
  }, [isAuthed]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const applyState = (matches: boolean) => setIsDetailsOpen(!matches);
    applyState(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => applyState(event.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      mediaQuery.addListener(handler);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
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
        <div className="mb-8 hidden rounded-2xl bg-white px-4 py-4 sm:block sm:px-6">
          {(() => {
            const steps = [
              { icon: ShoppingCart, title: t("cart.stepCart"), subtitle: t("cart.stepCartNote") },
              { icon: User, title: t("cart.stepDetails"), subtitle: t("cart.stepDetailsNote") },
              { icon: CheckCircle2, title: t("cart.stepConfirm"), subtitle: t("cart.stepConfirmNote") },
              { icon: Truck, title: t("cart.stepDelivery"), subtitle: t("cart.stepDeliveryNote") },
            ];
            const stepMap: Record<string, number> = {
              cart: 0,
              details: 1,
              confirm: 2,
              delivery: 3,
            };
            const requestedStep = stepParam ? stepMap[stepParam] ?? 0 : 0;
            const currentStep = Math.max(0, Math.min(requestedStep, steps.length - 1));
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
                          index <= currentStep ? "bg-[#0ea5e9] text-white" : "bg-slate-100 text-slate-600"
                        }`}
                  >
                        <Icon className="h-8 w-8" />
                  </div>
                      <div className="pt-1">
                        <div className="text-[15px] font-semibold text-slate-900">
                          {step.title}
                        </div>
                        <div className="mt-2 text-[12px] text-slate-500">
                          {index < currentStep ? t("cart.stepDone") : step.subtitle}
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
            {!showAuthStep && (
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-heading text-3xl text-slate-900">
                    {t("cart.cartTitle")}
                  </h1>
                  <p className="text-sm text-slate-500">{t("cart.cartSubtitle")}</p>
                </div>
                {items.length > 0 && (
                  <div className="h-5" />
                )}
              </div>
            )}

            {showAuthStep ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h2 className="text-xl font-heading text-slate-900">
                    {t("cart.loginTitle")}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{t("cart.loginSubtitle")}</p>
                  <form
                    className="mt-5 space-y-4"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      setLoginError(null);
                      setLoginLoading(true);
                      const emailValue = loginEmail.trim();
                      const passwordValue = loginPassword.trim();
                      const { error } = await supabase.auth.signInWithPassword({
                        email: emailValue,
                        password: passwordValue,
                      });
                      if (error) {
                        setLoginError(error.message);
                      } else {
                        router.push(`/${locale}/cart?step=confirm`);
                      }
                      setLoginLoading(false);
                    }}
                  >
                    <label className="block text-sm font-medium text-slate-700">
                      {t("auth.email")}
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(event) => setLoginEmail(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      {t("auth.password")}
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(event) => setLoginPassword(event.target.value)}
                        className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                      />
                    </label>
                    {loginError && (
                      <p className="text-sm text-red-500">{loginError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-[#7dd3fc] text-black px-5 py-3 font-semibold hover:bg-[#f5c542] transition-colors disabled:opacity-60"
                    >
                      {t("cart.loginButton")}
                    </button>
                    <Link
                      href={`/${locale}/auth?mode=register&returnTo=/${locale}/cart?step=confirm`}
                      className="w-full inline-flex items-center justify-center rounded-xl border border-slate-200 text-slate-800 px-5 py-3 font-semibold hover:bg-slate-50 transition-colors"
                    >
                      {t("cart.registerButton")}
                    </Link>
                  </form>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-heading text-slate-900">
                    {t("cart.newClientTitle")}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {t("cart.newClientSubtitle")}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {t("cart.newClientBenefit1")}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {t("cart.newClientBenefit2")}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {t("cart.newClientBenefit3")}
                    </li>
                  </ul>
                </div>
              </div>
            ) : showDetailsForm ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-heading text-slate-900">
                      {t("cart.stepDetails")}
                    </h2>
                    {isDetailsOpen && (
                      <p className="mt-1 text-sm text-slate-500">
                        {t("cart.detailsAuthedSubtitle")}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDetailsOpen((prev) => !prev)}
                    className="sm:hidden inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                    aria-expanded={isDetailsOpen}
                  >
                    <span className="mr-1">
                      {isDetailsOpen ? commonT("collapse") : commonT("expand")}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        isDetailsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                {!isDetailsOpen && (
                  <p className="mt-3 text-sm text-slate-600">
                    {profileForm.firstName} {profileForm.lastName}
                  </p>
                )}
                <div
                  className={`mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                    isDetailsOpen ? "grid" : "hidden sm:grid"
                  }`}
                >
                  <label className="block text-sm font-medium text-slate-700">
                    {t("account.fields.firstName")}
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    {t("account.fields.lastName")}
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    {t("account.fields.phone")}
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, phone: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    {t("account.fields.country")}
                    <input
                      type="text"
                      value={profileForm.country}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, country: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                    {t("account.fields.address")}
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, address: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    {t("account.fields.postalCode")}
                    <input
                      type="text"
                      value={profileForm.postalCode}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, postalCode: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    {t("account.fields.city")}
                    <input
                      type="text"
                      value={profileForm.city}
                      onChange={(event) =>
                        setProfileForm((prev) => ({ ...prev, city: event.target.value }))
                      }
                      className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
                    />
                  </label>
                </div>
              </div>
            ) : items.length === 0 ? (
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
                    <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-white flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
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

          <aside className="w-full lg:w-[360px]">
            <div className="border border-gray-200 rounded-2xl p-6 space-y-4 sticky top-24">
              <h2 className="font-heading text-xl text-slate-900">{t("cart.summaryTitle")}</h2>
              {items.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white flex-shrink-0">
                      <Image
                        src={items[0].image}
                        alt={items[0].name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                          {items[0].name}
                        </p>
                        {!isUuid(items[0].id) && items[0].id.length <= 24 && (
                          <p className="mt-2 text-xs text-slate-500">
                            {t("cart.codeLabel")} {items[0].id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
              <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 flex items-center justify-between">
                <span>{t("cart.itemsCount", { count: totalItems })}</span>
                <span className="font-semibold text-slate-900">
                  {total} {t("currency.uah")}
                </span>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setPayError(null);
                  if (!isAuthed) {
                    router.push(`/${locale}/cart?step=details`);
                    return;
                  }
                  if (isConfirmStep) {
                    if (items.length === 0 || isPaying) return;
                    setIsPaying(true);
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
                        setPayError(t("payment.error"));
                      } else {
                        window.location.href = data.redirectUri;
                      }
                    } catch {
                      setPayError(t("payment.error"));
                    } finally {
                      setIsPaying(false);
                    }
                    return;
                  }
                  router.push(`/${locale}/cart?step=confirm`);
                }}
                className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#7dd3fc] text-black font-bold hover:bg-[#f5c542] transition-colors disabled:opacity-60"
                disabled={items.length === 0 || isPaying}
              >
                {isConfirmStep && isPaying
                  ? t("payment.processing")
                  : isConfirmStep
                  ? t("cart.payWithTotal", {
                      total,
                      currency: t("currency.uah"),
                    })
                  : showTotalOnButton
                  ? t("cart.checkoutWithTotal", {
                      total,
                      currency: t("currency.uah"),
                    })
                  : t("cart.checkout")}
              </button>
              {payError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {payError}
                </div>
              )}
              <div className="mt-3 grid grid-cols-5 gap-2">
                {paymentMethods.map((method) => (
                  <span
                    key={method.label}
                    className="inline-flex items-center justify-center rounded-full bg-white px-2 py-1.5"
                  >
                    <span className="relative h-6 w-12">
                      <Image
                        src={method.src}
                        alt={method.label}
                        fill
                        sizes="48px"
                        className="object-contain"
                      />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={null}>
      <CartPageContent />
    </Suspense>
  );
}
