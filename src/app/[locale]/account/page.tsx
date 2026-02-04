"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getProductBySlugOrId } from "@/lib/catalogData";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import type { Locale } from "@/i18n";

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

export default function AccountPage() {
  const t = useTranslations("account");
  const commonT = useTranslations("common");
  const breadcrumbsT = useTranslations("breadcrumbs");
  const navT = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "favorites">("profile");
  const [displayFavorites, setDisplayFavorites] = useState<
    {
      id: string;
      slug?: string;
      name?: string;
      image?: string;
      price?: number;
    }[]
  >([]);

  const countryLabel = (value?: string | null) => {
    if (!value) return "-";
    return t(`auth.countries.${value}` as never);
  };

  useEffect(() => {
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
      setLoading(false);
    };

    loadProfile();
  }, [locale, router]);

  const favorites = Array.isArray(profile?.favorites) ? profile?.favorites : [];

  useEffect(() => {
    let isActive = true;
    const loadFallbacks = async () => {
      const resolved = await Promise.all(
        favorites.map(async (item) => {
          if (item.name && item.image && typeof item.price === "number") {
            return {
              id: item.id,
              slug: item.slug,
              name: item.name,
              image: item.image,
              price: item.price,
            };
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
      if (isActive) {
        setDisplayFavorites(resolved);
      }
    };
    loadFallbacks();
    return () => {
      isActive = false;
    };
  }, [favorites, locale]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-slate-500">
        {commonT("loading")}
      </div>
    );
  }

  const handleRemoveFavorite = async (slug: string, id: string) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.replace(`/${locale}/auth`);
      return;
    }
    const nextFavorites = favorites.filter(
      (fav) => fav.slug !== slug && fav.id !== id
    );
    await supabase
      .from("profiles")
      .update({ favorites: nextFavorites })
      .eq("id", data.user.id);
    setProfile((prev) => (prev ? { ...prev, favorites: nextFavorites } : prev));
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="container mx-auto px-4">
        <BreadcrumbsBar
          items={[
            {
              label: breadcrumbsT("home"),
              href: `/${locale}`,
              isHome: true,
            },
            {
              label: navT("account"),
            },
          ]}
        />
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading mb-2">{t("title")}</h1>
              <p className="text-slate-500 text-sm">{t("subtitle")}</p>
            </div>
            <Link
              href={`/${locale}`}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              {t("backToSite")}
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === "profile"
                  ? "bg-[#7dd3fc] text-black"
                  : "bg-white text-slate-500 border border-slate-200"
              }`}
            >
              {t("menuProfile")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("favorites")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === "favorites"
                  ? "bg-[#7dd3fc] text-black"
                  : "bg-white text-slate-500 border border-slate-200"
              }`}
            >
              {t("menuFavorites")}
            </button>
          </div>

          {activeTab === "profile" ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase text-slate-400">{t("fields.firstName")}</p>
                <p className="text-sm text-slate-800">{profile?.first_name || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">{t("fields.lastName")}</p>
                <p className="text-sm text-slate-800">{profile?.last_name || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">{t("fields.phone")}</p>
                <p className="text-sm text-slate-800">{profile?.phone || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">{t("fields.email")}</p>
                <p className="text-sm text-slate-800">{profile?.email || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">{t("fields.country")}</p>
                <p className="text-sm text-slate-800">{countryLabel(profile?.country)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">{t("fields.city")}</p>
                <p className="text-sm text-slate-800">{profile?.city || "-"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase text-slate-400">{t("fields.address")}</p>
                <p className="text-sm text-slate-800">{profile?.address || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400">{t("fields.postalCode")}</p>
                <p className="text-sm text-slate-800">{profile?.postal_code || "-"}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {t("favoritesTitle")}
              </h2>
              {displayFavorites.length === 0 ? (
                <p className="text-sm text-slate-500">{t("favoritesEmpty")}</p>
              ) : (
                <div className="grid gap-4">
                  {displayFavorites.map((item) => (
                    <div
                      key={`${item.id}-${item.slug}`}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-50">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name || "-"}
                            fill
                            sizes="64px"
                            className="object-contain p-2"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800">
                          {item.name}
                        </p>
                        {typeof item.price === "number" && (
                          <p className="text-xs text-black">
                            {item.price} €
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/${locale}/product/${item.slug}`}
                          className="rounded-full border border-[#7dd3fc] px-3 py-1 text-xs font-semibold text-[#0f0f0f] hover:bg-[#7dd3fc]/20"
                        >
                          {t("favoritesView")}
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveFavorite(item.slug || item.id, item.id)}
                          className="rounded-full bg-[#7dd3fc] px-3 py-1 text-xs font-semibold text-black hover:bg-[#f5c542]"
                        >
                          {t("favoritesRemove")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
