import { useMemo } from "react";
import type { College, Student, CardOptions, ScoreScales } from "../types";
import { parseNum } from "../utils/compare";
import CollegeCard from "./CollegeCard";

interface Props {
  colleges: College[];
  student: Student;
  cardOptions: CardOptions;
  cardRefs?: React.MutableRefObject<Map<string, HTMLDivElement>>;
}

/** Absolute floor/ceiling for each score type */
const BOUNDS: Record<keyof ScoreScales, { floor: number; ceil: number }> = {
  satTotal:      { floor: 400,  ceil: 1600 },
  satReading:    { floor: 200,  ceil: 800 },
  satMath:       { floor: 200,  ceil: 800 },
  actComposite:  { floor: 1,    ceil: 36 },
  actEnglish:    { floor: 1,    ceil: 36 },
  actMath:       { floor: 1,    ceil: 36 },
};

/** Fields on College to pull p25/p75 values from for each score type */
const COLLEGE_FIELDS: Record<keyof ScoreScales, { p25: keyof College; p75: keyof College }> = {
  satTotal:     { p25: "satComposite25", p75: "satComposite75" },
  satReading:   { p25: "satReading25",   p75: "satReading75" },
  satMath:      { p25: "satMath25",      p75: "satMath75" },
  actComposite: { p25: "actComposite25", p75: "actComposite75" },
  actEnglish:   { p25: "actEnglish25",   p75: "actEnglish75" },
  actMath:      { p25: "actMath25",      p75: "actMath75" },
};

/** Student score field for each score type */
const STUDENT_FIELDS: Record<keyof ScoreScales, keyof Student> = {
  satTotal: "satTotal",
  satReading: "satReading",
  satMath: "satMath",
  actComposite: "actComposite",
  actEnglish: "actEnglish",
  actMath: "actMath",
};

function computeScales(colleges: College[], student: Student): ScoreScales {
  const scales = {} as ScoreScales;

  for (const key of Object.keys(BOUNDS) as (keyof ScoreScales)[]) {
    const { floor, ceil } = BOUNDS[key];
    const fields = COLLEGE_FIELDS[key];
    const vals: number[] = [];

    // Gather all p25/p75 values across selected colleges
    for (const c of colleges) {
      const v25 = parseNum(c[fields.p25] as string);
      const v75 = parseNum(c[fields.p75] as string);
      if (v25 != null) vals.push(v25);
      if (v75 != null) vals.push(v75);
    }

    // Include the student's score
    const sv = student[STUDENT_FIELDS[key]] as number | null;
    if (sv != null) vals.push(sv);

    const isSAT = key.startsWith("sat");

    if (vals.length === 0) {
      scales[key] = { min: floor, max: ceil };
    } else {
      const padding = (ceil - floor) * 0.05;
      const rawMin = Math.max(floor, Math.min(...vals) - padding);
      const rawMax = Math.min(ceil, Math.max(...vals) + padding);
      scales[key] = {
        min: isSAT ? Math.floor(rawMin / 10) * 10 : Math.floor(rawMin),
        max: isSAT ? Math.ceil(rawMax / 10) * 10 : Math.ceil(rawMax),
      };
    }
  }

  // Unify SAT sub-scores (Reading & Math share the same scale)
  const satSubMin = Math.min(scales.satReading.min, scales.satMath.min);
  const satSubMax = Math.max(scales.satReading.max, scales.satMath.max);
  scales.satReading = scales.satMath = { min: satSubMin, max: satSubMax };

  // Unify ACT sub-scores (English & Math share the same scale)
  const actSubMin = Math.min(scales.actEnglish.min, scales.actMath.min);
  const actSubMax = Math.max(scales.actEnglish.max, scales.actMath.max);
  scales.actEnglish = scales.actMath = { min: actSubMin, max: actSubMax };

  return scales;
}

export default function ComparisonView({ colleges, student, cardOptions, cardRefs }: Props) {
  const scales = useMemo(() => computeScales(colleges, student), [colleges, student]);

  if (colleges.length === 0) {
    return (
      <section className="comparison-view empty">
        <p>Select colleges from the sidebar to see your comparison cards.</p>
      </section>
    );
  }

  return (
    <section className="comparison-view">
      <h2>College Comparison</h2>
      <div className="card-grid">
        {colleges.map((c) => (
          <div
            key={c.id}
            ref={(el) => {
              if (!cardRefs) return;
              if (el) {
                cardRefs.current.set(c.id, el);
              } else {
                cardRefs.current.delete(c.id);
              }
            }}
          >
            <CollegeCard college={c} student={student} cardOptions={cardOptions} scales={scales} />
          </div>
        ))}
      </div>
    </section>
  );
}
