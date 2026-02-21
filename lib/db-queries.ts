/**
 * Centralized database query layer for all SEO pages.
 * Uses Neon PostgreSQL in production (DATABASE_URL), falls back to SQLite locally.
 *
 * Functions return sync values (SQLite) or Promises (Neon).
 * All callers use `await`, which works for both cases.
 */

import { existsSync } from "fs";
import { join } from "path";

// ── Database abstraction ────────────────────────────────
const DB_PATH = join(process.cwd(), "data", "cms.db");
const USE_NEON = !!process.env.DATABASE_URL;

// eslint-disable-next-line
let _db: any = null;
// eslint-disable-next-line
let _neon: any = null;

function getDb(): any {
  if (USE_NEON) return null;
  if (_db) return _db;
  if (!existsSync(DB_PATH)) return null;
  try {
    // eslint-disable-next-line
    const Database = require("better-sqlite3");
    _db = new Database(DB_PATH, { readonly: true });
    _db.pragma("journal_mode = WAL");
    _db.pragma("cache_size = -32000");
    return _db;
  } catch {
    return null;
  }
}

async function getNeonClient() {
  if (!_neon) {
    const { neon } = await import("@neondatabase/serverless");
    _neon = neon(process.env.DATABASE_URL!);
  }
  return _neon;
}

function toPg(sql: string): string {
  let idx = 0;
  return sql.replace(/\?/g, () => `$${++idx}`);
}

async function queryAll(sql: string, params: any[] = []): Promise<any[]> {
  if (USE_NEON) {
    const neonSql = await getNeonClient();
    return neonSql.query(toPg(sql), params);
  }
  const db = getDb();
  if (!db) return [];
  return db.prepare(sql).all(...params);
}

