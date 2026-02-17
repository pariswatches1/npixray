import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Users,
  FileText,
  DollarSign,
  Stethoscope,
  MapPin,
  Hash,
  Shield,
  Heart,
  Activity,
  Brain,
  ClipboardCheck,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  getProvider,
  getProviderCodes,
  getProviderCodeCount,
  getRelatedProviders,
  getBenchmarkBySpecialty,
  formatCurrency,
  formatNumber,
  stateAbbrToName,
  specialtyToSlug,
  stateToSlug,
  cityToSlug,
} from "@/lib/db-queries";
import { calculateRevenueScore, estimatePercentile } from "@/lib/revenue-score";
import { RevenueScoreGauge } from "@/components/score/revenue-score-gauge";
import { ScoreBreakdown } from "@/components/score/score-breakdown";
import { ScoreBadgeEmbed } from "@/components/score/score-badge-embed";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";

export const dynamic = 'force-dynamic';

// ── Metadata ──────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ npi: string }>;
}): Promise<Metadata> {
  const { npi } = await params;
  const provider = await getProvider(npi);
  if (!provider) return { title: "Provider Not Found" };

  const fullName = `Dr. ${provider.first_name} ${provider.last_name}`;
  const city = provider.city;
  const state = stateAbbrToName(provider.state);

  return {
    title: `${fullName} — ${provider.specialty} in ${city}, ${state} | Medicare Billing Data`,
    description: `View Medicare billing data for ${fullName}, ${provider.credential || provider.specialty} in ${city}, ${state}. ${formatNumber(provider.total_services)} services, ${formatCurrency(provider.total_medicare_payment)} total Medicare payment. See top billing codes, E&M distribution, and care management programs.`,
    openGraph: {
      title: `${fullName} — ${provider.specialty} | NPIxray`,
      description: `Medicare billing profile for ${fullName} in ${city}, ${state}. ${formatNumber(provider.total_beneficiaries)} patients, ${formatCurrency(provider.total_medicare_payment)} total payment.`,
    },
  };
}

