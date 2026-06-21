import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/context/ThemeProvider';
import { QueryProvider } from '@/components/QueryProvider/QueryProvider';
import { Navigation } from '@/components/Navigation/Navigation';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import '@/index.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Pokémon Search',
  description: 'Search and explore Pokémon',
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ru')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <QueryProvider>
              <div id="root">
                <Navigation />
                <ErrorBoundary>{children}</ErrorBoundary>
              </div>
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}