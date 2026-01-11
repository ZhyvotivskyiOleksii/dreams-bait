"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, Search, ShoppingCart, Fish, X } from "lucide-react";
import clsx from "clsx";
import LanguageSwitcher from "./LanguageSwitcher";
import MegaMenu from "./MegaMenu";

export default function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMegaMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-black/95 backdrop-blur-md shadow-lg py-2"
            : "bg-black/50 backdrop-blur-sm py-4"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Ліва частина - Кнопка меню */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMegaMenuOpen(true)}
                className="group flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#5cd915' }}
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

              {/* Швидкі посилання */}
              <nav className="hidden lg:flex items-center gap-6">
                <Link
                  href={`/${locale}/about`}
                  className="text-white hover:text-[#5cd915] font-medium transition-colors"
                >
                  {t("about")}
                </Link>
                <Link
                  href={`/${locale}/contact`}
                  className="text-white hover:text-[#5cd915] font-medium transition-colors"
                >
                  {t("contact")}
                </Link>
              </nav>
            </div>

            {/* Центр - Логотип */}
            <Link href={`/${locale}`} className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 group">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#5cd915' }}
              >
                <Fish className="w-8 h-8 text-black" />
              </div>
              <div className="hidden sm:block">
                <span className="font-heading text-2xl text-white tracking-wide">
                  CARP PRO
                </span>
                <div 
                  className="text-xs tracking-widest uppercase font-bold"
                  style={{ color: '#5cd915' }}
                >
                  Official Partner
                </div>
              </div>
            </Link>

            {/* Права частина */}
            <div className="flex items-center gap-3">
              {/* Пошук */}
              <div className="relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-3 rounded-full text-white hover:bg-white/10 transition-all duration-200"
                  aria-label="Search"
                >
                  <Search className="w-6 h-6" />
                </button>
                
                {isSearchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80">
                    <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 p-3">
                      <input
                        type="text"
                        placeholder={t("search")}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5cd915] focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Перемикач мови */}
              <LanguageSwitcher isScrolled={isScrolled} />

              {/* Кошик */}
              <Link
                href={`/${locale}/cart`}
                className="relative p-3 rounded-full text-white hover:bg-white/10 transition-all duration-200"
              >
                <ShoppingCart className="w-6 h-6" />
                <span 
                  className="absolute -top-1 -right-1 min-w-[24px] h-[24px] text-black text-xs font-bold rounded-full flex items-center justify-center border-2 border-black"
                  style={{ backgroundColor: '#5cd915' }}
                >
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Мега меню */}
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
      />
    </>
  );
}
