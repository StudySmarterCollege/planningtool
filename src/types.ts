export interface Student {
  name: string;
  gpa: number | null;
  satTotal: number | null;
  satReading: number | null;
  satMath: number | null;
  actComposite: number | null;
  actEnglish: number | null;
  actReading: number | null;
  actMath: number | null;
  actScience: number | null;
}

export interface College {
  schoolName: string;
  state: string;
  city: string;
  acceptanceRate: string;
  edAdmitRate: string;
  eaAdmitRate: string;
  rdAdmitRate: string;
  hasED: string;
  hasEA: string;
  averageGPA: string;
  gpaWeighted: string;

  actComposite25: string;
  actComposite50: string;
  actComposite75: string;
  actEnglish25: string;
  actEnglish50: string;
  actEnglish75: string;
  actReading25: string;
  actReading50: string;
  actReading75: string;
  actMath25: string;
  actMath50: string;
  actMath75: string;
  actScience25: string;
  actScience50: string;
  actScience75: string;

  satReading25: string;
  satReading50: string;
  satReading75: string;
  satMath25: string;
  satMath50: string;
  satMath75: string;
  satComposite25: string;
  satComposite50: string;
  satComposite75: string;

  inStateTuition: string;
  outStateTuition: string;
  totalPriceOnCampus: string;
  graduationRate4yr: string;
  graduationRate6yr: string;
  retentionRate: string;
  enrollmentFullTime: string;

  // Demographics
  degreeOfUrbanization: string;
  numberOfApplicants: string;
  numberOfStudentsEnrolled: string;
  percentWomen: string;
  percentMen: string;
  percentNonBinary: string;
  percentHispanicLatino: string;
  percentBlack: string;
  percentWhite: string;
  percentAmericanIndian: string;
  percentAsian: string;
  percentPacificIslander: string;
  percentOther: string;

  // Test submission rates
  percentSubmittingSAT: string;
  percentSubmittingACT: string;

  // Financial aid
  avgAidMeritAmount: string;
  avgAidMeritPercent: string;
  avgInstitutionalGrant: string;
  avgNetPrice: string;
  avgPellGrant: string;
  avgStudentLoan: string;
  percentReceivingAid: string;
  percentReceivingPell: string;
  avgNetPriceIncome0_30k: string;
  avgNetPriceIncome30_48k: string;
  avgNetPriceIncome48_75k: string;
  avgNetPriceIncome75_110k: string;
  avgNetPriceIncome110kPlus: string;
}

export interface CardOptions {
  showGender: boolean;
  showEthnicity: boolean;
  showAdmissions: boolean;
  showFinancialAid: boolean;
  showNetPriceByIncome: boolean;
  hideEmptyStudentData: boolean;
}

export type CompareStatus = "green" | "yellow" | "red" | "gray";
