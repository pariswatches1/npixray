/**
 * NPIxray Revenue Score Engine
 *
 * Calculates a 0-100 "credit score" for medical practice revenue health.
 * Works from two data shapes:
 *   1. ProviderRow + BenchmarkRow (server-side, batch calculation)
 *   2. ScanResult (client-side scan results page)
 *
 * No Node.js imports — safe for both server and client use.
 */

import type { ProviderRow, BenchmarkRow } from "./db-queries";
import type { ScanResult } from "./types";

// ── Score Tiers ────────────────────────────────────────────

export interface RevenueScoreTier {
  min: number;
  max: number;
  label: string;
  color: string;       // Tailwind text class
  bgColor: string;     // Tailwind bg class
  borderColor: string; // Tailwind border class
  hexColor: string;    // For SVG / inline styles
}

export const SCORE_TIERS: RevenueScoreTier[] = [
  { min: 90, max: 100, label: "Elite",         color: "text-gold",        bgColor: "bg-gold/15",        borderColor: "border-gold/40",        hexColor: "#E8A824" },
  { min: 75, max: 89,  label: "Strong",        color: "text-emerald-400", bgColor: "bg-emerald-400/15", borderColor: "border-emerald-400/40", hexColor: "#34d399" },
  { min: 60, max: 74,  label: "Average",       color: "text-yellow-400",  bgColor: "bg-yellow-400/15",  borderColor: "border-yellow-400/40",  hexColor: "#facc15" },
  { min: 40, max: 59,  label: "Below Average", color: "text-orange-400",  bgColor: "bg-orange-400/15",  borderColor: "border-orange-400/40",  hexColor: "#fb923c" },
  { min: 0,  max: 39,  label: "Critical",      color: "text-red-400",     bgColor: "bg-red-400/15",     borderColor: "border-red-400/40",     hexColor: "#f87171" },
];

export function getScoreTier(score: number): RevenueScoreTier {
  return SCORE_TIERS.find((t) => score >= t.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1];
}

// ── Score Result ───────────────────────────────────────────

export interface ScoreBreakdown {
  emCoding: number;
  programUtil: number;
  revenueEfficiency: number;
  serviceDiversity: number;
  patientVolume: number;
}

export interface RevenueScoreResult {
  overall: number;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hexColor: string;
  breakdown: ScoreBreakdown;
}

// ── Internal Normalized Shape ──────────────────────────────

interface NormalizedInput {
  emTotal: number;
  em99213: number;
  em99214: number;
  em99215: number;
  hasCCM: boolean;
  hasRPM: boolean;
  hasBHI: boolean;
  hasAWV: boolean;
  totalPayment: number;
  totalBeneficiaries: number;
  distinctCodeCount: number;
  benchPct99213: number;
  benchPct99214: number;
  benchPct99215: number;
  benchCcmAdoption: number;
  benchRpmAdoption: number;
  benchBhiAdoption: number;
  benchAwvAdoption: number;
  benchAvgPayment: number;
  benchAvgPatients: number;
  benchAvgRevPerPatient: number;
}

// ── Helpers ────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function safeDivide(a: number, b: number, fallback = 0): number {
  return b > 0 ? a / b : fallback;
}

// ── Core Algorithm ─────────────────────────────────────────

function calculateCore(input: NormalizedInput): RevenueScoreResult {
  // 1. E&M Coding Optimization (25%)
  let emScore: number;
  if (input.emTotal <= 0) {
    // No E&M visits (pathologists, radiologists, etc.) — neutral
    emScore = 50;
  } else {
    const actual214Pct = safeDivide(input.em99214, input.emTotal);
    const actual215Pct = safeDivide(input.em99215, input.emTotal);
    const bench214 = Math.max(input.benchPct99214, 0.01);
    const bench215 = Math.max(input.benchPct99215, 0.01);
    const ratio214 = Math.min(actual214Pct / bench214, 1.2);
    const ratio215 = Math.min(actual215Pct / bench215, 1.2);
    emScore = clamp(Math.round((ratio214 * 0.6 + ratio215 * 0.4) * 100), 0, 100);
  }

  // 2. Program Utilization (25%)
  const programs = [
    { has: input.hasCCM, benchRate: input.benchCcmAdoption, points: 25 },
    { has: input.hasRPM, benchRate: input.benchRpmAdoption, points: 20 },
    { has: input.hasBHI, benchRate: input.benchBhiAdoption, points: 15 },
    { has: input.hasAWV, benchRate: input.benchAwvAdoption, points: 40 },
  ];
  // Filter out programs irrelevant to this specialty (bench < 1%)
  const relevant = programs.filter((p) => p.benchRate >= 0.01);
  let programScore: number;
  if (relevant.length === 0) {
    programScore = 50; // no relevant programs for this specialty
  } else {
    const totalPoints = relevant.reduce((a, p) => a + p.points, 0);
    const earnedPoints = relevant.filter((p) => p.has).reduce((a, p) => a + p.points, 0);
    programScore = clamp(Math.round((earnedPoints / totalPoints) * 100), 0, 100);
  }

  // 3. Revenue Efficiency (20%)
  const expectedPayment = input.benchAvgPayment * safeDivide(input.totalBeneficiaries, Math.max(input.benchAvgPatients, 1), 1);
  const revenueRatio = Math.min(safeDivide(input.totalPayment, Math.max(expectedPayment, 1), 0.5), 1.5);
  const revenueScore = clamp(Math.round(revenueRatio * 66.7), 0, 100);

  // 4. Service Diversity (15%)
  const codes = input.distinctCodeCount;
  let diversityScore: number;
  if (codes >= 20) diversityScore = 100;
  else if (codes >= 15) diversityScore = 85;
  else if (codes >= 10) diversityScore = 70;
  else if (codes >= 6) diversityScore = 55;
  else if (codes >= 3) diversityScore = 35;
  else diversityScore = 15;

  // 5. Patient Volume Efficiency (15%)
  const actualRPP = safeDivide(input.totalPayment, Math.max(input.totalBeneficiaries, 1));
  const benchRPP = Math.max(input.benchAvgRevPerPatient, 1);
  const rppRatio = Math.min(safeDivide(actualRPP, benchRPP, 0.5), 1.5);
  const volumeScore = clamp(Math.round(rppRatio * 66.7), 0, 100);

  // Weighted total
  const overall = clamp(
    Math.round(
      emScore * 0.25 +
      programScore * 0.25 +
      revenueScore * 0.20 +
      diversityScore * 0.15 +
      volumeScore * 0.15
    ),
    0,
    100
  );

  const tier = getScoreTier(overall);

  return {
    overall,
    label: tier.label,
    color: tier.color,
    bgColor: tier.bgColor,
    borderColor: tier.borderColor,
    hexColor: tier.hexColor,
    breakdown: {
      emCoding: emScore,
      programUtil: programScore,
      revenueEfficiency: revenueScore,
      serviceDiversity: diversityScore,
      patientVolume: volumeScore,
    },
  };
}

