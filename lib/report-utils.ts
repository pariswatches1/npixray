/**
 * Shared utilities for report card pages.
 * Grade calculation, share text generation, missed revenue estimation.
 * No Node.js dependencies — safe for both server and client components.
 */

import type { ProviderRow, BenchmarkRow } from "@/lib/db-queries";
import { BENCHMARKS } from "@/lib/benchmark-data";

// ── Grade calculation ───────────────────────────────────────

export interface GradeResult {
  grade: string;
  color: string;       // Tailwind text color class
  bgColor: string;     // Tailwind background color class
  borderColor: string; // Tailwind border color class
  label: string;       // Human-readable label
}

/**
 * Calculate a letter grade (A-F) based on revenue capture rate.
 * captureRate: 0-1 (proportion of potential revenue being captured)
 *   A: 90%+  — Excellent
 *   B: 75-89% — Good
 *   C: 60-74% — Average
 *   D: 45-59% — Below Average
 *   F: <45%  — Needs Improvement
 */
export function calculateGrade(captureRate: number): GradeResult {
  const rate = Math.max(0, Math.min(1, captureRate));

  if (rate >= 0.90) {
    return {
      grade: "A",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500",
      borderColor: "border-emerald-500",
      label: "Excellent",
    };
  }
  if (rate >= 0.75) {
    return {
      grade: "B",
      color: "text-blue-500",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-500",
      label: "Good",
    };
  }
  if (rate >= 0.60) {
    return {
      grade: "C",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500",
      borderColor: "border-yellow-500",
      label: "Average",
    };
  }
  if (rate >= 0.45) {
    return {
      grade: "D",
      color: "text-orange-500",
      bgColor: "bg-orange-500",
      borderColor: "border-orange-500",
      label: "Below Average",
    };
  }
  return {
    grade: "F",
    color: "text-red-500",
    bgColor: "bg-red-500",
    borderColor: "border-red-500",
    label: "Needs Improvement",
  };
}

// ── Share text generation ───────────────────────────────────

export interface ShareText {
  twitter: string;
  linkedin: string;
}

export function generateShareText(
  type: "state" | "specialty" | "city",
  name: string,
  missedRevenue: string,
  grade: string
): ShareText {
  const typeLabel =
    type === "state"
      ? "state"
      : type === "specialty"
        ? "specialty"
        : "city";

  const twitter = `${name} gets a "${grade}" on its 2026 Medicare Revenue Report Card. ${missedRevenue} in estimated missed revenue across the ${typeLabel}. See the full analysis from @NPIxray:`;

  const linkedin = `I just reviewed the 2026 Medicare Revenue Report Card for ${name}.

Key findings:
- Overall Grade: ${grade}
- Estimated Missed Revenue: ${missedRevenue}
- Low adoption of care management programs (CCM, RPM, BHI, AWV)

The data comes directly from CMS public records — every medical practice can see exactly how much revenue they're leaving on the table.

See the full ${name} report card:`;

  return { twitter, linkedin };
}

// ── Missed revenue estimation ───────────────────────────────

/**
 * Estimate missed revenue for a group of providers by comparing their actual
 * billings to specialty benchmarks. Factors in:
 * 1. E&M upcoding gap (difference between actual and benchmark 99214/99215 rates)
 * 2. CCM/RPM/BHI/AWV adoption gap
 * 3. Revenue per patient gap vs specialty benchmark
 */
