/**
 * NPIxray Revenue Prediction Engine
 *
 * Projects 12-month revenue growth based on program adoption ramp-up curves,
 * E&M coding optimization trajectories, and industry-average enrollment rates.
 *
 * Uses logistic/sigmoid ramp-up curves — mimics real-world adoption:
 *   Month 1-3: Slow start (training, credentialing, workflow setup)
 *   Month 4-8: Rapid growth (team trained, referrals building)
 *   Month 9-12: Plateau (approaching max enrollment capacity)
 *
 * No Node.js imports — safe for both server and client use.
 */

import type { ScanResult, ProgramGap, CodingGap } from "./types";

// ── Constants ─────────────────────────────────────────────

/** Medicare reimbursement rates (2024 national averages) */
const RATES = {
  ccm99490: 62,   // per patient per month
  ccm99439: 47,   // per patient per month (additional 20min)
  rpm99454: 55,   // per patient per month (device supply)
  rpm99457: 48,   // per patient per month (monitoring time)
  rpm99458: 40,   // per patient per month (additional 20min)
  bhi99484: 51,   // per patient per month
  awvG0438: 185,  // initial AWV
  awvG0439: 130,  // subsequent AWV
  em99213: 98,    // per visit
  em99214: 143,   // per visit
  em99215: 199,   // per visit
};

// ── Ramp-up Curves ────────────────────────────────────────

/**
 * Sigmoid ramp-up: realistic adoption curve.
 * Returns fraction of max enrollment reached at month `m` (0-1).
 * `speed` controls how quickly the curve ramps (higher = faster).
 * `midpoint` is the month at which 50% enrollment is reached.
 */
function sigmoid(m: number, midpoint = 5, speed = 0.8): number {
  return 1 / (1 + Math.exp(-speed * (m - midpoint)));
}

/**
 * Linear ramp: simpler model for E&M coding changes.
 * Reaches full effect at `fullMonth`.
 */
function linearRamp(m: number, fullMonth = 6): number {
  return Math.min(m / fullMonth, 1);
}

// ── Types ─────────────────────────────────────────────────

export interface MonthlyProjection {
  month: number;
  label: string;
  ccm: number;
  rpm: number;
  bhi: number;
  awv: number;
  emCoding: number;
  total: number;
  cumulative: number;
}

export interface ProgramForecast {
  programName: string;
  code: string;
  enabled: boolean;
  enrollmentTarget: number;         // patients at full ramp
  enrollmentPct: number;            // 0-100 slider value
  monthlyRevenueAtPeak: number;     // revenue/month at full enrollment
  annualProjected: number;          // total projected first-year revenue
  month12MontlyRate: number;        // monthly rate at month 12
}

export interface ForecastResult {
  monthly: MonthlyProjection[];
  programs: ProgramForecast[];
  totalYear1Revenue: number;
  totalYear1Additional: number;
  month12MonthlyRate: number;
  currentAnnualRevenue: number;
}

export interface ForecastScenario {
  name: string;
  description: string;
  programs: { ccm: boolean; rpm: boolean; bhi: boolean; awv: boolean; emCoding: boolean };
  enrollmentPcts: { ccm: number; rpm: number; bhi: number; awv: number };
  result: ForecastResult;
}

export interface ForecastConfig {
  ccmEnabled: boolean;
  rpmEnabled: boolean;
  bhiEnabled: boolean;
  awvEnabled: boolean;
  emCodingEnabled: boolean;
  ccmEnrollmentPct: number;   // 0-100
  rpmEnrollmentPct: number;
  bhiEnrollmentPct: number;
  awvEnrollmentPct: number;
}

export const DEFAULT_CONFIG: ForecastConfig = {
  ccmEnabled: true,
  rpmEnabled: true,
  bhiEnabled: true,
  awvEnabled: true,
  emCodingEnabled: true,
  ccmEnrollmentPct: 50,
  rpmEnrollmentPct: 40,
  bhiEnrollmentPct: 30,
  awvEnrollmentPct: 70,
};

// ── Core Prediction Engine ────────────────────────────────

