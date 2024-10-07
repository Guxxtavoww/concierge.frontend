'use server';

import { api } from '@/lib/api/api.lib';
import {
  getMultipleCookies,
  setMultipleCookies,
} from '@/server/helpers/cookie.helpers';
import { getExpirationDateFromToken } from '@/utils/get-expiration-date-from-token.util';

import type { RefreshActionResponse } from './auth.types';
import { revalidatePath } from 'next/cache';

export async function refresh(origin: string) {
  const { refresh_token: refresh_token_cookie, user } =
    await getMultipleCookies(['refresh_token', 'user']);

  if (!refresh_token_cookie) return;

  const {
    data: { access_token, refresh_token },
  } = await api.post<RefreshActionResponse>(
    `/auth/refresh/${refresh_token_cookie}`
  );

  const expires = getExpirationDateFromToken(refresh_token);

  await setMultipleCookies([
    {
      cookieName: 'access_token',
      value: access_token,
      expires,
    },
    {
      cookieName: 'refresh_token',
      value: refresh_token,
      expires,
    },
    {
      cookieName: 'user',
      value: user,
      expires,
    },
  ]);

  return revalidatePath(origin);
}