export function estimateMissedRevenue(
  providers: ProviderRow[],
  benchmarks: BenchmarkRow[]
): number {
  if (!providers.length) return 0;

  const benchmarkMap = new Map<string, BenchmarkRow>();
  for (const b of benchmarks) {
    benchmarkMap.set(b.specialty, b);
  }

  let totalMissed = 0;

  for (const provider of providers) {
    const benchmark = benchmarkMap.get(provider.specialty);
    if (!benchmark || !provider.total_beneficiaries) continue;

    let providerMissed = 0;

    // 1. E&M coding gap — estimate revenue from upgrading E&M distribution
    const emTotal = provider.em_total || 1;
    const actual214Rate = emTotal > 0 ? (provider.em_99214 || 0) / emTotal : 0;
    const actual215Rate = emTotal > 0 ? (provider.em_99215 || 0) / emTotal : 0;
    const benchmark214Rate = benchmark.pct_99214 || 0;
    const benchmark215Rate = benchmark.pct_99215 || 0;

    // Average revenue uplift per visit for higher-level codes
    const uplift214 = 40; // ~$40 more per 99214 vs 99213
    const uplift215 = 75; // ~$75 more per 99215 vs 99214

    if (benchmark214Rate > actual214Rate) {
      const gap = (benchmark214Rate - actual214Rate) * emTotal;
      providerMissed += gap * uplift214;
    }
    if (benchmark215Rate > actual215Rate) {
      const gap = (benchmark215Rate - actual215Rate) * emTotal;
      providerMissed += gap * uplift215;
    }

    // 2. Care management program gaps
    const patients = provider.total_beneficiaries;

    // CCM gap: ~$62/patient/month * eligible patients * 12 months
    const hasCCM = (provider.ccm_99490_services || 0) > 0;
    if (!hasCCM && (benchmark.ccm_adoption_rate || 0) > 0.02) {
      const eligiblePct = Math.min(benchmark.ccm_adoption_rate * 3, 0.25);
      providerMissed += patients * eligiblePct * 62 * 6; // conservative: 6 months
    }

    // RPM gap: ~$120/patient/month
    const hasRPM = (provider.rpm_99454_services || 0) > 0 || (provider.rpm_99457_services || 0) > 0;
    if (!hasRPM && (benchmark.rpm_adoption_rate || 0) > 0.01) {
      const eligiblePct = Math.min(benchmark.rpm_adoption_rate * 2, 0.15);
      providerMissed += patients * eligiblePct * 120 * 4; // conservative: 4 months
    }

    // AWV gap: ~$175 per visit
    const hasAWV = (provider.awv_g0438_services || 0) > 0 || (provider.awv_g0439_services || 0) > 0;
    if (!hasAWV && (benchmark.awv_adoption_rate || 0) > 0.1) {
      const eligiblePct = Math.min(benchmark.awv_adoption_rate, 0.5);
      providerMissed += patients * eligiblePct * 175;
    }

    // BHI gap: ~$50/patient/month
    const hasBHI = (provider.bhi_99484_services || 0) > 0;
    if (!hasBHI && (benchmark.bhi_adoption_rate || 0) > 0.01) {
      const eligiblePct = Math.min(benchmark.bhi_adoption_rate * 2, 0.1);
      providerMissed += patients * eligiblePct * 50 * 4;
    }

    totalMissed += providerMissed;
  }

  return Math.round(totalMissed);
}

/**
 * Simpler estimation using only benchmarks (no provider-level data needed).
 * Used for quick estimates on index/listing pages.
 */
export function estimateMissedRevenueFromBenchmark(
  providerCount: number,
  avgPayment: number,
  specialty?: string
): number {
  const benchmark = specialty ? BENCHMARKS[specialty] : null;

  // Base assumption: average practice captures ~65% of potential revenue
  const captureRate = 0.65;
  const potentialPerProvider = avgPayment / captureRate;
  const gapPerProvider = potentialPerProvider - avgPayment;

  // Adjust for care management opportunity
  let cmMultiplier = 1.0;
  if (benchmark) {
    const lowCCM = (benchmark.ccmAdoptionRate || 0) < 0.05;
    const lowRPM = (benchmark.rpmAdoptionRate || 0) < 0.03;
    const lowAWV = (benchmark.awvAdoptionRate || 0) < 0.2;
    if (lowCCM) cmMultiplier += 0.15;
    if (lowRPM) cmMultiplier += 0.1;
    if (lowAWV) cmMultiplier += 0.1;
  }

  return Math.round(gapPerProvider * providerCount * cmMultiplier * 0.4);
}

