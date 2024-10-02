'use server';

import { redirect } from 'next/navigation';

import { validateApiCall } from '@/utils/validate-api-call.util';
import { setMultipleCookies } from '@/server/helpers/cookie.helpers';
import { getExpirationDateFromToken } from '@/utils/get-expiration-date-from-token.util';

import { loginAndRegisterResponseSchema } from './auth.types';

export async function loginOrRegister(body: any, isRegister = false) {
  const { access_token, refresh_token, user } = await validateApiCall({
    endpoint: `/auth/${isRegister ? 'register' : 'login'}`,
    zodSchema: loginAndRegisterResponseSchema,
    body,
  });

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

  redirect('/');
}
