/**
 * Revenue Opportunity Engine — computes top 3 unique revenue gaps per page.
 *
 * Pure math, no AI. Uses CMS data + benchmarks to calculate specific,
 * quantified revenue opportunities unique to each state/specialty/code page.
 *
 * Each opportunity includes a confidence level based on sample size.
 */

import {
  getStateProgramCounts,
  getStateSpecialtyProgramCounts,
  getStateSpecialties,
  getCodeStats,
  getRelatedCodes,
  formatCurrency,
} from "./db-queries";
import { SPECIALTY_BENCHMARKS } from "./benchmarks";

// ── Medicare payment rates (2024) ──────────────────────

const RATES = {
  CCM_MONTHLY: 66.0,    // 99490
  RPM_MONTHLY: 55.72,   // 99454
  BHI_MONTHLY: 48.56,   // 99484
  AWV_INITIAL: 174.79,  // G0438
  AWV_SUBSEQUENT: 118.88, // G0439
  EM_99213: 92.03,
  EM_99214: 130.04,
  EM_99215: 176.15,
};

// ── Types ──────────────────────────────────────────────

export interface RevenueOpportunity {
  rank: number;
  category: "ccm" | "rpm" | "bhi" | "awv" | "coding";
  title: string;
  description: string;
  estimatedRevenue: number;
  currentRate: number;
  targetRate: number;
  affectedProviders: number;
  confidence: "high" | "medium" | "low";
}

function getConfidence(count: number): "high" | "medium" | "low" {
  if (count >= 100) return "high";
  if (count >= 20) return "medium";
  return "low";
}

// ── State-Level Opportunities ──────────────────────────

export async function getStateOpportunities(stateAbbr: string, prefetchedPrograms?: any): Promise<RevenueOpportunity[]> {
  const programs = prefetchedPrograms || await getStateProgramCounts(stateAbbr);
  if (programs.totalProviders === 0) return [];

  const confidence = getConfidence(programs.totalProviders);

  // Get average national benchmarks across all specialties
  const allBenchmarks = Object.values(SPECIALTY_BENCHMARKS);
  const avgNationalCcm = allBenchmarks.reduce((s, b) => s + b.ccmAdoptionRate, 0) / allBenchmarks.length;
  const avgNationalRpm = allBenchmarks.reduce((s, b) => s + b.rpmAdoptionRate, 0) / allBenchmarks.length;
  const avgNationalBhi = allBenchmarks.reduce((s, b) => s + b.bhiAdoptionRate, 0) / allBenchmarks.length;
  const avgNationalAwv = allBenchmarks.reduce((s, b) => s + b.awvAdoptionRate, 0) / allBenchmarks.length;

  const currentCcm = programs.ccmBillers / programs.totalProviders;
  const currentRpm = programs.rpmBillers / programs.totalProviders;
  const currentBhi = programs.bhiBillers / programs.totalProviders;
  const currentAwv = programs.awvBillers / programs.totalProviders;

  const opportunities: Omit<RevenueOpportunity, "rank">[] = [];

  // CCM opportunity
  if (currentCcm < avgNationalCcm) {
    const gap = avgNationalCcm - currentCcm;
    const additionalProviders = Math.round(gap * programs.totalProviders);
    const revenue = additionalProviders * RATES.CCM_MONTHLY * 12 * 15; // ~15 patients per adopter
    opportunities.push({
      category: "ccm",
      title: "Chronic Care Management (99490)",
      description: `Only ${(currentCcm * 100).toFixed(1)}% of providers bill CCM vs ${(avgNationalCcm * 100).toFixed(1)}% national average. ${additionalProviders.toLocaleString()} additional providers could adopt CCM to close this gap.`,
      estimatedRevenue: revenue,
      currentRate: currentCcm,
      targetRate: avgNationalCcm,
      affectedProviders: additionalProviders,
      confidence,
    });
  }

  // RPM opportunity
  if (currentRpm < avgNationalRpm) {
    const gap = avgNationalRpm - currentRpm;
    const additionalProviders = Math.round(gap * programs.totalProviders);
    const revenue = additionalProviders * RATES.RPM_MONTHLY * 12 * 20;
    opportunities.push({
      category: "rpm",
      title: "Remote Patient Monitoring (99454)",
      description: `RPM adoption is ${(currentRpm * 100).toFixed(1)}% vs ${(avgNationalRpm * 100).toFixed(1)}% nationally. ${additionalProviders.toLocaleString()} providers could implement RPM programs.`,
      estimatedRevenue: revenue,
      currentRate: currentRpm,
      targetRate: avgNationalRpm,
      affectedProviders: additionalProviders,
      confidence,
    });
  }

  // BHI opportunity
  if (currentBhi < avgNationalBhi) {
    const gap = avgNationalBhi - currentBhi;
    const additionalProviders = Math.round(gap * programs.totalProviders);
    const revenue = additionalProviders * RATES.BHI_MONTHLY * 12 * 10;
    opportunities.push({
      category: "bhi",
      title: "Behavioral Health Integration (99484)",
      description: `BHI adoption at ${(currentBhi * 100).toFixed(1)}% is below the ${(avgNationalBhi * 100).toFixed(1)}% national benchmark. ${additionalProviders.toLocaleString()} providers could add depression screening and BHI services.`,
      estimatedRevenue: revenue,
      currentRate: currentBhi,
      targetRate: avgNationalBhi,
      affectedProviders: additionalProviders,
      confidence,
    });
  }

  // AWV opportunity
  if (currentAwv < avgNationalAwv) {
    const gap = avgNationalAwv - currentAwv;
    const additionalProviders = Math.round(gap * programs.totalProviders);
    const revenue = additionalProviders * RATES.AWV_SUBSEQUENT * 50; // ~50 AWVs per adopter
    opportunities.push({
      category: "awv",
      title: "Annual Wellness Visits (G0438/G0439)",
      description: `AWV completion at ${(currentAwv * 100).toFixed(1)}% trails the ${(avgNationalAwv * 100).toFixed(1)}% national average. ${additionalProviders.toLocaleString()} additional providers could offer AWV services.`,
      estimatedRevenue: revenue,
      currentRate: currentAwv,
      targetRate: avgNationalAwv,
      affectedProviders: additionalProviders,
      confidence,
    });
  }

  // Sort by revenue impact and return top 3
  return opportunities
    .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
    .slice(0, 3)
    .map((o, i) => ({ ...o, rank: i + 1 }));
}

