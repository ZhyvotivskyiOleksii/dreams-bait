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
  Youtube,
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
    { href: `/${locale}/delivery`, label: t("footer.delivery") },
    { href: `/${locale}/returns`, label: t("footer.returns") },
    { href: `/${locale}/warranty`, label: t("footer.warranty") },
    { href: `/${locale}/privacy`, label: t("footer.privacy") },
  ];

  return (
    <footer className="bg-black text-white">
      {/* Newsletter секція */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="font-heading text-3xl md:text-4xl mb-3 text-white">
              {t("newsletter.title")}
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              {t("newsletter.description")}
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="flex-1 px-5 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7dd3fc] focus:border-transparent"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Про компанію */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden">
                <Image src="/logo.png" alt={commonT("logoAlt")} width={40} height={40} />
              </div>
              <div>
                <span className="font-heading text-2xl tracking-wider text-white">DREAMS BAIT</span>
                <div className="text-xs tracking-widest uppercase text-[#7dd3fc] font-bold">
                  {commonT("officialPartner")}
                </div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t("footer.description")}
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#7dd3fc] rounded-full flex items-center justify-center hover:bg-[#f5c542] transition-colors"
              >
                <Facebook className="w-6 h-6 text-black" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#7dd3fc] rounded-full flex items-center justify-center hover:bg-[#f5c542] transition-colors"
              >
                <Instagram className="w-6 h-6 text-black" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#7dd3fc] rounded-full flex items-center justify-center hover:bg-[#f5c542] transition-colors"
              >
                <Youtube className="w-6 h-6 text-black" />
              </a>
            </div>
          </div>

          {/* Категорії */}
          <div>
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
          <div>
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
          <div>
            <h4 className="font-heading text-xl tracking-wide mb-5 text-white">
              {t("footer.contacts")}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#7dd3fc] flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">{t("footer.address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#7dd3fc] flex-shrink-0" />
                <a
                  href="tel:+380991234567"
                  className="text-gray-400 hover:text-[#7dd3fc] transition-colors text-sm"
                >
                  +38 (099) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#7dd3fc] flex-shrink-0" />
                <a
                  href="mailto:info@carppro.ua"
                  className="text-gray-400 hover:text-[#7dd3fc] transition-colors text-sm"
                >
                  info@carppro.ua
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} Dreams Bait. {t("footer.copyright")}
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
