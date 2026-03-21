# BACKEND-PLAN.md
## K-A-Q-S™ — Индекс управляемости бизнеса

> Архитектурный план бэкенда для самостоятельной разработки.
> Только то, что реально нужно этому приложению.

---

## 0. Как устроена система (одним абзацем)

Пользователь открывает Mini App в Telegram, проходит диагностику из 20 вопросов по 5 зонам.
Фронтенд отправляет результат (индекс + баллы по зонам) на бэкенд — бэкенд сохраняет сессию,
генерирует рекомендации и возвращает их клиенту. Пользователь видит историю всех своих
диагностик и может сравнивать прогресс. За отдельную плату получает полный PDF-отчёт
и roadmap — файлы отправляются в Telegram. Администратор управляет системой через веб-панель.

---

## 1. Стек

| Слой | Технология | Почему |
|---|---|---|
| Runtime | **Node.js 20 LTS** | Совпадает с существующим проектом (Next.js) |
| Язык | **TypeScript** | Уже используется, строгая типизация |
| HTTP-фреймворк | **Fastify 4** | Быстрее Express, встроенная валидация схем |
| База данных | **PostgreSQL 15** | Надёжна, хорошо работает с Prisma |
| ORM | **Prisma** | Миграции, типизация, читаемые схемы |
| Telegram-бот | **Telegraf 4** | Стандарт для Node.js Telegram-ботов |
| JWT | **jose** | Лёгкая библиотека, работает в edge-рантаймах |
| PDF | **PDFKit** | Нет зависимости от браузера, работает на сервере |
| Файлы | **Supabase Storage** | Бесплатный tier, интеграция с Supabase DB |
| База (хостинг) | **Supabase** | Бесплатный PostgreSQL, дашборд, бэкапы |
| Бэкенд (хостинг) | **Railway** | Деплой из GitHub в 3 клика, без DevOps |
| Фронтенд (хостинг) | **Vercel** | Уже используется в проекте |

### Альтернатива (если нужен полный контроль)
VPS Hetzner CX22 (~4€/мес) → PostgreSQL + Node.js + PM2 + Nginx.

---

## 2. Что храним — модели данных

### 2.1 User — пользователь

```
User {
  id               String   @id @default(uuid())
  telegram_id      BigInt   @unique          // из initData Telegram
  telegram_username String?                  // @username, может отсутствовать
  first_name       String                    // имя из Telegram
  created_at       DateTime @default(now())
  last_active_at   DateTime @updatedAt

  sessions         DiagnosticSession[]
  payments         Payment[]
}
```

**Кто создаёт:** автоматически при первом открытии Mini App.
**Кто редактирует:** никто — данные из Telegram обновляются при каждом входе.

---

### 2.2 DiagnosticSession — одна пройденная диагностика

```
DiagnosticSession {
  id               String   @id @default(uuid())
  user_id          String   @references User.id
  completed_at     DateTime @default(now())

  // Результаты (всё что нужно для сравнения)
  index            Int                       // 0–100, общий индекс
  zone_finance     Int                       // 0–100
  zone_marketing   Int                       // 0–100
  zone_team        Int                       // 0–100
  zone_ops         Int                       // 0–100
  zone_control     Int                       // 0–100

  // Снапшот рекомендаций на момент прохождения
  recommendations  Json                      // см. структуру ниже

  // Платный отчёт
  report_purchased Boolean  @default(false)
  report_pdf_url   String?                   // ссылка на файл в Supabase Storage
  report_sent_at   DateTime?                 // когда бот отправил файл пользователю

  payment          Payment?
  user             User     @relation(...)
}
```

**Структура поля `recommendations` (JSON):**
```json
{
  "top3": [
    {
      "zone_id": "finance",
      "zone_name": "Финансы",
      "zone_score": 32,
      "priority": "critical",
      "action": "Внедрить ежемесячный P&L-отчёт",
      "first_step": "Посчитать прибыль за прошлый месяц"
    },
    { ... },
    { ... }
  ],
  "generated_at": "2026-03-12T10:00:00Z",
  "template_version": 3
}
```

> Рекомендации сохраняются как снапшот в момент завершения.
> Если шаблоны изменятся — старые сессии не меняются, новые получают актуальные.

---

### 2.3 Payment — платёж за отчёт

