import {
  NPPESProvider,
  ProviderBillingData,
  CodingGap,
  ProgramGap,
  ActionItem,
  ScanResult,
} from "./types";
import { getBenchmark } from "./benchmarks";

// Medicare payment rates (2024 national averages)
const RATES = {
  "99213": 92.03,
  "99214": 130.04,
  "99215": 176.15,
  // CCM
  "99490": 66.0, // first 20 min
  "99439": 47.0, // each additional 20 min
  // RPM
  "99453": 19.46, // setup
  "99454": 55.72, // device supply/month
  "99457": 48.80, // first 20 min interactive
  "99458": 38.64, // additional 20 min
  // BHI
  "99484": 48.56,
  // AWV
  G0438: 174.79, // initial AWV
  G0439: 118.88, // subsequent AWV
};

/**
 * Generates simulated billing data for a provider based on their specialty.
 * Uses specialty benchmarks with realistic variance to create plausible billing patterns.
 * This will be replaced with real CMS data once the database pipeline is built.
 */
export function simulateBillingData(
  provider: NPPESProvider
): ProviderBillingData {
  const bench = getBenchmark(provider.specialty);

  // Deterministic seed from NPI for consistent results
  const seed = parseInt(provider.npi.slice(-6), 10);
  const rng = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x); // 0-1
  };

  // Vary patient count around benchmark
  const patientVariance = 0.7 + rng(1) * 0.6; // 0.7x to 1.3x
  const totalPatients = Math.round(
    bench.avgMedicarePatients * patientVariance
  );

  // E&M visits — most providers skew toward 99213 (undercoding)
  const emVisitsPerPatient = 2.5 + rng(2) * 1.5; // 2.5 to 4 visits/year
  const emTotal = Math.round(totalPatients * emVisitsPerPatient);

  // Simulate undercoding: shift distribution toward 99213 vs optimal
  const undercodeShift = 0.08 + rng(3) * 0.12; // 8-20% shift down
  const cur99213Pct = Math.min(
    0.65,
    bench.pct99213 + undercodeShift
  );
  const cur99215Pct = Math.max(
    0.05,
    bench.pct99215 - undercodeShift * 0.6
  );
  const cur99214Pct = 1 - cur99213Pct - cur99215Pct;

  // Program adoption — most providers under-adopt
  const adoptionFactor = 0.1 + rng(4) * 0.4; // 10-50% of benchmark adoption

  // CCM: eligible = patients with 2+ chronic conditions
  const twoChronicPct =
    bench.chronicDiabetesPct * 0.6 +
    bench.chronicHypertensionPct * 0.5 +
    bench.chronicHeartFailurePct * 0.8;
  const ccmEligible = Math.round(totalPatients * Math.min(twoChronicPct, 0.45));
  const ccmCurrent = Math.round(ccmEligible * adoptionFactor * bench.ccmAdoptionRate * 3);

  // RPM: eligible = hypertension + diabetes + COPD patients
  const rpmEligiblePct =
    bench.chronicHypertensionPct * 0.4 +
    bench.chronicDiabetesPct * 0.3 +
    bench.chronicCopdPct * 0.5;
  const rpmEligible = Math.round(totalPatients * Math.min(rpmEligiblePct, 0.35));
  const rpmCurrent = Math.round(rpmEligible * adoptionFactor * bench.rpmAdoptionRate * 2);

  // BHI: eligible = depression + anxiety patients
  const bhiEligible = Math.round(
    totalPatients * bench.chronicDepressionPct * 0.7
  );
  const bhiCurrent = Math.round(bhiEligible * adoptionFactor * bench.bhiAdoptionRate * 2);

  // AWV: eligible = all Medicare patients (1 per year)
  const awvCurrent = Math.round(totalPatients * adoptionFactor * bench.awvAdoptionRate * 1.5);

  // Calculate total payment
  const emRevenue =
    Math.round(emTotal * cur99213Pct) * RATES["99213"] +
    Math.round(emTotal * cur99214Pct) * RATES["99214"] +
    Math.round(emTotal * cur99215Pct) * RATES["99215"];
  const ccmRevenue = ccmCurrent * RATES["99490"] * 12;
  const rpmRevenue = rpmCurrent * (RATES["99454"] + RATES["99457"]) * 12;
  const bhiRevenue = bhiCurrent * RATES["99484"] * 12;
  const awvRevenue = awvCurrent * RATES["G0439"];

  return {
    npi: provider.npi,
    specialty: provider.specialty,
    totalMedicarePatients: totalPatients,
    totalServices: emTotal + ccmCurrent * 12 + rpmCurrent * 12 + bhiCurrent * 12 + awvCurrent,
    totalMedicarePayment: emRevenue + ccmRevenue + rpmRevenue + bhiRevenue + awvRevenue,
    em99213Count: Math.round(emTotal * cur99213Pct),
    em99214Count: Math.round(emTotal * cur99214Pct),
    em99215Count: Math.round(emTotal * cur99215Pct),
    emTotalCount: emTotal,
    ccmPatients: ccmCurrent,
    ccmBilled: ccmRevenue,
    rpmPatients: rpmCurrent,
    rpmBilled: rpmRevenue,
    bhiPatients: bhiCurrent,
    bhiBilled: bhiRevenue,
    awvCount: awvCurrent,
    awvBilled: awvRevenue,
    chronicDiabetesPct: bench.chronicDiabetesPct,
    chronicHypertensionPct: bench.chronicHypertensionPct,
    chronicHeartFailurePct: bench.chronicHeartFailurePct,
    chronicDepressionPct: bench.chronicDepressionPct,
    chronicCopdPct: bench.chronicCopdPct,
  };
}

