import type { CSSProperties } from 'react';
import FadeUp from './FadeUp';

const items = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M11 7V11L14 13" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    number: '01',
    title: 'Индекс управляемости',
    desc: 'Числовая оценка от 0 до 100. Операционная зрелость бизнеса в одном показателе: насколько бизнес работает предсказуемо без вашего постоянного участия.',
    accent: '#3B82F6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="3" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M7 7H15M7 11H12M7 15H10" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="15" cy="14" r="2.5" fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth="1" />
      </svg>
    ),
    number: '02',
    title: 'Карта рисков',
    desc: 'Операционные, финансовые и кадровые риски с приоритизацией по вероятности и влиянию. Видите, что горит прямо сейчас, а что подождёт.',
    accent: '#3B82F6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 18V10L11 4L18 10V18" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round" />
        <rect x="8" y="13" width="6" height="5" rx="1" stroke="#3B82F6" strokeWidth="1.5" />
      </svg>
    ),
    number: '03',
    title: 'Roadmap 30/60/90',
    desc: 'Конкретные действия на ближайшие 3 месяца с приоритизацией. Не список рекомендаций — структурированный план с логикой очерёдности.',
    accent: '#3B82F6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 18L7 10L11 14L15 8L19 4" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 18H19" stroke="#6B7280" strokeWidth="1" strokeLinecap="round" />
      </svg>
    ),
    number: '04',
    title: 'Зона финансового риска',
    desc: 'Диапазон потенциальных потерь на основе вашего оборота и структуры бизнеса. Показывает порядок риска — не точную цифру, а масштаб проблемы.',
    accent: '#F59E0B',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3L13.5 8.5L19.5 9.3L15 13.5L16.5 19.5L11 16.5L5.5 19.5L7 13.5L2.5 9.3L8.5 8.5L11 3Z" stroke="#10B981" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    number: '05',
    title: 'Оценка AI-готовности',
    desc: 'Насколько ваш бизнес готов к автоматизации и AI-инструментам прямо сейчас. Что нужно исправить перед внедрением, чтобы оно прижилось.',
    accent: '#10B981',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M6 2H16L19 5V20H3V2H6" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 9H14M8 12H14M8 15H11" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    number: '06',
    title: 'Письменный отчёт (PDF)',
    desc: '15–20 страниц. Структурированный документ без воды: ваш индекс, расшифровка по блокам, приоритеты, риски, Roadmap. Готов для команды и инвесторов.',
    accent: '#3B82F6',
  },
];

export default function Deliverables() {
  return (
    <section id="deliverables" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="badge-blue mb-4">Результат</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3">
              Что вы получаете
            </h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl mx-auto">
              Не список рекомендаций. Структурированная диагностика с конкретными выводами и планом.
            </p>
          </div>
        </FadeUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <FadeUp key={i} delay={i * 60}>
              <div
                className="card-hover rounded-2xl border border-white/[0.08] bg-gray-900/60 p-6 h-full flex flex-col gap-4"
                style={{ '--accent': item.accent } as CSSProperties}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-gray-800 tabular-nums">{item.number}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
