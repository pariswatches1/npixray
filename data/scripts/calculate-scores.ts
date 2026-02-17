#!/usr/bin/env npx tsx
/**
 * NPIxray — Batch Revenue Score Calculator
 *
 * Pre-calculates Revenue Scores for all 1,175,281 providers and stores
 * them in the SQLite database. Then optionally syncs scores to Neon Postgres.
 *
 * Steps:
 *   1. Add `revenue_score` column to SQLite providers table (if missing)
 *   2. Pre-compute distinct code counts per NPI (provider_codes table)
 *   3. Load all benchmarks into memory
 *   4. Stream providers in batches of 5,000
 *   5. Compute score for each, batch UPDATE `revenue_score` column
 *   6. Optionally sync to Neon with --sync flag
 *
 * Usage:
 *   npx tsx data/scripts/calculate-scores.ts          # SQLite only
 *   npx tsx data/scripts/calculate-scores.ts --sync    # SQLite + Neon sync
 *   — or —
 *   npm run scores:calculate
 */

import Database from "better-sqlite3";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

// ── Load .env.local ──────────────────────────────────────────

const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) process.env[match[1]] = match[2];
  }
}

// ── Paths ────────────────────────────────────────────────────

const DB_PATH = join(process.cwd(), "data", "cms.db");
const SYNC_MODE = process.argv.includes("--sync");
const BATCH_SIZE = 5000;
const NEON_BATCH_SIZE = 500;
const PROGRESS_INTERVAL = 50_000;
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

// ── Score Algorithm (inline to avoid ESM/import issues) ──────

