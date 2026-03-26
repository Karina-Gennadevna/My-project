import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, index, scores, answers } = data

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'No quiz data' }, { status: 400 })
    }

    const answersText = ['K', 'A', 'Q', 'S'].map(axis => {
      const axisAnswers = answers.filter((a: { axis: string }) => a.axis === axis)
      const axisName = axisAnswers[0]?.axisName || axis
      const lines = axisAnswers.map((a: { question: string; chosen: string; score: number; maxScore: number }) =>
        `  — ${a.question}\n    Ответ: «${a.chosen}» (${a.score} из ${a.maxScore})`
      ).join('\n')
      return `ОСЬ ${axis} — ${axisName} (итог: ${scores[axis]}%):\n${lines}`
    }).join('\n\n')

    const prompt = `Ты — продуктовый архитектор и эксперт по систематизации бизнеса.

Тебе переданы РЕАЛЬНЫЕ ответы владельца бизнеса на диагностику K-AQS™.
Составь Roadmap уровня дорогого консалтинга (50k+) — конкретный, жёсткий, с привязкой к деньгам.

СТИЛЬ — СТРОГО:
— короткие фразы, прямые формулировки
— без "рекомендуется", "возможно", "стоит", "улучшить", "оптимизировать"
— без воды и общих мест
— каждая проблема = деньги + последствие
— писать как для владельца, не как консультант

ДАННЫЕ ДИАГНОСТИКИ:
Владелец: ${name || 'не указано'}
Индекс управляемости: ${index}/100
Оси: K=${scores.K}% | A=${scores.A}% | Q=${scores.Q}% | S=${scores.S}%

${answersText}

---

ТРЕБОВАНИЯ К КАЖДОМУ БЛОКУ:

БЛОК status:
— label: бьющий статус, не нейтральный
  НЕ "бизнес работает, но теряет деньги"
  А "система не управляется — деньги утекают" или "вы теряете деньги из-за отсутствия контроля"
— summary: 3 вывода — каждый конкретный, связан с потерями или хаосом

БЛОК losses:
— одна конкретная сумма в месяц (не диапазон)
— одна конкретная сумма в год
— для малого бизнеса: 80 000–250 000 ₽/мес, среднего: 200 000–600 000 ₽/мес
— breakdown: 3-4 источника потерь
— каждый источник строго по логике:
  cause: что происходит (конкретно: часы, люди, конверсия)
  action: во что это выливается (конкретное следствие)
  amount: сколько денег (конкретная цифра в ₽)
— логика суммы должна быть понятна: "2 часа × 20 дней × ставка = X ₽"
— суммы breakdown должны складываться примерно в monthly

БЛОК problems:
— 3-5 проблем максимум
— только из реальных ответов
— каждая: что конкретно не работает → к чему это приводит (деньги / хаос / потери)
— формулировки жёсткие: "ломает систему", "гробит конверсию", а не "не идеально"

БЛОК root_cause:
— illusion: "Вы думаете, что проблема в X"
— reality: "На самом деле Y — и пока это не исправить, остальные действия не дадут результата"
— сделать сдвиг мышления, убрать мягкость, добавить конфликт

БЛОК priorities:
— critical: 2-3 действия — конкретные, не абстрактные
— important: 2-3 действия
— later: 2-3 доработки
— каждое действие — глагол + объект (не "улучшить", а "зафиксировать / закрыть / убрать")

БЛОК roadmap:
— 3 этапа по 3-4 действия
— в начале каждого этапа: что изменится после его выполнения (поле "result")
— каждое действие содержит:
  action: конкретное действие (не абстрактное)
  if_not: если не сделать → конкретное последствие (деньги / хаос / срыв), без мягкости

БЛОК first_step:
— один конкретный шаг, который можно сделать сегодня
— action: что именно сделать (не "проанализируйте", а конкретное действие)
— effect: что изменится сразу — быстрые конкретные изменения

---

Верни JSON строго в этом формате (без markdown, только JSON):
{
  "status": {
    "index": ${index},
    "label": "бьющий статус",
    "summary": ["вывод с деньгами/хаосом 1", "вывод 2", "вывод 3"]
  },
  "losses": {
    "monthly": "конкретная сумма ₽",
    "yearly": "конкретная сумма ₽",
    "breakdown": [
      {"cause": "что происходит конкретно", "action": "во что выливается", "amount": "X ₽"}
    ]
  },
  "problems": [
    {"problem": "конкретная проблема", "consequence": "жёсткое последствие"}
  ],
  "root_cause": {
    "illusion": "Вы думаете, что проблема в X",
    "reality": "На самом деле Y — и пока это не исправить, остальные действия не дадут результата"
  },
  "priorities": {
    "critical": ["глагол + объект 1", "глагол + объект 2"],
    "important": ["действие 1", "действие 2"],
    "later": ["доработка 1", "доработка 2"]
  },
  "roadmap": [
    {
      "phase": "Этап 1 · 0–30 дней",
      "goal": "цель одной строкой",
      "result": "что изменится после выполнения этапа",
      "actions": [
        {"action": "конкретное действие", "if_not": "конкретное последствие с деньгами или хаосом"}
      ]
    },
    {
      "phase": "Этап 2 · 30–60 дней",
      "goal": "цель",
      "result": "что изменится",
      "actions": [
        {"action": "конкретное действие", "if_not": "последствие"}
      ]
    },
    {
      "phase": "Этап 3 · 60–90 дней",
      "goal": "цель",
      "result": "что изменится",
      "actions": [
        {"action": "конкретное действие", "if_not": "последствие"}
      ]
    }
  ],
  "first_step": {
    "action": "конкретный шаг сегодня",
    "effect": "быстрые изменения после выполнения"
  }
}`

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 })
    }

    const roadmap = JSON.parse(jsonMatch[0])
    return NextResponse.json({ roadmap })

  } catch (err) {
    console.error('Roadmap API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
