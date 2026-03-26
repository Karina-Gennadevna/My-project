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

    // Format answers for the prompt
    const answersText = ['K', 'A', 'Q', 'S'].map(axis => {
      const axisAnswers = answers.filter((a: { axis: string }) => a.axis === axis)
      const axisName = axisAnswers[0]?.axisName || axis
      const lines = axisAnswers.map((a: { question: string; chosen: string; score: number; maxScore: number }) =>
        `  — ${a.question}\n    Ответ: «${a.chosen}» (${a.score} из ${a.maxScore})`
      ).join('\n')
      return `ОСЬ ${axis} — ${axisName} (итог: ${scores[axis]}%):\n${lines}`
    }).join('\n\n')

    const prompt = `Ты — продуктовый архитектор и эксперт по систематизации бизнеса.

Тебе переданы РЕАЛЬНЫЕ ответы владельца бизнеса на диагностику K-AQS™. Только на их основе составь Roadmap.

ВАЖНО:
— Используй ТОЛЬКО данные из ответов. Не придумывай проблемы, которых нет в ответах.
— Будь конкретным: называй реальные проблемы из ответов, не абстракции.
— Потери указывай в диапазонах (типичных для малого/среднего бизнеса с такими проблемами).
— Стиль: коротко, жёстко, без воды, без "рекомендуется" и "возможно".

ДАННЫЕ ДИАГНОСТИКИ:
Владелец: ${name || 'не указано'}
Индекс управляемости: ${index}/100
Оси: K=${scores.K}% | A=${scores.A}% | Q=${scores.Q}% | S=${scores.S}%

${answersText}

Верни JSON строго в этом формате (без markdown, только JSON):
{
  "status": {
    "index": ${index},
    "label": "краткий статус 2-3 слова",
    "summary": ["вывод 1", "вывод 2", "вывод 3"]
  },
  "losses": {
    "monthly": "диапазон потерь в месяц (например: 150 000 — 400 000 ₽)",
    "yearly": "диапазон потерь в год",
    "reasons": [
      {"cause": "конкретная причина из ответов", "effect": "конкретное последствие"}
    ]
  },
  "problems": [
    {"problem": "конкретная проблема", "consequence": "к чему приводит"}
  ],
  "root_cause": {
    "illusion": "Вам кажется, что проблема в X",
    "reality": "На самом деле проблема в Y"
  },
  "priorities": {
    "critical": ["приоритет 1", "приоритет 2"],
    "important": ["приоритет 1", "приоритет 2"],
    "later": ["доработка 1"]
  },
  "roadmap": [
    {
      "phase": "Этап 1 · 0–30 дней",
      "goal": "цель этапа одной строкой",
      "actions": ["конкретное действие 1", "конкретное действие 2", "конкретное действие 3"]
    },
    {
      "phase": "Этап 2 · 30–60 дней",
      "goal": "цель этапа",
      "actions": ["действие 1", "действие 2", "действие 3"]
    },
    {
      "phase": "Этап 3 · 60–90 дней",
      "goal": "цель этапа",
      "actions": ["действие 1", "действие 2", "действие 3"]
    }
  ],
  "first_step": {
    "action": "один конкретный первый шаг",
    "effect": "что это даст"
  }
}`

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    // Extract JSON from response
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