```
Payment {
  id                  String   @id @default(uuid())
  user_id             String   @references User.id
  session_id          String   @unique @references DiagnosticSession.id
  amount              Int                       // в копейках, например 790000 = 7900 ₽
  currency            String   @default("RUB")
  provider            String                    // "yookassa" | "prodamus" | "telegram_stars"
  provider_payment_id String?                   // ID платежа в системе провайдера
  status              String   @default("pending")
                                                // pending | succeeded | failed | refunded
  created_at          DateTime @default(now())
  updated_at          DateTime @updatedAt

  user                User     @relation(...)
  session             DiagnosticSession @relation(...)
}
```

---

### 2.4 RecommendationTemplate — шаблоны рекомендаций (редактирует админ)

```
RecommendationTemplate {
  id          String   @id @default(uuid())
  zone_id     String                            // "finance" | "marketing" | "team" | "ops" | "control"
  version     Int      @default(1)              // инкрементируется при изменении
  action      String                            // основная рекомендация
  first_step  String                            // первый шаг
  is_active   Boolean  @default(true)
  updated_at  DateTime @updatedAt
  updated_by  String?                           // admin email
}
```

> При генерации рекомендаций берём последний активный шаблон для каждой зоны.
> Версия сохраняется в снапшот (`template_version`) для аудита.

---

### 2.5 Admin — администратор

```
Admin {
  id           String   @id @default(uuid())
  email        String   @unique
  password_hash String                          // bcrypt
  created_at   DateTime @default(now())
  last_login_at DateTime?
}
```

> Отдельная таблица, не связана с пользователями Telegram.
> Первый admin создаётся скриптом при деплое (`npm run seed:admin`).

---

## 3. API — полный список эндпоинтов

### Аутентификация (Mini App)

#### `POST /api/auth/telegram`
Валидация данных из Telegram, выдача JWT.

**Вход:**
```json
{
  "initData": "query_id=...&user=...&hash=..."
}
```

**Логика:**
1. Проверяем `hash` через HMAC-SHA256 с `BOT_TOKEN` — это стандартная проверка Telegram.
2. Если подпись верна — находим или создаём `User` по `telegram_id`.
3. Возвращаем JWT (срок жизни 30 дней).

**Выход:**
```json
{
  "token": "eyJ...",
  "user": {
    "id": "uuid",
    "first_name": "Карина",
    "telegram_username": "karina"
  }
}
```

**Ошибки:** `401` если подпись невалидна.

---

### Диагностика

#### `POST /api/diagnostic/complete`
Сохранить результат завершённой диагностики.

**Auth:** Bearer JWT (пользователь)

**Вход:**
```json
{
  "index": 67,
  "zones": {
    "finance": 45,
    "marketing": 72,
    "team": 58,
    "ops": 80,
    "control": 61
  }
}
```

**Логика:**
1. Сохраняем `DiagnosticSession` для пользователя.
2. Генерируем рекомендации: берём 3 зоны с наименьшим баллом, для каждой — активный `RecommendationTemplate`.
3. Сохраняем снапшот рекомендаций в `session.recommendations`.
4. Возвращаем `session_id` и рекомендации.

**Выход:**
```json
{
  "session_id": "uuid",
  "recommendations": { "top3": [...] }
}
```

---

#### `GET /api/diagnostic/history`
Вся история диагностик пользователя.

**Auth:** Bearer JWT (пользователь)

**Выход:**
```json
{
  "sessions": [
    {
      "id": "uuid",
      "completed_at": "2026-03-12T10:00:00Z",
      "index": 67,
      "zones": {
        "finance": 45,
        "marketing": 72,
        "team": 58,
        "ops": 80,
        "control": 61
      },
      "report_purchased": false
    }
  ]
}
```

> Отсортировано по дате убывания (новые сверху).

---

#### `GET /api/diagnostic/:session_id`
Детали одной сессии (для экрана сравнения).

**Auth:** Bearer JWT (пользователь)
**Проверка:** сессия принадлежит этому пользователю.

**Выход:** полный объект сессии включая `recommendations`.

---

### Платежи

#### `POST /api/payment/create`
Инициировать платёж за отчёт по конкретной сессии.

**Auth:** Bearer JWT (пользователь)

**Вход:**
```json
{
  "session_id": "uuid",
  "provider": "yookassa"
}
```

**Логика:**
1. Проверяем: сессия принадлежит пользователю и `report_purchased = false`.
2. Создаём `Payment` со статусом `pending`.
3. Обращаемся к API платёжной системы, получаем ссылку на оплату.
4. Возвращаем ссылку клиенту.

**Выход:**
```json
{
  "payment_id": "uuid",
  "payment_url": "https://yookassa.ru/checkout/..."
}
```

