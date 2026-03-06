// PDF mock pages — 3 SVG "paper" pages

const PAGE_W = 240;
const PAGE_H = 320;

function PageWrapper({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative rounded-md overflow-hidden shadow-2xl border border-white/10"
        style={{ width: PAGE_W, minHeight: PAGE_H, background: '#0f172a' }}
      >
        {children}
      </div>
      <p className="text-xs text-gray-500 text-center">{title}</p>
    </div>
  );
}

// ── Page 1: Index ──────────────────────────────────────────────────────────
function Page1() {
  const cx = PAGE_W / 2;
  const cy = 160;
  const maxR = 52;
  const angles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];
  const vals = [62, 48, 55, 40];

  const polyPts = vals
    .map((v, i) => {
      const r = (v / 100) * maxR;
      return `${(cx + r * Math.cos(angles[i])).toFixed(1)},${(cy + r * Math.sin(angles[i])).toFixed(1)}`;
    })
    .join(' ');

  const gridPts = [50, 100].map((pct) => {
    const r = (pct / 100) * maxR;
    return angles
      .map((a) => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
      .join(' ');
  });

  return (
    <PageWrapper title="Страница 1 — Индекс">
      <svg width={PAGE_W} height={PAGE_H} viewBox={`0 0 ${PAGE_W} ${PAGE_H}`}>
        {/* Header bar */}
        <rect width={PAGE_W} height={28} fill="#1e3a5f" />
        <text x={8} y={18} fill="#93C5FD" fontSize={8} fontWeight={700} fontFamily="var(--font-inter),sans-serif">
          K-AQS™ REPORT
        </text>
        <text x={PAGE_W - 8} y={18} textAnchor="end" fill="#60A5FA" fontSize={7} fontFamily="var(--font-inter),sans-serif">
          ПРИМЕР
        </text>

        {/* Company */}
        <text x={12} y={46} fill="#9CA3AF" fontSize={8} fontFamily="var(--font-inter),sans-serif">
          Компания: ООО «Пример»
        </text>
        <text x={12} y={58} fill="#6B7280" fontSize={7} fontFamily="var(--font-inter),sans-serif">
          Дата: Март 2025 · 18 чел.
        </text>

        {/* Divider */}
        <line x1={12} y1={66} x2={PAGE_W - 12} y2={66} stroke="rgba(255,255,255,0.07)" />

        {/* Section title */}
        <text x={12} y={80} fill="#6B7280" fontSize={7} fontWeight={600} fontFamily="var(--font-inter),sans-serif" letterSpacing="1">
          ИНДЕКС УПРАВЛЯЕМОСТИ
        </text>

        {/* Big number */}
        <text x={cx} y={116} textAnchor="middle" fill="#E5E7EB" fontSize={40} fontWeight={800} fontFamily="var(--font-inter),sans-serif">
          52
        </text>
        <text x={cx} y={130} textAnchor="middle" fill="#6B7280" fontSize={9} fontFamily="var(--font-inter),sans-serif">
          из 100
        </text>

        {/* Status badge */}
        <rect x={cx - 36} y={134} width={72} height={14} rx={7} fill="rgba(251,191,36,0.12)" />
        <text x={cx} y={144} textAnchor="middle" fill="#FCD34D" fontSize={7} fontWeight={600} fontFamily="var(--font-inter),sans-serif">
          Нестабильно
        </text>

        {/* Mini radar */}
        {gridPts.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.7} />
        ))}
        {angles.map((a, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={(cx + maxR * Math.cos(a)).toFixed(1)}
            y2={(cy + maxR * Math.sin(a)).toFixed(1)}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={0.7}
          />
        ))}
        <polygon points={polyPts} fill="rgba(59,130,246,0.15)" stroke="#3B82F6" strokeWidth={1.5} strokeLinejoin="round" />
        {vals.map((v, i) => {
          const r = (v / 100) * maxR;
          return (
            <circle
              key={i}
              cx={(cx + r * Math.cos(angles[i])).toFixed(1)}
              cy={(cy + r * Math.sin(angles[i])).toFixed(1)}
              r={2.5}
              fill="#3B82F6"
            />
          );
        })}

        {/* Axis labels */}
        {['K', 'A', 'Q', 'S'].map((l, i) => {
          const r = maxR + 12;
          return (
            <text
              key={l}
              x={(cx + r * Math.cos(angles[i])).toFixed(1)}
              y={(cy + r * Math.sin(angles[i])).toFixed(1)}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#9CA3AF"
              fontSize={8}
              fontWeight={700}
              fontFamily="var(--font-inter),sans-serif"
            >
              {l}
            </text>
          );
        })}

        {/* Bottom interpretation */}
        <line x1={12} y1={226} x2={PAGE_W - 12} y2={226} stroke="rgba(255,255,255,0.07)" />
        <text x={12} y={240} fill="#6B7280" fontSize={7} fontWeight={600} fontFamily="var(--font-inter),sans-serif">
          ИНТЕРПРЕТАЦИЯ
        </text>
        {[
          'Процессы частично описаны, но не',
          'соблюдаются. Высокая зависимость',
          'от ключевых сотрудников. Зона риска:',
          'финансы и кадры.',
        ].map((line, i) => (
          <text key={i} x={12} y={252 + i * 11} fill="#9CA3AF" fontSize={7} fontFamily="var(--font-inter),sans-serif">
            {line}
          </text>
        ))}

        {/* Watermark */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(59,130,246,0.04)"
          fontSize={36}
          fontWeight={800}
          transform={`rotate(-30, ${cx}, ${cy})`}
          fontFamily="var(--font-inter),sans-serif"
        >
          ПРИМЕР
        </text>
      </svg>
    </PageWrapper>
  );
}

