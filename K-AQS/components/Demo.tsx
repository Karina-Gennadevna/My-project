'use client';

import { useState } from 'react';
import RadarChart from './RadarChart';
import RiskMap from './RiskMap';
import Modal from './Modal';
import ReportPreview from './ReportPreview';
import FadeUp from './FadeUp';

export default function Demo() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section id="demo" className="py-20 sm:py-28 arch-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <FadeUp>
          <div className="text-center mb-14">
            <span className="badge-blue mb-4">Демо</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mt-3">
              Как выглядит результат
            </h2>
            <p className="mt-3 text-gray-400 text-base max-w-xl mx-auto">
              Radar Chart с вашими показателями, карта рисков и письменный PDF-отчёт.
              Все данные ниже — демонстрационные.
            </p>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Radar chart */}
          <FadeUp delay={100}>
            <div className="rounded-2xl border border-white/[0.08] bg-gray-900/60 p-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-100">K-AQS™ Radar</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Профиль управляемости — пример</p>
                </div>
                <span className="badge-warn">Демо</span>
              </div>
              <RadarChart values={{ K: 62, A: 48, Q: 55, S: 40 }} size={280} />
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Общий индекс</span>
                  <span className="font-bold text-gray-100 tabular-nums">
                    52 <span className="text-gray-500 font-normal">/ 100</span>
                  </span>
                </div>
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: '52%',
                      background: 'linear-gradient(90deg, #F59E0B, #3B82F6)',
                    }}
                  />
                </div>
                <p className="text-xs text-amber-400 mt-2">
                  Нестабильно — требует структурных изменений
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Risk map */}
          <FadeUp delay={200}>
            <div className="rounded-2xl border border-white/[0.08] bg-gray-900/60 p-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-100">Карта рисков</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Вероятность × влияние — пример</p>
                </div>
                <span className="badge-warn">Демо</span>
              </div>
              <RiskMap />
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <div className="flex gap-4 text-xs">
                  {[
                    { color: '#4a1010', label: 'Критичный' },
                    { color: '#2d2010', label: 'Высокий' },
                    { color: '#1f2d10', label: 'Средний' },
                    { color: '#182a18', label: 'Низкий' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color, border: '1px solid rgba(255,255,255,0.1)' }} />
                      <span className="text-gray-500">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* PDF preview CTA */}
        <FadeUp delay={300}>
          <div className="text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl border border-white/[0.08] bg-gray-900/60">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 2H13L17 6V18H3V2H5" stroke="#3B82F6" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M7 9H13M7 12H11" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 2V7H17" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-100 text-sm">Пример PDF-отчёта</p>
                  <p className="text-xs text-gray-500">3 страницы · демонстрационные данные</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="btn-ghost text-sm py-2.5 px-5 whitespace-nowrap"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 5V11M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                Посмотреть пример отчёта
              </button>
            </div>
          </div>
        </FadeUp>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ReportPreview />
      </Modal>
    </section>
  );
}
