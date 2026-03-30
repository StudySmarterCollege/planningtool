import { parseNum } from "../utils/compare";

interface Props {
  acceptanceRate: string;
}

export default function AcceptanceRing({ acceptanceRate }: Props) {
  const raw = parseNum(acceptanceRate);
  if (raw == null) return null;

  // Parse "45%" or "45" → 45
  const pct = raw > 1 ? raw : raw * 100;

  const radius = 50;
  const stroke = 10;
  const center = radius + stroke / 2;
  const size = center * 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (pct / 100) * circumference;

  return (
    <div className="acceptance-ring">
      <span className="acceptance-ring-title">Acceptance Rate</span>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        className="acceptance-ring-svg"
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#eef0f4"
          strokeWidth={stroke}
        />
        {/* Filled arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#38547B"
          strokeWidth={stroke}
          strokeDasharray={`${filled} ${circumference - filled}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          transform={`rotate(0 ${center} ${center})`}
        />
        {/* Center text */}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={18}
          fontWeight={700}
          fill="#38547B"
        >
          {pct.toFixed(1)}%
        </text>
        <text
          x={center}
          y={center + 14}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={9}
          fill="#777"
        >
          admitted
        </text>
      </svg>
    </div>
  );
}
