-- ============================================================
-- K-A-Q-S™ — Database Schema
-- PostgreSQL 15 / Supabase
-- Запускать одним блоком в SQL Editor
-- ============================================================


-- ============================================================
-- ТАБЛИЦА 1: users — пользователи Telegram
-- ============================================================
-- Как папка с карточками клиентов.
-- Каждый человек, открывший Mini App, получает одну карточку.
-- Идентифицируем по telegram_id — он уникальный и не меняется.

CREATE TABLE IF NOT EXISTS public.users (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id       BIGINT       NOT NULL UNIQUE,
  telegram_username VARCHAR(255),                         -- может быть NULL (не у всех есть @username)
  first_name        VARCHAR(255) NOT NULL,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_active_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()   -- обновляется при каждом входе
);

-- Индекс: ускоряет поиск пользователя по telegram_id при каждом входе
CREATE INDEX IF NOT EXISTS idx_users_telegram_id
  ON public.users (telegram_id);

COMMENT ON TABLE  public.users IS 'Пользователи, открывшие Mini App через Telegram';
COMMENT ON COLUMN public.users.telegram_id IS 'Уникальный ID из Telegram — не меняется никогда';


-- ============================================================
-- ТАБЛИЦА 2: recommendation_templates — шаблоны рекомендаций
-- ============================================================
-- Как шпаргалка с советами.
-- Для каждой из 5 зон хранится текст рекомендации.
-- Администратор может менять текст — старые диагностики не затронуты.

CREATE TABLE IF NOT EXISTS public.recommendation_templates (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id     VARCHAR(20)  NOT NULL
                CHECK (zone_id IN ('finance', 'marketing', 'team', 'ops', 'control')),
  version     INTEGER      NOT NULL DEFAULT 1,
  action      TEXT         NOT NULL,   -- основная рекомендация
  first_step  TEXT         NOT NULL,   -- конкретный первый шаг
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_by  VARCHAR(255)             -- email администратора, кто менял
);

-- Индекс: быстро найти активный шаблон для нужной зоны
CREATE INDEX IF NOT EXISTS idx_rec_templates_zone_active
  ON public.recommendation_templates (zone_id, is_active);

COMMENT ON TABLE  public.recommendation_templates IS 'Тексты рекомендаций по зонам — редактируются администратором';
COMMENT ON COLUMN public.recommendation_templates.version IS 'Версия увеличивается при каждом изменении текста';
COMMENT ON COLUMN public.recommendation_templates.is_active IS 'FALSE = архив, TRUE = используется сейчас';


-- ============================================================
-- ТАБЛИЦА 3: diagnostic_sessions — результаты диагностик
-- ============================================================
-- Как журнал замеров у врача.
-- Каждое прохождение — отдельная строка.
-- Храним только итоги (баллы), не сырые ответы.

CREATE TABLE IF NOT EXISTS public.diagnostic_sessions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL
                     REFERENCES public.users (id) ON DELETE CASCADE,
  completed_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Результаты: всё в диапазоне 0–100
  index_score      SMALLINT    NOT NULL CHECK (index_score      BETWEEN 0 AND 100),
  zone_finance     SMALLINT    NOT NULL CHECK (zone_finance     BETWEEN 0 AND 100),
  zone_marketing   SMALLINT    NOT NULL CHECK (zone_marketing   BETWEEN 0 AND 100),
  zone_team        SMALLINT    NOT NULL CHECK (zone_team        BETWEEN 0 AND 100),
  zone_ops         SMALLINT    NOT NULL CHECK (zone_ops         BETWEEN 0 AND 100),
  zone_control     SMALLINT    NOT NULL CHECK (zone_control     BETWEEN 0 AND 100),

  -- Снапшот рекомендаций: сохраняем текст в момент прохождения
  -- Даже если администратор потом поменяет шаблоны — эта сессия не изменится
  recommendations  JSONB       NOT NULL DEFAULT '{}',

  -- Платный отчёт
  report_purchased BOOLEAN     NOT NULL DEFAULT FALSE,
  report_pdf_url   TEXT,                -- ссылка на файл в Supabase Storage
  report_sent_at   TIMESTAMPTZ          -- когда бот отправил файл пользователю
);

