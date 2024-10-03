import { z } from 'zod';

import {
  stringSchema,
  emailStringSchema,
  optionalDateStringSchema,
  optionalPhoneNumberStringSchema,
} from '@/utils/zod.utils';

export const registerSchema = z
  .object({
    user_name: stringSchema,
    user_email: emailStringSchema,
    password: stringSchema,
    confirmed_password: stringSchema,
    phone_number: optionalPhoneNumberStringSchema,
    date_of_birth: optionalDateStringSchema,
  })
  .refine((data) => data.password === data.confirmed_password, {
    message: 'Senhas não são coincidem',
  })
  .transform(({ confirmed_password, ...rest }) => rest);

export type RegisterPayload = z.infer<typeof registerSchema>;
