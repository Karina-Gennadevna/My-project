'use client';

import { RadarChart, type RadarData } from '@/components/ui/RadarChart';
import { cn } from '@/lib/cn';

/* ─── Data ───────────────────────────────────────────────────────────────── */

const HERO_DATA: RadarData = { K: 62, A: 41, Q: 55, S: 38 };
const MAX = 100;
const INDEX = 49;

const AXIS_META: {
  key: keyof RadarData;
  label: string;
  critical?: boolean;
}[] = [
  { key: 'K', label: 'Knowledge Architecture' },
  { key: 'A', label: 'Automation Readiness', critical: true },
  { key: 'Q', label: 'Quality & Risk Control' },
  { key: 'S', label: 'Scalability', critical: true },
];

/* ─── ManageabilityCard ───────────────────────────────────────────────────── */

function ManageabilityCard() {
  return (
    <div
      className="rounded-xl px-5 py-4"
      style={{
        background: 'rgba(15,18,21,0.9)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Index score */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-mono text-4xl font-semibold leading-none" style={{ color: '#F97316' }}>
          {INDEX}
        </span>
        <span className="font-mono text-base text-soft">/ 100</span>
        <span
          className="ml-auto font-mono text-[10px] uppercase tracking-widest"
          style={{ color: 'rgba(255,255,255,0.28)' }}
        >
          Manageability Index
        </span>
      </div>

      {/* Axis bars */}
      <div className="flex flex-col gap-2.5">
        {AXIS_META.map(({ key, label, critical }) => {
          const value = HERO_DATA[key];
          const pct = (value / MAX) * 100;
          return (
            <div key={key} className="flex items-center gap-3">
              <span
                className={cn(
                  'font-mono text-[11px] font-semibold w-4 shrink-0 tabular-nums',
                  critical ? 'text-red-500' : 'text-accent',
                )}
              >
                {key}
              </span>

              <div className="flex-1 h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-700',
                    critical ? 'bg-red-500/70' : 'bg-accent/60',
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <span
                className={cn(
                  'font-mono text-[11px] tabular-nums shrink-0 w-6 text-right',
                  critical ? 'text-red-400' : 'text-soft',
                )}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Critical note */}
      <div
        className="mt-4 pt-3 flex items-center gap-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
        <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          A, S — требуют немедленного действия
        </span>
      </div>
    </div>
  );
}

/* ─── HeroRight ───────────────────────────────────────────────────────────── */

function HeroRight() {
  return (
    <div
      className="relative rounded-2xl p-4 sm:p-7"
      style={{
        background: 'rgba(13,15,18,0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 0 80px rgba(249,115,22,0.04), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
          K-A-Q-S™ Diagnostics
        </span>
        <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.18)' }}>
          Demo · 2026
        </span>
      </div>

      {/* Radar */}
      <div className="flex justify-center mb-5">
        <RadarChart data={HERO_DATA} max={MAX} size={240} />
      </div>

      {/* Card */}
      <ManageabilityCard />
    </div>
  );
}

/* ─── HeroLeft ────────────────────────────────────────────────────────────── */

function HeroLeft() {
  return (
    <div className="flex flex-col gap-8 max-w-xl">
      {/* Eyebrow */}
      <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'rgba(249,115,22,0.7)' }}>
        Платформа управляемости бизнеса
      </p>

      {/* Title + Subtitle */}
      <div className="flex flex-col gap-2">
        <h1
          className="font-sans text-slate-50 leading-none"
          style={{ fontSize: 'clamp(52px, 6vw, 80px)', fontWeight: 700, letterSpacing: '-0.04em' }}
        >
          K-A-Q-S
        </h1>
        <p
          className="font-sans leading-snug"
          style={{
            fontSize: 'clamp(20px, 2.4vw, 28px)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: '#6B7A8A',
          }}
        >
          Индекс управляемости бизнеса
        </p>
      </div>

      {/* Description */}
      <p className="text-soft leading-relaxed" style={{ fontSize: '17px', maxWidth: '440px' }}>
        Диагностируем операционную устойчивость компании по четырём осям.
        Выдаём конкретный план действий — без воды и презентаций.
      </p>

      {/* CTA */}
      <div className="flex flex-col gap-3">
        <div>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-2.5',
              'px-8 py-4 rounded-lg',
              'font-sans text-base font-semibold',
              'text-[#080A0C]',
              'transition-all duration-150',
            )}
            style={{
              background: '#F97316',
              boxShadow: '0 0 24px rgba(249,115,22,0.3)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#EA6C0A';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(249,115,22,0.45)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#F97316';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(249,115,22,0.3)';
            }}
          >
            Пройти диагностику
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Micro text */}
        <p className="font-mono text-[11px]" style={{ color: 'rgba(255,255,255,0.22)' }}>
          24 вопроса · 15 минут · карта рисков
        </p>
      </div>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */

export function Hero() {
  return (
    <section
      className="relative flex items-center"
      style={{ minHeight: 'calc(100vh - 64px)', paddingBlock: 'clamp(64px, 8vh, 120px)' }}
    >
      <div className="w-full max-w-[1280px] mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <HeroLeft />
          <HeroRight />
        </div>
      </div>
    </section>
  );
}
