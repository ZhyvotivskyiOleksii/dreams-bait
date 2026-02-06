"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Send
} from "lucide-react";

export default function Footer() {
  const t = useTranslations();
  const commonT = useTranslations("common");
  const locale = useLocale();

  const categories = [
    { href: `/${locale}/catalog/rods`, label: t("categories.rods") },
    { href: `/${locale}/catalog/reels`, label: t("categories.reels") },
    { href: `/${locale}/catalog/lines`, label: t("categories.lines") },
    { href: `/${locale}/catalog/bait`, label: t("categories.bait") },
    { href: `/${locale}/catalog/accessories`, label: t("categories.accessories") },
    { href: `/${locale}/catalog/clothing`, label: t("categories.clothing") },
  ];

  const infoLinks = [
    { href: `/${locale}/regulamin`, label: t("footer.regulamin") },
    { href: `/${locale}/privacy`, label: t("footer.privacy") },
    { href: `/${locale}/cookies`, label: t("footer.cookies") },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Newsletter секція */}
      <div className="border-b border-slate-200 bg-[#f2f4f8] text-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-heading text-3xl md:text-4xl mb-3 text-slate-900">
              {t("newsletter.title")}
            </h3>
            <p className="text-slate-600 mb-6 max-w-xl mx-auto">
              {t("newsletter.description")}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="flex-1 px-5 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7dd3fc] focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#7dd3fc] text-black font-bold tracking-wide rounded-lg hover:bg-[#f5c542] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {t("newsletter.button")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Основний контент */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {/* Про компанію */}
          <div className="lg:col-span-1 flex flex-col items-center">
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-5 justify-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
                <Image src="/logo.png" alt={commonT("logoAlt")} width={40} height={40} />
              </div>
              <div>
                <span className="font-heading text-2xl tracking-wider text-white">BIG DREAMS BAIT</span>
                <div className="text-xs tracking-widest uppercase text-[#7dd3fc] font-bold">
                  {commonT("officialPartner")}
                </div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              {t("footer.description")}
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#7dd3fc] rounded-full flex items-center justify-center hover:bg-[#f5c542] transition-colors"
                aria-label="TikTok"
              >
                <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#7dd3fc] rounded-full flex items-center justify-center hover:bg-[#f5c542] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6 text-black" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#7dd3fc] rounded-full flex items-center justify-center hover:bg-[#f5c542] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6 text-black" />
              </a>
            </div>
          </div>

          {/* Категорії */}
          <div className="flex flex-col items-center">
            <h4 className="font-heading text-xl tracking-wide mb-5 text-white">
              {t("footer.categories")}
            </h4>
            <ul className="space-y-3">
              {categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#7dd3fc] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Інформація */}
          <div className="flex flex-col items-center">
            <h4 className="font-heading text-xl tracking-wide mb-5 text-white">
              {t("footer.information")}
            </h4>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#7dd3fc] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакти */}
          <div className="flex flex-col items-center">
            <h4 className="font-heading text-xl tracking-wide mb-5 text-white">
              {t("footer.contacts")}
            </h4>
            <ul className="space-y-4 flex flex-col items-center">
              <li className="flex items-start gap-3 max-w-xs">
                <MapPin className="w-5 h-5 text-[#7dd3fc] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm text-left">{t("footer.address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#7dd3fc] flex-shrink-0" />
                <a
                  href="tel:+491733673099"
                  className="text-gray-400 hover:text-[#7dd3fc] transition-colors text-sm"
                >
                  {t("footer.phone")}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#7dd3fc] flex-shrink-0" />
                <a
                  href="mailto:bigdreamsbait2025@gmail.com"
                  className="text-gray-400 hover:text-[#7dd3fc] transition-colors text-sm"
                >
                  {t("footer.email")}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#7dd3fc] flex-shrink-0" />
                <span className="text-gray-400 text-sm">{t("footer.workHours")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Копірайт */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-500 text-center">
            <p>
              © {new Date().getFullYear()} Iarosław Romanevich: Big dreams bait. {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-6">
              <span>🇺🇦 {commonT("madeInUkraine")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
