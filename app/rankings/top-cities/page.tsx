import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { existsSync } from "fs";
import { join } from "path";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import {
  stateAbbrToName,
  stateToSlug,
  cityToSlug,
  formatCurrency,
  formatNumber,
} from "@/lib/db-queries";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Top 100 Medicare Cities by Provider Count | NPIxray",
  description:
    "The 100 largest healthcare markets in the U.S. ranked by number of Medicare providers. See provider counts, average Medicare payments, and drill into city-level data.",
  keywords: [
    "top Medicare cities",
    "healthcare markets by size",
    "Medicare providers by city",
    "largest healthcare cities",
    "city Medicare data",
  ],
  alternates: {
    canonical: "https://npixray.com/rankings/top-cities",
  },
  openGraph: {
    title: "Top 100 Medicare Cities by Provider Count | NPIxray",
    description:
      "The 100 largest healthcare markets in the U.S. ranked by Medicare provider count.",
  },
};

interface CityRow {
  city: string;
  state: string;
  count: number;
  avgPayment: number;
}

function getDb() {
  const dbPath = join(process.cwd(), "data", "cms.db");
  if (!existsSync(dbPath)) return null;
  // eslint-disable-next-line
  const Database = require("better-sqlite3");
  return new Database(dbPath, { readonly: true });
}

function getTopCities(limit = 100): CityRow[] {
  const db = getDb();
  if (!db) return [];
  try {
    return db
      .prepare(
        `SELECT city, state, COUNT(*) as count, AVG(total_medicare_payment) as avgPayment
         FROM providers
         WHERE city != ''
         GROUP BY city, state
         ORDER BY count DESC
         LIMIT ?`
      )
      .all(limit) as CityRow[];
  } finally {
    db.close();
  }
}

export default function TopCitiesPage() {
  const cities = getTopCities(100);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Rankings", href: "/rankings" },
              { label: "Top Cities" },
            ]}
          />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.06]">
              <Building2 className="h-6 w-6 text-[#2F5EA8]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Top 100 Medicare Cities{" "}
                <span className="text-[#2F5EA8]">by Provider Count</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Largest healthcare markets in the U.S.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Table */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {cities.length === 0 ? (
            <p className="text-[var(--text-secondary)]">
              No city data available. Run the CMS data pipeline to populate.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[var(--border-light)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-light)] bg-white">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] w-12">
                      #
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                      City
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                      State
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                      Providers
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">
                      Avg Payment
                    </th>
                    <th className="w-10 px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {cities.map((c, i) => {
                    const stateSlug = stateToSlug(c.state);
                    const cSlug = cityToSlug(c.city);
                    return (
                      <tr
                        key={`${c.city}-${c.state}`}
                        className={`border-b border-[var(--border-light)] hover:bg-white transition-colors ${
                          i % 2 === 0 ? "bg-white" : ""
                        }`}
                      >
                        <td className="px-4 py-3 font-mono text-[var(--text-secondary)]">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/states/${stateSlug}/${cSlug}`}
                            className="text-[#2F5EA8] hover:text-[#264D8C] font-medium transition-colors"
                          >
                            {c.city}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/states/${stateSlug}`}
                            className="text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
                          >
                            {stateAbbrToName(c.state)}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-medium">
                          {formatNumber(c.count)}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-[#2F5EA8] hidden sm:table-cell">
                          {formatCurrency(c.avgPayment)}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/states/${stateSlug}/${cSlug}`}
                            className="text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