// ── Public: From ProviderRow + BenchmarkRow ─────────────────

export function calculateRevenueScore(
  provider: ProviderRow,
  benchmark: BenchmarkRow,
  codeCount?: number
): RevenueScoreResult {
  const input: NormalizedInput = {
    emTotal: provider.em_total || 0,
    em99213: provider.em_99213 || 0,
    em99214: provider.em_99214 || 0,
    em99215: provider.em_99215 || 0,
    hasCCM: (provider.ccm_99490_services || 0) > 0,
    hasRPM: (provider.rpm_99454_services || 0) > 0 || (provider.rpm_99457_services || 0) > 0,
    hasBHI: (provider.bhi_99484_services || 0) > 0,
    hasAWV: (provider.awv_g0438_services || 0) > 0 || (provider.awv_g0439_services || 0) > 0,
    totalPayment: provider.total_medicare_payment || 0,
    totalBeneficiaries: provider.total_beneficiaries || 0,
    distinctCodeCount: codeCount ?? 8, // default to mid-range if unknown
    benchPct99213: benchmark.pct_99213 || 0,
    benchPct99214: benchmark.pct_99214 || 0,
    benchPct99215: benchmark.pct_99215 || 0,
    benchCcmAdoption: benchmark.ccm_adoption_rate || 0,
    benchRpmAdoption: benchmark.rpm_adoption_rate || 0,
    benchBhiAdoption: benchmark.bhi_adoption_rate || 0,
    benchAwvAdoption: benchmark.awv_adoption_rate || 0,
    benchAvgPayment: benchmark.avg_total_payment || 0,
    benchAvgPatients: benchmark.avg_medicare_patients || 0,
    benchAvgRevPerPatient: benchmark.avg_revenue_per_patient || 0,
  };
  return calculateCore(input);
}

// ── Public: From ScanResult ─────────────────────────────────

export function calculateRevenueScoreFromScan(result: ScanResult): RevenueScoreResult {
  const b = result.billing;
  const bench = result.benchmark;
  const input: NormalizedInput = {
    emTotal: b.emTotalCount || 0,
    em99213: b.em99213Count || 0,
    em99214: b.em99214Count || 0,
    em99215: b.em99215Count || 0,
    hasCCM: (b.ccmPatients || 0) > 0,
    hasRPM: (b.rpmPatients || 0) > 0,
    hasBHI: (b.bhiPatients || 0) > 0,
    hasAWV: (b.awvCount || 0) > 0,
    totalPayment: b.totalMedicarePayment || 0,
    totalBeneficiaries: b.totalMedicarePatients || 0,
    distinctCodeCount: 8, // not available from scan data, use mid-range default
    benchPct99213: bench.pct99213 || 0,
    benchPct99214: bench.pct99214 || 0,
    benchPct99215: bench.pct99215 || 0,
    benchCcmAdoption: bench.ccmAdoptionRate || 0,
    benchRpmAdoption: bench.rpmAdoptionRate || 0,
    benchBhiAdoption: bench.bhiAdoptionRate || 0,
    benchAwvAdoption: bench.awvAdoptionRate || 0,
    benchAvgPayment: bench.avgMedicarePatients * bench.avgRevenuePerPatient || 0,
    benchAvgPatients: bench.avgMedicarePatients || 0,
    benchAvgRevPerPatient: bench.avgRevenuePerPatient || 0,
  };
  return calculateCore(input);
}

// ── Percentile Estimate (from score alone) ──────────────────

export function estimatePercentile(score: number): number {
  // Approximate percentile based on expected normal distribution
  if (score >= 90) return 95 + Math.round((score - 90) * 0.5);
  if (score >= 75) return 70 + Math.round((score - 75) * 1.67);
  if (score >= 60) return 35 + Math.round((score - 60) * 2.33);
  if (score >= 40) return 10 + Math.round((score - 40) * 1.25);
  return Math.max(1, Math.round(score * 0.25));
}