function calcCodingGap(billing: ProviderBillingData): CodingGap {
  const bench = getBenchmark(billing.specialty);
  const total = billing.emTotalCount;

  const cur213 = billing.em99213Count / total;
  const cur214 = billing.em99214Count / total;
  const cur215 = billing.em99215Count / total;

  // Current revenue
  const currentRev =
    billing.em99213Count * RATES["99213"] +
    billing.em99214Count * RATES["99214"] +
    billing.em99215Count * RATES["99215"];

  // Optimal revenue
  const opt213 = Math.round(total * bench.pct99213);
  const opt214 = Math.round(total * bench.pct99214);
  const opt215 = total - opt213 - opt214;
  const optimalRev =
    opt213 * RATES["99213"] +
    opt214 * RATES["99214"] +
    opt215 * RATES["99215"];

  const gap = Math.max(0, optimalRev - currentRev);

  // Generate shift description
  const shift213 = Math.round((bench.pct99213 - cur213) * total);
  const shift215 = Math.round((bench.pct99215 - cur215) * total);
  let shifts = "";
  if (shift213 < 0 && shift215 > 0) {
    shifts = `Shift ~${Math.abs(shift213)} visits from 99213 to higher-level codes`;
  } else {
    shifts = "E&M distribution is close to benchmark";
  }

  return {
    current99213Pct: cur213,
    current99214Pct: cur214,
    current99215Pct: cur215,
    optimal99213Pct: bench.pct99213,
    optimal99214Pct: bench.pct99214,
    optimal99215Pct: bench.pct99215,
    annualGap: Math.round(gap),
    shiftsNeeded: shifts,
  };
}

function calcProgramGap(
  programName: string,
  code: string,
  eligiblePatients: number,
  currentPatients: number,
  revenuePerMonth: number,
  currentBilled: number
): ProgramGap {
  const potentialAnnual = eligiblePatients * revenuePerMonth * 12;
  const currentAnnual = currentBilled;
  const gap = Math.max(0, potentialAnnual - currentAnnual);
  const captureRate = eligiblePatients > 0 ? currentPatients / eligiblePatients : 0;

  return {
    programName,
    code,
    eligiblePatients,
    currentPatients,
    captureRate,
    revenuePerPatientPerMonth: revenuePerMonth,
    currentAnnualRevenue: Math.round(currentAnnual),
    potentialAnnualRevenue: Math.round(potentialAnnual),
    annualGap: Math.round(gap),
  };
}

