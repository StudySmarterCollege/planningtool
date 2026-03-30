interface Segment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: Segment[];
}

export default function DonutChart({ segments }: Props) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return null;

  const radius = 52;
  const stroke = 20;
  const center = radius + stroke / 2;
  const circumference = 2 * Math.PI * radius;
  const size = center * 2;

  // Build arcs — only render segments >= 1% on the donut
  let offset = 0;
  const arcs = segments
    .filter((s) => (s.value / total) * 100 >= 1)
    .map((s) => {
      const pct = s.value / total;
      const dash = pct * circumference;
      const arc = { ...s, dash, offset, pct };
      offset += dash;
      return arc;
    });

  return (
    <div className="donut-chart">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="donut-chart-svg"
      >
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={stroke}
            strokeDasharray={`${arc.dash} ${circumference - arc.dash}`}
            strokeDashoffset={-arc.offset}
            transform={`rotate(-90 ${center} ${center})`}
          />
        ))}
      </svg>
      <div className="donut-legend">
        {segments.map((s) => {
          const pct = ((s.value / total) * 100).toFixed(1);
          return (
            <div key={s.label} className="donut-legend-item">
              <span
                className="donut-legend-dot"
                style={{ backgroundColor: s.color }}
              />
              <span className="donut-legend-label">{s.label}</span>
              <span className="donut-legend-value">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
