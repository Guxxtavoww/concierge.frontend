import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { Providers } from '@/providers';
import { parseEnv } from '@/config/env.config';
import { Toaster } from '@/components/ui/toaster';
import { i18nConfig } from '@/config/i18n.config';

import '../styles/global.styles.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Concierge',
  description: 'An App description',
  keywords: ['condomínio', 'prédios', 'festas', 'eventos'],
  authors: [
    {
      name: 'Gustavo',
      url: 'https://gustavo-augusto-portfolio.vercel.app/',
    },
  ],
};

export const viewport: Viewport = {
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export async function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: WithChildren<ServerComponentPageProps>) {
  parseEnv();

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
