/**
 * Centralized database query layer for all SEO pages.
 * Uses Neon Postgres (@neondatabase/serverless) for serverless-compatible queries.
 */

import { neon } from "@neondatabase/serverless";

function getSql() {
  if (!process.env.DATABASE_URL) return null;
  return neon(process.env.DATABASE_URL);
}

// ── State helpers ────────────────────────────────────────

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia", PR: "Puerto Rico", VI: "Virgin Islands", GU: "Guam",
  AS: "American Samoa", MP: "Northern Mariana Islands",
};

export function stateAbbrToName(abbr: string): string {
  return STATE_NAMES[abbr.toUpperCase()] || abbr;
}

export function stateNameToAbbr(name: string): string | null {
  const lower = name.toLowerCase().replace(/-/g, " ");
  for (const [abbr, n] of Object.entries(STATE_NAMES)) {
    if (n.toLowerCase() === lower) return abbr;
  }
  return null;
}

export function stateToSlug(abbr: string): string {
  return stateAbbrToName(abbr).toLowerCase().replace(/\s+/g, "-");
}

export function slugToStateAbbr(slug: string): string | null {
  return stateNameToAbbr(slug);
}

export function specialtyToSlug(specialty: string): string {
  return specialty.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "").replace(/^-+/, "");
}

export function cityToSlug(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "").replace(/^-+/, "");
}

// ── Provider queries ─────────────────────────────────────

export interface ProviderRow {
  npi: string;
  last_name: string;
  first_name: string;
  credential: string;
  specialty: string;
  state: string;
  city: string;
  total_beneficiaries: number;
  total_services: number;
  total_medicare_payment: number;
  em_99211: number;
  em_99212: number;
  em_99213: number;
  em_99214: number;
  em_99215: number;
  em_total: number;
  ccm_99490_services: number;
  ccm_99490_payment: number;
  rpm_99454_services: number;
  rpm_99457_services: number;
  rpm_payment: number;
  bhi_99484_services: number;
  bhi_99484_payment: number;
  awv_g0438_services: number;
  awv_g0439_services: number;
  awv_payment: number;
  revenue_score: number | null;
}

export interface CodeRow {
  npi: string;
  hcpcs_code: string;
  services: number;
  payment: number;
  beneficiaries: number;
}

export interface BenchmarkRow {
  specialty: string;
  provider_count: number;
  avg_medicare_patients: number;
  avg_revenue_per_patient: number;
  avg_total_payment: number;
  avg_total_services: number;
  pct_99213: number;
  pct_99214: number;
  pct_99215: number;
  ccm_adoption_rate: number;
  rpm_adoption_rate: number;
  bhi_adoption_rate: number;
  awv_adoption_rate: number;
}

// Provider lookups
export async function getProvider(npi: string): Promise<ProviderRow | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql.query("SELECT * FROM providers WHERE npi = $1", [npi]);
  return (rows[0] as ProviderRow) ?? null;
}

export async function getProviderCodes(npi: string, limit = 10): Promise<CodeRow[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    "SELECT * FROM provider_codes WHERE npi = $1 ORDER BY payment DESC LIMIT $2",
    [npi, limit]
  );
  return rows as CodeRow[];
}

export async function getRelatedProviders(specialty: string, city: string, state: string, excludeNpi: string, limit = 5): Promise<ProviderRow[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    "SELECT * FROM providers WHERE specialty = $1 AND city = $2 AND state = $3 AND npi != $4 ORDER BY total_medicare_payment DESC LIMIT $5",
    [specialty, city, state, excludeNpi, limit]
  );
  return rows as ProviderRow[];
}

// ── State queries ────────────────────────────────────────

export interface StateStats {
  state: string;
  totalProviders: number;
  totalPayment: number;
  totalServices: number;
  avgPayment: number;
}

export async function getAllStates(): Promise<StateStats[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(`
    SELECT state, COUNT(*) AS "totalProviders", SUM(total_medicare_payment) AS "totalPayment",
           SUM(total_services) AS "totalServices", AVG(total_medicare_payment) AS "avgPayment"
    FROM providers WHERE state != '' GROUP BY state ORDER BY "totalProviders" DESC
  `);
  return rows as StateStats[];
}

export async function getStateStats(stateAbbr: string): Promise<StateStats | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql.query(`
    SELECT state, COUNT(*) AS "totalProviders", SUM(total_medicare_payment) AS "totalPayment",
           SUM(total_services) AS "totalServices", AVG(total_medicare_payment) AS "avgPayment"
    FROM providers WHERE state = $1 GROUP BY state
  `, [stateAbbr]);
  return (rows[0] as StateStats) ?? null;
}

