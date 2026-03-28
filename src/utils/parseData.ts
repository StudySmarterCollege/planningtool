import Papa from "papaparse";
import type { College } from "../types";

function raw(row: Record<string, string>, key: string): string {
  return row[key]?.trim() ?? "---";
}

export async function loadColleges(): Promise<College[]> {
  const res = await fetch(`${import.meta.env.BASE_URL}data.csv`);
  const text = await res.text();

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const colleges: College[] = results.data
          .filter((r) => raw(r, "School name") !== "---" && raw(r, "School name") !== "")
          .map((r) => ({
            schoolName: raw(r, "School name"),
            state: raw(r, "State"),
            city: raw(r, "City"),
            acceptanceRate: raw(r, "Acceptance rate"),
            edAdmitRate: raw(r, "ED admit rate"),
            eaAdmitRate: raw(r, "EA admit rate"),
            rdAdmitRate: raw(r, "RD admit rate"),
            hasED: raw(r, "Has Early Decision (ED) Plan?"),
            hasEA: raw(r, "Has Early Action (EA) Plan?"),
            averageGPA: raw(r, "Average GPA"),
            gpaWeighted: raw(r, "GPA Weighted"),

            actComposite25: raw(r, "ACT Composite 25th"),
            actComposite50: raw(r, "ACT Composite 50th"),
            actComposite75: raw(r, "ACT Composite 75th"),
            actEnglish25: raw(r, "ACT English 25th"),
            actEnglish50: raw(r, "ACT English 50th"),
            actEnglish75: raw(r, "ACT English 75th"),
            actReading25: raw(r, "ACT Reading 25th"),
            actReading50: raw(r, "ACT Reading 50th"),
            actReading75: raw(r, "ACT Reading 75th"),
            actMath25: raw(r, "ACT Math 25th"),
            actMath50: raw(r, "ACT Math 50th"),
            actMath75: raw(r, "ACT Math 75th"),
            actScience25: raw(r, "ACT Science 25th"),
            actScience50: raw(r, "ACT Science 50th"),
            actScience75: raw(r, "ACT Science 75th"),

            satReading25: raw(r, "SAT Reading 25th"),
            satReading50: raw(r, "SAT Reading 50th"),
            satReading75: raw(r, "SAT Reading 75th"),
            satMath25: raw(r, "SAT Math 25th"),
            satMath50: raw(r, "SAT Math 50th"),
            satMath75: raw(r, "SAT Math 75th"),
            satComposite25: raw(r, "SAT Composite 25th"),
            satComposite50: raw(r, "SAT Composite 50th"),
            satComposite75: raw(r, "SAT Composite 75th"),

            inStateTuition: raw(r, "Published in-state tuition and fees"),
            outStateTuition: raw(r, "Published out-of-state tuition and fees"),
            totalPriceOnCampus: raw(r, "Total price for in-state students living on campus"),
            graduationRate4yr: raw(r, "4 year graduation rate"),
            graduationRate6yr: raw(r, "6 year graduation rate"),
            retentionRate: raw(r, "Retention rate"),
            enrollmentFullTime: raw(r, "Estimated undergraduate enrollment full time"),

            // Demographics
            degreeOfUrbanization: raw(r, "Degree of urbanization"),
            numberOfApplicants: raw(r, "Number of applicants"),
            numberOfStudentsEnrolled: raw(r, "Number of students enrolled"),
            percentWomen: raw(r, "Percent Women"),
            percentMen: raw(r, "Percent Men"),
            percentNonBinary: raw(r, "Percent Non-binary"),
            percentHispanicLatino: raw(r, "Percent Hispanic/Latino"),
            percentBlack: raw(r, "Percent Black or African American"),
            percentWhite: raw(r, "Percent White or Caucasian"),
            percentAmericanIndian: raw(r, "Percent American Indian or Alaska Native"),
            percentAsian: raw(r, "Percent Asian"),
            percentPacificIslander: raw(r, "Percent Native Hawaiian or Pacific Islander"),
            percentOther: raw(r, "Percent Other"),

            // Test submission rates
            percentSubmittingSAT: raw(r, "Percentage of enrolled freshmen submitting SAT scores"),
            percentSubmittingACT: raw(r, "Percentage of enrolled freshmen submitting ACT scores"),

            // Financial aid
            avgAidMeritAmount: raw(r, "Average Aid Package: Freshmen without need receiving merit-based scholarships and grants (dollar amt)"),
            avgAidMeritPercent: raw(r, "Average Aid Package: Freshmen without need receiving merit-based scholarships and grants (percentage)"),
            avgInstitutionalGrant: raw(r, "Average amount of institutional grant aid received by full-time first-time undergraduates"),
            avgNetPrice: raw(r, "Average net price-students receiving grant or scholarship aid"),
            avgPellGrant: raw(r, "Average amount of Pell grant aid received by full-time first-time undergraduates"),
            avgStudentLoan: raw(r, "Average amount of student loan aid received by full-time first-time undergraduates"),
            percentReceivingAid: raw(r, "Percent of full-time first-time undergraduates receiving any financial aid"),
            percentReceivingPell: raw(r, "Percent of full-time first-time undergraduates receiving Pell grants"),
            avgNetPriceIncome0_30k: raw(r, "Average net price (income 0-30,000)"),
            avgNetPriceIncome30_48k: raw(r, "Average net price (income 30,001-48,000)"),
            avgNetPriceIncome48_75k: raw(r, "Average net price (income 48,001-75,000)"),
            avgNetPriceIncome75_110k: raw(r, "Average net price (income 75,001-110,000)"),
            avgNetPriceIncome110kPlus: raw(r, "Average net price (income over 110 000)"),
          }));
        resolve(colleges);
      },
      error(err: Error) {
        reject(err);
      },
    });
  });
}
