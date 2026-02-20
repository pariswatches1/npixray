/**
 * Practice Acquisition Intelligence Engine
 *
 * Calculates acquisition opportunity scores for medical practices:
 *   - Upside potential: how much revenue can be unlocked post-acquisition
 *   - Patient base value: volume × stickiness
 *   - Optimization readiness: how many low-hanging-fruit programs are missing
 *   - Market position: specialty demand × geographic density
 *
 * No Node.js imports — safe for server & client.
 */

import type { ProviderRow, BenchmarkRow } from "./db-queries";
import { calculateRevenueScore } from "./revenue-score";
import type { RevenueScoreResult } from "./revenue-score";

// ── Acquisition Score Tiers ───────────────────────────────

export interface AcquisitionTier {
  min: number;
  max: number;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hexColor: string;
  description: string;
}

export const ACQUISITION_TIERS: AcquisitionTier[] = [
  { min: 85, max: 100, label: "Prime Target",      color: "text-[#2F5EA8]",        bgColor: "bg-[#2F5EA8]/10",        borderColor: "border-[#2F5EA8]/20",        hexColor: "#2F5EA8", description: "Exceptional acquisition opportunity with massive upside" },
  { min: 70, max: 84,  label: "Strong Opportunity", color: "text-emerald-400", bgColor: "bg-emerald-400/15", borderColor: "border-emerald-400/40", hexColor: "#34d399", description: "Strong fundamentals with significant optimization potential" },
  { min: 55, max: 69,  label: "Moderate Upside",    color: "text-yellow-400",  bgColor: "bg-yellow-400/15",  borderColor: "border-yellow-400/40",  hexColor: "#facc15", description: "Reasonable opportunity with moderate improvement potential" },
  { min: 35, max: 54,  label: "Limited Upside",     color: "text-orange-400",  bgColor: "bg-orange-400/15",  borderColor: "border-orange-400/40",  hexColor: "#fb923c", description: "Below-average returns — high revenue already captured" },
  { min: 0,  max: 34,  label: "Low Priority",       color: "text-zinc-400",    bgColor: "bg-zinc-400/15",    borderColor: "border-zinc-400/40",    hexColor: "#a1a1aa", description: "Minimal upside — already optimized or low volume" },
];

export function getAcquisitionTier(score: number): AcquisitionTier {
  return ACQUISITION_TIERS.find((t) => score >= t.min) ?? ACQUISITION_TIERS[ACQUISITION_TIERS.length - 1];
}

// ── Acquisition Score Result ──────────────────────────────

export interface AcquisitionBreakdown {
  upsidePotential: number;       // 35% — revenue gap / optimization headroom
  patientBaseValue: number;      // 25% — patient volume × revenue potential
  optimizationReadiness: number; // 25% — missing programs = easy wins
  marketPosition: number;        // 15% — specialty demand × scarcity
}

export interface AcquisitionScoreResult {
  overall: number;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  hexColor: string;
  description: string;
  breakdown: AcquisitionBreakdown;
  estimatedUpsideRevenue: number;
  revenueScore: RevenueScoreResult;
  projectedOptimizedRevenue: number;
  currentRevenue: number;
  revenueIncreasePct: number;
}

// ── Helpers ────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function safeDivide(a: number, b: number, fallback = 0): number {
  return b > 0 ? a / b : fallback;
}

// ── Core Acquisition Scoring ──────────────────────────────

