"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  User,
  Heart,
  Mail,
  Phone,
  MapPin,
  Building2,
  Pencil,
  Package,
  Check,
  X,
  LogOut,
  Eye,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getProductBySlugOrId } from "@/lib/catalogData";
import type { Locale } from "@/i18n";

const COUNTRY_KEYS = [
  "albania", "andorra", "armenia", "austria", "azerbaijan", "belarus", "belgium",
  "bosniaHerzegovina", "bulgaria", "croatia", "cyprus", "czechia", "denmark",
  "estonia", "finland", "france", "georgia", "germany", "greece", "hungary",
  "iceland", "ireland", "italy", "kosovo", "latvia", "liechtenstein", "lithuania",
  "luxembourg", "malta", "moldova", "monaco", "montenegro", "netherlands",
  "northMacedonia", "norway", "poland", "portugal", "romania", "russia",
  "sanMarino", "serbia", "slovakia", "slovenia", "spain", "sweden",
  "switzerland", "turkey", "ukraine", "unitedKingdom", "vatican",
] as const;

const countryKeyMap: Record<string, string> = {
  unitedkingdom: "unitedKingdom",
  northmacedonia: "northMacedonia",
  bosniaherzegovina: "bosniaHerzegovina",
  sanmarino: "sanMarino",
};

const FIELD_LABEL_KEYS: Record<string, string> = {
  first_name: "firstName",
  last_name: "lastName",
  postal_code: "postalCode",
};

type FavoriteItem = {
  id: string;
  slug: string;
  name?: string;
  image?: string;
  price?: number;
  categorySlug?: string;
};

type Profile = {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  country: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  favorites?: FavoriteItem[] | null;
};

type Order = {
  id: string;
  status: string;
  total: number;
  created_at: string;
};