// ── State + Specialty Opportunities ────────────────────

export async function getStateSpecialtyOpportunities(
  specialty: string,
  stateAbbr: string
): Promise<RevenueOpportunity[]> {
  const programs = await getStateSpecialtyProgramCounts(specialty, stateAbbr);
  if (programs.totalProviders === 0) return [];

  const benchmark = SPECIALTY_BENCHMARKS[specialty];
  if (!benchmark) return [];

  const confidence = getConfidence(programs.totalProviders);

  const currentCcm = programs.ccmBillers / programs.totalProviders;
  const currentRpm = programs.rpmBillers / programs.totalProviders;
  const currentBhi = programs.bhiBillers / programs.totalProviders;
  const currentAwv = programs.awvBillers / programs.totalProviders;

  const opportunities: Omit<RevenueOpportunity, "rank">[] = [];

  // CCM
  if (currentCcm < benchmark.ccmAdoptionRate) {
    const gap = benchmark.ccmAdoptionRate - currentCcm;
    const additionalProviders = Math.round(gap * programs.totalProviders);
    const patientsPerProvider = Math.round(benchmark.avgMedicarePatients * benchmark.chronicHypertensionPct * 0.3);
    const revenue = additionalProviders * RATES.CCM_MONTHLY * 12 * patientsPerProvider;
    opportunities.push({
      category: "ccm",
      title: "CCM Expansion (99490)",
      description: `${(currentCcm * 100).toFixed(1)}% of ${specialty} providers bill CCM vs ${(benchmark.ccmAdoptionRate * 100).toFixed(1)}% specialty benchmark. ${additionalProviders.toLocaleString()} additional providers could enroll ~${patientsPerProvider} eligible patients each.`,
      estimatedRevenue: revenue,
      currentRate: currentCcm,
      targetRate: benchmark.ccmAdoptionRate,
      affectedProviders: additionalProviders,
      confidence,
    });
  }

  // RPM
  if (currentRpm < benchmark.rpmAdoptionRate) {
    const gap = benchmark.rpmAdoptionRate - currentRpm;
    const additionalProviders = Math.round(gap * programs.totalProviders);
    const revenue = additionalProviders * RATES.RPM_MONTHLY * 12 * 20;
    opportunities.push({
      category: "rpm",
      title: "RPM Program Launch (99454)",
      description: `RPM adoption at ${(currentRpm * 100).toFixed(1)}% is below the ${(benchmark.rpmAdoptionRate * 100).toFixed(1)}% ${specialty} benchmark. ${additionalProviders.toLocaleString()} providers could implement remote monitoring.`,
      estimatedRevenue: revenue,
      currentRate: currentRpm,
      targetRate: benchmark.rpmAdoptionRate,
      affectedProviders: additionalProviders,
      confidence,
    });
  }

  // BHI
  if (currentBhi < benchmark.bhiAdoptionRate) {
    const gap = benchmark.bhiAdoptionRate - currentBhi;
    const additionalProviders = Math.round(gap * programs.totalProviders);
    const revenue = additionalProviders * RATES.BHI_MONTHLY * 12 * 10;
    opportunities.push({
      category: "bhi",
      title: "BHI Services (99484)",
      description: `BHI at ${(currentBhi * 100).toFixed(1)}% vs ${(benchmark.bhiAdoptionRate * 100).toFixed(1)}% benchmark. ${additionalProviders.toLocaleString()} ${specialty} providers could add behavioral health screening.`,
      estimatedRevenue: revenue,
      currentRate: currentBhi,
      targetRate: benchmark.bhiAdoptionRate,
      affectedProviders: additionalProviders,
      confidence,
    });
  }

  // AWV
  if (currentAwv < benchmark.awvAdoptionRate) {
    const gap = benchmark.awvAdoptionRate - currentAwv;
    const additionalProviders = Math.round(gap * programs.totalProviders);
    const revenue = additionalProviders * RATES.AWV_SUBSEQUENT * 40;
    opportunities.push({
      category: "awv",
      title: "AWV Growth (G0438/G0439)",
      description: `AWV rate of ${(currentAwv * 100).toFixed(1)}% is ${((benchmark.awvAdoptionRate - currentAwv) * 100).toFixed(1)} percentage points below the ${(benchmark.awvAdoptionRate * 100).toFixed(1)}% ${specialty} target.`,
      estimatedRevenue: revenue,
      currentRate: currentAwv,
      targetRate: benchmark.awvAdoptionRate,
      affectedProviders: additionalProviders,
      confidence,
    });
  }

  return opportunities
    .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
    .slice(0, 3)
    .map((o, i) => ({ ...o, rank: i + 1 }));
}

