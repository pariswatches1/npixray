import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Crown, MapPin, Users, DollarSign } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { ProviderTable } from "@/components/seo/provider-table";
import { StatCard } from "@/components/seo/stat-card";
import {
  getStateTopProviders,
  slugToStateAbbr,
  stateAbbrToName,
  formatCurrency,
  formatNumber,
} from "@/lib/db-queries";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) return { title: "State Not Found" };

  const name = stateAbbrToName(abbr);
  return {
    title: `Top 100 Medicare Providers in ${name} | NPIxray`,
    description: `See the top 100 highest-earning Medicare providers in ${name}, ranked by total Medicare payments. View revenue data, patient counts, and specialties.`,
    alternates: {
      canonical: `https://npixray.com/rankings/top-providers/${slug}`,
    },
    openGraph: {
      title: `Top 100 Medicare Providers in ${name} | NPIxray`,
      description: `Top 100 Medicare providers in ${name} ranked by total payments.`,
    },
  };
}

export default async function TopProvidersByStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const abbr = slugToStateAbbr(slug);
  if (!abbr) notFound();

  const stateName = stateAbbrToName(abbr);
  const providers = await getStateTopProviders(abbr, 100);

  if (!providers.length) notFound();

  const totalPayment = providers.reduce(
    (sum, p) => sum + p.total_medicare_payment,
    0
  );
  const totalPatients = providers.reduce(
    (sum, p) => sum + p.total_beneficiaries,
    0
  );
  const avgPayment = totalPayment / providers.length;

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Rankings", href: "/rankings" },
              { label: "Top Providers", href: "/rankings" },
              { label: stateName },
            ]}
          />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <Crown className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Top 100 Medicare Providers in{" "}
                <span className="text-gold">{stateName}</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Ranked by total Medicare payments
              </p>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Providers Listed"
              value={providers.length.toString()}
              icon={Users}
            />
            <StatCard
              label="Combined Revenue"
              value={formatCurrency(totalPayment)}
              icon={DollarSign}
            />
            <StatCard
              label="Total Patients"
              value={formatNumber(totalPatients)}
              icon={Users}
            />
            <StatCard
              label="Avg Payment"
              value={formatCurrency(avgPayment)}
              icon={DollarSign}
              sub="per provider"
            />
          </div>
        </div>
      </section>

      {/* Provider Table */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">
            All {providers.length} Providers
          </h2>
          <ProviderTable
            providers={providers}
            showCity={true}
            showSpecialty={true}
          />
        </div>
      </section>

      {/* Related Links */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold mb-4">Related Pages</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/states/${slug}`}
              className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors"
            >
              <MapPin className="h-3 w-3 inline mr-1" />
              {stateName} State Profile
            </Link>
            <Link
              href="/rankings"
              className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors"
            >
              All Rankings
            </Link>
            <Link
              href="/rankings/top-specialties"
              className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors"
            >
              Top Specialties
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
