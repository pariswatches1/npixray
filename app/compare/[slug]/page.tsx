import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftRight, ArrowLeft, Trophy } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import {
  getAllBenchmarks,
  specialtyToSlug,
  formatCurrency,
  formatNumber,
  type BenchmarkRow,
} from "@/lib/db-queries";

export const dynamic = 'force-dynamic';

function slugToSpecialtyName(
  slug: string,
  benchmarks: BenchmarkRow[]
): string | null {
  for (const b of benchmarks) {
    if (specialtyToSlug(b.specialty) === slug) return b.specialty;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return { title: "Comparison Not Found" };

  const benchmarks = await getAllBenchmarks();
  const nameA = slugToSpecialtyName(parts[0], benchmarks);
  const nameB = slugToSpecialtyName(parts[1], benchmarks);

  if (!nameA || !nameB) return { title: "Comparison Not Found" };

  return {
    title: `${nameA} vs ${nameB} — Medicare Revenue Comparison | NPIxray`,
    description: `Side-by-side comparison of ${nameA} and ${nameB}: Medicare revenue, patient volumes, E&M coding distribution, and care management adoption rates.`,
    openGraph: {
      title: `${nameA} vs ${nameB} — Medicare Revenue Comparison | NPIxray`,
      description: `Compare ${nameA} vs ${nameB} with real CMS Medicare data.`,
    },
  };
}

interface ComparisonMetric {
  label: string;
  valueA: string;
  valueB: string;
  rawA: number;
  rawB: number;
  higherIsBetter: boolean;
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parts = slug.split("-vs-");
  if (parts.length !== 2) notFound();

  const benchmarks = await getAllBenchmarks();
  const nameA = slugToSpecialtyName(parts[0], benchmarks);
  const nameB = slugToSpecialtyName(parts[1], benchmarks);

  if (!nameA || !nameB) notFound();

  const a = benchmarks.find((b) => b.specialty === nameA)!;
  const b = benchmarks.find((b) => b.specialty === nameB)!;

  const metrics: ComparisonMetric[] = [
    {
      label: "Provider Count",
      valueA: formatNumber(a.provider_count),
      valueB: formatNumber(b.provider_count),
      rawA: a.provider_count,
      rawB: b.provider_count,
      higherIsBetter: true,
    },
    {
      label: "Avg Medicare Patients",
      valueA: Math.round(a.avg_medicare_patients).toLocaleString(),
      valueB: Math.round(b.avg_medicare_patients).toLocaleString(),
      rawA: a.avg_medicare_patients,
      rawB: b.avg_medicare_patients,
      higherIsBetter: true,
    },
    {
      label: "Avg Total Payment",
      valueA: formatCurrency(a.avg_total_payment),
      valueB: formatCurrency(b.avg_total_payment),
      rawA: a.avg_total_payment,
      rawB: b.avg_total_payment,
      higherIsBetter: true,
    },
    {
      label: "Avg Revenue Per Patient",
      valueA: formatCurrency(a.avg_revenue_per_patient),
      valueB: formatCurrency(b.avg_revenue_per_patient),
      rawA: a.avg_revenue_per_patient,
      rawB: b.avg_revenue_per_patient,
      higherIsBetter: true,
    },
    {
      label: "99213 Distribution",
      valueA: `${(a.pct_99213 * 100).toFixed(1)}%`,
      valueB: `${(b.pct_99213 * 100).toFixed(1)}%`,
      rawA: a.pct_99213,
      rawB: b.pct_99213,
      higherIsBetter: false,
    },
    {
      label: "99214 Distribution",
      valueA: `${(a.pct_99214 * 100).toFixed(1)}%`,
      valueB: `${(b.pct_99214 * 100).toFixed(1)}%`,
      rawA: a.pct_99214,
      rawB: b.pct_99214,
      higherIsBetter: true,
    },
    {
      label: "99215 Distribution",
      valueA: `${(a.pct_99215 * 100).toFixed(1)}%`,
      valueB: `${(b.pct_99215 * 100).toFixed(1)}%`,
      rawA: a.pct_99215,
      rawB: b.pct_99215,
      higherIsBetter: true,
    },
    {
      label: "CCM Adoption Rate",
      valueA: `${(a.ccm_adoption_rate * 100).toFixed(1)}%`,
      valueB: `${(b.ccm_adoption_rate * 100).toFixed(1)}%`,
      rawA: a.ccm_adoption_rate,
      rawB: b.ccm_adoption_rate,
      higherIsBetter: true,
    },
    {
      label: "RPM Adoption Rate",
      valueA: `${(a.rpm_adoption_rate * 100).toFixed(1)}%`,
      valueB: `${(b.rpm_adoption_rate * 100).toFixed(1)}%`,
      rawA: a.rpm_adoption_rate,
      rawB: b.rpm_adoption_rate,
      higherIsBetter: true,
    },
    {
      label: "AWV Adoption Rate",
      valueA: `${(a.awv_adoption_rate * 100).toFixed(1)}%`,
      valueB: `${(b.awv_adoption_rate * 100).toFixed(1)}%`,
      rawA: a.awv_adoption_rate,
      rawB: b.awv_adoption_rate,
      higherIsBetter: true,
    },
  ];

  function winnerSide(metric: ComparisonMetric): "a" | "b" | "tie" {
    if (metric.rawA === metric.rawB) return "tie";
    const aWins = metric.higherIsBetter
      ? metric.rawA > metric.rawB
      : metric.rawA < metric.rawB;
    return aWins ? "a" : "b";
  }

  const winsA = metrics.filter((m) => winnerSide(m) === "a").length;
  const winsB = metrics.filter((m) => winnerSide(m) === "b").length;

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Compare", href: "/compare" },
              { label: `${nameA} vs ${nameB}` },
            ]}
          />

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            <span className="text-gold">{nameA}</span>{" "}
            <span className="text-[var(--text-secondary)]">vs</span>{" "}
            <span className="text-gold">{nameB}</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            Head-to-head comparison of Medicare billing data, E&M coding
            patterns, and care management adoption rates.
          </p>

          {/* Score Summary */}
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-center">
              <p className="text-2xl font-bold font-mono text-gold">{winsA}</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1 truncate">
                {nameA}
              </p>
            </div>
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-center flex items-center justify-center">
              <ArrowLeftRight className="h-5 w-5 text-[var(--text-secondary)]" />
            </div>
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-center">
              <p className="text-2xl font-bold font-mono text-gold">{winsB}</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1 truncate">
                {nameB}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">
            Side-by-Side <span className="text-gold">Comparison</span>
          </h2>
          <div className="overflow-x-auto rounded-xl border border-dark-50/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-50/50 bg-dark-300">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Metric
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                    {nameA}
                  </th>
                  <th className="text-center px-4 py-3 w-12" />
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                    {nameB}
                  </th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => {
                  const winner = winnerSide(m);
                  return (
                    <tr
                      key={m.label}
                      className="border-b border-dark-50/30 hover:bg-dark-200/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">{m.label}</td>
                      <td
                        className={`px-4 py-3 text-right tabular-nums font-mono ${
                          winner === "a"
                            ? "text-gold font-bold"
                            : "text-[var(--text-secondary)]"
                        }`}
                      >
                        {m.valueA}
                        {winner === "a" && (
                          <Trophy className="h-3 w-3 inline ml-1.5 text-gold" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-[var(--text-secondary)]">
                        vs
                      </td>
                      <td
                        className={`px-4 py-3 tabular-nums font-mono ${
                          winner === "b"
                            ? "text-gold font-bold"
                            : "text-[var(--text-secondary)]"
                        }`}
                      >
                        {winner === "b" && (
                          <Trophy className="h-3 w-3 inline mr-1.5 text-gold" />
                        )}
                        {m.valueB}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Individual Links */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold mb-4">Explore Each Specialty</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/specialties/${specialtyToSlug(nameA)}`}
              className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors"
            >
              {nameA} Benchmarks
            </Link>
            <Link
              href={`/specialties/${specialtyToSlug(nameB)}`}
              className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors"
            >
              {nameB} Benchmarks
            </Link>
            <Link
              href="/compare"
              className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors"
            >
              All Comparisons
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