interface BenchmarkData {
  specialty: string;
  pct_99213: number;
  pct_99214: number;
  pct_99215: number;
  ccm_adoption_rate: number;
  rpm_adoption_rate: number;
  bhi_adoption_rate: number;
  awv_adoption_rate: number;
  avg_total_payment: number;
  avg_medicare_patients: number;
  avg_revenue_per_patient: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function safeDivide(a: number, b: number, fallback = 0): number {
  return b > 0 ? a / b : fallback;
}

function calculateScore(
  provider: any,
  benchmark: BenchmarkData,
  codeCount: number
): number {
  const emTotal = provider.em_total || 0;
  const em99214 = provider.em_99214 || 0;
  const em99215 = provider.em_99215 || 0;
  const totalPayment = provider.total_medicare_payment || 0;
  const totalBeneficiaries = provider.total_beneficiaries || 0;

  // 1. E&M Coding Optimization (25%)
  let emScore: number;
  if (emTotal <= 0) {
    emScore = 50;
  } else {
    const actual214Pct = safeDivide(em99214, emTotal);
    const actual215Pct = safeDivide(em99215, emTotal);
    const bench214 = Math.max(benchmark.pct_99214, 0.01);
    const bench215 = Math.max(benchmark.pct_99215, 0.01);
    const ratio214 = Math.min(actual214Pct / bench214, 1.2);
    const ratio215 = Math.min(actual215Pct / bench215, 1.2);
    emScore = clamp(Math.round((ratio214 * 0.6 + ratio215 * 0.4) * 100), 0, 100);
  }

  // 2. Program Utilization (25%)
  const hasCCM = (provider.ccm_99490_services || 0) > 0;
  const hasRPM = (provider.rpm_99454_services || 0) > 0 || (provider.rpm_99457_services || 0) > 0;
  const hasBHI = (provider.bhi_99484_services || 0) > 0;
  const hasAWV = (provider.awv_g0438_services || 0) > 0 || (provider.awv_g0439_services || 0) > 0;

  const programs = [
    { has: hasCCM, benchRate: benchmark.ccm_adoption_rate, points: 25 },
    { has: hasRPM, benchRate: benchmark.rpm_adoption_rate, points: 20 },
    { has: hasBHI, benchRate: benchmark.bhi_adoption_rate, points: 15 },
    { has: hasAWV, benchRate: benchmark.awv_adoption_rate, points: 40 },
  ];
  const relevant = programs.filter((p) => p.benchRate >= 0.01);
  let programScore: number;
  if (relevant.length === 0) {
    programScore = 50;
  } else {
    const totalPoints = relevant.reduce((a, p) => a + p.points, 0);
    const earnedPoints = relevant.filter((p) => p.has).reduce((a, p) => a + p.points, 0);
    programScore = clamp(Math.round((earnedPoints / totalPoints) * 100), 0, 100);
  }

  // 3. Revenue Efficiency (20%)
  const expectedPayment = benchmark.avg_total_payment * safeDivide(totalBeneficiaries, Math.max(benchmark.avg_medicare_patients, 1), 1);
  const revenueRatio = Math.min(safeDivide(totalPayment, Math.max(expectedPayment, 1), 0.5), 1.5);
  const revenueScore = clamp(Math.round(revenueRatio * 66.7), 0, 100);

  // 4. Service Diversity (15%)
  let diversityScore: number;
  if (codeCount >= 20) diversityScore = 100;
  else if (codeCount >= 15) diversityScore = 85;
  else if (codeCount >= 10) diversityScore = 70;
  else if (codeCount >= 6) diversityScore = 55;
  else if (codeCount >= 3) diversityScore = 35;
  else diversityScore = 15;

  // 5. Patient Volume Efficiency (15%)
  const actualRPP = safeDivide(totalPayment, Math.max(totalBeneficiaries, 1));
  const benchRPP = Math.max(benchmark.avg_revenue_per_patient, 1);
  const rppRatio = Math.min(safeDivide(actualRPP, benchRPP, 0.5), 1.5);
  const volumeScore = clamp(Math.round(rppRatio * 66.7), 0, 100);

  // Weighted total
  return clamp(
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
}

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

// ── Main ─────────────────────────────────────────────────────

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  NPIxray — Batch Revenue Score Calculator");
  if (SYNC_MODE) console.log("  (will sync scores to Neon after SQLite)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Verify SQLite DB exists
  if (!existsSync(DB_PATH)) {
    console.error(`  ERROR: SQLite database not found: ${DB_PATH}`);
    console.error("  Run 'npm run cms:build-db' first.\n");
    process.exit(1);
  }

  const db = new Database(DB_PATH);
  const startTime = Date.now();

  // ─── Step 1: Add revenue_score column if missing ───

  console.log("  Step 1: Ensuring revenue_score column exists...\n");

  const columns = db
    .prepare("PRAGMA table_info(providers)")
    .all() as any[];
  const hasScoreCol = columns.some((c: any) => c.name === "revenue_score");

  if (!hasScoreCol) {
    db.exec("ALTER TABLE providers ADD COLUMN revenue_score INTEGER");
    console.log("  Added revenue_score column.\n");
  } else {
    console.log("  Column already exists.\n");
  }

  // ─── Step 2: Pre-compute code counts per NPI ───

  console.log("  Step 2: Computing distinct code counts per NPI...\n");

  const codeCountStart = Date.now();
  const codeCountRows = db
    .prepare(
      "SELECT npi, COUNT(DISTINCT hcpcs_code) as code_count FROM provider_codes GROUP BY npi"
    )
    .all() as any[];

  const codeCountMap = new Map<string, number>();
  for (const row of codeCountRows) {
    codeCountMap.set(row.npi, row.code_count);
  }

  const ccElapsed = ((Date.now() - codeCountStart) / 1000).toFixed(1);
  console.log(
    `  Computed code counts for ${codeCountMap.size.toLocaleString()} providers (${ccElapsed}s)\n`
  );

  // ─── Step 3: Load all benchmarks into memory ───

  console.log("  Step 3: Loading benchmarks...\n");

  const benchmarkRows = db
    .prepare("SELECT * FROM benchmarks")
    .all() as BenchmarkData[];

  const benchmarkMap = new Map<string, BenchmarkData>();
  for (const b of benchmarkRows) {
    benchmarkMap.set(b.specialty, b);
  }

  // Default fallback: Internal Medicine
  const defaultBenchmark = benchmarkMap.get("Internal Medicine") ?? benchmarkRows[0];

  console.log(`  Loaded ${benchmarkRows.length} benchmarks.\n`);

  // ─── Step 4: Calculate scores in batches ───

  console.log("  Step 4: Calculating scores...\n");

  const totalProviders = (
    db.prepare("SELECT COUNT(*) as c FROM providers").get() as any
  ).c;

  const selectStmt = db.prepare(
    "SELECT * FROM providers ORDER BY npi LIMIT ? OFFSET ?"
  );
  const updateStmt = db.prepare(
    "UPDATE providers SET revenue_score = ? WHERE npi = ?"
  );

  // Use a transaction for speed
  let processed = 0;
  let offset = 0;
  const scoreDist = new Map<number, number>(); // bucket → count

  while (true) {
    const rows = selectStmt.all(BATCH_SIZE, offset) as any[];
    if (rows.length === 0) break;

    const updateBatch = db.transaction(() => {
      for (const provider of rows) {
        const benchmark =
          benchmarkMap.get(provider.specialty) ?? defaultBenchmark;
        const codes = codeCountMap.get(provider.npi) ?? 0;
        const score = calculateScore(provider, benchmark, codes);

        updateStmt.run(score, provider.npi);

        // Track distribution
        const bucket = Math.floor(score / 10) * 10;
        scoreDist.set(bucket, (scoreDist.get(bucket) ?? 0) + 1);
      }
    });

    updateBatch();

    processed += rows.length;
    offset += rows.length;

    if (
      processed % PROGRESS_INTERVAL === 0 ||
      processed === rows.length
    ) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const pct = ((processed / totalProviders) * 100).toFixed(1);
      process.stdout.write(
        `\r  Scores: ${processed.toLocaleString()} / ${totalProviders.toLocaleString()} (${pct}%) [${elapsed}s]    `
      );
    }
  }

  const calcElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `\n\n  Calculated ${processed.toLocaleString()} scores in ${calcElapsed}s\n`
  );

