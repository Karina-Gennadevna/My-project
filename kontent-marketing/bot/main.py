"""
Telegram-бот — точка входа.
Запуск: python main.py
"""

import logging
import json
import re
from pathlib import Path

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    filters,
    ContextTypes,
)

from config import TELEGRAM_TOKEN, ALLOWED_USER_IDS, DATA_DIR, EXAMPLES_DIR
from orchestrator import run

logging.basicConfig(
    format="%(asctime)s | %(levelname)s | %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

PLAN_FILE = DATA_DIR / "контент-план.md"


# ─── Проверка доступа ─────────────────────────────────────────────────────────

def is_allowed(user_id: int) -> bool:
    if not ALLOWED_USER_IDS:
        return True
    return user_id in ALLOWED_USER_IDS


# ─── Парсинг контент-плана ────────────────────────────────────────────────────

def get_next_topics(limit: int = 3) -> list[str]:
    """Читает контент-план и возвращает первые N незапубликованных тем."""
    if not PLAN_FILE.exists():
        return []

    topics = []
    for line in PLAN_FILE.read_text(encoding="utf-8").splitlines():
        if re.match(r"^- \[ \]", line):
            # Убираем маркер "- [ ] " и берём остаток строки
            clean = re.sub(r"^- \[ \]\s*", "", line).strip()
            topics.append(clean)
            if len(topics) >= limit:
                break
    return topics


def build_plan_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("📅 Контент-план", callback_data="show_next_topics")],
    ])


# ─── Хендлеры ─────────────────────────────────────────────────────────────────

async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update.effective_user.id):
        return
    await update.message.reply_text(
        "Привет! Я AI-копирайтер. Пишу посты твоим голосом.\n\n"
        "Что умею:\n"
        "• Написать пост — просто опиши тему\n"
        "• Отредактировать текст — пришли и скажи что улучшить\n"
        "• /plan — полный контент-план\n"
        "• /help — список команд\n\n"
        "Загрузи .md или .json с выгрузкой Telegram-канала — "
        "буду писать точнее в твоём стиле.",
        reply_markup=build_plan_keyboard(),
    )


async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update.effective_user.id):
        return
    await update.message.reply_text(
        "Команды:\n"
        "/start — начать\n"
        "/plan — полный контент-план\n"
        "/next — 3 ближайшие темы\n"
        "/help — эта справка\n\n"
        "Просто пиши:\n"
        "• «Напиши пост про делегирование» — напишу пост\n"
        "• «Вот мой текст: [текст]. Сделай лучше» — отредактирую\n\n"
        "Загружай файлы .md / .json — обновлю базу стиля.",
        reply_markup=build_plan_keyboard(),
    )


async def cmd_next(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показывает 3 ближайшие темы из контент-плана."""
    if not is_allowed(update.effective_user.id):
        return
    await _send_next_topics(update.message.reply_text)


async def cmd_plan(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Показывает полный контент-план."""
    if not is_allowed(update.effective_user.id):
        return
    if not PLAN_FILE.exists():
        await update.message.reply_text("Файл контент-план.md не найден.")
        return
    text = PLAN_FILE.read_text(encoding="utf-8")
    chunks = [text[i:i + 4000] for i in range(0, len(text), 4000)]
    for chunk in chunks:
        await update.message.reply_text(chunk)


async def callback_plan(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Обработчик кнопки «Контент-план»."""
    query = update.callback_query
    await query.answer()
    if not is_allowed(query.from_user.id):
        return
    await _send_next_topics(query.message.reply_text)


async def _send_next_topics(reply_fn):
    """Общая логика: читает план и отправляет 3 темы."""
    topics = get_next_topics(3)
    if not topics:
        await reply_fn(
            "✅ Все темы опубликованы или план пустой.\n"
            "Добавь новые темы в контент-план.md"
        )
        return

    lines = ["📅 *Ближайшие 3 темы:*\n"]
    for i, topic in enumerate(topics, 1):
        lines.append(f"{i}. {topic}")
    lines.append("\nЧтобы написать пост — просто скинь тему сюда.")

    await reply_fn("\n".join(lines), parse_mode="Markdown")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update.effective_user.id):
        return

    user_text = update.message.text
    logger.info(f"User {update.effective_user.id}: {user_text[:80]}")

    thinking = await update.message.reply_text("⏳ Работаю над постом...")

    try:
        result = await run(user_text)
        await thinking.edit_text(result)
    except Exception as e:
        logger.error(f"Error: {e}", exc_info=True)
        await thinking.edit_text(f"❌ Ошибка: {e}")


async def handle_document(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update.effective_user.id):
        return

    doc = update.message.document
    if not doc.file_name.endswith((".md", ".json")):
        await update.message.reply_text(
            "Поддерживаю только .md и .json.\n"
            "Загружай выгрузку Telegram-канала в одном из этих форматов."
        )
        return

    await update.message.reply_text("⏳ Загружаю файл...")

    tg_file = await context.bot.get_file(doc.file_id)
    save_path = EXAMPLES_DIR / doc.file_name
    await tg_file.download_to_drive(save_path)

    if doc.file_name.endswith(".json"):
        try:
            data = json.loads(save_path.read_text(encoding="utf-8"))
            if isinstance(data, dict) and "messages" in data:
                count = sum(
                    1 for m in data["messages"]
                    if m.get("type") == "message" and m.get("text")
                )
                await update.message.reply_text(
                    f"✅ Загружено: {doc.file_name}\n"
                    f"Найдено постов: {count}\n"
                    "Теперь буду писать точнее в твоём стиле."
                )
                return
        except Exception:
            pass

    await update.message.reply_text(
        f"✅ Загружено: {doc.file_name}\n"
        "Использую как пример стиля при написании постов."
    )


# ─── Запуск ───────────────────────────────────────────────────────────────────

def main():
    if not TELEGRAM_TOKEN:
        raise RuntimeError("TELEGRAM_TOKEN не задан в .env")
    if not ALLOWED_USER_IDS:
        logger.warning("ALLOWED_USER_IDS не задан — бот доступен всем пользователям!")

    app = Application.builder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("help", cmd_help))
    app.add_handler(CommandHandler("plan", cmd_plan))
    app.add_handler(CommandHandler("next", cmd_next))
    app.add_handler(CallbackQueryHandler(callback_plan, pattern="show_next_topics"))
    app.add_handler(MessageHandler(filters.Document.ALL, handle_document))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    logger.info("Бот запущен")
    app.run_polling(drop_pending_updates=True)


if __name__ == "__main__":
    main()
