/**
 * Migration script: Create users and subscriptions tables in Neon PostgreSQL.
 *
 * Run: npx tsx data/scripts/migrate-users.ts
 */

import { neon } from "@neondatabase/serverless";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL not set. Skipping migration.");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  console.log("Migrating users + subscriptions tables...\n");

  // ── Users table ──────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      image TEXT,
      provider TEXT DEFAULT 'google',
      plan TEXT DEFAULT 'free',
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      subscription_status TEXT DEFAULT 'none',
      npi TEXT,
      specialty TEXT,
      state TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  console.log("  ✓ users table created");

  // ── Subscriptions table ──────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      stripe_subscription_id TEXT,
      stripe_price_id TEXT,
      plan TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      current_period_start TIMESTAMP WITH TIME ZONE,
      current_period_end TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  console.log("  ✓ subscriptions table created");

  // ── Indexes ──────────────────────────────────────────────
  await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id)`;
  console.log("  ✓ indexes created");

  console.log("\nDone. Users + subscriptions tables ready.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
