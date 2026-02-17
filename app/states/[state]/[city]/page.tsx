import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Building2, Users, DollarSign, TrendingUp, Stethoscope } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { ProviderTable } from "@/components/seo/provider-table";
import { StatCard } from "@/components/seo/stat-card";
import {
  getCityStats,
  getCityProviders,
  getCitySpecialties,
  getCityNameFromDb,
  slugToStateAbbr,
  stateAbbrToName,
  stateToSlug,
  formatCurrency,
  formatNumber,
} from "@/lib/db-queries";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}): Promise<Metadata> {
  const { state: stateSlug, city: citySlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) return { title: "City Not Found" };

  const cityName = getCityNameFromDb(abbr, citySlug);
  if (!cityName) return { title: "City Not Found" };

  const stats = getCityStats(abbr, cityName);
  if (!stats || !stats.count) return { title: "City Not Found" };

  const stateName = stateAbbrToName(abbr);
  return {
    title: `${cityName}, ${stateName} Medicare Providers — Revenue Data | NPIxray`,
    description: `${cityName}, ${abbr} Medicare provider data: ${stats.count} providers, ${formatCurrency(stats.totalPayment)} total payments, ${formatCurrency(stats.avgPayment)} average per provider. See all specialties and providers.`,
    openGraph: {
      title: `${cityName}, ${stateName} Medicare Providers | NPIxray`,
      description: `Explore Medicare billing data for ${stats.count} providers in ${cityName}, ${abbr}.`,
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ state: string; city: string }>;
}) {
  const { state: stateSlug, city: citySlug } = await params;
  const abbr = slugToStateAbbr(stateSlug);
  if (!abbr) notFound();

  const cityName = getCityNameFromDb(abbr, citySlug);
  if (!cityName) notFound();

  const stats = getCityStats(abbr, cityName);
  if (!stats || !stats.count) notFound();

  const stateName = stateAbbrToName(abbr);
  const specialties = getCitySpecialties(abbr, cityName);
  const providers = getCityProviders(abbr, cityName, 100);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "States", href: "/states" },
              { label: stateName, href: `/states/${stateSlug}` },
              { label: cityName },
            ]}
          />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <Building2 className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {cityName}, {abbr}{" "}
                <span className="text-gold">Medicare Providers</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                CMS Medicare Physician &amp; Other Practitioners data
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard
              label="Provider Count"
              value={formatNumber(stats.count)}
              icon={Users}
              sub={`in ${cityName}, ${abbr}`}
            />
            <StatCard
              label="Avg Payment / Provider"
              value={formatCurrency(stats.avgPayment)}
              icon={TrendingUp}
            />
            <StatCard
              label="Total Medicare Payment"
              value={formatCurrency(stats.totalPayment)}
              icon={DollarSign}
            />
          </div>
        </div>
      </section>

      {/* Specialties Breakdown */}
      {specialties.length > 0 && (
        <section className="border-t border-dark-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              Specialties in{" "}
              <span className="text-gold">{cityName}, {abbr}</span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-dark-50/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-50/50 bg-dark-300">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Specialty</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Providers</th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Avg Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {specialties.map((s, i) => (
                    <tr
                      key={s.specialty}
                      className={`border-b border-dark-50/30 hover:bg-dark-200/50 transition-colors ${i % 2 === 0 ? "bg-dark-400/30" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium">{s.specialty}</span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {s.count.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium text-gold">
                        {formatCurrency(s.avgPayment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* All Providers */}
      {providers.length > 0 && (
        <section className="border-t border-dark-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">
              All Providers in{" "}
              <span className="text-gold">{cityName}, {abbr}</span>
            </h2>
            <ProviderTable providers={providers} showCity={false} showSpecialty={true} />
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