// ── Code-Level Opportunities ───────────────────────────

export async function getCodeOpportunities(code: string): Promise<RevenueOpportunity[]> {
  const [stats, related] = await Promise.all([
    getCodeStats(code),
    getRelatedCodes(code, 5),
  ]);

  if (!stats) return [];

  const opportunities: Omit<RevenueOpportunity, "rank">[] = [];
  const confidence = getConfidence(stats.totalProviders);

  // Compare to higher-value related codes
  for (const rel of related) {
    if (rel.avgPayment > stats.avgPayment) {
      const paymentDelta = rel.avgPayment - stats.avgPayment;
      const potentialRevenue = paymentDelta * stats.totalProviders * 20; // ~20 services per provider
      opportunities.push({
        category: "coding",
        title: `Upgrade to ${rel.hcpcs_code}`,
        description: `${rel.hcpcs_code} pays ${formatCurrency(rel.avgPayment)}/service vs ${formatCurrency(stats.avgPayment)} for ${code}. ${stats.totalProviders.toLocaleString()} providers billing ${code} could evaluate documentation for ${rel.hcpcs_code} qualification.`,
        estimatedRevenue: potentialRevenue,
        currentRate: 0,
        targetRate: 0,
        affectedProviders: stats.totalProviders,
        confidence,
      });
    }
  }

  return opportunities
    .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
    .slice(0, 3)
    .map((o, i) => ({ ...o, rank: i + 1 }));
}
