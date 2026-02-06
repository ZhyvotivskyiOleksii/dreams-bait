import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { locales, type Locale } from "@/i18n";

const CATALOG_CATEGORIES = [
  { id: "rods", titleKey: "megaMenu.categories.rods", image: "/category/wendka.webp" },
  { id: "reels", titleKey: "megaMenu.categories.reels", image: "/category/kolowrotek.webp" },
  { id: "lines", titleKey: "megaMenu.categories.lines", image: "/category/zylki.jpg" },
  { id: "bait", titleKey: "megaMenu.categories.bait", image: "/category/zenety.jpg" },
  { id: "boilie-ingredients", titleKey: "megaMenu.subcategories.boilieIngredients", image: "/category/carp_boilies.png" },
  { id: "accessories", titleKey: "megaMenu.categories.accessories", image: "/category/aksesoria.jpg" },
  { id: "landing-nets", titleKey: "megaMenu.subcategories.landingNets", image: "/category/podbierak.jpg" },
  { id: "rod-pods", titleKey: "megaMenu.subcategories.rodPods", image: "/category/rodpod.webp" },
  { id: "bite-alarms", titleKey: "megaMenu.subcategories.biteAlarms", image: "/category/sygnalizator.jpg" },
  { id: "camping", titleKey: "megaMenu.categories.camping", image: "/category/camping.webp" },
] as const;

type CatalogIndexPageProps = {
  params: Promise<{ locale: string }> | { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CatalogIndexPage({ params }: CatalogIndexPageProps) {
  const p = typeof (params as Promise<{ locale: string }>).then === "function"
    ? await (params as Promise<{ locale: string }>)
    : (params as { locale: string });
  const locale = p.locale as Locale;
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-[#f2f4f8] pt-0 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <BreadcrumbsBar
          items={[
            { label: t("breadcrumbs.home"), href: `/${locale}`, isHome: true },
            { label: t("breadcrumbs.catalog") },
          ]}
        />

        <h1 className="font-heading text-2xl md:text-3xl text-slate-800 mb-1 mt-3">
          {t("nav.catalog")}
        </h1>
        <p className="text-slate-600 text-sm md:text-base mb-5 max-w-2xl">
          {t("catalogPage.intro")}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
          {CATALOG_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/catalog/${category.id}`}
              className="group relative aspect-[4/3] sm:aspect-[1] rounded-xl overflow-hidden bg-white transition-all duration-300 hover:-translate-y-0.5"
            >
              <Image
                src={category.image}
                alt={t(category.titleKey)}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />
              <div className="absolute inset-0 flex items-end p-2 sm:p-3">
                <h2 className="font-heading text-white text-xs sm:text-sm leading-tight line-clamp-2">
                  {t(category.titleKey)}
                </h2>
              </div>
              <div className="absolute inset-0 bg-[#7dd3fc]/0 group-hover:bg-[#7dd3fc]/15 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
