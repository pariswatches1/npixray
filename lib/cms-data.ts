import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { ProviderBillingData } from "./types";
import { getBenchmark } from "./benchmarks";

// ── Types ─────────────────────────────────────────────────

/** Shape of the JSON files produced by data/scripts/process-cms.ts */
export interface CMSProviderData {
  npi: string;
  lastName: string;
  firstName: string;
  credential: string;
  specialty: string;
  state: string;
  city: string;
  totalBeneficiaries: number;
  totalServices: number;
  totalMedicarePayment: number;
  em99211: number;
  em99212: number;
  em99213: number;
  em99214: number;
  em99215: number;
  emTotal: number;
  ccm99490Services: number;
  ccm99490Payment: number;
  rpm99454Services: number;
  rpm99457Services: number;
  rpmPayment: number;
  bhi99484Services: number;
  bhi99484Payment: number;
  awvG0438Services: number;
  awvG0439Services: number;
  awvPayment: number;
  topCodes: {
    code: string;
    services: number;
    payment: number;
    beneficiaries: number;
  }[];
}

// ── Paths ─────────────────────────────────────────────────

const CMS_DATA_DIR = join(process.cwd(), "data", "cms-processed");

// ── Lookup ────────────────────────────────────────────────

/**
 * Look up real CMS billing data for a provider by NPI.
 * Returns null if no CMS data exists (data pipeline hasn't been run,
 * or provider not in the CMS dataset).
 */
export function lookupCMSData(npi: string): CMSProviderData | null {
  const prefix = npi.slice(0, 2);
  const filePath = join(CMS_DATA_DIR, prefix, `${npi}.json`);

  if (!existsSync(filePath)) {
    return null;
  }

  try {
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as CMSProviderData;
  } catch {
    return null;
  }
}

/**
 * Check whether CMS data has been processed (i.e., any NPI files exist).
 * This is a quick check to determine if the data pipeline has been run.
 */
export function isCMSDataAvailable(): boolean {
  return existsSync(CMS_DATA_DIR) && existsSync(join(CMS_DATA_DIR, "benchmarks.json"));
}

// ── Conversion ────────────────────────────────────────────

/** Medicare payment rates (2024 national averages) — kept in sync with revenue-calc.ts */
const RATES = {
  "99490": 66.0,
  "99454": 55.72,
  "99457": 48.8,
  "99484": 48.56,
  G0439: 118.88,
};

/**
 * Convert real CMS data into the ProviderBillingData shape
 * used by the revenue calculation engine.
 *
 * For programs (CCM, RPM, BHI, AWV) we derive patient counts from services:
 *   - CCM: 99490 is billed monthly, so patients ≈ services/12
 *   - RPM: 99454 is billed monthly, so patients ≈ services/12
 *   - BHI: 99484 is billed monthly, so patients ≈ services/12
 *   - AWV: G0438/G0439 is once per year, so count = services
 */
export function cmsToBillingData(
  cms: CMSProviderData,
  specialty: string
): ProviderBillingData {
  const bench = getBenchmark(specialty);

  // E&M totals — use real CMS counts
  const emTotal = cms.emTotal || 1;

  // Program patient estimates
  const ccmPatients = Math.max(1, Math.round(cms.ccm99490Services / 12));
  const rpmPatients = Math.max(
    1,
    Math.round(Math.max(cms.rpm99454Services, cms.rpm99457Services) / 12)
  );
  const bhiPatients = Math.max(1, Math.round(cms.bhi99484Services / 12));
  const awvCount = cms.awvG0438Services + cms.awvG0439Services;

  // If provider has zero program services, set patients to 0 (not 1)
  const ccmPatientsAdj = cms.ccm99490Services > 0 ? ccmPatients : 0;
  const rpmPatientsAdj =
    cms.rpm99454Services > 0 || cms.rpm99457Services > 0 ? rpmPatients : 0;
  const bhiPatientsAdj = cms.bhi99484Services > 0 ? bhiPatients : 0;

  return {
    npi: cms.npi,
    specialty,
    totalMedicarePatients: cms.totalBeneficiaries,
    totalServices: cms.totalServices,
    totalMedicarePayment: cms.totalMedicarePayment,
    // E&M — real data
    em99213Count: cms.em99213,
    em99214Count: cms.em99214,
    em99215Count: cms.em99215,
    emTotalCount: emTotal,
    // Programs — derived from real service counts
    ccmPatients: ccmPatientsAdj,
    ccmBilled: cms.ccm99490Payment,
    rpmPatients: rpmPatientsAdj,
    rpmBilled: cms.rpmPayment,
    bhiPatients: bhiPatientsAdj,
    bhiBilled: cms.bhi99484Payment,
    awvCount,
    awvBilled: cms.awvPayment,
    // Chronic conditions — use benchmark rates (CMS data doesn't include these directly)
    chronicDiabetesPct: bench.chronicDiabetesPct,
    chronicHypertensionPct: bench.chronicHypertensionPct,
    chronicHeartFailurePct: bench.chronicHeartFailurePct,
    chronicDepressionPct: bench.chronicDepressionPct,
    chronicCopdPct: bench.chronicCopdPct,
  };
}
