import { getLocale, getTranslations } from "next-intl/server";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

export default async function SalePage() {
  const locale = await getLocale();
  const t = await getTranslations("salePage");
  const breadcrumbsT = await getTranslations("breadcrumbs");
  const navT = await getTranslations("nav");

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-16">
      <div className="container mx-auto px-4">
        <BreadcrumbsBar
          items={[
            {
              label: breadcrumbsT("home"),
              href: `/${locale}`,
              isHome: true,
            },
            {
              label: navT("sale"),
            },
          ]}
        />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-heading mb-3">{t("title")}</h1>
          <p className="text-slate-600">{t("description")}</p>
        </div>
      </div>
    </div>
  );
}