export async function getStateSpecialties(stateAbbr: string, limit = 20): Promise<{ specialty: string; count: number; avgPayment: number }[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(`
    SELECT specialty, COUNT(*) AS "count", AVG(total_medicare_payment) AS "avgPayment"
    FROM providers WHERE state = $1 AND specialty != '' GROUP BY specialty ORDER BY "count" DESC LIMIT $2
  `, [stateAbbr, limit]);
  return rows as { specialty: string; count: number; avgPayment: number }[];
}

export async function getStateCities(stateAbbr: string, limit = 30): Promise<{ city: string; count: number; avgPayment: number }[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(`
    SELECT city, COUNT(*) AS "count", AVG(total_medicare_payment) AS "avgPayment"
    FROM providers WHERE state = $1 AND city != '' GROUP BY city HAVING COUNT(*) >= 5 ORDER BY "count" DESC LIMIT $2
  `, [stateAbbr, limit]);
  return rows as { city: string; count: number; avgPayment: number }[];
}

export async function getStateTopProviders(stateAbbr: string, limit = 50): Promise<ProviderRow[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    "SELECT * FROM providers WHERE state = $1 ORDER BY total_medicare_payment DESC LIMIT $2",
    [stateAbbr, limit]
  );
  return rows as ProviderRow[];
}

// ── City queries ─────────────────────────────────────────

export async function getCityStats(stateAbbr: string, city: string): Promise<{ count: number; avgPayment: number; totalPayment: number } | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql.query(`
    SELECT COUNT(*) AS "count", AVG(total_medicare_payment) AS "avgPayment", SUM(total_medicare_payment) AS "totalPayment"
    FROM providers WHERE state = $1 AND city ILIKE $2
  `, [stateAbbr, city]);
  return (rows[0] as { count: number; avgPayment: number; totalPayment: number }) ?? null;
}

export async function getCityProviders(stateAbbr: string, city: string, limit = 100): Promise<ProviderRow[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    "SELECT * FROM providers WHERE state = $1 AND city ILIKE $2 ORDER BY total_medicare_payment DESC LIMIT $3",
    [stateAbbr, city, limit]
  );
  return rows as ProviderRow[];
}

export async function getCitySpecialties(stateAbbr: string, city: string): Promise<{ specialty: string; count: number; avgPayment: number }[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(`
    SELECT specialty, COUNT(*) AS "count", AVG(total_medicare_payment) AS "avgPayment"
    FROM providers WHERE state = $1 AND city ILIKE $2 AND specialty != '' GROUP BY specialty ORDER BY "count" DESC
  `, [stateAbbr, city]);
  return rows as { specialty: string; count: number; avgPayment: number }[];
}

export async function getCityNameFromDb(stateAbbr: string, slug: string): Promise<string | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql.query(
    "SELECT city FROM providers WHERE state = $1 AND LOWER(REPLACE(REPLACE(city, ' ', '-'), '.', '')) = LOWER($2) LIMIT 1",
    [stateAbbr, slug]
  );
  return (rows[0] as { city: string })?.city ?? null;
}

// ── Specialty queries ────────────────────────────────────

export async function getAllBenchmarks(): Promise<BenchmarkRow[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query("SELECT * FROM benchmarks ORDER BY provider_count DESC");
  return rows as BenchmarkRow[];
}

export async function getBenchmarkBySpecialty(specialty: string): Promise<BenchmarkRow | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql.query("SELECT * FROM benchmarks WHERE specialty = $1", [specialty]);
  return (rows[0] as BenchmarkRow) ?? null;
}

export async function getSpecialtyProviders(specialty: string, limit = 50): Promise<ProviderRow[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    "SELECT * FROM providers WHERE specialty = $1 ORDER BY total_medicare_payment DESC LIMIT $2",
    [specialty, limit]
  );
  return rows as ProviderRow[];
}

export async function getSpecialtyByState(specialty: string, stateAbbr: string): Promise<{ count: number; avgPayment: number; totalPayment: number } | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql.query(`
    SELECT COUNT(*) AS "count", AVG(total_medicare_payment) AS "avgPayment", SUM(total_medicare_payment) AS "totalPayment"
    FROM providers WHERE specialty = $1 AND state = $2
  `, [specialty, stateAbbr]);
  return (rows[0] as { count: number; avgPayment: number; totalPayment: number }) ?? null;
}

