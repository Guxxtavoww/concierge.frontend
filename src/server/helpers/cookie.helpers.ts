'use server';

import { cookies } from 'next/headers';

import { getExpirationDateFromToken } from '@/utils/get-expiration-date-from-token.util';

import type { UserType } from '../actions/auth/auth.types';

const cookiesNames = ['access_token', 'user'] as const;

export type CookieNames = (typeof cookiesNames)[number];

export async function getCookie(cookieName: CookieNames) {
  const cookieFn = cookies();

  return cookieFn.get(cookieName)?.value;
}

export async function setCookie<T>(
  cookieName: CookieNames,
  value: T,
  expires?: number | Date
) {
  const cookieFn = cookies();

  return cookieFn.set(
    cookieName,
    typeof value === 'string' ? value : JSON.stringify(value),
    {
      httpOnly: true,
      secure: true,
      expires,
    }
  );
}

export async function setUserCookie(payload: UserType, accessToken?: string) {
  const cookiesFn = cookies();

  const access_token = accessToken || cookiesFn.get('access_token')?.value;

  if (!access_token) return;

  const expires = getExpirationDateFromToken(access_token);

  return cookiesFn.set('user', JSON.stringify(payload), {
    expires,
  });
}

export async function removeCookie(cookieName: CookieNames) {
  const cookieFn = cookies();

  return cookieFn.delete(cookieName);
}

export async function removeAllCookies() {
  const cookieFn = cookies();

  for (const cookie of cookiesNames) {
    cookieFn.delete(cookie);
  }
}
