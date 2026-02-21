/**
 * Cross-state & cross-specialty comparison engine.
 *
 * Computes unique comparison data for every programmatic page:
 * - National rankings
 * - Neighboring state comparisons
 * - Delta percentages vs benchmarks
 * - Percentile positions
 *
 * All computations are deterministic (no AI) — pure SQL + math.
 */

import {
  getAllStateAvgPayments,
  getSpecialtyByAllStates,
  getStateProgramCounts,
  getStateSpecialtyProgramCounts,
  getStateSpecialties,
  stateAbbrToName,
  type BenchmarkRow,
} from "./db-queries";
import { SPECIALTY_BENCHMARKS } from "./benchmarks";

// ── Neighboring states map ──────────────────────────────

export const NEIGHBORING_STATES: Record<string, string[]> = {
  AL: ["FL", "GA", "MS", "TN"],
  AK: [],
  AZ: ["CA", "CO", "NM", "NV", "UT"],
  AR: ["LA", "MO", "MS", "OK", "TN", "TX"],
  CA: ["AZ", "NV", "OR"],
  CO: ["AZ", "KS", "NE", "NM", "OK", "UT", "WY"],
  CT: ["MA", "NY", "RI"],
  DE: ["MD", "NJ", "PA"],
  FL: ["AL", "GA"],
  GA: ["AL", "FL", "NC", "SC", "TN"],
  HI: [],
  ID: ["MT", "NV", "OR", "UT", "WA", "WY"],
  IL: ["IN", "IA", "KY", "MO", "WI"],
  IN: ["IL", "KY", "MI", "OH"],
  IA: ["IL", "MN", "MO", "NE", "SD", "WI"],
  KS: ["CO", "MO", "NE", "OK"],
  KY: ["IL", "IN", "MO", "OH", "TN", "VA", "WV"],
  LA: ["AR", "MS", "TX"],
  ME: ["NH"],
  MD: ["DE", "PA", "VA", "WV", "DC"],
  MA: ["CT", "NH", "NY", "RI", "VT"],
  MI: ["IN", "OH", "WI"],
  MN: ["IA", "ND", "SD", "WI"],
  MS: ["AL", "AR", "LA", "TN"],
  MO: ["AR", "IL", "IA", "KS", "KY", "NE", "OK", "TN"],
  MT: ["ID", "ND", "SD", "WY"],
  NE: ["CO", "IA", "KS", "MO", "SD", "WY"],
  NV: ["AZ", "CA", "ID", "OR", "UT"],
  NH: ["MA", "ME", "VT"],
  NJ: ["DE", "NY", "PA"],
  NM: ["AZ", "CO", "OK", "TX", "UT"],
  NY: ["CT", "MA", "NJ", "PA", "VT"],
  NC: ["GA", "SC", "TN", "VA"],
  ND: ["MN", "MT", "SD"],
  OH: ["IN", "KY", "MI", "PA", "WV"],
  OK: ["AR", "CO", "KS", "MO", "NM", "TX"],
  OR: ["CA", "ID", "NV", "WA"],
  PA: ["DE", "MD", "NJ", "NY", "OH", "WV"],
  RI: ["CT", "MA"],
  SC: ["GA", "NC"],
  SD: ["IA", "MN", "MT", "ND", "NE", "WY"],
  TN: ["AL", "AR", "GA", "KY", "MO", "MS", "NC", "VA"],
  TX: ["AR", "LA", "NM", "OK"],
  UT: ["AZ", "CO", "ID", "NV", "NM", "WY"],
  VT: ["MA", "NH", "NY"],
  VA: ["KY", "MD", "NC", "TN", "WV", "DC"],
  WA: ["ID", "OR"],
  WV: ["KY", "MD", "OH", "PA", "VA"],
  WI: ["IA", "IL", "MI", "MN"],
  WY: ["CO", "ID", "MT", "NE", "SD", "UT"],
  DC: ["MD", "VA"],
  PR: [],
  VI: [],
  GU: [],
  AS: [],
  MP: [],
};

// ── Types ──────────────────────────────────────────────

export interface NeighborComparison {
  state: string;
  stateName: string;
  avgPayment: number;
  delta: number; // % difference from current state
  providerCount: number;
}

export interface StateComparison {
  nationalRank: number;
  totalStates: number;
  avgPayment: number;
  nationalAvgPayment: number;
  avgPaymentDelta: number; // % vs national
  neighborComparisons: NeighborComparison[];
  strongestSpecialty: {
    name: string;
    localAvg: number;
    count: number;
  } | null;
  weakestProgram: {
    name: string;
    localRate: number;
    nationalRate: number;
    delta: number;
  } | null;
  programAdoption: {
    ccm: number;
    rpm: number;
    bhi: number;
    awv: number;
  };
}

