import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'K-A-Q-S™ — Платформа управляемости бизнеса',
  description:
    'Диагностика управляемости компании по четырём осям: знания, автоматизация, качество, масштаб.',
  openGraph: {
    title: 'K-A-Q-S™ — Платформа управляемости бизнеса',
    description: 'Диагностика, архитектурная сессия и постоянный контроль управляемости.',
    type: 'website',
    locale: 'ru_RU',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
