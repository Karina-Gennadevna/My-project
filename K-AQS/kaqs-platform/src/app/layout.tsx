import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'K-A-Q-S™ Platform — AI Maturity Assessment',
  description: 'Диагностика зрелости AI-систем бизнеса по стандарту K-A-Q-S™. Устойчивость. Контроль. Архитектура.',
  keywords: ['AI maturity', 'AI assessment', 'K-AQS', 'AI architecture', 'business AI'],
  openGraph: {
    title: 'K-A-Q-S™ Platform',
    description: 'Диагностика зрелости AI-систем бизнеса. Устойчивость. Контроль. Архитектура.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
