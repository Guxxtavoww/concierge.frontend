'use client';

import { io } from 'socket.io-client';

import { useTranslations } from '@/contexts/translations.context';
import { LanguageDropdown } from '@/components/tools/language-dropdown';

export function ClientComponent() {
  const { translation } = useTranslations();

  const socket = io('http://localhost:5000/server/condominium-chat', {
    transports: ['websocket'],
    auth: {
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMxY2E5YzRkLTg1OWUtNGE1OC1hNWVhLTlkNTlmMGQxNGE1MiIsImlhdCI6MTcyNzUzNTgyNywiZXhwIjoxNzI3NTU3NDI3LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAifQ.e-XlDVN38sLxOcKaIGT7hTGiowiner1zyc3bqh1Srtg`,
    },
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log(
      'Connected to WebSocket with JWT token in Authorization header'
    );
  });

  socket.on('disconnect', () => {
    console.log(
      'Disconected to WebSocket with JWT token in Authorization header'
    );
  });

  return (
    <div className="mt-4 border rounded-sm p-3">
      <h3 className="text-destructive w-96">
        {translation('common_texts.client_component')}
      </h3>
      <LanguageDropdown />

      <span>{socket.active}</span>
    </div>
  );
}
