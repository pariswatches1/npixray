#!/usr/bin/env npx tsx
/**
 * NPIxray — Add Missing Compound Indexes to Neon
 *
 * One-time script to add the compound indexes that fix the 4s LCP
 * bottleneck on state and specialty pages. Safe to re-run (IF NOT EXISTS).
 *
 * Usage:
 *   npx tsx data/scripts/add-indexes.ts
 */

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

const connStr = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connStr) {
  console.error("  ERROR: DATABASE_URL or DATABASE_URL_UNPOOLED not found");
  process.exit(1);
}

const sql = neon(connStr);

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  NPIxray — Add Compound Indexes");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const indexes = [
    {
      name: "idx_providers_state_payment",
      sql: "CREATE INDEX IF NOT EXISTS idx_providers_state_payment ON providers(state, total_medicare_payment DESC)",
      reason: "State pages: ORDER BY total_medicare_payment DESC",
    },
    {
      name: "idx_providers_specialty_state",
      sql: "CREATE INDEX IF NOT EXISTS idx_providers_specialty_state ON providers(specialty, state)",
      reason: "Cross-state specialty rankings: WHERE specialty = ? GROUP BY state",
    },
    {
      name: "idx_providers_specialty_state_payment",
      sql: "CREATE INDEX IF NOT EXISTS idx_providers_specialty_state_payment ON providers(specialty, state, total_medicare_payment DESC)",
      reason: "State-specialty pages: WHERE specialty=? AND state=? ORDER BY payment DESC",
    },
  ];

  for (const idx of indexes) {
    const start = Date.now();
    console.log(`  Creating ${idx.name}...`);
    console.log(`    ${idx.reason}`);
    await sql.query(idx.sql);
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`    Done (${elapsed}s)\n`);
  }

  // Verify indexes exist
  console.log("  Verifying indexes...\n");
  const result = await sql.query(
    "SELECT indexname FROM pg_indexes WHERE tablename = 'providers' ORDER BY indexname"
  );
  console.log("  All indexes on providers table:");
  for (const row of result) {
    console.log(`    - ${row.indexname}`);
  }

  console.log("\n  Done! Indexes added successfully.");
  console.log("  ISR pages will use these on next revalidation.\n");
}

main().catch((err) => {
  console.error("\n  Failed:", err.message);
  process.exit(1);
});
