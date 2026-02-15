// === Provider from NPPES API ===
export interface NPPESProvider {
  npi: string;
  firstName: string;
  lastName: string;
  fullName: string;
  credential: string;
  specialty: string;
  taxonomyCode: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  gender: string;
  entityType: "individual" | "organization";
}

// === Specialty Benchmarks ===
export interface SpecialtyBenchmark {
  specialty: string;
  avgMedicarePatients: number;
  avgRevenuePerPatient: number;
  ccmAdoptionRate: number;
  rpmAdoptionRate: number;
  bhiAdoptionRate: number;
  awvAdoptionRate: number;
  // Optimal E&M distribution
  pct99213: number;
  pct99214: number;
  pct99215: number;
  // Chronic condition rates
  avgChronicConditions: number;
  chronicDiabetesPct: number;
  chronicHypertensionPct: number;
  chronicHeartFailurePct: number;
  chronicDepressionPct: number;
  chronicCopdPct: number;
  avgHccRiskScore: number;
}

// === Simulated Provider Billing Data (until CMS DB is ready) ===
export interface ProviderBillingData {
  npi: string;
  specialty: string;
  totalMedicarePatients: number;
  totalServices: number;
  totalMedicarePayment: number;
  // E&M distribution (current)
  em99213Count: number;
  em99214Count: number;
  em99215Count: number;
  emTotalCount: number;
  // Program billing (current)
  ccmPatients: number;
  ccmBilled: number;
  rpmPatients: number;
  rpmBilled: number;
  bhiPatients: number;
  bhiBilled: number;
  awvCount: number;
  awvBilled: number;
  // Patient panel
  chronicDiabetesPct: number;
  chronicHypertensionPct: number;
  chronicHeartFailurePct: number;
  chronicDepressionPct: number;
  chronicCopdPct: number;
}

// === Revenue Gap Results ===
export interface CodingGap {
  current99213Pct: number;
  current99214Pct: number;
  current99215Pct: number;
  optimal99213Pct: number;
  optimal99214Pct: number;
  optimal99215Pct: number;
  annualGap: number;
  shiftsNeeded: string;
}

export interface ProgramGap {
  programName: string;
  code: string;
  eligiblePatients: number;
  currentPatients: number;
  captureRate: number;
  revenuePerPatientPerMonth: number;
  currentAnnualRevenue: number;
  potentialAnnualRevenue: number;
  annualGap: number;
}

export interface ScanResult {
  provider: NPPESProvider;
  billing: ProviderBillingData;
  benchmark: SpecialtyBenchmark;
  totalMissedRevenue: number;
  codingGap: CodingGap;
  ccmGap: ProgramGap;
  rpmGap: ProgramGap;
  bhiGap: ProgramGap;
  awvGap: ProgramGap;
  actionPlan: ActionItem[];
  scannedAt: string;
}

export interface ActionItem {
  priority: number;
  title: string;
  description: string;
  timeline: string;
  estimatedRevenue: number;
  difficulty: "easy" | "medium" | "hard";
  category: "coding" | "ccm" | "rpm" | "bhi" | "awv";
}
