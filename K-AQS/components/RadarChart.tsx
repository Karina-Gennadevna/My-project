interface RadarValues {
  K: number;
  A: number;
  Q: number;
  S: number;
}

interface RadarChartProps {
  values?: RadarValues;
  size?: number;
}

const LABELS = [
  { key: 'K', name: 'Kontrol', desc: 'Контроль' },
  { key: 'A', name: 'Accountability', desc: 'Ответственность' },
  { key: 'Q', name: 'Quality', desc: 'Качество' },
  { key: 'S', name: 'Stability', desc: 'Устойчивость' },
];

// angles: K=top(-90°), A=right(0°), Q=bottom(90°), S=left(180°)
const ANGLES = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

export default function RadarChart({
  values = { K: 62, A: 48, Q: 55, S: 40 },
  size = 280,
}: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.35;

  const vals = [values.K, values.A, values.Q, values.S];

  // Data polygon points
  const dataPoints = vals.map((v, i) => {
    const r = (v / 100) * maxR;
    return {
      x: cx + r * Math.cos(ANGLES[i]),
      y: cy + r * Math.sin(ANGLES[i]),
    };
  });
  const polyStr = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Grid polygons at 25, 50, 75, 100%
  const gridPolys = [25, 50, 75, 100].map((pct) => {
    const r = (pct / 100) * maxR;
    return ANGLES.map((a) => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`).join(' ');
  });

  // Axis line endpoints
  const axisEnds = ANGLES.map((a) => ({
    x: (cx + maxR * Math.cos(a)).toFixed(1),
    y: (cy + maxR * Math.sin(a)).toFixed(1),
  }));

  // Label positions
  const labelR = maxR + 24;
  const labelPositions = ANGLES.map((a) => ({
    x: (cx + labelR * Math.cos(a)).toFixed(1),
    y: (cy + labelR * Math.sin(a)).toFixed(1),
  }));

  // Value label positions (just outside data point)
  const valueLabelPositions = vals.map((v, i) => {
    const r = (v / 100) * maxR + 14;
    return {
      x: (cx + r * Math.cos(ANGLES[i])).toFixed(1),
      y: (cy + r * Math.sin(ANGLES[i])).toFixed(1),
    };
  });

  return (
    <div>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[280px] mx-auto"
        aria-label="K-AQS Radar Chart"
        role="img"
      >
        {/* Grid polygons */}
        {gridPolys.map((pts, i) => (
          <polygon
            key={i}
            points={pts}
            fill="none"
            stroke={i === 3 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)'}
            strokeWidth={i === 3 ? 1.5 : 1}
          />
        ))}

        {/* Percentage labels on the 50% and 100% rings */}
        {[50, 100].map((pct) => {
          const r = (pct / 100) * maxR;
          return (
            <text
              key={pct}
              x={(cx + 4).toFixed(1)}
              y={(cy - r + 10).toFixed(1)}
              fill="rgba(156,163,175,0.5)"
              fontSize={9}
              fontFamily="var(--font-inter),sans-serif"
            >
              {pct}
            </text>
          );
        })}

        {/* Axis lines */}
        {axisEnds.map((ep, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={ep.x}
            y2={ep.y}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={1}
          />
        ))}

        {/* Data polygon fill */}
        <polygon
          points={polyStr}
          fill="rgba(59,130,246,0.13)"
          stroke="none"
        />

        {/* Data polygon stroke */}
        <polygon
          points={polyStr}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={2}
          strokeLinejoin="round"
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <g key={i}>
            <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={6} fill="rgba(59,130,246,0.2)" />
            <circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={3.5} fill="#3B82F6" />
          </g>
        ))}

        {/* Value labels */}
        {valueLabelPositions.map((pos, i) => (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#93C5FD"
            fontSize={10}
            fontWeight={700}
            fontFamily="var(--font-inter),sans-serif"
          >
            {vals[i]}
          </text>
        ))}

        {/* Axis labels (K, A, Q, S) */}
        {labelPositions.map((pos, i) => (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#E5E7EB"
            fontSize={15}
            fontWeight={700}
            fontFamily="var(--font-inter),sans-serif"
          >
            {LABELS[i].key}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-4 max-w-[280px] mx-auto">
        {LABELS.map((l, i) => (
          <div key={l.key} className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-blue-400">{l.key}</span>
              <span className="text-gray-500">{l.desc}</span>
            </div>
            <span className="font-semibold text-gray-300 tabular-nums">{vals[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
