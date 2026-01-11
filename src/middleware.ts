import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

export default createMiddleware({
  locales,
  defaultLocale: 'uk',
  localePrefix: 'always',
});

export const config = {
  matcher: ['/', '/(uk|pl|en)/:path*'],
};