---

#### `POST /api/payment/webhook`
Получить уведомление от платёжной системы.

**Auth:** подпись от провайдера (IP whitelist + secret key)

**Логика при успешной оплате:**
1. Обновляем `Payment.status = "succeeded"`.
2. Обновляем `DiagnosticSession.report_purchased = true`.
3. Запускаем генерацию PDF (асинхронно).
4. Отправляем PDF в Telegram через бот.

> Webhook — единственное место, где меняется статус платежа.
> Повторные вызовы идемпотентны (проверяем `provider_payment_id`).

---

#### `GET /api/payment/:payment_id/status`
Проверить статус платежа (фронтенд поллит после редиректа).

**Auth:** Bearer JWT (пользователь)

**Выход:**
```json
{
  "status": "succeeded",
  "report_ready": true,
  "report_sent_at": "2026-03-12T10:05:00Z"
}
```

---

### Отчёт

#### `POST /api/report/generate/:session_id`
Сгенерировать PDF и roadmap (вызывается внутри бэкенда после подтверждения оплаты).

**Auth:** внутренний вызов (не из браузера), защита по `INTERNAL_SECRET`

**Логика:**
1. Берём данные сессии: `index`, `zones`, `recommendations`.
2. Генерируем PDF через PDFKit:
   - Титульный лист: индекс + дата + имя пользователя
   - Страница 2: Radar chart (SVG → PNG через sharp)
   - Страница 3–7: разбор каждой зоны (балл + рекомендации + первый шаг)
   - Страница 8: Roadmap на 90 дней (3 зоны × 3 временных окна)
3. Загружаем PDF в Supabase Storage.
4. Сохраняем URL в `DiagnosticSession.report_pdf_url`.
5. Бот отправляет файл пользователю в Telegram.

---

## 4. Telegram Bot — события и реакции

### `/start`
```
Бот отвечает:
"Привет, [имя]! 👋
Это K-A-Q-S™ — диагностика системы управления бизнеса.

Пройдите 20 вопросов за 5 минут и получите Индекс управляемости от 0 до 100.

[Открыть диагностику →]  ← кнопка с web_app URL
```

### `web_app_data` (получение результатов из Mini App)

Mini App отправляет через `Telegram.WebApp.sendData()`:
```json
{
  "index": 67,
  "zones": { "finance": 45, "marketing": 72, "team": 58, "ops": 80, "control": 61 },
  "risks": ["Финансы", "Команда", "Маркетинг"],
  "recs": ["Внедрить P&L-отчёт", "Прописать KPI", "Провести анализ каналов"]
}
```

**Бот отвечает красивым сообщением:**
```
📊 Индекс управляемости бизнеса

🎯 Ваш индекс: 67/100 — Средний уровень

📈 По зонам:
💰 Финансы       ████░░░░░░ 45
📣 Маркетинг     ███████░░░ 72
👥 Команда       █████░░░░░ 58
⚙️ Операции      ████████░░ 80
🎯 Контроль      ██████░░░░ 61

⚠️ Топ-3 риска:
1. Финансы — нет прозрачности
2. Команда — работа держится на вас
3. Маркетинг — один канал привлечения

✅ Первые шаги:
1. Посчитать прибыль за прошлый месяц
2. Прописать KPI для каждой роли
3. Провести анализ каналов за 6 месяцев

[Получить полный отчёт — 7 900 ₽]  ← inline кнопка → web_app платёж
[Пройти снова]                       ← inline кнопка → web_app URL
```

### Отправка отчёта (после оплаты)
```python
bot.send_document(
  chat_id=telegram_id,
  document=pdf_file_url,
  caption="📋 Ваш полный отчёт K-A-Q-S™\n\nСохраните файл — в нём ваш roadmap на 90 дней."
)
```

---

## 5. Права доступа — кто что видит

| Действие | Пользователь | Администратор |
|---|---|---|
| Пройти диагностику | ✅ | — |
| Видеть свои результаты | ✅ | ✅ |
| Видеть свою историю | ✅ | ✅ |
| Оплатить отчёт | ✅ | — |
| Получить PDF | ✅ (после оплаты) | ✅ |
| Видеть чужие результаты | ❌ | ✅ |
| Видеть всех пользователей | ❌ | ✅ |
| Редактировать рекомендации | ❌ | ✅ |
| Видеть все платежи | ❌ | ✅ |
| Экспортировать данные | ❌ | ✅ |
| Создать другого админа | ❌ | ✅ |

---

