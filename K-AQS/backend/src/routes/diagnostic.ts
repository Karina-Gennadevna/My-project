import type { FastifyInstance } from 'fastify'
import { requireAuth } from '../middleware/auth.js'
import { buildRecommendations } from '../services/recommendations.js'
import prisma from '../prisma.js'
import type { DiagnosticScores } from '../types.js'

// Все маршруты диагностики.
// Каждый защищён requireAuth — без токена не войти.
// Внутри каждого маршрута мы берём userId из JWT и работаем ТОЛЬКО с его данными.

export async function diagnosticRoutes(fastify: FastifyInstance) {

  // POST /api/diagnostic/complete
  // Сохраняем результаты пройденной диагностики.
  // Фронтенд присылает 6 баллов → мы вычисляем рекомендации и сохраняем всё в базу.
  fastify.post<{ Body: DiagnosticScores }>(
    '/api/diagnostic/complete',
    { preHandler: requireAuth,
      schema: {
        body: {
          type: 'object',
          required: ['indexScore','zoneFinance','zoneMarketing','zoneTeam','zoneOps','zoneControl'],
          properties: {
            indexScore:    { type: 'integer', minimum: 0, maximum: 100 },
            zoneFinance:   { type: 'integer', minimum: 0, maximum: 100 },
            zoneMarketing: { type: 'integer', minimum: 0, maximum: 100 },
            zoneTeam:      { type: 'integer', minimum: 0, maximum: 100 },
            zoneOps:       { type: 'integer', minimum: 0, maximum: 100 },
            zoneControl:   { type: 'integer', minimum: 0, maximum: 100 },
          },
        },
      },
    },
    async (request, reply) => {
      const userId = request.jwtPayload!.userId
      const scores = request.body

      // Строим снапшот рекомендаций по текущим шаблонам из базы
      const recommendations = await buildRecommendations(scores)

      const session = await prisma.diagnosticSession.create({
        data: {
          userId,
          indexScore:    scores.indexScore,
          zoneFinance:   scores.zoneFinance,
          zoneMarketing: scores.zoneMarketing,
          zoneTeam:      scores.zoneTeam,
          zoneOps:       scores.zoneOps,
          zoneControl:   scores.zoneControl,
          recommendations: recommendations as unknown as object,
        },
      })

      return reply.status(201).send({
        sessionId: session.id,
        recommendations,
      })
    }
  )

  // GET /api/diagnostic/history
  // Возвращает список всех диагностик пользователя (от новых к старым).
  // Пользователь видит ТОЛЬКО свои сессии — userId берётся из токена.
  fastify.get(
    '/api/diagnostic/history',
    { preHandler: requireAuth },
    async (request, reply) => {
      const userId = request.jwtPayload!.userId

      const sessions = await prisma.diagnosticSession.findMany({
        where: { userId },
        orderBy: { completedAt: 'desc' },
        select: {
          id:            true,
          completedAt:   true,
          indexScore:    true,
          zoneFinance:   true,
          zoneMarketing: true,
          zoneTeam:      true,
          zoneOps:       true,
          zoneControl:   true,
          reportPurchased: true,
        },
      })

      return reply.send({ sessions })
    }
  )

  // GET /api/diagnostic/:id
  // Полные данные одной сессии, включая рекомендации.
  // Проверяем, что session.userId === наш userId — нельзя смотреть чужое.
  fastify.get<{ Params: { id: string } }>(
    '/api/diagnostic/:id',
    { preHandler: requireAuth },
    async (request, reply) => {
      const userId = request.jwtPayload!.userId
      const { id } = request.params

      const session = await prisma.diagnosticSession.findUnique({
        where: { id },
      })

      if (!session) {
        return reply.status(404).send({ error: 'Session not found' })
      }

      // Проверка владельца — самый важный security check
      if (session.userId !== userId) {
        return reply.status(403).send({ error: 'Forbidden' })
      }

      return reply.send({ session })
    }
  )
}
