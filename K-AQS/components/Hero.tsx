'use client';

import { useState } from 'react';
import Modal from './Modal';
import ReportPreview from './ReportPreview';

const bullets = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="#3B82F6" strokeWidth="1.2" />
        <path d="M7 4V7L9 8.5" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: '15–20 минут · 24 вопроса',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 12L4 6L7 9L10 3L12 1" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    text: 'Индекс + карта рисков',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1.5" y="1.5" width="11" height="11" rx="2" stroke="#3B82F6" strokeWidth="1.2" />
        <path d="M4 7H10M4 9.5H7" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    text: 'Roadmap + зона финансового риска',
  },
];

export default function Hero() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center arch-grid overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.14) 0%, transparent 65%)',
          }}
        />
        {/* Architectural corner accents */}
        <div className="absolute top-24 left-8 w-16 h-16 border-l border-t border-blue-500/15" />
        <div className="absolute top-24 right-8 w-16 h-16 border-r border-t border-blue-500/15" />
        <div className="absolute bottom-16 left-8 w-16 h-16 border-l border-b border-blue-500/15" />
        <div className="absolute bottom-16 right-8 w-16 h-16 border-r border-b border-blue-500/15" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20 text-center">
        {/* Not for startups badge */}
        <div className="flex justify-center mb-6">
          <div className="badge-warn">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M5 1L9 8.5H1L5 1Z"
                fill="rgba(251,191,36,0.2)"
                stroke="#FCD34D"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            </svg>
            Не для стартапов без процессов
          </div>
        </div>

        {/* H1 */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-100 leading-[1.08] tracking-tight mb-6 max-w-4xl mx-auto">
          <span className="text-gradient">K-AQS™</span>
          <span className="block mt-1">— индекс управляемости</span>
          <span className="block">бизнеса</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Архитектурная диагностика операционной устойчивости: процессы, ответственность,
          контроль, риски — и готовность к автоматизации и AI.
        </p>

        {/* Bullets */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {bullets.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm text-gray-400 bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2"
            >
              {b.icon}
              {b.text}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
          <a href="#start" className="btn-primary py-3.5 px-7 text-sm sm:text-base">
            Пройти диагностику
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M9 4L13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <button
            onClick={() => setShowModal(true)}
            className="btn-ghost py-3.5 px-7 text-sm sm:text-base"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 2H10L13 5V14H3V2H4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <path d="M5 8H11M5 10.5H8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            Посмотреть пример отчёта
          </button>
        </div>

        {/* Signature */}
        <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
          <div className="h-px w-12 bg-white/10" />
          <span>
            Создатель системы K-AQS™ · Архитектор управляемого бизнеса
          </span>
          <div className="h-px w-12 bg-white/10" />
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-700">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4V16M6 12L10 16L14 12"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Mini K-AQS diagram */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block opacity-30 pointer-events-none select-none">
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Grid */}
          {[40, 80, 120].map((r) => (
            <polygon
              key={r}
              points={`80,${80 - r * 0.5} ${80 + r * 0.5},80 80,${80 + r * 0.5} ${80 - r * 0.5},80`}
              fill="none"
              stroke="rgba(59,130,246,0.2)"
              strokeWidth={0.7}
            />
          ))}
          {/* Axes */}
          <line x1="80" y1="20" x2="80" y2="140" stroke="rgba(59,130,246,0.15)" strokeWidth="0.7" />
          <line x1="20" y1="80" x2="140" y2="80" stroke="rgba(59,130,246,0.15)" strokeWidth="0.7" />
          {/* Data */}
          <polygon
            points="80,49 110,80 80,107 58,80"
            fill="rgba(59,130,246,0.1)"
            stroke="rgba(59,130,246,0.6)"
            strokeWidth="1.5"
          />
          {/* Labels */}
          {[['K', 80, 12], ['A', 148, 83], ['Q', 80, 152], ['S', 12, 83]].map(([l, x, y]) => (
            <text key={l} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="rgba(59,130,246,0.5)" fontSize="12" fontWeight="700" fontFamily="var(--font-inter),sans-serif">
              {l}
            </text>
          ))}
        </svg>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ReportPreview />
      </Modal>
    </section>
  );
}