## 6. Панель администратора

### Аутентификация
- Логин через email + пароль (не Telegram)
- URL: `/admin` (отдельный роут или отдельное приложение)
- JWT с коротким TTL (8 часов), refresh token

### Страницы и функции

#### `/admin/dashboard` — главная
- Всего пользователей
- Диагностик за всё время / за 7 дней / за 30 дней
- Средний индекс по всем пользователям
- Конверсия в оплату (платежи / завершённые диагностики)
- Выручка за 30 дней
- График: количество диагностик по дням (последние 30 дней)

#### `/admin/users` — список пользователей
- Таблица: Telegram ID, имя, @username, дата регистрации, кол-во диагностик, последний индекс, куплен ли отчёт
- Поиск по имени и username
- Фильтр: куплен отчёт / не куплен
- Пагинация по 50

#### `/admin/users/:id` — карточка пользователя
- Данные из Telegram
- Все диагностические сессии с датами и индексами
- Статус оплаты
- Кнопка: вручную отметить отчёт как отправленный (для ручных кейсов)

#### `/admin/payments` — все платежи
- Таблица: дата, пользователь, сумма, провайдер, статус
- Фильтр по статусу (pending / succeeded / failed)
- Итого выручки

#### `/admin/recommendations` — редактирование шаблонов
- 5 строк (по одной на зону): Finance, Marketing, Team, Ops, Control
- Поля для редактирования: `action`, `first_step`
- Кнопка «Сохранить» — создаёт новую версию шаблона
- Текущая версия видна на каждой строке

#### `/admin/export`
- Кнопка: «Скачать CSV всех пользователей»
- Кнопка: «Скачать CSV всех диагностик»
- Формат: `user_telegram_id, first_name, date, index, finance, marketing, team, ops, control, report_purchased`

---

## 7. Поток данных — полный цикл

```
1. ПЕРВЫЙ ЗАПУСК
   Telegram → /start → Бот → кнопка [Открыть диагностику]
                                          ↓
                              Mini App загружается
                                          ↓
   Mini App → POST /api/auth/telegram (initData)
                                          ↓
   Backend: валидация HMAC → создаём User → возвращаем JWT
                                          ↓
   Mini App сохраняет JWT в памяти

2. ДИАГНОСТИКА
   Пользователь отвечает на 20 вопросов (всё локально в браузере)
                                          ↓
   После последнего вопроса:
   Mini App считает index + zone scores → показывает экран результата
                                          ↓
   Mini App → POST /api/diagnostic/complete { index, zones }
                                          ↓
   Backend: сохраняем сессию → генерируем рекомендации → возвращаем session_id
                                          ↓
   Параллельно: Mini App → sendData() → Bot получает результат
                                          ↓
   Bot: отправляет красивое сообщение в чат

3. ИСТОРИЯ (вкладка «Прогресс»)
   Mini App → GET /api/diagnostic/history
                                          ↓
   Показываем все сессии + график + дельты

4. ОПЛАТА ОТЧЁТА
   Пользователь нажимает «Получить полный отчёт»
                                          ↓
   Mini App → POST /api/payment/create { session_id, provider }
                                          ↓
   Backend → создаём Payment → идём в API провайдера → получаем payment_url
                                          ↓
   Mini App → Telegram.WebApp.openLink(payment_url)
   (пользователь уходит платить)
                                          ↓
   Провайдер → POST /api/payment/webhook
                                          ↓
   Backend: Payment.status = succeeded → генерируем PDF → загружаем в Storage
                                          ↓
   Bot → send_document(telegram_id, pdf_url)
   (пользователь получает файл в чат)
                                          ↓
   Mini App поллит GET /api/payment/:id/status каждые 3 сек
   → когда report_ready = true → показывает «Отчёт отправлен в Telegram» ✓

5. ПОВТОРНАЯ ДИАГНОСТИКА
   «Обновить индекс» → повторяет шаги 2–3
   На вкладке «Прогресс» появляется новая запись
   Дельта рассчитывается по zone scores
```

---

## 8. Безопасность

| Угроза | Мера |
|---|---|
| Подделка данных от Mini App | HMAC-SHA256 валидация `initData` через `BOT_TOKEN` |
| Доступ к чужим данным | Все запросы проверяют `user_id` из JWT |
| Двойная оплата | `session_id` уникален в таблице Payment (`@unique`) |
| Повторный webhook | Проверка по `provider_payment_id` — идемпотентность |
| Перебор admin-пароля | Rate limit 5 попыток в минуту на `/admin/auth` |
| SQL-инъекции | Prisma ORM — параметризованные запросы |
| Утечка BOT_TOKEN | Только в переменных окружения, не в коде |
| Доступ к PDF без оплаты | URL в Supabase Storage — подписанный (expires в 1 час) |

