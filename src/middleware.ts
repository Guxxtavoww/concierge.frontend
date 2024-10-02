import { NextRequest, NextResponse } from 'next/server';

import { type Locale, i18nConfig } from './config/i18n.config';
import { getMatchingLocale } from './lib/i18n/functions/get-matching-locale.lib';

const routesToIgnore = ['/_next/', '/api/', '/favicon.ico', '/robots.txt'];

export default function middleware(request: NextRequest) {
  const nextUrlPathName = request.nextUrl.pathname;

  if (routesToIgnore.some((route) => nextUrlPathName.startsWith(route))) {
    return NextResponse.next();
  }

  // Loop through available locales in i18n config, set to true when
  // iterated locale is not found in current request url.
  const localeNotFound = i18nConfig.locales.every(
    (locale) =>
      !nextUrlPathName.startsWith(`/${locale}/`) &&
      nextUrlPathName !== `/${locale}`
  );

  // Locale not found in request url, redirect to matched locale url.
  if (localeNotFound) {
    const newLocale: Locale = getMatchingLocale(request);

    // Return new url redirect and redirect user to correct locale url.
    return NextResponse.redirect(
      new URL(`/${newLocale}/${nextUrlPathName}`, request.url)
    );
  }
}
