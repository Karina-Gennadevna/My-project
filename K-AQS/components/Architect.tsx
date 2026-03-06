import FadeUp from './FadeUp';

const sessionIncludes = [
  'Разбор вашего отчёта по всем блокам K-A-Q-S',
  'Ответы на вопросы по методологии и выводам',
  'Приоритизация Roadmap под вашу ситуацию',
  'Обсуждение критических рисков и первых шагов',
  'Рекомендации по AI-готовности и автоматизации',
];

export default function Architect() {
  return (
    <section id="architect" className="py-20 sm:py-28 arch-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: about */}
          <FadeUp>
            <div>
              <span className="badge-blue mb-5">Архитектурная сессия</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3 mb-5">
                Роль архитектора
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                K-AQS™ — диагностика, которую вы можете пройти самостоятельно. Но иногда нужен человек, который читает карту вместе с вами — и помогает расставить приоритеты.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                Архитектурная сессия — это не консалтинг. Это разбор вашего отчёта: что значат цифры, что делать первым, что можно автоматизировать уже сейчас.
              </p>

              {/* Signature */}
              <div className="flex items-start gap-4 p-5 rounded-2xl border border-white/[0.08] bg-gray-900/60">
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-lg font-black text-blue-500"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1.5px solid rgba(59,130,246,0.2)' }}
                >
                  К
                </div>
                <div>
                  <p className="font-semibold text-gray-100 text-sm">Карина</p>
                  <p className="text-xs text-blue-400 mt-0.5">Создатель системы K-AQS™</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Архитектор управляемого бизнеса. Специализация: операционная устойчивость и подготовка к масштабированию.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Right: session card */}
          <FadeUp delay={150}>
            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/[0.06] to-transparent p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="3" stroke="#3B82F6" strokeWidth="1.5" />
                    <path d="M6 9H12M6 6H12M6 12H9" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-100">Что входит в сессию</h3>
              </div>

              <ul className="space-y-3 mb-7">
                {sessionIncludes.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <span className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold text-blue-400">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/[0.06] pt-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Формат</p>
                  <p className="text-sm text-gray-300 font-medium">Zoom / Google Meet · 60 мин</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Когда</p>
                  <p className="text-sm text-gray-300 font-medium">После получения отчёта</p>
                </div>
              </div>

              <a href="#start" className="btn-primary mt-6 w-full justify-center">
                Записаться на диагностику
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
