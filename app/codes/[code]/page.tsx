import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hash, Users, Activity, DollarSign, Stethoscope } from "lucide-react";
import {
  getCodeStats,
  getCodeTopSpecialties,
  getRelatedCodes,
  formatCurrency,
  formatNumber,
  specialtyToSlug,
} from "@/lib/db-queries";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StatCard } from "@/components/seo/stat-card";
import { ScanCTA } from "@/components/seo/scan-cta";
import { RelatedLinks } from "@/components/seo/related-links";
import { EvidenceBlocks } from "@/components/seo/evidence-blocks";
import { ConfidenceBadge } from "@/components/seo/confidence-badge";
import { RevenueOpportunities } from "@/components/seo/revenue-opportunities";
import { CodeRevenueImpact } from "@/components/seo/code-revenue-impact";
import { getCodeOpportunities } from "@/lib/opportunity-engine";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // ISR: cache at runtime for 24 hours

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

  const [topSpecialties, opportunities, relatedCodes] = await Promise.all([
    getCodeTopSpecialties(codeUpper, 15),
    getCodeOpportunities(codeUpper),
    getRelatedCodes(codeUpper, 5),
  ]);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Codes", href: "/codes" },
              { label: codeUpper },
            ]}
          />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.06]">
              <Hash className="h-6 w-6 text-[#2F5EA8]" />
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

      {/* ── Differentiation Layers ─────────────────────────── */}
      <section className="border-t border-[var(--border-light)] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Layer A: Evidence Blocks */}
          <EvidenceBlocks
            keyStats={[
              { label: "Providers Billing This Code", value: formatNumber(stats.totalProviders) },
              { label: "Avg Payment per Service", value: formatCurrency(stats.avgPayment) },
              { label: "Total Medicare Services", value: formatNumber(stats.totalServices) },
              { label: "Total Medicare Payments", value: formatCurrency(stats.totalPayment) },
            ]}
            comparison={null}
            opportunities={opportunities}
          />

          {/* Layer B: Confidence Badge */}
          <ConfidenceBadge providerCount={stats.totalProviders} />

          {/* Code Revenue Impact — related codes comparison */}
          {relatedCodes.length > 0 && (
            <CodeRevenueImpact
              currentCode={codeUpper}
              currentAvgPayment={stats.avgPayment}
              currentTotalProviders={stats.totalProviders}
              relatedCodes={relatedCodes}
            />
          )}

          {/* Layer 3: Revenue Opportunities */}
          {opportunities.length > 0 && (
            <RevenueOpportunities
              opportunities={opportunities}
              title={`Revenue Opportunities for ${codeUpper}`}
            />
          )}
        </div>
      </section>

      {/* Top Specialties */}
      {topSpecialties.length > 0 && (
        <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">
              Top Specialties Using{" "}
              <span className="text-[#2F5EA8] font-mono">{codeUpper}</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8">
              Which medical specialties bill this code most frequently to
              Medicare.
            </p>

            <div className="overflow-x-auto rounded-xl border border-[var(--border-light)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border-light)] bg-white">
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
                      className={`border-b border-[var(--border-light)] hover:bg-white transition-colors ${
                        i % 2 === 0 ? "bg-white" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/specialties/${specialtyToSlug(s.specialty)}`}
                          className="text-[#2F5EA8] hover:text-[#264D8C] font-medium transition-colors"
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
      <section className="border-t border-[var(--border-light)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/codes"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
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