/**
 * Calculate a capture rate for grading based on provider data and benchmarks.
 * Returns a number 0-1 representing the percentage of potential revenue captured.
 */
export function calculateCaptureRate(
  providers: ProviderRow[],
  benchmarks: BenchmarkRow[]
): number {
  if (!providers.length) return 0.5;

  const benchmarkMap = new Map<string, BenchmarkRow>();
  for (const b of benchmarks) {
    benchmarkMap.set(b.specialty, b);
  }

  let totalScore = 0;
  let matchedProviders = 0;

  for (const provider of providers) {
    const benchmark = benchmarkMap.get(provider.specialty);
    if (!benchmark || !provider.total_beneficiaries) continue;

    matchedProviders++;
    let score = 0;
    let factors = 0;

    // Factor 1: E&M coding efficiency (0-1)
    const emTotal = provider.em_total || 1;
    const actual214Rate = (provider.em_99214 || 0) / emTotal;
    const benchmark214Rate = benchmark.pct_99214 || 0.5;
    const emScore = Math.min(actual214Rate / benchmark214Rate, 1.0);
    score += emScore;
    factors++;

    // Factor 2: Revenue per patient vs benchmark
    const actualRPP = provider.total_beneficiaries > 0
      ? provider.total_medicare_payment / provider.total_beneficiaries
      : 0;
    const benchmarkRPP = benchmark.avg_revenue_per_patient || 400;
    const rppScore = Math.min(actualRPP / benchmarkRPP, 1.0);
    score += rppScore;
    factors++;

    // Factor 3: Care management adoption (0-1)
    const hasCCM = (provider.ccm_99490_services || 0) > 0 ? 1 : 0;
    const hasRPM = ((provider.rpm_99454_services || 0) > 0 || (provider.rpm_99457_services || 0) > 0) ? 1 : 0;
    const hasAWV = ((provider.awv_g0438_services || 0) > 0 || (provider.awv_g0439_services || 0) > 0) ? 1 : 0;
    const hasBHI = (provider.bhi_99484_services || 0) > 0 ? 1 : 0;
    const cmScore = (hasCCM + hasRPM + hasAWV + hasBHI) / 4;
    score += cmScore;
    factors++;

    totalScore += factors > 0 ? score / factors : 0.5;
  }

  return matchedProviders > 0 ? totalScore / matchedProviders : 0.5;
}

/**
 * Calculate adoption rates for a group of providers.
 */
export function calculateAdoptionRates(providers: ProviderRow[]): {
  ccm: number;
  rpm: number;
  bhi: number;
  awv: number;
} {
  if (!providers.length) return { ccm: 0, rpm: 0, bhi: 0, awv: 0 };

  const total = providers.length;
  const ccm = providers.filter(p => (p.ccm_99490_services || 0) > 0).length / total;
  const rpm = providers.filter(p => (p.rpm_99454_services || 0) > 0 || (p.rpm_99457_services || 0) > 0).length / total;
  const bhi = providers.filter(p => (p.bhi_99484_services || 0) > 0).length / total;
  const awv = providers.filter(p => (p.awv_g0438_services || 0) > 0 || (p.awv_g0439_services || 0) > 0).length / total;

  return { ccm, rpm, bhi, awv };
}

/**
 * Calculate E&M distribution for a group of providers.
 */
export function calculateEMDistribution(providers: ProviderRow[]): {
  pct99213: number;
  pct99214: number;
  pct99215: number;
} {
  if (!providers.length) return { pct99213: 0, pct99214: 0, pct99215: 0 };

  let total213 = 0, total214 = 0, total215 = 0;

  for (const p of providers) {
    total213 += p.em_99213 || 0;
    total214 += p.em_99214 || 0;
    total215 += p.em_99215 || 0;
  }

  const totalEM = total213 + total214 + total215;
  if (totalEM === 0) return { pct99213: 0.33, pct99214: 0.34, pct99215: 0.33 };

  return {
    pct99213: total213 / totalEM,
    pct99214: total214 / totalEM,
    pct99215: total215 / totalEM,
  };
}
