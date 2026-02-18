import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hash, Users, Activity, DollarSign, Stethoscope } from "lucide-react";
import {
  getCodeStats,
  getCodeTopSpecialties,
  formatCurrency,
  formatNumber,
  specialtyToSlug,
} from "@/lib/db-queries";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StatCard } from "@/components/seo/stat-card";
import { ScanCTA } from "@/components/seo/scan-cta";
import { RelatedLinks } from "@/components/seo/related-links";

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const codeUpper = code.toUpperCase();
  const stats = getCodeStats(codeUpper);
  if (!stats || !stats.totalProviders) return { title: "Code Not Found | NPIxray" };

  return {
    title: `CPT ${codeUpper} — Medicare Billing Data: ${formatNumber(stats.totalServices)} claims, ${formatCurrency(stats.avgPayment)} avg payment | NPIxray`,
    description: `Medicare billing data for CPT/HCPCS code ${codeUpper}: ${formatNumber(stats.totalProviders)} providers, ${formatNumber(stats.totalServices)} total services, ${formatCurrency(stats.totalPayment)} total payments. See which specialties bill this code most.`,
    alternates: {
      canonical: `https://npixray.com/codes/${code}`,
    },
    openGraph: {
      title: `CPT ${codeUpper} Medicare Data | NPIxray`,
      description: `${formatNumber(stats.totalProviders)} providers bill ${codeUpper} to Medicare with ${formatNumber(stats.totalServices)} total services and ${formatCurrency(stats.avgPayment)} average payment per service.`,
    },
  };
}

export default async function CodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const codeUpper = code.toUpperCase();
  const stats = getCodeStats(codeUpper);
  if (!stats || !stats.totalProviders) notFound();

  const topSpecialties = getCodeTopSpecialties(codeUpper, 15);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Codes", href: "/codes" },
              { label: codeUpper },
            ]}
          />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <Hash className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-mono">
                CPT/HCPCS {codeUpper}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Medicare Billing Data
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Total Providers"
              value={formatNumber(stats.totalProviders)}
              icon={Users}
              sub="using this code"
            />
            <StatCard
              label="Total Services"
              value={formatNumber(stats.totalServices)}
              icon={Activity}
              sub="claims filed"
            />
            <StatCard
              label="Total Payment"
              value={formatCurrency(stats.totalPayment)}
              icon={DollarSign}
              sub="Medicare payments"
            />
            <StatCard
              label="Avg Payment/Service"
              value={formatCurrency(stats.avgPayment)}
              icon={DollarSign}
              sub="per claim"
            />
          </div>
        </div>
      </section>

      {/* Top Specialties */}
      {topSpecialties.length > 0 && (
        <section className="border-t border-dark-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">
              Top Specialties Using{" "}
              <span className="text-gold font-mono">{codeUpper}</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8">
              Which medical specialties bill this code most frequently to
              Medicare.
            </p>

            <div className="overflow-x-auto rounded-xl border border-dark-50/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-50/50 bg-dark-300">
                    <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5" />
                        Specialty
                      </div>
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                      Providers
                    </th>
                    <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                      Total Services
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topSpecialties.map((s, i) => (
                    <tr
                      key={s.specialty}
                      className={`border-b border-dark-50/30 hover:bg-dark-200/50 transition-colors ${
                        i % 2 === 0 ? "bg-dark-400/30" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/specialties/${specialtyToSlug(s.specialty)}`}
                          className="text-gold hover:text-gold-300 font-medium transition-colors"
                        >
                          {s.specialty}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatNumber(s.providers)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatNumber(s.totalServices)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Related Codes Link */}
      <section className="border-t border-dark-50/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/codes"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-gold transition-colors"
          >
            View all 200 Medicare billing codes
          </Link>
        </div>
      </section>

      {/* Related Links */}
      <RelatedLinks pageType="code" currentSlug={code} />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
