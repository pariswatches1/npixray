#!/usr/bin/env npx tsx
/**
 * NPIxray — SQLite to Neon Postgres Migration
 *
 * Reads data from the local SQLite database (data/cms.db) and migrates
 * all tables to a Neon Postgres database.
 *
 * Tables migrated:
 *   providers      — ~1,175,281 rows
 *   provider_codes — ~8,150,000 rows
 *   benchmarks     — ~20 rows
 *
 * Usage:
 *   npx tsx data/scripts/migrate-to-neon.ts
 *   — or —
 *   npm run cms:migrate
 *
 * Requires:
 *   - data/cms.db to exist (run cms:build-db first)
 *   - DATABASE_URL_UNPOOLED in .env.local (Neon unpooled connection string)
 */

import Database from "better-sqlite3";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { neon } from "@neondatabase/serverless";

// ── Load .env.local ──────────────────────────────────────────

const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) process.env[match[1]] = match[2];
  }
}

if (!process.env.DATABASE_URL_UNPOOLED) {
  console.error("  ERROR: DATABASE_URL_UNPOOLED not found in .env.local");
  process.exit(1);
}

// ── Paths ────────────────────────────────────────────────────

const DB_PATH = join(process.cwd(), "data", "cms.db");

// ── Neon SQL client ──────────────────────────────────────────

const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

// ── Constants ────────────────────────────────────────────────

const PROVIDER_BATCH_SIZE = 1000;
const CODE_BATCH_SIZE = 2000;
const PROGRESS_INTERVAL = 50_000;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

// ── Retry helper ────────────────────────────────────────────

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      if (attempt === MAX_RETRIES) throw err;
      const delay = RETRY_DELAY_MS * attempt;
      console.log(
        `\n  ⚠ ${label} failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`
      );
      console.log(`    Retrying in ${delay / 1000}s...`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("unreachable");
}

// ── Provider column count (26 columns) ───────────────────────

const PROVIDER_COLS = 26;
const CODE_COLS = 5;
const BENCHMARK_COLS = 13;

// ── Resume flag ─────────────────────────────────────────────

