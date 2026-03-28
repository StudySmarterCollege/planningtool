import type { CompareStatus } from "../types";

/** Parse a string value (possibly with %, $, commas) to a number, or null if unavailable. */
export function parseNum(val: string): number | null {
  if (!val || val === "---") return null;
  const cleaned = val.replace(/[%$,]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

/**
 * Compare a student's score against 25th/75th percentile values.
 * Returns green if at/above 75th, yellow if between 25th–75th, red if below 25th.
 * Returns gray if any data is missing.
 */
export function compareScore(
  studentScore: number | null,
  p25Str: string,
  p75Str: string
): CompareStatus {
  if (studentScore == null) return "gray";
  const p25 = parseNum(p25Str);
  const p75 = parseNum(p75Str);
  if (p25 == null || p75 == null) return "gray";

  if (studentScore >= p75) return "green";
  if (studentScore >= p25) return "yellow";
  return "red";
}

/**
 * Compare student GPA against college average GPA.
 * Uses thresholds: green if student >= avgGPA + 0.2, red if student < avgGPA - 0.3, yellow otherwise.
 */
export function compareGPA(
  studentGPA: number | null,
  avgGPAStr: string
): CompareStatus {
  if (studentGPA == null) return "gray";
  const avgGPA = parseNum(avgGPAStr);
  if (avgGPA == null) return "gray";

  if (studentGPA >= avgGPA + 0.2) return "green";
  if (studentGPA < avgGPA - 0.3) return "red";
  return "yellow";
}

/** Map a CompareStatus to a CSS class name. */
export function statusClass(status: CompareStatus): string {
  return `status-${status}`;
}
