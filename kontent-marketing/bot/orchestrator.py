"""
Оркестратор — координирует 11 агентов, выбирает пайплайн под задачу.

Пайплайны:
  write_post     → архитектор → ресёрчер → копирайтер → критик → редактор → тестировщик
  edit_post      → редактор → критик → тестировщик
  analyze_style  → аналитик стиля
  content_plan   → контент-планер
  decompose      → декомпозитор
  unknown        → write_post
"""

from agents import (
    dispatcher,
    architect,
    decomposer,
    style_analyst,
    researcher,
    copywriter,
    critic,
    editor,
    tester,
    content_planner,
)


async def run(user_message: str) -> str:
    intent = await dispatcher(user_message)

    if intent == "analyze_style":
        return await style_analyst()

    if intent == "content_plan":
        return await content_planner(user_message)

    if intent == "decompose":
        return await decomposer(user_message)

    if intent == "edit_post":
        return await _pipeline_edit(user_message)

    # write_post + unknown
    return await _pipeline_write(user_message)


# ─── Пайплайн: написать пост ──────────────────────────────────────────────────

async def _pipeline_write(task: str) -> str:
    # 1. Архитектор — структура
    structure = await architect(task)

    # 2. Ресёрчер — фактура
    research = await researcher(task)

    # 3. Копирайтер — черновик
    draft = await copywriter(structure, research)

    # 4. Критик — оценка и замечания
    review = await critic(draft)

    # 5. Редактор — правка по замечаниям критика (если нужно)
    if "ДОРАБОТАТЬ" in review:
        critique_notes = _extract_revision(review)
        draft = await editor(draft, critique_notes)

    # 6. Тестировщик — финальная QA
    qa = await tester(draft)

    if qa.startswith("ДОРАБОТАТЬ"):
        draft = await editor(draft, qa.replace("ДОРАБОТАТЬ:", "").strip())

    return draft


# ─── Пайплайн: отредактировать готовый текст ─────────────────────────────────

async def _pipeline_edit(text: str) -> str:
    # 1. Редактор — первичная правка
    improved = await editor(text)

    # 2. Критик — оценка
    review = await critic(improved)

    # 3. Ещё один проход редактора если критик нашёл проблемы
    if "ДОРАБОТАТЬ" in review:
        notes = _extract_revision(review)
        improved = await editor(improved, notes)

    # 4. Тестировщик
    qa = await tester(improved)
    if qa.startswith("ДОРАБОТАТЬ"):
        improved = await editor(improved, qa.replace("ДОРАБОТАТЬ:", "").strip())

    return improved


# ─── Утилита: извлечь замечания из ревизии критика ───────────────────────────

def _extract_revision(review: str) -> str:
    """Вытаскивает блок РЕВИЗИЯ из ответа критика."""
    if "РЕВИЗИЯ:" in review:
        return review.split("РЕВИЗИЯ:")[-1].split("ВЕРДИКТ:")[0].strip()
    return review
