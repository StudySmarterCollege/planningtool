import type { College, Student } from "../types";

interface Props {
  colleges: College[];
  student: Student;
}

function esc(val: string): string {
  if (val.includes(",") || val.includes('"')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export default function ExportButton({ colleges, student }: Props) {
  function exportCSV() {
    const headers = [
      "College",
      "City",
      "State",
      "Acceptance Rate",
      "Student GPA",
      "College Avg GPA",
      "Student SAT Total",
      "SAT 25th",
      "SAT 50th",
      "SAT 75th",
      "Student SAT Reading",
      "SAT Reading 25th",
      "SAT Reading 50th",
      "SAT Reading 75th",
      "Student SAT Math",
      "SAT Math 25th",
      "SAT Math 50th",
      "SAT Math 75th",
      "Student ACT Composite",
      "ACT Composite 25th",
      "ACT Composite 50th",
      "ACT Composite 75th",
      "In-State Tuition",
      "Out-of-State Tuition",
      "4-Yr Grad Rate",
      "Retention Rate",
      "Enrollment",
    ];

    const rows = colleges.map((c) => [
      c.schoolName,
      c.city,
      c.state,
      c.acceptanceRate,
      student.gpa != null ? student.gpa.toString() : "",
      c.averageGPA,
      student.satTotal != null ? student.satTotal.toString() : "",
      c.satComposite25,
      c.satComposite50,
      c.satComposite75,
      student.satReading != null ? student.satReading.toString() : "",
      c.satReading25,
      c.satReading50,
      c.satReading75,
      student.satMath != null ? student.satMath.toString() : "",
      c.satMath25,
      c.satMath50,
      c.satMath75,
      student.actComposite != null ? student.actComposite.toString() : "",
      c.actComposite25,
      c.actComposite50,
      c.actComposite75,
      c.inStateTuition,
      c.outStateTuition,
      c.graduationRate4yr,
      c.retentionRate,
      c.enrollmentFullTime,
    ]);

    const csv = [headers, ...rows].map((row) => row.map(esc).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `college-comparison-${student.name || "student"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (colleges.length === 0) return null;

  return (
    <button className="export-btn" onClick={exportCSV}>
      Export Comparison (CSV)
    </button>
  );
}