export async function getSpecialtyStateProviders(specialty: string, stateAbbr: string, limit = 50): Promise<ProviderRow[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    "SELECT * FROM providers WHERE specialty = $1 AND state = $2 ORDER BY total_medicare_payment DESC LIMIT $3",
    [specialty, stateAbbr, limit]
  );
  return rows as ProviderRow[];
}

export async function getCitySpecialtyProviders(stateAbbr: string, city: string, specialty: string, limit = 50): Promise<ProviderRow[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    "SELECT * FROM providers WHERE state = $1 AND city ILIKE $2 AND specialty = $3 ORDER BY total_medicare_payment DESC LIMIT $4",
    [stateAbbr, city, specialty, limit]
  );
  return rows as ProviderRow[];
}

// ── Code queries ─────────────────────────────────────────

export interface CodeStats {
  hcpcs_code: string;
  totalProviders: number;
  totalServices: number;
  totalPayment: number;
  avgPayment: number;
  avgServicesPerProvider: number;
}

export async function getTopCodes(limit = 200): Promise<CodeStats[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(`
    SELECT hcpcs_code, COUNT(DISTINCT npi) AS "totalProviders", SUM(services) AS "totalServices",
           SUM(payment) AS "totalPayment", AVG(payment / NULLIF(services, 0)) AS "avgPayment",
           AVG(services) AS "avgServicesPerProvider"
    FROM provider_codes GROUP BY hcpcs_code ORDER BY "totalServices" DESC LIMIT $1
  `, [limit]);
  return rows as CodeStats[];
}

export async function getCodeStats(code: string): Promise<CodeStats | null> {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql.query(`
    SELECT hcpcs_code, COUNT(DISTINCT npi) AS "totalProviders", SUM(services) AS "totalServices",
           SUM(payment) AS "totalPayment", AVG(payment / NULLIF(services, 0)) AS "avgPayment",
           AVG(services) AS "avgServicesPerProvider"
    FROM provider_codes WHERE hcpcs_code = $1
  `, [code]);
  return (rows[0] as CodeStats) ?? null;
}

export async function getCodeTopSpecialties(code: string, limit = 10): Promise<{ specialty: string; providers: number; totalServices: number }[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(`
    SELECT p.specialty, COUNT(DISTINCT pc.npi) AS "providers", SUM(pc.services) AS "totalServices"
    FROM provider_codes pc JOIN providers p ON pc.npi = p.npi
    WHERE pc.hcpcs_code = $1 AND p.specialty != '' GROUP BY p.specialty ORDER BY "totalServices" DESC LIMIT $2
  `, [code, limit]);
  return rows as { specialty: string; providers: number; totalServices: number }[];
}

// ── Aggregate queries ────────────────────────────────────

export async function getNationalStats(): Promise<{ totalProviders: number; totalPayment: number; totalServices: number; totalCodes: number } | null> {
  const sql = getSql();
  if (!sql) return null;
  const providerRows = await sql.query(
    'SELECT COUNT(*) AS "totalProviders", SUM(total_medicare_payment) AS "totalPayment", SUM(total_services) AS "totalServices" FROM providers'
  );
  const codeRows = await sql.query(
    'SELECT COUNT(*) AS "totalCodes" FROM provider_codes'
  );
  const p = providerRows[0] as { totalProviders: number; totalPayment: number; totalServices: number } | undefined;
  const c = codeRows[0] as { totalCodes: number } | undefined;
  if (!p || !c) return null;
  return {
    totalProviders: p.totalProviders,
    totalPayment: p.totalPayment,
    totalServices: p.totalServices,
    totalCodes: c.totalCodes,
  };
}

export async function getTopProvidersByPayment(limit = 100): Promise<ProviderRow[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    "SELECT * FROM providers ORDER BY total_medicare_payment DESC LIMIT $1",
    [limit]
  );
  return rows as ProviderRow[];
}

// ── Distinct value queries for sitemap/static generation ─

export async function getDistinctStates(): Promise<string[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query("SELECT DISTINCT state FROM providers WHERE state != '' ORDER BY state");
  return rows.map((r: any) => r.state as string);
}

export async function getDistinctSpecialties(): Promise<string[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query("SELECT DISTINCT specialty FROM benchmarks ORDER BY provider_count DESC");
  return rows.map((r: any) => r.specialty as string);
}

