import { NextRequest, NextResponse } from 'next/server';

import { session } from './lib/session/session.lib';
import { type Locale, i18nConfig } from './config/i18n.config';
import { getMatchingLocale } from './lib/i18n/functions/get-matching-locale.lib';

const protectedRoutes = ['/'] as const; // Rotas protegidas sem prefixo de locale
const routesToIgnore = ['/_next/', '/api/', '/favicon.ico', '/robots.txt'];

export default async function middleware(request: NextRequest) {
  const nextUrlPathName = request.nextUrl.pathname;

  if (routesToIgnore.some((route) => nextUrlPathName.startsWith(route))) {
    return NextResponse.next();
  }

  // Checar se o locale está ausente na URL
  const localeNotFound = i18nConfig.locales.every(
    (locale) =>
      !nextUrlPathName.startsWith(`/${locale}/`) &&
      nextUrlPathName !== `/${locale}`
  );

  // Se o locale não estiver na URL, redireciona para a URL com o locale correto
  if (localeNotFound) {
    const newLocale = getMatchingLocale(request);

    return NextResponse.redirect(
      new URL(`/${newLocale}${nextUrlPathName}`, request.url)
    );
  } else {
    const currentLocale = nextUrlPathName.split('/')[1] as Locale;

    const pathnameWithoutLocale =
      nextUrlPathName.replace(`/${currentLocale}`, '') || protectedRoutes[0];

    // Agora que o locale está garantido na URL, verifique se a rota é protegida
    const isProtectedRoute = protectedRoutes.some(
      (protectedRoute) =>
        pathnameWithoutLocale === protectedRoute ||
        pathnameWithoutLocale === `${protectedRoute}/`
    );

    // Se for uma rota protegida, verificar a sessão
    if (isProtectedRoute) {
      const { access_token, user } = await session();

      // Se não houver sessão, redirecionar para a página de login com o locale correto
      if (!access_token || !user) {
        return NextResponse.redirect(
          new URL(`/${currentLocale}/auth/login`, request.url)
        );
      }
    }
  }

  // Prosseguir com a próxima etapa
  return NextResponse.next();
}
