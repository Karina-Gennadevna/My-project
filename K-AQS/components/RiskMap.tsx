// Risk matrix: 3×3 grid, Y=Probability (high→low), X=Impact (low→high)

const RISKS = [
  { id: 1, label: 'Ключевые люди', prob: 2, impact: 2 }, // high/high = critical
  { id: 2, label: 'Оперативный хаос', prob: 2, impact: 1 }, // high/med = high
  { id: 3, label: 'Финансовый разрыв', prob: 1, impact: 2 }, // med/high = high
  { id: 4, label: 'Провал автоматизации', prob: 2, impact: 0 }, // high/low = medium
  { id: 5, label: 'Нет преемника', prob: 0, impact: 2 }, // low/high = medium
  { id: 6, label: 'Сбой процессов', prob: 1, impact: 1 }, // med/med = medium
];

// Risk level per cell [prob_row_0=high][impact_col_0=low]
// prob_row: 0=high, 1=med, 2=low
// impact_col: 0=low, 1=med, 2=high
const CELL_COLORS = [
  ['#1e2f1a', '#2d3a0e', '#3d2010'], // high prob: low→medium, med→high, high→critical
  ['#182a18', '#262e0a', '#2d2010'], // med prob
  ['#131f13', '#1c2a0a', '#22280e'], // low prob
];

const CELL_LABELS = [
  ['Средний', 'Высокий', 'Критический'],
  ['Низкий', 'Средний', 'Высокий'],
  ['Минимальный', 'Низкий', 'Средний'],
];

const CELL_TEXT_COLORS = [
  ['#6EE7B7', '#FCD34D', '#FCA5A5'],
  ['#6EE7B7', '#FCD34D', '#FCA5A5'],
  ['#6EE7B7', '#6EE7B7', '#FCD34D'],
];

// SVG layout
const ML = 68; // margin left (y-axis labels)
const MT = 14; // margin top
const CELL_W = 74;
const CELL_H = 60;
const W = ML + CELL_W * 3 + 10;
const H = MT + CELL_H * 3 + 44; // +44 for x-axis labels

// Risk dot positions within cells (slight jitter to avoid overlap)
const dotOffsets: Record<number, [number, number]> = {
  1: [0, 0],
  2: [-6, -6],
  3: [6, 0],
  4: [0, 6],
  5: [-5, 5],
  6: [6, -6],
};

export default function RiskMap() {
  return (
    <div>
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-[310px] mx-auto"
        aria-label="Risk Map"
        role="img"
      >
        {/* Y-axis label */}
        <text
          x={10}
          y={MT + CELL_H * 1.5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#6B7280"
          fontSize={9}
          fontFamily="var(--font-inter),sans-serif"
          transform={`rotate(-90, 10, ${MT + CELL_H * 1.5})`}
        >
          ВЕРОЯТНОСТЬ
        </text>

        {/* Y-axis labels */}
        {['Высокая', 'Средняя', 'Низкая'].map((label, row) => (
          <text
            key={row}
            x={ML - 6}
            y={MT + CELL_H * row + CELL_H / 2}
            textAnchor="end"
            dominantBaseline="middle"
            fill="#6B7280"
            fontSize={9}
            fontFamily="var(--font-inter),sans-serif"
          >
            {label}
          </text>
        ))}

        {/* Cells */}
        {CELL_COLORS.map((rowColors, row) =>
          rowColors.map((color, col) => (
            <g key={`${row}-${col}`}>
              <rect
                x={ML + col * CELL_W}
                y={MT + row * CELL_H}
                width={CELL_W}
                height={CELL_H}
                fill={color}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
                rx={2}
              />
              <text
                x={ML + col * CELL_W + CELL_W / 2}
                y={MT + row * CELL_H + 10}
                textAnchor="middle"
                fill={CELL_TEXT_COLORS[row][col]}
                fontSize={7}
                fontFamily="var(--font-inter),sans-serif"
                opacity={0.6}
              >
                {CELL_LABELS[row][col]}
              </text>
            </g>
          )),
        )}

        {/* Risk dots */}
        {RISKS.map((risk) => {
          const col = risk.impact; // 0=low, 1=med, 2=high
          const row = 2 - risk.prob; // invert: prob 2=high → row 0
          const cellCx = ML + col * CELL_W + CELL_W / 2;
          const cellCy = MT + row * CELL_H + CELL_H / 2 + 4;
          const [dx, dy] = dotOffsets[risk.id] ?? [0, 0];
          const cx = cellCx + dx;
          const cy = cellCy + dy;

          return (
            <g key={risk.id}>
              <circle cx={cx} cy={cy} r={12} fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
              <text
                x={cx}
                y={cy}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#E5E7EB"
                fontSize={10}
                fontWeight={700}
                fontFamily="var(--font-inter),sans-serif"
              >
                {risk.id}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {['Низкое', 'Среднее', 'Высокое'].map((label, col) => (
          <text
            key={col}
            x={ML + col * CELL_W + CELL_W / 2}
            y={MT + CELL_H * 3 + 14}
            textAnchor="middle"
            fill="#6B7280"
            fontSize={9}
            fontFamily="var(--font-inter),sans-serif"
          >
            {label}
          </text>
        ))}

        {/* X-axis title */}
        <text
          x={ML + CELL_W * 1.5}
          y={MT + CELL_H * 3 + 30}
          textAnchor="middle"
          fill="#6B7280"
          fontSize={9}
          fontFamily="var(--font-inter),sans-serif"
        >
          ВЛИЯНИЕ
        </text>
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 max-w-[310px] mx-auto">
        {RISKS.map((r) => (
          <div key={r.id} className="flex items-center gap-2 text-xs">
            <span className="w-4 h-4 rounded-full bg-[#111827] border border-white/20 flex items-center justify-center text-[9px] font-bold text-gray-300 shrink-0">
              {r.id}
            </span>
            <span className="text-gray-500 truncate">{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