async function queryOne(sql: string, params: any[] = []): Promise<any | null> {
  if (USE_NEON) {
    const neonSql = await getNeonClient();
    const rows = await neonSql.query(toPg(sql), params);
    return rows.length > 0 ? rows[0] : null;
  }
  const db = getDb();
  if (!db) return null;
  return db.prepare(sql).get(...params) ?? null;
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

/**
 * Reverse-lookup a specialty slug to the actual specialty name.
 * First checks benchmarks, then falls back to the providers table
 * (which has many more specialties like Nurse Practitioner, etc.)
 */
export async function slugToSpecialtyName(slug: string): Promise<string | null> {
  // First check benchmarks (fast, in-memory)
  const benchmarks = await getAllBenchmarks();
  for (const b of benchmarks) {
    if (specialtyToSlug(b.specialty) === slug) return b.specialty;
  }

  // Fall back to providers table for specialties not in benchmarks
  const allSpecialties: any[] = USE_NEON
    ? await queryAll("SELECT DISTINCT specialty FROM providers WHERE specialty != '' ORDER BY specialty")
    : (() => {
        const db = getDb();
        if (!db) return [];
        return db.prepare("SELECT DISTINCT specialty FROM providers WHERE specialty != '' ORDER BY specialty").all();
      })();

  for (const row of allSpecialties) {
    if (specialtyToSlug(row.specialty) === slug) return row.specialty;
  }

  return null;
}

// ── Interfaces ───────────────────────────────────────────

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
  revenue_score?: number;
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

export interface StateStats {
  state: string;
  totalProviders: number;
  totalPayment: number;
  totalServices: number;
  avgPayment: number;
}

export interface CodeStats {
  hcpcs_code: string;
  totalProviders: number;
  totalServices: number;
  totalPayment: number;
  avgPayment: number;
  avgServicesPerProvider: number;
}

// ── Mapping helpers for Neon (lowercase cols) ────────────

function num(v: any): number { return Number(v ?? 0); }

function mapState(r: any): StateStats {
  return { state: r.state, totalProviders: num(r.totalProviders ?? r.totalproviders), totalPayment: num(r.totalPayment ?? r.totalpayment), totalServices: num(r.totalServices ?? r.totalservices), avgPayment: num(r.avgPayment ?? r.avgpayment) };
}

function mapCode(r: any): CodeStats {
  return { hcpcs_code: r.hcpcs_code, totalProviders: num(r.totalProviders ?? r.totalproviders), totalServices: num(r.totalServices ?? r.totalservices), totalPayment: num(r.totalPayment ?? r.totalpayment), avgPayment: num(r.avgPayment ?? r.avgpayment), avgServicesPerProvider: num(r.avgServicesPerProvider ?? r.avgservicesperprovider) };
}

// ── Provider queries ─────────────────────────────────────

export function getProvider(npi: string): any {
  if (USE_NEON) return queryOne("SELECT * FROM providers WHERE npi = ?", [npi]);
  const db = getDb();
  if (!db) return null;
  return db.prepare("SELECT * FROM providers WHERE npi = ?").get(npi) ?? null;
}

export function getProviderCodes(npi: string, limit = 10): any {
  if (USE_NEON) return queryAll("SELECT * FROM provider_codes WHERE npi = ? ORDER BY payment DESC LIMIT ?", [npi, limit]);
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM provider_codes WHERE npi = ? ORDER BY payment DESC LIMIT ?").all(npi, limit);
}

export function getRelatedProviders(specialty: string, city: string, state: string, excludeNpi: string, limit = 5): any {
  if (USE_NEON) return queryAll("SELECT * FROM providers WHERE specialty = ? AND city = ? AND state = ? AND npi != ? ORDER BY total_medicare_payment DESC LIMIT ?", [specialty, city, state, excludeNpi, limit]);
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM providers WHERE specialty = ? AND city = ? AND state = ? AND npi != ? ORDER BY total_medicare_payment DESC LIMIT ?").all(specialty, city, state, excludeNpi, limit);
}

// ── State queries ────────────────────────────────────────

export function getAllStates(): any {
  if (USE_NEON) return queryAll(`SELECT state, COUNT(*) as "totalProviders", SUM(total_medicare_payment) as "totalPayment", SUM(total_services) as "totalServices", AVG(total_medicare_payment) as "avgPayment" FROM providers WHERE state != '' GROUP BY state ORDER BY "totalProviders" DESC`).then(r => r.map(mapState));
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT state, COUNT(*) as totalProviders, SUM(total_medicare_payment) as totalPayment, SUM(total_services) as totalServices, AVG(total_medicare_payment) as avgPayment FROM providers WHERE state != '' GROUP BY state ORDER BY totalProviders DESC").all();
}

export function getStateStats(stateAbbr: string): any {
  if (USE_NEON) return queryOne(`SELECT state, COUNT(*) as "totalProviders", SUM(total_medicare_payment) as "totalPayment", SUM(total_services) as "totalServices", AVG(total_medicare_payment) as "avgPayment" FROM providers WHERE state = ? GROUP BY state`, [stateAbbr]).then(r => r ? mapState(r) : null);
  const db = getDb();
  if (!db) return null;
  return db.prepare("SELECT state, COUNT(*) as totalProviders, SUM(total_medicare_payment) as totalPayment, SUM(total_services) as totalServices, AVG(total_medicare_payment) as avgPayment FROM providers WHERE state = ?").get(stateAbbr) ?? null;
}

export function getStateSpecialties(stateAbbr: string, limit = 20): any {
  if (USE_NEON) return queryAll(`SELECT specialty, COUNT(*) as count, AVG(total_medicare_payment) as "avgPayment" FROM providers WHERE state = ? AND specialty != '' GROUP BY specialty ORDER BY count DESC LIMIT ?`, [stateAbbr, limit]).then(r => r.map((x: any) => ({ specialty: x.specialty, count: num(x.count), avgPayment: num(x.avgPayment ?? x.avgpayment) })));
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT specialty, COUNT(*) as count, AVG(total_medicare_payment) as avgPayment FROM providers WHERE state = ? AND specialty != '' GROUP BY specialty ORDER BY count DESC LIMIT ?").all(stateAbbr, limit);
}

export function getStateCities(stateAbbr: string, limit = 30): any {
  if (USE_NEON) return queryAll(`SELECT city, COUNT(*) as count, AVG(total_medicare_payment) as "avgPayment" FROM providers WHERE state = ? AND city != '' GROUP BY city HAVING COUNT(*) >= 5 ORDER BY count DESC LIMIT ?`, [stateAbbr, limit]).then(r => r.map((x: any) => ({ city: x.city, count: num(x.count), avgPayment: num(x.avgPayment ?? x.avgpayment) })));
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT city, COUNT(*) as count, AVG(total_medicare_payment) as avgPayment FROM providers WHERE state = ? AND city != '' GROUP BY city HAVING count >= 5 ORDER BY count DESC LIMIT ?").all(stateAbbr, limit);
}

export function getStateTopProviders(stateAbbr: string, limit = 50): any {
  if (USE_NEON) return queryAll("SELECT * FROM providers WHERE state = ? ORDER BY total_medicare_payment DESC LIMIT ?", [stateAbbr, limit]);
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM providers WHERE state = ? ORDER BY total_medicare_payment DESC LIMIT ?").all(stateAbbr, limit);
}

// ── City queries ─────────────────────────────────────────

export function getCityStats(stateAbbr: string, city: string): any {
  if (USE_NEON) return queryOne(`SELECT COUNT(*) as count, AVG(total_medicare_payment) as "avgPayment", SUM(total_medicare_payment) as "totalPayment" FROM providers WHERE state = ? AND LOWER(city) = LOWER(?)`, [stateAbbr, city]).then(r => r && num(r.count) > 0 ? { count: num(r.count), avgPayment: num(r.avgPayment ?? r.avgpayment), totalPayment: num(r.totalPayment ?? r.totalpayment) } : null);
  const db = getDb();
  if (!db) return null;
  return db.prepare("SELECT COUNT(*) as count, AVG(total_medicare_payment) as avgPayment, SUM(total_medicare_payment) as totalPayment FROM providers WHERE state = ? AND LOWER(city) = LOWER(?)").get(stateAbbr, city) ?? null;
}

export function getCityProviders(stateAbbr: string, city: string, limit = 100): any {
  if (USE_NEON) return queryAll("SELECT * FROM providers WHERE state = ? AND LOWER(city) = LOWER(?) ORDER BY total_medicare_payment DESC LIMIT ?", [stateAbbr, city, limit]);
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM providers WHERE state = ? AND LOWER(city) = LOWER(?) ORDER BY total_medicare_payment DESC LIMIT ?").all(stateAbbr, city, limit);
}

export function getCitySpecialties(stateAbbr: string, city: string): any {
  if (USE_NEON) return queryAll(`SELECT specialty, COUNT(*) as count, AVG(total_medicare_payment) as "avgPayment" FROM providers WHERE state = ? AND LOWER(city) = LOWER(?) AND specialty != '' GROUP BY specialty ORDER BY count DESC`, [stateAbbr, city]).then(r => r.map((x: any) => ({ specialty: x.specialty, count: num(x.count), avgPayment: num(x.avgPayment ?? x.avgpayment) })));
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT specialty, COUNT(*) as count, AVG(total_medicare_payment) as avgPayment FROM providers WHERE state = ? AND LOWER(city) = LOWER(?) AND specialty != '' GROUP BY specialty ORDER BY count DESC").all(stateAbbr, city);
}

export function getCityNameFromDb(stateAbbr: string, slug: string): any {
  if (USE_NEON) return queryOne("SELECT city FROM providers WHERE state = ? AND LOWER(REPLACE(REPLACE(city, ' ', '-'), '.', '')) = LOWER(?) LIMIT 1", [stateAbbr, slug]).then(r => r?.city ?? null);
  const db = getDb();
  if (!db) return null;
  const row = db.prepare("SELECT city FROM providers WHERE state = ? AND LOWER(REPLACE(REPLACE(city, ' ', '-'), '.', '')) = LOWER(?) LIMIT 1").get(stateAbbr, slug) as any;
  return row?.city ?? null;
}

// ── Specialty queries ────────────────────────────────────

export function getAllBenchmarks(): any {
  if (USE_NEON) return queryAll("SELECT * FROM benchmarks ORDER BY provider_count DESC");
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM benchmarks ORDER BY provider_count DESC").all();
}

export function getBenchmarkBySpecialty(specialty: string): any {
  if (USE_NEON) return queryOne("SELECT * FROM benchmarks WHERE specialty = ?", [specialty]);
  const db = getDb();
  if (!db) return null;
  return db.prepare("SELECT * FROM benchmarks WHERE specialty = ?").get(specialty) ?? null;
}

export function getSpecialtyProviders(specialty: string, limit = 50): any {
  if (USE_NEON) return queryAll("SELECT * FROM providers WHERE specialty = ? ORDER BY total_medicare_payment DESC LIMIT ?", [specialty, limit]);
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM providers WHERE specialty = ? ORDER BY total_medicare_payment DESC LIMIT ?").all(specialty, limit);
}

export function getSpecialtyByState(specialty: string, stateAbbr: string): any {
  if (USE_NEON) return queryOne(`SELECT COUNT(*) as count, AVG(total_medicare_payment) as "avgPayment", SUM(total_medicare_payment) as "totalPayment" FROM providers WHERE specialty = ? AND state = ?`, [specialty, stateAbbr]).then(r => r && num(r.count) > 0 ? { count: num(r.count), avgPayment: num(r.avgPayment ?? r.avgpayment), totalPayment: num(r.totalPayment ?? r.totalpayment) } : null);
  const db = getDb();
  if (!db) return null;
  return db.prepare("SELECT COUNT(*) as count, AVG(total_medicare_payment) as avgPayment, SUM(total_medicare_payment) as totalPayment FROM providers WHERE specialty = ? AND state = ?").get(specialty, stateAbbr) ?? null;
}

export function getSpecialtyStateProviders(specialty: string, stateAbbr: string, limit = 50): any {
  if (USE_NEON) return queryAll("SELECT * FROM providers WHERE specialty = ? AND state = ? ORDER BY total_medicare_payment DESC LIMIT ?", [specialty, stateAbbr, limit]);
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM providers WHERE specialty = ? AND state = ? ORDER BY total_medicare_payment DESC LIMIT ?").all(specialty, stateAbbr, limit);
}

export function getCitySpecialtyProviders(stateAbbr: string, city: string, specialty: string, limit = 50): any {
  if (USE_NEON) return queryAll("SELECT * FROM providers WHERE state = ? AND LOWER(city) = LOWER(?) AND specialty = ? ORDER BY total_medicare_payment DESC LIMIT ?", [stateAbbr, city, specialty, limit]);
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM providers WHERE state = ? AND LOWER(city) = LOWER(?) AND specialty = ? ORDER BY total_medicare_payment DESC LIMIT ?").all(stateAbbr, city, specialty, limit);
}

// ── Code queries ─────────────────────────────────────────

export function getTopCodes(limit = 200): any {
  if (USE_NEON) return queryAll(`SELECT hcpcs_code, COUNT(DISTINCT npi) as "totalProviders", SUM(services) as "totalServices", SUM(payment) as "totalPayment", AVG(payment / NULLIF(services, 0)) as "avgPayment", AVG(services) as "avgServicesPerProvider" FROM provider_codes GROUP BY hcpcs_code ORDER BY "totalServices" DESC LIMIT ?`, [limit]).then(r => r.map(mapCode));
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT hcpcs_code, COUNT(DISTINCT npi) as totalProviders, SUM(services) as totalServices, SUM(payment) as totalPayment, AVG(payment / NULLIF(services, 0)) as avgPayment, AVG(services) as avgServicesPerProvider FROM provider_codes GROUP BY hcpcs_code ORDER BY totalServices DESC LIMIT ?").all(limit);
}

export function getCodeStats(code: string): any {
  if (USE_NEON) return queryOne(`SELECT hcpcs_code, COUNT(DISTINCT npi) as "totalProviders", SUM(services) as "totalServices", SUM(payment) as "totalPayment", AVG(payment / NULLIF(services, 0)) as "avgPayment", AVG(services) as "avgServicesPerProvider" FROM provider_codes WHERE hcpcs_code = ?`, [code]).then(r => r ? mapCode(r) : null);
  const db = getDb();
  if (!db) return null;
  return db.prepare("SELECT hcpcs_code, COUNT(DISTINCT npi) as totalProviders, SUM(services) as totalServices, SUM(payment) as totalPayment, AVG(payment / NULLIF(services, 0)) as avgPayment, AVG(services) as avgServicesPerProvider FROM provider_codes WHERE hcpcs_code = ?").get(code) ?? null;
}

export function getCodeTopSpecialties(code: string, limit = 10): any {
  if (USE_NEON) return queryAll(`SELECT p.specialty, COUNT(DISTINCT pc.npi) as providers, SUM(pc.services) as "totalServices" FROM provider_codes pc JOIN providers p ON pc.npi = p.npi WHERE pc.hcpcs_code = ? AND p.specialty != '' GROUP BY p.specialty ORDER BY "totalServices" DESC LIMIT ?`, [code, limit]).then(r => r.map((x: any) => ({ specialty: x.specialty, providers: num(x.providers), totalServices: num(x.totalServices ?? x.totalservices) })));
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT p.specialty, COUNT(DISTINCT pc.npi) as providers, SUM(pc.services) as totalServices FROM provider_codes pc JOIN providers p ON pc.npi = p.npi WHERE pc.hcpcs_code = ? AND p.specialty != '' GROUP BY p.specialty ORDER BY totalServices DESC LIMIT ?").all(code, limit);
}

// ── Aggregate queries ────────────────────────────────────

// In-memory cache for expensive full-table-scan queries (1h TTL)
const CACHE_TTL = 3600_000; // 1 hour
let _nationalStatsCache: { data: any; ts: number } | null = null;

export async function getNationalStats(): Promise<any> {
  if (_nationalStatsCache && Date.now() - _nationalStatsCache.ts < CACHE_TTL) {
    return _nationalStatsCache.data;
  }
  let result: any;
  if (USE_NEON) {
    const p = await queryOne("SELECT COUNT(*) as c, SUM(total_medicare_payment) as p, SUM(total_services) as s FROM providers");
    const c = await queryOne("SELECT COUNT(*) as c FROM provider_codes");
    if (!p) return null;
    result = { totalProviders: num(p.c), totalPayment: num(p.p), totalServices: num(p.s), totalCodes: num(c?.c) };
  } else {
    const db = getDb();
    if (!db) return null;
    const p = db.prepare("SELECT COUNT(*) as c, SUM(total_medicare_payment) as p, SUM(total_services) as s FROM providers").get() as any;
    const c = db.prepare("SELECT COUNT(*) as c FROM provider_codes").get() as any;
    result = { totalProviders: p.c, totalPayment: p.p, totalServices: p.s, totalCodes: c.c };
  }
  _nationalStatsCache = { data: result, ts: Date.now() };
  return result;
}

export function getTopProvidersByPayment(limit = 100): any {
  if (USE_NEON) return queryAll("SELECT * FROM providers ORDER BY total_medicare_payment DESC LIMIT ?", [limit]);
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM providers ORDER BY total_medicare_payment DESC LIMIT ?").all(limit);
}

// ── Distinct value queries ──────────────────────────────

export function getDistinctStates(): any {
  if (USE_NEON) return queryAll("SELECT DISTINCT state FROM providers WHERE state != '' ORDER BY state").then(r => r.map((x: any) => x.state));
  const db = getDb();
  if (!db) return [];
  return (db.prepare("SELECT DISTINCT state FROM providers WHERE state != '' ORDER BY state").all() as any[]).map(r => r.state);
}

export function getDistinctSpecialties(): any {
  if (USE_NEON) return queryAll("SELECT DISTINCT specialty FROM benchmarks ORDER BY provider_count DESC").then(r => r.map((x: any) => x.specialty));
  const db = getDb();
  if (!db) return [];
  return (db.prepare("SELECT DISTINCT specialty FROM benchmarks ORDER BY provider_count DESC").all() as any[]).map(r => r.specialty);
}

export function getDistinctCities(stateAbbr: string, minProviders = 5): any {
  if (USE_NEON) return queryAll("SELECT city FROM providers WHERE state = ? AND city != '' GROUP BY city HAVING COUNT(*) >= ? ORDER BY COUNT(*) DESC", [stateAbbr, minProviders]).then(r => r.map((x: any) => x.city));
  const db = getDb();
  if (!db) return [];
  return (db.prepare("SELECT city FROM providers WHERE state = ? AND city != '' GROUP BY city HAVING COUNT(*) >= ? ORDER BY COUNT(*) DESC").all(stateAbbr, minProviders) as any[]).map(r => r.city);
}

export function getProvidersByState(stateAbbr: string): any {
  if (USE_NEON) return queryAll("SELECT npi FROM providers WHERE state = ?", [stateAbbr]);
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT npi FROM providers WHERE state = ?").all(stateAbbr);
}

// ── Formatting helpers ───────────────────────────────────

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toLocaleString()}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

