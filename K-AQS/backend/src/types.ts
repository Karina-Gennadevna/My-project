// Типы, которые используются во всём проекте

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

// То, что мы кладём внутрь JWT-токена
export interface JwtPayload {
  userId: string      // UUID нашего пользователя в базе
  telegramId: number  // Telegram ID — для дополнительной проверки
}

// Зоны диагностики
export type ZoneId = 'finance' | 'marketing' | 'team' | 'ops' | 'control'

export const ZONE_IDS: ZoneId[] = ['finance', 'marketing', 'team', 'ops', 'control']

// Результаты диагностики, которые приходят с фронтенда
export interface DiagnosticScores {
  indexScore: number    // 0–100
  zoneFinance: number
  zoneMarketing: number
  zoneTeam: number
  zoneOps: number
  zoneControl: number
}

// Рекомендация, которую сохраняем как снапшот
export interface RecommendationSnapshot {
  zoneId: ZoneId
  score: number
  action: string
  firstStep: string
}

// Расширяем типы Fastify, чтобы TypeScript знал о нашем JWT
declare module 'fastify' {
  interface FastifyRequest {
    jwtPayload?: JwtPayload
  }
}
