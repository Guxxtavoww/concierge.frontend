import { NextRequest, NextResponse } from 'next/server';

import { session } from './lib/session/session.lib';
import { type Locale, locales } from './config/i18n.config';
import { getMatchingLocale } from './lib/i18n/functions/get-matching-locale.lib';

// Define protected routes as patterns
// const protectedRoutePatterns = [
//   /^\/$/, // Root route
//   /^\/dashboard\/.+$/, // Dynamic routes like `/dashboard/[id]`
// ];

const protectedRoutes = new Set(['/']); // Rotas protegidas sem prefixo de locale
const routesToIgnore = new Set([
  '/_next/',
  '/api/',
  '/favicon.ico',
  '/robots.txt',
]);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorar rotas definidas
  if ([...routesToIgnore].some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const pathnameSegments = pathname.split('/');
  const currentLocale = pathnameSegments[1] as Locale;

  // Checar se o locale está ausente na URL
  if (!locales.includes(currentLocale)) {
    const newLocale = getMatchingLocale(request);

    return NextResponse.redirect(
      new URL(`/${newLocale}${pathname}`, request.url)
    );
  }

  const pathnameWithoutLocale =
    pathname.replace(`/${currentLocale}`, '') || '/';

  // Verificar se a rota é protegida
  if (protectedRoutes.has(pathnameWithoutLocale)) {
    const { access_token, user, refresh_token } = await session();

    if (!access_token || !user || !refresh_token) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/auth/login`, request.url)
      );
    }
  }

  return NextResponse.next();
}
