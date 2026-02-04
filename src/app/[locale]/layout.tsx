import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n";

import ClientProviders from "@/components/ClientProviders";
import LayoutShell from "@/components/LayoutShell";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = (
    await import(`@/messages/${locale}.json`)
  ).default;

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Europe/Kyiv"
    >
      <ClientProviders>
        <LayoutShell>{children}</LayoutShell>
      </ClientProviders>
    </NextIntlClientProvider>
  );
}
