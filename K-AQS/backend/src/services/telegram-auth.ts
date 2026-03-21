import { createHmac, timingSafeEqual } from 'crypto'
import type { TelegramUser } from '../types.js'

// Проверяем подпись initData от Telegram.
// Это как таможня на границе: Telegram подписывает данные своим ключом,
// а мы проверяем подпись. Подделать без BOT_TOKEN невозможно.
//
// Алгоритм (официальная документация Telegram):
// 1. Берём все поля кроме "hash", сортируем по алфавиту
// 2. Склеиваем через \n
// 3. Ключ = HMAC-SHA256("WebAppData", BOT_TOKEN)
// 4. Подпись = HMAC-SHA256(data_check_string, secret_key)
// 5. Сравниваем с hash из initData

export function validateTelegramInitData(
  initData: string,
  botToken: string
): TelegramUser | null {
  try {
    const params = new URLSearchParams(initData)
    const hash = params.get('hash')
    if (!hash) return null

    // Убираем hash из проверки
    params.delete('hash')

    // Сортируем оставшиеся поля и склеиваем
    const dataCheckString = Array.from(params.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    // Генерируем секретный ключ
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    // Вычисляем подпись
    const computedHash = createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    // Сравниваем безопасно (защита от timing attack)
    const hashBuffer = Buffer.from(hash, 'hex')
    const computedBuffer = Buffer.from(computedHash, 'hex')

    if (
      hashBuffer.length !== computedBuffer.length ||
      !timingSafeEqual(hashBuffer, computedBuffer)
    ) {
      return null
    }

    // Проверяем, что данные не устарели (защита от replay attack)
    const authDate = params.get('auth_date')
    if (authDate) {
      const ageSeconds = Math.floor(Date.now() / 1000) - parseInt(authDate, 10)
      // Отклоняем данные старше 24 часов
      if (ageSeconds > 86400) return null
    }

    // Извлекаем данные пользователя
    const userJson = params.get('user')
    if (!userJson) return null

    return JSON.parse(userJson) as TelegramUser
  } catch {
    return null
  }
}
