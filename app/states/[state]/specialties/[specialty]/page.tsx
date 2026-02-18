import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Users, DollarSign, TrendingUp, Stethoscope, Activity } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { ProviderTable } from "@/components/seo/provider-table";
import { StatCard } from "@/components/seo/stat-card";
import {
  getSpecialtyByState,
  getSpecialtyStateProviders,
  getAllBenchmarks,
  slugToStateAbbr,
  stateAbbrToName,
  stateToSlug,
  specialtyToSlug,
  formatCurrency,
  formatNumber,
} from "@/lib/db-queries";

export const dynamic = 'force-dynamic';

/**
 * Reverse-lookup a specialty slug to the actual specialty name
 * by checking all benchmarks. Falls back to title-casing the slug.
 */
async function slugToSpecialtyName(slug: string): Promise<string | null> {
  const benchmarks = await getAllBenchmarks();
  for (const b of benchmarks) {
    if (specialtyToSlug(b.specialty) === slug) return b.specialty;
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; specialty: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, specialty: specSlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) return { title: "Not Found" };

  const specialtyName = await slugToSpecialtyName(specSlug);
  if (!specialtyName) return { title: "Not Found" };

  const stats = await getSpecialtyByState(specialtyName, abbr);
  if (!stats || !stats.count) return { title: "Not Found" };

  const stateName = stateAbbrToName(abbr);
  return {
    title: `${specialtyName} in ${stateName} — ${formatNumber(stats.count)} Providers | NPIxray`,
    description: `${specialtyName} Medicare data in ${stateName}: ${formatNumber(stats.count)} providers, ${formatCurrency(stats.totalPayment)} total payments, ${formatCurrency(stats.avgPayment)} average per provider.`,
    openGraph: {
      title: `${specialtyName} in ${stateName} | NPIxray`,
      description: `Explore ${specialtyName} Medicare billing data for ${formatNumber(stats.count)} providers in ${stateName}.`,
    },
  };
}

export default async function StateSpecialtyPage({
  params,
}: {
  params: Promise<{ state: string; specialty: string }>;
}) {
  const { state: stateSlug, specialty: specSlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) notFound();

  const specialtyName = await slugToSpecialtyName(specSlug);
  if (!specialtyName) notFound();

  const stats = await getSpecialtyByState(specialtyName, abbr);
  if (!stats || !stats.count) notFound();

  const stateName = stateAbbrToName(abbr);
  const [providers, benchmarks] = await Promise.all([
    getSpecialtyStateProviders(specialtyName, abbr, 50),
    getAllBenchmarks(),
  ]);
  const nationalBenchmark = benchmarks.find(
    (b) => specialtyToSlug(b.specialty) === specSlug
  );
  const nationalAvg = nationalBenchmark?.avg_total_payment ?? null;

  let comparisonText = "";
  if (nationalAvg && nationalAvg > 0) {
    const diff = ((stats.avgPayment - nationalAvg) / nationalAvg) * 100;
    const direction = diff >= 0 ? "more" : "less";
    comparisonText = `${stateName} ${specialtyName} providers earn ${Math.abs(diff).toFixed(0)}% ${direction} than the national average of ${formatCurrency(nationalAvg)}.`;
  }

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "States", href: "/states" },
              { label: stateName, href: `/states/${stateSlug}` },
              { label: "Specialties" },
              { label: specialtyName },
            ]}
          />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <Stethoscope className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {specialtyName} in{" "}
                <span className="text-gold">{stateName}</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                CMS Medicare Physician &amp; Other Practitioners data
              </p>
            </div>
          </div>

          {/* Comparison callout */}
          {comparisonText && (
            <div className="mt-4 rounded-xl border border-gold/20 bg-gold/5 p-5">
              <p className="text-sm leading-relaxed">
                <span className="font-semibold text-gold">Key Insight: </span>
                <span className="text-[var(--text-secondary)]">
                  {comparisonText}
                </span>
              </p>
            </div>
          )}

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard
              label="Provider Count"
              value={formatNumber(stats.count)}
              icon={Users}
              sub={`${specialtyName} in ${stateName}`}
            />
            <StatCard
              label="Avg Payment / Provider"
              value={formatCurrency(stats.avgPayment)}
              icon={TrendingUp}
            />
            {nationalAvg && nationalAvg > 0 && (
              <StatCard
                label="vs National Avg"
                value={formatCurrency(nationalAvg)}
                icon={Activity}
                sub={`National benchmark for ${specialtyName}`}
              />
            )}
          </div>
        </div>
      </section>

      {/* Top Providers */}
      {providers.length > 0 && (
        <section className="border-t border-dark-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Top {specialtyName} Providers in{" "}
              <span className="text-gold">{stateName}</span>
            </h2>
            <ProviderTable providers={providers} showCity={true} showSpecialty={false} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