export function generateForecast(
  data: ScanResult,
  config: ForecastConfig = DEFAULT_CONFIG
): ForecastResult {
  const monthly: MonthlyProjection[] = [];
  let cumulative = 0;

  // Calculate enrollment targets based on config percentages
  const ccmTarget = Math.round(data.ccmGap.eligiblePatients * (config.ccmEnrollmentPct / 100));
  const rpmTarget = Math.round(data.rpmGap.eligiblePatients * (config.rpmEnrollmentPct / 100));
  const bhiTarget = Math.round(data.bhiGap.eligiblePatients * (config.bhiEnrollmentPct / 100));
  const awvTarget = Math.round(data.awvGap.eligiblePatients * (config.awvEnrollmentPct / 100));

  // E&M coding gap
  const emMonthlyGap = data.codingGap.annualGap / 12;

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let m = 1; m <= 12; m++) {
    const ramp = sigmoid(m, 5, 0.8);
    const emRamp = linearRamp(m, 6);

    // CCM: $62/patient/month for 99490
    const ccmPatients = Math.round(ccmTarget * ramp);
    const ccmRev = config.ccmEnabled ? ccmPatients * RATES.ccm99490 : 0;

    // RPM: $55 (99454) + $48 (99457) = $103/patient/month
    const rpmPatients = Math.round(rpmTarget * sigmoid(m, 6, 0.7)); // slightly slower ramp
    const rpmRev = config.rpmEnabled ? rpmPatients * (RATES.rpm99454 + RATES.rpm99457) : 0;

    // BHI: $51/patient/month for 99484
    const bhiPatients = Math.round(bhiTarget * sigmoid(m, 7, 0.6)); // slowest ramp
    const bhiRev = config.bhiEnabled ? bhiPatients * RATES.bhi99484 : 0;

    // AWV: Annual visits — ramp distributes across months
    // AWV revenue = annual eligible * (awvRamp fraction this month) * avg visit rate
    const awvVisitsThisMonth = config.awvEnabled
      ? Math.round((awvTarget / 12) * Math.min(1, ramp * 1.5))
      : 0;
    const awvAvgRate = (RATES.awvG0438 + RATES.awvG0439) / 2;
    const awvRev = awvVisitsThisMonth * awvAvgRate;

    // E&M Coding: linear ramp to full optimization
    const emRev = config.emCodingEnabled ? Math.round(emMonthlyGap * emRamp) : 0;

    const total = ccmRev + rpmRev + bhiRev + awvRev + emRev;
    cumulative += total;

    monthly.push({
      month: m,
      label: MONTHS[m - 1],
      ccm: ccmRev,
      rpm: rpmRev,
      bhi: bhiRev,
      awv: awvRev,
      emCoding: emRev,
      total,
      cumulative,
    });
  }

  // Program summaries
  const programs: ProgramForecast[] = [];

  if (data.ccmGap.eligiblePatients > 0) {
    const ccmAnnual = monthly.reduce((s, m) => s + m.ccm, 0);
    programs.push({
      programName: "Chronic Care Management",
      code: "99490",
      enabled: config.ccmEnabled,
      enrollmentTarget: ccmTarget,
      enrollmentPct: config.ccmEnrollmentPct,
      monthlyRevenueAtPeak: monthly[11].ccm,
      annualProjected: ccmAnnual,
      month12MontlyRate: monthly[11].ccm,
    });
  }

  if (data.rpmGap.eligiblePatients > 0) {
    const rpmAnnual = monthly.reduce((s, m) => s + m.rpm, 0);
    programs.push({
      programName: "Remote Patient Monitoring",
      code: "99454/99457",
      enabled: config.rpmEnabled,
      enrollmentTarget: rpmTarget,
      enrollmentPct: config.rpmEnrollmentPct,
      monthlyRevenueAtPeak: monthly[11].rpm,
      annualProjected: rpmAnnual,
      month12MontlyRate: monthly[11].rpm,
    });
  }

  if (data.bhiGap.eligiblePatients > 0) {
    const bhiAnnual = monthly.reduce((s, m) => s + m.bhi, 0);
    programs.push({
      programName: "Behavioral Health Integration",
      code: "99484",
      enabled: config.bhiEnabled,
      enrollmentTarget: bhiTarget,
      enrollmentPct: config.bhiEnrollmentPct,
      monthlyRevenueAtPeak: monthly[11].bhi,
      annualProjected: bhiAnnual,
      month12MontlyRate: monthly[11].bhi,
    });
  }

  if (data.awvGap.eligiblePatients > 0) {
    const awvAnnual = monthly.reduce((s, m) => s + m.awv, 0);
    programs.push({
      programName: "Annual Wellness Visits",
      code: "G0438/G0439",
      enabled: config.awvEnabled,
      enrollmentTarget: awvTarget,
      enrollmentPct: config.awvEnrollmentPct,
      monthlyRevenueAtPeak: monthly[11].awv,
      annualProjected: awvAnnual,
      month12MontlyRate: monthly[11].awv,
    });
  }

  if (data.codingGap.annualGap > 0) {
    programs.push({
      programName: "E&M Coding Optimization",
      code: "99213→99214/99215",
      enabled: config.emCodingEnabled,
      enrollmentTarget: 0,
      enrollmentPct: 100,
      monthlyRevenueAtPeak: monthly[11].emCoding,
      annualProjected: monthly.reduce((s, m) => s + m.emCoding, 0),
      month12MontlyRate: monthly[11].emCoding,
    });
  }

  const totalYear1 = monthly.reduce((s, m) => s + m.total, 0);
  const month12Rate = monthly[11].total;

  return {
    monthly,
    programs,
    totalYear1Revenue: totalYear1,
    totalYear1Additional: totalYear1,
    month12MonthlyRate: month12Rate,
    currentAnnualRevenue: data.billing.totalMedicarePayment,
  };
}

