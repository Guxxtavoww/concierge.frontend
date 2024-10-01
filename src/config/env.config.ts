import { z } from 'zod';
import { cache } from 'react';

import { urlStringSchema } from '@/utils/zod.utils';

export const envSchema = z
  .object({
    NEXT_PUBLIC_ENV: z.enum(['dev', 'prod']).default('dev'),
    NEXT_PUBLIC_API_BASE_URL: urlStringSchema,
  })
  .transform((data) => {
    const toReplace = data.NEXT_PUBLIC_ENV === 'dev' ? 'http://' : 'https://';

    return {
      ...data,
      NEXT_PUBLIC_WS_URL: `${data.NEXT_PUBLIC_API_BASE_URL.replace(
        toReplace,
        'ws://'
      )}/condominium-chat`,
    };
  });

export type EnvType = z.infer<typeof envSchema>;

export const parseEnv = cache(() => {
  const parseResult = envSchema.parse(process.env);

  return parseResult;
});

export const ENV_VARIABLES = parseEnv();
