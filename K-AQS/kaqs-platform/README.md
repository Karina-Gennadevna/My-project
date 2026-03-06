# K-A-Q-S™ Platform

## Требования

- Node.js 18+
- npm 9+

## Запуск локально

```bash
# 1. Установить зависимости
npm install

# 2. Сгенерировать Prisma client
npm run db:generate

# 3. Создать базу данных (SQLite)
npm run db:push

# 4. Запустить в dev-режиме
npm run dev
```

Открыть: http://localhost:3000

## Переменные окружения

Файл `.env.local` уже настроен для разработки.
Для продакшена — сгенерировать новый `JWT_SECRET` (минимум 32 случайных символа).

## Структура

```
src/
├── app/
│   ├── page.tsx              ← Лендинг (/)
│   ├── auth/page.tsx         ← Логин/регистрация (/auth)
│   ├── app/
│   │   ├── page.tsx          ← Dashboard (/app)
│   │   ├── assessment/       ← Wizard (/app/assessment)
│   │   ├── results/[id]/     ← Результаты
│   │   └── report/[id]/      ← Web-отчёт + PDF
│   ├── admin/page.tsx        ← Админ (/admin)
│   └── api/                  ← API routes
├── lib/
│   ├── questions.ts          ← Все вопросы (JSON-конфиг)
│   ├── scoring.ts            ← Логика расчёта баллов
│   ├── auth.ts               ← JWT helpers
│   └── db.ts                 ← Prisma client
└── types/index.ts            ← TypeScript типы
```

## Добавить/изменить вопросы

Редактировать `src/lib/questions.ts`.
Каждый вопрос имеет флаг `scoring: true/false`.
Только `scoring: true` вопросы влияют на итоговый балл.

## PDF

По умолчанию — открывает страницу отчёта с `?print=1`, браузер вызывает `window.print()`.
Для серверного PDF — установить `puppeteer` и раскомментировать блок в `/api/report/[id]/pdf/route.ts`.

## Первый администратор

Зарегистрируйте пользователя с email, указанным в `ADMIN_EMAIL` в `.env.local`.
Этот пользователь автоматически получит роль `admin`.
