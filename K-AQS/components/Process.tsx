import FadeUp from './FadeUp';

const steps = [
  {
    num: '01',
    title: 'Заявка',
    desc: 'Заполняете форму: контакт, роль, размер команды. Без лишних вопросов.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 2H14L16 4V16H2V4L4 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M6 8H12M6 11H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Доступ к опроснику',
    desc: 'Ссылка на диагностику приходит в течение 24 часов на email или Telegram.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 7L9 11L16 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Диагностика',
    desc: '24 вопроса, 15–20 минут. Без бизнес-жаргона, без правильных и неправильных ответов.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 5V9L12 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Анализ',
    desc: 'Система рассчитывает индексы K/A/Q/S, строит карту рисков, определяет зоны.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 15L6 9L9 12L12 6L15 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Отчёт',
    desc: 'Письменный PDF-отчёт (15–20 стр.) готов в течение 3–5 рабочих дней.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M5 2H13L16 5V16H2V2H5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M6 9H12M6 12H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M9 2V6H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Сессия',
    desc: 'По желанию: архитектурная сессия с разбором отчёта, приоритетами и следующими шагами.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="3" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="9" cy="8.5" r="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 14.5C5.5 12.5 7 11.5 9 11.5C11 11.5 12.5 12.5 13 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Process() {
  return (
    <section id="process" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="badge-blue mb-4">Как это работает</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3">
              Процесс: 6 шагов
            </h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl mx-auto">
              От заявки до отчёта — прозрачный процесс без неожиданностей.
            </p>
          </div>
        </FadeUp>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block">
          <div className="grid grid-cols-6 gap-3 mb-8">
            {steps.map((step, i) => (
              <FadeUp key={step.num} delay={i * 70}>
                <div className="flex flex-col items-center text-center">
                  {/* Step circle */}
                  <div className="relative mb-4">
                    <div className="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                      {step.icon}
                    </div>
                    {/* Connector line */}
                    {i < steps.length - 1 && (
                      <div className="absolute top-5 left-11 w-[calc(100%+12px)] h-px bg-gradient-to-r from-blue-500/30 to-blue-500/05" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-blue-500 mb-1">{step.num}</span>
                  <h3 className="text-sm font-semibold text-gray-100 mb-1.5 leading-tight">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden space-y-4">
          {steps.map((step, i) => (
            <FadeUp key={step.num} delay={i * 50}>
              <div className="relative flex gap-4 items-start">
                {/* Vertical line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-[21px] top-11 w-px h-[calc(100%-20px)] bg-gradient-to-b from-blue-500/30 to-transparent" />
                )}
                <div className="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0 z-10">
                  {step.icon}
                </div>
                <div className="pt-1 pb-4">
                  <span className="text-xs font-bold text-blue-500">{step.num}</span>
                  <h3 className="font-semibold text-gray-100 text-sm mt-0.5 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