  // ─── Step 5: Print score distribution ───

  console.log("  Score Distribution:");
  console.log("  ───────────────────");

  const sortedBuckets = [...scoreDist.entries()].sort((a, b) => a[0] - b[0]);
  for (const [bucket, count] of sortedBuckets) {
    const label = `${bucket}-${bucket + 9}`.padStart(6);
    const bar = "█".repeat(Math.ceil((count / totalProviders) * 200));
    const pct = ((count / totalProviders) * 100).toFixed(1);
    console.log(`  ${label}: ${bar} ${count.toLocaleString()} (${pct}%)`);
  }

  // Compute average
  const avgResult = db
    .prepare("SELECT AVG(revenue_score) as avg FROM providers WHERE revenue_score IS NOT NULL")
    .get() as any;
  console.log(`\n  Average score: ${Math.round(avgResult.avg)}\n`);

  // ─── Step 6: Create SQLite indexes ───

  console.log("  Step 5: Creating indexes...\n");

  db.exec("CREATE INDEX IF NOT EXISTS idx_providers_revenue_score ON providers(revenue_score)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_providers_specialty_score ON providers(specialty, revenue_score)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_providers_state_score ON providers(state, revenue_score)");

  console.log("  Indexes created.\n");

  // ─── Step 7: Sync to Neon (optional) ───

  if (SYNC_MODE) {
    if (!process.env.DATABASE_URL_UNPOOLED) {
      console.error("  ERROR: DATABASE_URL_UNPOOLED not found in .env.local");
      console.error("  Cannot sync to Neon without connection string.\n");
    } else {
      console.log("  Step 6: Syncing scores to Neon Postgres...\n");

      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

      // Add column if missing
      await withRetry(
        () => sql`ALTER TABLE providers ADD COLUMN IF NOT EXISTS revenue_score INTEGER`,
        "Add revenue_score column"
      ).catch(() => {
        // Column may already exist
        console.log("  Column revenue_score already exists in Neon.\n");
      });

      // Create indexes
      await withRetry(
        () => sql`CREATE INDEX IF NOT EXISTS idx_providers_revenue_score ON providers(revenue_score)`,
        "Create idx_providers_revenue_score"
      );
      await withRetry(
        () => sql`CREATE INDEX IF NOT EXISTS idx_providers_specialty_score ON providers(specialty, revenue_score)`,
        "Create idx_providers_specialty_score"
      );
      await withRetry(
        () => sql`CREATE INDEX IF NOT EXISTS idx_providers_state_score ON providers(state, revenue_score)`,
        "Create idx_providers_state_score"
      );

      console.log("  Indexes created in Neon.\n");

      // Batch update scores
      const allScores = db
        .prepare("SELECT npi, revenue_score FROM providers WHERE revenue_score IS NOT NULL ORDER BY npi")
        .all() as any[];

      let synced = 0;
      const syncStart = Date.now();

      for (let i = 0; i < allScores.length; i += NEON_BATCH_SIZE) {
        const batch = allScores.slice(i, i + NEON_BATCH_SIZE);

        // Build a CASE statement for batch update
        const npis = batch.map((r: any) => r.npi);
        const cases = batch.map((r: any) => `WHEN '${r.npi}' THEN ${r.revenue_score}`).join(" ");

        await withRetry(
          () =>
            sql.query(
              `UPDATE providers SET revenue_score = CASE npi ${cases} END WHERE npi IN (${npis.map((_: string, j: number) => `$${j + 1}`).join(",")})`,
              npis
            ),
          `Neon sync batch at ${i}`
        );

        synced += batch.length;

        if (synced % PROGRESS_INTERVAL === 0 || synced === batch.length) {
          const elapsed = ((Date.now() - syncStart) / 1000).toFixed(0);
          const pct = ((synced / allScores.length) * 100).toFixed(1);
          process.stdout.write(
            `\r  Neon sync: ${synced.toLocaleString()} / ${allScores.length.toLocaleString()} (${pct}%) [${elapsed}s]    `
          );
        }
      }

      const syncElapsed = ((Date.now() - syncStart) / 1000).toFixed(1);
      console.log(
        `\n  Synced ${synced.toLocaleString()} scores to Neon in ${syncElapsed}s\n`
      );
    }
  }

  // ─── Summary ───

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Score Calculation Complete");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`  Providers scored: ${processed.toLocaleString()}`);
  console.log(`  Average score:    ${Math.round(avgResult.avg)}`);
  console.log(`  Total time:       ${totalElapsed}s`);
  if (SYNC_MODE) console.log(`  Neon sync:        complete`);
  console.log("");

  db.close();
}

main().catch((err) => {
  console.error("\n  Score calculation failed:", err.message);
  console.error(err.stack);
  process.exit(1);
});