// ── Page 2: Risk Map ───────────────────────────────────────────────────────
function Page2() {
  const cellColors = [
    ['#1e2f1a', '#2d3a0e', '#3d2010'],
    ['#182a18', '#262e0a', '#2d2010'],
    ['#131f13', '#1c2a0a', '#22280e'],
  ];
  const CELL_W = 52;
  const CELL_H = 36;
  const ML = 42;
  const MT = 88;

  const risks = [
    { id: 1, label: 'Ключевые люди', prob: 2, impact: 2 },
    { id: 2, label: 'Оперативный хаос', prob: 2, impact: 1 },
    { id: 3, label: 'Финансовый разрыв', prob: 1, impact: 2 },
    { id: 4, label: 'Провал AI', prob: 2, impact: 0 },
    { id: 5, label: 'Нет преемника', prob: 0, impact: 2 },
    { id: 6, label: 'Сбой процессов', prob: 1, impact: 1 },
  ];

  return (
    <PageWrapper title="Страница 2 — Риски">
      <svg width={PAGE_W} height={PAGE_H} viewBox={`0 0 ${PAGE_W} ${PAGE_H}`}>
        <rect width={PAGE_W} height={28} fill="#1e3a5f" />
        <text x={8} y={18} fill="#93C5FD" fontSize={8} fontWeight={700} fontFamily="var(--font-inter),sans-serif">
          K-AQS™ REPORT — RISK MAP
        </text>
        <text x={PAGE_W - 8} y={18} textAnchor="end" fill="#60A5FA" fontSize={7} fontFamily="var(--font-inter),sans-serif">
          ПРИМЕР
        </text>

        <text x={12} y={46} fill="#6B7280" fontSize={7} fontWeight={600} fontFamily="var(--font-inter),sans-serif" letterSpacing="1">
          КАРТА ОПЕРАЦИОННЫХ РИСКОВ
        </text>
        <text x={12} y={58} fill="#9CA3AF" fontSize={7} fontFamily="var(--font-inter),sans-serif">
          Матрица: Вероятность × Влияние
        </text>

        {/* Y labels */}
        {['В', 'С', 'Н'].map((l, row) => (
          <text
            key={row}
            x={ML - 6}
            y={MT + row * CELL_H + CELL_H / 2}
            textAnchor="end"
            dominantBaseline="middle"
            fill="#6B7280"
            fontSize={8}
            fontFamily="var(--font-inter),sans-serif"
          >
            {l}
          </text>
        ))}

        {/* Cells */}
        {cellColors.map((rowC, row) =>
          rowC.map((color, col) => (
            <rect
              key={`${row}-${col}`}
              x={ML + col * CELL_W}
              y={MT + row * CELL_H}
              width={CELL_W}
              height={CELL_H}
              fill={color}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={0.5}
            />
          )),
        )}

        {/* Risks dots */}
        {risks.map((r) => {
          const col = r.impact;
          const row = 2 - r.prob;
          const cx = ML + col * CELL_W + CELL_W / 2;
          const cy = MT + row * CELL_H + CELL_H / 2;
          return (
            <g key={r.id}>
              <circle cx={cx} cy={cy} r={9} fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.2)" strokeWidth={0.8} />
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#E5E7EB" fontSize={7} fontWeight={700} fontFamily="var(--font-inter),sans-serif">
                {r.id}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {['Низкое', 'Среднее', 'Высокое'].map((l, col) => (
          <text
            key={col}
            x={ML + col * CELL_W + CELL_W / 2}
            y={MT + CELL_H * 3 + 12}
            textAnchor="middle"
            fill="#6B7280"
            fontSize={7}
            fontFamily="var(--font-inter),sans-serif"
          >
            {l}
          </text>
        ))}
        <text x={ML + CELL_W * 1.5} y={MT + CELL_H * 3 + 22} textAnchor="middle" fill="#4B5563" fontSize={7} fontFamily="var(--font-inter),sans-serif">
          ВЛИЯНИЕ
        </text>

        {/* Legend */}
        <line x1={12} y1={222} x2={PAGE_W - 12} y2={222} stroke="rgba(255,255,255,0.07)" />
        {risks.map((r, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          return (
            <g key={r.id}>
              <circle cx={16 + col * 110} cy={233 + row * 14} r={5} fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.15)" strokeWidth={0.7} />
              <text x={22 + col * 110} y={233 + row * 14} dominantBaseline="middle" fill="#6B7280" fontSize={7} fontFamily="var(--font-inter),sans-serif">
                {r.id}. {r.label}
              </text>
            </g>
          );
        })}

        <text
          x={PAGE_W / 2}
          y={180}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(59,130,246,0.04)"
          fontSize={28}
          fontWeight={800}
          transform={`rotate(-30, ${PAGE_W / 2}, 180)`}
          fontFamily="var(--font-inter),sans-serif"
        >
          ПРИМЕР
        </text>
      </svg>
    </PageWrapper>
  );
}

// ── Page 3: Roadmap ────────────────────────────────────────────────────────
function Page3() {
  const periods = [
    {
      label: '30 дней',
      color: '#3B82F6',
      items: ['Аудит ролей и ответственности', 'Описать 3 ключевых процесса', 'Назначить метрики по отделам'],
    },
    {
      label: '60 дней',
      color: '#10B981',
      items: ['Внедрить систему задач', 'Автоматизировать отчётность', 'Провести ревью процессов'],
    },
    {
      label: '90 дней',
      color: '#8B5CF6',
      items: ['Пилот AI-инструментов', 'Оценка результатов', 'Подготовка к масштабированию'],
    },
  ];

  return (
    <PageWrapper title="Страница 3 — Roadmap">
      <svg width={PAGE_W} height={PAGE_H} viewBox={`0 0 ${PAGE_W} ${PAGE_H}`}>
        <rect width={PAGE_W} height={28} fill="#1e3a5f" />
        <text x={8} y={18} fill="#93C5FD" fontSize={8} fontWeight={700} fontFamily="var(--font-inter),sans-serif">
          K-AQS™ REPORT — ROADMAP
        </text>
        <text x={PAGE_W - 8} y={18} textAnchor="end" fill="#60A5FA" fontSize={7} fontFamily="var(--font-inter),sans-serif">
          ПРИМЕР
        </text>

        <text x={12} y={46} fill="#6B7280" fontSize={7} fontWeight={600} fontFamily="var(--font-inter),sans-serif" letterSpacing="1">
          ПЛАН 30 / 60 / 90 ДНЕЙ
        </text>

        {periods.map((p, pi) => {
          const x = 12 + pi * 76;
          const headerY = 62;
          return (
            <g key={p.label}>
              {/* Period header */}
              <rect x={x} y={headerY} width={70} height={16} rx={4} fill={`${p.color}22`} />
              <text x={x + 35} y={headerY + 11} textAnchor="middle" fill={p.color} fontSize={8} fontWeight={700} fontFamily="var(--font-inter),sans-serif">
                {p.label}
              </text>

              {/* Items */}
              {p.items.map((item, ii) => {
                const itemY = 88 + ii * 28;
                return (
                  <g key={ii}>
                    <rect x={x} y={itemY} width={70} height={24} rx={3} fill="rgba(255,255,255,0.03)" stroke={`${p.color}22`} strokeWidth={0.7} />
                    {/* Wrap text */}
                    {item.length > 18 ? (
                      <>
                        <text x={x + 4} y={itemY + 9} fill="#9CA3AF" fontSize={6.5} fontFamily="var(--font-inter),sans-serif">
                          {item.slice(0, 18)}
                        </text>
                        <text x={x + 4} y={itemY + 18} fill="#9CA3AF" fontSize={6.5} fontFamily="var(--font-inter),sans-serif">
                          {item.slice(18)}
                        </text>
                      </>
                    ) : (
                      <text x={x + 4} y={itemY + 14} fill="#9CA3AF" fontSize={6.5} fontFamily="var(--font-inter),sans-serif">
                        {item}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Connector dots */}
              {pi < 2 && (
                <line
                  x1={x + 70}
                  y1={headerY + 8}
                  x2={x + 76}
                  y2={headerY + 8}
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth={0.7}
                  strokeDasharray="2,2"
                />
              )}
            </g>
          );
        })}

        {/* Bottom note */}
        <line x1={12} y1={184} x2={PAGE_W - 12} y2={184} stroke="rgba(255,255,255,0.07)" />
        <text x={12} y={196} fill="#6B7280" fontSize={7} fontFamily="var(--font-inter),sans-serif">
          Приоритеты и сроки корректируются на сессии
        </text>
        <text x={12} y={207} fill="#6B7280" fontSize={7} fontFamily="var(--font-inter),sans-serif">
          с архитектором по итогам диагностики.
        </text>

        {/* AI readiness bar */}
        <text x={12} y={228} fill="#6B7280" fontSize={7} fontWeight={600} fontFamily="var(--font-inter),sans-serif" letterSpacing="0.5">
          AI-ГОТОВНОСТЬ
        </text>
        <rect x={12} y={233} width={PAGE_W - 24} height={7} rx={3.5} fill="rgba(255,255,255,0.06)" />
        <rect x={12} y={233} width={(PAGE_W - 24) * 0.41} height={7} rx={3.5} fill="#3B82F6" opacity={0.7} />
        <text x={PAGE_W - 12} y={248} textAnchor="end" fill="#60A5FA" fontSize={7} fontFamily="var(--font-inter),sans-serif">
          41% — Частичная готовность
        </text>

        <text
          x={PAGE_W / 2}
          y={260}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="rgba(59,130,246,0.04)"
          fontSize={28}
          fontWeight={800}
          transform={`rotate(-30, ${PAGE_W / 2}, 260)`}
          fontFamily="var(--font-inter),sans-serif"
        >
          ПРИМЕР
        </text>
      </svg>
    </PageWrapper>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ReportPreview() {
  return (
    <div className="p-4 sm:p-6 max-h-[80vh] overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-100 mb-1">Пример отчёта K-AQS™</h2>
      <p className="text-sm text-gray-500 mb-6">
        Это демонстрационный отчёт. Реальный отчёт формируется по вашим ответам.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 justify-center items-start overflow-x-auto pb-2">
        <Page1 />
        <Page2 />
        <Page3 />
      </div>

      <p className="text-xs text-gray-600 text-center mt-6">
        Итоговый PDF — 15–20 страниц. Данные выше — демонстрационные.
      </p>
    </div>
  );
}
