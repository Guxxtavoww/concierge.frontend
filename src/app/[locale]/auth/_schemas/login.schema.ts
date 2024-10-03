import { z } from 'zod';

import { emailStringSchema, stringSchema } from '@/utils/zod.utils';

export const loginSchema = z.object({
  user_email: emailStringSchema,
  password: stringSchema,
});

export type LoginPayload = z.infer<typeof loginSchema>;
