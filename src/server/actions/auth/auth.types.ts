import { z } from 'zod';

import {
  uuidSchema,
  stringSchema,
  booleanSchema,
  emailStringSchema,
  optionalStringSchema,
  dateStringSchema,
  optionalPhoneNumberStringSchema,
} from '@/utils/zod.utils';

export const userSchema = z.object({
  id: uuidSchema,
  user_name: stringSchema,
  user_email: emailStringSchema,
  is_email_verified: booleanSchema,
  created_at: stringSchema,
  updated_at: optionalStringSchema,
  date_of_birth: dateStringSchema,
  phone_number: optionalPhoneNumberStringSchema,
});

export const loginAndRegisterResponseSchema = z.object({
  user: userSchema,
  access_token: stringSchema,
  refresh_token: stringSchema,
});

export type LoginAndRegisterResponsePayload = z.infer<
  typeof loginAndRegisterResponseSchema
>;

export type UserType = z.infer<typeof userSchema>;
