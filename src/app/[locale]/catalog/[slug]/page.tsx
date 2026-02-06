import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createTranslator } from "use-intl/core";
import Image from "next/image";
import {
  getCategoryBySlug,
  getProductsByCategory,
  catalogSlugs,
} from "@/lib/catalogData";
import CatalogClient from "@/components/CatalogClient";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { locales, type Locale } from "@/i18n";

type CatalogPageProps = {
  params: { slug: string; locale: Locale };
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    catalogSlugs.map((slug) => ({ locale, slug }))
  );
}

export default async function CatalogPage({ params }: CatalogPageProps) {
  const { slug, locale } = params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });

  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug),
  ]);
  if (!category) {
    notFound();
  }
  const categoryFilters: { slug: string; label: string }[] =
    slug === "carp-rods" || slug === "feeder-rods" || slug === "rods"
      ? [
          { slug: "carp-rods", label: t("megaMenu.subcategories.carpRods") },
          { slug: "feeder-rods", label: t("megaMenu.subcategories.feederRods") },
        ]
      : [];
  const categories = categoryFilters;

  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16">
      <div className="container mx-auto px-[14px] sm:px-4">
        <BreadcrumbsBar
          items={[
            {
              label: t("breadcrumbs.home"),
              href: `/${locale}`,
              isHome: true,
            },
            {
              label: t("breadcrumbs.catalog"),
            },
            {
              label: t(category.titleKey),
            },
          ]}
        />

        <div className="-mx-4 overflow-hidden rounded-none border border-slate-200 bg-white sm:mx-0 sm:rounded-3xl">
          <div className="relative h-36 w-full">
            <Image
              src={category.image}
              alt={t(category.titleKey)}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/55 via-slate-900/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-white" />
            <div className="absolute inset-0 flex items-center px-8">
              <h1 className="text-3xl font-heading text-white">
                {t(category.titleKey)}
              </h1>
            </div>
          </div>
        </div>

        <Suspense fallback={null}>
          <CatalogClient
            locale={locale}
            activeCategorySlug={slug}
            categories={categories}
            products={products}
            labels={{
              categoriesTitle: t("catalogPage.categoriesTitle"),
              tagsTitle: t("catalogPage.tagsTitle"),
              priceTitle: t("catalogPage.priceTitle"),
              from: t("catalogPage.from"),
              to: t("catalogPage.to"),
              apply: t("catalogPage.apply"),
              filterTitle: t("catalogPage.filterTitle"),
              filterOpen: t("catalogPage.filterOpen"),
              filterClose: t("catalogPage.filterClose"),
              filterBack: t("catalogPage.filterBack"),
              filterShow: t("catalogPage.filterShow"),
              empty: t("catalogPage.empty"),
              favorites: t("catalogPage.favorites"),
              addToCart: t("catalogPage.addToCart"),
              codeLabel: t("catalogPage.codeLabel"),
              boughtLabel: t("catalogPage.boughtLabel"),
              outOfStock: t("catalogPage.outOfStock"),
              badgeHit: t("catalogPage.badges.hit"),
              badgeSuper: t("catalogPage.badges.super"),
              badgeNew: t("catalogPage.badges.new"),
              currency: t("currency.uah"),
            }}
          />
        </Suspense>
      </div>
    </div>
  );
}
