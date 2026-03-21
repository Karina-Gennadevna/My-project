import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import type { ModuleScore, Risk, Module } from '@/types'

const MODULE_ORDER: Module[] = ['K', 'A', 'Q', 'S']
const RISK_COLORS: Record<string, string> = {
  P0: '#EF4444',
  P1: '#F59E0B',
  P2: '#6B7280',
}

interface ParsedScores {
  total: number
  maturityLabel: string
  maturityLevel: string
  executiveSummary: string
  modules: Record<Module, ModuleScore>
  moduleInterpretations: Record<Module, string>
  roadmap: {
    next14days: Array<{ priority: string; module: string; title: string; action: string }>
    next60days: Array<{ priority: string; module: string; title: string; action: string }>
    next6months: Array<{ priority: string; module: string; title: string; action: string }>
  }
  aiLayerRecommendations: string
}

export default async function ReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ print?: string }>
}) {
  const session = await getSession()
  if (!session) redirect('/auth')

  const { id } = await params
  const { print } = await searchParams
  const isPrint = print === '1'

  const assessment = await db.assessment.findFirst({
    where: { id, userId: session.id, status: 'completed' },
  })

  if (!assessment) notFound()

  const scores = JSON.parse(assessment.scores!) as ParsedScores
  const risks = JSON.parse(assessment.risks ?? '[]') as Risk[]
  const percentage = Math.round((scores.total / 120) * 100)

  const reportDate = new Date(assessment.updatedAt).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className={isPrint ? 'print-mode' : ''}>
      {/* Print trigger */}
      {isPrint && (
        <script
          dangerouslySetInnerHTML={{ __html: 'window.onload = () => window.print()' }}
        />
      )}

      {/* Actions bar */}
      {!isPrint && (
        <div className="flex items-center justify-between mb-8 no-print">
          <div>
            <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-1">// Архитектурный отчёт</p>
            <h1 className="text-xl font-semibold text-text-primary">K-A-Q-S™ Assessment Report</h1>
          </div>
          <div className="flex gap-3">
            <a
              href={`/api/report/${id}/pdf`}
              className="px-5 py-2.5 rounded-card text-sm font-medium bg-accent text-white hover:bg-accent-light transition-all"
            >
              Скачать PDF
            </a>
            <a
              href={`/app/results/${id}`}
              className="px-5 py-2.5 rounded-card text-sm border border-border-subtle text-text-secondary
                hover:text-text-primary hover:border-border-default transition-all"
            >
              ← Назад
            </a>
          </div>
        </div>
      )}

      {/* Report document */}
      <div className={`bg-bg-surface border border-border-subtle rounded-card overflow-hidden ${isPrint ? '' : 'shadow-card'}`}>
        {/* Report header */}
        <div className="border-b border-border-subtle p-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-xs text-accent tracking-widest uppercase mb-2">K-A-Q-S™ PLATFORM</p>
              <h2 className="text-2xl font-semibold text-text-primary mb-1">AI Systems Maturity Report</h2>
              <p className="text-text-muted text-sm">Архитектурная диагностика зрелости AI-систем</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-text-muted">{reportDate}</p>
              <p className="font-mono text-xs text-text-muted mt-1">ID: {id.slice(0, 8)}</p>
            </div>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <section className="p-8 border-b border-border-subtle">
          <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-4">01 / Executive Summary</p>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">{scores.executiveSummary}</p>

          <div className="flex items-center gap-8">
            <div>
              <p className="text-4xl font-semibold font-mono text-text-primary">{scores.total}</p>
              <p className="text-xs text-text-muted mt-1">из 120 баллов</p>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 border border-accent/40 rounded px-3 py-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="font-mono text-sm text-accent font-medium">{scores.maturityLabel}</span>
              </div>
              <p className="text-xs text-text-muted">{percentage}% от максимума</p>
            </div>
          </div>
        </section>

        {/* 2. Module breakdown */}
        <section className="p-8 border-b border-border-subtle">
          <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-6">02 / Разрез по блокам K/A/Q/S</p>
          <div className="flex flex-col gap-5">
            {MODULE_ORDER.map((mod) => {
              const m = scores.modules[mod]
              const pct = m.percentage
              return (
                <div key={mod}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-mono text-sm text-accent mr-3">{mod}</span>
                      <span className="text-sm text-text-primary">{m.label}</span>
                    </div>
                    <span className="font-mono text-sm text-text-primary">{m.score}/{m.maxScore}</span>
                  </div>
                  <div className="w-full bg-bg-base rounded-full overflow-hidden mb-2" style={{ height: '3px' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: pct >= 60 ? '#1F5F5B' : pct >= 40 ? '#D97706' : '#EF4444' }}
                    />
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{scores.moduleInterpretations[mod]}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. Risks */}
        {risks.length > 0 && (
          <section className="p-8 border-b border-border-subtle">
            <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-6">03 / Карта рисков</p>
            <div className="flex flex-col gap-3">
              {risks.map((risk) => (
                <div key={risk.id} className="flex items-start gap-4 py-4 border-b border-border-subtle last:border-0">
                  <span
                    className="font-mono text-2xs px-2 py-0.5 rounded mt-0.5 shrink-0"
                    style={{
                      color: RISK_COLORS[risk.level],
                      backgroundColor: `${RISK_COLORS[risk.level]}15`,
                      border: `1px solid ${RISK_COLORS[risk.level]}30`,
                    }}
                  >
                    {risk.level}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary mb-1">{risk.label}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{risk.description}</p>
                  </div>
                  <span className="font-mono text-2xs text-text-muted shrink-0">{risk.module}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Roadmap */}
        <section className="p-8 border-b border-border-subtle">
          <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-6">04 / Дорожная карта</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Next 14 days', subtitle: 'Первоочередные действия', items: scores.roadmap.next14days },
              { title: 'Next 60 days', subtitle: 'Системное укрепление', items: scores.roadmap.next60days },
              { title: 'Next 6 months', subtitle: 'Стратегический рост', items: scores.roadmap.next6months },
            ].map((col) => (
              <div key={col.title}>
                <p className="font-mono text-xs text-accent mb-0.5">{col.title}</p>
                <p className="text-xs text-text-muted mb-4 pb-3 border-b border-border-subtle">{col.subtitle}</p>
                <ul className="flex flex-col gap-4">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono text-2xs px-1.5 py-0.5 rounded shrink-0"
                          style={{
                            color: item.priority === 'P0' ? '#EF4444' : item.priority === 'P1' ? '#F59E0B' : '#6B7280',
                            backgroundColor: item.priority === 'P0' ? '#EF444415' : item.priority === 'P1' ? '#F59E0B15' : '#6B728015',
                            border: `1px solid ${item.priority === 'P0' ? '#EF444430' : item.priority === 'P1' ? '#F59E0B30' : '#6B728030'}`,
                          }}
                        >{item.priority}</span>
                        <span className="font-mono text-2xs text-accent">{item.module}</span>
                        <span className="text-xs font-medium text-text-primary">{item.title}</span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">{item.action}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 5. AI Layer Recommendations */}
        <section className="p-8 border-b border-border-subtle">
          <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-4">05 / AI-слой: рекомендации</p>
          <p className="text-sm text-text-secondary leading-relaxed">{scores.aiLayerRecommendations}</p>
        </section>

        {/* Footer */}
        <div className="p-8 flex items-center justify-between">
          <p className="font-mono text-xs text-text-muted">K-A-Q-S™ Platform · Karina AI Systems Architect</p>
          <p className="font-mono text-xs text-text-muted">{reportDate}</p>
        </div>
      </div>
    </div>
  )
}
