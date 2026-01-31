"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { X, ChevronRight, ShoppingCart, Search } from "lucide-react";
import clsx from "clsx";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavLink {
  href: string;
  label: string;
  submenu?: { href: string; label: string }[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
}

export default function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const t = useTranslations("nav");
  const commonT = useTranslations("common");
  const locale = useLocale();

  // Блокування прокрутки при відкритому меню
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Оверлей */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      />

      {/* Панель меню */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Шапка */}
          <div className="flex items-center justify-between p-4 border-b border-sand-200">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <Image src="/logo.png" alt={commonT("logoAlt")} width={28} height={28} />
              </div>
              <span className="font-heading text-xl text-forest-800">DREAMS BAIT</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-earth-600 hover:bg-sand-100 rounded-full transition-colors"
              aria-label={commonT("closeMenu")}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Пошук */}
          <div className="p-4 border-b border-sand-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
              <input
                type="text"
                placeholder={t("search")}
                className="w-full pl-10 pr-4 py-3 bg-sand-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          {/* Навігація */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navLinks.map((link) => (
              <div key={link.href} className="border-b border-sand-100 last:border-0">
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-6 py-4 text-earth-800 font-medium hover:bg-sand-50 transition-colors"
                >
                  {link.label}
                  {link.submenu && <ChevronRight className="w-5 h-5 text-earth-400" />}
                </Link>
                
                {link.submenu && (
                  <div className="bg-sand-50 pb-2">
                    {link.submenu.map((sublink) => (
                      <Link
                        key={sublink.href}
                        href={sublink.href}
                        onClick={onClose}
                        className="block px-8 py-3 text-earth-600 hover:text-forest-600 transition-colors"
                      >
                        {sublink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Кошик */}
          <div className="p-4 border-t border-sand-200">
            <Link
              href={`/${locale}/cart`}
              onClick={onClose}
              className="flex items-center justify-center gap-3 w-full py-3 bg-forest-700 text-white font-heading text-lg tracking-wide rounded-lg hover:bg-forest-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {t("cart")}
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-sm">0</span>
            </Link>
          </div>

          {/* Перемикач мови */}
          <div className="p-4 border-t border-sand-200 bg-sand-50">
            <p className="text-sm text-earth-500 mb-3 font-medium">{commonT("languageLabel")}</p>
            <LanguageSwitcher variant="mobile" />
          </div>
        </div>
      </div>
    </>
  );
}

