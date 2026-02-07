"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Home, LayoutGrid, ShoppingCart, User, MoreHorizontal } from "lucide-react";

type MobileBottomNavProps = {
  itemCount: number;
  onCatalogClick: () => void;
  onCartClick: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
};

export default function MobileBottomNav({
  itemCount,
  onCatalogClick,
  onCartClick,
  isLoggedIn,
  isAdmin,
}: MobileBottomNavProps) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isCatalog = pathname?.includes("/catalog");
  const isCart = pathname?.includes("/cart");
  const isAccount = pathname?.includes("/account") || pathname?.includes("/admin");
  const isMore = pathname?.includes("/promotions") || pathname?.includes("/sale");

  const linkClass = (active: boolean) =>
    `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
      active ? "text-[#0ea5e9]" : "text-slate-500"
    }`;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const navEl = (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] sm:hidden"
      aria-label="Main navigation"
    >
      <Link href={`/${locale}`} className={linkClass(isHome)}>
        <Home className="h-5 w-5" />
        <span className="whitespace-nowrap">{t("tabHome")}</span>
      </Link>
      <button type="button" onClick={onCatalogClick} className={linkClass(isCatalog)}>
        <LayoutGrid className="h-5 w-5" />
        <span className="whitespace-nowrap">{t("tabCatalog")}</span>
      </button>
      <button type="button" onClick={onCartClick} className={linkClass(isCart)}>
        <span className="relative inline-block">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 shadow">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        </span>
        <span className="whitespace-nowrap">{t("tabCart")}</span>
      </button>
      <Link
        href={`/${locale}/${isAdmin ? "admin" : isLoggedIn ? "account" : "auth"}`}
        className={linkClass(isAccount)}
      >
        <User className="h-5 w-5" />
        <span className="whitespace-nowrap">{isLoggedIn ? t("tabAccount") : t("tabAuth")}</span>
      </Link>
      <Link href={`/${locale}/promotions`} className={linkClass(isMore)}>
        <MoreHorizontal className="h-5 w-5" />
        <span className="whitespace-nowrap">{t("tabMore")}</span>
      </Link>
    </nav>
  );

  // Рендер через portal в body — як у кабінеті, без відступу знизу на iOS/Safari
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(navEl, document.body);
}
