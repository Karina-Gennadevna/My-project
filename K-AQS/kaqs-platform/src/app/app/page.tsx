import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import StartAssessmentButton from '@/components/dashboard/StartAssessmentButton'

const STEP_LABELS = ['', 'K — Knowledge', 'A — AI Design', 'Q — Quality', 'S — Scalability', 'Завершена']

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/auth')

  const assessments = await db.assessment.findMany({
    where: { userId: session.id },
    orderBy: { updatedAt: 'desc' },
    take: 5,
  })

  const draft = assessments.find((a) => a.status === 'draft')
  const completed = assessments.filter((a) => a.status === 'completed')

  const completedWithScores = completed.map((a) => ({
    ...a,
    parsedScores: a.scores ? JSON.parse(a.scores) as Record<string, unknown> : null,
  }))

  return (
    <div>
      {/* Page title */}
      <div className="mb-10">
        <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-2">// Личный кабинет</p>
        <h1 className="text-2xl font-semibold text-text-primary">Диагностика</h1>
      </div>

      {/* Status card */}
      <div className="bg-bg-surface border border-border-subtle rounded-card p-8 mb-6">
        {draft ? (
          <div>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">Статус</p>
                <p className="font-medium text-text-primary">В процессе</p>
                <p className="text-sm text-text-secondary mt-1">
                  Шаг {draft.currentStep} из 4 — {STEP_LABELS[draft.currentStep] || 'Не начата'}
                </p>
              </div>
              <span className="text-xs font-mono text-accent border border-accent/30 px-2.5 py-1 rounded">
                ЧЕРНОВИК
              </span>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className="h-1 flex-1 rounded-full transition-all"
                    style={{
                      backgroundColor: step <= draft.currentStep ? '#1F5F5B' : '#2A2A2A',
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {['K', 'A', 'Q', 'S'].map((m) => (
                  <span key={m} className="font-mono text-2xs text-text-muted">{m}</span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href={`/app/assessment?id=${draft.id}`}
                className="px-6 py-2.5 rounded-card text-sm font-medium bg-accent text-white hover:bg-accent-light transition-all"
              >
                Продолжить
              </Link>
              <StartAssessmentButton existingId={draft.id} restart>
                Начать заново
              </StartAssessmentButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs text-text-muted font-mono uppercase tracking-wider mb-1">Статус</p>
              <p className="font-medium text-text-primary mb-1">
                {completed.length > 0 ? 'Готова к новой диагностике' : 'Диагностика не начата'}
              </p>
              <p className="text-sm text-text-secondary">
                {completed.length > 0
                  ? 'Вы можете пройти диагностику повторно для отслеживания динамики.'
                  : 'Займёт 20–30 минут. Прогресс сохраняется автоматически.'}
              </p>
            </div>
            <StartAssessmentButton>
              Пройти диагностику
            </StartAssessmentButton>
          </div>
        )}
      </div>

      {/* Completed assessments */}
      {completedWithScores.length > 0 && (
        <div>
          <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-4">// История</p>
          <div className="flex flex-col gap-3">
            {completedWithScores.map((a) => {
              const total = (a.parsedScores?.total as number) ?? 0
              const level = (a.parsedScores?.maturityLabel as string) ?? '—'
              const date = new Date(a.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric', month: 'long', year: 'numeric',
              })
              return (
                <div
                  key={a.id}
                  className="bg-bg-surface border border-border-subtle rounded-card px-6 py-5
                    flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                    hover:border-border-default transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-text-muted mb-0.5">{date}</p>
                      <p className="text-sm font-medium text-text-primary">{level}</p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold text-text-primary font-mono">{total}</span>
                      <span className="text-sm text-text-muted">/120</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/app/results/${a.id}`}
                      className="text-xs text-text-secondary hover:text-text-primary transition-colors border border-border-subtle
                        hover:border-border-default px-4 py-2 rounded-card"
                    >
                      Результаты
                    </Link>
                    <Link
                      href={`/app/report/${a.id}`}
                      className="text-xs text-accent hover:text-accent-light transition-colors border border-accent/30
                        hover:border-accent/50 px-4 py-2 rounded-card"
                    >
                      Отчёт
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
