import { createTranslator } from "use-intl/core";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

type PromotionsPageProps = {
  params: { locale: string };
};

export default async function PromotionsPage({ params }: PromotionsPageProps) {
  const locale = params.locale;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const translator = createTranslator({ locale, messages });
  const t = (key: string) => translator(`promotionsPage.${key}`);
  const breadcrumbsT = (key: string) => translator(`breadcrumbs.${key}`);
  const navT = (key: string) => translator(`header.${key}`);

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
              label: navT("promotions"),
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
