import type { CompareStatus } from "../types";

interface Props {
  label: string;
  studentVal: number | null;
  p25: number | null;
  p50: number | null;
  p75: number | null;
  scaleMin: number;
  scaleMax: number;
  status: CompareStatus;
  formatVal?: (n: number) => string;
}

function pct(val: number, min: number, max: number): number {
  if (max === min) return 50;
  return ((val - min) / (max - min)) * 100;
}

const statusColors: Record<CompareStatus, string> = {
  green: "#22c55e",
  yellow: "#eab308",
  red: "#ef4444",
  gray: "#aaa",
};

export default function RangeBar({
  label,
  studentVal,
  p25,
  p50,
  p75,
  scaleMin,
  scaleMax,
  status,
  formatVal = String,
}: Props) {
  const hasRange = p25 != null && p75 != null;
  const p75Pct = p75 != null ? pct(p75, scaleMin, scaleMax) : 0;
  const hideMax = hasRange && p75Pct > 85;

  return (
    <div className="range-bar-row">
      <div className="range-bar-label">{label}</div>
      <div className="range-bar-track">
        {/* Scale labels */}
        <span className="range-bar-scale-min">{formatVal(scaleMin)}</span>
        {!hideMax && <span className="range-bar-scale-max">{formatVal(scaleMax)}</span>}

        {/* 25th–75th range band */}
        {hasRange && (
          <div
            className="range-bar-band"
            style={{
              left: `${pct(p25!, scaleMin, scaleMax)}%`,
              width: `${pct(p75!, scaleMin, scaleMax) - pct(p25!, scaleMin, scaleMax)}%`,
            }}
          >
            <span className="range-bar-band-label range-bar-band-left">
              {formatVal(p25!)}
            </span>
            <span className="range-bar-band-label range-bar-band-right">
              {formatVal(p75!)}
            </span>
          </div>
        )}

        {/* 50th percentile tick */}
        {p50 != null && hasRange && (
          <div
            className="range-bar-median"
            style={{ left: `${pct(p50, scaleMin, scaleMax)}%` }}
          />
        )}

        {/* Student dot */}
        {studentVal != null && (
          <div
            className="range-bar-dot"
            style={{
              left: `${Math.max(0, Math.min(100, pct(studentVal, scaleMin, scaleMax)))}%`,
              backgroundColor: statusColors[status],
            }}
          >
            <span className="range-bar-dot-label">{formatVal(studentVal)}</span>
          </div>
        )}

        {studentVal == null && !hasRange && (
          <span className="range-bar-no-data">No student or college data</span>
        )}
        {studentVal == null && hasRange && (
          <span className="range-bar-no-data">No student data</span>
        )}
        {studentVal != null && !hasRange && (
          <span className="range-bar-no-data">No college data</span>
        )}
      </div>
    </div>
  );
}
