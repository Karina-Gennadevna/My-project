'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

type Mode = 'login' | 'register'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/app'

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Произошла ошибка')
        return
      }

      router.push(redirect)
      router.refresh()
    } catch {
      setError('Ошибка соединения. Проверьте интернет.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      {/* Header */}
      <header className="border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <Link href="/" className="font-mono text-sm text-accent tracking-widest uppercase hover:opacity-80 transition-opacity">
            K-A-Q-S™
          </Link>
        </div>
      </header>

      {/* Form */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-sm">
          {/* Tab switcher */}
          <div className="flex mb-8 border-b border-border-subtle">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`pb-3 px-1 mr-6 text-sm font-medium transition-colors border-b-2 -mb-px
                  ${mode === m
                    ? 'border-accent text-text-primary'
                    : 'border-transparent text-text-muted hover:text-text-secondary'
                  }`}
              >
                {m === 'login' ? 'Войти' : 'Создать аккаунт'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs text-text-muted mb-1.5 font-mono uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full bg-bg-surface border border-border-subtle rounded-card px-4 py-3
                  text-sm text-text-primary placeholder:text-text-muted
                  focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1.5 font-mono uppercase tracking-wider">
                Пароль
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder={mode === 'register' ? 'Не менее 8 символов' : '••••••••'}
                minLength={mode === 'register' ? 8 : 1}
                className="w-full bg-bg-surface border border-border-subtle rounded-card px-4 py-3
                  text-sm text-text-primary placeholder:text-text-muted
                  focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-card px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-card font-medium text-sm bg-accent text-white
                hover:bg-accent-light transition-all active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>
          </form>

          <p className="text-center text-xs text-text-muted mt-8 leading-relaxed">
            {mode === 'login'
              ? 'Ещё нет аккаунта? '
              : 'Уже есть аккаунт? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              className="text-text-secondary hover:text-text-primary transition-colors underline underline-offset-2"
            >
              {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}
