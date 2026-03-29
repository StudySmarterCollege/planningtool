import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { College, Student, CompareStatus } from "../types";
import { compareScore, compareGPA } from "../utils/compare";

interface Props {
  colleges: College[];
  student: Student;
}

function fmt(val: string): string {
  return val === "---" ? "N/A" : val;
}

function statusColor(status: CompareStatus): [number, number, number] {
  switch (status) {
    case "green": return [200, 240, 200];
    case "yellow": return [255, 249, 220];
    case "red": return [253, 220, 220];
    default: return [240, 240, 240];
  }
}

interface CellDef {
  text: string;
  status?: CompareStatus;
}

function loadLogoAsDataURL(): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Failed to load logo"));
    img.src = `${import.meta.env.BASE_URL}study-smarter-logo.webp`;
  });
}

export default function ExportButton({ colleges, student }: Props) {
  async function exportPDF() {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo (550x85 original aspect ratio)
    let headerY = 36;
    try {
      const logoDataURL = await loadLogoAsDataURL();
      const logoH = 24;
      const logoW = (550 / 85) * logoH;
      doc.addImage(logoDataURL, "PNG", 40, 14, logoW, logoH);
    } catch {
      // skip logo if it fails to load
    }

    // Title
    doc.setFontSize(18);
    doc.setTextColor(56, 84, 123);
    doc.text("College Comparison Report", pageWidth / 2, headerY, { align: "center" });

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
    const headers: string[] = ["College", "Location", "Accept %", "In-State", "Out-of-State", "GPA", "SAT", "ACT"];

    const label = student.name || "You";

    const rows = colleges.map((c) => {
      const gpaStatus = compareGPA(student.gpa, c.averageGPA);
      const gpaLines = [`Avg: ${fmt(c.averageGPA)}`];
      if (student.gpa != null) gpaLines.push(`${label}: ${student.gpa.toFixed(2)}`);

      const satStatus = compareScore(student.satTotal, c.satComposite25, c.satComposite75);
      const satLines = [`${fmt(c.satComposite25)}–${fmt(c.satComposite75)}`];
      if (student.satTotal != null) satLines.push(`${label}: ${student.satTotal}`);

      const actStatus = compareScore(student.actComposite, c.actComposite25, c.actComposite75);
      const actLines = [`${fmt(c.actComposite25)}–${fmt(c.actComposite75)}`];
      if (student.actComposite != null) actLines.push(`${label}: ${student.actComposite}`);

      const cells: CellDef[] = [
        { text: c.schoolName },
        { text: `${fmt(c.city)}, ${fmt(c.state)}` },
        { text: fmt(c.acceptanceRate) },
        { text: fmt(c.inStateTuition) },
        { text: fmt(c.outStateTuition) },
        { text: gpaLines.join("\n"), status: gpaStatus },
        { text: satLines.join("\n"), status: satStatus },
        { text: actLines.join("\n"), status: actStatus },
      ];

      return cells;
    });

    autoTable(doc, {
      startY: 68,
      head: [headers],
      body: rows.map((r) => r.map((cell) => cell.text)),
      theme: "grid",
      headStyles: { fillColor: [56, 84, 123], fontSize: 7, cellPadding: 4 },
      bodyStyles: { fontSize: 7, cellPadding: 3 },
      styles: { overflow: "linebreak" },
      columnStyles: { 0: { cellWidth: 100 } },
      didParseCell(data) {
        if (data.section === "body") {
          const row = rows[data.row.index];
          if (row) {
            const cell = row[data.column.index];
            if (cell?.status) {
              data.cell.styles.fillColor = statusColor(cell.status);
            }
          }
        }
      },
    });

    // Legend
    const lastY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 200;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Color key:  Green = Above avg / 75th  |  Yellow = Near avg / 25th–75th  |  Red = Below avg / 25th  |  Gray = Data unavailable", 40, lastY + 16);
    doc.text("GPA: College Avg + Your GPA  |  SAT & ACT: 25th–75th range + Your Score", 40, lastY + 28);

    doc.save(`college-comparison-${student.name || "student"}.pdf`);
  }

  if (colleges.length === 0) return null;

  return (
    <button className="export-btn" onClick={exportPDF}>
      Export Comparison (PDF)
    </button>
  );
}