// ── Page ──────────────────────────────────────────────────

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ npi: string }>;
}) {
  const { npi } = await params;
  const provider = await getProvider(npi);
  if (!provider) notFound();

  const [codes, codeCount, benchmark, relatedProviders] = await Promise.all([
    getProviderCodes(npi, 10),
    getProviderCodeCount(npi),
    getBenchmarkBySpecialty(provider.specialty),
    getRelatedProviders(provider.specialty, provider.city, provider.state, npi, 5),
  ]);

  // Compute Revenue Score
  const scoreResult = benchmark
    ? calculateRevenueScore(provider, benchmark, codeCount)
    : null;
  const percentile = scoreResult ? estimatePercentile(scoreResult.overall) : null;

  const fullName = `Dr. ${provider.first_name} ${provider.last_name}`;
  const stateName = stateAbbrToName(provider.state);
  const stateSlug = stateToSlug(provider.state);
  const citySlug = cityToSlug(provider.city);
  const specSlug = specialtyToSlug(provider.specialty);

  // E&M distribution
  const emTotal = provider.em_total || 1;
  const emCodes = [
    { code: "99211", count: provider.em_99211, color: "bg-zinc-500" },
    { code: "99212", count: provider.em_99212, color: "bg-amber-700" },
    { code: "99213", count: provider.em_99213, color: "bg-amber-500" },
    { code: "99214", count: provider.em_99214, color: "bg-gold" },
    { code: "99215", count: provider.em_99215, color: "bg-emerald-500" },
  ];

  // Program billing data
  const programs = [
    {
      name: "CCM",
      fullName: "Chronic Care Management",
      code: "99490",
      services: provider.ccm_99490_services,
      payment: provider.ccm_99490_payment,
      icon: Heart,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
    {
      name: "RPM",
      fullName: "Remote Patient Monitoring",
      code: "99454/99457",
      services: provider.rpm_99454_services + provider.rpm_99457_services,
      payment: provider.rpm_payment,
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      name: "BHI",
      fullName: "Behavioral Health Integration",
      code: "99484",
      services: provider.bhi_99484_services,
      payment: provider.bhi_99484_payment,
      icon: Brain,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      name: "AWV",
      fullName: "Annual Wellness Visit",
      code: "G0438/G0439",
      services: provider.awv_g0438_services + provider.awv_g0439_services,
      payment: provider.awv_payment,
      icon: ClipboardCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  // E&M visits total
  const emVisits = provider.em_total;

  // JSON-LD Physician schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: fullName,
    ...(provider.credential ? { honorificSuffix: provider.credential } : {}),
    medicalSpecialty: provider.specialty,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "NPI",
      value: npi,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: provider.city,
      addressRegion: provider.state,
      addressCountry: "US",
    },
    url: `https://npixray.com/provider/${npi}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Providers", href: "/states" },
            { label: stateName, href: `/states/${stateSlug}` },
            {
              label: provider.city,
              href: `/states/${stateSlug}/${citySlug}`,
            },
            { label: fullName },
          ]}
        />

        {/* ── Header ─────────────────────────────────────── */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {fullName}
            {provider.credential && (
              <span className="text-[var(--text-secondary)] font-normal text-xl ml-2">
                {provider.credential}
              </span>
            )}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-[var(--text-secondary)]">
            <Link
              href={`/specialties/${specSlug}`}
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Stethoscope className="h-3.5 w-3.5 text-gold/60" />
              {provider.specialty}
            </Link>
            <Link
              href={`/states/${stateSlug}/${citySlug}`}
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 text-gold/60" />
              {provider.city}, {provider.state}
            </Link>
            <span className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-gold/60" />
              NPI {npi}
            </span>
          </div>
        </div>

        {/* ── Revenue Score ──────────────────────────────── */}
        {scoreResult && (
          <div className="rounded-2xl border border-dark-50/80 bg-dark-400/30 p-6 mb-10">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <RevenueScoreGauge
                score={scoreResult.overall}
                size="md"
                animate={false}
                percentile={percentile ?? undefined}
                specialty={provider.specialty}
              />
              <div className="flex-1 w-full">
                <ScoreBreakdown breakdown={scoreResult.breakdown} />
              </div>
            </div>
          </div>
        )}

        {/* ── Stats Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                <Users className="h-4 w-4 text-gold" />
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">
                Medicare Patients
              </p>
            </div>
            <p className="text-2xl font-bold font-mono text-gold">
              {formatNumber(provider.total_beneficiaries)}
            </p>
          </div>

          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                <FileText className="h-4 w-4 text-gold" />
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">
                Total Services
              </p>
            </div>
            <p className="text-2xl font-bold font-mono text-gold">
              {formatNumber(provider.total_services)}
            </p>
          </div>

          <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                <DollarSign className="h-4 w-4 text-gold" />
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">
                Medicare Payment
              </p>
            </div>
            <p className="text-2xl font-bold font-mono text-gold">
              {formatCurrency(provider.total_medicare_payment)}
            </p>
          </div>

          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                <Stethoscope className="h-4 w-4 text-gold" />
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">
                E&M Visits
              </p>
            </div>
            <p className="text-2xl font-bold font-mono text-gold">
              {formatNumber(emVisits)}
            </p>
          </div>
        </div>

        {/* ── Top Billing Codes Table ────────────────────── */}
        {codes.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              Top Billing <span className="text-gold">Codes</span>
            </h2>
            <div className="overflow-x-auto rounded-xl border border-dark-50/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-50/50 bg-dark-300/50">
                    <th className="text-left px-4 py-3 text-[11px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                      Code
                    </th>
                    <th className="text-right px-4 py-3 text-[11px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                      Services
                    </th>
                    <th className="text-right px-4 py-3 text-[11px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                      Payment
                    </th>
                    <th className="text-right px-4 py-3 text-[11px] text-[var(--text-secondary)] uppercase tracking-wider font-semibold">
                      Avg/Service
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {codes.map((code, i) => (
                    <tr
                      key={code.hcpcs_code}
                      className={`border-b border-dark-50/30 ${
                        i % 2 === 0 ? "bg-dark-400/20" : "bg-dark-400/40"
                      } hover:bg-dark-400/60 transition-colors`}
                    >
                      <td className="px-4 py-3 font-mono font-semibold text-gold">
                        {code.hcpcs_code}
                      </td>
                      <td className="text-right px-4 py-3 font-mono">
                        {code.services.toLocaleString()}
                      </td>
                      <td className="text-right px-4 py-3 font-mono">
                        {formatCurrency(code.payment)}
                      </td>
                      <td className="text-right px-4 py-3 font-mono text-[var(--text-secondary)]">
                        ${code.services > 0 ? (code.payment / code.services).toFixed(2) : "0.00"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── E&M Code Distribution ──────────────────────── */}
        {emTotal > 1 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">
              E&M Code <span className="text-gold">Distribution</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-2xl">
              Evaluation &amp; Management visit level distribution based on CMS
              Medicare billing data. Higher-level codes (99214, 99215) indicate
              more complex patient encounters.
            </p>
            <div className="space-y-3 max-w-2xl">
              {emCodes.map((em) => {
                const pct = emTotal > 0 ? (em.count / emTotal) * 100 : 0;
                return (
                  <div key={em.code} className="flex items-center gap-4">
                    <span className="text-sm font-mono font-semibold w-14 flex-shrink-0">
                      {em.code}
                    </span>
                    <div className="flex-1 bg-dark-300/50 rounded-full h-6 relative overflow-hidden">
                      <div
                        className={`${em.color} h-6 rounded-full transition-all`}
                        style={{ width: `${Math.max(pct, 1)}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-right w-20 flex-shrink-0">
                      {pct.toFixed(1)}%
                    </span>
                    <span className="text-xs text-[var(--text-secondary)] w-16 text-right flex-shrink-0 hidden sm:block">
                      {em.count.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Program Billing Section ────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            Care Management <span className="text-gold">Programs</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-2xl">
            Medicare care management program participation based on CMS billing
            data. Active programs represent significant revenue and better
            patient outcomes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {programs.map((program) => {
              const isActive = program.services > 0;
              return (
                <div
                  key={program.name}
                  className={`rounded-xl border p-5 ${
                    isActive
                      ? `${program.borderColor} ${program.bgColor}`
                      : "border-dark-50/50 bg-dark-400/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <program.icon
                        className={`h-5 w-5 ${
                          isActive
                            ? program.color
                            : "text-[var(--text-secondary)]"
                        }`}
                      />
                      <span className="font-semibold">{program.name}</span>
                    </div>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] font-semibold text-red-400 uppercase tracking-wider">
                        <XCircle className="h-3 w-3" />
                        Not Billing
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] mb-2">
                    {program.fullName} ({program.code})
                  </p>
                  <div className="flex items-baseline gap-4">
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Services
                      </p>
                      <p className="text-lg font-bold font-mono">
                        {program.services.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Payment
                      </p>
                      <p className="text-lg font-bold font-mono text-gold">
                        {formatCurrency(program.payment)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Related Providers ───────────────────────────── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            Other{" "}
            <Link
              href={`/specialties/${specSlug}`}
              className="text-gold hover:underline"
            >
              {provider.specialty}
            </Link>{" "}
            Providers in{" "}
            <Link
              href={`/states/${stateSlug}/${citySlug}`}
              className="text-gold hover:underline"
            >
              {provider.city}
            </Link>
          </h2>

          {relatedProviders.length > 0 ? (
            <div className="space-y-3">
              {relatedProviders.map((rp) => (
                <Link
                  key={rp.npi}
                  href={`/provider/${rp.npi}`}
                  className="group flex items-center justify-between rounded-xl border border-dark-50/50 bg-dark-400/30 p-4 hover:border-gold/20 hover:bg-dark-400/50 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 flex-shrink-0">
                      <Shield className="h-5 w-5 text-gold/60" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold group-hover:text-gold transition-colors truncate">
                        Dr. {rp.first_name} {rp.last_name}
                        {rp.credential && (
                          <span className="text-[var(--text-secondary)] font-normal ml-1.5 text-sm">
                            {rp.credential}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        NPI {rp.npi} &middot;{" "}
                        {formatNumber(rp.total_beneficiaries)} patients
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    <span className="text-sm font-mono font-semibold text-gold hidden sm:block">
                      {formatCurrency(rp.total_medicare_payment)}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-gold transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              No other {provider.specialty} providers found in {provider.city}.
            </p>
          )}

          {/* Fallback link to city page */}
          {relatedProviders.length < 3 && (
            <Link
              href={`/states/${stateSlug}/${citySlug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-gold transition-colors"
            >
              View all providers in {provider.city}, {provider.state}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </section>

        {/* ── Internal Links ─────────────────────────────── */}
        <section className="mb-10 border-t border-dark-50/50 pt-8">
          <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
            Explore More
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/specialties/${specSlug}`}
              className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors"
            >
              {provider.specialty} Benchmarks →
            </Link>
            <Link
              href={`/states/${stateSlug}/${citySlug}`}
              className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors"
            >
              Providers in {provider.city} →
            </Link>
            <Link
              href={`/states/${stateSlug}`}
              className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors"
            >
              {stateName} Overview →
            </Link>
          </div>
        </section>

        {/* ── Score Badge Embed ──────────────────────────── */}
        {scoreResult && (
          <section className="mb-10">
            <ScoreBadgeEmbed npi={npi} score={scoreResult.overall} />
          </section>
        )}

        {/* ── CTA ────────────────────────────────────────── */}
        <ScanCTA providerName={fullName} />

        {/* ── Footer Note ────────────────────────────────── */}
        <div className="mt-8 mb-4 rounded-lg border border-dark-50/50 bg-dark-300/30 p-4 text-center">
          <p className="text-xs text-[var(--text-secondary)]">
            Data sourced from CMS Medicare Physician &amp; Other Practitioners
            public dataset. All information shown is publicly available
            government data. This page does not contain any protected health
            information (PHI).
          </p>
        </div>
      </div>
    </>
  );
}
