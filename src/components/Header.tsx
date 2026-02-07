"use client";

import { Suspense, useState, useEffect } from "react";
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md transition-all duration-300 px-4 py-2 sm:px-6 sm:py-2.5 lg:px-10 lg:py-3 xl:px-[40px]">
        <div className="mx-auto w-full max-w-[100vw] min-w-0">
          <div className="flex items-center justify-between gap-3 min-w-0 lg:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 lg:flex-initial">
              <button
                onClick={() => setIsMegaMenuOpen(true)}
                className="group flex items-center justify-center gap-1 sm:gap-2.5 h-8 w-9 lg:h-9 lg:min-w-[130px] lg:px-4 lg:py-2 sm:min-w-0 sm:px-3 sm:py-1.5 rounded-lg transition-all duration-200 hover:brightness-110 flex-shrink-0"
                style={{ backgroundColor: "#7dd3fc" }}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="w-2.5 h-0.5 sm:w-3.5 lg:w-4 bg-black rounded-full transition-all group-hover:w-4"></span>
                  <span className="w-3 h-0.5 sm:w-4 lg:w-5 bg-black rounded-full"></span>
                  <span className="w-2 h-0.5 sm:w-2.5 lg:w-3 bg-black rounded-full transition-all group-hover:w-4"></span>
                </div>
                <span className="hidden sm:block text-black font-bold uppercase tracking-wider text-[10px] lg:text-sm whitespace-nowrap">
                  {t("catalog")}
                </span>
              </button>

              {/* Пошук — тільки десктоп */}
              <div className="hidden lg:flex items-center flex-shrink-0">
                <div className="relative h-9">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
                  <input
                    type="text"
                    placeholder={t("search")}
                    className="h-9 w-40 xl:w-48 pl-9 pr-3 rounded-full bg-white/10 text-white text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#7dd3fc] transition-colors"
                  />
                </div>
              </div>

              {/* Лого + назва: на мобільному по центру, на десктопі зліва */}
              <Link
                href={`/${locale}`}
                className="flex items-center justify-center gap-2 flex-1 min-w-0 lg:flex-initial lg:justify-start lg:ml-1"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ring-2 ring-white/10">
                  <Image src="/logo.png" alt={commonT("logoAlt")} width={40} height={40} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                  <span className="font-heading text-xs sm:text-base lg:text-lg text-white tracking-wide truncate block">
                    BIG DREAMS BAIT
                  </span>
                  <div
                    className="text-[9px] sm:text-[10px] lg:text-xs tracking-widest uppercase font-bold hidden sm:block"
                    style={{ color: "#7dd3fc" }}
                  >
                    {commonT("officialPartner")}
                  </div>
                </div>
              </Link>
            </div>

            {/* Права частина */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
                <Link
                  href={`/${locale}/promotions`}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-bold hover:brightness-110 transition-all"
                  style={{ background: "linear-gradient(90deg, #fb232e, #750e12)" }}
                >
                  <span>{headerT("promotions")}</span>
                  <span className="w-6 h-6 -mr-2 rounded-full bg-white text-[#750e12] text-xs font-bold flex items-center justify-center">
                    0
                  </span>
                </Link>
                <Link
                  href={`/${locale}/sale`}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-sm font-bold hover:brightness-110 transition-all"
                  style={{ background: "linear-gradient(90deg, #ff9130, #df4604)" }}
                >
                  <span className="inline-flex w-6 h-6 -ml-2 rounded-full bg-white/20 items-center justify-center">
                    <Percent className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span>{headerT("sale")}</span>
                </Link>
              </div>

              <Suspense fallback={null}>
                <LanguageSwitcher isScrolled={false} />
              </Suspense>

              {isLoggedIn ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link
                    href={`/${locale}/${isAdmin ? "admin" : "account"}`}
                    className="inline-flex items-center justify-center w-9 h-9 sm:gap-2 sm:w-auto sm:h-9 sm:px-4 rounded-full text-white hover:bg-white/10 transition-colors"
                    aria-label={isAdmin ? headerT("admin") : headerT("account")}
                  >
                    <User className="w-5 h-5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline text-sm font-semibold">{isAdmin ? headerT("admin") : headerT("account")}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="hidden lg:inline-flex items-center justify-center w-9 h-9 rounded-full text-white hover:bg-white/10 transition-colors"
                    aria-label={headerT("logout")}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href={`/${locale}/auth`}
                  className="inline-flex items-center justify-center w-9 h-9 sm:gap-2 sm:w-auto sm:h-9 sm:px-4 rounded-full text-white hover:bg-white/10 transition-colors"
                  aria-label={headerT("auth")}
                >
                  <User className="w-5 h-5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline text-sm font-semibold">{headerT("auth")}</span>
                </Link>
              )}

              {/* Кошик */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full text-white hover:bg-white/10 transition-all duration-200"
                aria-label={t("cart")}
              >
                <span className="relative inline-flex">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" strokeWidth={2} />
                  <span
                    className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] sm:min-w-[16px] sm:h-[16px] lg:min-w-[18px] lg:h-[18px] text-black text-[9px] sm:text-[10px] lg:text-xs font-bold rounded-full flex items-center justify-center border border-white"
                    style={{ backgroundColor: "#7dd3fc" }}
                  >
                    {itemCount}
                  </span>
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
