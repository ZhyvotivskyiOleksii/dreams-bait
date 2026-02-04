"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Globe, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { locales, localeNames, localeFlags, type Locale } from "@/i18n";

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
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              locale === loc
                ? "bg-carp-100 text-carp-700"
                : "text-earth-600 hover:bg-sand-100"
            )}
          >
            <span className="text-xl">{localeFlags[loc]}</span>
            <span className="font-medium">{localeNames[loc]}</span>
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
          "flex items-center gap-1 p-2 rounded-full transition-all duration-200",
          isScrolled
            ? "text-earth-600 hover:bg-sand-200"
            : "text-white hover:bg-white/20"
        )}
        aria-label={commonT("changeLanguage")}
      >
        <span className="text-lg">{localeFlags[locale]}</span>
        <ChevronDown className={clsx(
          "w-4 h-4 transition-transform",
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
            <div className="bg-white rounded-lg shadow-xl border border-sand-200 py-2 min-w-[160px]">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-2 text-left transition-colors",
                    locale === loc
                      ? "bg-carp-50 text-carp-700"
                      : "text-earth-700 hover:bg-sand-100"
                  )}
                >
                  <span className="text-lg">{localeFlags[loc]}</span>
                  <span className="font-medium">{localeNames[loc]}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

