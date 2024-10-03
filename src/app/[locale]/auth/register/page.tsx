'use client';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { phoneMask } from '@/utils/masks.utils';
import { Loader } from '@/components/tools/loader';
import { useTranslations } from '@/contexts/translations.context';
import { InputField } from '@/components/tools/fields/input-field';
import { useFormWithSchema } from '@/hooks/use-form-with-schema.hook';
import { useMutationWithToast } from '@/hooks/use-mutation-with-toast.hook';
import { loginOrRegister } from '@/server/actions/auth/login-or-register.action';
import { InputFieldWithMask } from '@/components/tools/fields/input-field-with-mask';

import {
  registerSchema,
  type RegisterPayload,
} from '../_schemas/register.schema';
import { DateInputField } from '@/components/tools/fields/date-input-field';

export default function RegisterPage() {
  const { translation } = useTranslations();

  const { isPending, mutate, disabled } = useMutationWithToast({
    mutationKey: ['register'],
    mutationFn: (data: RegisterPayload) => loginOrRegister(data, true),
  });

  const form = useFormWithSchema(registerSchema, {
    disabled,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="auth-form"
      >
        <h2>{translation('auth.register_page.title')}</h2>

        <InputField
          name="user_name"
          type="text"
          label={translation('auth.register_page.user_name_label')}
          placeholder={translation('auth.register_page.user_name_placeholder')}
        />
        <InputField
          name="user_email"
          type="email"
          label={translation('auth.common.user_email_label')}
          placeholder={translation('auth.common.user_email_placeholder')}
        />
        <InputFieldWithMask
          name="phone_number"
          maskFn={phoneMask}
          label={translation('auth.register_page.phone_number_label')}
          placeholder={translation(
            'auth.register_page.phone_number_placeholder'
          )}
        />
        <DateInputField
          name="date_of_birth"
          label={translation('auth.register_page.date_of_birth_label')}
        />
        <InputField
          name="password"
          type="password"
          label={translation('auth.common.password_label')}
          placeholder={translation('auth.common.password_placeholder')}
        />
        <InputField
          name="confirmed_password"
          type="password"
          label={translation('auth.register_page.confirm_password_label')}
          placeholder={translation(
            'auth.register_page.confirm_password_placeholder'
          )}
        />

        <Button type="submit" disabled={disabled}>
          {isPending ? (
            <Loader />
          ) : (
            translation('auth.register_page.submit_button_text')
          )}
        </Button>
      </form>
    </Form>
  );
}
