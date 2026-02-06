"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Globe, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { locales, localeFlags, localeInitials, type Locale } from "@/i18n";

interface LanguageSwitcherProps {
  isScrolled?: boolean;
  variant?: "header" | "mobile";
}

export default function LanguageSwitcher({ isScrolled = false, variant = "header" }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale() as Locale;
  const commonT = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLocaleChange = (newLocale: Locale) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    const query = searchParams.toString();
    router.push(query ? `${newPathname}?${query}` : newPathname);
    setIsOpen(false);
  };

  if (variant === "mobile") {
    return (
      <div className="space-y-2">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={clsx(
              "w-full flex items-center gap-2 px-4 py-3 rounded-lg transition-colors",
              locale === loc
                ? "bg-water-100 text-water-700"
                : "text-earth-600"
            )}
          >
            <span className="text-xl">{localeFlags[loc]}</span>
            <span className="font-medium">{localeInitials[loc]}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex items-center justify-center gap-1.5 sm:gap-2 h-9 w-10 lg:h-9 lg:w-auto lg:px-3 sm:px-2.5 rounded-lg transition-all duration-200",
          isScrolled
            ? "text-earth-600"
            : "text-white"
        )}
        aria-label={commonT("changeLanguage")}
      >
        <span className="text-lg sm:text-xl leading-none">{localeFlags[locale]}</span>
        <span className="font-semibold text-sm hidden sm:inline">{localeInitials[locale]}</span>
        <ChevronDown className={clsx(
          "w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/80 transition-transform flex-shrink-0 hidden sm:block",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 z-50 animate-slide-down">
            <div className="bg-white rounded-lg py-2 w-max min-w-0">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={clsx(
                    "w-full flex items-center gap-2 px-3 py-2 text-left",
                    locale === loc
                      ? "bg-water-50 text-water-700"
                      : "text-earth-700"
                  )}
                >
                  <span className="text-lg">{localeFlags[loc]}</span>
                  <span className="font-medium">{localeInitials[loc]}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

