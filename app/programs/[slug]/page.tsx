import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Heart,
  Brain,
  CalendarCheck,
  FileCode,
  MapPin,
  Stethoscope,
  BookOpen,
  Calculator,
  BarChart3,
  CheckCircle,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { DataCoverage } from "@/components/seo/data-coverage";
import { PROGRAM_HUBS, getAllProgramSlugs, getProgramHub } from "@/lib/program-data";
import {
  getProgramTopStates,
  getProgramTopSpecialties,
  stateAbbrToName,
  stateToSlug,
  specialtyToSlug,
  formatNumber,
} from "@/lib/db-queries";

export const revalidate = 86400; // ISR: revalidate daily

export async function generateStaticParams() {
  return getAllProgramSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = getProgramHub(slug);
  if (!program) return { title: "Not Found" };

  return {
    title: `${program.fullName} (${program.name}) — Billing Codes, Adoption Data & Calculator | NPIxray`,
    description: `${program.fullName} Medicare program: billing codes (${program.billingCodes.map((c) => c.code).join(", ")}), eligibility criteria, state adoption data, and revenue calculator. See which states and specialties lead in ${program.name} adoption.`,
    alternates: {
      canonical: `https://npixray.com/programs/${slug}`,
    },
    openGraph: {
      title: `${program.fullName} (${program.name}) | NPIxray`,
      description: `Explore ${program.name} billing codes, adoption rates by state and specialty, and revenue calculators.`,
    },
  };
}

const PROGRAM_ICONS: Record<string, typeof Activity> = {
  ccm: Activity,
  rpm: Heart,
  awv: CalendarCheck,
  bhi: Brain,
  "em-coding": FileCode,
};

