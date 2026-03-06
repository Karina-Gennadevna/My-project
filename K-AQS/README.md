# K-AQS™ — Лендинг

Production-ready лендинг для системы K-AQS™ (Karina AI Quality System).

## Стек

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **SVG diagrams** — чистый SVG, без D3 и внешних зависимостей

## Установка и запуск

```bash
cd K-AQS
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Сборка для продакшн

```bash
npm run build
npm start
```

## Структура проекта

```
K-AQS/
├── app/
│   ├── layout.tsx          # Metadata, шрифты Inter
│   ├── globals.css         # Design tokens, утилиты, анимации
│   └── page.tsx            # Главная страница
├── components/
│   ├── Nav.tsx             # Навигация (sticky, mobile menu)
│   ├── Hero.tsx            # Hero + модальное окно
│   ├── ForWhom.tsx         # Для кого / не для кого
│   ├── Symptoms.tsx        # Симптомы хаоса
│   ├── Deliverables.tsx    # 6 deliverables
│   ├── Methodology.tsx     # K-A-Q-S методология
│   ├── RadarChart.tsx      # SVG radar chart
│   ├── RiskMap.tsx         # SVG risk matrix
│   ├── ReportPreview.tsx   # Mock PDF pages (SVG)
│   ├── Demo.tsx            # Демо секция + modal trigger
│   ├── Modal.tsx           # Модальное окно
│   ├── FinancialRisk.tsx   # Зона финансового риска
│   ├── Architect.tsx       # Роль архитектора
│   ├── Process.tsx         # 6-шаговый процесс
│   ├── FAQ.tsx             # FAQ accordion
│   ├── FinalCTA.tsx        # Форма заявки + toast
│   └── FadeUp.tsx          # Scroll animation wrapper
├── public/
│   └── favicon.svg
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Секции

1. **Hero** — H1, bullets, два CTA, миниатюра диаграммы
2. **ForWhom** — Для кого / Кому не подходит
3. **Symptoms** — Симптомы хаоса (чеклист)
4. **Deliverables** — 6 карточек результатов
5. **Methodology** — K-A-Q-S четыре блока
6. **Demo** — RadarChart + RiskMap + PDF preview
7. **FinancialRisk** — Зона финансового риска + disclaimer
8. **Architect** — Архитектурная сессия
9. **Process** — Таймлайн 6 шагов
10. **FAQ** — 8 вопросов-ответов (accordion)
11. **FinalCTA** — Форма заявки (#start)

## Деплой на Vercel

```bash
npm install -g vercel
vercel
```

Или через Vercel Dashboard: подключите репозиторий, фреймворк определится автоматически.
