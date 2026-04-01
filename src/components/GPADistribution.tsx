import type { College } from "../types";
import { parseNum } from "../utils/compare";

interface Props {
  college: College;
  studentGPA: number | null;
  studentName: string;
}

const BAR_COLOR = "#94a3b8";

const allBuckets: {
  key: keyof College;
  label: string;
  min: number;
  max: number;
}[] = [
  { key: "gpaDistBelow1",  label: "<1.0",      min: 0,    max: 1.0  },
  { key: "gpaDist200_249", label: "2.0–2.5",   min: 2.0,  max: 2.5  },
  { key: "gpaDist250_299", label: "2.5–3.0",   min: 2.5,  max: 3.0  },
  { key: "gpaDist300_324", label: "3.0–3.25",  min: 3.0,  max: 3.25 },
  { key: "gpaDist325_349", label: "3.25–3.5",  min: 3.25, max: 3.5  },
  { key: "gpaDist350_374", label: "3.5–3.75",  min: 3.5,  max: 3.75 },
  { key: "gpaDist375_399", label: "3.75–4.0",  min: 3.75, max: 4.0  },
  { key: "gpaDistAbove4",  label: "4.0+",      min: 4.0,  max: 5.0  },
];

export default function GPADistribution({ college, studentGPA, studentName }: Props) {
  const rows = allBuckets.map((b) => ({
    ...b,
    value: parseNum(college[b.key]),
  }));

  const hasAnyData = rows.some((r) => r.value != null);
  if (!hasAnyData) {
    if (studentGPA == null) return null;
    return (
      <div className="gpa-dist gpa-dist--empty">
        <span className="gpa-dist-student-gpa">{studentName ? `${studentName}'s` : "Your"} GPA: {studentGPA.toFixed(2)}</span>
        <span className="gpa-dist-no-data">This school does not provide GPA data</span>
      </div>
    );
  }

  const maxVal = Math.max(...rows.map((r) => r.value ?? 0), 1);

  // SVG layout — wide aspect ratio to fit ~800×200 rendered space
  const W = 400;
  const H = 110;
  const padLeft = 5;
  const padRight = 5;
  const padTop = 10;
  const padBottom = 28;
  const plotW = W - padLeft - padRight;
  const plotH = H - padTop - padBottom;

  const n = rows.length;
  const gap = 5;
  const barW = (plotW - gap * (n - 1)) / n;

  // Student GPA → x position
  let studentX: number | null = null;
  if (studentGPA != null) {
    for (let i = 0; i < allBuckets.length; i++) {
      const b = allBuckets[i];
      const isLast = i === allBuckets.length - 1;
      if (studentGPA >= b.min && (studentGPA < b.max || isLast)) {
        const frac =
          b.max > b.min
            ? Math.min((studentGPA - b.min) / (b.max - b.min), 1)
            : 0.5;
        studentX = padLeft + i * (barW + gap) + frac * barW;
        break;
      }
    }
    // GPA in 1.0–2.0 gap (between bucket 0 and bucket 1)
    if (studentX == null && studentGPA >= 1.0 && studentGPA < 2.0) {
      const frac = (studentGPA - 1.0) / 1.0;
      const x0 = padLeft + barW; // right edge of bucket 0
      const x1 = padLeft + 1 * (barW + gap); // left edge of bucket 1
      studentX = x0 + frac * (x1 - x0);
    }
  }

  return (
    <div className="gpa-dist">
      <span className="gpa-dist-title">Enrolled Student GPA Distribution</span>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Bars + value labels + x-axis labels */}
        {rows.map((row, i) => {
          const val = row.value ?? 0;
          const barH = maxVal > 0 ? (val / maxVal) * plotH : 0;
          const x = padLeft + i * (barW + gap);
          const y = padTop + plotH - barH;
          return (
            <g key={row.key}>
              {/* Bar */}
              <rect
                x={x}
                y={val > 0 ? y : padTop + plotH}
                width={barW}
                height={val > 0 ? barH : 0}
                fill={BAR_COLOR}
                rx={2}
                opacity={val > 0 ? 1 : 0.15}
              />
              {/* Value on top of bar */}
              {val > 0 && (
                <text
                  x={x + barW / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fontSize={6}
                  fontWeight={600}
                  fill="#383838"
                >
                  {val}%
                </text>
              )}
              {/* X-axis label */}
              <text
                x={x + barW / 2}
                y={padTop + plotH + 10}
                textAnchor="middle"
                fontSize={6}
                fill="#555"
                fontWeight={500}
              >
                {row.label}
              </text>
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1={padLeft}
          y1={padTop + plotH}
          x2={W - padRight}
          y2={padTop + plotH}
          stroke="#ccd0d8"
          strokeWidth={1}
        />

        {/* Student GPA dashed line */}
        {studentX != null && (() => {
          const label = studentName
            ? `${studentName}: ${studentGPA!.toFixed(2)}`
            : studentGPA!.toFixed(2);
          const pillH = 10;
          const pillY = padTop + plotH + 13;
          const pillCY = pillY + pillH / 2;
          const pillW = label.length * 4 + 8;
          return (
            <g>
              <defs>
                <filter id="gpa-glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Glow line behind */}
              <line
                x1={studentX}
                y1={padTop - 2}
                x2={studentX}
                y2={padTop + plotH}
                stroke="#ff3d00"
                strokeWidth={3}
                opacity={0.3}
              />
              {/* Main student line */}
              <line
                x1={studentX}
                y1={padTop - 2}
                x2={studentX}
                y2={padTop + plotH}
                stroke="#ff3d00"
                strokeWidth={1.8}
                filter="url(#gpa-glow)"
              />
              {/* Top diamond marker */}
              <polygon
                points={`${studentX},${padTop - 5} ${studentX + 3},${padTop - 2} ${studentX},${padTop + 1} ${studentX - 3},${padTop - 2}`}
                fill="#ff3d00"
              />
              {/* Pill background */}
              <rect
                x={studentX - pillW / 2}
                y={pillY}
                width={pillW}
                height={pillH}
                rx={3}
                fill="#ff3d00"
              />
              <text
                x={studentX}
                y={pillCY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={6}
                fontWeight={700}
                fill="#ffffff"
              >
                {label}
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}
