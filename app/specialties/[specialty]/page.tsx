import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Users, DollarSign, UserCheck, BarChart3, Heart, Activity, Brain, Clipboard } from "lucide-react";
import {
  getAllBenchmarks,
  getBenchmarkBySpecialty,
  getSpecialtyProviders,
  formatCurrency,
  formatNumber,
  specialtyToSlug,
} from "@/lib/db-queries";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StatCard } from "@/components/seo/stat-card";
import { ProviderTable } from "@/components/seo/provider-table";
import { ScanCTA } from "@/components/seo/scan-cta";

export const dynamic = 'force-dynamic';

async function findSpecialtyBySlug(slug: string) {
  const benchmarks = await getAllBenchmarks();
  return benchmarks.find((b) => specialtyToSlug(b.specialty) === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ specialty: string }>;
}): Promise<Metadata> {
  const { specialty: slug } = await params;
  const benchmark = await findSpecialtyBySlug(slug);
  if (!benchmark) return { title: "Specialty Not Found | NPIxray" };

  return {
    title: `${benchmark.specialty} Medicare Analysis — ${formatNumber(benchmark.provider_count)} Providers | NPIxray`,
    description: `Medicare revenue analysis for ${benchmark.specialty}: ${formatNumber(benchmark.provider_count)} providers, ${formatCurrency(benchmark.avg_total_payment)} avg payment, ${(benchmark.ccm_adoption_rate * 100).toFixed(0)}% CCM adoption. See E&M coding and care management data.`,
    openGraph: {
      title: `${benchmark.specialty} Medicare Analysis | NPIxray`,
      description: `National Medicare data for ${benchmark.specialty}: ${formatNumber(benchmark.provider_count)} providers with ${formatCurrency(benchmark.avg_total_payment)} average total payment.`,
    },
  };
}

export default async function SpecialtyPage({
  params,
}: {
  params: Promise<{ specialty: string }>;
}) {
  const { specialty: slug } = await params;
  const benchmark = await findSpecialtyBySlug(slug);
  if (!benchmark) notFound();

  const providers = await getSpecialtyProviders(benchmark.specialty, 50);

  // E&M distribution data
  const emTotal = benchmark.pct_99213 + benchmark.pct_99214 + benchmark.pct_99215;
  const emData = [
    { code: "99213", pct: benchmark.pct_99213, color: "bg-amber-500", label: "Level 3" },
    { code: "99214", pct: benchmark.pct_99214, color: "bg-gold", label: "Level 4" },
    { code: "99215", pct: benchmark.pct_99215, color: "bg-emerald-500", label: "Level 5" },
  ];

  // Program adoption data
  const programs = [
    { name: "CCM", fullName: "Chronic Care Management", rate: benchmark.ccm_adoption_rate, target: 0.15, icon: Heart, color: "text-rose-400" },
    { name: "RPM", fullName: "Remote Patient Monitoring", rate: benchmark.rpm_adoption_rate, target: 0.10, icon: Activity, color: "text-blue-400" },
    { name: "BHI", fullName: "Behavioral Health Integration", rate: benchmark.bhi_adoption_rate, target: 0.10, icon: Brain, color: "text-purple-400" },
    { name: "AWV", fullName: "Annual Wellness Visits", rate: benchmark.awv_adoption_rate, target: 0.70, icon: Clipboard, color: "text-emerald-400" },
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Specialties", href: "/specialties" },
              { label: benchmark.specialty },
            ]}
          />

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            {benchmark.specialty}
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Medicare Revenue Analysis
          </p>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Provider Count"
              value={formatNumber(benchmark.provider_count)}
              icon={Users}
            />
            <StatCard
              label="Avg Medicare Patients"
              value={formatNumber(benchmark.avg_medicare_patients)}
              icon={UserCheck}
            />
            <StatCard
              label="Avg Total Payment"
              value={formatCurrency(benchmark.avg_total_payment)}
              icon={DollarSign}
            />
            <StatCard
              label="Avg Revenue/Patient"
              value={formatCurrency(benchmark.avg_revenue_per_patient)}
              icon={DollarSign}
              sub="per Medicare beneficiary"
            />
          </div>
        </div>
      </section>

      {/* E&M Distribution */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">
            E&M Coding <span className="text-gold">Distribution</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-2xl">
            How {benchmark.specialty} providers distribute their E&M visits
            across complexity levels. Higher-level codes (99214, 99215)
            indicate more complex patient encounters.
          </p>

          <div className="max-w-2xl space-y-6">
            {emData.map((item) => {
              const pctDisplay = emTotal > 0
                ? ((item.pct / emTotal) * 100).toFixed(1)
                : (item.pct * 100).toFixed(1);
              const barWidth = emTotal > 0
                ? (item.pct / emTotal) * 100
                : item.pct * 100;
              return (
                <div key={item.code}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold font-mono">{item.code}</span>
                      <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                    </div>
                    <span className="text-lg font-bold font-mono text-gold">
                      {pctDisplay}%
                    </span>
                  </div>
                  <div className="w-full bg-dark-500 rounded-full h-4">
                    <div
                      className={`${item.color} h-4 rounded-full transition-all`}
                      style={{ width: `${Math.min(barWidth, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Program Adoption Rates */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">
            Program <span className="text-gold">Adoption Rates</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-2xl">
            Care management program adoption among {benchmark.specialty} providers
            compared to target benchmarks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {programs.map((program) => {
              const ratePct = (program.rate * 100).toFixed(1);
              const targetPct = (program.target * 100).toFixed(0);
              const fillPct = Math.min((program.rate / program.target) * 100, 100);
              return (
                <div
                  key={program.name}
                  className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <program.icon className={`h-5 w-5 ${program.color}`} />
                    <div>
                      <p className="font-semibold text-sm">{program.name}</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">
                        {program.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-dark-500 rounded-full h-3 mb-2">
                    <div
                      className="bg-gold h-3 rounded-full transition-all"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gold font-mono font-semibold">
                      {ratePct}%
                    </span>
                    <span className="text-[var(--text-secondary)]">
                      Target: {targetPct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Providers */}
      {providers.length > 0 && (
        <section className="border-t border-dark-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-2">
              Top <span className="text-gold">{benchmark.specialty}</span> Providers
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8">
              Top 50 {benchmark.specialty} providers by Medicare payment volume.
            </p>
            <ProviderTable
              providers={providers}
              showCity={true}
              showSpecialty={false}
            />
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
