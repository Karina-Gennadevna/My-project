import FadeUp from './FadeUp';

const riskBands = [
  { label: 'Минимальный', range: '< 5% оборота', color: '#10B981', width: 20 },
  { label: 'Умеренный', range: '5–15% оборота', color: '#F59E0B', width: 35 },
  { label: 'Высокий', range: '15–30% оборота', color: '#F97316', width: 55 },
  { label: 'Критический', range: '> 30% оборота', color: '#EF4444', width: 80 },
];

export default function FinancialRisk() {
  return (
    <section id="financial-risk" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="badge-blue mb-4">Финансовый риск</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3">
              Зона финансового риска
            </h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl mx-auto">
              По результатам диагностики вы видите, в какой зоне находится ваш бизнес —
              сколько денег в год может стоить операционный хаос.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Visual */}
          <FadeUp delay={100}>
            <div className="rounded-2xl border border-white/[0.08] bg-gray-900/60 p-7">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-5">
                Диапазон потерь (% от годового оборота)
              </p>
              <div className="space-y-4">
                {riskBands.map((band) => (
                  <div key={band.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium" style={{ color: band.color }}>
                        {band.label}
                      </span>
                      <span className="text-xs text-gray-500">{band.range}</span>
                    </div>
                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${band.width}%`, background: band.color, opacity: 0.75 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <span className="text-amber-400 font-semibold">Важно:</span> диапазон рассчитывается по
                  структуре бизнеса и обороту. Это оценка порядка потерь — не точная цифра.
                  Методика основана на международных операционных benchmarks.
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Text */}
          <FadeUp delay={200}>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2L18 6V10C18 14.4 14.4 18.3 10 19C5.6 18.3 2 14.4 2 10V6L10 2Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M10 8V11" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="10" cy="13.5" r="0.75" fill="#3B82F6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 mb-1">Что это значит</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Операционный хаос имеет прямую цену. Потери на переделку, простои, уход клиентов и сотрудников — это деньги, которые бизнес теряет прямо сейчас.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="#F59E0B" strokeWidth="1.5" />
                    <path d="M10 6V10L13 12" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 mb-1">Как считается</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    На основе ваших ответов о структуре бизнеса, обороте и выявленных зонах риска. Методика включает операционные, кадровые и финансовые риски.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10L8 14L16 6" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 mb-1">Зачем знать</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Диапазон помогает обосновать инвестиции в порядок. Когда видишь, что хаос стоит 15% оборота — решение упорядочиться принимается иначе.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
                <p className="text-xs text-amber-400/80 leading-relaxed">
                  <strong className="text-amber-400">Дисклеймер:</strong> финансовая оценка — расчётный диапазон на основе модели. Не является аудиторским заключением или финансовой консультацией.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
