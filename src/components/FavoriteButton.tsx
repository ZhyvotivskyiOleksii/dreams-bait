"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Heart, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type FavoriteItem = {
  id: string;
  slug: string;
  name?: string;
  image?: string;
  price?: number;
  categorySlug?: string;
};

type FavoriteButtonProps = {
  ariaLabel: string;
  item?: FavoriteItem;
  className?: string;
  iconClassName?: string;
};

export default function FavoriteButton({
  ariaLabel,
  item,
  className,
  iconClassName = "w-4 h-4",
}: FavoriteButtonProps) {
  const t = useTranslations("favoritesModal");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const search = searchParams.toString();
  const returnTo = search ? `${pathname}?${search}` : pathname;

  const loadFavorites = async () => {
    if (!item) {
      setIsActive(false);
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setIsActive(false);
      return;
    }
    const { data: profileData } = await supabase
      .from("profiles")
      .select("favorites")
      .eq("id", userId)
      .maybeSingle();
    const currentFavorites = Array.isArray(profileData?.favorites)
      ? (profileData?.favorites as FavoriteItem[])
      : [];
    const exists = currentFavorites.some(
      (fav) => fav.slug === item.slug || fav.id === item.id
    );
    setIsActive(exists);
  };

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) {
        const authed = Boolean(data.session);
        setIsAuthed(authed);
        if (authed) {
          loadFavorites();
        } else {
          setIsActive(false);
        }
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const authed = Boolean(session);
        setIsAuthed(authed);
        if (authed) {
          loadFavorites();
        } else {
          setIsActive(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, [item?.id, item?.slug]);

  const handleOpen = async (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (!isAuthed) {
      setIsOpen(true);
      return;
    }

    if (!item || isSaving) {
      return;
    }

    const nextActive = !isActive;
    setIsActive(nextActive);
    setIsSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setIsAuthed(false);
      setIsOpen(true);
      setIsActive(isActive);
      setIsSaving(false);
      return;
    }

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("favorites")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      setIsActive(isActive);
      setIsSaving(false);
      return;
    }

    const currentFavorites = Array.isArray(profileData?.favorites)
      ? (profileData?.favorites as FavoriteItem[])
      : [];

    const exists = currentFavorites.some(
      (fav) => fav.slug === item.slug || fav.id === item.id
    );
    const nextFavorites = nextActive
      ? exists
        ? currentFavorites
        : [...currentFavorites, item]
      : currentFavorites.filter(
          (fav) => fav.slug !== item.slug && fav.id !== item.id
        );

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    const { error: updateError } = existingProfile?.id
      ? await supabase
          .from("profiles")
          .update({ favorites: nextFavorites })
          .eq("id", userId)
      : await supabase
          .from("profiles")
          .upsert({ id: userId, favorites: nextFavorites }, { onConflict: "id" });

    if (updateError) {
      setIsActive((prev) => !prev);
    }
    setIsSaving(false);
  };

  const handleAuth = (mode: "login" | "register") => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    params.set("returnTo", returnTo);
    router.push(`/${locale}/auth?${params.toString()}`);
  };

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={ariaLabel}
        onClick={handleOpen}
        disabled={isSaving}
        aria-pressed={isActive}
      >
        <Heart
          className={`${iconClassName} transition-colors duration-200 ease-out ${
            isActive ? "text-rose-500 fill-rose-500" : "text-current"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-sm rounded-3xl bg-white p-6 text-center"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:text-slate-600"
              aria-label={t("close")}
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto mb-4 w-60">
              <Image
                src="/login-img/welcom.png"
                alt={t("imageAlt")}
                width={320}
                height={260}
                className="h-auto w-full"
              />
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              {t("title")}
            </h3>
            <p className="mt-2 text-sm text-slate-500">{t("subtitle")}</p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => handleAuth("login")}
                className="w-full rounded-full bg-[#7dd3fc] py-3 text-sm font-semibold text-black transition-colors hover:bg-[#f5c542]"
              >
                {t("login")}
              </button>
              <button
                type="button"
                onClick={() => handleAuth("register")}
                className="w-full rounded-full border border-[#7dd3fc] py-3 text-sm font-semibold text-[#0f0f0f] transition-colors hover:bg-[#7dd3fc]/20"
              >
                {t("register")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
