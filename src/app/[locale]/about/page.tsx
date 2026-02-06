import { createTranslator } from "use-intl/core";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";

type AboutPageProps = {
  params: Promise<{ locale: string }> | { locale: string };
};

export default async function AboutPage({ params }: AboutPageProps) {
  const p = typeof (params as Promise<{ locale: string }>).then === "function"
    ? await (params as Promise<{ locale: string }>)
    : (params as { locale: string });
  const locale = p.locale;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const translator = createTranslator({ locale, messages });
  const t = (key: string) => translator(`aboutPage.${key}`);
  const breadcrumbsT = (key: string) => translator(`breadcrumbs.${key}`);

  return (
    <div className="min-h-screen bg-[#f2f4f8] pt-0 pb-16">
      <div className="container mx-auto px-4">
        <BreadcrumbsBar
          items={[
            { label: breadcrumbsT("home"), href: `/${locale}`, isHome: true },
            { label: t("title") },
          ]}
        />
        <div className="mx-auto max-w-2xl text-center mt-8">
          <h1 className="font-heading text-3xl md:text-4xl text-slate-800 mb-4">
            {t("title")}
          </h1>
          <p className="text-slate-600 text-lg">
            {t("comingSoon")}
          </p>
        </div>
      </div>
    </div>
  );
}
