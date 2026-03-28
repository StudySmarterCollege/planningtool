import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { College, Student } from "../types";
import { compareScore, compareGPA } from "../utils/compare";

interface Props {
  colleges: College[];
  student: Student;
}

function fmt(val: string): string {
  return val === "---" ? "N/A" : val;
}

function statusColor(status: string): [number, number, number] {
  switch (status) {
    case "green": return [200, 240, 200];
    case "yellow": return [255, 249, 220];
    case "red": return [253, 220, 220];
    default: return [240, 240, 240];
  }
}

function worstStatus(statuses: string[]): string {
  if (statuses.includes("red")) return "red";
  if (statuses.includes("yellow")) return "yellow";
  if (statuses.includes("green")) return "green";
  return "gray";
}

export default function ExportButton({ colleges, student }: Props) {
  function exportPDF() {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(18);
    doc.setTextColor(22, 33, 62);
    doc.text("College Comparison Report", pageWidth / 2, 36, { align: "center" });

    // Student info
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    const studentParts: string[] = [];
    if (student.name) studentParts.push(`Student: ${student.name}`);
    if (student.gpa != null) studentParts.push(`GPA: ${student.gpa.toFixed(2)}`);
    if (student.satTotal != null) studentParts.push(`SAT: ${student.satTotal}`);
    if (student.actComposite != null) studentParts.push(`ACT: ${student.actComposite}`);
    if (studentParts.length > 0) {
      doc.text(studentParts.join("  |  "), pageWidth / 2, 52, { align: "center" });
    }

    // Build rows
    const head = [["College", "Location", "Accept %", "In-State", "Out-of-State", "GPA", "SAT", "ACT"]];

    const rows = colleges.map((c) => {
      // GPA cell
      const gpaStatus = compareGPA(student.gpa, c.averageGPA);
      const gpaCell = student.gpa != null
        ? `${student.gpa.toFixed(2)} / ${fmt(c.averageGPA)}`
        : fmt(c.averageGPA);

      // SAT cell — show student composite vs 25th–75th
      const satStatus = compareScore(student.satTotal, c.satComposite25, c.satComposite75);
      const satCell = student.satTotal != null
        ? `${student.satTotal} (${fmt(c.satComposite25)}–${fmt(c.satComposite75)})`
        : `${fmt(c.satComposite25)}–${fmt(c.satComposite75)}`;

      // ACT cell — show student composite vs 25th–75th
      const actStatus = compareScore(student.actComposite, c.actComposite25, c.actComposite75);
      const actCell = student.actComposite != null
        ? `${student.actComposite} (${fmt(c.actComposite25)}–${fmt(c.actComposite75)})`
        : `${fmt(c.actComposite25)}–${fmt(c.actComposite75)}`;

      return {
        content: [
          c.schoolName,
          `${fmt(c.city)}, ${fmt(c.state)}`,
          fmt(c.acceptanceRate),
          fmt(c.inStateTuition),
          fmt(c.outStateTuition),
          gpaCell,
          satCell,
          actCell,
        ],
        status: worstStatus([gpaStatus, satStatus, actStatus]),
      };
    });

    autoTable(doc, {
      startY: 68,
      head,
      body: rows.map((r) => r.content),
      theme: "grid",
      headStyles: { fillColor: [22, 33, 62], fontSize: 8, cellPadding: 5 },
      bodyStyles: { fontSize: 8, cellPadding: 4 },
      styles: { overflow: "linebreak" },
      columnStyles: { 0: { cellWidth: 130 } },
      didParseCell(data) {
        if (data.section === "body") {
          const row = rows[data.row.index];
          if (row) {
            data.cell.styles.fillColor = statusColor(row.status);
          }
        }
      },
    });

    // Legend
    const lastY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 200;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Color key:  Green = Above avg / 75th  |  Yellow = Near avg / 25th–75th  |  Red = Below avg / 25th  |  Gray = Data unavailable", 40, lastY + 16);
    doc.text("SAT & ACT format: Student Score (25th–75th)  |  GPA format: Student / College Avg", 40, lastY + 28);

    doc.save(`college-comparison-${student.name || "student"}.pdf`);
  }

  if (colleges.length === 0) return null;

  return (
    <button className="export-btn" onClick={exportPDF}>
      Export Comparison (PDF)
    </button>
  );
}
