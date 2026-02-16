import { existsSync } from "fs";
import { join } from "path";
import { ProviderBillingData } from "./types";
import { getBenchmark } from "./benchmarks";

// ── Types ─────────────────────────────────────────────────

/** Shape of a provider row from the SQLite database */
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

/** Shape of a benchmark row from the SQLite database */
export interface CMSBenchmarkData {
  specialty: string;
  providerCount: number;
  avgMedicarePatients: number;
  avgRevenuePerPatient: number;
  avgTotalPayment: number;
  avgTotalServices: number;
  pct99213: number;
  pct99214: number;
  pct99215: number;
  ccmAdoptionRate: number;
  rpmAdoptionRate: number;
  bhiAdoptionRate: number;
  awvAdoptionRate: number;
}

// ── Database Connection ──────────────────────────────────

const DB_PATH = join(process.cwd(), "data", "cms.db");

/** Lazy-loaded database connection (singleton) */
let _db: ReturnType<typeof import("better-sqlite3")> | null = null;

function getDb(): ReturnType<typeof import("better-sqlite3")> | null {
  if (_db) return _db;

  if (!existsSync(DB_PATH)) {
    return null;
  }

  try {
    // Dynamic import for better-sqlite3 (native module)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    _db = new Database(DB_PATH, { readonly: true });
    // Performance settings for read-only access
    (_db as any).pragma("journal_mode = WAL");
    (_db as any).pragma("cache_size = -16000"); // 16MB cache
    return _db;
  } catch (err) {
    console.error("[cms-data] Failed to open SQLite database:", err);
    return null;
  }
}

// ── Prepared statement cache ─────────────────────────────

let _stmtProvider: any = null;
let _stmtCodes: any = null;
let _stmtBenchmark: any = null;

function getProviderStmt() {
  if (_stmtProvider) return _stmtProvider;
  const db = getDb();
  if (!db) return null;
  _stmtProvider = (db as any).prepare(`
    SELECT
      npi, last_name, first_name, credential, specialty, state, city,
      total_beneficiaries, total_services, total_medicare_payment,
      em_99211, em_99212, em_99213, em_99214, em_99215, em_total,
      ccm_99490_services, ccm_99490_payment,
      rpm_99454_services, rpm_99457_services, rpm_payment,
      bhi_99484_services, bhi_99484_payment,
      awv_g0438_services, awv_g0439_services, awv_payment
    FROM providers
    WHERE npi = ?
  `);
  return _stmtProvider;
}

function getCodesStmt() {
  if (_stmtCodes) return _stmtCodes;
  const db = getDb();
  if (!db) return null;
  _stmtCodes = (db as any).prepare(`
    SELECT hcpcs_code, services, payment, beneficiaries
    FROM provider_codes
    WHERE npi = ?
    ORDER BY payment DESC
  `);
  return _stmtCodes;
}

function getBenchmarkStmt() {
  if (_stmtBenchmark) return _stmtBenchmark;
  const db = getDb();
  if (!db) return null;
  _stmtBenchmark = (db as any).prepare(`
    SELECT
      specialty, provider_count, avg_medicare_patients, avg_revenue_per_patient,
      avg_total_payment, avg_total_services,
      pct_99213, pct_99214, pct_99215,
      ccm_adoption_rate, rpm_adoption_rate, bhi_adoption_rate, awv_adoption_rate
    FROM benchmarks
    WHERE specialty = ?
  `);
  return _stmtBenchmark;
}

// ── Lookup ────────────────────────────────────────────────

/**
 * Look up real CMS billing data for a provider by NPI.
 * Returns null if no CMS data exists (database not built,
 * or provider not in the CMS dataset).
 */
export function lookupCMSData(npi: string): CMSProviderData | null {
  const stmt = getProviderStmt();
  if (!stmt) return null;

  try {
    const row = stmt.get(npi) as any;
    if (!row) return null;

    // Get top HCPCS codes for this provider
    const codesStmt = getCodesStmt();
    const codes = codesStmt
      ? (codesStmt.all(npi) as any[]).map((c: any) => ({
          code: c.hcpcs_code,
          services: c.services,
          payment: c.payment,
          beneficiaries: c.beneficiaries,
        }))
      : [];

    return {
      npi: row.npi,
      lastName: row.last_name,
      firstName: row.first_name,
      credential: row.credential,
      specialty: row.specialty,
      state: row.state,
      city: row.city,
      totalBeneficiaries: row.total_beneficiaries,
      totalServices: row.total_services,
      totalMedicarePayment: row.total_medicare_payment,
      em99211: row.em_99211,
      em99212: row.em_99212,
      em99213: row.em_99213,
      em99214: row.em_99214,
      em99215: row.em_99215,
      emTotal: row.em_total,
      ccm99490Services: row.ccm_99490_services,
      ccm99490Payment: row.ccm_99490_payment,
      rpm99454Services: row.rpm_99454_services,
      rpm99457Services: row.rpm_99457_services,
      rpmPayment: row.rpm_payment,
      bhi99484Services: row.bhi_99484_services,
      bhi99484Payment: row.bhi_99484_payment,
      awvG0438Services: row.awv_g0438_services,
      awvG0439Services: row.awv_g0439_services,
      awvPayment: row.awv_payment,
      topCodes: codes,
    };
  } catch (err) {
    console.error("[cms-data] Error looking up NPI:", err);
    return null;
  }
}

/**
 * Look up CMS benchmark data for a specialty.
 * Returns null if the specialty isn't in the database.
 */
export function lookupCMSBenchmark(
  specialty: string
): CMSBenchmarkData | null {
  const stmt = getBenchmarkStmt();
  if (!stmt) return null;

  try {
    const row = stmt.get(specialty) as any;
    if (!row) return null;

    return {
      specialty: row.specialty,
      providerCount: row.provider_count,
      avgMedicarePatients: row.avg_medicare_patients,
      avgRevenuePerPatient: row.avg_revenue_per_patient,
      avgTotalPayment: row.avg_total_payment,
      avgTotalServices: row.avg_total_services,
      pct99213: row.pct_99213,
      pct99214: row.pct_99214,
      pct99215: row.pct_99215,
      ccmAdoptionRate: row.ccm_adoption_rate,
      rpmAdoptionRate: row.rpm_adoption_rate,
      bhiAdoptionRate: row.bhi_adoption_rate,
      awvAdoptionRate: row.awv_adoption_rate,
    };
  } catch (err) {
    console.error("[cms-data] Error looking up benchmark:", err);
    return null;
  }
}

/**
 * Check whether the CMS SQLite database exists and is readable.
 */
export function isCMSDataAvailable(): boolean {
  return getDb() !== null;
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
 *   - CCM: 99490 is billed monthly, so patients ~ services/12
 *   - RPM: 99454 is billed monthly, so patients ~ services/12
 *   - BHI: 99484 is billed monthly, so patients ~ services/12
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