// ── Score & leaderboard queries ─────────────────────────

export function getProviderCodeCount(npi: string): any {
  if (USE_NEON) return queryOne("SELECT COUNT(*) as cnt FROM provider_codes WHERE npi = ?", [npi]).then(r => num(r?.cnt));
  const db = getDb();
  if (!db) return 0;
  return (db.prepare("SELECT COUNT(*) as cnt FROM provider_codes WHERE npi = ?").get(npi) as any)?.cnt ?? 0;
}

export function getTopScoringProviders(filters: { state?: string; specialty?: string }, limit = 20): any {
  const conds: string[] = [];
  const params: any[] = [];
  if (filters.state) { conds.push("state = ?"); params.push(filters.state); }
  if (filters.specialty) { conds.push("specialty = ?"); params.push(filters.specialty); }
  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  params.push(limit);
  const sql = `SELECT * FROM providers ${where} ORDER BY total_medicare_payment DESC LIMIT ?`;
  if (USE_NEON) return queryAll(sql, params);
  const db = getDb();
  if (!db) return [];
  return db.prepare(sql).all(...params);
}

export function getAverageScore(filters?: { state?: string; specialty?: string }): any {
  const conds: string[] = [];
  const params: any[] = [];
  if (filters?.state) { conds.push("state = ?"); params.push(filters.state); }
  if (filters?.specialty) { conds.push("specialty = ?"); params.push(filters.specialty); }
  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  const sql = `SELECT AVG(total_medicare_payment) as avg_score FROM providers ${where}`;
  if (USE_NEON) return queryOne(sql, params).then(r => Math.round(num(r?.avg_score)));
  const db = getDb();
  if (!db) return 0;
  return Math.round((db.prepare(sql).get(...params) as any)?.avg_score ?? 0);
}

