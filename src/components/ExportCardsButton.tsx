import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import type { College, Student } from "../types";

interface Props {
  colleges: College[];
  student: Student;
  cardRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
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

export default function ExportCardsButton({ colleges, student, cardRefs }: Props) {
  const [exporting, setExporting] = useState(false);

  async function exportCardsPDF() {
    setExporting(true);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 30;
      const contentWidth = pageWidth - margin * 2;

      // Add logo + title on first page header
      let headerHeight = 0;
      try {
        const logoDataURL = await loadLogoAsDataURL();
        const logoH = 24;
        const logoW = (550 / 85) * logoH;
        doc.addImage(logoDataURL, "PNG", margin, 14, logoW, logoH);
        headerHeight = 20;
      } catch {
        // skip logo
      }

      doc.setFontSize(16);
      doc.setTextColor(56, 84, 123);
      doc.text("College Cards Report", pageWidth / 2, 36 + headerHeight, { align: "center" });

      if (student.name) {
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Student: ${student.name}`, pageWidth / 2, 52 + headerHeight, { align: "center" });
      }

      const firstPageTopOffset = 60 + headerHeight;
      let isFirstPage = true;

      for (const college of colleges) {
        const el = cardRefs.current.get(college.id);
        if (!el) continue;

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const imgAspect = canvas.height / canvas.width;
        const imgWidth = contentWidth;
        const imgHeight = imgWidth * imgAspect;

        if (!isFirstPage) {
          doc.addPage();
        }

        const yOffset = isFirstPage ? firstPageTopOffset : margin;
        const availableHeight = pageHeight - yOffset - margin;

        // Scale down if card is taller than available page space
        let finalWidth = imgWidth;
        let finalHeight = imgHeight;
        if (finalHeight > availableHeight) {
          const scale = availableHeight / finalHeight;
          finalWidth *= scale;
          finalHeight *= scale;
        }

        // Center horizontally
        const xOffset = (pageWidth - finalWidth) / 2;
        doc.addImage(imgData, "PNG", xOffset, yOffset, finalWidth, finalHeight);

        isFirstPage = false;
      }

      doc.save(`college-cards-${student.name || "student"}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  if (colleges.length === 0) return null;

  return (
    <button className="export-btn" onClick={exportCardsPDF} disabled={exporting}>
      {exporting ? "Exporting..." : "Export Cards (PDF)"}
    </button>
  );
}