export function calculateAcquisitionScore(
  provider: ProviderRow,
  benchmark: BenchmarkRow,
  codeCount?: number
): AcquisitionScoreResult {
  // First get the revenue score — lower score = more upside for acquirer
  const revenueScore = calculateRevenueScore(provider, benchmark, codeCount);
  const currentRevenue = provider.total_medicare_payment || 0;
  const patients = provider.total_beneficiaries || 0;

  // 1. Upside Potential (35%) — inversely related to current Revenue Score
  //    Low Revenue Score + high patient volume = gold mine
  const scoreGap = 100 - revenueScore.overall; // Higher gap = more upside
  const volumeMultiplier = patients >= 200 ? 1.3 : patients >= 100 ? 1.1 : patients >= 50 ? 1.0 : 0.7;
  const upsidePotential = clamp(Math.round(scoreGap * volumeMultiplier), 0, 100);

  // 2. Patient Base Value (25%) — existing patient volume is the moat
  //    More patients = more revenue to optimize per patient
  const benchAvgPatients = Math.max(benchmark.avg_medicare_patients || 100, 1);
  const patientRatio = safeDivide(patients, benchAvgPatients, 0.5);
  const patientBaseValue = clamp(Math.round(Math.min(patientRatio, 2.0) * 50), 0, 100);

  // 3. Optimization Readiness (25%) — missing programs = quick wins post-acquisition
  const missingPrograms: string[] = [];
  const hasCCM = (provider.ccm_99490_services || 0) > 0;
  const hasRPM = (provider.rpm_99454_services || 0) > 0 || (provider.rpm_99457_services || 0) > 0;
  const hasBHI = (provider.bhi_99484_services || 0) > 0;
  const hasAWV = (provider.awv_g0438_services || 0) > 0 || (provider.awv_g0439_services || 0) > 0;

  if (!hasCCM && (benchmark.ccm_adoption_rate || 0) >= 0.02) missingPrograms.push("CCM");
  if (!hasRPM && (benchmark.rpm_adoption_rate || 0) >= 0.01) missingPrograms.push("RPM");
  if (!hasBHI && (benchmark.bhi_adoption_rate || 0) >= 0.01) missingPrograms.push("BHI");
  if (!hasAWV && (benchmark.awv_adoption_rate || 0) >= 0.05) missingPrograms.push("AWV");

  // E&M under-coding check
  const emTotal = provider.em_total || 1;
  const actual214Pct = (provider.em_99214 || 0) / emTotal;
  const bench214Pct = benchmark.pct_99214 || 0.5;
  const emGap = Math.max(0, bench214Pct - actual214Pct);

  const programReadiness = missingPrograms.length * 22; // Each missing = 22pts
  const emReadiness = emGap > 0.1 ? 15 : emGap > 0.05 ? 8 : 0;
  const optimizationReadiness = clamp(programReadiness + emReadiness, 0, 100);

  // 4. Market Position (15%) — specialty demand and provider density
  const specialtySize = benchmark.provider_count || 1000;
  const isHighDemand = specialtySize > 20000; // Large specialty = more demand
  const demandScore = isHighDemand ? 70 : specialtySize > 10000 ? 55 : specialtySize > 5000 ? 40 : 30;
  const revenueScale = currentRevenue > 100000 ? 30 : currentRevenue > 50000 ? 20 : 10;
  const marketPosition = clamp(demandScore + revenueScale, 0, 100);

  // Weighted total
  const overall = clamp(
    Math.round(
      upsidePotential * 0.35 +
      patientBaseValue * 0.25 +
      optimizationReadiness * 0.25 +
      marketPosition * 0.15
    ),
    0,
    100
  );

  // Estimate upside revenue
  const benchRevenuePerPatient = benchmark.avg_revenue_per_patient || 400;
  const optimizedRevenue = patients * benchRevenuePerPatient * 1.15; // 15% above benchmark average (post-optimization)
  const estimatedUpside = Math.max(0, Math.round(optimizedRevenue - currentRevenue));
  const revenueIncreasePct = currentRevenue > 0 ? Math.round((estimatedUpside / currentRevenue) * 100) : 0;

  const tier = getAcquisitionTier(overall);

  return {
    overall,
    label: tier.label,
    color: tier.color,
    bgColor: tier.bgColor,
    borderColor: tier.borderColor,
    hexColor: tier.hexColor,
    description: tier.description,
    breakdown: {
      upsidePotential,
      patientBaseValue,
      optimizationReadiness,
      marketPosition,
    },
    estimatedUpsideRevenue: estimatedUpside,
    revenueScore,
    projectedOptimizedRevenue: Math.round(optimizedRevenue),
    currentRevenue,
    revenueIncreasePct,
  };
}

// ── Market Analysis Utilities ─────────────────────────────

export interface MarketOpportunity {
  totalPractices: number;
  avgRevenueScore: number;
  totalAddressableRevenue: number;
  estimatedMissedRevenue: number;
  topSpecialties: { specialty: string; count: number; avgGap: number }[];
  underperformingCount: number;
  primeTargetCount: number;
}

