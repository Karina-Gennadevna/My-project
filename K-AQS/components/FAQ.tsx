'use client';

import { useState } from 'react';
import FadeUp from './FadeUp';

const faqs = [
  {
    q: 'Сколько времени занимает диагностика?',
    a: '15–20 минут. 24 вопроса о том, как устроен ваш бизнес. Никаких сложных терминов или финансовых данных — только честные ответы о том, как есть.',
  },
  {
    q: 'Что значит индекс управляемости?',
    a: 'Число от 0 до 100, показывающее, насколько ваш бизнес работает предсказуемо без вашего постоянного участия. До 40 — хаос, 40–65 — нестабильно, 65–80 — управляемо, выше 80 — системно выстроенный бизнес.',
  },
  {
    q: 'Это замена консалтингу?',
    a: 'Нет. K-AQS™ — диагностика перед консалтингом. Как анализ крови до лечения. Вы получаете точную картину проблем и приоритеты — и уже потом решаете, нужна ли внешняя помощь и в чём конкретно.',
  },
  {
    q: 'Насколько точна финансовая оценка рисков?',
    a: 'Это диапазон, не точная цифра. Модель основана на вашем обороте и структуре бизнеса. Показывает порядок потенциальных потерь — не бухгалтерский расчёт, а архитектурная оценка масштаба риска.',
  },
  {
    q: 'Кому не подходит K-AQS™?',
    a: 'Стартапам без команды и процессов — диагностировать нечего. Тем, кто ищет мотивацию или подтверждение своей правоты. Тем, кто не готов к честному ответу на вопрос "что не так в бизнесе".',
  },
  {
    q: 'Что происходит после получения отчёта?',
    a: 'Вы получаете письменный PDF с индексом, картой рисков и Roadmap. По желанию — архитектурная сессия с разбором отчёта и приоритизацией шагов. Никакого навязанного продолжения.',
  },
  {
    q: 'Мои данные в безопасности?',
    a: 'Данные не передаются третьим лицам и не используются в других целях. Вопросы касаются структуры и процессов — не финансовой отчётности и не персональных данных сотрудников.',
  },
  {
    q: 'Как скоро я получу отчёт?',
    a: 'В течение 3–5 рабочих дней после заполнения опросника. Если нужно быстрее — напишите при заявке, обсудим возможности.',
  },
];

function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/[0.07]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-200 group-hover:text-gray-100 transition-colors text-sm sm:text-base">
          {q}
        </span>
        <span
          className="w-6 h-6 rounded-md bg-white/[0.05] flex items-center justify-center text-gray-400 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all duration-200 shrink-0"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2V10M2 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <div className={`accordion-body${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
        <div className="accordion-inner">
          <p className="text-sm text-gray-400 leading-relaxed pb-5">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="badge-blue mb-4">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3">
              Частые вопросы
            </h2>
          </div>
        </FadeUp>

        <FadeUp delay={100}>
          <div className="max-w-3xl mx-auto rounded-2xl border border-white/[0.08] bg-gray-900/60 px-6 sm:px-8 divide-y-0">
            {faqs.map((item, i) => (
              <AccordionItem
                key={i}
                q={item.q}
                a={item.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
