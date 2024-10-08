'use server';

import { redirect } from 'next/navigation';

import {
  removeAllCookies,
  getMultipleCookies,
} from '@/server/helpers/cookie.helpers';
import { type UserType, userSchema } from '@/server/actions/auth/auth.types';

export async function session<
  ForceNoUndefined extends boolean = false
>(): Promise<{
  access_token: ForceNoUndefined extends false ? string | undefined : string;
  refresh_token: ForceNoUndefined extends false ? string | undefined : string;
  user: ForceNoUndefined extends false ? UserType | undefined : UserType;
}> {
  const { access_token, refresh_token, user } = await getMultipleCookies([
    'refresh_token',
    'access_token',
    'user',
  ]);

  const userResponse = user
    ? userSchema.safeParse(JSON.parse(user))
    : undefined;

  return {
    access_token,
    refresh_token,
    user: userResponse?.success ? userResponse.data : undefined,
  } as any;
}

export async function logOut() {
  await removeAllCookies();

  redirect('/auth/login');
}