export function analyzeMarketOpportunity(
  providers: ProviderRow[],
  benchmarks: BenchmarkRow[]
): MarketOpportunity {
  if (!providers.length) {
    return {
      totalPractices: 0,
      avgRevenueScore: 0,
      totalAddressableRevenue: 0,
      estimatedMissedRevenue: 0,
      topSpecialties: [],
      underperformingCount: 0,
      primeTargetCount: 0,
    };
  }

  const benchmarkMap = new Map<string, BenchmarkRow>();
  for (const b of benchmarks) benchmarkMap.set(b.specialty, b);

  let totalScore = 0;
  let scoredCount = 0;
  let totalRevenue = 0;
  let totalPotentialRevenue = 0;
  let underperforming = 0;
  let primeTargets = 0;

  const specialtyMap = new Map<string, { count: number; totalGap: number }>();

  for (const p of providers) {
    const bench = benchmarkMap.get(p.specialty);
    if (!bench) continue;

    const score = calculateRevenueScore(p, bench);
    totalScore += score.overall;
    scoredCount++;
    totalRevenue += p.total_medicare_payment || 0;

    const patients = p.total_beneficiaries || 1;
    const potential = patients * (bench.avg_revenue_per_patient || 400);
    totalPotentialRevenue += potential;

    if (score.overall < 60) underperforming++;

    const acqScore = calculateAcquisitionScore(p, bench);
    if (acqScore.overall >= 70) primeTargets++;

    const gap = Math.max(0, potential - (p.total_medicare_payment || 0));
    const entry = specialtyMap.get(p.specialty) || { count: 0, totalGap: 0 };
    entry.count++;
    entry.totalGap += gap;
    specialtyMap.set(p.specialty, entry);
  }

  const topSpecialties = Array.from(specialtyMap.entries())
    .map(([specialty, data]) => ({
      specialty,
      count: data.count,
      avgGap: data.count > 0 ? Math.round(data.totalGap / data.count) : 0,
    }))
    .sort((a, b) => b.avgGap * b.count - a.avgGap * a.count)
    .slice(0, 10);

  return {
    totalPractices: providers.length,
    avgRevenueScore: scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0,
    totalAddressableRevenue: Math.round(totalRevenue),
    estimatedMissedRevenue: Math.round(Math.max(0, totalPotentialRevenue - totalRevenue)),
    topSpecialties,
    underperformingCount: underperforming,
    primeTargetCount: primeTargets,
  };
}

// ── Portfolio Analysis ────────────────────────────────────

export interface PortfolioAnalysis {
  providers: {
    npi: string;
    name: string;
    specialty: string;
    state: string;
    city: string;
    currentRevenue: number;
    acquisitionScore: AcquisitionScoreResult;
  }[];
  totalCurrentRevenue: number;
  totalProjectedRevenue: number;
  totalUpside: number;
  avgAcquisitionScore: number;
  prioritizedActions: string[];
}

export function analyzePortfolio(
  providers: ProviderRow[],
  benchmarks: BenchmarkRow[]
): PortfolioAnalysis {
  const benchmarkMap = new Map<string, BenchmarkRow>();
  for (const b of benchmarks) benchmarkMap.set(b.specialty, b);

  const results: PortfolioAnalysis["providers"] = [];
  let totalCurrent = 0;
  let totalProjected = 0;
  let totalScore = 0;
  const actionSet = new Set<string>();

  for (const p of providers) {
    const bench = benchmarkMap.get(p.specialty);
    if (!bench) continue;

    const acqScore = calculateAcquisitionScore(p, bench);
    results.push({
      npi: p.npi,
      name: `${p.first_name || ""} ${p.last_name || ""}`.trim() || `NPI ${p.npi}`,
      specialty: p.specialty,
      state: p.state,
      city: p.city,
      currentRevenue: p.total_medicare_payment || 0,
      acquisitionScore: acqScore,
    });

    totalCurrent += p.total_medicare_payment || 0;
    totalProjected += acqScore.projectedOptimizedRevenue;
    totalScore += acqScore.overall;

    // Generate prioritized actions
    if (acqScore.breakdown.optimizationReadiness > 50) {
      const hasCCM = (p.ccm_99490_services || 0) > 0;
      const hasRPM = (p.rpm_99454_services || 0) > 0 || (p.rpm_99457_services || 0) > 0;
      const hasAWV = (p.awv_g0438_services || 0) > 0 || (p.awv_g0439_services || 0) > 0;
      if (!hasCCM) actionSet.add("Implement CCM (99490) across eligible patients");
      if (!hasRPM) actionSet.add("Launch RPM program (99454/99457) for chronic conditions");
      if (!hasAWV) actionSet.add("Increase AWV completion rates (G0438/G0439)");
    }
    if (acqScore.breakdown.upsidePotential > 60) {
      actionSet.add("Optimize E&M coding distribution toward 99214/99215");
    }
  }

  // Sort by acquisition score descending (best targets first)
  results.sort((a, b) => b.acquisitionScore.overall - a.acquisitionScore.overall);

  return {
    providers: results,
    totalCurrentRevenue: Math.round(totalCurrent),
    totalProjectedRevenue: Math.round(totalProjected),
    totalUpside: Math.round(Math.max(0, totalProjected - totalCurrent)),
    avgAcquisitionScore: results.length > 0 ? Math.round(totalScore / results.length) : 0,
    prioritizedActions: Array.from(actionSet),
  };
}

// ── Format Helpers ────────────────────────────────────────

export function formatAcquisitionCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount.toLocaleString()}`;
}