const RESUME_MODE = process.argv.includes("--resume");

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  NPIxray — SQLite to Neon Postgres Migration");
  if (RESUME_MODE) console.log("  (RESUME MODE — skipping drops/creates/providers)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Verify SQLite DB exists
  if (!existsSync(DB_PATH)) {
    console.error(`  ERROR: SQLite database not found: ${DB_PATH}`);
    console.error("  Run 'npm run cms:build-db' first.\n");
    process.exit(1);
  }

  // Open SQLite
  const db = new Database(DB_PATH, { readonly: true });

  // Quick counts from SQLite
  const providerCount = (db.prepare("SELECT COUNT(*) as c FROM providers").get() as any).c;
  const codeCount = (db.prepare("SELECT COUNT(*) as c FROM provider_codes").get() as any).c;
  const benchmarkCount = (db.prepare("SELECT COUNT(*) as c FROM benchmarks").get() as any).c;

  console.log(`  SQLite source: ${DB_PATH}`);
  console.log(`  Providers:      ${providerCount.toLocaleString()}`);
  console.log(`  Provider codes: ${codeCount.toLocaleString()}`);
  console.log(`  Benchmarks:     ${benchmarkCount}\n`);

  const startTime = Date.now();
  let offset = 0;
  let providersInserted = 0;

  if (RESUME_MODE) {
    console.log("  Skipping Steps 1-4 (resume mode)...\n");
  }

  // ─── Step 1: Drop existing tables ───

  if (!RESUME_MODE) {
  console.log("  Step 1: Dropping existing tables...\n");

  await sql.query("DROP TABLE IF EXISTS provider_codes");
  await sql.query("DROP TABLE IF EXISTS providers");
  await sql.query("DROP TABLE IF EXISTS benchmarks");

  console.log("  Done.\n");

  // ─── Step 2: Create tables ───

  console.log("  Step 2: Creating tables...\n");

  await sql.query(`
    CREATE TABLE providers (
      npi TEXT PRIMARY KEY,
      last_name TEXT NOT NULL,
      first_name TEXT NOT NULL,
      credential TEXT,
      specialty TEXT NOT NULL,
      state TEXT,
      city TEXT,
      total_beneficiaries INTEGER NOT NULL DEFAULT 0,
      total_services INTEGER NOT NULL DEFAULT 0,
      total_medicare_payment INTEGER NOT NULL DEFAULT 0,
      em_99211 INTEGER NOT NULL DEFAULT 0,
      em_99212 INTEGER NOT NULL DEFAULT 0,
      em_99213 INTEGER NOT NULL DEFAULT 0,
      em_99214 INTEGER NOT NULL DEFAULT 0,
      em_99215 INTEGER NOT NULL DEFAULT 0,
      em_total INTEGER NOT NULL DEFAULT 0,
      ccm_99490_services INTEGER NOT NULL DEFAULT 0,
      ccm_99490_payment INTEGER NOT NULL DEFAULT 0,
      rpm_99454_services INTEGER NOT NULL DEFAULT 0,
      rpm_99457_services INTEGER NOT NULL DEFAULT 0,
      rpm_payment INTEGER NOT NULL DEFAULT 0,
      bhi_99484_services INTEGER NOT NULL DEFAULT 0,
      bhi_99484_payment INTEGER NOT NULL DEFAULT 0,
      awv_g0438_services INTEGER NOT NULL DEFAULT 0,
      awv_g0439_services INTEGER NOT NULL DEFAULT 0,
      awv_payment INTEGER NOT NULL DEFAULT 0
    )
  `);

  await sql.query(`
    CREATE TABLE provider_codes (
      npi TEXT NOT NULL,
      hcpcs_code TEXT NOT NULL,
      services INTEGER NOT NULL DEFAULT 0,
      payment INTEGER NOT NULL DEFAULT 0,
      beneficiaries INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (npi, hcpcs_code),
      FOREIGN KEY (npi) REFERENCES providers(npi)
    )
  `);

  await sql.query(`
    CREATE TABLE benchmarks (
      specialty TEXT PRIMARY KEY,
      provider_count INTEGER NOT NULL DEFAULT 0,
      avg_medicare_patients INTEGER NOT NULL DEFAULT 0,
      avg_revenue_per_patient INTEGER NOT NULL DEFAULT 0,
      avg_total_payment INTEGER NOT NULL DEFAULT 0,
      avg_total_services INTEGER NOT NULL DEFAULT 0,
      pct_99213 DOUBLE PRECISION NOT NULL DEFAULT 0,
      pct_99214 DOUBLE PRECISION NOT NULL DEFAULT 0,
      pct_99215 DOUBLE PRECISION NOT NULL DEFAULT 0,
      ccm_adoption_rate DOUBLE PRECISION NOT NULL DEFAULT 0,
      rpm_adoption_rate DOUBLE PRECISION NOT NULL DEFAULT 0,
      bhi_adoption_rate DOUBLE PRECISION NOT NULL DEFAULT 0,
      awv_adoption_rate DOUBLE PRECISION NOT NULL DEFAULT 0
    )
  `);

  console.log("  Tables created.\n");

  // ─── Step 3: Insert benchmarks ───

  console.log("  Step 3: Inserting benchmarks...\n");

  const benchmarks = db.prepare("SELECT * FROM benchmarks").all() as any[];

  if (benchmarks.length > 0) {
    const placeholders = benchmarks
      .map(
        (_, i) =>
          `($${i * BENCHMARK_COLS + 1}, $${i * BENCHMARK_COLS + 2}, $${i * BENCHMARK_COLS + 3}, $${i * BENCHMARK_COLS + 4}, $${i * BENCHMARK_COLS + 5}, $${i * BENCHMARK_COLS + 6}, $${i * BENCHMARK_COLS + 7}, $${i * BENCHMARK_COLS + 8}, $${i * BENCHMARK_COLS + 9}, $${i * BENCHMARK_COLS + 10}, $${i * BENCHMARK_COLS + 11}, $${i * BENCHMARK_COLS + 12}, $${i * BENCHMARK_COLS + 13})`
      )
      .join(",");

    const values = benchmarks.flatMap((b) => [
      b.specialty,
      b.provider_count,
      b.avg_medicare_patients,
      b.avg_revenue_per_patient,
      b.avg_total_payment,
      b.avg_total_services,
      b.pct_99213,
      b.pct_99214,
      b.pct_99215,
      b.ccm_adoption_rate,
      b.rpm_adoption_rate,
      b.bhi_adoption_rate,
      b.awv_adoption_rate,
    ]);

    await sql.query(
      `INSERT INTO benchmarks (
        specialty, provider_count, avg_medicare_patients, avg_revenue_per_patient,
        avg_total_payment, avg_total_services,
        pct_99213, pct_99214, pct_99215,
        ccm_adoption_rate, rpm_adoption_rate, bhi_adoption_rate, awv_adoption_rate
      ) VALUES ${placeholders}`,
      values
    );
  }

  console.log(`  Inserted ${benchmarks.length} benchmarks.\n`);

  // ─── Step 4: Insert providers in batches ───

  console.log("  Step 4: Inserting providers...\n");

  const providerStmt = db.prepare(
    "SELECT * FROM providers ORDER BY npi LIMIT ? OFFSET ?"
  );

  offset = 0;
  while (true) {
    const rows = providerStmt.all(PROVIDER_BATCH_SIZE, offset) as any[];
    if (rows.length === 0) break;

    const placeholders = rows
      .map((_, i) => {
        const base = i * PROVIDER_COLS;
        const params = Array.from(
          { length: PROVIDER_COLS },
          (__, j) => `$${base + j + 1}`
        ).join(", ");
        return `(${params})`;
      })
      .join(",");

    const values = rows.flatMap((r) => [
      r.npi,
      r.last_name,
      r.first_name,
      r.credential,
      r.specialty,
      r.state,
      r.city,
      r.total_beneficiaries,
      r.total_services,
      r.total_medicare_payment,
      r.em_99211,
      r.em_99212,
      r.em_99213,
      r.em_99214,
      r.em_99215,
      r.em_total,
      r.ccm_99490_services,
      r.ccm_99490_payment,
      r.rpm_99454_services,
      r.rpm_99457_services,
      r.rpm_payment,
      r.bhi_99484_services,
      r.bhi_99484_payment,
      r.awv_g0438_services,
      r.awv_g0439_services,
      r.awv_payment,
    ]);

    await withRetry(
      () =>
        sql.query(
          `INSERT INTO providers (
            npi, last_name, first_name, credential, specialty, state, city,
            total_beneficiaries, total_services, total_medicare_payment,
            em_99211, em_99212, em_99213, em_99214, em_99215, em_total,
            ccm_99490_services, ccm_99490_payment,
            rpm_99454_services, rpm_99457_services, rpm_payment,
            bhi_99484_services, bhi_99484_payment,
            awv_g0438_services, awv_g0439_services, awv_payment
          ) VALUES ${placeholders}`,
          values
        ),
      `Provider batch at offset ${offset}`
    );

    providersInserted += rows.length;
    offset += rows.length;

    if (providersInserted % PROGRESS_INTERVAL === 0 || providersInserted === rows.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const pct = ((providersInserted / providerCount) * 100).toFixed(1);
      process.stdout.write(
        `\r  Providers: ${providersInserted.toLocaleString()} / ${providerCount.toLocaleString()} (${pct}%) [${elapsed}s]    `
      );
    }
  }

  console.log(
    `\n  Inserted ${providersInserted.toLocaleString()} providers.\n`
  );

  } // end if (!RESUME_MODE)

  // ─── Step 5: Insert provider_codes in batches ───

  console.log("  Step 5: Inserting provider_codes...\n");

  // Check how many codes already exist (resume support)
  const [existingCodes] = await sql.query(
    "SELECT COUNT(*) as count FROM provider_codes"
  );
  const existingCodeCount = Number(existingCodes.count);

  let codesInserted = existingCodeCount;
  if (existingCodeCount > 0) {
    console.log(
      `  Resuming from ${existingCodeCount.toLocaleString()} existing codes...\n`
    );
  }

  const codeStmt = db.prepare(
    "SELECT * FROM provider_codes ORDER BY npi, hcpcs_code LIMIT ? OFFSET ?"
  );

  offset = existingCodeCount;
  while (true) {
    const rows = codeStmt.all(CODE_BATCH_SIZE, offset) as any[];
    if (rows.length === 0) break;

    const placeholders = rows
      .map((_, i) => {
        const base = i * CODE_COLS;
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`;
      })
      .join(",");

    const values = rows.flatMap((r) => [
      r.npi,
      r.hcpcs_code,
      r.services,
      r.payment,
      r.beneficiaries,
    ]);

    await withRetry(
      () =>
        sql.query(
          `INSERT INTO provider_codes (npi, hcpcs_code, services, payment, beneficiaries)
           VALUES ${placeholders}`,
          values
        ),
      `Batch at offset ${offset}`
    );

    codesInserted += rows.length;
    offset += rows.length;

    if (codesInserted % PROGRESS_INTERVAL === 0 || codesInserted === rows.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const pct = ((codesInserted / codeCount) * 100).toFixed(1);
      process.stdout.write(
        `\r  Codes: ${codesInserted.toLocaleString()} / ${codeCount.toLocaleString()} (${pct}%) [${elapsed}s]    `
      );
    }
  }

  console.log(
    `\n  Inserted ${codesInserted.toLocaleString()} provider codes.\n`
  );

  // ─── Step 6: Create indexes ───

  console.log("  Step 6: Creating indexes...\n");

  const indexes = [
    { name: "idx_providers_specialty", sql: "CREATE INDEX idx_providers_specialty ON providers(specialty)" },
    { name: "idx_providers_state", sql: "CREATE INDEX idx_providers_state ON providers(state)" },
    { name: "idx_providers_city", sql: "CREATE INDEX idx_providers_city ON providers(city)" },
    { name: "idx_providers_name", sql: "CREATE INDEX idx_providers_name ON providers(last_name, first_name)" },
    { name: "idx_providers_state_city", sql: "CREATE INDEX idx_providers_state_city ON providers(state, city)" },
    { name: "idx_codes_npi", sql: "CREATE INDEX idx_codes_npi ON provider_codes(npi)" },
    { name: "idx_codes_hcpcs", sql: "CREATE INDEX idx_codes_hcpcs ON provider_codes(hcpcs_code)" },
  ];

  for (const idx of indexes) {
    const idxStart = Date.now();
    await withRetry(() => sql.query(idx.sql), idx.name);
    const idxElapsed = ((Date.now() - idxStart) / 1000).toFixed(1);
    console.log(`  Created ${idx.name} (${idxElapsed}s)`);
  }

  console.log("");

  // ─── Step 7: Verify ───

  console.log("  Step 7: Verifying row counts...\n");

  const [pgProviders] = await sql.query("SELECT COUNT(*) as count FROM providers");
  const [pgCodes] = await sql.query("SELECT COUNT(*) as count FROM provider_codes");
  const [pgBenchmarks] = await sql.query("SELECT COUNT(*) as count FROM benchmarks");

  console.log(`  Neon Postgres counts:`);
  console.log(`    providers:      ${Number(pgProviders.count).toLocaleString()}`);
  console.log(`    provider_codes: ${Number(pgCodes.count).toLocaleString()}`);
  console.log(`    benchmarks:     ${Number(pgBenchmarks.count).toLocaleString()}\n`);

  console.log(`  SQLite counts:`);
  console.log(`    providers:      ${providerCount.toLocaleString()}`);
  console.log(`    provider_codes: ${codeCount.toLocaleString()}`);
  console.log(`    benchmarks:     ${benchmarkCount}\n`);

  // Check if counts match
  const allMatch =
    Number(pgProviders.count) === providerCount &&
    Number(pgCodes.count) === codeCount &&
    Number(pgBenchmarks.count) === benchmarkCount;

  if (allMatch) {
    console.log("  All row counts match!\n");
  } else {
    console.log("  WARNING: Row counts do not match! Check for errors above.\n");
  }

  // ─── Summary ───

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Migration Complete");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`  Total time: ${elapsed}s`);
  console.log(`  Providers migrated:      ${providersInserted.toLocaleString()}`);
  console.log(`  Provider codes migrated: ${codesInserted.toLocaleString()}`);
  console.log(`  Benchmarks migrated:     ${benchmarkCount}`);
  console.log("");

  db.close();
}

main().catch((err) => {
  console.error("\n  Migration failed:", err.message);
  console.error(err.stack);
  process.exit(1);
});
