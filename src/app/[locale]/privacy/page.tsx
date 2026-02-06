import { notFound } from "next/navigation";
import { createTranslator } from "use-intl/core";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { locales, type Locale } from "@/i18n";

type PrivacyPageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });
  const breadcrumbsT = (key: string) => t(`breadcrumbs.${key}`);

  const title = locale === "pl" ? "Polityka prywatności" : locale === "uk" ? "Політика конфіденційності" : "Privacy Policy";
  const updated = locale === "pl" ? "Ostatnia aktualizacja: 4 lutego 2026" : locale === "uk" ? "Останнє оновлення: 4 лютого 2026" : "Last updated: 4 February 2026";

  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <BreadcrumbsBar
          items={[
            { label: breadcrumbsT("home"), href: `/${locale}`, isHome: true },
            { label: t("footer.privacy") },
          ]}
        />
        <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h1 className="font-heading text-2xl sm:text-3xl text-slate-900 mb-2">
            {title}
          </h1>
          <p className="text-sm text-slate-500 mb-8">{updated}</p>

          <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base">
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">1. Administrator danych</h2>
              <p>
                Administratorem danych osobowych jest firma <strong>Iarosław Romanevich: Big dreams bait</strong>. Siedziba: Im Buchenhain 3a, 49740 Haselünne, Deutschland. NIP: 61/137/19581. Kontakt: e-mail bigdreamsbait2025@gmail.com, telefon +49 173 3673099. Pełne dane dostępne w stopce serwisu.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">2. Zakres i cele przetwarzania</h2>
              <p>
                Przetwarzamy dane niezbędne do realizacji zamówień (imię, nazwisko, adres, e-mail, telefon), na podstawie art. 6 ust. 1 lit. b RODO (wykonanie umowy). Dane płatności są przetwarzane przez operatora płatności PayU S.A. zgodnie z jego polityką i wymogami prawa. Nie przetwarzamy danych wrażliwych ani danych w celach niezgodnych z prawem.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">3. Udostępnianie danych</h2>
              <p>
                Dane mogą być przekazywane: operatorowi płatności PayU (realizacja płatności), dostawcom usług IT (hosting), organom państwowym na podstawie przepisów prawa. Nie sprzedajemy ani nie przekazujemy danych osobowych podmiotom trzecim w celach marketingowych bez zgody.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">4. Okres przechowywania</h2>
              <p>
                Dane przechowujemy przez okres wymagany prawem (np. rozliczenia podatkowe) oraz do czasu przedawnienia ewentualnych roszczeń. Dane konta – do momentu usunięcia konta lub wycofania zgody.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">5. Prawa osób, których dane dotyczą</h2>
              <p>
                Przysługuje prawo dostępu do danych, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych, wniesienia sprzeciwu oraz skargi do Prezesa Urzędu Ochrony Danych Osobowych (PUODO). Zgoda na przetwarzanie, gdy stanowi podstawę, może być wycofana w dowolnym momencie.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">6. Bezpieczeństwo</h2>
              <p>
                Stosujemy środki techniczne i organizacyjne zapewniające bezpieczeństwo danych (m.in. szyfrowanie połączeń SSL). Płatności online realizowane są wyłącznie przez certyfikowany system PayU.
              </p>
            </section>
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">7. Zmiany polityki</h2>
              <p>
                Polityka może ulegać aktualizacjom. O istotnych zmianach poinformujemy na stronie serwisu. Korzystanie z serwisu po wejściu w życie zmian oznacza ich akceptację.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