// ── Standalone Forecast (for public tool without ScanResult) ──

export interface StandaloneForecastInput {
  specialty: string;
  patientCount: number;
  chronicPct: number;        // 0-100 — % of patients with 2+ chronic conditions
  currentCcm: boolean;
  currentRpm: boolean;
  currentBhi: boolean;
  currentAwv: boolean;
  benchPct99213: number;
  benchPct99214: number;
  benchPct99215: number;
  avgRevenuePerPatient: number;
}

export function generateStandaloneForecast(
  input: StandaloneForecastInput,
  config: ForecastConfig = DEFAULT_CONFIG
): ForecastResult {
  const patients = input.patientCount;
  const chronicPct = input.chronicPct / 100;

  // Estimate eligible patients
  const ccmEligible = input.currentCcm ? 0 : Math.round(patients * chronicPct * 0.6);
  const rpmEligible = input.currentRpm ? 0 : Math.round(patients * chronicPct * 0.4);
  const bhiEligible = input.currentBhi ? 0 : Math.round(patients * 0.15);
  const awvEligible = input.currentAwv ? Math.round(patients * 0.3) : Math.round(patients * 0.7);

  // E&M coding gap estimate
  const emVisitsPerYear = Math.round(patients * 3.2); // avg 3.2 visits/patient
  const current213Pct = 0.35;
  const optimal214Pct = input.benchPct99214;
  const shift = Math.max(0, optimal214Pct - 0.5) * 0.6; // 60% of potential shift realizable
  const emAnnualGap = Math.round(emVisitsPerYear * shift * (RATES.em99214 - RATES.em99213));

  // Build a mock ScanResult-like structure for the engine
  const mockData: ScanResult = {
    provider: { npi: "", fullName: "", firstName: "", lastName: "", credential: "", specialty: input.specialty, taxonomyCode: "", address: { line1: "", line2: "", city: "", state: "", zip: "" }, phone: "", gender: "", entityType: "individual" },
    billing: {
      npi: "", specialty: input.specialty,
      totalMedicarePatients: patients, totalServices: emVisitsPerYear,
      totalMedicarePayment: Math.round(patients * input.avgRevenuePerPatient),
      em99213Count: Math.round(emVisitsPerYear * current213Pct),
      em99214Count: Math.round(emVisitsPerYear * 0.45),
      em99215Count: Math.round(emVisitsPerYear * 0.08),
      emTotalCount: emVisitsPerYear,
      ccmPatients: 0, ccmBilled: 0, rpmPatients: 0, rpmBilled: 0,
      bhiPatients: 0, bhiBilled: 0, awvCount: 0, awvBilled: 0,
      chronicDiabetesPct: chronicPct * 0.3, chronicHypertensionPct: chronicPct * 0.5,
      chronicHeartFailurePct: chronicPct * 0.1, chronicDepressionPct: 0.15, chronicCopdPct: chronicPct * 0.1,
    },
    benchmark: {
      specialty: input.specialty, avgMedicarePatients: patients,
      avgRevenuePerPatient: input.avgRevenuePerPatient,
      pct99213: input.benchPct99213, pct99214: input.benchPct99214, pct99215: input.benchPct99215,
      ccmAdoptionRate: 0.05, rpmAdoptionRate: 0.03, bhiAdoptionRate: 0.01, awvAdoptionRate: 0.35,
      avgChronicConditions: 2.5, chronicDiabetesPct: chronicPct * 0.3, chronicHypertensionPct: chronicPct * 0.5,
      chronicHeartFailurePct: chronicPct * 0.1, chronicDepressionPct: 0.15, chronicCopdPct: chronicPct * 0.1, avgHccRiskScore: 1.2,
    },
    totalMissedRevenue: 0,
    codingGap: {
      current99213Pct: current213Pct, current99214Pct: 0.45, current99215Pct: 0.08,
      optimal99213Pct: input.benchPct99213, optimal99214Pct: input.benchPct99214, optimal99215Pct: input.benchPct99215,
      annualGap: emAnnualGap, shiftsNeeded: "",
    },
    ccmGap: { programName: "CCM", code: "99490", eligiblePatients: ccmEligible, currentPatients: 0, captureRate: 0, revenuePerPatientPerMonth: RATES.ccm99490, currentAnnualRevenue: 0, potentialAnnualRevenue: ccmEligible * RATES.ccm99490 * 12, annualGap: ccmEligible * RATES.ccm99490 * 12 },
    rpmGap: { programName: "RPM", code: "99454", eligiblePatients: rpmEligible, currentPatients: 0, captureRate: 0, revenuePerPatientPerMonth: RATES.rpm99454 + RATES.rpm99457, currentAnnualRevenue: 0, potentialAnnualRevenue: rpmEligible * (RATES.rpm99454 + RATES.rpm99457) * 12, annualGap: rpmEligible * (RATES.rpm99454 + RATES.rpm99457) * 12 },
    bhiGap: { programName: "BHI", code: "99484", eligiblePatients: bhiEligible, currentPatients: 0, captureRate: 0, revenuePerPatientPerMonth: RATES.bhi99484, currentAnnualRevenue: 0, potentialAnnualRevenue: bhiEligible * RATES.bhi99484 * 12, annualGap: bhiEligible * RATES.bhi99484 * 12 },
    awvGap: { programName: "AWV", code: "G0438", eligiblePatients: awvEligible, currentPatients: 0, captureRate: 0, revenuePerPatientPerMonth: 0, currentAnnualRevenue: 0, potentialAnnualRevenue: awvEligible * ((RATES.awvG0438 + RATES.awvG0439) / 2), annualGap: awvEligible * ((RATES.awvG0438 + RATES.awvG0439) / 2) },
    actionPlan: [],
    scannedAt: new Date().toISOString(),
    dataSource: "estimated",
  };

  return generateForecast(mockData, config);
}