-- Индексы: ускоряют загрузку истории пользователя
CREATE INDEX IF NOT EXISTS idx_sessions_user_id
  ON public.diagnostic_sessions (user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_user_completed
  ON public.diagnostic_sessions (user_id, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_sessions_completed_at
  ON public.diagnostic_sessions (completed_at DESC);  -- для статистики в админке

COMMENT ON TABLE  public.diagnostic_sessions IS 'Каждое завершённое прохождение диагностики';
COMMENT ON COLUMN public.diagnostic_sessions.index_score IS 'Общий индекс 0–100';
COMMENT ON COLUMN public.diagnostic_sessions.recommendations IS 'Снапшот JSON: top3 рекомендаций на момент прохождения';
COMMENT ON COLUMN public.diagnostic_sessions.report_purchased IS 'TRUE = пользователь оплатил и получил отчёт';


-- ============================================================
-- ТАБЛИЦА 4: payments — платежи за отчёты
-- ============================================================
-- Как кассовый журнал.
-- Каждый платёж привязан к конкретной диагностике.
-- session_id UNIQUE = за одну диагностику нельзя заплатить дважды.

CREATE TABLE IF NOT EXISTS public.payments (
  id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID         NOT NULL
                        REFERENCES public.users (id) ON DELETE RESTRICT,
  session_id          UUID         NOT NULL UNIQUE
                        REFERENCES public.diagnostic_sessions (id) ON DELETE RESTRICT,
  amount              INTEGER      NOT NULL CHECK (amount > 0),  -- в копейках: 790000 = 7 900 ₽
  currency            VARCHAR(3)   NOT NULL DEFAULT 'RUB',
  provider            VARCHAR(50)  NOT NULL
                        CHECK (provider IN ('yookassa', 'prodamus', 'telegram_stars')),
  provider_payment_id VARCHAR(255),                              -- ID в системе провайдера
  status              VARCHAR(20)  NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_payments_user_id
  ON public.payments (user_id);

CREATE INDEX IF NOT EXISTS idx_payments_status
  ON public.payments (status);

-- Частичный индекс: только строки где provider_payment_id заполнен
CREATE INDEX IF NOT EXISTS idx_payments_provider_id
  ON public.payments (provider_payment_id)
  WHERE provider_payment_id IS NOT NULL;

COMMENT ON TABLE  public.payments IS 'Платежи за полные PDF-отчёты';
COMMENT ON COLUMN public.payments.amount IS 'Сумма в копейках. 790000 = 7 900 рублей';
COMMENT ON COLUMN public.payments.provider_payment_id IS 'ID платежа на стороне ЮКассы / Prodamus';


-- ============================================================
-- ТАБЛИЦА 5: admins — администраторы панели
-- ============================================================
-- Как список сотрудников с ключами от склада.
-- Не связаны с пользователями Telegram — отдельные аккаунты.

CREATE TABLE IF NOT EXISTS public.admins (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,   -- bcrypt хэш, пароль в открытом виде не хранится
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

COMMENT ON TABLE  public.admins IS 'Администраторы веб-панели управления';
COMMENT ON COLUMN public.admins.password_hash IS 'bcrypt-хэш пароля. Оригинальный пароль нигде не хранится';


-- ============================================================
-- ТРИГГЕР: автообновление updated_at
-- ============================================================
-- Как часы на документе: каждый раз когда строка меняется,
-- поле updated_at автоматически ставит текущее время.

CREATE OR REPLACE FUNCTION public.fn_update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.fn_update_updated_at();

CREATE TRIGGER trg_rec_templates_updated_at
  BEFORE UPDATE ON public.recommendation_templates
  FOR EACH ROW EXECUTE FUNCTION public.fn_update_updated_at();


-- ============================================================
-- ROW LEVEL SECURITY (RLS) — защита таблиц
-- ============================================================
-- Supabase по умолчанию разрешает всем читать всё (если RLS выключен).
-- Включаем RLS — теперь данные закрыты для всех "снаружи".
-- Наш бэкенд использует service_role ключ — он RLS обходит автоматически.
-- Это значит: браузер и чужие запросы не получат ни байта данных.

ALTER TABLE public.users                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_sessions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_templates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins                    ENABLE ROW LEVEL SECURITY;

-- Явно запрещаем всё для анонимных и авторизованных пользователей Supabase
-- (наш бэкенд использует service_role — он эти политики не видит)
CREATE POLICY "deny_all_users"   ON public.users                    FOR ALL TO anon, authenticated USING (false);
CREATE POLICY "deny_all_sessions" ON public.diagnostic_sessions     FOR ALL TO anon, authenticated USING (false);
CREATE POLICY "deny_all_payments" ON public.payments                FOR ALL TO anon, authenticated USING (false);
CREATE POLICY "deny_all_recs"    ON public.recommendation_templates FOR ALL TO anon, authenticated USING (false);
CREATE POLICY "deny_all_admins"  ON public.admins                   FOR ALL TO anon, authenticated USING (false);


-- ============================================================
-- СТАРТОВЫЕ ДАННЫЕ: шаблоны рекомендаций
-- ============================================================
-- Начальные тексты рекомендаций для каждой из 5 зон.
-- Администратор сможет изменить их через панель управления.

INSERT INTO public.recommendation_templates
  (zone_id, version, action, first_step)
VALUES
  (
    'finance', 1,
    'Внедрить ежемесячный P&L-отчёт — знать прибыль, не только выручку',
    'Посчитать прибыль за прошлый месяц: выручка минус все расходы'
  ),
  (
    'marketing', 1,
    'Провести анализ источников клиентов за последние 6 месяцев',
    'Выписать все каналы откуда приходят клиенты и посчитать сколько от каждого'
  ),
  (
    'team', 1,
    'Прописать KPI для каждой роли: 2–3 метрики + еженедельный отчёт',
    'Выбрать одного сотрудника и прописать для него 2 метрики результата'
  ),
  (
    'ops', 1,
    'Описать стандартный цикл выполнения услуги или производства',
    'Записать шаги самого частого процесса — от заявки клиента до финального результата'
  ),
  (
    'control', 1,
    'Ввести еженедельный управленческий отчёт — 10 минут в пятницу',
    'В ближайшую пятницу записать три цифры: выручка, расходы, прибыль'
  );


-- ============================================================
-- ПРОВЕРОЧНЫЙ ЗАПРОС (запустить отдельно чтобы убедиться)
-- ============================================================
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;
