# DEPLOYMENT.md
## K-A-Q-S™ — Инструкция по деплою

> Для новичка. Читай по порядку, не перепрыгивай шаги.

---

## Как устроена система (1 минута)

```
Пользователь в Telegram
        ↓
   Telegram Mini App             ← файл tg-app/index.html, хостинг: GitHub Pages / Vercel
        ↓ API-запросы
   Бэкенд (Node.js сервер)       ← папка backend/, хостинг: Railway
        ↓
   База данных (PostgreSQL)      ← Supabase (уже настроена)
        ↓
   Telegram Bot (long polling)   ← запускается внутри сервера Railway
```

Итого нужно задеплоить 2 вещи: **бэкенд на Railway** и **Mini App на GitHub Pages**.

---

## Часть 1 — Бэкенд на Railway

### Шаг 1.1 — Подготовь GitHub-репозиторий

Бэкенд живёт в папке `K-AQS/backend/`. Railway будет деплоить именно её.

Убедись, что код запушен на GitHub:

```bash
cd e:/Вайбкодинг/K-AQS
git add backend/
git commit -m "Add backend"
git push
```

> Репозиторий: `github.com/Karina-Gennadevna/My-project`

---

### Шаг 1.2 — Создай проект на Railway

1. Открой **railway.app** → войди через GitHub
2. Нажми **"New Project"** → **"Deploy from GitHub repo"**
3. Выбери репозиторий `My-project`
4. Railway спросит какую папку деплоить — укажи **`K-AQS/backend`**

   Если не спросит — после создания зайди в настройки:
   **Settings → Source → Root Directory** → введи `K-AQS/backend`

5. Подожди — Railway запустит сборку (`npm run build`) и деплой

---

### Шаг 1.3 — Добавь переменные окружения

В Railway Dashboard → твой проект → вкладка **"Variables"** → нажми **"Add Variable"** и добавь по одной:

| Переменная | Значение |
|---|---|
| `BOT_TOKEN` | `8708318524:AAGMVTObNma02upXAlhrdtlqAzxxS2dvvWs` |
| `DATABASE_URL` | `postgresql://postgres.ahdxqfqbehsrdgwfpuuh:Ruy7OHpJXu5WLd2u@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `JWT_SECRET` | `k8Xp2mN9qR4vL7wT1yA6sD3fG0hJ5uI8eO2cB4nM7zQ1xW9` |
| `NODE_ENV` | `production` |
| `MINI_APP_URL` | *(заполнишь после Части 2)* |

После добавления всех переменных Railway автоматически перезапустит сервер.

> ⚠️ **Никогда не пушь файл `.env` на GitHub.** Он уже добавлен в `.gitignore`.

---

### Шаг 1.4 — Получи URL сервера

После успешного деплоя Railway выдаст тебе URL:

**Settings → Networking → "Generate Domain"** → нажми кнопку

URL будет выглядеть как: `https://k-aqs-backend-xxxx.up.railway.app`

**Проверь, что сервер работает** — открой в браузере:
```
https://k-aqs-backend-xxxx.up.railway.app/health
```

Должен ответить:
```json
{"status":"ok","timestamp":"2026-03-12T..."}
```

Скопируй этот URL — он нужен для следующего шага.

---

### Шаг 1.5 — Обнови API_URL в Mini App

Открой `tg-app/index.html` и найди строку (примерно строка 924):

```js
const API_URL = 'https://k-aqs-backend.up.railway.app';
```

Замени на твой реальный URL с Railway:

```js
const API_URL = 'https://k-aqs-backend-xxxx.up.railway.app';
```

---

## Часть 2 — Mini App на GitHub Pages

Mini App — это один HTML-файл (`tg-app/index.html`). Самый простой хостинг — GitHub Pages, он бесплатный и не требует регистрации.

### Шаг 2.1 — Включи GitHub Pages

1. Открой `github.com/Karina-Gennadevna/My-project`
2. Вкладка **"Settings"** → слева **"Pages"**
3. **Source** → выбери **"Deploy from a branch"**
4. **Branch** → `main`, папка → `/ (root)`
5. Нажми **"Save"**

Через 1–2 минуты GitHub создаст URL вида:
```
https://karina-gennadevna.github.io/My-project/K-AQS/tg-app/
```

