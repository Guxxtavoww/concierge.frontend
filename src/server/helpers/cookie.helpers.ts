'use server';

import { cookies } from 'next/headers';
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

import { getExpirationDateFromToken } from '@/utils/get-expiration-date-from-token.util';

import type { UserType } from '../actions/auth/auth.types';

const cookiesNames = ['access_token', 'user', 'refresh_token'] as const;

export type CookieNames = (typeof cookiesNames)[number];

export async function getCookie(cookieName: CookieNames) {
  const cookieFn = cookies();

  return cookieFn.get(cookieName)?.value;
}

export async function getMultipleCookies<T extends CookieNames>(
  cookieNames: T[]
): Promise<Record<T, string | undefined>> {
  const cookieFn = cookies();

  const cookiesArray = await Promise.all(
    cookieNames.map((cookieName) => [
      cookieName,
      cookieFn.get(cookieName)?.value,
    ])
  );

  return Object.fromEntries(cookiesArray);
}

export async function setCookie<T>(
  cookieName: CookieNames,
  value: T,
  expires?: number | Date,
  cookiesFunction?: ReadonlyRequestCookies
) {
  const cookieFn = cookiesFunction || cookies();

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

export async function setMultipleCookies(
  cookiesData: {
    cookieName: CookieNames;
    value: any;
    expires?: number | Date;
  }[]
) {
  const cookieFn = cookies();

  return Promise.all(
    cookiesData.map(({ cookieName, value, expires }) =>
      setCookie(cookieName, value, expires, cookieFn)
    )
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
