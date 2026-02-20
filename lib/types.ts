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
  /** Whether this scan used real CMS data or specialty-based estimates */
  dataSource: "cms" | "estimated";
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

// === Group Practice Scan ===

export interface ProviderScanSummary {
  npi: string;
  fullName: string;
  credential: string;
  specialty: string;
  city: string;
  state: string;
  revenueScore: number;
  scoreTier: string;
  scoreColor: string;
  currentRevenue: number;
  missedRevenue: number;
  potentialRevenue: number;
  codingGap: number;
  ccmGap: number;
  rpmGap: number;
  bhiGap: number;
  awvGap: number;
  dataSource: "cms" | "estimated";
  status: "success" | "failed";
  fullScan: ScanResult | null;
}

export interface PracticeActionItem {
  priority: number;
  title: string;
  description: string;
  affectedProviders: number;
  totalEstimatedRevenue: number;
  difficulty: "easy" | "medium" | "hard";
  category: "coding" | "ccm" | "rpm" | "bhi" | "awv";
}

export interface GroupScanResult {
  practiceName: string;
  scannedAt: string;

  // Individual results
  providers: ProviderScanSummary[];

  // Counts
  totalProviders: number;
  successfulScans: number;
  failedScans: number;

  // Revenue aggregates
  totalCurrentRevenue: number;
  totalMissedRevenue: number;
  totalPotentialRevenue: number;
  revenueIncreasePct: number;

  // Score aggregates
  averageRevenueScore: number;
  scoreDistribution: { tier: string; count: number; color: string }[];

  // Gap aggregates
  totalCodingGap: number;
  totalCcmGap: number;
  totalRpmGap: number;
  totalBhiGap: number;
  totalAwvGap: number;

  // Program adoption across practice
  programAdoption: {
    ccm: { enrolled: number; eligible: number; rate: number };
    rpm: { enrolled: number; eligible: number; rate: number };
    bhi: { enrolled: number; eligible: number; rate: number };
    awv: { enrolled: number; eligible: number; rate: number };
  };

  // Specialty mix
  specialtyBreakdown: { specialty: string; count: number; totalRevenue: number }[];

  // Rankings
  topPerformer: ProviderScanSummary | null;
  bottomPerformer: ProviderScanSummary | null;
  biggestOpportunity: ProviderScanSummary | null;

  // Practice-level action plan
  practiceActionPlan: PracticeActionItem[];

  // Data source summary
  cmsDataCount: number;
  estimatedDataCount: number;
}
