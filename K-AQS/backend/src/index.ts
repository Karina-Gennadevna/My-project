import { config } from 'dotenv'
import { resolve } from 'path'
// Локальная разработка: .env лежит в корне K-AQS/ (на уровень выше backend/)
// В продакшне (Railway) переменные передаются напрямую — dotenv тихо пропускает
config({ path: resolve(process.cwd(), '../.env') })
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { authRoutes } from './routes/auth.js'
import { diagnosticRoutes } from './routes/diagnostic.js'
import { checkTemplatesExist } from './services/recommendations.js'
import { startBot, stopBot } from './bot.js'
import prisma from './prisma.js'

// =========================================================
// Главный файл сервера.
// Как диспетчерская: принимает все запросы и направляет
// их в нужный маршрут.
// =========================================================

async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
      transport:
        process.env.NODE_ENV === 'development'
          ? { target: 'pino-pretty' }
          : undefined,
    },
  })

  // CORS — разрешаем запросы с нашего Mini App
  // В продакшне замените '*' на точный домен вашего фронтенда
  await fastify.register(cors, {
    origin: process.env.NODE_ENV === 'development'
      ? true
      : ['https://t.me'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })

  // JWT — для выдачи и проверки токенов
  const jwtSecret = process.env.JWT_SECRET
  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not set in environment variables')
  }
  await fastify.register(jwt, { secret: jwtSecret })

  // Маршруты
  await fastify.register(authRoutes)
  await fastify.register(diagnosticRoutes)

  // Базовый health-check — проверяем, что сервер жив
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))

  return fastify
}

async function main() {
  const fastify = await buildServer()

  // Проверяем подключение к базе данных
  try {
    await prisma.$connect()
    fastify.log.info('Database connected')
  } catch (err) {
    fastify.log.error({ err }, 'Failed to connect to database')
    process.exit(1)
  }

  // Проверяем, что шаблоны рекомендаций заполнены
  const templatesOk = await checkTemplatesExist()
  if (!templatesOk) {
    fastify.log.warn(
      'Recommendation templates are missing in the database. ' +
      'Run the SQL seed script from database/schema.sql'
    )
  }

  const port = parseInt(process.env.PORT ?? '3001', 10)
  const host = process.env.HOST ?? '0.0.0.0'

  try {
    await fastify.listen({ port, host })
    fastify.log.info(`Server listening on http://${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }

  // Запускаем Telegram-бота (long polling, параллельно с HTTP-сервером)
  try {
    await startBot()
  } catch (err) {
    fastify.log.error({ err }, 'Failed to start Telegram bot')
    // Бот не критичен — сервер продолжает работу
  }

  // Корректное завершение при Ctrl+C или сигнале от системы
  const shutdown = async (signal: string) => {
    fastify.log.info(`Received ${signal}, shutting down gracefully`)
    stopBot(signal)
    await fastify.close()
    await prisma.$disconnect()
    process.exit(0)
  }

  process.on('SIGINT',  () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

main()
