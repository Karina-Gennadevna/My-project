import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'K-AQS™ — Индекс управляемости бизнеса',
  description:
    'Архитектурная диагностика операционной устойчивости: процессы, ответственность, контроль, риски и готовность к автоматизации и AI. Для бизнеса от 5 человек.',
  keywords: [
    'управляемость бизнеса',
    'операционный аудит',
    'автоматизация бизнеса',
    'AI готовность',
    'операционный директор',
    'K-AQS',
  ],
  authors: [{ name: 'K-AQS™' }],
  openGraph: {
    title: 'K-AQS™ — Индекс управляемости бизнеса',
    description:
      'Архитектурная диагностика операционной устойчивости. Индекс + карта рисков + Roadmap 30/60/90.',
    type: 'website',
    locale: 'ru_RU',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
