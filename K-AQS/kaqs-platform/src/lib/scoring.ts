import type { Module, MaturityLevel, ModuleScore, Risk, AssessmentResult, Question } from '@/types'
import { QUESTIONS_BY_MODULE } from './questions'

// ─── Constants ────────────────────────────────────────────────────────────────

const MODULE_MAX_SCORE = 30   // 6 scoring questions × 5 points each
const TOTAL_MAX_SCORE = 120   // 4 modules × 30

export const MATURITY_LEVELS: Record<MaturityLevel, { label: string; range: [number, number]; description: string }> = {
  chaotic: {
    label: 'Хаотичная',
    range: [0, 30],
    description: 'AI-внедрение невозможно без предварительной архитектурной работы. Фундамент нестабилен.',
  },
  fragmented: {
    label: 'Фрагментарная',
    range: [31, 60],
    description: 'Есть отдельные элементы системы, но они не связаны. Высокий риск непредсказуемых сбоев.',
  },
  managed: {
    label: 'Управляемая',
    range: [61, 90],
    description: 'Основные процессы под контролем. AI можно масштабировать при условии закрытия архитектурных разрывов.',
  },
  systemic: {
    label: 'Системная',
    range: [91, 110],
    description: 'Зрелая операционная система. AI-слой работает предсказуемо. Готовность к масштабированию высокая.',
  },
  mature: {
    label: 'Архитектурно зрелая',
    range: [111, 120],
    description: 'Эталонный уровень. Архитектура AI-систем полностью управляема, документирована и масштабируема.',
  },
}

const MODULE_ORDER: Module[] = ['K', 'A', 'Q', 'S']
const MODULE_LABELS: Record<Module, string> = {
  K: 'Knowledge Architecture',
  A: 'AI System Design',
  Q: 'Quality & Risk Control',
  S: 'Scalability Framework',
}

// ─── Core scoring ─────────────────────────────────────────────────────────────

export function calculateModuleScore(
  module: Module,
  answers: Record<string, number>,
): ModuleScore {
  const questions = QUESTIONS_BY_MODULE[module]
  const scoringQuestions = questions.filter((q) => q.scoring)

  let score = 0
  for (const q of scoringQuestions) {
    const answer = answers[q.id] ?? 0
    score += Math.min(5, Math.max(0, answer))
  }

  const maxScore = scoringQuestions.length * 5

  return {
    module,
    label: MODULE_LABELS[module],
    score,
    maxScore,
    percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
  }
}

export function determineMaturityLevel(totalScore: number): MaturityLevel {
  for (const [level, meta] of Object.entries(MATURITY_LEVELS) as [MaturityLevel, typeof MATURITY_LEVELS[MaturityLevel]][]) {
    const [min, max] = meta.range
    if (totalScore >= min && totalScore <= max) return level
  }
  return 'chaotic'
}

export function collectRisks(
  answers: Record<string, number>,
  allQuestions: Question[],
): Risk[] {
  const risks: Risk[] = []

  for (const q of allQuestions) {
    if (!q.riskIndicator) continue

    const answer = answers[q.id] ?? 0
    const { threshold, level, label, description } = q.riskIndicator

    if (answer <= threshold) {
      risks.push({
        id: `risk_${q.id}`,
        level,
        module: q.module,
        label,
        description,
        questionId: q.id,
        score: answer,
      })
    }
  }

  // Sort: P0 first, then P1, then P2
  const order: Record<string, number> = { P0: 0, P1: 1, P2: 2 }
  return risks.sort((a, b) => order[a.level] - order[b.level])
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function calculateResult(
  answers: Record<string, number>,
): AssessmentResult {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ALL_QUESTIONS } = require('./questions') as typeof import('./questions')

  const modules: Record<Module, ModuleScore> = {} as Record<Module, ModuleScore>
  let totalScore = 0

  for (const mod of MODULE_ORDER) {
    const moduleScore = calculateModuleScore(mod, answers)
    modules[mod] = moduleScore
    totalScore += moduleScore.score
  }

  const maturityLevel = determineMaturityLevel(totalScore)
  const risks = collectRisks(answers, ALL_QUESTIONS)
  const p0Risks = risks.filter((r) => r.level === 'P0')

  return {
    totalScore,
    maturityLevel,
    maturityLabel: MATURITY_LEVELS[maturityLevel].label,
    modules,
    risks,
    p0Risks,
  }
}

