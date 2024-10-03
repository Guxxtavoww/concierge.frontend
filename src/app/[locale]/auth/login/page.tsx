'use client';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/tools/loader';
import { useTranslations } from '@/contexts/translations.context';
import { InputField } from '@/components/tools/fields/input-field';
import { useFormWithSchema } from '@/hooks/use-form-with-schema.hook';
import { useMutationWithToast } from '@/hooks/use-mutation-with-toast.hook';
import { loginOrRegister } from '@/server/actions/auth/login-or-register.action';

import { loginSchema, type LoginPayload } from '../_schemas/login.schema';

export default function LoginPage() {
  const { translation } = useTranslations();

  const { isPending, mutate, disabled } = useMutationWithToast({
    mutationKey: ['login'],
    mutationFn: (data: LoginPayload) => loginOrRegister(data),
  });

  const form = useFormWithSchema(loginSchema, {
    disabled,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="auth-form"
      >
        <h2>{translation('auth.login_page.title')}</h2>

        <InputField
          name="user_email"
          type="email"
          label={translation('auth.common.user_email_label')}
          placeholder={translation('auth.common.user_email_placeholder')}
        />
        <InputField
          name="password"
          type="password"
          label={translation('auth.common.password_label')}
          placeholder={translation('auth.common.password_placeholder')}
        />

        <Button type="submit" disabled={disabled}>
          {isPending ? (
            <Loader />
          ) : (
            translation('auth.login_page.submit_button_text')
          )}
        </Button>
      </form>
    </Form>
  );
}
