'use client';

// import { useMemo } from 'react';
// import { io } from 'socket.io-client';

import { useTranslations } from '@/contexts/translations.context';
import { LanguageDropdown } from '@/components/tools/language-dropdown';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { ComboBoxField } from '@/components/tools/fields/combo-box-field';
import { Button } from '@/components/ui/button';

export function ClientComponent() {
  const { translation } = useTranslations();
  const form = useForm();

  // const socket = useMemo(
  //   () =>
  //     io('ws://localhost:5000/server/condominium-chat', {
  //       transports: ['websocket'],
  //       auth: {
  //         token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwZGY0ZjlkLTc4NmUtNGM2MS1hMzBhLTRiNDE4YjNhOWVkOCIsImlhdCI6MTcyNzcwNjkyOSwiZXhwIjoxNzI3NzI4NTI5LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAifQ.T5D-8wmAsPyhWQQm5Tday6dMRufGuozay6_zAyQmKls`,
  //       },
  //       withCredentials: true,
  //     }),
  //   []
  // );

  // socket.on('connect', () => {
  //   console.log(
  //     'Connected to WebSocket with JWT token in Authorization header'
  //   );
  // });

  // socket.on('disconnect', () => {
  //   console.log(
  //     'Disconected to WebSocket with JWT token in Authorization header'
  //   );
  // });

  return (
    <div className="mt-4 border rounded-sm p-3">
      <h3 className="text-destructive w-96">
        {translation('common_texts.client_component')}
      </h3>
      <LanguageDropdown />
      <Form {...form}>
        <form onSubmit={form.handleSubmit((e) => console.log(e))}>
          <ComboBoxField
            name="combo"
            labelAccessor="langName"
            valueAccessor="value"
            selectLabel="Selecione essa bosta"
            placeholder="Select"
            options={[
              { langName: 'English', value: 'en' },
              { langName: 'Spanish', value: 'es' },
              { langName: 'Mandarin Chinese', value: 'zh' },
              { langName: 'Hindi', value: 'hi' },
              { langName: 'Arabic', value: 'ar' },
              { langName: 'Bengali', value: 'bn' },
              { langName: 'Portuguese', value: 'pt' },
              { langName: 'Russian', value: 'ru' },
              { langName: 'Japanese', value: 'ja' },
              { langName: 'German', value: 'de' },
              { langName: 'French', value: 'fr' },
              { langName: 'Korean', value: 'ko' },
              { langName: 'Italian', value: 'it' },
              { langName: 'Turkish', value: 'tr' },
              { langName: 'Vietnamese', value: 'vi' },
              { langName: 'Polish', value: 'pl' },
              { langName: 'Dutch', value: 'nl' },
              { langName: 'Greek', value: 'el' },
              { langName: 'Swedish', value: 'sv' },
              { langName: 'Norwegian', value: 'no' },
              { langName: 'Danish', value: 'da' },
              { langName: 'Finnish', value: 'fi' },
              { langName: 'Hebrew', value: 'he' },
              { langName: 'Thai', value: 'th' },
              { langName: 'Indonesian', value: 'id' },
              { langName: 'Czech', value: 'cs' },
              { langName: 'Hungarian', value: 'hu' },
              { langName: 'Romanian', value: 'ro' },
              { langName: 'Ukrainian', value: 'uk' },
              { langName: 'Catalan', value: 'ca' },
            ]}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
