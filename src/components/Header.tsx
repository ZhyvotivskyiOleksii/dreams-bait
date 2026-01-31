"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, Search, ShoppingCart, X, Percent, User, LogOut } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import MegaMenu from "./MegaMenu";
import CartDrawer from "./CartDrawer";
import { useCart } from "./CartProvider";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const t = useTranslations("nav");
  const headerT = useTranslations("header");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    setIsMegaMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      setIsLoggedIn(Boolean(session));
      if (session?.user?.id) {
        const { data: adminRow } = await supabase
          .from("admins")
          .select("id")
          .eq("user_id", session.user.id)
          .maybeSingle();
        setIsAdmin(Boolean(adminRow));
      } else {
        setIsAdmin(false);
      }
    };
    loadSession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(Boolean(session));
      if (session?.user?.id) {
        supabase
          .from("admins")
          .select("id")
          .eq("user_id", session.user.id)
          .maybeSingle()
          .then(({ data: adminRow }) => setIsAdmin(Boolean(adminRow)));
      } else {
        setIsAdmin(false);
      }
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md shadow-lg py-3 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3 flex-wrap lg:flex-nowrap">
            {/* Ліва частина - Кнопка меню */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsMegaMenuOpen(true)}
                className="group flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: "#7dd3fc" }}
              >
                <div className="flex flex-col gap-1">
                  <span className="w-5 h-0.5 bg-black rounded-full transition-all group-hover:w-6"></span>
                  <span className="w-6 h-0.5 bg-black rounded-full"></span>
                  <span className="w-4 h-0.5 bg-black rounded-full transition-all group-hover:w-6"></span>
                </div>
                <span className="hidden sm:block text-black font-bold uppercase tracking-wider text-sm">
                  {t("catalog")}
                </span>
              </button>

              {/* Пошук */}
              <div className="hidden lg:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                  <input
                    type="text"
                    placeholder={t("search")}
                    className="w-44 xl:w-56 pl-9 pr-3 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#7dd3fc] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Центр - Логотип */}
            <Link href={`/${locale}`} className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 group">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}
              >
                <Image src="/logo.png" alt={commonT("logoAlt")} width={40} height={40} />
              </div>
              <div className="hidden sm:block">
                <span className="font-heading text-2xl text-white tracking-wide">
                  DREAMS BAIT
                </span>
                <div
                  className="text-xs tracking-widest uppercase font-bold"
                  style={{ color: "#7dd3fc" }}
                >
                  {commonT("officialPartner")}
                </div>
              </div>
            </Link>

            {/* Права частина */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {/* Акції / Розпродаж */}
              <div className="hidden xl:flex items-center gap-3">
                <Link
                  href={`/${locale}/promotions`}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e22b2b] text-white text-xs font-bold shadow-lg shadow-[#e22b2b]/40 hover:brightness-110 transition-all"
                >
                  <span>{headerT("promotions")}</span>
                  <span className="w-5 h-5 -mr-2 rounded-full bg-white text-[#e22b2b] text-[10px] font-bold flex items-center justify-center shadow-md">
                    0
                  </span>
                </Link>
                <Link
                  href={`/${locale}/sale`}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff8a00] text-white text-xs font-bold shadow-lg shadow-[#ff8a00]/40 hover:brightness-110 transition-all"
                >
                  <span className="inline-flex w-5 h-5 -ml-2 rounded-full bg-white/20 items-center justify-center shadow-md">
                    <Percent className="w-3 h-3 text-white" />
                  </span>
                  <span>{headerT("sale")}</span>
                </Link>
              </div>

              {/* Перемикач мови */}
              <LanguageSwitcher isScrolled={false} />

              {isLoggedIn ? (
                <div className="hidden lg:flex items-center gap-2">
                  <Link
                    href={`/${locale}/${isAdmin ? "admin" : "account"}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    {isAdmin ? headerT("admin") : headerT("account")}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors"
                    aria-label={headerT("logout")}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href={`/${locale}/auth`}
                  className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {headerT("auth")}
                </Link>
              )}

              {/* Кошик */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-3 rounded-full text-white hover:bg-white/10 transition-all duration-200"
                aria-label={t("cart")}
              >
                <ShoppingCart className="w-6 h-6" />
                <span 
                  className="absolute -top-1 -right-1 min-w-[24px] h-[24px] text-black text-xs font-bold rounded-full flex items-center justify-center border-2 border-black"
                  style={{ backgroundColor: "#7dd3fc" }}
                >
                  {itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Мега меню */}
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}
