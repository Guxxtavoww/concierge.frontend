'use client';

import {
  QueryClient,
  MutationCache,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes/dist/types';
import { HydrationOverlay } from '@builder.io/react-hydration-overlay';

import { TooltipProvider } from '@/components/ui/tooltip';
import { TranslationProvider } from '@/contexts/translations.context';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      console.log(error);
    },
  }),
});

export function Providers({
  children,
  ...props
}: WithChildren<ThemeProviderProps>): JSX.Element {
  return (
    <HydrationOverlay>
      <QueryClientProvider client={queryClient}>
        <NextThemesProvider {...props}>
          <TranslationProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </TranslationProvider>
        </NextThemesProvider>
      </QueryClientProvider>
    </HydrationOverlay>
  );
}