export function getScoreDistribution(filters?: { state?: string; specialty?: string }): any {
  const conds: string[] = [];
  const params: any[] = [];
  if (filters?.state) { conds.push("state = ?"); params.push(filters.state); }
  if (filters?.specialty) { conds.push("specialty = ?"); params.push(filters.specialty); }
  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  const sql = `SELECT CAST((total_medicare_payment / (CASE WHEN (SELECT MAX(total_medicare_payment) FROM providers) > 0 THEN (SELECT MAX(total_medicare_payment) FROM providers) / 10.0 ELSE 1 END)) AS INTEGER) * 10 as bucket, COUNT(*) as count FROM providers ${where} GROUP BY bucket ORDER BY bucket`;
  if (USE_NEON) return queryAll(sql, params).then(r => r.map((x: any) => ({ bucket: Math.min(num(x.bucket), 90), count: num(x.count) })));
  const db = getDb();
  if (!db) return [];
  return (db.prepare(sql).all(...params) as any[]).map((r: any) => ({ bucket: Math.min(r.bucket, 90), count: r.count }));
}

export function getStateScoreRankings(): any {
  if (USE_NEON) return queryAll(`SELECT state, AVG(total_medicare_payment) as "avgScore", COUNT(*) as "providerCount" FROM providers WHERE state != '' GROUP BY state ORDER BY "avgScore" DESC`).then(r => r.map((x: any) => ({ state: x.state, avgScore: num(x.avgScore ?? x.avgscore), providerCount: num(x.providerCount ?? x.providercount) })));
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT state, AVG(total_medicare_payment) as avgScore, COUNT(*) as providerCount FROM providers WHERE state != '' GROUP BY state ORDER BY avgScore DESC").all();
}

