import type { FastifyRequest, FastifyReply } from 'fastify'
import type { JwtPayload } from '../types.js'

// Middleware — это как охранник на входе.
// Каждый запрос к защищённым роутам проходит через него.
// Если токена нет или он неверный — 401, дальше не пускаем.

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    // Fastify-jwt сам достаёт токен из заголовка Authorization: Bearer <token>
    // и проверяет подпись нашим JWT_SECRET
    const payload = await request.jwtVerify<JwtPayload>()
    request.jwtPayload = payload
  } catch {
    reply.status(401).send({ error: 'Unauthorized' })
  }
}