---

## 9. Переменные окружения

```bash
# Telegram
BOT_TOKEN=                    # токен от @BotFather
MINI_APP_URL=                 # https://your-app.vercel.app/tg-app/

# База данных
DATABASE_URL=                 # postgresql://...@supabase...

# JWT
JWT_SECRET=                   # случайная строка 64+ символа

# Supabase Storage
SUPABASE_URL=
SUPABASE_SERVICE_KEY=         # service_role key (не anon!)
STORAGE_BUCKET=kaqs-reports

# Платежи (добавляются когда выбрана система)
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
WEBHOOK_SECRET=               # для верификации webhook от провайдера

# Внутренние
INTERNAL_SECRET=              # для вызовов между сервисами
ADMIN_EMAIL=                  # email первого администратора (для seed)
ADMIN_PASSWORD=               # пароль первого администратора (для seed)
NODE_ENV=production
```

---

## 10. Структура проекта (файлы бэкенда)

```
backend/
├── src/
│   ├── index.ts               # точка входа Fastify
│   ├── bot.ts                 # запуск Telegraf бота
│   │
│   ├── routes/
│   │   ├── auth.ts            # POST /api/auth/telegram
│   │   ├── diagnostic.ts      # GET/POST /api/diagnostic/*
│   │   ├── payment.ts         # POST /api/payment/*
│   │   ├── report.ts          # POST /api/report/generate/:id
│   │   └── admin/
│   │       ├── auth.ts        # POST /api/admin/login
│   │       ├── users.ts       # GET /api/admin/users
│   │       ├── payments.ts    # GET /api/admin/payments
│   │       ├── recommendations.ts  # GET/PUT /api/admin/recommendations
│   │       ├── stats.ts       # GET /api/admin/stats
│   │       └── export.ts      # GET /api/admin/export
│   │
│   ├── services/
│   │   ├── telegram-auth.ts   # HMAC валидация initData
│   │   ├── recommendations.ts # генерация рекомендаций из zone scores
│   │   ├── pdf-generator.ts   # создание PDF через PDFKit
│   │   ├── storage.ts         # загрузка в Supabase Storage
│   │   └── payment/
│   │       ├── index.ts       # общий интерфейс (стратегия)
│   │       └── yookassa.ts    # реализация под ЮКассу
│   │
│   ├── middleware/
│   │   ├── auth-user.ts       # проверка JWT пользователя
│   │   ├── auth-admin.ts      # проверка JWT администратора
│   │   └── rate-limit.ts      # ограничение запросов
│   │
│   └── prisma/
│       └── schema.prisma      # все модели из раздела 2
│
├── prisma/
│   └── migrations/            # авто-генерируются Prisma
│
├── scripts/
│   └── seed-admin.ts          # создать первого администратора
│
├── package.json
├── tsconfig.json
└── .env.example
```

---

## 11. Фазы разработки

### Фаза 1 — MVP (минимум для запуска)
1. Telegram auth (`/api/auth/telegram`)
2. Сохранение результата (`/api/diagnostic/complete`)
3. История (`/api/diagnostic/history`)
4. Bot: `/start` + обработка `web_app_data` + красивое сообщение

**Результат:** пользователи проходят диагностику, видят историю, бот присылает сообщение.

### Фаза 2 — Оплата и отчёт
5. Платёж (`/api/payment/create` + webhook)
6. Генерация PDF (`/api/report/generate`)
7. Отправка файла в бот
8. Поллинг статуса на фронтенде

**Результат:** работает полная воронка монетизации.

### Фаза 3 — Административная панель
9. Admin auth
10. Дашборд со статистикой
11. Список пользователей и сессий
12. Редактирование шаблонов рекомендаций
13. Экспорт CSV

**Результат:** можно управлять системой без базы данных напрямую.

---

## 12. Что НЕ входит в этот бэкенд

- Email-рассылки — не нужны, всё через Telegram
- Регистрация/логин через email — только Telegram
- Мультиязычность — только русский
- Редактирование вопросов через панель — вопросы статичны в коде фронтенда
- Микросервисная архитектура — один монолитный Node.js-сервис достаточен
- Очереди задач (Bull/Redis) — PDF генерируется синхронно, это ~2 сек, норм