export default async function ProgramHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = getProgramHub(slug);
  if (!program) notFound();

  const Icon = PROGRAM_ICONS[program.slug] ?? Activity;

  // Fetch live data for programs with a DB key (not em-coding)
  let topStates: { state: string; adoptionRate: number; providerCount: number; billerCount: number }[] = [];
  let topSpecialties: { specialty: string; adoptionRate: number; providerCount: number; billerCount: number }[] = [];

  if (program.dbKey) {
    [topStates, topSpecialties] = await Promise.all([
      getProgramTopStates(program.dbKey, 10),
      getProgramTopSpecialties(program.dbKey, 10),
    ]);
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Programs", href: "/programs" },
              { label: program.name },
            ]}
          />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <Icon className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {program.fullName}{" "}
                <span className="text-gold">({program.name})</span>
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Medicare billing codes, adoption data &amp; revenue calculator
              </p>
            </div>
          </div>

          <p className="text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            {program.description}
          </p>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className="border-t border-dark-50/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle className="h-5 w-5 text-gold" />
            <h2 className="text-2xl font-bold">Eligibility Criteria</h2>
          </div>
          <div className="rounded-xl border border-dark-50/50 bg-dark-400/50 p-6">
            <ul className="space-y-3">
              {program.eligibilityCriteria.map((criterion, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                  <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  {criterion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Billing Codes Table */}
      <section className="border-t border-dark-50/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-5 w-5 text-gold" />
            <h2 className="text-2xl font-bold">{program.name} Billing Codes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-50/50 text-left text-[var(--text-secondary)]">
                  <th className="pb-3 pr-4 font-medium">Code</th>
                  <th className="pb-3 pr-4 font-medium">Description</th>
                  <th className="pb-3 font-medium text-right">Medicare Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50/30">
                {program.billingCodes.map((code) => (
                  <tr key={code.code} className="hover:bg-dark-400/30">
                    <td className="py-3 pr-4">
                      <Link
                        href={`/codes/${code.code.toLowerCase()}`}
                        className="font-mono text-gold hover:underline"
                      >
                        {code.code}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-[var(--text-secondary)]">
                      {code.description}
                    </td>
                    <td className="py-3 text-right font-semibold text-white">
                      {code.rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Live Data: Top States */}
      {topStates.length > 0 && (
        <section className="border-t border-dark-50/50 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-gold" />
              <h2 className="text-2xl font-bold">
                Top States for {program.name} Adoption
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-50/50 text-left text-[var(--text-secondary)]">
                    <th className="pb-3 pr-4 font-medium">Rank</th>
                    <th className="pb-3 pr-4 font-medium">State</th>
                    <th className="pb-3 pr-4 font-medium text-right">Adoption Rate</th>
                    <th className="pb-3 pr-4 font-medium text-right">{program.name} Billers</th>
                    <th className="pb-3 font-medium text-right">Total Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50/30">
                  {topStates.map((row, i) => (
                    <tr key={row.state} className="hover:bg-dark-400/30">
                      <td className="py-3 pr-4 text-[var(--text-secondary)]">#{i + 1}</td>
                      <td className="py-3 pr-4">
                        <Link
                          href={`/states/${stateToSlug(row.state)}`}
                          className="text-gold hover:underline"
                        >
                          {stateAbbrToName(row.state)}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold text-white">
                        {(row.adoptionRate * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 pr-4 text-right text-[var(--text-secondary)]">
                        {formatNumber(row.billerCount)}
                      </td>
                      <td className="py-3 text-right text-[var(--text-secondary)]">
                        {formatNumber(row.providerCount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Live Data: Top Specialties */}
      {topSpecialties.length > 0 && (
        <section className="border-t border-dark-50/50 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope className="h-5 w-5 text-gold" />
              <h2 className="text-2xl font-bold">
                Top Specialties for {program.name} Adoption
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-dark-50/50 text-left text-[var(--text-secondary)]">
                    <th className="pb-3 pr-4 font-medium">Rank</th>
                    <th className="pb-3 pr-4 font-medium">Specialty</th>
                    <th className="pb-3 pr-4 font-medium text-right">Adoption Rate</th>
                    <th className="pb-3 pr-4 font-medium text-right">{program.name} Billers</th>
                    <th className="pb-3 font-medium text-right">Total Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50/30">
                  {topSpecialties.map((row, i) => (
                    <tr key={row.specialty} className="hover:bg-dark-400/30">
                      <td className="py-3 pr-4 text-[var(--text-secondary)]">#{i + 1}</td>
                      <td className="py-3 pr-4">
                        <Link
                          href={`/specialties/${specialtyToSlug(row.specialty)}`}
                          className="text-gold hover:underline"
                        >
                          {row.specialty}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-right font-semibold text-white">
                        {(row.adoptionRate * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 pr-4 text-right text-[var(--text-secondary)]">
                        {formatNumber(row.billerCount)}
                      </td>
                      <td className="py-3 text-right text-[var(--text-secondary)]">
                        {formatNumber(row.providerCount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Resource Links Grid */}
      <section className="border-t border-dark-50/50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">
            {program.name} Resources
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Guide */}
            <Link
              href={program.guideLink}
              className="group rounded-xl border border-dark-50/50 bg-dark-400/50 p-5 hover:border-gold/30 transition-all"
            >
              <BookOpen className="h-5 w-5 text-gold mb-3" />
              <h3 className="font-semibold text-sm group-hover:text-gold transition-colors">
                {program.name} Billing Guide
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Step-by-step billing guide with documentation requirements
              </p>
              <span className="text-xs text-gold flex items-center gap-1 mt-3 group-hover:gap-2 transition-all">
                Read guide <ArrowRight className="h-3 w-3" />
              </span>
            </Link>

            {/* Calculator */}
            {program.calculatorLink && (
              <Link
                href={program.calculatorLink}
                className="group rounded-xl border border-dark-50/50 bg-dark-400/50 p-5 hover:border-gold/30 transition-all"
              >
                <Calculator className="h-5 w-5 text-gold mb-3" />
                <h3 className="font-semibold text-sm group-hover:text-gold transition-colors">
                  {program.name} Revenue Calculator
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Estimate your potential {program.name} revenue
                </p>
                <span className="text-xs text-gold flex items-center gap-1 mt-3 group-hover:gap-2 transition-all">
                  Calculate <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            )}

            {/* Insight */}
            {program.insightLink && (
              <Link
                href={program.insightLink}
                className="group rounded-xl border border-dark-50/50 bg-dark-400/50 p-5 hover:border-gold/30 transition-all"
              >
                <BarChart3 className="h-5 w-5 text-gold mb-3" />
                <h3 className="font-semibold text-sm group-hover:text-gold transition-colors">
                  {program.name} Adoption Data
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  National adoption rates and trends
                </p>
                <span className="text-xs text-gold flex items-center gap-1 mt-3 group-hover:gap-2 transition-all">
                  View data <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            )}

            {/* Code Pages */}
            <div className="rounded-xl border border-dark-50/50 bg-dark-400/50 p-5">
              <FileText className="h-5 w-5 text-gold mb-3" />
              <h3 className="font-semibold text-sm">Code Pages</h3>
              <ul className="mt-2 space-y-1.5">
                {program.codePageLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-[var(--text-secondary)] hover:text-gold transition-colors"
                    >
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by State (top 5 states linked) */}
      {topStates.length > 0 && (
        <section className="border-t border-dark-50/50 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-4">
              Explore {program.name} by State
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              View {program.name} adoption and revenue data for top-adopting states
            </p>
            <div className="flex flex-wrap gap-2">
              {topStates.slice(0, 8).map((row) => (
                <Link
                  key={row.state}
                  href={`/states/${stateToSlug(row.state)}`}
                  className="rounded-lg border border-dark-50/50 px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-all"
                >
                  {stateAbbrToName(row.state)}{" "}
                  <span className="text-xs opacity-60">
                    ({(row.adoptionRate * 100).toFixed(0)}%)
                  </span>
                </Link>
              ))}
              <Link
                href="/states"
                className="rounded-lg border border-gold/20 bg-gold/5 px-4 py-2 text-sm text-gold hover:bg-gold/10 transition-all"
              >
                All 50 States →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Data Coverage */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <DataCoverage />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA specialty={program.fullName} />
      </section>
    </>
  );
}
