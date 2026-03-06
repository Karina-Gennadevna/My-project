import FadeUp from './FadeUp';

const blocks = [
  {
    key: 'K',
    full: 'Kontrol',
    label: 'Контроль',
    desc: 'Есть ли управляемая операционная система? Или бизнес держится на ручном управлении и личном контроле?',
    points: [
      'Процессы задокументированы и соблюдаются',
      'Метрики отслеживаются регулярно',
      'Отчётность работает без напоминаний',
      'Исполнение предсказуемо и воспроизводимо',
    ],
    color: '#3B82F6',
    bgColor: 'rgba(59,130,246,0.06)',
  },
  {
    key: 'A',
    full: 'Accountability',
    label: 'Ответственность',
    desc: 'Каждая зона бизнеса имеет чёткого ответственного? Или всё решает владелец, потому что "больше некому"?',
    points: [
      'Роли чётко разделены без "серых зон"',
      'Каждый знает зону своей ответственности',
      'Решения принимаются на правильном уровне',
      'Делегирование работает без потери качества',
    ],
    color: '#8B5CF6',
    bgColor: 'rgba(139,92,246,0.06)',
  },
  {
    key: 'Q',
    full: 'Quality',
    label: 'Качество',
    desc: 'Результат предсказуем и воспроизводим? Или каждый раз — как повезёт, в зависимости от того, кто делал?',
    points: [
      'Есть стандарты качества и они применяются',
      'Процессы работают без ежедневного контроля',
      'Ошибки выявляются системно, не случайно',
      'Клиентский опыт стабилен и управляем',
    ],
    color: '#10B981',
    bgColor: 'rgba(16,185,129,0.06)',
  },
  {
    key: 'S',
    full: 'Stability',
    label: 'Устойчивость',
    desc: 'Бизнес выдержит уход ключевого человека, кризис или рост в 3 раза? Или при любом изменении — коллапс?',
    points: [
      'Нет критической зависимости от одного человека',
      'Есть финансовые и операционные резервы',
      'Рост не требует пропорционального найма',
      'Готовность к автоматизации и AI-инструментам',
    ],
    color: '#F59E0B',
    bgColor: 'rgba(245,158,11,0.06)',
  },
];

export default function Methodology() {
  return (
    <section id="methodology" className="py-20 sm:py-28 arch-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="badge-blue mb-4">Методология</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3">
              Система K-A-Q-S™
            </h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl mx-auto">
              Четыре измерения управляемости. Каждый блок — отдельный индекс. Вместе — полная картина операционного здоровья бизнеса.
            </p>
          </div>
        </FadeUp>

        <div className="grid sm:grid-cols-2 gap-4">
          {blocks.map((b, i) => (
            <FadeUp key={b.key} delay={i * 80}>
              <div
                className="card-hover rounded-2xl border border-white/[0.08] p-7 h-full"
                style={{ background: `linear-gradient(135deg, ${b.bgColor}, rgba(17,24,39,0.6))` }}
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black"
                    style={{ background: `${b.color}18`, color: b.color, border: `1.5px solid ${b.color}30` }}
                  >
                    {b.key}
                  </div>
                  <div>
                    <div className="text-xs font-semibold tracking-wider uppercase" style={{ color: b.color }}>
                      {b.full}
                    </div>
                    <div className="font-bold text-gray-100">{b.label}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed mb-5">{b.desc}</p>

                {/* Points */}
                <ul className="space-y-2.5">
                  {b.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                        style={{ background: b.color }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
