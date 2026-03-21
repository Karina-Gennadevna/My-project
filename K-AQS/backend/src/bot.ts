import { Telegraf } from 'telegraf'

// =========================================================
// Telegram-бот K-A-Q-S™
//
// Что умеет:
// 1. /start — приветствие + кнопка открыть Mini App
// 2. web_app_data — получает результаты диагностики от Mini App,
//    отправляет владельцу красивое сообщение с раскладкой по зонам
//
// ВАЖНО: bot создаётся внутри startBot(), а не на уровне модуля —
// это гарантирует, что process.env уже заполнен через dotenv.
// =========================================================

let botInstance: Telegraf | null = null

function createBot(): Telegraf {
  const BOT_TOKEN    = process.env.BOT_TOKEN
  const MINI_APP_URL = process.env.MINI_APP_URL || ''

  if (!BOT_TOKEN) throw new Error('BOT_TOKEN is not set in environment variables')

  const hasUrl = !!MINI_APP_URL
  const bot = new Telegraf(BOT_TOKEN)

  // ── /start ────────────────────────────────────────────
  bot.start(async (ctx) => {
    const name = ctx.from?.first_name || 'друг'

    await ctx.replyWithHTML(
      `Привет, <b>${name}</b>! 👋\n\n` +
      `Это <b>K-A-Q-S™</b> — диагностика системы управления бизнеса.\n\n` +
      `Пройдите 20 вопросов за 5 минут и получите <b>Индекс управляемости</b> от 0 до 100.\n\n` +
      `Узнайте, где ваш бизнес теряет деньги.`,
      hasUrl
        ? { reply_markup: { inline_keyboard: [[
              { text: '🔍 Открыть диагностику', web_app: { url: MINI_APP_URL } },
            ]] } }
        : undefined
    )
  })

  // ── web_app_data — результаты диагностики ────────────
  // Mini App вызывает tg.sendData(JSON) → бот получает это здесь.
  // Каждый пользователь видит разбор своего результата в чате.
  bot.on('web_app_data', async (ctx) => {
    try {
      const raw = ctx.webAppData?.data?.text()
      if (!raw) return

      const data = JSON.parse(raw) as {
        index:  number
        zones:  { finance: number; marketing: number; team: number; ops: number; control: number }
        risks:  string[]
        recs:   string[]
      }

      const { index, zones, risks, recs } = data

      const level =
        index >= 80 ? '🟢 Высокий уровень'  :
        index >= 60 ? '🟡 Средний уровень'  :
        index >= 40 ? '🟠 Ниже среднего'    :
                      '🔴 Критический уровень'

      // Мини прогресс-бар: 10 символов
      const bar = (v: number) =>
        '█'.repeat(Math.round(v / 10)) + '░'.repeat(10 - Math.round(v / 10))

      const zonesText = [
        `💰 Финансы    ${bar(zones.finance)} ${zones.finance}`,
        `📣 Маркетинг  ${bar(zones.marketing)} ${zones.marketing}`,
        `👥 Команда    ${bar(zones.team)} ${zones.team}`,
        `⚙️ Операции   ${bar(zones.ops)} ${zones.ops}`,
        `🎯 Контроль   ${bar(zones.control)} ${zones.control}`,
      ].join('\n')

      const risksText = risks.slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join('\n')
      const recsText  = recs.slice(0, 3).map((r, i) => `${i + 1}. ${r}`).join('\n')

      await ctx.replyWithHTML(
        `📊 <b>Индекс управляемости бизнеса</b>\n\n` +
        `🎯 Ваш индекс: <b>${index}/100</b> — ${level}\n\n` +
        `📈 По зонам:\n<code>${zonesText}</code>\n\n` +
        `⚠️ Слабые места:\n${risksText}\n\n` +
        `✅ Первые шаги:\n${recsText}`,
        hasUrl
          ? { reply_markup: { inline_keyboard: [
                [{ text: '📋 Получить полный отчёт — 7 900 ₽', web_app: { url: MINI_APP_URL } }],
                [{ text: '🔄 Пройти диагностику снова',        web_app: { url: MINI_APP_URL } }],
              ] } }
          : undefined
      )
    } catch (err) {
      console.error('Failed to handle web_app_data:', err)
    }
  })

  return bot
}

// ── Запуск ───────────────────────────────────────────────
export async function startBot(): Promise<void> {
  botInstance = createBot()
  await botInstance.launch()
  console.log('Telegram bot started (long polling)')
}

export function stopBot(signal: string): void {
  botInstance?.stop(signal)
}
