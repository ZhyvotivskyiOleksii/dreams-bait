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

