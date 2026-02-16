/**
 * Centralized database query layer for all SEO pages.
 * Provides fast, cached queries against the CMS SQLite database.
 */

import { existsSync } from "fs";
import { join } from "path";

const DB_PATH = join(process.cwd(), "data", "cms.db");

// eslint-disable-next-line
let _db: any = null;

function getDb(): any {
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
export function getProvider(npi: string): ProviderRow | null {
  const db = getDb();
  if (!db) return null;
  return db.prepare("SELECT * FROM providers WHERE npi = ?").get(npi) as ProviderRow | undefined ?? null;
}

export function getProviderCodes(npi: string, limit = 10): CodeRow[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM provider_codes WHERE npi = ? ORDER BY payment DESC LIMIT ?").all(npi, limit) as CodeRow[];
}

export function getRelatedProviders(specialty: string, city: string, state: string, excludeNpi: string, limit = 5): ProviderRow[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(
    "SELECT * FROM providers WHERE specialty = ? AND city = ? AND state = ? AND npi != ? ORDER BY total_medicare_payment DESC LIMIT ?"
  ).all(specialty, city, state, excludeNpi, limit) as ProviderRow[];
}

// ── State queries ────────────────────────────────────────

export interface StateStats {
  state: string;
  totalProviders: number;
  totalPayment: number;
  totalServices: number;
  avgPayment: number;
}

export function getAllStates(): StateStats[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(`
    SELECT state, COUNT(*) as totalProviders, SUM(total_medicare_payment) as totalPayment,
           SUM(total_services) as totalServices, AVG(total_medicare_payment) as avgPayment
    FROM providers WHERE state != '' GROUP BY state ORDER BY totalProviders DESC
  `).all() as StateStats[];
}

export function getStateStats(stateAbbr: string): StateStats | null {
  const db = getDb();
  if (!db) return null;
  return db.prepare(`
    SELECT state, COUNT(*) as totalProviders, SUM(total_medicare_payment) as totalPayment,
           SUM(total_services) as totalServices, AVG(total_medicare_payment) as avgPayment
    FROM providers WHERE state = ?
  `).get(stateAbbr) as StateStats | undefined ?? null;
}

export function getStateSpecialties(stateAbbr: string, limit = 20): { specialty: string; count: number; avgPayment: number }[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(`
    SELECT specialty, COUNT(*) as count, AVG(total_medicare_payment) as avgPayment
    FROM providers WHERE state = ? AND specialty != '' GROUP BY specialty ORDER BY count DESC LIMIT ?
  `).all(stateAbbr, limit) as any[];
}

export function getStateCities(stateAbbr: string, limit = 30): { city: string; count: number; avgPayment: number }[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(`
    SELECT city, COUNT(*) as count, AVG(total_medicare_payment) as avgPayment
    FROM providers WHERE state = ? AND city != '' GROUP BY city HAVING count >= 5 ORDER BY count DESC LIMIT ?
  `).all(stateAbbr, limit) as any[];
}

export function getStateTopProviders(stateAbbr: string, limit = 50): ProviderRow[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(
    "SELECT * FROM providers WHERE state = ? ORDER BY total_medicare_payment DESC LIMIT ?"
  ).all(stateAbbr, limit) as ProviderRow[];
}

// ── City queries ─────────────────────────────────────────

export function getCityStats(stateAbbr: string, city: string): { count: number; avgPayment: number; totalPayment: number } | null {
  const db = getDb();
  if (!db) return null;
  return db.prepare(`
    SELECT COUNT(*) as count, AVG(total_medicare_payment) as avgPayment, SUM(total_medicare_payment) as totalPayment
    FROM providers WHERE state = ? AND LOWER(city) = LOWER(?)
  `).get(stateAbbr, city) as any ?? null;
}

export function getCityProviders(stateAbbr: string, city: string, limit = 100): ProviderRow[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(
    "SELECT * FROM providers WHERE state = ? AND LOWER(city) = LOWER(?) ORDER BY total_medicare_payment DESC LIMIT ?"
  ).all(stateAbbr, city, limit) as ProviderRow[];
}

export function getCitySpecialties(stateAbbr: string, city: string): { specialty: string; count: number; avgPayment: number }[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(`
    SELECT specialty, COUNT(*) as count, AVG(total_medicare_payment) as avgPayment
    FROM providers WHERE state = ? AND LOWER(city) = LOWER(?) AND specialty != '' GROUP BY specialty ORDER BY count DESC
  `).all(stateAbbr, city) as any[];
}

export function getCityNameFromDb(stateAbbr: string, slug: string): string | null {
  const db = getDb();
  if (!db) return null;
  const row = db.prepare(
    "SELECT city FROM providers WHERE state = ? AND LOWER(REPLACE(REPLACE(city, ' ', '-'), '.', '')) = LOWER(?) LIMIT 1"
  ).get(stateAbbr, slug) as any;
  return row?.city ?? null;
}

// ── Specialty queries ────────────────────────────────────

export function getAllBenchmarks(): BenchmarkRow[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM benchmarks ORDER BY provider_count DESC").all() as BenchmarkRow[];
}

export function getBenchmarkBySpecialty(specialty: string): BenchmarkRow | null {
  const db = getDb();
  if (!db) return null;
  return db.prepare("SELECT * FROM benchmarks WHERE specialty = ?").get(specialty) as BenchmarkRow | undefined ?? null;
}

export function getSpecialtyProviders(specialty: string, limit = 50): ProviderRow[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(
    "SELECT * FROM providers WHERE specialty = ? ORDER BY total_medicare_payment DESC LIMIT ?"
  ).all(specialty, limit) as ProviderRow[];
}

export function getSpecialtyByState(specialty: string, stateAbbr: string): { count: number; avgPayment: number; totalPayment: number } | null {
  const db = getDb();
  if (!db) return null;
  return db.prepare(`
    SELECT COUNT(*) as count, AVG(total_medicare_payment) as avgPayment, SUM(total_medicare_payment) as totalPayment
    FROM providers WHERE specialty = ? AND state = ?
  `).get(specialty, stateAbbr) as any ?? null;
}

export function getSpecialtyStateProviders(specialty: string, stateAbbr: string, limit = 50): ProviderRow[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(
    "SELECT * FROM providers WHERE specialty = ? AND state = ? ORDER BY total_medicare_payment DESC LIMIT ?"
  ).all(specialty, stateAbbr, limit) as ProviderRow[];
}

export function getCitySpecialtyProviders(stateAbbr: string, city: string, specialty: string, limit = 50): ProviderRow[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(
    "SELECT * FROM providers WHERE state = ? AND LOWER(city) = LOWER(?) AND specialty = ? ORDER BY total_medicare_payment DESC LIMIT ?"
  ).all(stateAbbr, city, specialty, limit) as ProviderRow[];
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

export function getTopCodes(limit = 200): CodeStats[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(`
    SELECT hcpcs_code, COUNT(DISTINCT npi) as totalProviders, SUM(services) as totalServices,
           SUM(payment) as totalPayment, AVG(payment / NULLIF(services, 0)) as avgPayment,
           AVG(services) as avgServicesPerProvider
    FROM provider_codes GROUP BY hcpcs_code ORDER BY totalServices DESC LIMIT ?
  `).all(limit) as CodeStats[];
}

export function getCodeStats(code: string): CodeStats | null {
  const db = getDb();
  if (!db) return null;
  return db.prepare(`
    SELECT hcpcs_code, COUNT(DISTINCT npi) as totalProviders, SUM(services) as totalServices,
           SUM(payment) as totalPayment, AVG(payment / NULLIF(services, 0)) as avgPayment,
           AVG(services) as avgServicesPerProvider
    FROM provider_codes WHERE hcpcs_code = ?
  `).get(code) as CodeStats | undefined ?? null;
}

export function getCodeTopSpecialties(code: string, limit = 10): { specialty: string; providers: number; totalServices: number }[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare(`
    SELECT p.specialty, COUNT(DISTINCT pc.npi) as providers, SUM(pc.services) as totalServices
    FROM provider_codes pc JOIN providers p ON pc.npi = p.npi
    WHERE pc.hcpcs_code = ? AND p.specialty != '' GROUP BY p.specialty ORDER BY totalServices DESC LIMIT ?
  `).all(code, limit) as any[];
}

// ── Aggregate queries ────────────────────────────────────

export function getNationalStats(): { totalProviders: number; totalPayment: number; totalServices: number; totalCodes: number } | null {
  const db = getDb();
  if (!db) return null;
  const providers = db.prepare("SELECT COUNT(*) as c, SUM(total_medicare_payment) as p, SUM(total_services) as s FROM providers").get() as any;
  const codes = db.prepare("SELECT COUNT(*) as c FROM provider_codes").get() as any;
  return {
    totalProviders: providers.c,
    totalPayment: providers.p,
    totalServices: providers.s,
    totalCodes: codes.c,
  };
}

export function getTopProvidersByPayment(limit = 100): ProviderRow[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT * FROM providers ORDER BY total_medicare_payment DESC LIMIT ?").all(limit) as ProviderRow[];
}

// ── Distinct value queries for sitemap/static generation ─

export function getDistinctStates(): string[] {
  const db = getDb();
  if (!db) return [];
  return (db.prepare("SELECT DISTINCT state FROM providers WHERE state != '' ORDER BY state").all() as any[]).map(r => r.state);
}

export function getDistinctSpecialties(): string[] {
  const db = getDb();
  if (!db) return [];
  return (db.prepare("SELECT DISTINCT specialty FROM benchmarks ORDER BY provider_count DESC").all() as any[]).map(r => r.specialty);
}

export function getDistinctCities(stateAbbr: string, minProviders = 5): string[] {
  const db = getDb();
  if (!db) return [];
  return (db.prepare(
    "SELECT city FROM providers WHERE state = ? AND city != '' GROUP BY city HAVING COUNT(*) >= ? ORDER BY COUNT(*) DESC"
  ).all(stateAbbr, minProviders) as any[]).map(r => r.city);
}

export function getProvidersByState(stateAbbr: string): { npi: string }[] {
  const db = getDb();
  if (!db) return [];
  return db.prepare("SELECT npi FROM providers WHERE state = ?").all(stateAbbr) as any[];
}

// ── Formatting helpers ───────────────────────────────────

// Re-export client-safe formatting utilities so existing imports still work
export { formatCurrency, formatNumber } from "./format";
