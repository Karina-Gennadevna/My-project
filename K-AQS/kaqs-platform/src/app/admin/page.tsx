import { requireAdmin } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/app')
  }

  const [users, assessments] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, role: true, createdAt: true, _count: { select: { assessments: true } } },
    }),
    db.assessment.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        status: true,
        currentStep: true,
        maturityLevel: true,
        scores: true,
        createdAt: true,
        updatedAt: true,
        user: { select: { email: true } },
      },
    }),
  ])

  const completedCount = assessments.filter((a) => a.status === 'completed').length

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <header className="border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/app" className="font-mono text-sm text-accent tracking-widest">K-A-Q-S™</Link>
            <span className="text-border-default">|</span>
            <span className="text-xs text-text-muted font-mono">ADMIN</span>
          </div>
          <Link href="/app" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
            ← Кабинет
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="mb-10">
          <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-4">// Статистика</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Пользователей', value: users.length },
              { label: 'Диагностик', value: assessments.length },
              { label: 'Завершено', value: completedCount },
              { label: 'В процессе', value: assessments.length - completedCount },
            ].map((s) => (
              <div key={s.label} className="bg-bg-surface border border-border-subtle rounded-card p-5">
                <p className="text-2xl font-semibold font-mono text-text-primary">{s.value}</p>
                <p className="text-xs text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Users */}
        <div className="mb-10">
          <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-4">// Пользователи</p>
          <div className="bg-bg-surface border border-border-subtle rounded-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left px-5 py-3 text-xs text-text-muted font-mono uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 text-xs text-text-muted font-mono uppercase tracking-wider hidden sm:table-cell">Роль</th>
                  <th className="text-left px-5 py-3 text-xs text-text-muted font-mono uppercase tracking-wider hidden md:table-cell">Диагностик</th>
                  <th className="text-left px-5 py-3 text-xs text-text-muted font-mono uppercase tracking-wider hidden lg:table-cell">Дата</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-elevated transition-colors">
                    <td className="px-5 py-3 text-text-secondary">{u.email}</td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className={`font-mono text-2xs px-2 py-0.5 rounded ${u.role === 'admin' ? 'text-accent border border-accent/30' : 'text-text-muted border border-border-subtle'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-text-muted font-mono text-xs hidden md:table-cell">{u._count.assessments}</td>
                    <td className="px-5 py-3 text-text-muted text-xs hidden lg:table-cell">
                      {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assessments */}
        <div>
          <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-4">// Диагностики</p>
          <div className="bg-bg-surface border border-border-subtle rounded-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left px-5 py-3 text-xs text-text-muted font-mono uppercase tracking-wider">Пользователь</th>
                  <th className="text-left px-5 py-3 text-xs text-text-muted font-mono uppercase tracking-wider hidden sm:table-cell">Статус</th>
                  <th className="text-left px-5 py-3 text-xs text-text-muted font-mono uppercase tracking-wider hidden md:table-cell">Уровень</th>
                  <th className="text-left px-5 py-3 text-xs text-text-muted font-mono uppercase tracking-wider hidden lg:table-cell">Обновлено</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {assessments.map((a) => {
                  const scores = a.scores ? JSON.parse(a.scores) as { total: number } : null
                  return (
                    <tr key={a.id} className="border-b border-border-subtle last:border-0 hover:bg-bg-elevated transition-colors">
                      <td className="px-5 py-3 text-text-secondary text-xs">{a.user.email}</td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <span className={`font-mono text-2xs px-2 py-0.5 rounded ${a.status === 'completed' ? 'text-accent border border-accent/30' : 'text-text-muted border border-border-subtle'}`}>
                          {a.status === 'completed' ? 'done' : 'draft'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-text-muted text-xs hidden md:table-cell">
                        {scores ? `${scores.total}/120` : '—'}
                        {a.maturityLevel && <span className="ml-2 text-text-muted">· {a.maturityLevel}</span>}
                      </td>
                      <td className="px-5 py-3 text-text-muted text-xs hidden lg:table-cell">
                        {new Date(a.updatedAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {a.status === 'completed' && (
                          <Link
                            href={`/app/report/${a.id}`}
                            className="text-xs text-accent hover:text-accent-light transition-colors"
                          >
                            Отчёт →
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
