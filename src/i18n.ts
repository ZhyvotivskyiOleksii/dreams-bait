import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['uk', 'pl', 'en'] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  uk: 'Українська',
  pl: 'Polski',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  uk: '🇺🇦',
  pl: '🇵🇱',
  en: '🇬🇧',
};

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

