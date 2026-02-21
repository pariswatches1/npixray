/**
 * Migration script: Create usage_logs table in Neon PostgreSQL.
 *
 * Run: npx tsx data/scripts/migrate-usage-logs.ts
 *
 * NOTE: This is additive only — does NOT modify existing tables.
 */

import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL not set. Skipping migration.");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  console.log("Migrating usage_logs table...\n");

  // ── Usage logs table ───────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS usage_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      count INTEGER DEFAULT 1,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  console.log("  ✓ usage_logs table created");

  // ── Indexes ────────────────────────────────────────────────
  await sql`CREATE INDEX IF NOT EXISTS idx_usage_logs_user ON usage_logs(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_usage_logs_user_type_month ON usage_logs(user_id, type, created_at)`;
  console.log("  ✓ indexes created");

  console.log("\nDone. usage_logs table ready.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