export function getSpecialtyScoreRankings(): any {
  if (USE_NEON) return queryAll(`SELECT specialty, AVG(total_medicare_payment) as "avgScore", COUNT(*) as "providerCount" FROM providers WHERE specialty != '' GROUP BY specialty HAVING COUNT(*) >= 10 ORDER BY "avgScore" DESC`).then(r => r.map((x: any) => ({ specialty: x.specialty, avgScore: num(x.avgScore ?? x.avgscore), providerCount: num(x.providerCount ?? x.providercount) })));
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT specialty, AVG(total_medicare_payment) as avgScore, COUNT(*) as providerCount FROM providers WHERE specialty != '' GROUP BY specialty HAVING COUNT(*) >= 10 ORDER BY avgScore DESC").all();
}

// ── Acquisition queries ─────────────────────────────────

export function getAcquisitionTargets(filters: { state?: string; specialty?: string; minPatients?: number; maxRevenueScore?: number }, limit = 50): any {
  const conds: string[] = ["total_beneficiaries > 0"];
  const params: any[] = [];
  if (filters.state) { conds.push("state = ?"); params.push(filters.state); }
  if (filters.specialty) { conds.push("specialty = ?"); params.push(filters.specialty); }
  if (filters.minPatients) { conds.push("total_beneficiaries >= ?"); params.push(filters.minPatients); }
  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  params.push(limit);
  const sql = `SELECT * FROM providers ${where} ORDER BY total_beneficiaries DESC LIMIT ?`;
  if (USE_NEON) return queryAll(sql, params);
  const db = getDb();
  if (!db) return [];
  return db.prepare(sql).all(...params);
}

export function getStateMarketStats(stateAbbr: string): any {
  if (USE_NEON) return queryOne(`SELECT COUNT(*) as "totalProviders", SUM(total_medicare_payment) as "totalRevenue", AVG(total_medicare_payment) as "avgRevenue", SUM(total_beneficiaries) as "totalPatients", AVG(total_beneficiaries) as "avgPatients" FROM providers WHERE state = ? AND total_beneficiaries > 0`, [stateAbbr]).then(r => r ? { totalProviders: num(r.totalProviders ?? r.totalproviders), totalRevenue: num(r.totalRevenue ?? r.totalrevenue), avgRevenue: num(r.avgRevenue ?? r.avgrevenue), totalPatients: num(r.totalPatients ?? r.totalpatients), avgPatients: num(r.avgPatients ?? r.avgpatients) } : null);
  const db = getDb();
  if (!db) return null;
  return db.prepare("SELECT COUNT(*) as totalProviders, SUM(total_medicare_payment) as totalRevenue, AVG(total_medicare_payment) as avgRevenue, SUM(total_beneficiaries) as totalPatients, AVG(total_beneficiaries) as avgPatients FROM providers WHERE state = ? AND total_beneficiaries > 0").get(stateAbbr) ?? null;
}

export function getStateSpecialtyBreakdown(stateAbbr: string): any {
  if (USE_NEON) return queryAll(`SELECT specialty, COUNT(*) as count, AVG(total_medicare_payment) as "avgRevenue", AVG(total_beneficiaries) as "avgPatients", SUM(total_medicare_payment) as "totalRevenue" FROM providers WHERE state = ? AND specialty != '' AND total_beneficiaries > 0 GROUP BY specialty HAVING COUNT(*) >= 3 ORDER BY count DESC LIMIT 20`, [stateAbbr]).then(r => r.map((x: any) => ({ specialty: x.specialty, count: num(x.count), avgRevenue: num(x.avgRevenue ?? x.avgrevenue), avgPatients: num(x.avgPatients ?? x.avgpatients), totalRevenue: num(x.totalRevenue ?? x.totalrevenue) })));
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT specialty, COUNT(*) as count, AVG(total_medicare_payment) as avgRevenue, AVG(total_beneficiaries) as avgPatients, SUM(total_medicare_payment) as totalRevenue FROM providers WHERE state = ? AND specialty != '' AND total_beneficiaries > 0 GROUP BY specialty HAVING COUNT(*) >= 3 ORDER BY count DESC LIMIT 20").all(stateAbbr);
}

