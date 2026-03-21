import prisma from '../prisma.js'
import type { ZoneId, DiagnosticScores, RecommendationSnapshot } from '../types.js'
import { ZONE_IDS } from '../types.js'

// Превращаем результаты диагностики в список зон со счётом
function scoresToZoneList(scores: DiagnosticScores): Array<{ zoneId: ZoneId; score: number }> {
  return [
    { zoneId: 'finance',   score: scores.zoneFinance   },
    { zoneId: 'marketing', score: scores.zoneMarketing },
    { zoneId: 'team',      score: scores.zoneTeam      },
    { zoneId: 'ops',       score: scores.zoneOps       },
    { zoneId: 'control',   score: scores.zoneControl   },
  ]
}

// Берём top-N зон с наименьшим счётом — это слабые места, там нужны рекомендации.
// Как врач: сначала лечим то, что болит больше всего.
export async function buildRecommendations(
  scores: DiagnosticScores,
  topN = 3
): Promise<RecommendationSnapshot[]> {
  // Сортируем по счёту: слабые зоны первые
  const sorted = scoresToZoneList(scores).sort((a, b) => a.score - b.score)
  const weakZones = sorted.slice(0, topN)

  // Загружаем активные шаблоны для этих зон за один запрос к базе
  const zoneIds = weakZones.map((z) => z.zoneId)
  const templates = await prisma.recommendationTemplate.findMany({
    where: {
      zoneId: { in: zoneIds },
      isActive: true,
    },
    orderBy: { version: 'desc' }, // берём свежую версию
  })

  // Строим словарь zone → template
  const templateMap = new Map(templates.map((t) => [t.zoneId, t]))

  // Собираем снапшот
  const snapshots: RecommendationSnapshot[] = []
  for (const { zoneId, score } of weakZones) {
    const tpl = templateMap.get(zoneId)
    if (!tpl) continue // нет шаблона — пропускаем
    snapshots.push({
      zoneId: zoneId as ZoneId,
      score,
      action: tpl.action,
      firstStep: tpl.firstStep,
    })
  }

  return snapshots
}

// Проверяем, есть ли активные шаблоны для всех 5 зон.
// Полезно при старте сервера.
export async function checkTemplatesExist(): Promise<boolean> {
  const count = await prisma.recommendationTemplate.count({
    where: { isActive: true },
  })
  return count >= ZONE_IDS.length
}
