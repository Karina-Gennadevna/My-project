import type { FastifyInstance } from 'fastify'
import { validateTelegramInitData } from '../services/telegram-auth.js'
import prisma from '../prisma.js'

// POST /api/auth/telegram
// Клиент присылает initData из Telegram.WebApp.initData.
// Мы проверяем подпись, находим или создаём пользователя, отдаём JWT.
//
// Метафора: пользователь показывает паспорт (initData от Telegram),
// мы проверяем его у Telegram, а потом выдаём временный пропуск (JWT).

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{
    Body: { initData: string }
  }>('/api/auth/telegram', {
    schema: {
      body: {
        type: 'object',
        required: ['initData'],
        properties: {
          initData: { type: 'string', minLength: 1 },
        },
      },
    },
  }, async (request, reply) => {
    const { initData } = request.body
    const botToken = process.env.BOT_TOKEN

    if (!botToken) {
      fastify.log.error('BOT_TOKEN not set')
      return reply.status(500).send({ error: 'Server misconfigured' })
    }

    // 1. Проверяем подпись Telegram
    const telegramUser = validateTelegramInitData(initData, botToken)
    if (!telegramUser) {
      return reply.status(401).send({ error: 'Invalid initData' })
    }

    // 2. Находим или создаём пользователя в базе (upsert = обновить или создать)
    const user = await prisma.user.upsert({
      where: { telegramId: BigInt(telegramUser.id) },
      update: {
        telegramUsername: telegramUser.username ?? null,
        firstName: telegramUser.first_name,
        lastActiveAt: new Date(),
      },
      create: {
        telegramId: BigInt(telegramUser.id),
        telegramUsername: telegramUser.username ?? null,
        firstName: telegramUser.first_name,
      },
    })

    // 3. Выдаём JWT на 30 дней
    const token = fastify.jwt.sign(
      { userId: user.id, telegramId: telegramUser.id },
      { expiresIn: '30d' }
    )

    return reply.send({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        telegramUsername: user.telegramUsername,
      },
    })
  })
}
