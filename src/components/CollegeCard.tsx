import type { College, Student, CardOptions } from "../types";
import { compareScore, compareGPA, parseNum } from "../utils/compare";
import RangeBar from "./RangeBar";

interface Props {
  college: College;
  student: Student;
  cardOptions: CardOptions;
}

function fmt(val: string): string {
  return val === "---" ? "N/A" : val;
}

function StatRow({ label, value }: { label: string; value: string }) {
  if (value === "---") return null;
  return (
    <div className="info-row">
      <span className="info-row-label">{label}</span>
      <span className="info-row-value">{value}</span>
    </div>
  );
}


export default function CollegeCard({ college, student, cardOptions }: Props) {
  const c = college;

  const satRows: {
    label: string;
    studentVal: number | null;
    p25: string;
    p50: string;
    p75: string;
    scaleMin: number;
    scaleMax: number;
  }[] = [
    { label: "SAT Total", studentVal: student.satTotal, p25: c.satComposite25, p50: c.satComposite50, p75: c.satComposite75, scaleMin: 400, scaleMax: 1600 },
    { label: "SAT Reading", studentVal: student.satReading, p25: c.satReading25, p50: c.satReading50, p75: c.satReading75, scaleMin: 200, scaleMax: 800 },
    { label: "SAT Math", studentVal: student.satMath, p25: c.satMath25, p50: c.satMath50, p75: c.satMath75, scaleMin: 200, scaleMax: 800 },
  ];

  const actRows: {
    label: string;
    studentVal: number | null;
    p25: string;
    p50: string;
    p75: string;
  }[] = [
    { label: "ACT Composite", studentVal: student.actComposite, p25: c.actComposite25, p50: c.actComposite50, p75: c.actComposite75 },
    { label: "ACT English", studentVal: student.actEnglish, p25: c.actEnglish25, p50: c.actEnglish50, p75: c.actEnglish75 },
    { label: "ACT Reading", studentVal: student.actReading, p25: c.actReading25, p50: c.actReading50, p75: c.actReading75 },
    { label: "ACT Math", studentVal: student.actMath, p25: c.actMath25, p50: c.actMath50, p75: c.actMath75 },
    { label: "ACT Science", studentVal: student.actScience, p25: c.actScience25, p50: c.actScience50, p75: c.actScience75 },
  ];

  const avgGPA = parseNum(c.averageGPA);

  const hide = cardOptions.hideEmptyStudentData;
  const visibleSatRows = hide
    ? satRows.filter((r) => r.studentVal != null)
    : satRows;
  const visibleActRows = hide
    ? actRows.filter((r) => r.studentVal != null)
    : actRows;

  const ethnicitySegments: { label: string; value: string; color: string }[] = [
    { label: "White", value: c.percentWhite, color: "#60a5fa" },
    { label: "Hispanic", value: c.percentHispanicLatino, color: "#f97316" },
    { label: "Black", value: c.percentBlack, color: "#a78bfa" },
    { label: "Asian", value: c.percentAsian, color: "#34d399" },
    { label: "Am. Indian", value: c.percentAmericanIndian, color: "#f472b6" },
    { label: "Pac. Isl.", value: c.percentPacificIslander, color: "#38bdf8" },
    { label: "Other", value: c.percentOther, color: "#94a3b8" },
  ];

  return (
    <div className="college-card">
      <div className="card-header">
        <h3>{c.schoolName}</h3>
        <p className="card-location">
          {c.city !== "---" ? c.city : ""}{c.city !== "---" && c.state !== "---" ? ", " : ""}{c.state !== "---" ? c.state : ""}
          {c.degreeOfUrbanization !== "---" && ` \u2022 ${c.degreeOfUrbanization}`}
        </p>
      </div>

      <div className="card-stats">
        <div className="stat">
          <span className="stat-label">Acceptance</span>
          <span className="stat-value">{fmt(c.acceptanceRate)}</span>
        </div>
        {c.hasED === "Yes" && c.edAdmitRate !== "---" && (
          <div className="stat">
            <span className="stat-label">ED Rate</span>
            <span className="stat-value">{c.edAdmitRate}</span>
          </div>
        )}
        {c.hasEA === "Yes" && c.eaAdmitRate !== "---" && (
          <div className="stat">
            <span className="stat-label">EA Rate</span>
            <span className="stat-value">{c.eaAdmitRate}</span>
          </div>
        )}
        {c.rdAdmitRate !== "---" && (
          <div className="stat">
            <span className="stat-label">RD Rate</span>
            <span className="stat-value">{c.rdAdmitRate}</span>
          </div>
        )}
      </div>

      {cardOptions.showAdmissions && (
        <div className="chart-group">
          <h4 className="chart-group-title">Admissions Details</h4>
          <div className="info-grid">
            <StatRow label="Early Decision (ED)" value={c.hasED} />
            <StatRow label="Early Action (EA)" value={c.hasEA} />
            <StatRow label="Applicants" value={c.numberOfApplicants} />
            <StatRow label="Enrolled" value={c.numberOfStudentsEnrolled} />
            <StatRow label="% Submitting SAT" value={c.percentSubmittingSAT} />
            <StatRow label="% Submitting ACT" value={c.percentSubmittingACT} />
          </div>
        </div>
      )}

      {!(hide && student.gpa == null) && (
        <div className="chart-group">
          <h4 className="chart-group-title">GPA</h4>
          <div className="range-bar-section">
            <RangeBar
              label="GPA"
              studentVal={student.gpa}
              p25={avgGPA != null ? Math.max(0, avgGPA - 0.3) : null}
              p50={avgGPA}
              p75={avgGPA != null ? Math.min(5.0, avgGPA + 0.2) : null}
              scaleMin={0}
              scaleMax={5.0}
              status={compareGPA(student.gpa, c.averageGPA)}
              formatVal={(n) => n.toFixed(1)}
            />
          </div>
        </div>
      )}

      {visibleSatRows.length > 0 && (
        <div className="chart-group">
          <h4 className="chart-group-title">SAT Scores</h4>
          <div className="range-bar-section">
            {visibleSatRows.map((r) => (
              <RangeBar
                key={r.label}
                label={r.label}
                studentVal={r.studentVal}
                p25={parseNum(r.p25)}
                p50={parseNum(r.p50)}
                p75={parseNum(r.p75)}
                scaleMin={r.scaleMin}
                scaleMax={r.scaleMax}
                status={compareScore(r.studentVal, r.p25, r.p75)}
              />
            ))}
          </div>
        </div>
      )}

      {visibleActRows.length > 0 && (
        <div className="chart-group">
          <h4 className="chart-group-title">ACT Scores</h4>
          <div className="range-bar-section">
            {visibleActRows.map((r) => (
              <RangeBar
                key={r.label}
                label={r.label}
                studentVal={r.studentVal}
                p25={parseNum(r.p25)}
                p50={parseNum(r.p50)}
                p75={parseNum(r.p75)}
                scaleMin={1}
                scaleMax={36}
                status={compareScore(r.studentVal, r.p25, r.p75)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="card-legend">
        <span className="legend-item status-green">At/above 75th</span>
        <span className="legend-item status-yellow">25th–75th</span>
        <span className="legend-item status-red">Below 25th</span>
        <span className="legend-item status-gray">N/A</span>
      </div>

      {cardOptions.showGender && (
        <div className="chart-group">
          <h4 className="chart-group-title">Gender Breakdown</h4>
          <div className="stacked-bar">
            {parseNum(c.percentWomen) != null && parseNum(c.percentWomen)! > 0 && (
              <div
                className="stacked-bar-seg"
                style={{ flex: parseNum(c.percentWomen)!, backgroundColor: "#818cf8" }}
                title={`Women: ${c.percentWomen}`}
              >
                <span>Women {c.percentWomen}</span>
              </div>
            )}
            {parseNum(c.percentMen) != null && parseNum(c.percentMen)! > 0 && (
              <div
                className="stacked-bar-seg"
                style={{ flex: parseNum(c.percentMen)!, backgroundColor: "#38bdf8" }}
                title={`Men: ${c.percentMen}`}
              >
                <span>Men {c.percentMen}</span>
              </div>
            )}
            {parseNum(c.percentNonBinary) != null && parseNum(c.percentNonBinary)! > 0 && (
              <div
                className="stacked-bar-seg"
                style={{ flex: parseNum(c.percentNonBinary)!, backgroundColor: "#a78bfa" }}
                title={`Non-binary: ${c.percentNonBinary}`}
              >
                <span>NB {c.percentNonBinary}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {cardOptions.showEthnicity && (() => {
        const total = ethnicitySegments.reduce((sum, seg) => sum + (parseNum(seg.value) ?? 0), 0);
        const MIN_PCT = 10;
        return (
          <div className="chart-group">
            <h4 className="chart-group-title">Ethnicity Breakdown</h4>
            <div className="stacked-bar">
              {ethnicitySegments.map((seg) => {
                const num = parseNum(seg.value);
                if (num == null || num === 0) return null;
                const pct = total > 0 ? (num / total) * 100 : 0;
                return (
                  <div
                    key={seg.label}
                    className="stacked-bar-seg"
                    style={{ flex: num, backgroundColor: seg.color }}
                    title={`${seg.label}: ${seg.value}`}
                  >
                    {pct >= MIN_PCT && <span>{seg.label} {seg.value}</span>}
                  </div>
                );
              })}
            </div>
            <div className="stacked-bar-labels">
              {ethnicitySegments.map((seg) => {
                const num = parseNum(seg.value);
                if (num == null || num === 0) return null;
                const pct = total > 0 ? (num / total) * 100 : 0;
                if (pct >= MIN_PCT) return null;
                return (
                  <span key={seg.label} className="stacked-bar-ext-label" style={{ color: seg.color }}>
                    <span className="stacked-bar-ext-dot" style={{ backgroundColor: seg.color }} />
                    {seg.label} {seg.value}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })()}

      {cardOptions.showFinancialAid && (
        <div className="chart-group">
          <h4 className="chart-group-title">Financial Aid</h4>
          <div className="info-grid">
            <StatRow label="% Receiving Any Aid" value={c.percentReceivingAid} />
            <StatRow label="% Receiving Pell Grants" value={c.percentReceivingPell} />
            <StatRow label="Avg Institutional Grant" value={c.avgInstitutionalGrant} />
            <StatRow label="Avg Merit Scholarship" value={c.avgAidMeritAmount} />
            <StatRow label="Avg Pell Grant" value={c.avgPellGrant} />
            <StatRow label="Avg Student Loan" value={c.avgStudentLoan} />
            <StatRow label="Avg Net Price" value={c.avgNetPrice} />
            <StatRow label="Total On-Campus Cost" value={c.totalPriceOnCampus} />
          </div>
        </div>
      )}

      {cardOptions.showNetPriceByIncome && (
        <div className="chart-group">
          <h4 className="chart-group-title">Avg Net Price by Family Income</h4>
          <div className="info-grid">
            <StatRow label="$0 – $30k" value={c.avgNetPriceIncome0_30k} />
            <StatRow label="$30k – $48k" value={c.avgNetPriceIncome30_48k} />
            <StatRow label="$48k – $75k" value={c.avgNetPriceIncome48_75k} />
            <StatRow label="$75k – $110k" value={c.avgNetPriceIncome75_110k} />
            <StatRow label="$110k+" value={c.avgNetPriceIncome110kPlus} />
          </div>
        </div>
      )}

      <div className="card-footer">
        <div className="stat">
          <span className="stat-label">In-State Tuition</span>
          <span className="stat-value">{fmt(c.inStateTuition)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Out-of-State</span>
          <span className="stat-value">{fmt(c.outStateTuition)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">4-Yr Grad Rate</span>
          <span className="stat-value">{fmt(c.graduationRate4yr)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Retention</span>
          <span className="stat-value">{fmt(c.retentionRate)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Enrollment</span>
          <span className="stat-value">{fmt(c.enrollmentFullTime)}</span>
        </div>
      </div>
    </div>
  );
}
