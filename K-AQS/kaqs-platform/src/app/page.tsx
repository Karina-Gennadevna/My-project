import Link from 'next/link'

const MODULES = [
  {
    letter: 'K',
    name: 'Knowledge Architecture',
    desc: 'Процессы, роли, данные, зависимости. Архитектура знаний как фундамент для AI.',
  },
  {
    letter: 'A',
    name: 'AI System Design',
    desc: 'Как встроен AI-слой в систему. Целостность интеграций. Контроль и управление.',
  },
  {
    letter: 'Q',
    name: 'Quality & Risk Control',
    desc: 'Устойчивость, тестирование, безопасность, управление рисками и инцидентами.',
  },
  {
    letter: 'S',
    name: 'Scalability Framework',
    desc: 'Готовность к росту, модульность, план масштабирования и метрики устойчивости.',
  },
]

const DELIVERABLES = [
  { label: 'Индекс зрелости', desc: 'Общий Score 0–120 и 4 отдельных индекса по блокам K/A/Q/S.' },
  { label: 'Карта рисков', desc: 'Приоритизированные риски P0/P1/P2 с описанием и привязкой к блоку.' },
  { label: 'Дорожная карта', desc: 'Конкретные шаги: что делать за 14 дней, 60 дней и 6 месяцев.' },
  { label: 'Архитектурный отчёт', desc: 'Полный структурированный отчёт для скачивания в PDF.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm text-accent tracking-widest uppercase">K-A-Q-S™</span>
            <span className="text-border-default">|</span>
            <span className="text-text-secondary text-sm">Platform</span>
          </div>
          <Link
            href="/auth"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Войти
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-base pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 py-28 relative">
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="font-mono text-2xs text-text-muted tracking-widest uppercase">
              AI Maturity Assessment Framework
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 text-text-primary">
            Устойчивость.<br />
            Контроль.<br />
            <span style={{ color: '#2A7A75' }}>Архитектура.</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl leading-relaxed mb-4">
            Диагностика зрелости AI-систем бизнеса по стандарту K-A-Q-S™.
          </p>
          <p className="text-text-muted text-base max-w-xl leading-relaxed mb-12">
            Структурированная оценка по 4 блокам: Knowledge, AI Design, Quality, Scalability.
            На выходе — индекс зрелости, карта рисков и приоритетная дорожная карта.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-card font-medium text-sm transition-all
                bg-accent text-white hover:bg-accent-light active:scale-[0.98]"
            >
              Пройти диагностику
            </Link>
            <a
              href="#methodology"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-card font-medium text-sm transition-colors
                border border-border-default text-text-secondary hover:text-text-primary hover:border-border-default"
            >
              Как это работает
            </a>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section id="methodology" className="max-w-5xl mx-auto px-6 py-24">
        <div className="mb-12">
          <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-3">// Методология</p>
          <h2 className="text-2xl font-semibold text-text-primary">4 блока диагностики</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-subtle rounded-card overflow-hidden">
          {MODULES.map((m) => (
            <div key={m.letter} className="bg-bg-surface p-8 hover:bg-bg-elevated transition-colors">
              <div className="flex items-start gap-5">
                <span className="font-mono text-2xl font-semibold text-accent opacity-80 min-w-[1.5rem] leading-none mt-0.5">
                  {m.letter}
                </span>
                <div>
                  <p className="font-medium text-text-primary mb-2">{m.name}</p>
                  <p className="text-text-secondary text-sm leading-relaxed">{m.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Deliverables */}
      <section className="border-t border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="mb-12">
            <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-3">// Что вы получите</p>
            <h2 className="text-2xl font-semibold text-text-primary">Результат диагностики</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DELIVERABLES.map((d) => (
              <div
                key={d.label}
                className="bg-bg-surface border border-border-subtle rounded-card p-6
                  hover:border-border-default transition-colors"
              >
                <div className="w-6 h-px bg-accent mb-4" />
                <p className="font-medium text-text-primary text-sm mb-2">{d.label}</p>
                <p className="text-text-secondary text-xs leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-text-muted text-sm font-mono tracking-widest uppercase mb-4">
            // Начать диагностику
          </p>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Займёт 20–30 минут.
          </h2>
          <p className="text-text-secondary text-base mb-10 max-w-lg mx-auto">
            Ответьте на вопросы по 4 блокам — получите структурированный отчёт о зрелости AI-систем вашего бизнеса.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center px-10 py-4 rounded-card font-medium text-sm
              bg-accent text-white hover:bg-accent-light transition-all active:scale-[0.98]"
          >
            Пройти диагностику
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs text-text-muted">K-A-Q-S™ Platform</span>
          <div className="flex items-center gap-6 text-xs text-text-muted">
            <span>© 2025 Karina AI Systems Architect</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
