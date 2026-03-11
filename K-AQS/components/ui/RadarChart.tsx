'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface RadarData {
  K: number;
  A: number;
  Q: number;
  S: number;
}

interface RadarChartProps {
  data: RadarData;
  max?: number;   // default 100
  size?: number;  // default 300
  className?: string;
}

/* ─── Constants ──────────────────────────────────────────────────────────── */

const GRID = 5;

const AXES = [
  { key: 'K' as const, angle: -90 }, // top
  { key: 'A' as const, angle:   0 }, // right
  { key: 'Q' as const, angle:  90 }, // bottom
  { key: 'S' as const, angle: 180 }, // left
] as const;

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  return {
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg)),
  };
}

function buildPoints(cx: number, cy: number, r: number, data: RadarData, max: number) {
  return AXES
    .map(({ key, angle }) => {
      const norm = Math.min(data[key] / max, 1);
      const { x, y } = polar(cx, cy, r * norm, angle);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

function fmtValue(v: number, max: number) {
  return max > 10 ? String(Math.round(v)) : v.toFixed(1);
}

/* ─── Layers ─────────────────────────────────────────────────────────────── */

function GridLayer({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g aria-hidden>
      {Array.from({ length: GRID }, (_, i) => {
        const gr  = (r * (i + 1)) / GRID;
        const pts = AXES
          .map(({ angle }) => {
            const { x, y } = polar(cx, cy, gr, angle);
            return `${x.toFixed(2)},${y.toFixed(2)}`;
          })
          .join(' ');
        return (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke={i === GRID - 1 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}
            strokeWidth={0.75}
          />
        );
      })}

      {AXES.map(({ key, angle }) => {
        const { x, y } = polar(cx, cy, r, angle);
        return (
          <line
            key={key}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={0.75}
          />
        );
      })}
    </g>
  );
}

function DataLayer({
  cx, cy, r, data, max, animated,
}: {
  cx: number; cy: number; r: number;
  data: RadarData; max: number; animated: boolean;
}) {
  const empty: RadarData = { K: 0, A: 0, Q: 0, S: 0 };
  const current = animated ? data : empty;

  return (
    <g>
      <polygon
        points={buildPoints(cx, cy, r, current, max)}
        fill="rgba(249,115,22,0.09)"
        stroke="rgba(249,115,22,0.6)"
        strokeWidth={1.5}
        strokeLinejoin="round"
        style={{ transition: 'all 1000ms cubic-bezier(0.16,1,0.3,1)' }}
      />

      {AXES.map(({ key, angle }) => {
        const norm     = Math.min(current[key] / max, 1);
        const { x, y } = polar(cx, cy, r * norm, angle);
        return (
          <rect
            key={key}
            x={x - 3} y={y - 3}
            width={6}  height={6}
            fill="#F97316"
            opacity={animated ? 0.9 : 0}
            style={{ transition: 'all 1000ms cubic-bezier(0.16,1,0.3,1)' }}
          />
        );
      })}
    </g>
  );
}

function LabelLayer({
  cx, cy, r, data, max,
}: {
  cx: number; cy: number; r: number; data: RadarData; max: number;
}) {
  return (
    <g>
      {AXES.map(({ key, angle }) => {
        const { x, y } = polar(cx, cy, r + 24, angle);
        return (
          <text
            key={key}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(249,115,22,0.85)"
            fontSize={12}
            fontFamily="var(--font-mono), monospace"
            fontWeight={600}
          >
            {key}
          </text>
        );
      })}
    </g>
  );
}

/* ─── RadarChart ─────────────────────────────────────────────────────────── */

export function RadarChart({ data, max = 100, size = 300, className }: RadarChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(id);
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const r  = size * 0.34;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="auto"
      style={{ maxWidth: size }}
      role="img"
      aria-label="K-A-Q-S radar chart"
      className={cn('overflow-visible', className)}
    >
      <GridLayer  cx={cx} cy={cy} r={r} />
      <DataLayer  cx={cx} cy={cy} r={r} data={data} max={max} animated={animated} />
      <LabelLayer cx={cx} cy={cy} r={r} data={data} max={max} />

      {/* Crosshair center */}
      <line x1={cx - 4} y1={cy} x2={cx + 4} y2={cy} stroke="rgba(249,115,22,0.4)" strokeWidth={1} />
      <line x1={cx} y1={cy - 4} x2={cx} y2={cy + 4} stroke="rgba(249,115,22,0.4)" strokeWidth={1} />
    </svg>
  );
}