// ─── Report text generation (template-based fallback) ────────────────────────

export function generateExecutiveSummary(result: AssessmentResult): string {
  const { totalScore, maturityLevel, maturityLabel, p0Risks, modules } = result
  const pct = Math.round((totalScore / TOTAL_MAX_SCORE) * 100)

  const weakModule = (Object.values(modules) as ModuleScore[]).reduce(
    (min, m) => (m.percentage < min.percentage ? m : min),
  )
  const strongModule = (Object.values(modules) as ModuleScore[]).reduce(
    (max, m) => (m.percentage > max.percentage ? m : max),
  )

  const p0Text = p0Risks.length > 0
    ? `Выявлено ${p0Risks.length} критических риска (P0), требующих немедленного внимания.`
    : 'Критические риски (P0) не выявлены.'

  return `Индекс зрелости AI-систем составил ${totalScore} из ${TOTAL_MAX_SCORE} (${pct}%). ` +
    `Уровень: «${maturityLabel}». ` +
    `Наиболее сильный блок — ${strongModule.label} (${strongModule.percentage}%). ` +
    `Наибольший дефицит — ${weakModule.label} (${weakModule.percentage}%). ` +
    `${p0Text} ` +
    `${MATURITY_LEVELS[maturityLevel].description}`
}

export function generateModuleInterpretation(
  module: Module,
  moduleScore: ModuleScore,
  risks: Risk[],
): string {
  const moduleRisks = risks.filter((r) => r.module === module)
  const { percentage } = moduleScore

  const levelText =
    percentage < 33 ? 'критический дефицит'
    : percentage < 60 ? 'существенные пробелы'
    : percentage < 80 ? 'управляемый уровень'
    : 'высокий уровень зрелости'

  const riskText = moduleRisks.length > 0
    ? ` Выявлено рисков: ${moduleRisks.map((r) => `${r.level} «${r.label}»`).join(', ')}.`
    : ' Явных рисков в данном блоке не выявлено.'

  return `Блок оценён на ${moduleScore.score}/${moduleScore.maxScore} (${percentage}%) — ${levelText}.${riskText}`
}

export function generateRoadmap(result: AssessmentResult) {
  const { maturityLevel, p0Risks, risks } = result
  const p1Risks = risks.filter((r) => r.level === 'P1')

  const next14days = p0Risks.length > 0
    ? p0Risks.slice(0, 3).map((r) => `Устранить: ${r.label} (${r.module}-блок)`)
    : ['Провести аудит документации процессов', 'Зафиксировать роли и ответственности', 'Инициировать карту зависимостей систем']

  const next60days = p1Risks.length > 0
    ? p1Risks.slice(0, 3).map((r) => `Закрыть: ${r.label}`)
    : [
        'Построить операционную карту AI-слоя',
        'Внедрить базовый мониторинг AI-процессов',
        'Провести первый архитектурный ревью',
      ]

  const next6months: string[] = maturityLevel === 'chaotic' || maturityLevel === 'fragmented'
    ? [
        'Заложить архитектурную базу: документация, роли, данные',
        'Разработать AI-стратегию с чёткими зонами применения',
        'Построить систему мониторинга и контроля качества',
      ]
    : [
        'Масштабировать AI-слой в новые зоны бизнеса',
        'Разработать план найма/развития AI-команды',
        'Внедрить метрики устойчивости и growth-дашборд',
      ]

  return { next14days, next60days, next6months }
}

export function generateAILayerRecommendations(result: AssessmentResult): string {
  const { totalScore, modules } = result
  const aScore = modules['A']

  if (totalScore < 40) {
    return 'На текущем уровне зрелости расширение AI преждевременно. Приоритет — архитектурная база: документация процессов, роли, источники данных. AI можно применять только в изолированных, хорошо понятных задачах с ручным контролем результата.'
  }
  if (totalScore < 70) {
    return `AI уместен в задачах с понятным входом и выходом: генерация текстов, классификация, простая автоматизация. Блок AI Design (${aScore.percentage}%) требует укрепления перед расширением AI на критические бизнес-процессы. Избегать: AI для принятия решений без человека в контуре управления.`
  }
  return `Уровень зрелости позволяет масштабировать AI на ключевые бизнес-процессы. Рекомендуется: AI для аналитики и прогнозирования, автоматизация операционных решений с контрольным уровнем, внедрение AI-агентов в хорошо задокументированные процессы.`
}