// ── Preset Scenarios ──────────────────────────────────────

export function generateScenarios(data: ScanResult): ForecastScenario[] {
  const scenarios: ForecastScenario[] = [];

  // Scenario A: CCM Only
  const ccmOnly = generateForecast(data, {
    ...DEFAULT_CONFIG,
    rpmEnabled: false,
    bhiEnabled: false,
    awvEnabled: false,
    emCodingEnabled: false,
  });
  scenarios.push({
    name: "CCM Only",
    description: "Add Chronic Care Management (99490) with 50% enrollment",
    programs: { ccm: true, rpm: false, bhi: false, awv: false, emCoding: false },
    enrollmentPcts: { ccm: 50, rpm: 0, bhi: 0, awv: 0 },
    result: ccmOnly,
  });

  // Scenario B: CCM + RPM
  const ccmRpm = generateForecast(data, {
    ...DEFAULT_CONFIG,
    bhiEnabled: false,
    awvEnabled: false,
    emCodingEnabled: false,
  });
  scenarios.push({
    name: "CCM + RPM",
    description: "Add CCM and Remote Patient Monitoring together",
    programs: { ccm: true, rpm: true, bhi: false, awv: false, emCoding: false },
    enrollmentPcts: { ccm: 50, rpm: 40, bhi: 0, awv: 0 },
    result: ccmRpm,
  });

  // Scenario C: Full Optimization
  const fullOpt = generateForecast(data, DEFAULT_CONFIG);
  scenarios.push({
    name: "Full Optimization",
    description: "All programs + E&M coding optimization",
    programs: { ccm: true, rpm: true, bhi: true, awv: true, emCoding: true },
    enrollmentPcts: { ccm: 50, rpm: 40, bhi: 30, awv: 70 },
    result: fullOpt,
  });

  // Scenario D: Aggressive
  const aggressive = generateForecast(data, {
    ccmEnabled: true, rpmEnabled: true, bhiEnabled: true, awvEnabled: true, emCodingEnabled: true,
    ccmEnrollmentPct: 80, rpmEnrollmentPct: 60, bhiEnrollmentPct: 50, awvEnrollmentPct: 90,
  });
  scenarios.push({
    name: "Aggressive Growth",
    description: "Maximum enrollment targets with accelerated ramp-up",
    programs: { ccm: true, rpm: true, bhi: true, awv: true, emCoding: true },
    enrollmentPcts: { ccm: 80, rpm: 60, bhi: 50, awv: 90 },
    result: aggressive,
  });

  return scenarios;
}

// ── Format Helpers ────────────────────────────────────────

export function formatForecastCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount.toLocaleString()}`;
}
