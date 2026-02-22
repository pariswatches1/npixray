#!/usr/bin/env npx tsx
/**
 * NPIxray — SQLite Database Builder
 *
 * Reads the per-NPI JSON files produced by process-cms.ts and the
 * benchmarks.json, then packs everything into a single SQLite database:
 *
 *   data/cms.db  (~100-200 MB, single file, easy to deploy)
 *
 * Tables:
 *   providers     — one row per NPI with billing summary + E&M + program data
 *   provider_codes — top HCPCS codes per provider (normalized from topCodes[])
 *   benchmarks    — one row per specialty with aggregate benchmark data
 *
 * Usage:
 *   npx tsx data/scripts/build-db.ts
 *   — or —
 *   npm run cms:build-db
 */

import Database from "better-sqlite3";
import { existsSync, readdirSync, readFileSync, unlinkSync } from "fs";
import { join } from "path";

// ── Paths ────────────────────────────────────────────────────
const DATA_DIR = join(process.cwd(), "data", "cms-processed");
const DB_PATH = join(process.cwd(), "data", "cms.db");
const BENCHMARKS_PATH = join(DATA_DIR, "benchmarks.json");

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  NPIxray — SQLite Database Builder");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Verify input exists
  if (!existsSync(DATA_DIR)) {
    console.error("  ✗ Processed data directory not found:", DATA_DIR);
    console.error("  Run 'npm run cms:process' first.\n");
    process.exit(1);
  }
  if (!existsSync(BENCHMARKS_PATH)) {
    console.error("  ✗ benchmarks.json not found:", BENCHMARKS_PATH);
    console.error("  Run 'npm run cms:process' first.\n");
    process.exit(1);
  }

  // Remove old DB if it exists
  if (existsSync(DB_PATH)) {
    console.log("  Removing existing database...");
    unlinkSync(DB_PATH);
  }

  console.log(`  Output: ${DB_PATH}\n`);

  // ─── Create database and tables ───

  const db = new Database(DB_PATH);

  // Performance settings for bulk insert
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = OFF");
  db.pragma("cache_size = -64000"); // 64MB cache
  db.pragma("temp_store = MEMORY");

  console.log("  Creating tables...\n");

  db.exec(`
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
    );

    CREATE TABLE provider_codes (
      npi TEXT NOT NULL,
      hcpcs_code TEXT NOT NULL,
      services INTEGER NOT NULL DEFAULT 0,
      payment INTEGER NOT NULL DEFAULT 0,
      beneficiaries INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (npi, hcpcs_code),
      FOREIGN KEY (npi) REFERENCES providers(npi)
    );

    CREATE TABLE benchmarks (
      specialty TEXT PRIMARY KEY,
      provider_count INTEGER NOT NULL DEFAULT 0,
      avg_medicare_patients INTEGER NOT NULL DEFAULT 0,
      avg_revenue_per_patient INTEGER NOT NULL DEFAULT 0,
      avg_total_payment INTEGER NOT NULL DEFAULT 0,
      avg_total_services INTEGER NOT NULL DEFAULT 0,
      pct_99213 REAL NOT NULL DEFAULT 0,
      pct_99214 REAL NOT NULL DEFAULT 0,
      pct_99215 REAL NOT NULL DEFAULT 0,
      ccm_adoption_rate REAL NOT NULL DEFAULT 0,
      rpm_adoption_rate REAL NOT NULL DEFAULT 0,
      bhi_adoption_rate REAL NOT NULL DEFAULT 0,
      awv_adoption_rate REAL NOT NULL DEFAULT 0
    );
  `);

  // ─── Prepared statements ───

  const insertProvider = db.prepare(`
    INSERT INTO providers (
      npi, last_name, first_name, credential, specialty, state, city,
      total_beneficiaries, total_services, total_medicare_payment,
      em_99211, em_99212, em_99213, em_99214, em_99215, em_total,
      ccm_99490_services, ccm_99490_payment,
      rpm_99454_services, rpm_99457_services, rpm_payment,
      bhi_99484_services, bhi_99484_payment,
      awv_g0438_services, awv_g0439_services, awv_payment
    ) VALUES (
      @npi, @lastName, @firstName, @credential, @specialty, @state, @city,
      @totalBeneficiaries, @totalServices, @totalMedicarePayment,
      @em99211, @em99212, @em99213, @em99214, @em99215, @emTotal,
      @ccm99490Services, @ccm99490Payment,
      @rpm99454Services, @rpm99457Services, @rpmPayment,
      @bhi99484Services, @bhi99484Payment,
      @awvG0438Services, @awvG0439Services, @awvPayment
    )
  `);

  const insertCode = db.prepare(`
    INSERT INTO provider_codes (npi, hcpcs_code, services, payment, beneficiaries)
    VALUES (@npi, @code, @services, @payment, @beneficiaries)
  `);

  const insertBenchmark = db.prepare(`
    INSERT INTO benchmarks (
      specialty, provider_count, avg_medicare_patients, avg_revenue_per_patient,
      avg_total_payment, avg_total_services,
      pct_99213, pct_99214, pct_99215,
      ccm_adoption_rate, rpm_adoption_rate, bhi_adoption_rate, awv_adoption_rate
    ) VALUES (
      @specialty, @providerCount, @avgMedicarePatients, @avgRevenuePerPatient,
      @avgTotalPayment, @avgTotalServices,
      @pct99213, @pct99214, @pct99215,
      @ccmAdoptionRate, @rpmAdoptionRate, @bhiAdoptionRate, @awvAdoptionRate
    )
  `);

  // ─── Phase 1: Load benchmarks ───

  console.log("  Phase 1: Loading benchmarks...\n");

  const benchmarksRaw = JSON.parse(readFileSync(BENCHMARKS_PATH, "utf-8"));
  let benchmarkCount = 0;

  const insertBenchmarksTransaction = db.transaction(() => {
    for (const [, bm] of Object.entries(benchmarksRaw) as [string, any][]) {
      insertBenchmark.run({
        specialty: bm.specialty,
        providerCount: bm.providerCount,
        avgMedicarePatients: bm.avgMedicarePatients,
        avgRevenuePerPatient: bm.avgRevenuePerPatient,
        avgTotalPayment: bm.avgTotalPayment,
        avgTotalServices: bm.avgTotalServices,
        pct99213: bm.pct99213,
        pct99214: bm.pct99214,
        pct99215: bm.pct99215,
        ccmAdoptionRate: bm.ccmAdoptionRate,
        rpmAdoptionRate: bm.rpmAdoptionRate,
        bhiAdoptionRate: bm.bhiAdoptionRate,
        awvAdoptionRate: bm.awvAdoptionRate,
      });
      benchmarkCount++;
    }
  });

  insertBenchmarksTransaction();
  console.log(`  ✓ Inserted ${benchmarkCount} specialty benchmarks\n`);

  // ─── Phase 2: Load provider NPI files ───

  console.log("  Phase 2: Loading provider data from JSON files...\n");

  const startTime = Date.now();
  let providersInserted = 0;
  let codesInserted = 0;
  let errors = 0;

  // Get all prefix directories (10, 11, 12, ... 19)
  const prefixDirs = readdirSync(DATA_DIR).filter((entry) => {
    const fullPath = join(DATA_DIR, entry);
    // Only directories with numeric names (NPI prefixes)
    return /^\d{2}$/.test(entry) && existsSync(fullPath);
  });

  console.log(`  Found ${prefixDirs.length} NPI prefix directories\n`);

  // Process in batches using transactions for speed
  const BATCH_SIZE = 10_000;
  let batchProviders: any[] = [];
  let batchCodes: { npi: string; code: string; services: number; payment: number; beneficiaries: number }[] = [];

  const flushBatch = db.transaction(() => {
    for (const p of batchProviders) {
      insertProvider.run(p);
    }
    for (const c of batchCodes) {
      insertCode.run(c);
    }
  });

  for (const prefix of prefixDirs) {
    const dirPath = join(DATA_DIR, prefix);
    const files = readdirSync(dirPath).filter((f) => f.endsWith(".json"));

    for (const file of files) {
      try {
        const raw = readFileSync(join(dirPath, file), "utf-8");
        const data = JSON.parse(raw);

        // Add provider to batch
        batchProviders.push({
          npi: data.npi,
          lastName: data.lastName || "",
          firstName: data.firstName || "",
          credential: data.credential || "",
          specialty: data.specialty || "",
          state: data.state || "",
          city: data.city || "",
          totalBeneficiaries: data.totalBeneficiaries || 0,
          totalServices: data.totalServices || 0,
          totalMedicarePayment: data.totalMedicarePayment || 0,
          em99211: data.em99211 || 0,
          em99212: data.em99212 || 0,
          em99213: data.em99213 || 0,
          em99214: data.em99214 || 0,
          em99215: data.em99215 || 0,
          emTotal: data.emTotal || 0,
          ccm99490Services: data.ccm99490Services || 0,
          ccm99490Payment: data.ccm99490Payment || 0,
          rpm99454Services: data.rpm99454Services || 0,
          rpm99457Services: data.rpm99457Services || 0,
          rpmPayment: data.rpmPayment || 0,
          bhi99484Services: data.bhi99484Services || 0,
          bhi99484Payment: data.bhi99484Payment || 0,
          awvG0438Services: data.awvG0438Services || 0,
          awvG0439Services: data.awvG0439Services || 0,
          awvPayment: data.awvPayment || 0,
        });

        // Add top codes to batch
        if (data.topCodes && Array.isArray(data.topCodes)) {
          for (const tc of data.topCodes) {
            batchCodes.push({
              npi: data.npi,
              code: tc.code,
              services: tc.services || 0,
              payment: tc.payment || 0,
              beneficiaries: tc.beneficiaries || 0,
            });
            codesInserted++;
          }
        }

        providersInserted++;

        // Flush batch
        if (batchProviders.length >= BATCH_SIZE) {
          flushBatch();
          batchProviders = [];
          batchCodes = [];

          if (providersInserted % 100_000 === 0) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
            process.stdout.write(
              `\r  Inserting providers... ${providersInserted.toLocaleString()} (${elapsed}s)    `
            );
          }
        }
      } catch (err: any) {
        errors++;
        if (errors <= 5) {
          console.error(`  ⚠ Error parsing ${file}: ${err.message}`);
        }
      }
    }
  }

  // Flush remaining batch
  if (batchProviders.length > 0) {
    flushBatch();
  }

  console.log(
    `\r  ✓ Inserted ${providersInserted.toLocaleString()} providers + ${codesInserted.toLocaleString()} HCPCS codes    \n`
  );

  if (errors > 0) {
    console.log(`  ⚠ ${errors} files had errors and were skipped\n`);
  }

  // ─── Phase 3: Create indexes ───

  console.log("  Phase 3: Creating indexes...\n");

  db.exec(`
    CREATE INDEX idx_providers_specialty ON providers(specialty);
    CREATE INDEX idx_providers_state ON providers(state);
    CREATE INDEX idx_providers_name ON providers(last_name, first_name);
    CREATE INDEX idx_providers_state_payment ON providers(state, total_medicare_payment DESC);
    CREATE INDEX idx_providers_specialty_state ON providers(specialty, state);
    CREATE INDEX idx_providers_specialty_state_payment ON providers(specialty, state, total_medicare_payment DESC);
    CREATE INDEX idx_codes_npi ON provider_codes(npi);
    CREATE INDEX idx_codes_hcpcs ON provider_codes(hcpcs_code);
  `);

  console.log("  ✓ Indexes created\n");

  // ─── Summary ───

  // Get file size
  const stats = require("fs").statSync(DB_PATH);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(1);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);

  // Quick verification
  const providerCountResult = db.prepare("SELECT COUNT(*) as count FROM providers").get() as any;
  const codeCountResult = db.prepare("SELECT COUNT(*) as count FROM provider_codes").get() as any;
  const benchmarkCountResult = db.prepare("SELECT COUNT(*) as count FROM benchmarks").get() as any;

  // Sample query
  const sampleProvider = db.prepare("SELECT npi, first_name, last_name, specialty, total_medicare_payment FROM providers ORDER BY total_medicare_payment DESC LIMIT 1").get() as any;

  console.log("  ━━ Build Complete ━━\n");
  console.log(`  Database file:  ${DB_PATH}`);
  console.log(`  Database size:  ${sizeMB} MB`);
  console.log(`  Providers:      ${providerCountResult.count.toLocaleString()}`);
  console.log(`  HCPCS codes:    ${codeCountResult.count.toLocaleString()}`);
  console.log(`  Benchmarks:     ${benchmarkCountResult.count}`);
  console.log(`  Elapsed:        ${elapsed}s\n`);

  if (sampleProvider) {
    console.log(`  Top provider by payment:`);
    console.log(`    ${sampleProvider.first_name} ${sampleProvider.last_name} (${sampleProvider.npi})`);
    console.log(`    ${sampleProvider.specialty} — $${sampleProvider.total_medicare_payment.toLocaleString()}\n`);
  }

  // Size check for Vercel
  const sizeBytes = stats.size;
  if (sizeBytes < 250 * 1024 * 1024) {
    console.log(`  ✓ Database is under 250MB — can be bundled with Vercel deployment`);
  } else {
    console.log(`  ⚠ Database is over 250MB — consider using Vercel Postgres or Turso for production`);
  }

  console.log("");

  db.close();
}

main().catch((err) => {
  console.error("\n  ✗ Build failed:", err.message);
  console.error(err.stack);
  process.exit(1);
});
