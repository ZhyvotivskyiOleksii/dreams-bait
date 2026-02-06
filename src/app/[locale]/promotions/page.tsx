import { Suspense } from "react";
import { createTranslator } from "use-intl/core";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { getProductsWithDiscount } from "@/lib/catalogData";
import CatalogClient from "@/components/CatalogClient";
import type { Locale } from "@/i18n";

type PromotionsPageProps = {
  params: Promise<{ locale: string }> | { locale: string };
};

export default async function PromotionsPage({ params }: PromotionsPageProps) {
  const p = typeof (params as Promise<{ locale: string }>).then === "function"
    ? await (params as Promise<{ locale: string }>)
    : (params as { locale: string });
  const locale = p.locale as Locale;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });
  const breadcrumbsT = (key: string) => t(`breadcrumbs.${key}`);
  const navT = (key: string) => t(`header.${key}`);

  const products = await getProductsWithDiscount();

  return (
    <div className="min-h-screen bg-[#f2f4f8] pt-0 pb-16">
      <div className="container mx-auto px-4 sm:px-6">
        <BreadcrumbsBar
          items={[
            { label: breadcrumbsT("home"), href: `/${locale}`, isHome: true },
            { label: navT("promotions") },
          ]}
        />

        <div className="mt-6 mb-8">
          <h1 className="font-heading text-3xl md:text-4xl text-slate-800 mb-2">
            {t("promotionsPage.title")}
          </h1>
          <p className="text-slate-600">
            {t("promotionsPage.description")}
          </p>
        </div>

        <Suspense fallback={null}>
          <CatalogClient
            locale={locale}
            activeCategorySlug="promotions"
            categories={[]}
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
              empty: t("promotionsPage.description"),
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
