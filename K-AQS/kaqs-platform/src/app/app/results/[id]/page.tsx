import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
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

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) redirect('/auth')

  const { id } = await params
  const assessment = await db.assessment.findFirst({
    where: { id, userId: session.id, status: 'completed' },
  })

  if (!assessment) notFound()

  const scores = JSON.parse(assessment.scores!) as ParsedScores
  const risks = JSON.parse(assessment.risks ?? '[]') as Risk[]
  const p0Risks = risks.filter((r) => r.level === 'P0')
  const percentage = Math.round((scores.total / 120) * 100)

  return (
    <div className="pb-16">
      {/* Page header */}
      <div className="mb-10">
        <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-2">// Результаты диагностики</p>
        <h1 className="text-2xl font-semibold text-text-primary">Индекс зрелости AI-систем</h1>
      </div>

      {/* Score hero */}
      <div className="bg-bg-surface border border-border-subtle rounded-card p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs text-text-muted font-mono uppercase tracking-wider mb-3">Общий индекс</p>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-5xl font-semibold font-mono text-text-primary">{scores.total}</span>
              <span className="text-lg text-text-muted">/120</span>
            </div>
            <div className="inline-flex items-center gap-2 border border-accent/30 rounded px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="font-mono text-xs text-accent">{scores.maturityLabel}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 w-full sm:w-48">
            <div className="w-full bg-bg-base rounded-full overflow-hidden" style={{ height: '4px' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${percentage}%`, backgroundColor: '#1F5F5B' }}
              />
            </div>
            <p className="text-xs text-text-muted">{percentage}% от максимума</p>
          </div>
        </div>
      </div>

      {/* Module breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {MODULE_ORDER.map((mod) => {
          const m = scores.modules[mod]
          const pct = m.percentage
          return (
            <div key={mod} className="bg-bg-surface border border-border-subtle rounded-card p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="font-mono text-xs text-accent mr-2">{mod}</span>
                  <span className="text-xs text-text-secondary">{m.label}</span>
                </div>
                <span className="font-mono text-sm text-text-primary">{m.score}/{m.maxScore}</span>
              </div>
              <div className="w-full bg-bg-base rounded-full overflow-hidden mb-2" style={{ height: '3px' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: pct >= 60 ? '#1F5F5B' : pct >= 40 ? '#D97706' : '#EF4444' }}
                />
              </div>
              <p className="text-xs text-text-muted leading-relaxed mt-3">
                {scores.moduleInterpretations[mod]}
              </p>
            </div>
          )
        })}
      </div>

      {/* Executive Summary */}
      <div className="bg-bg-surface border border-border-subtle rounded-card p-6 mb-6">
        <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-3">// Резюме</p>
        <p className="text-sm text-text-secondary leading-relaxed">{scores.executiveSummary}</p>
      </div>

      {/* Risks */}
      {risks.length > 0 && (
        <div className="mb-6">
          <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-4">// Карта рисков</p>
          <div className="flex flex-col gap-3">
            {risks.slice(0, 8).map((risk) => (
              <div
                key={risk.id}
                className="bg-bg-surface border border-border-subtle rounded-card px-5 py-4
                  flex items-start gap-4"
              >
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
                <div>
                  <p className="text-sm font-medium text-text-primary mb-1">{risk.label}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{risk.description}</p>
                </div>
                <span className="font-mono text-2xs text-text-muted ml-auto shrink-0">{risk.module}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Roadmap */}
      <div className="mb-6">
        <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-4">// Дорожная карта</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Следующие 14 дней', sub: 'Первоочередные действия', items: scores.roadmap.next14days },
            { title: 'Следующие 60 дней', sub: 'Системное укрепление', items: scores.roadmap.next60days },
            { title: '6 месяцев', sub: 'Стратегический рост', items: scores.roadmap.next6months },
          ].map((col) => (
            <div key={col.title} className="bg-bg-surface border border-border-subtle rounded-card p-5">
              <p className="text-xs font-medium text-text-primary mb-0.5">{col.title}</p>
              <p className="text-2xs text-text-muted mb-4 pb-3 border-b border-border-subtle">{col.sub}</p>
              <ul className="flex flex-col gap-3">
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
                    <p className="text-xs text-text-muted leading-relaxed pl-0.5">{item.action}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* AI Layer */}
      <div className="bg-bg-surface border border-border-subtle rounded-card p-6 mb-8">
        <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-3">// AI-слой: рекомендации</p>
        <p className="text-sm text-text-secondary leading-relaxed">{scores.aiLayerRecommendations}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/app/report/${id}`}
          className="px-6 py-3 rounded-card text-sm font-medium bg-accent text-white hover:bg-accent-light transition-all text-center"
        >
          Открыть полный отчёт
        </Link>
        <a
          href={`/api/report/${id}/pdf`}
          className="px-6 py-3 rounded-card text-sm font-medium border border-border-default
            text-text-secondary hover:text-text-primary hover:border-border-default transition-all text-center"
        >
          Скачать PDF
        </a>
        <Link
          href="/app"
          className="px-6 py-3 rounded-card text-sm text-text-muted hover:text-text-secondary transition-colors text-center"
        >
          В личный кабинет
        </Link>
      </div>
    </div>
  )
}
