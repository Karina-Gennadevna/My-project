'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QUESTIONS_BY_MODULE, SCALE_OPTIONS, MODULE_META } from '@/lib/questions'
import type { Module, Question } from '@/types'

const MODULES: Module[] = ['K', 'A', 'Q', 'S']

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function AssessmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const assessmentId = searchParams.get('id')

  const [currentStep, setCurrentStep] = useState(0) // 0-indexed: 0=K, 1=A, 2=Q, 3=S
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  const debouncedAnswers = useDebounce(answers, 1500)

  // Load existing progress
  useEffect(() => {
    if (!assessmentId) { router.push('/app'); return }

    fetch(`/api/assessment/${assessmentId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { router.push('/app'); return }
        if (data.status === 'completed') { router.push(`/app/results/${assessmentId}`); return }
        setAnswers(data.answers ?? {})
        setCurrentStep(Math.max(0, Math.min(3, (data.currentStep ?? 1) - 1)))
        setLoaded(true)
      })
      .catch(() => { setError('Ошибка загрузки диагностики') })
  }, [assessmentId, router])

  // Autosave — fires on answer change (debounced) AND on step change
  useEffect(() => {
    if (!loaded || !assessmentId) return
    setSaving(true)
    fetch(`/api/assessment/${assessmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: debouncedAnswers, currentStep: currentStep + 1 }),
    })
      .then((r) => { if (!r.ok) throw new Error('save failed') })
      .catch(() => setError('Ошибка автосохранения. Проверьте соединение.'))
      .finally(() => setSaving(false))
  }, [debouncedAnswers, currentStep, assessmentId, loaded])

  const setAnswer = useCallback((id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }, [])

  const currentModule = MODULES[currentStep]
  const questions = QUESTIONS_BY_MODULE[currentModule]
  const meta = MODULE_META[currentModule]

  const scoringQuestions = questions.filter((q) => q.scoring)
  const answeredInModule = questions.filter((q) => answers[q.id] !== undefined).length
  const isModuleComplete = scoringQuestions.every((q) => answers[q.id] !== undefined)

  async function handleNext() {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      await handleSubmit()
    }
  }

  async function handleSubmit() {
    if (!assessmentId) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/assessment/${assessmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, submit: true }),
      })
      if (!res.ok) throw new Error('Submit failed')
      router.push(`/app/results/${assessmentId}`)
    } catch {
      setError('Ошибка при сохранении результатов. Попробуйте ещё раз.')
      setSubmitting(false)
    }
  }

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <span className="text-text-muted text-sm font-mono animate-pulse">Загрузка...</span>
      </div>
    )
  }

  if (submitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-6 py-12">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-accent/20" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-accent animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-text-primary font-medium mb-1">Анализируем результаты</p>
          <p className="text-text-muted text-sm">AI готовит персональный отчёт — займёт 15–30 секунд</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-2xs text-text-muted tracking-widest uppercase mb-1">
            // Диагностика
          </p>
          <h1 className="text-xl font-semibold text-text-primary">
            {currentStep + 1}. {meta.label}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-2xs text-text-muted font-mono mb-0.5">
            {saving ? 'Сохраняется...' : 'Сохранено'}
          </p>
          <p className="text-2xs text-text-muted">
            Шаг {currentStep + 1} из 4
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-10">
        <div className="flex gap-1 mb-2">
          {MODULES.map((m, i) => (
            <button
              key={m}
              onClick={() => i < currentStep && setCurrentStep(i)}
              className={`h-1 flex-1 rounded-full transition-all ${
                i < currentStep ? 'cursor-pointer opacity-70 hover:opacity-100' : 'cursor-default'
              }`}
              style={{ backgroundColor: i <= currentStep ? '#1F5F5B' : '#2A2A2A' }}
              disabled={i > currentStep}
            />
          ))}
        </div>
        <div className="flex justify-between">
          {MODULES.map((m, i) => (
            <span
              key={m}
              className={`font-mono text-2xs transition-colors ${
                i === currentStep ? 'text-accent' : i < currentStep ? 'text-text-muted' : 'text-border-default'
              }`}
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-card px-4 py-3">
          {error}
        </div>
      )}

      {/* Questions */}
      <div className="flex flex-col gap-4 mb-10">
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} value={answers[q.id]} onChange={setAnswer} />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-border-subtle">
        <button
          onClick={() => { setCurrentStep((s) => Math.max(0, s - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          disabled={currentStep === 0}
          className="px-5 py-2.5 rounded-card text-sm text-text-secondary border border-border-subtle
            hover:border-border-default hover:text-text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Назад
        </button>

        <div className="text-center">
          <p className="text-xs text-text-muted">
            {scoringQuestions.filter((q) => answers[q.id] !== undefined).length} / {scoringQuestions.length} вопросов
          </p>
        </div>

        <button
          onClick={handleNext}
          disabled={!isModuleComplete || submitting}
          className="px-6 py-2.5 rounded-card text-sm font-medium bg-accent text-white
            hover:bg-accent-light transition-all active:scale-[0.98]
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Обработка...' : currentStep === 3 ? 'Завершить и получить отчёт' : 'Далее'}
        </button>
      </div>
    </div>
  )
}

// ─── Question Card ────────────────────────────────────────────────────────────

interface QuestionCardProps {
  question: Question
  value?: number
  onChange: (id: string, value: number) => void
}

function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className={`bg-bg-surface border rounded-card p-6 transition-colors ${
        value !== undefined ? 'border-accent/30' : 'border-border-subtle'
      }`}
    >
      {/* Criterion label */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1">
          <p className="font-mono text-2xs text-text-muted tracking-wider uppercase mb-2">
            {question.criterionLabel}
            {!question.scoring && (
              <span className="ml-2 text-border-default normal-case">• Риск-индикатор</span>
            )}
          </p>
          <p className="text-sm text-text-primary leading-relaxed">{question.text}</p>
        </div>
        {question.tooltip && (
          <div className="relative">
            <button
              onClick={() => setShowTooltip((v) => !v)}
              className="text-text-muted hover:text-text-secondary transition-colors text-xs mt-0.5 font-mono"
            >
              [?]
            </button>
            {showTooltip && (
              <div className="absolute right-0 top-6 z-10 w-64 bg-bg-elevated border border-border-default
                rounded-card p-3 text-xs text-text-secondary leading-relaxed shadow-card">
                {question.tooltip}
                <button
                  onClick={() => setShowTooltip(false)}
                  className="absolute top-2 right-2 text-text-muted hover:text-text-secondary"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scale (0-5) */}
      {question.type === 'scale' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SCALE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange(question.id, opt.value)}
              className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
                value === opt.value
                  ? 'border-accent bg-accent/10 text-text-primary'
                  : 'border-border-subtle bg-bg-base hover:border-border-default text-text-secondary'
              }`}
            >
              <span className="font-mono text-2xs text-accent block mb-0.5">{opt.value}</span>
              <span className="text-xs">{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Boolean / Choice */}
      {(question.type === 'boolean' || question.type === 'choice') && question.options && (
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange(question.id, opt.value)}
              className={`text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                value === opt.value
                  ? 'border-accent bg-accent/10 text-text-primary'
                  : 'border-border-subtle bg-bg-base hover:border-border-default text-text-secondary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
