'use server';

import { redirect } from 'next/navigation';

import { getCookie, removeCookie } from '@/server/helpers/cookie.helpers';
import { type UserType, userSchema } from '@/server/actions/auth/auth.types';

export async function session<
  ForceNoUndefined extends boolean = false
>(): Promise<{
  access_token: string | undefined;
  user: ForceNoUndefined extends false ? UserType | undefined : UserType;
}> {
  const [user, access_token] = await Promise.all([
    getCookie('user'),
    getCookie('access_token'),
  ]);

  const userResponse = user
    ? userSchema.safeParse(JSON.parse(user))
    : undefined;

  const baseAuthObject = { access_token };

  const result = userResponse?.success
    ? {
        ...baseAuthObject,
        user: userResponse.data,
      }
    : {
        ...baseAuthObject,
        user: undefined,
      };

  return result as any;
}

export async function logOut() {
  await Promise.all([removeCookie('user'), removeCookie('access_token')]);

  redirect('/auth/login');
}