export default function AccountPage() {
  const t = useTranslations("account");
  const authT = useTranslations("auth");
  const commonT = useTranslations("common");
  const headerT = useTranslations("header");
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"profile" | "favorites" | "orders">("orders");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    country: "",
    address: "",
    postal_code: "",
    city: "",
  });
  const [displayFavorites, setDisplayFavorites] = useState<
    { id: string; slug?: string; name?: string; image?: string; price?: number }[]
  >([]);

  const fieldLabel = (formKey: string) =>
    t(`fields.${(FIELD_LABEL_KEYS[formKey] || formKey) as "firstName"}`);

  const countryLabel = (value?: string | null) => {
    if (!value) return "—";
    const key = String(value).toLowerCase().trim().replace(/\s+/g, "");
    const countryKey = countryKeyMap[key] || key;
    try {
      const label = authT(`countries.${countryKey}` as never);
      if (label && !label.startsWith("countries.")) return label;
    } catch (_) {}
    return value;
  };

  const loadProfile = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.replace(`/${locale}/auth`);
      return;
    }
    const { data: profileData } = await supabase
      .from("profiles")
      .select("email, first_name, last_name, phone, country, address, postal_code, city, favorites")
      .eq("id", data.user.id)
      .maybeSingle();
    setProfile(profileData as Profile);
    if (profileData) {
      setForm({
        first_name: profileData.first_name ?? "",
        last_name: profileData.last_name ?? "",
        phone: profileData.phone ?? "",
        email: profileData.email ?? "",
        country: profileData.country ?? "",
        address: profileData.address ?? "",
        postal_code: profileData.postal_code ?? "",
        city: profileData.city ?? "",
      });
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace(`/${locale}/auth`);
        return;
      }
      await loadProfile();
      if (cancelled) return;
      try {
        const { data: ordersData } = await supabase
          .from("orders")
          .select("id, status, total, created_at")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false });
        if (!cancelled && ordersData) setOrders(ordersData as Order[]);
      } catch (_) {
        setOrders([]);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [locale, router]);

  const favorites = Array.isArray(profile?.favorites) ? profile?.favorites : [];

  useEffect(() => {
    let isActive = true;
    const loadFallbacks = async () => {
      const resolved = await Promise.all(
        favorites.map(async (item) => {
          if (item.name && item.image && typeof item.price === "number") {
            return { id: item.id, slug: item.slug, name: item.name, image: item.image, price: item.price };
          }
          const fallback = await getProductBySlugOrId(item.slug || item.id);
          return {
            id: item.id,
            slug: item.slug,
            name: item.name || fallback?.name?.[locale] || "-",
            image: item.image || fallback?.image,
            price: item.price ?? fallback?.price,
          };
        })
      );
      if (isActive) setDisplayFavorites(resolved);
    };
    loadFallbacks();
    return () => { isActive = false; };
  }, [favorites, locale]);

  const handleSaveProfile = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    setSaving(true);
    setSaveSuccess(false);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: form.first_name || null,
        last_name: form.last_name || null,
        phone: form.phone || null,
        email: form.email || null,
        country: form.country || null,
        address: form.address || null,
        postal_code: form.postal_code || null,
        city: form.city || null,
      })
      .eq("id", data.user.id);
    setSaving(false);
    if (!error) {
      setProfile((prev) => (prev ? { ...prev, ...form } : prev));
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace(`/${locale}/auth`);
  };

  const handleRemoveFavorite = async (slug: string, id: string) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.replace(`/${locale}/auth`);
      return;
    }
    const nextFavorites = favorites.filter((fav) => fav.slug !== slug && fav.id !== id);
    await supabase.from("profiles").update({ favorites: nextFavorites }).eq("id", data.user.id);
    setProfile((prev) => (prev ? { ...prev, favorites: nextFavorites } : prev));
  };

  const initials = [profile?.first_name?.[0], profile?.last_name?.[0]].filter(Boolean).join("").toUpperCase() || "?";

  const profileRows: { key: keyof typeof form; Icon: typeof User; fullWidth?: boolean }[] = [
    { key: "first_name", Icon: User },
    { key: "last_name", Icon: User },
    { key: "phone", Icon: Phone },
    { key: "email", Icon: Mail },
    { key: "country", Icon: MapPin },
    { key: "city", Icon: Building2 },
    { key: "address", Icon: MapPin, fullWidth: true },
    { key: "postal_code", Icon: MapPin },
  ];

  const tabs = [
    { id: "profile" as const, label: t("menuProfile"), icon: User },
    { id: "favorites" as const, label: t("menuFavorites"), icon: Heart },
    { id: "orders" as const, label: t("menuOrders"), icon: Package },
  ];

  return (
    <div className="min-h-screen bg-white pb-8">
      <div className="mx-auto max-w-xl px-4 pt-0 sm:pt-6">
        {/* Профіль-картка: аватар + ім'я + вихід (в кабінеті) */}
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-4 sm:mb-6">
          <div className="relative flex h-12 w-12 flex-shrink-0 sm:h-14 sm:w-14">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7dd3fc] to-[#0ea5e9] shadow-lg shadow-sky-200/50" />
            <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center ring-2 ring-white">
              <span className="text-sm font-bold text-slate-700 sm:text-base" style={{ letterSpacing: "-0.02em" }}>
                {initials}
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-slate-900">
              {profile?.first_name || profile?.last_name
                ? [profile?.first_name, profile?.last_name].filter(Boolean).join(" ")
                : t("menuProfile")}
            </p>
            <p className="text-sm text-slate-500">{t("subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex-shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <LogOut className="mr-1.5 inline-block h-4 w-4" />
            {headerT("logout")}
          </button>
        </div>

        {/* Меню як кнопки: Профіль, Обране, Замовлення — всередині сторінки */}
        <div className="mb-5 grid grid-cols-3 gap-1.5 sm:mb-6" role="tablist" aria-label="Account sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`relative flex flex-col items-center gap-1 rounded-md border px-2 py-2.5 transition-all ${
                activeTab === id
                  ? "border-sky-200 bg-gradient-to-br from-sky-50 to-white shadow-sm ring-2 ring-sky-100"
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              {(id === "orders" && orders.length > 0) || (id === "favorites" && displayFavorites.length > 0) ? (
                <span className="absolute top-1 right-1 min-w-[14px] h-[14px] rounded-full flex items-center justify-center text-white text-[8px] font-bold bg-sky-500">
                  {id === "orders" ? (orders.length > 9 ? "9+" : orders.length) : displayFavorites.length > 9 ? "9+" : displayFavorites.length}
                </span>
              ) : null}
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors ${
                  activeTab === id
                    ? "bg-gradient-to-br from-[#7dd3fc] to-[#0ea5e9] text-white"
                    : "bg-slate-200/80 text-slate-600"
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap leading-tight ${
                  activeTab === id ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Контент */}
        {activeTab === "profile" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">{t("menuProfile")}</h2>
              {!editing ? (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Pencil className="h-4 w-4" />
                  {t("editProfile")}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setForm({
                        first_name: profile?.first_name ?? "",
                        last_name: profile?.last_name ?? "",
                        phone: profile?.phone ?? "",
                        email: profile?.email ?? "",
                        country: profile?.country ?? "",
                        address: profile?.address ?? "",
                        postal_code: profile?.postal_code ?? "",
                        city: profile?.city ?? "",
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                    {t("cancel")}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    <Check className="h-4 w-4" />
                    {saving ? commonT("loading") : t("saveProfile")}
                  </button>
                </div>
              )}
            </div>

            {saveSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
                <Check className="h-4 w-4" />
                {t("profileSaved")}
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
              {profileRows.map(({ key, Icon, fullWidth }, i) => (
                <div
                  key={key}
                  className={`flex items-center gap-4 border-b border-slate-50 px-4 py-3 last:border-b-0 ${
                    fullWidth ? "flex-col items-stretch gap-2" : ""
                  } ${fullWidth ? "sm:flex-row sm:items-center" : ""}`}
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className={`min-w-0 flex-1 ${fullWidth ? "w-full" : ""}`}>
                    <p className="text-xs font-medium text-slate-400">{fieldLabel(key)}</p>
                    {editing ? (
                      key === "country" ? (
                        <select
                          value={form.country}
                          onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                          className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                        >
                          <option value="">—</option>
                          {COUNTRY_KEYS.map((k) => (
                            <option key={k} value={k}>
                              {authT(`countries.${k}` as never)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={key === "email" ? "email" : "text"}
                          value={form[key]}
                          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                          className="mt-0.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
                        />
                      )
                    ) : (
                      <p className="mt-0.5 text-sm text-slate-900">
                        {key === "country" ? countryLabel(profile?.[key]) : (profile?.[key] || "—")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "favorites" && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">{t("favoritesTitle")}</h2>
            {displayFavorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-16 text-center">
                <Heart className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">{t("favoritesEmpty")}</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {displayFavorites.map((item) => (
                  <li
                    key={`${item.id}-${item.slug}`}
                    className="flex flex-col rounded-xl border border-slate-100 bg-white p-3 transition hover:border-slate-200 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="flex gap-3 sm:flex-1 sm:min-w-0">
                      <Link
                        href={`/${locale}/product/${item.slug}`}
                        className="relative block h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-50"
                      >
                        {item.image ? (
                          <Image src={item.image} alt={item.name || ""} fill sizes="64px" className="object-contain p-1" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <Heart className="h-6 w-6" />
                          </div>
                        )}
                      </Link>
                      <div className="min-w-0 flex-1 text-left">
                        <Link
                          href={`/${locale}/product/${item.slug}`}
                          className="block text-xs font-medium text-slate-900 line-clamp-2 hover:underline"
                        >
                          {item.name || "—"}
                        </Link>
                        {typeof item.price === "number" && (
                          <p className="mt-1 text-base font-semibold text-slate-900">{item.price} €</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-1.5 flex flex-shrink-0 justify-end gap-1.5 sm:mt-0">
                      <Link
                        href={`/${locale}/product/${item.slug}`}
                        className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-white hover:opacity-90 transition-opacity"
                        style={{ background: "linear-gradient(90deg, #7dd3fc 0%, #38bdf8 100%)" }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {t("favoritesView")}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemoveFavorite(item.slug || item.id, item.id)}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t("favoritesRemove")}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="mb-4 text-base font-semibold text-slate-900">{t("ordersTitle")}</h2>
            {loading ? (
              <ul className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 animate-pulse">
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-slate-100" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-24 rounded bg-slate-100" />
                      <div className="h-3 w-16 rounded bg-slate-100" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 w-20 rounded-full bg-slate-100" />
                      <div className="h-5 w-14 rounded bg-slate-100" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-16 text-center">
                <Package className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">{t("ordersEmpty")}</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900">
                        {t("orderNumber")} {order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.created_at).toLocaleDateString(locale)}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                        {(t as (k: string) => string)(`orderStatuses.${order.status}`) || order.status}
                      </span>
                      <span className="font-semibold text-slate-900">{Number(order.total).toFixed(2)} €</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
