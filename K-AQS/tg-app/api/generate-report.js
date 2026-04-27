module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API not configured' });

  const { index, zones } = req.body || {};
  if (!zones || typeof index !== 'number') return res.status(400).json({ error: 'Missing data' });

  const zoneLines = [
    `Финансы: ${zones.finance}/100`,
    `Маркетинг: ${zones.marketing}/100`,
    `Команда: ${zones.team}/100`,
    `Операционные процессы: ${zones.ops}/100`,
    `Контроль собственника: ${zones.control}/100`,
  ].join(', ');

  const prompt = `Ты эксперт по системам управления малым и средним бизнесом. Проанализируй результаты диагностики и составь персональный план развития.

Индекс управляемости: ${index}/100
Результаты по зонам: ${zoneLines}
Шкала: 0–39 критично, 40–59 нестабильно, 60–74 средне, 75–89 хорошо, 90–100 системно.

Зоны диагностики:
- Финансы: финансовый учёт, P&L, кэш-фло, понимание прибыли
- Маркетинг: каналы привлечения клиентов, аналитика, зависимость от одного канала
- Команда: роли, KPI, делегирование, независимость от собственника
- Операционные процессы: регламенты, стандарты, повторяемость
- Контроль собственника: управленческие решения, планирование, выход из операционки

Верни ТОЛЬКО валидный JSON без markdown, без комментариев, без BOM:

{
  "summary": "2 честных предложения о реальном состоянии управляемости бизнеса",
  "profile": "2-3 слова — тип управленца (например: Пожарный-операционщик, Интуитивный стратег)",
  "redZones": [
    {"title": "короткое название проблемы", "description": "конкретно почему это критично и что теряет бизнес"},
    {"title": "короткое название проблемы", "description": "конкретно почему это критично"},
    {"title": "короткое название проблемы", "description": "конкретно почему это критично"}
  ],
  "month1": {
    "theme": "фокус первого месяца — 5-7 слов",
    "tasks": [
      {"action": "конкретное действие с глаголом (что именно сделать)", "zone": "Финансы", "priority": "ВЫСОКИЙ"},
      {"action": "конкретное действие", "zone": "Маркетинг", "priority": "СРЕДНИЙ"},
      {"action": "конкретное действие", "zone": "Команда", "priority": "СРЕДНИЙ"},
      {"action": "конкретное действие", "zone": "Операционные процессы", "priority": "ПЛАНОВЫЙ"}
    ]
  },
  "month2": {
    "theme": "фокус второго месяца — 5-7 слов",
    "tasks": [
      {"action": "конкретное действие", "zone": "Операционные процессы", "priority": "ВЫСОКИЙ"},
      {"action": "конкретное действие", "zone": "Команда", "priority": "ВЫСОКИЙ"},
      {"action": "конкретное действие", "zone": "Финансы", "priority": "СРЕДНИЙ"},
      {"action": "конкретное действие", "zone": "Контроль собственника", "priority": "ПЛАНОВЫЙ"}
    ]
  },
  "month3": {
    "theme": "фокус третьего месяца — 5-7 слов",
    "tasks": [
      {"action": "конкретное действие", "zone": "Контроль собственника", "priority": "ВЫСОКИЙ"},
      {"action": "конкретное действие", "zone": "Маркетинг", "priority": "СРЕДНИЙ"},
      {"action": "конкретное действие", "zone": "Операционные процессы", "priority": "СРЕДНИЙ"},
      {"action": "конкретное действие", "zone": "Команда", "priority": "ПЛАНОВЫЙ"}
    ]
  },
  "transformation": [
    "конкретный измеримый результат через 90 дней — первый",
    "конкретный измеримый результат через 90 дней — второй",
    "конкретный измеримый результат через 90 дней — третий"
  ]
}

Правила приоритета задач:
- ВЫСОКИЙ — зона с баллом ниже 50
- СРЕДНИЙ — зона с баллом 50–70
- ПЛАНОВЫЙ — зона с баллом выше 70

Задачи должны быть конкретными (не абстрактными), применимыми для малого бизнеса 5–50 человек. Только русский язык.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic error: ${err}`);
    }

    const data = await response.json();
    const text = data.content[0].text.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const result = JSON.parse(jsonMatch[0]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Generation failed', message: err.message });
  }
};