export function getMultipleProviders(npis: string[]): any {
  if (!npis.length) return USE_NEON ? Promise.resolve([]) : [];
  const placeholders = npis.map(() => "?").join(",");
  const sql = `SELECT * FROM providers WHERE npi IN (${placeholders})`;
  if (USE_NEON) return queryAll(sql, npis);
  const db = getDb();
  if (!db) return [];
  return db.prepare(sql).all(...npis);
}

// ── Comparison & Differentiation Queries ────────────────────

/** All states with avg payment + provider count — for national rankings */
let _stateAvgCache: { data: any; ts: number } | null = null;

export async function getAllStateAvgPayments(): Promise<{ state: string; avgPayment: number; providerCount: number }[]> {
  if (_stateAvgCache && Date.now() - _stateAvgCache.ts < CACHE_TTL) {
    return _stateAvgCache.data;
  }
  let result: any[];
  if (USE_NEON) {
    result = await queryAll(`SELECT state, AVG(total_medicare_payment) as "avgPayment", COUNT(*) as "providerCount" FROM providers WHERE state != '' GROUP BY state ORDER BY "avgPayment" DESC`).then(r => r.map((x: any) => ({ state: x.state, avgPayment: num(x.avgPayment ?? x.avgpayment), providerCount: num(x.providerCount ?? x.providercount) })));
  } else {
    const db = getDb();
    if (!db) return [];
    result = db.prepare("SELECT state, AVG(total_medicare_payment) as avgPayment, COUNT(*) as providerCount FROM providers WHERE state != '' GROUP BY state ORDER BY avgPayment DESC").all() as any[];
  }
  _stateAvgCache = { data: result, ts: Date.now() };
  return result;
}

/** Same specialty across all states — for cross-state specialty ranking */
const _specByAllStatesCache: Map<string, { data: any; ts: number }> = new Map();

export async function getSpecialtyByAllStates(specialty: string): Promise<{ state: string; count: number; avgPayment: number }[]> {
  const cached = _specByAllStatesCache.get(specialty);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }
  let result: any[];
  if (USE_NEON) {
    result = await queryAll(`SELECT state, COUNT(*) as count, AVG(total_medicare_payment) as "avgPayment" FROM providers WHERE specialty = ? AND state != '' GROUP BY state HAVING COUNT(*) >= 3 ORDER BY "avgPayment" DESC`, [specialty]).then(r => r.map((x: any) => ({ state: x.state, count: num(x.count), avgPayment: num(x.avgPayment ?? x.avgpayment) })));
  } else {
    const db = getDb();
    if (!db) return [];
    result = db.prepare("SELECT state, COUNT(*) as count, AVG(total_medicare_payment) as avgPayment FROM providers WHERE specialty = ? AND state != '' GROUP BY state HAVING COUNT(*) >= 3 ORDER BY avgPayment DESC").all(specialty) as any[];
  }
  _specByAllStatesCache.set(specialty, { data: result, ts: Date.now() });
  return result;
}

/** Count of program billers vs total providers in a state */
export function getStateProgramCounts(stateAbbr: string): Promise<{ totalProviders: number; ccmBillers: number; rpmBillers: number; bhiBillers: number; awvBillers: number }> {
  if (USE_NEON) return (async () => {
    const r = await queryOne(`SELECT COUNT(*) as total, SUM(CASE WHEN ccm_99490_services > 0 THEN 1 ELSE 0 END) as ccm, SUM(CASE WHEN rpm_99454_services > 0 THEN 1 ELSE 0 END) as rpm, SUM(CASE WHEN bhi_99484_services > 0 THEN 1 ELSE 0 END) as bhi, SUM(CASE WHEN awv_g0438_services > 0 OR awv_g0439_services > 0 THEN 1 ELSE 0 END) as awv FROM providers WHERE state = ?`, [stateAbbr]);
    return { totalProviders: num(r?.total), ccmBillers: num(r?.ccm), rpmBillers: num(r?.rpm), bhiBillers: num(r?.bhi), awvBillers: num(r?.awv) };
  })();
  const db = getDb();
  if (!db) return Promise.resolve({ totalProviders: 0, ccmBillers: 0, rpmBillers: 0, bhiBillers: 0, awvBillers: 0 });
  const r = db.prepare("SELECT COUNT(*) as total, SUM(CASE WHEN ccm_99490_services > 0 THEN 1 ELSE 0 END) as ccm, SUM(CASE WHEN rpm_99454_services > 0 THEN 1 ELSE 0 END) as rpm, SUM(CASE WHEN bhi_99484_services > 0 THEN 1 ELSE 0 END) as bhi, SUM(CASE WHEN awv_g0438_services > 0 OR awv_g0439_services > 0 THEN 1 ELSE 0 END) as awv FROM providers WHERE state = ?").get(stateAbbr) as any;
  return Promise.resolve({ totalProviders: num(r?.total), ccmBillers: num(r?.ccm), rpmBillers: num(r?.rpm), bhiBillers: num(r?.bhi), awvBillers: num(r?.awv) });
}

