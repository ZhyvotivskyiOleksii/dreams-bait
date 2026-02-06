import { notFound } from "next/navigation";
import { createTranslator } from "use-intl/core";
import BreadcrumbsBar from "@/components/BreadcrumbsBar";
import { locales, type Locale } from "@/i18n";

type RegulaminPageProps = {
  params: { locale: string };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RegulaminPage({ params }: RegulaminPageProps) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const messages = (await import(`@/messages/${locale}.json`)).default;
  const t = createTranslator({ locale, messages });
  const breadcrumbsT = (key: string) => t(`breadcrumbs.${key}`);
  const navT = (key: string) => t(`nav.${key}`);

  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <BreadcrumbsBar
          items={[
            { label: breadcrumbsT("home"), href: `/${locale}`, isHome: true },
            { label: navT("regulamin") },
          ]}
        />
        <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h1 className="font-heading text-2xl sm:text-3xl text-slate-900 mb-2">
            Regulamin Świadczenia Usług
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Ostatnia aktualizacja: 4 lutego 2026
          </p>

          <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base">
            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">1. Postanowienia ogólne</h2>
              <p>
                Niniejszy regulamin określa zasady świadczenia usług drogą elektroniczną przez serwis <strong>Iarosław Romanevich: Big dreams bait</strong>.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">2. Dane Firmy</h2>
              <p>
                Usługodawcą jest firma <strong>Iarosław Romanevich: Big dreams bait</strong>. Siedziba: Im Buchenhain 3a, 49740 Haselünne, Deutschland. NIP: 61/137/19581. Kontakt: e-mail bigdreamsbait2025@gmail.com, telefon +49 173 3673099. Pełne dane kontaktowe dostępne są także w stopce serwisu.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">3. Opis Usług</h2>
              <p>
                Serwis oferuje sprzedaż sprzętu wędkarskiego i akcesoriów (m.in. wędki, kołowrotki, przynęty, akcesoria). Ceny wszystkich towarów i usług podane są w złotych polskich (PLN) i są cenami brutto. Szczegółowy opis towarów oraz cennik znajduje się na stronie Serwisu.
              </p>
              <p>
                Informacje o produktach mają charakter informacyjny. Nie zastępują one konsultacji specjalistycznej w zakresie doboru sprzętu.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">4. Płatności Online</h2>
              <p>
                Płatności za zamówienia można dokonać za pośrednictwem systemu PayU, który obsługuje płatności BLIK, karty płatnicze (Visa, Mastercard), Apple Pay oraz Google Pay. Wszystkie transakcje są szyfrowane i zabezpieczone certyfikatem SSL.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">5. Warunki Pakietów i Voucherów</h2>
              <p>
                Pakiety usług (np. 3, 5, 10 sesji) oraz vouchery, o ile są oferowane, mają określony termin ważności, podany w opisie. Niewykorzystane sesje w terminie ważności pakietu przepadają. Pakiety i vouchery są imienne i nie mogą być przekazywane osobom trzecim, chyba że opis stanowi inaczej.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">6. Polityka Anulacji Wizyty</h2>
              <p>
                W przypadku usług umówionych (wizyty, sesje) — wizytę można bezpłatnie odwołać lub przenieść na inny termin, jeśli zostanie to zrobione najpóźniej na 24 godziny przed umówioną wizytą.
              </p>
              <p>
                W przypadku anulowania wizyty w terminie krótszym niż 24 godziny przed jej rozpoczęciem, pobierana jest opłata w wysokości 50% ceny usługi. W przypadku niepojawienia się na wizycie bez uprzedzenia, opłata wynosi 100% ceny usługi.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">7. Zwroty i Reklamacje</h2>
              <p>
                Klient ma prawo do odstąpienia od umowy zakupu towaru online w terminie 14 dni od daty zakupu bez podania przyczyny, na zasadach określonych w ustawie o prawach konsumenta. Reklamacje dotyczące jakości towarów lub świadczonych usług należy zgłaszać na adres e-mail bigdreamsbait2025@gmail.com (dane także w stopce serwisu). Każda reklamacja zostanie rozpatrzona indywidualnie w terminie 14 dni.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">8. Zakazane Treści</h2>
              <p>
                Serwis nie promuje i nie oferuje żadnych produktów ani usług z listy kategorii zabronionych przez PayU.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-lg text-slate-900 mt-6 mb-2">9. Postanowienia końcowe</h2>
              <p>
                Regulamin wchodzi w życie z dniem publikacji na stronie. Usługodawca zastrzega sobie prawo do zmiany regulaminu.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
