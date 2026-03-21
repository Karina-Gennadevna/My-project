import Anthropic from '@anthropic-ai/sdk'
import type { AssessmentResult, Module, Risk } from '@/types'
import { ALL_QUESTIONS } from './questions'
import {
  generateExecutiveSummary,
  generateModuleInterpretation,
  generateRoadmap,
  generateAILayerRecommendations,
  MATURITY_LEVELS,
} from './scoring'

const MODULE_LABELS: Record<Module, string> = {
  K: 'Knowledge Architecture — управление знаниями и документацией',
  A: 'AI System Design — архитектура AI-систем',
  Q: 'Quality & Risk Control — качество и контроль рисков',
  S: 'Scalability Framework — масштабируемость',
}

const SCALE_LABELS: Record<number, string> = {
  0: 'Нет совсем',
  1: 'Есть кое-что, но без системы',
  2: 'Есть, но большие пробелы',
  3: 'В основном работает',
  4: 'Работает системно',
  5: 'Отлично — задокументировано и развивается',
}

function buildPrompt(
  result: AssessmentResult,
  answers: Record<string, number>,
): string {
  const { totalScore, maturityLevel, maturityLabel, modules, risks } = result
  const maturityDesc = MATURITY_LEVELS[maturityLevel].description

  // Build per-module Q&A blocks
  const moduleBlocks = (['K', 'A', 'Q', 'S'] as Module[]).map((mod) => {
    const mScore = modules[mod]
    const qs = ALL_QUESTIONS.filter((q) => q.module === mod)
    const qaLines = qs
      .map((q) => {
        const val = answers[q.id] ?? 'не отвечено'
        const label = typeof val === 'number' ? ` — ${SCALE_LABELS[val] ?? val}` : ''
        return `  [${q.id}] ${q.criterionLabel}: «${q.text}»\n  Ответ: ${val}${label}`
      })
      .join('\n\n')

    const modRisks = risks.filter((r) => r.module === mod)
    const riskLines = modRisks.length > 0
      ? modRisks.map((r) => `  ${r.level} — ${r.label}: ${r.description}`).join('\n')
      : '  Явных рисков нет'

    return `=== Блок ${mod}: ${MODULE_LABELS[mod]} ===
Оценка: ${mScore.score}/${mScore.maxScore} (${mScore.percentage}%)

Вопросы и ответы:
${qaLines}

Выявленные риски:
${riskLines}`
  }).join('\n\n')

  const p0List = risks.filter((r) => r.level === 'P0')
    .map((r) => `- ${r.module}: ${r.label}`)
    .join('\n') || '- Критических рисков не выявлено'

  return `Ты — старший архитектор по внедрению AI в бизнес-системы. Тебе переданы результаты диагностики готовности компании к AI.

ИТОГОВЫЙ ИНДЕКС ЗРЕЛОСТИ: ${totalScore}/120 (${Math.round((totalScore / 120) * 100)}%)
УРОВЕНЬ: «${maturityLabel}» — ${maturityDesc}

КРИТИЧЕСКИЕ РИСКИ P0:
${p0List}

${moduleBlocks}

---

На основе этих данных напиши персонализированный отчёт для руководителя компании. Ответ СТРОГО в формате JSON (без markdown-обёртки, без \`\`\`json, только чистый JSON):

{
  "executiveSummary": "...",
  "moduleInterpretations": {
    "K": "...",
    "A": "...",
    "Q": "...",
    "S": "..."
  },
  "roadmap": {
    "next14days": [
      { "priority": "P0", "module": "K", "title": "...", "action": "..." }
    ],
    "next60days": [
      { "priority": "P1", "module": "A", "title": "...", "action": "..." }
    ],
    "next6months": [
      { "priority": "P2", "module": "S", "title": "...", "action": "..." }
    ]
  },
  "aiLayerRecommendations": "..."
}

Требования к каждому полю:

executiveSummary: 3–5 предложений. Конкретная оценка состояния, самое сильное место, самая острая проблема, главный вывод. Без общих слов.

moduleInterpretations: для каждого блока (K/A/Q/S) 2–3 предложения — что именно слабо или сильно, конкретный пример последствий, почему это блокирует рост.

roadmap: пошаговый план улучшения просевших показателей с приоритетами.
- priority: P0 = критично, делать немедленно (только для реальных P0-рисков); P1 = важно, запланировать; P2 = желательно
- module: блок K/A/Q/S к которому относится задача
- title: короткое название задачи (3–6 слов)
- action: конкретное что делать — не абстракция, а реальный шаг. Например: "Провести 2-часовую сессию с командой, зафиксировать зоны ответственности каждого в Google Sheets" или "Выбрать одну точку данных и настроить автоматическую выгрузку в BI-систему"
- next14days: 3–5 задач. Только P0 и P1. Фокус на самых просевших блоках
- next60days: 4–6 задач. P1 и P2. Системное укрепление слабых мест
- next6months: 3–5 задач. Стратегический рост и масштабирование сильных сторон
- Задачи должны быть напрямую связаны с конкретными низкими ответами из диагностики

aiLayerRecommendations: 3–5 предложений — где AI применять прямо сейчас, что нельзя автоматизировать без предварительной работы и почему, что построить в первую очередь.

Язык: русский, деловой но живой. Без канцелярита. Говори прямо.`
}

import type { RoadmapItem } from '@/types'

export interface AIReportOutput {
  executiveSummary: string
  moduleInterpretations: Record<Module, string>
  roadmap: {
    next14days: RoadmapItem[]
    next60days: RoadmapItem[]
    next6months: RoadmapItem[]
  }
  aiLayerRecommendations: string
}

function templateFallback(result: AssessmentResult): AIReportOutput {
  const moduleInterpretations = {} as Record<Module, string>
  for (const mod of ['K', 'A', 'Q', 'S'] as Module[]) {
    moduleInterpretations[mod] = generateModuleInterpretation(mod, result.modules[mod], result.risks)
  }
  return {
    executiveSummary: generateExecutiveSummary(result),
    moduleInterpretations,
    roadmap: generateRoadmap(result),
    aiLayerRecommendations: generateAILayerRecommendations(result),
  }
}

export async function generateAIReport(
  result: AssessmentResult,
  answers: Record<string, number>,
): Promise<AIReportOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn('[ai-report] ANTHROPIC_API_KEY not set — using template fallback')
    return templateFallback(result)
  }

  try {
    const client = new Anthropic({ apiKey })
    const prompt = buildPrompt(result, answers)

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    })

    const rawText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('')

    const parsed = JSON.parse(rawText) as AIReportOutput

    // Validate required fields
    if (
      !parsed.executiveSummary ||
      !parsed.moduleInterpretations ||
      !parsed.roadmap ||
      !parsed.aiLayerRecommendations
    ) {
      throw new Error('Invalid AI response structure')
    }

    return parsed
  } catch (error) {
    console.error('[ai-report] AI generation failed, using template fallback:', error)
    return templateFallback(result)
  }
}