/** Count of program billers for a specialty within a state */
export function getStateSpecialtyProgramCounts(specialty: string, stateAbbr: string): Promise<{ totalProviders: number; ccmBillers: number; rpmBillers: number; bhiBillers: number; awvBillers: number }> {
  if (USE_NEON) return (async () => {
    const r = await queryOne(`SELECT COUNT(*) as total, SUM(CASE WHEN ccm_99490_services > 0 THEN 1 ELSE 0 END) as ccm, SUM(CASE WHEN rpm_99454_services > 0 THEN 1 ELSE 0 END) as rpm, SUM(CASE WHEN bhi_99484_services > 0 THEN 1 ELSE 0 END) as bhi, SUM(CASE WHEN awv_g0438_services > 0 OR awv_g0439_services > 0 THEN 1 ELSE 0 END) as awv FROM providers WHERE specialty = ? AND state = ?`, [specialty, stateAbbr]);
    return { totalProviders: num(r?.total), ccmBillers: num(r?.ccm), rpmBillers: num(r?.rpm), bhiBillers: num(r?.bhi), awvBillers: num(r?.awv) };
  })();
  const db = getDb();
  if (!db) return Promise.resolve({ totalProviders: 0, ccmBillers: 0, rpmBillers: 0, bhiBillers: 0, awvBillers: 0 });
  const r = db.prepare("SELECT COUNT(*) as total, SUM(CASE WHEN ccm_99490_services > 0 THEN 1 ELSE 0 END) as ccm, SUM(CASE WHEN rpm_99454_services > 0 THEN 1 ELSE 0 END) as rpm, SUM(CASE WHEN bhi_99484_services > 0 THEN 1 ELSE 0 END) as bhi, SUM(CASE WHEN awv_g0438_services > 0 OR awv_g0439_services > 0 THEN 1 ELSE 0 END) as awv FROM providers WHERE specialty = ? AND state = ?").get(specialty, stateAbbr) as any;
  return Promise.resolve({ totalProviders: num(r?.total), ccmBillers: num(r?.ccm), rpmBillers: num(r?.rpm), bhiBillers: num(r?.bhi), awvBillers: num(r?.awv) });
}

/** Top specialties with biggest program adoption gaps in a state */
export function getStateSpecialtyProgramGaps(stateAbbr: string, limit = 5): Promise<{ specialty: string; providerCount: number; ccmRate: number; rpmRate: number; bhiRate: number; awvRate: number }[]> {
  const sql = `SELECT specialty, COUNT(*) as providerCount,
    AVG(CASE WHEN ccm_99490_services > 0 THEN 1.0 ELSE 0.0 END) as ccmRate,
    AVG(CASE WHEN rpm_99454_services > 0 THEN 1.0 ELSE 0.0 END) as rpmRate,
    AVG(CASE WHEN bhi_99484_services > 0 THEN 1.0 ELSE 0.0 END) as bhiRate,
    AVG(CASE WHEN awv_g0438_services > 0 OR awv_g0439_services > 0 THEN 1.0 ELSE 0.0 END) as awvRate
    FROM providers WHERE state = ? AND specialty != ''
    GROUP BY specialty HAVING COUNT(*) >= 10
    ORDER BY providerCount DESC LIMIT ?`;
  if (USE_NEON) return queryAll(sql, [stateAbbr, limit]).then(r => r.map((x: any) => ({
    specialty: x.specialty,
    providerCount: num(x.providercount ?? x.providerCount),
    ccmRate: Number(x.ccmrate ?? x.ccmRate ?? 0),
    rpmRate: Number(x.rpmrate ?? x.rpmRate ?? 0),
    bhiRate: Number(x.bhirate ?? x.bhiRate ?? 0),
    awvRate: Number(x.awvrate ?? x.awvRate ?? 0),
  })));
  const db = getDb();
  if (!db) return Promise.resolve([]);
  return Promise.resolve((db.prepare(sql).all(stateAbbr, limit) as any[]).map((x: any) => ({
    specialty: x.specialty,
    providerCount: num(x.providerCount),
    ccmRate: Number(x.ccmRate ?? 0),
    rpmRate: Number(x.rpmRate ?? 0),
    bhiRate: Number(x.bhiRate ?? 0),
    awvRate: Number(x.awvRate ?? 0),
  })));
}

/** Find related CPT/HCPCS codes (same family/prefix) */
export function getRelatedCodes(code: string, limit = 5): Promise<{ hcpcs_code: string; totalProviders: number; avgPayment: number }[]> {
  // Determine family: E&M codes (9921x), CCM (9949x), RPM (9945x), AWV (G043x)
  let prefix: string;
  if (code.startsWith("G")) {
    prefix = code.substring(0, 4); // G043x
  } else {
    prefix = code.substring(0, 4); // 9921x, 9949x, etc.
  }
  const pattern = `${prefix}%`;
  if (USE_NEON) return queryAll(`SELECT hcpcs_code, COUNT(DISTINCT npi) as "totalProviders", AVG(payment / NULLIF(services, 0)) as "avgPayment" FROM provider_codes WHERE hcpcs_code LIKE ? AND hcpcs_code != ? GROUP BY hcpcs_code ORDER BY "totalProviders" DESC LIMIT ?`, [pattern, code, limit]).then(r => r.map((x: any) => ({ hcpcs_code: x.hcpcs_code, totalProviders: num(x.totalProviders ?? x.totalproviders), avgPayment: num(x.avgPayment ?? x.avgpayment) })));
  const db = getDb();
  if (!db) return Promise.resolve([]);
  return Promise.resolve(db.prepare("SELECT hcpcs_code, COUNT(DISTINCT npi) as totalProviders, AVG(payment / NULLIF(services, 0)) as avgPayment FROM provider_codes WHERE hcpcs_code LIKE ? AND hcpcs_code != ? GROUP BY hcpcs_code ORDER BY totalProviders DESC LIMIT ?").all(pattern, code, limit) as any[]);
}

// ── Tiered Provider Sitemap + Program Adoption Queries ──────