function generateActionPlan(
  codingGap: CodingGap,
  ccm: ProgramGap,
  rpm: ProgramGap,
  bhi: ProgramGap,
  awv: ProgramGap
): ActionItem[] {
  const items: ActionItem[] = [];

  // Sort opportunities by revenue impact
  const opportunities = [
    { gap: codingGap.annualGap, cat: "coding" as const },
    { gap: ccm.annualGap, cat: "ccm" as const },
    { gap: rpm.annualGap, cat: "rpm" as const },
    { gap: bhi.annualGap, cat: "bhi" as const },
    { gap: awv.annualGap, cat: "awv" as const },
  ].sort((a, b) => b.gap - a.gap);

  const actionTemplates = {
    coding: {
      title: "Optimize E&M Coding Documentation",
      description:
        "Review documentation templates to support higher-level E&M codes. Focus on documenting medical decision-making complexity, number of diagnoses addressed, and data reviewed. Consider audit of recent claims for undercoding patterns.",
      timeline: "Weeks 1-4",
      difficulty: "easy" as const,
    },
    awv: {
      title: "Launch Annual Wellness Visit Program",
      description:
        "Implement AWV workflow with Health Risk Assessment (HRA) forms. Train MA staff on AWV intake procedures. Send outreach letters to Medicare patients who haven't had an AWV in the past 12 months.",
      timeline: "Weeks 2-6",
      difficulty: "easy" as const,
    },
    ccm: {
      title: "Implement Chronic Care Management (99490)",
      description:
        "Identify patients with 2+ chronic conditions. Set up CCM consent process, care plan templates, and monthly time tracking. Start with highest-complexity patients — those with diabetes + hypertension + one more condition.",
      timeline: "Weeks 3-8",
      difficulty: "medium" as const,
    },
    rpm: {
      title: "Deploy Remote Patient Monitoring",
      description:
        "Partner with an RPM device vendor for blood pressure monitors and glucose meters. Enroll hypertension and diabetes patients first. Set up monitoring dashboard and alert workflows for clinical staff.",
      timeline: "Weeks 6-12",
      difficulty: "hard" as const,
    },
    bhi: {
      title: "Add Behavioral Health Integration",
      description:
        "Implement PHQ-9 depression screening at all visits. Train providers on BHI billing (99484). Develop care plans for patients screening positive. Consider collaborative care model with psychiatry.",
      timeline: "Weeks 4-10",
      difficulty: "medium" as const,
    },
  };

  opportunities.forEach((opp, i) => {
    if (opp.gap > 0) {
      const tmpl = actionTemplates[opp.cat];
      items.push({
        priority: i + 1,
        title: tmpl.title,
        description: tmpl.description,
        timeline: tmpl.timeline,
        estimatedRevenue: opp.gap,
        difficulty: tmpl.difficulty,
        category: opp.cat,
      });
    }
  });

  return items;
}

export function calculateScanResult(
  provider: NPPESProvider
): ScanResult {
  const billing = simulateBillingData(provider);
  const bench = getBenchmark(provider.specialty);

  const codingGap = calcCodingGap(billing);

  // CCM gap
  const twoChronicPct =
    bench.chronicDiabetesPct * 0.6 +
    bench.chronicHypertensionPct * 0.5 +
    bench.chronicHeartFailurePct * 0.8;
  const ccmEligible = Math.round(
    billing.totalMedicarePatients * Math.min(twoChronicPct, 0.45)
  );
  const ccmGap = calcProgramGap(
    "Chronic Care Management",
    "99490",
    ccmEligible,
    billing.ccmPatients,
    RATES["99490"],
    billing.ccmBilled
  );

  // RPM gap
  const rpmEligiblePct =
    bench.chronicHypertensionPct * 0.4 +
    bench.chronicDiabetesPct * 0.3 +
    bench.chronicCopdPct * 0.5;
  const rpmEligible = Math.round(
    billing.totalMedicarePatients * Math.min(rpmEligiblePct, 0.35)
  );
  const rpmGap = calcProgramGap(
    "Remote Patient Monitoring",
    "99453-99458",
    rpmEligible,
    billing.rpmPatients,
    RATES["99454"] + RATES["99457"],
    billing.rpmBilled
  );

  // BHI gap
  const bhiEligible = Math.round(
    billing.totalMedicarePatients * bench.chronicDepressionPct * 0.7
  );
  const bhiGap = calcProgramGap(
    "Behavioral Health Integration",
    "99484",
    bhiEligible,
    billing.bhiPatients,
    RATES["99484"],
    billing.bhiBilled
  );

  // AWV gap
  const awvEligible = billing.totalMedicarePatients;
  const awvGap = calcProgramGap(
    "Annual Wellness Visits",
    "G0438/G0439",
    awvEligible,
    billing.awvCount,
    RATES["G0439"] / 12, // monthly equivalent
    billing.awvBilled
  );
  // Override AWV calculation — it's per-visit, not monthly
  awvGap.revenuePerPatientPerMonth = RATES["G0439"];
  awvGap.potentialAnnualRevenue = awvEligible * RATES["G0439"];
  awvGap.annualGap = Math.max(
    0,
    awvGap.potentialAnnualRevenue - awvGap.currentAnnualRevenue
  );

  const totalMissed =
    codingGap.annualGap +
    ccmGap.annualGap +
    rpmGap.annualGap +
    bhiGap.annualGap +
    awvGap.annualGap;

  const actionPlan = generateActionPlan(codingGap, ccmGap, rpmGap, bhiGap, awvGap);

  return {
    provider,
    billing,
    benchmark: bench,
    totalMissedRevenue: Math.round(totalMissed),
    codingGap,
    ccmGap,
    rpmGap,
    bhiGap,
    awvGap,
    actionPlan,
    scannedAt: new Date().toISOString(),
  };
}
