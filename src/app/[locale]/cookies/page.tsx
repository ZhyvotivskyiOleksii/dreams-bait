import { notFound } from "next/navigation";
import { createTranslator } from "use-intl/core";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { locales, type Locale } from "@/i18n";

type CookiesPageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });
  const breadcrumbsT = (key: string) => t(`breadcrumbs.${key}`);

  const title = locale === "pl" ? "Polityka cookies" : locale === "uk" ? "Політика cookies" : "Cookie Policy";
  const updated = locale === "pl" ? "Ostatnia aktualizacja: 4 lutego 2026" : locale === "uk" ? "Останнє оновлення: 4 лютого 2026" : "Last updated: 4 February 2026";

  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <BreadcrumbsBar
          items={[
            { label: breadcrumbsT("home"), href: `/${locale}`, isHome: true },
            { label: t("footer.cookies") },
          ]}
        />
        <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h1 className="font-heading text-2xl sm:text-3xl text-slate-900 mb-2">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mb-8">{updated}</p>

          <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base">
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">1. Czym są pliki cookies</h2>
              <p>
                Pliki cookies to niewielkie pliki tekstowe zapisywane na urządzeniu użytkownika przez przeglądarkę. Służą m.in. do utrzymania sesji, zapamiętania preferencji oraz zapewnienia poprawnego działania serwisu i procesu płatności.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">2. Jak wykorzystujemy cookies</h2>
              <p>
                Serwis Iarosław Romanevich: Big dreams bait wykorzystuje cookies niezbędne do działania sklepu (np. sesja, koszyk, uwierzytelnienie) oraz – w razie zastosowania – cookies analityczne w celu optymalizacji serwisu. Płatności online obsługiwane są przez PayU; operator PayU może ustawiać własne cookies związane z procesem płatności, zgodnie z polityką PayU i obowiązującymi przepisami.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">3. Podstawa prawna</h2>
              <p>
                Cookies niezbędne do działania serwisu i realizacji umowy (w tym płatności) są stosowane na podstawie prawnie uzasadnionego interesu administratora oraz wykonania umowy (art. 6 ust. 1 lit. f i b RODO). Inne cookies (np. analityczne) – na podstawie zgody, o ile jest wymagana.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">4. Zarządzanie cookies</h2>
              <p>
                Użytkownik może ograniczyć lub wyłączyć cookies w ustawieniach przeglądarki. Ograniczenie lub wyłączenie cookies niezbędnych może skutkować nieprawidłowym działaniem serwisu lub brakiem możliwości skorzystania z płatności online. Więcej informacji znajduje się w dokumentacji przeglądarki oraz w polityce PayU dotyczącej plików cookies.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">5. Aktualizacje</h2>
              <p>
                Polityka cookies może być aktualizowana. O istotnych zmianach poinformujemy na stronie. Dalsze korzystanie z serwisu po opublikowaniu zmian oznacza akceptację zaktualizowanej polityki.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