/** High-priority providers for tiered sitemap drip-feed */
export function getHighPriorityProviders(
  stateAbbr: string,
  tier: 1 | 2 | 3 = 1,
  limit = 50000
): Promise<{ npi: string }[]> {
  let conditions: string;
  switch (tier) {
    case 1:
      conditions = "AND total_medicare_payment >= 25000 AND total_beneficiaries >= 20";
      break;
    case 2:
      conditions = "AND total_medicare_payment >= 10000 AND total_medicare_payment < 25000";
      break;
    case 3:
      conditions = "AND total_medicare_payment < 10000";
      break;
  }
  const sql = `SELECT npi FROM providers WHERE state = ? ${conditions} ORDER BY total_medicare_payment DESC LIMIT ?`;
  if (USE_NEON) return queryAll(sql, [stateAbbr, limit]);
  const db = getDb();
  if (!db) return Promise.resolve([]);
  return Promise.resolve(db.prepare(sql).all(stateAbbr, limit) as { npi: string }[]);
}

/** Top states by program adoption rate (for /programs hub pages) */
export function getProgramTopStates(
  program: "ccm" | "rpm" | "bhi" | "awv",
  limit = 10
): Promise<{ state: string; adoptionRate: number; providerCount: number; billerCount: number }[]> {
  const column: Record<string, string> = {
    ccm: "ccm_99490_services",
    rpm: "rpm_99454_services",
    bhi: "bhi_99484_services",
    awv: "(awv_g0438_services + awv_g0439_services)",
  };
  const col = column[program];
  const sql = `SELECT state,
    COUNT(*) as providerCount,
    SUM(CASE WHEN ${col} > 0 THEN 1 ELSE 0 END) as billerCount,
    AVG(CASE WHEN ${col} > 0 THEN 1.0 ELSE 0.0 END) as adoptionRate
    FROM providers WHERE state != ''
    GROUP BY state HAVING COUNT(*) >= 50
    ORDER BY adoptionRate DESC LIMIT ?`;
  if (USE_NEON) return queryAll(sql, [limit]).then(r => r.map((x: any) => ({
    state: x.state,
    adoptionRate: Number(x.adoptionrate ?? x.adoptionRate ?? 0),
    providerCount: num(x.providercount ?? x.providerCount),
    billerCount: num(x.billercount ?? x.billerCount),
  })));
  const db = getDb();
  if (!db) return Promise.resolve([]);
  return Promise.resolve((db.prepare(sql).all(limit) as any[]).map((x: any) => ({
    state: x.state,
    adoptionRate: Number(x.adoptionRate ?? 0),
    providerCount: num(x.providerCount),
    billerCount: num(x.billerCount),
  })));
}

/** Top specialties by program adoption rate (for /programs hub pages) */
export function getProgramTopSpecialties(
  program: "ccm" | "rpm" | "bhi" | "awv",
  limit = 10
): Promise<{ specialty: string; adoptionRate: number; providerCount: number; billerCount: number }[]> {
  const column: Record<string, string> = {
    ccm: "ccm_99490_services",
    rpm: "rpm_99454_services",
    bhi: "bhi_99484_services",
    awv: "(awv_g0438_services + awv_g0439_services)",
  };
  const col = column[program];
  const sql = `SELECT specialty,
    COUNT(*) as providerCount,
    SUM(CASE WHEN ${col} > 0 THEN 1 ELSE 0 END) as billerCount,
    AVG(CASE WHEN ${col} > 0 THEN 1.0 ELSE 0.0 END) as adoptionRate
    FROM providers WHERE specialty != ''
    GROUP BY specialty HAVING COUNT(*) >= 50
    ORDER BY adoptionRate DESC LIMIT ?`;
  if (USE_NEON) return queryAll(sql, [limit]).then(r => r.map((x: any) => ({
    specialty: x.specialty,
    adoptionRate: Number(x.adoptionrate ?? x.adoptionRate ?? 0),
    providerCount: num(x.providercount ?? x.providerCount),
    billerCount: num(x.billercount ?? x.billerCount),
  })));
  const db = getDb();
  if (!db) return Promise.resolve([]);
  return Promise.resolve((db.prepare(sql).all(limit) as any[]).map((x: any) => ({
    specialty: x.specialty,
    adoptionRate: Number(x.adoptionRate ?? 0),
    providerCount: num(x.providerCount),
    billerCount: num(x.billerCount),
  })));
}

// ── Profile Claims ──────────────────────────────────────────

async function ensureClaimsTable(): Promise<void> {
  const createSql = `CREATE TABLE IF NOT EXISTS profile_claims (
    npi TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    claimed_at TIMESTAMP DEFAULT NOW(),
    verified BOOLEAN DEFAULT FALSE
  )`;
  if (USE_NEON) {
    const neonSql = await getNeonClient();
    await neonSql(createSql);
    return;
  }
  const db = getDb();
  if (db) db.prepare(createSql.replace("NOW()", "CURRENT_TIMESTAMP")).run();
}

export async function isProfileClaimed(npi: string): Promise<boolean> {
  await ensureClaimsTable();
  const row = await queryOne("SELECT npi FROM profile_claims WHERE npi = ?", [npi]);
  return !!row;
}

export async function claimProfile(npi: string, email: string): Promise<{ success: boolean; code?: string }> {
  await ensureClaimsTable();
  const existing = await queryOne("SELECT npi FROM profile_claims WHERE npi = ?", [npi]);
  if (existing) return { success: false, code: "ALREADY_CLAIMED" };
  if (USE_NEON) {
    const neonSql = await getNeonClient();
    await neonSql("INSERT INTO profile_claims (npi, email, claimed_at) VALUES ($1, $2, NOW()) ON CONFLICT (npi) DO NOTHING", [npi, email]);
  } else {
    const db = getDb();
    if (db) db.prepare("INSERT OR IGNORE INTO profile_claims (npi, email, claimed_at) VALUES (?, ?, CURRENT_TIMESTAMP)").run(npi, email);
  }
  return { success: true };
}