export interface SpecialtyNeighborComparison {
  state: string;
  stateName: string;
  count: number;
  avgPayment: number;
  delta: number; // % vs current state
}

export interface StateSpecialtyComparison {
  stateRank: number; // rank of this specialty within state by provider count
  nationalSpecialtyRank: number; // this state's rank among all states for this specialty (by avg payment)
  totalStatesWithSpecialty: number;
  neighborComparisons: SpecialtyNeighborComparison[];
  vsNationalBenchmark: {
    avgPaymentDelta: number;
    ccmAdoptionDelta: number;
    rpmAdoptionDelta: number;
    awvAdoptionDelta: number;
  } | null;
  percentilePosition: number; // 0-100 percentile among all states for this specialty
  peerGroupSize: number;
  confidence: "high" | "medium" | "low";
}

// ── Helper ─────────────────────────────────────────────

function getConfidence(count: number): "high" | "medium" | "low" {
  if (count >= 100) return "high";
  if (count >= 20) return "medium";
  return "low";
}

function pctDelta(local: number, reference: number): number {
  if (reference === 0) return 0;
  return Math.round(((local - reference) / reference) * 100);
}

// ── State Comparisons ──────────────────────────────────

export async function getStateComparisons(stateAbbr: string, prefetchedPrograms?: any): Promise<StateComparison | null> {
  const allStates = await getAllStateAvgPayments();
  if (!allStates.length) return null;

  const current = allStates.find((s) => s.state === stateAbbr);
  if (!current) return null;

  // National rank (sorted by avg payment descending)
  const sorted = [...allStates].sort((a, b) => b.avgPayment - a.avgPayment);
  const nationalRank = sorted.findIndex((s) => s.state === stateAbbr) + 1;

  // National average
  const nationalAvg =
    allStates.reduce((sum, s) => sum + s.avgPayment * s.providerCount, 0) /
    allStates.reduce((sum, s) => sum + s.providerCount, 0);

  // Neighboring state comparisons
  const neighbors = NEIGHBORING_STATES[stateAbbr] || [];
  const neighborComparisons: NeighborComparison[] = neighbors
    .map((n) => {
      const ns = allStates.find((s) => s.state === n);
      if (!ns) return null;
      return {
        state: n,
        stateName: stateAbbrToName(n),
        avgPayment: ns.avgPayment,
        delta: pctDelta(ns.avgPayment, current.avgPayment),
        providerCount: ns.providerCount,
      };
    })
    .filter(Boolean)
    .slice(0, 4) as NeighborComparison[];

  // Strongest specialty + program adoption (use prefetched programs if available)
  const [stateSpecs, programs] = await Promise.all([
    getStateSpecialties(stateAbbr, 10),
    prefetchedPrograms ? Promise.resolve(prefetchedPrograms) : getStateProgramCounts(stateAbbr),
  ]);
  const strongestSpecialty =
    stateSpecs.length > 0
      ? {
          name: stateSpecs[0].specialty,
          localAvg: stateSpecs[0].avgPayment,
          count: stateSpecs[0].count,
        }
      : null;

  const ccmRate = programs.totalProviders > 0 ? programs.ccmBillers / programs.totalProviders : 0;
  const rpmRate = programs.totalProviders > 0 ? programs.rpmBillers / programs.totalProviders : 0;
  const bhiRate = programs.totalProviders > 0 ? programs.bhiBillers / programs.totalProviders : 0;
  const awvRate = programs.totalProviders > 0 ? programs.awvBillers / programs.totalProviders : 0;

  // Find weakest program vs national benchmarks (use average across all specialties)
  const allBenchmarks = Object.values(SPECIALTY_BENCHMARKS);
  const nationalCcm = allBenchmarks.reduce((s, b) => s + b.ccmAdoptionRate, 0) / allBenchmarks.length;
  const nationalRpm = allBenchmarks.reduce((s, b) => s + b.rpmAdoptionRate, 0) / allBenchmarks.length;
  const nationalBhi = allBenchmarks.reduce((s, b) => s + b.bhiAdoptionRate, 0) / allBenchmarks.length;
  const nationalAwv = allBenchmarks.reduce((s, b) => s + b.awvAdoptionRate, 0) / allBenchmarks.length;

  const programDeltas = [
    { name: "CCM (99490)", localRate: ccmRate, nationalRate: nationalCcm, delta: ccmRate - nationalCcm },
    { name: "RPM (99454)", localRate: rpmRate, nationalRate: nationalRpm, delta: rpmRate - nationalRpm },
    { name: "BHI (99484)", localRate: bhiRate, nationalRate: nationalBhi, delta: bhiRate - nationalBhi },
    { name: "AWV (G0438)", localRate: awvRate, nationalRate: nationalAwv, delta: awvRate - nationalAwv },
  ];
  const weakestProgram = programDeltas.sort((a, b) => a.delta - b.delta)[0];

  return {
    nationalRank,
    totalStates: sorted.length,
    avgPayment: current.avgPayment,
    nationalAvgPayment: nationalAvg,
    avgPaymentDelta: pctDelta(current.avgPayment, nationalAvg),
    neighborComparisons,
    strongestSpecialty,
    weakestProgram: weakestProgram.delta < 0 ? weakestProgram : null,
    programAdoption: { ccm: ccmRate, rpm: rpmRate, bhi: bhiRate, awv: awvRate },
  };
}