> Это и будет твой `MINI_APP_URL`.

---

### Шаг 2.2 — Вернись и заполни MINI_APP_URL

1. В Railway Dashboard → Variables → добавь:
   ```
   MINI_APP_URL = https://karina-gennadevna.github.io/My-project/K-AQS/tg-app/
   ```

2. В файле `tg-app/index.html` найди строку (примерно строка 1701):
   ```js
   const APP_URL = 'https://mini-app-sandy-eight.vercel.app/';
   ```
   Замени на свой новый URL.

3. Запушь изменения:
   ```bash
   git add tg-app/index.html
   git commit -m "Update APP_URL and API_URL"
   git push
   ```

---

## Часть 3 — Подключи Mini App к Telegram-боту

### Шаг 3.1 — Зарегистрируй Mini App у BotFather

1. Открой Telegram → найди **@BotFather**
2. Отправь `/newapp`
3. Выбери своего бота (тот, чей токен в `BOT_TOKEN`)
4. Дай название и короткое имя (например `kaqs`)
5. Ссылка на сайт — вставь `MINI_APP_URL` из шага 2.1

После этого у тебя появится ссылка вида:
```
https://t.me/ИмяТвоегоБота/kaqs
```

Это прямая ссылка на Mini App — её можно отправлять клиентам.

---

### Шаг 3.2 — Добавь кнопку меню бота

В BotFather:
1. `/mybots` → выбери бота → **"Bot Settings"** → **"Menu Button"**
2. Введи текст кнопки: `Открыть диагностику`
3. Введи URL: твой `MINI_APP_URL`

Теперь у бота будет синяя кнопка меню внизу чата.

---

## Проверка — всё работает?

После деплоя пройди по чеклисту:

- [ ] `https://твой-railway-url/health` отвечает `{"status":"ok"}`
- [ ] Mini App открывается в браузере по GitHub Pages URL
- [ ] В Telegram: `/start` боту → он отвечает с кнопкой
- [ ] Нажимаешь кнопку → открывается Mini App
- [ ] Проходишь диагностику → бот присылает результат в чат
- [ ] Вкладка «Прогресс» в Mini App показывает историю

---

## Обновление кода

Когда вносишь изменения — просто пушишь на GitHub:

```bash
git add .
git commit -m "описание изменений"
git push
```

- **GitHub Pages** обновится автоматически через ~1–2 минуты
- **Railway** пересоберёт и перезапустит сервер автоматически через ~2–3 минуты

Следить за деплоем можно в Railway Dashboard → вкладка **"Deployments"**.

---

## Если что-то сломалось

**Сервер не отвечает:**
- Railway Dashboard → **"Deployments"** → открой последний → смотри логи

**Бот не отвечает:**
- Проверь что `BOT_TOKEN` в Variables Railway совпадает с токеном от BotFather
- Убедись что запущен только один процесс с этим токеном (Railway уже это гарантирует)

**Mini App не открывается:**
- Проверь что GitHub Pages включён и файл `tg-app/index.html` доступен по прямой ссылке в браузере

**История не сохраняется:**
- Проверь логи Railway — ищи ошибки про `DATABASE_URL`
- Убедись что переменная `DATABASE_URL` в Railway содержит `?pgbouncer=true` в конце

---

## Переменные окружения — полный список

| Переменная | Где берётся | Что делает |
|---|---|---|
| `BOT_TOKEN` | BotFather → `/token` | Токен Telegram-бота |
| `DATABASE_URL` | Supabase → Settings → Database → Connection Pooler | Подключение к базе |
| `JWT_SECRET` | Придумать (длинная строка) | Подписывает токены авторизации |
| `NODE_ENV` | Всегда `production` на сервере | Режим работы |
| `MINI_APP_URL` | URL GitHub Pages / Vercel | Ссылка в кнопках бота |

---

## Стоимость

| Сервис | Тариф | Стоимость |
|---|---|---|
| **Supabase** | Free | 0 ₽/мес (до 500 МБ БД) |
| **Railway** | Hobby | ~500 ₽/мес (5$ + трафик) |
| **GitHub Pages** | Free | 0 ₽/мес |
| **Итого** | | ~500 ₽/мес |

> Railway Hobby — минимальный платный план. Бесплатный Trial даёт $5 кредитов (≈ 1 месяц бесплатно).
