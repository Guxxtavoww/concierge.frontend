'use client';

import { ZodError } from 'zod';

import { Button } from '@/components/ui/button';
import { Loader } from '@/components/tools/loader';
import { useTranslations } from '@/contexts/translations.context';

export default function GlobalError({ error, reset }: ErrorPageProps) {
  const { isLoading, translation } = useTranslations();

  if (isLoading) {
    return (
      <div className="w-full min-h-svh grid place-items-center">
        <Loader />
      </div>
    );
  }

  return (
    <html>
      <body className="w-screen min-h-svh grid place-items-center">
        <div className="m-4">
          <h2>{translation('error_page_texts.title')}</h2>
          <pre>
            {error instanceof ZodError
              ? JSON.stringify(error.errors, null, 2)
              : error.message}
          </pre>
          <Button onClick={reset}>
            {translation('error_page_texts.reset_button_text')}
          </Button>
        </div>
      </body>
    </html>
  );
}