export async function getDistinctCities(stateAbbr: string, minProviders = 5): Promise<string[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    "SELECT city FROM providers WHERE state = $1 AND city != '' GROUP BY city HAVING COUNT(*) >= $2 ORDER BY COUNT(*) DESC",
    [stateAbbr, minProviders]
  );
  return rows.map((r: any) => r.city as string);
}

export async function getProvidersByState(stateAbbr: string): Promise<{ npi: string }[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query("SELECT npi FROM providers WHERE state = $1", [stateAbbr]);
  return rows as { npi: string }[];
}

// ── Revenue Score queries ───────────────────────────────

export async function getProviderCodeCount(npi: string): Promise<number> {
  const sql = getSql();
  if (!sql) return 0;
  const rows = await sql.query(
    'SELECT COUNT(DISTINCT hcpcs_code) AS "cnt" FROM provider_codes WHERE npi = $1',
    [npi]
  );
  return Number((rows[0] as any)?.cnt ?? 0);
}

export async function getScoreDistribution(
  filter?: { state?: string; specialty?: string }
): Promise<{ bucket: number; count: number }[]> {
  const sql = getSql();
  if (!sql) return [];
  let where = "WHERE revenue_score IS NOT NULL";
  const params: any[] = [];
  if (filter?.state) {
    params.push(filter.state);
    where += ` AND state = $${params.length}`;
  }
  if (filter?.specialty) {
    params.push(filter.specialty);
    where += ` AND specialty = $${params.length}`;
  }
  const rows = await sql.query(
    `SELECT (revenue_score / 10) * 10 AS "bucket", COUNT(*) AS "count"
     FROM providers ${where}
     GROUP BY "bucket" ORDER BY "bucket"`,
    params
  );
  return rows.map((r: any) => ({ bucket: Number(r.bucket), count: Number(r.count) }));
}

export async function getAverageScore(
  filter?: { state?: string; specialty?: string }
): Promise<number> {
  const sql = getSql();
  if (!sql) return 0;
  let where = "WHERE revenue_score IS NOT NULL";
  const params: any[] = [];
  if (filter?.state) {
    params.push(filter.state);
    where += ` AND state = $${params.length}`;
  }
  if (filter?.specialty) {
    params.push(filter.specialty);
    where += ` AND specialty = $${params.length}`;
  }
  const rows = await sql.query(
    `SELECT AVG(revenue_score) AS "avg" FROM providers ${where}`,
    params
  );
  return Number((rows[0] as any)?.avg ?? 0);
}

export async function getTopScoringProviders(
  filter?: { state?: string; specialty?: string },
  limit = 50
): Promise<{ npi: string; specialty: string; state: string; city: string; revenue_score: number }[]> {
  const sql = getSql();
  if (!sql) return [];
  let where = "WHERE revenue_score IS NOT NULL";
  const params: any[] = [];
  if (filter?.state) {
    params.push(filter.state);
    where += ` AND state = $${params.length}`;
  }
  if (filter?.specialty) {
    params.push(filter.specialty);
    where += ` AND specialty = $${params.length}`;
  }
  params.push(limit);
  const rows = await sql.query(
    `SELECT npi, specialty, state, city, revenue_score
     FROM providers ${where}
     ORDER BY revenue_score DESC LIMIT $${params.length}`,
    params
  );
  return rows as any[];
}

export async function getStateScoreRankings(): Promise<{ state: string; avgScore: number; providerCount: number }[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    `SELECT state, AVG(revenue_score) AS "avgScore", COUNT(*) AS "providerCount"
     FROM providers WHERE revenue_score IS NOT NULL AND state != ''
     GROUP BY state ORDER BY "avgScore" DESC`
  );
  return rows.map((r: any) => ({
    state: r.state,
    avgScore: Number(r.avgScore),
    providerCount: Number(r.providerCount),
  }));
}

export async function getSpecialtyScoreRankings(): Promise<{ specialty: string; avgScore: number; providerCount: number }[]> {
  const sql = getSql();
  if (!sql) return [];
  const rows = await sql.query(
    `SELECT specialty, AVG(revenue_score) AS "avgScore", COUNT(*) AS "providerCount"
     FROM providers WHERE revenue_score IS NOT NULL AND specialty != ''
     GROUP BY specialty HAVING COUNT(*) >= 100 ORDER BY "avgScore" DESC`
  );
  return rows.map((r: any) => ({
    specialty: r.specialty,
    avgScore: Number(r.avgScore),
    providerCount: Number(r.providerCount),
  }));
}

// ── Formatting helpers ───────────────────────────────────

// Re-export client-safe formatting utilities so existing imports still work
export { formatCurrency, formatNumber } from "./format";