// ── State + Specialty Comparisons ──────────────────────

export async function getStateSpecialtyComparisons(
  specialty: string,
  stateAbbr: string
): Promise<StateSpecialtyComparison | null> {
  const allStatesForSpec = await getSpecialtyByAllStates(specialty);
  if (!allStatesForSpec.length) return null;

  const current = allStatesForSpec.find((s) => s.state === stateAbbr);
  if (!current) return null;

  // Rank among all states for this specialty (by avg payment)
  const sorted = [...allStatesForSpec].sort((a, b) => b.avgPayment - a.avgPayment);
  const nationalSpecialtyRank = sorted.findIndex((s) => s.state === stateAbbr) + 1;

  // Percentile position
  const percentilePosition = Math.round(
    ((sorted.length - nationalSpecialtyRank) / Math.max(sorted.length - 1, 1)) * 100
  );

  // Neighbor comparisons for this specialty
  const neighbors = NEIGHBORING_STATES[stateAbbr] || [];
  const neighborComparisons: SpecialtyNeighborComparison[] = neighbors
    .map((n) => {
      const ns = allStatesForSpec.find((s) => s.state === n);
      if (!ns) return null;
      return {
        state: n,
        stateName: stateAbbrToName(n),
        count: ns.count,
        avgPayment: ns.avgPayment,
        delta: pctDelta(ns.avgPayment, current.avgPayment),
      };
    })
    .filter(Boolean)
    .slice(0, 4) as SpecialtyNeighborComparison[];

  // Compare to national benchmark
  const benchmark = SPECIALTY_BENCHMARKS[specialty];
  let vsNationalBenchmark: {
    avgPaymentDelta: number;
    ccmAdoptionDelta: number;
    rpmAdoptionDelta: number;
    awvAdoptionDelta: number;
  } | null = null;
  if (benchmark) {
    // Get program adoption for this state+specialty
    const programs = await getStateSpecialtyProgramCounts(specialty, stateAbbr);
    const localCcm = programs.totalProviders > 0 ? programs.ccmBillers / programs.totalProviders : 0;
    const localRpm = programs.totalProviders > 0 ? programs.rpmBillers / programs.totalProviders : 0;
    const localAwv = programs.totalProviders > 0 ? programs.awvBillers / programs.totalProviders : 0;

    vsNationalBenchmark = {
      avgPaymentDelta: pctDelta(current.avgPayment, benchmark.avgMedicarePatients * benchmark.avgRevenuePerPatient / (benchmark.avgMedicarePatients || 1) * (benchmark.avgMedicarePatients || 1) > 0 ? benchmark.avgRevenuePerPatient * benchmark.avgMedicarePatients / 1 : current.avgPayment),
      ccmAdoptionDelta: Math.round((localCcm - benchmark.ccmAdoptionRate) * 100),
      rpmAdoptionDelta: Math.round((localRpm - benchmark.rpmAdoptionRate) * 100),
      awvAdoptionDelta: Math.round((localAwv - benchmark.awvAdoptionRate) * 100),
    };

    // Fix avgPaymentDelta — compare state avg to national specialty avg from DB
    const nationalAvg =
      allStatesForSpec.reduce((sum, s) => sum + s.avgPayment * s.count, 0) /
      allStatesForSpec.reduce((sum, s) => sum + s.count, 0);
    vsNationalBenchmark.avgPaymentDelta = pctDelta(current.avgPayment, nationalAvg);
  }

  return {
    stateRank: 0, // Filled by caller if needed (rank within state by provider count)
    nationalSpecialtyRank,
    totalStatesWithSpecialty: allStatesForSpec.length,
    neighborComparisons,
    vsNationalBenchmark,
    percentilePosition,
    peerGroupSize: current.count,
    confidence: getConfidence(current.count),
  };
}
