import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Heart,
  Activity,
  Clipboard,
  Brain,
  Users,
  MapPin,
  FileText,
  Stethoscope,
  Building2,
  UserPlus,
  Scissors,
  LineChart,
  type LucideIcon,
} from "lucide-react";
import {
  getNationalStats,
  getAllBenchmarks,
  getTopCodes,
  getAllStates,
  getTopProvidersByPayment,
  formatCurrency,
  formatNumber,
  specialtyToSlug,
  stateToSlug,
} from "@/lib/db-queries";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StatCard } from "@/components/seo/stat-card";
import { ProviderTable } from "@/components/seo/provider-table";
import { ScanCTA } from "@/components/seo/scan-cta";
import { RelatedLinks as SiteRelatedLinks } from "@/components/seo/related-links";
import { InlineScanner } from "@/components/seo/inline-scanner";
import { DataCoverage } from "@/components/seo/data-coverage";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // ISR: cache at runtime for 24 hours

// ── Insight config map ──────────────────────────────────────

interface InsightConfig {
  title: string;
  description: string;
  icon: LucideIcon;
}

const INSIGHTS: Record<string, InsightConfig> = {
  "medicare-billing-overview": {
    title: "Medicare Billing Overview",
    description: "A national summary of Medicare billing activity including total providers, services, payments, and code utilization across the entire CMS dataset.",
    icon: BarChart3,
  },
  "highest-paying-specialties": {
    title: "Highest-Paying Specialties",
    description: "Ranking of medical specialties by average Medicare payment per provider, revealing which specialties generate the highest reimbursement volumes.",
    icon: DollarSign,
  },
  "most-common-billing-codes": {
    title: "Most Common Billing Codes",
    description: "The top CPT/HCPCS codes billed to Medicare by total service volume, showing which procedures and services dominate the healthcare landscape.",
    icon: FileText,
  },
  "ccm-adoption-rates": {
    title: "CCM Adoption Rates by Specialty",
    description: "Analysis of Chronic Care Management (CPT 99490) adoption across specialties, identifying which provider types are capturing this high-value revenue stream.",
    icon: Heart,
  },
  "rpm-adoption-rates": {
    title: "RPM Adoption Rates by Specialty",
    description: "Remote Patient Monitoring program adoption patterns, showing which specialties lead in RPM billing and the associated revenue opportunity.",
    icon: Activity,
  },
  "awv-completion-rates": {
    title: "AWV Completion Rates by Specialty",
    description: "Annual Wellness Visit completion rates across specialties, highlighting the gap between current adoption and the recommended 70%+ target.",
    icon: Clipboard,
  },
  "bhi-screening-rates": {
    title: "BHI Screening Rates by Specialty",
    description: "Behavioral Health Integration (CPT 99484) screening rates across specialties, revealing the largely untapped opportunity in mental health services.",
    icon: Brain,
  },
  "em-coding-patterns": {
    title: "E&M Coding Patterns by Specialty",
    description: "Evaluation and Management code distribution (99213, 99214, 99215) across specialties, identifying potential undercoding and revenue optimization opportunities.",
    icon: BarChart3,
  },
  "medicare-revenue-by-state": {
    title: "Medicare Revenue by State",
    description: "State-by-state breakdown of Medicare provider counts, total payments, and average payments, revealing geographic variations in healthcare spending.",
    icon: MapPin,
  },
  "revenue-gap-by-specialty": {
    title: "Revenue Gap by Specialty",
    description: "Estimated missed revenue from care management programs (CCM, RPM, BHI, AWV) by specialty, quantifying the opportunity for each provider type.",
    icon: TrendingUp,
  },
  "top-billing-providers": {
    title: "Top Billing Providers Nationally",
    description: "The highest-volume Medicare providers in the country ranked by total payment, providing insight into the upper end of billing activity.",
    icon: Users,
  },
  "rural-vs-urban-billing": {
    title: "Rural vs Urban Billing Patterns",
    description: "Comparing Medicare billing patterns between states with higher rural populations and those with predominantly urban providers.",
    icon: Building2,
  },
  "new-patient-vs-established": {
    title: "New Patient vs Established Visits",
    description: "Analysis of new patient E&M codes (99201-99205) versus established patient codes (99211-99215) to understand patient acquisition patterns.",
    icon: UserPlus,
  },
  "procedure-vs-evaluation": {
    title: "Procedure vs Evaluation Services",
    description: "The balance between procedural billing and evaluation/management services across specialties, showing which specialties are procedure-heavy.",
    icon: Scissors,
  },
  "medicare-payment-trends": {
    title: "Medicare Payment Distribution Analysis",
    description: "Analysis of payment distribution patterns across providers, identifying high-value codes and the concentration of Medicare spending.",
    icon: LineChart,
  },
};

const VALID_SLUGS = Object.keys(INSIGHTS);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = INSIGHTS[slug];
  if (!config) return { title: "Insight Not Found | NPIxray" };

  return {
    title: `${config.title} — Medicare Data Report | NPIxray`,
    description: config.description,
    alternates: {
      canonical: `https://npixray.com/insights/${slug}`,
    },
    openGraph: {
      title: `${config.title} | NPIxray`,
      description: config.description,
    },
  };
}

// ── Shared types for pre-fetched data ───────────────────────

type Benchmarks = Awaited<ReturnType<typeof getAllBenchmarks>>;
type States = Awaited<ReturnType<typeof getAllStates>>;
type Codes = Awaited<ReturnType<typeof getTopCodes>>;
type NationalStats = Awaited<ReturnType<typeof getNationalStats>>;
type TopProviders = Awaited<ReturnType<typeof getTopProvidersByPayment>>;

// ── Helper: CSS bar ──────────────────────────────────────

function Bar({ value, max, color = "bg-[#2F5EA8]" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full bg-[var(--bg)] rounded-full h-3">
      <div
        className={`${color} h-3 rounded-full transition-all`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Related links helper ──────────────────────────────────

function RelatedLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <section className="border-t border-[var(--border-light)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg font-semibold mb-4">Related Pages</h2>
        <div className="flex flex-wrap gap-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg border border-[var(--border-light)] bg-white px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[#2F5EA8] hover:border-[#2F5EA8]/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Content renderers (all receive pre-fetched data as props) ──

function MedicareBillingOverview({ stats, benchmarks, codes }: { stats: NationalStats; benchmarks: Benchmarks; codes: Codes }) {
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <StatCard label="Total Providers" value={stats ? formatNumber(stats.totalProviders) : "N/A"} icon={Users} />
        <StatCard label="Total Payment" value={stats ? formatCurrency(stats.totalPayment) : "N/A"} icon={DollarSign} />
        <StatCard label="Total Services" value={stats ? formatNumber(stats.totalServices) : "N/A"} icon={Activity} />
        <StatCard label="Specialties Tracked" value={String(benchmarks.length)} icon={Stethoscope} />
      </div>
      <h3 className="text-lg font-semibold mb-4">Top 10 Billing Codes by Volume</h3>
      <div className="overflow-x-auto rounded-xl border border-[var(--border-light)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-light)] bg-white">
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Code</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Services</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Avg Payment</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c, i) => (
              <tr key={c.hcpcs_code} className={`border-b border-[var(--border-light)] ${i % 2 === 0 ? "bg-white" : ""}`}>
                <td className="px-4 py-3"><Link href={`/codes/${c.hcpcs_code}`} className="text-[#2F5EA8] hover:text-[#264D8C] font-mono">{c.hcpcs_code}</Link></td>
                <td className="px-4 py-3 text-right tabular-nums">{formatNumber(c.totalServices)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-[#2F5EA8]">{formatCurrency(c.avgPayment)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RelatedLinks links={[
        { href: "/codes", label: "All Billing Codes" },
        { href: "/specialties", label: "All Specialties" },
        { href: "/states", label: "All States" },
      ]} />
    </>
  );
}

function HighestPayingSpecialties({ benchmarks }: { benchmarks: Benchmarks }) {
  const sorted = [...benchmarks].sort((a, b) => b.avg_total_payment - a.avg_total_payment);
  const maxPayment = sorted[0]?.avg_total_payment ?? 1;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        <StatCard label="Specialties Analyzed" value={String(sorted.length)} icon={Stethoscope} />
        <StatCard label="Highest Avg Payment" value={sorted[0] ? formatCurrency(sorted[0].avg_total_payment) : "N/A"} icon={DollarSign} sub={sorted[0]?.specialty} />
        <StatCard label="Total Providers" value={formatNumber(sorted.reduce((s, b) => s + b.provider_count, 0))} icon={Users} />
      </div>
      <h3 className="text-lg font-semibold mb-4">Specialties Ranked by Average Medicare Payment</h3>
      <div className="space-y-3 max-w-3xl">
        {sorted.map((b, i) => (
          <div key={b.specialty} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/specialties/${specialtyToSlug(b.specialty)}`} className="text-sm font-semibold hover:text-[#2F5EA8] transition-colors">
                <span className="text-[#2F5EA8]/40 font-mono mr-2">#{i + 1}</span>
                {b.specialty}
              </Link>
              <span className="text-sm font-bold font-mono text-[#2F5EA8]">{formatCurrency(b.avg_total_payment)}</span>
            </div>
            <Bar value={b.avg_total_payment} max={maxPayment} />
            <p className="text-xs text-[var(--text-secondary)] mt-2">{formatNumber(b.provider_count)} providers</p>
          </div>
        ))}
      </div>
      <RelatedLinks links={[
        { href: "/specialties", label: "All Specialties" },
        { href: "/insights/revenue-gap-by-specialty", label: "Revenue Gap by Specialty" },
        { href: "/insights/em-coding-patterns", label: "E&M Coding Patterns" },
      ]} />
    </>
  );
}

function MostCommonBillingCodes({ codes }: { codes: Codes }) {
  const maxServices = codes[0]?.totalServices ?? 1;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        <StatCard label="Codes Shown" value="25" icon={FileText} />
        <StatCard label="Top Code" value={codes[0]?.hcpcs_code ?? "N/A"} icon={BarChart3} sub={`${formatNumber(codes[0]?.totalServices ?? 0)} services`} />
        <StatCard label="Total Services" value={formatNumber(codes.reduce((s, c) => s + c.totalServices, 0))} icon={Activity} />
      </div>
      <h3 className="text-lg font-semibold mb-4">Top 25 Codes by Service Volume</h3>
      <div className="space-y-3 max-w-3xl">
        {codes.map((c, i) => (
          <div key={c.hcpcs_code} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/codes/${c.hcpcs_code}`} className="font-mono text-sm font-semibold hover:text-[#2F5EA8] transition-colors">
                <span className="text-[#2F5EA8]/40 mr-2">#{i + 1}</span>
                {c.hcpcs_code}
              </Link>
              <span className="text-sm font-bold font-mono text-[#2F5EA8]">{formatNumber(c.totalServices)} svc</span>
            </div>
            <Bar value={c.totalServices} max={maxServices} />
            <p className="text-xs text-[var(--text-secondary)] mt-2">{formatNumber(c.totalProviders)} providers | {formatCurrency(c.avgPayment)} avg/svc</p>
          </div>
        ))}
      </div>
      <RelatedLinks links={[
        { href: "/codes", label: "All Billing Codes" },
        { href: "/insights/medicare-billing-overview", label: "Medicare Overview" },
      ]} />
    </>
  );
}

function CcmAdoptionRates({ benchmarks }: { benchmarks: Benchmarks }) {
  const sorted = [...benchmarks].sort((a, b) => b.ccm_adoption_rate - a.ccm_adoption_rate);
  const avgRate = sorted.reduce((s, b) => s + b.ccm_adoption_rate, 0) / sorted.length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        <StatCard label="Avg CCM Adoption" value={`${(avgRate * 100).toFixed(1)}%`} icon={Heart} sub="across all specialties" />
        <StatCard label="Highest Adoption" value={`${(sorted[0]?.ccm_adoption_rate * 100).toFixed(1)}%`} icon={TrendingUp} sub={sorted[0]?.specialty} />
        <StatCard label="Target Rate" value="15%" icon={Clipboard} sub="industry benchmark" />
      </div>
      <h3 className="text-lg font-semibold mb-4">CCM Adoption by Specialty</h3>
      <div className="space-y-3 max-w-3xl">
        {sorted.map((b) => (
          <div key={b.specialty} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/specialties/${specialtyToSlug(b.specialty)}`} className="text-sm font-semibold hover:text-[#2F5EA8] transition-colors">{b.specialty}</Link>
              <span className="text-sm font-bold font-mono text-[#2F5EA8]">{(b.ccm_adoption_rate * 100).toFixed(1)}%</span>
            </div>
            <Bar value={b.ccm_adoption_rate} max={0.15} color="bg-rose-400" />
            <p className="text-xs text-[var(--text-secondary)] mt-2">{formatNumber(b.provider_count)} providers | Target: 15%</p>
          </div>
        ))}
      </div>
      <RelatedLinks links={[
        { href: "/insights/rpm-adoption-rates", label: "RPM Adoption Rates" },
        { href: "/insights/awv-completion-rates", label: "AWV Completion Rates" },
        { href: "/insights/bhi-screening-rates", label: "BHI Screening Rates" },
        { href: "/guides/ccm-billing-99490", label: "CCM Billing Guide" },
      ]} />
    </>
  );
}

function RpmAdoptionRates({ benchmarks }: { benchmarks: Benchmarks }) {
  const sorted = [...benchmarks].sort((a, b) => b.rpm_adoption_rate - a.rpm_adoption_rate);
  const avgRate = sorted.reduce((s, b) => s + b.rpm_adoption_rate, 0) / sorted.length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        <StatCard label="Avg RPM Adoption" value={`${(avgRate * 100).toFixed(1)}%`} icon={Activity} sub="across all specialties" />
        <StatCard label="Highest Adoption" value={`${(sorted[0]?.rpm_adoption_rate * 100).toFixed(1)}%`} icon={TrendingUp} sub={sorted[0]?.specialty} />
        <StatCard label="Target Rate" value="10%" icon={Clipboard} sub="industry benchmark" />
      </div>
      <h3 className="text-lg font-semibold mb-4">RPM Adoption by Specialty</h3>
      <div className="space-y-3 max-w-3xl">
        {sorted.map((b) => (
          <div key={b.specialty} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/specialties/${specialtyToSlug(b.specialty)}`} className="text-sm font-semibold hover:text-[#2F5EA8] transition-colors">{b.specialty}</Link>
              <span className="text-sm font-bold font-mono text-[#2F5EA8]">{(b.rpm_adoption_rate * 100).toFixed(1)}%</span>
            </div>
            <Bar value={b.rpm_adoption_rate} max={0.10} color="bg-blue-400" />
            <p className="text-xs text-[var(--text-secondary)] mt-2">{formatNumber(b.provider_count)} providers | Target: 10%</p>
          </div>
        ))}
      </div>
      <RelatedLinks links={[
        { href: "/insights/ccm-adoption-rates", label: "CCM Adoption Rates" },
        { href: "/insights/awv-completion-rates", label: "AWV Completion Rates" },
        { href: "/guides/rpm-billing-99453-99458", label: "RPM Billing Guide" },
      ]} />
    </>
  );
}

function AwvCompletionRates({ benchmarks }: { benchmarks: Benchmarks }) {
  const sorted = [...benchmarks].sort((a, b) => b.awv_adoption_rate - a.awv_adoption_rate);
  const avgRate = sorted.reduce((s, b) => s + b.awv_adoption_rate, 0) / sorted.length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        <StatCard label="Avg AWV Rate" value={`${(avgRate * 100).toFixed(1)}%`} icon={Clipboard} sub="across all specialties" />
        <StatCard label="Highest Rate" value={`${(sorted[0]?.awv_adoption_rate * 100).toFixed(1)}%`} icon={TrendingUp} sub={sorted[0]?.specialty} />
        <StatCard label="Target Rate" value="70%" icon={Clipboard} sub="recommended benchmark" />
      </div>
      <h3 className="text-lg font-semibold mb-4">AWV Completion by Specialty</h3>
      <div className="space-y-3 max-w-3xl">
        {sorted.map((b) => (
          <div key={b.specialty} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/specialties/${specialtyToSlug(b.specialty)}`} className="text-sm font-semibold hover:text-[#2F5EA8] transition-colors">{b.specialty}</Link>
              <span className="text-sm font-bold font-mono text-[#2F5EA8]">{(b.awv_adoption_rate * 100).toFixed(1)}%</span>
            </div>
            <Bar value={b.awv_adoption_rate} max={0.70} color="bg-emerald-400" />
            <p className="text-xs text-[var(--text-secondary)] mt-2">{formatNumber(b.provider_count)} providers | Target: 70%</p>
          </div>
        ))}
      </div>
      <RelatedLinks links={[
        { href: "/insights/ccm-adoption-rates", label: "CCM Adoption Rates" },
        { href: "/insights/bhi-screening-rates", label: "BHI Screening Rates" },
        { href: "/guides/awv-billing-g0438-g0439", label: "AWV Billing Guide" },
      ]} />
    </>
  );
}

function BhiScreeningRates({ benchmarks }: { benchmarks: Benchmarks }) {
  const sorted = [...benchmarks].sort((a, b) => b.bhi_adoption_rate - a.bhi_adoption_rate);
  const avgRate = sorted.reduce((s, b) => s + b.bhi_adoption_rate, 0) / sorted.length;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        <StatCard label="Avg BHI Rate" value={`${(avgRate * 100).toFixed(1)}%`} icon={Brain} sub="across all specialties" />
        <StatCard label="Highest Rate" value={`${(sorted[0]?.bhi_adoption_rate * 100).toFixed(1)}%`} icon={TrendingUp} sub={sorted[0]?.specialty} />
        <StatCard label="Target Rate" value="10%" icon={Clipboard} sub="industry benchmark" />
      </div>
      <h3 className="text-lg font-semibold mb-4">BHI Screening by Specialty</h3>
      <div className="space-y-3 max-w-3xl">
        {sorted.map((b) => (
          <div key={b.specialty} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/specialties/${specialtyToSlug(b.specialty)}`} className="text-sm font-semibold hover:text-[#2F5EA8] transition-colors">{b.specialty}</Link>
              <span className="text-sm font-bold font-mono text-[#2F5EA8]">{(b.bhi_adoption_rate * 100).toFixed(1)}%</span>
            </div>
            <Bar value={b.bhi_adoption_rate} max={0.10} color="bg-purple-400" />
            <p className="text-xs text-[var(--text-secondary)] mt-2">{formatNumber(b.provider_count)} providers | Target: 10%</p>
          </div>
        ))}
      </div>
      <RelatedLinks links={[
        { href: "/insights/ccm-adoption-rates", label: "CCM Adoption Rates" },
        { href: "/insights/awv-completion-rates", label: "AWV Completion Rates" },
        { href: "/guides/bhi-billing-99484", label: "BHI Billing Guide" },
      ]} />
    </>
  );
}

function EmCodingPatterns({ benchmarks }: { benchmarks: Benchmarks }) {
  const sorted = [...benchmarks].sort((a, b) => b.pct_99214 - a.pct_99214);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-12">
        <StatCard label="Code 99213" value="Level 3" icon={BarChart3} sub="low complexity" />
        <StatCard label="Code 99214" value="Level 4" icon={BarChart3} sub="moderate complexity" />
        <StatCard label="Code 99215" value="Level 5" icon={BarChart3} sub="high complexity" />
      </div>
      <h3 className="text-lg font-semibold mb-4">E&M Distribution by Specialty</h3>
      <div className="space-y-4 max-w-3xl">
        {sorted.map((b) => {
          const total = b.pct_99213 + b.pct_99214 + b.pct_99215;
          const p13 = total > 0 ? (b.pct_99213 / total) * 100 : 0;
          const p14 = total > 0 ? (b.pct_99214 / total) * 100 : 0;
          const p15 = total > 0 ? (b.pct_99215 / total) * 100 : 0;
          return (
            <div key={b.specialty} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
              <Link href={`/specialties/${specialtyToSlug(b.specialty)}`} className="text-sm font-semibold hover:text-[#2F5EA8] transition-colors block mb-3">{b.specialty}</Link>
              {/* Stacked bar */}
              <div className="w-full h-6 rounded-full overflow-hidden flex bg-[var(--bg)]">
                <div className="bg-amber-500 h-full" style={{ width: `${p13}%` }} title={`99213: ${p13.toFixed(0)}%`} />
                <div className="bg-[#2F5EA8] h-full" style={{ width: `${p14}%` }} title={`99214: ${p14.toFixed(0)}%`} />
                <div className="bg-emerald-500 h-full" style={{ width: `${p15}%` }} title={`99215: ${p15.toFixed(0)}%`} />
              </div>
              <div className="flex gap-4 mt-2 text-xs text-[var(--text-secondary)]">
                <span><span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1" />99213: {p13.toFixed(0)}%</span>
                <span><span className="inline-block w-2 h-2 rounded-full bg-[#2F5EA8] mr-1" />99214: {p14.toFixed(0)}%</span>
                <span><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1" />99215: {p15.toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <RelatedLinks links={[
        { href: "/specialties", label: "All Specialties" },
        { href: "/insights/revenue-gap-by-specialty", label: "Revenue Gap by Specialty" },
        { href: "/guides/em-coding-optimization", label: "E&M Coding Guide" },
      ]} />
    </>
  );
}

function MedicareRevenueByState({ states }: { states: States }) {
  const sorted = [...states].sort((a, b) => b.totalPayment - a.totalPayment);
  const maxPayment = sorted[0]?.totalPayment ?? 1;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        <StatCard label="States Tracked" value={String(sorted.length)} icon={MapPin} />
        <StatCard label="Total Payment" value={formatCurrency(sorted.reduce((s, st) => s + st.totalPayment, 0))} icon={DollarSign} />
        <StatCard label="Total Providers" value={formatNumber(sorted.reduce((s, st) => s + st.totalProviders, 0))} icon={Users} />
      </div>
      <h3 className="text-lg font-semibold mb-4">States Ranked by Total Medicare Payment</h3>
      <div className="space-y-3 max-w-3xl">
        {sorted.slice(0, 25).map((st, i) => (
          <div key={st.state} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/states/${stateToSlug(st.state)}`} className="text-sm font-semibold hover:text-[#2F5EA8] transition-colors">
                <span className="text-[#2F5EA8]/40 font-mono mr-2">#{i + 1}</span>
                {st.state}
              </Link>
              <span className="text-sm font-bold font-mono text-[#2F5EA8]">{formatCurrency(st.totalPayment)}</span>
            </div>
            <Bar value={st.totalPayment} max={maxPayment} />
            <p className="text-xs text-[var(--text-secondary)] mt-2">{formatNumber(st.totalProviders)} providers | {formatCurrency(st.avgPayment)} avg/provider</p>
          </div>
        ))}
      </div>
      <RelatedLinks links={[
        { href: "/states", label: "All States" },
        { href: "/insights/rural-vs-urban-billing", label: "Rural vs Urban Billing" },
      ]} />
    </>
  );
}

function RevenueGapBySpecialty({ benchmarks }: { benchmarks: Benchmarks }) {
  // Estimate revenue gap from care management underadoption
  const withGap = benchmarks.map((b) => {
    const ccmGap = Math.max(0.15 - b.ccm_adoption_rate, 0) * b.avg_medicare_patients * 62;
    const rpmGap = Math.max(0.10 - b.rpm_adoption_rate, 0) * b.avg_medicare_patients * 55;
    const bhiGap = Math.max(0.10 - b.bhi_adoption_rate, 0) * b.avg_medicare_patients * 48;
    const awvGap = Math.max(0.70 - b.awv_adoption_rate, 0) * b.avg_medicare_patients * 175;
    return { ...b, estimatedGap: ccmGap + rpmGap + bhiGap + awvGap };
  }).sort((a, b) => b.estimatedGap - a.estimatedGap);
  const maxGap = withGap[0]?.estimatedGap ?? 1;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        <StatCard label="Highest Gap" value={formatCurrency(withGap[0]?.estimatedGap ?? 0)} icon={TrendingUp} sub={withGap[0]?.specialty} />
        <StatCard label="Avg Gap" value={formatCurrency(withGap.reduce((s, b) => s + b.estimatedGap, 0) / withGap.length)} icon={DollarSign} sub="per provider" />
        <StatCard label="Specialties" value={String(withGap.length)} icon={Stethoscope} />
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-2xl">
        Estimated annual missed revenue per provider from care management program
        underadoption (CCM, RPM, BHI, AWV) based on specialty benchmarks and
        patient panel size.
      </p>
      <h3 className="text-lg font-semibold mb-4">Estimated Revenue Gap by Specialty</h3>
      <div className="space-y-3 max-w-3xl">
        {withGap.map((b, i) => (
          <div key={b.specialty} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/specialties/${specialtyToSlug(b.specialty)}`} className="text-sm font-semibold hover:text-[#2F5EA8] transition-colors">
                <span className="text-[#2F5EA8]/40 font-mono mr-2">#{i + 1}</span>
                {b.specialty}
              </Link>
              <span className="text-sm font-bold font-mono text-[#2F5EA8]">{formatCurrency(b.estimatedGap)}/yr</span>
            </div>
            <Bar value={b.estimatedGap} max={maxGap} />
          </div>
        ))}
      </div>
      <RelatedLinks links={[
        { href: "/specialties", label: "All Specialties" },
        { href: "/insights/ccm-adoption-rates", label: "CCM Adoption Rates" },
        { href: "/insights/highest-paying-specialties", label: "Highest-Paying Specialties" },
      ]} />
    </>
  );
}

function TopBillingProviders({ providers }: { providers: TopProviders }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-12">
        <StatCard label="Providers Shown" value="50" icon={Users} sub="highest Medicare payment" />
        <StatCard label="Top Provider Payment" value={providers[0] ? formatCurrency(providers[0].total_medicare_payment) : "N/A"} icon={DollarSign} />
      </div>
      <h3 className="text-lg font-semibold mb-4">Top 50 Providers by Medicare Payment</h3>
      <ProviderTable providers={providers} showCity={true} showSpecialty={true} />
      <RelatedLinks links={[
        { href: "/specialties", label: "Browse by Specialty" },
        { href: "/states", label: "Browse by State" },
        { href: "/insights/highest-paying-specialties", label: "Highest-Paying Specialties" },
      ]} />
    </>
  );
}

function RuralVsUrbanBilling({ states }: { states: States }) {
  // Proxy: states with fewer providers tend to be more rural
  const sorted = [...states].sort((a, b) => a.totalProviders - b.totalProviders);
  const rural = sorted.slice(0, Math.floor(sorted.length / 2));
  const urban = sorted.slice(Math.floor(sorted.length / 2));

  const ruralAvg = rural.reduce((s, st) => s + st.avgPayment, 0) / rural.length;
  const urbanAvg = urban.reduce((s, st) => s + st.avgPayment, 0) / urban.length;
  const ruralProviders = rural.reduce((s, st) => s + st.totalProviders, 0);
  const urbanProviders = urban.reduce((s, st) => s + st.totalProviders, 0);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <StatCard label="Rural States" value={String(rural.length)} icon={Building2} sub="lower provider density" />
        <StatCard label="Urban States" value={String(urban.length)} icon={Building2} sub="higher provider density" />
        <StatCard label="Rural Avg Payment" value={formatCurrency(ruralAvg)} icon={DollarSign} sub="per provider" />
        <StatCard label="Urban Avg Payment" value={formatCurrency(urbanAvg)} icon={DollarSign} sub="per provider" />
      </div>
      <h3 className="text-lg font-semibold mb-4">Comparison: Lower vs Higher Provider Density States</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mb-8">
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <h4 className="font-semibold mb-3">Lower Density States</h4>
          <p className="text-2xl font-bold font-mono text-[#2F5EA8] mb-1">{formatCurrency(ruralAvg)}</p>
          <p className="text-xs text-[var(--text-secondary)]">avg payment/provider</p>
          <p className="text-xs text-[var(--text-secondary)] mt-2">{formatNumber(ruralProviders)} total providers</p>
        </div>
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <h4 className="font-semibold mb-3">Higher Density States</h4>
          <p className="text-2xl font-bold font-mono text-[#2F5EA8] mb-1">{formatCurrency(urbanAvg)}</p>
          <p className="text-xs text-[var(--text-secondary)]">avg payment/provider</p>
          <p className="text-xs text-[var(--text-secondary)] mt-2">{formatNumber(urbanProviders)} total providers</p>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-4">All States by Provider Count</h3>
      <div className="overflow-x-auto rounded-xl border border-[var(--border-light)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-light)] bg-white">
              <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">State</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Providers</th>
              <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Avg Payment</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((st, i) => (
              <tr key={st.state} className={`border-b border-[var(--border-light)] ${i % 2 === 0 ? "bg-white" : ""}`}>
                <td className="px-4 py-3"><Link href={`/states/${stateToSlug(st.state)}`} className="text-[#2F5EA8] hover:text-[#264D8C]">{st.state}</Link></td>
                <td className="px-4 py-3 text-right tabular-nums">{formatNumber(st.totalProviders)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-[#2F5EA8]">{formatCurrency(st.avgPayment)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <RelatedLinks links={[
        { href: "/states", label: "All States" },
        { href: "/insights/medicare-revenue-by-state", label: "Revenue by State" },
      ]} />
    </>
  );
}

function NewPatientVsEstablished({ codes }: { codes: Codes }) {
  // Find new patient codes (99201-99205) and established (99211-99215)
  const newPatientCodes = ["99201", "99202", "99203", "99204", "99205"];
  const estPatientCodes = ["99211", "99212", "99213", "99214", "99215"];

  const newPatient = codes.filter((c) => newPatientCodes.includes(c.hcpcs_code));
  const established = codes.filter((c) => estPatientCodes.includes(c.hcpcs_code));

  const newTotal = newPatient.reduce((s, c) => s + c.totalServices, 0);
  const estTotal = established.reduce((s, c) => s + c.totalServices, 0);
  const grandTotal = newTotal + estTotal;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        <StatCard label="New Patient Services" value={formatNumber(newTotal)} icon={UserPlus} sub={grandTotal > 0 ? `${((newTotal / grandTotal) * 100).toFixed(1)}% of E&M` : ""} />
        <StatCard label="Established Services" value={formatNumber(estTotal)} icon={Users} sub={grandTotal > 0 ? `${((estTotal / grandTotal) * 100).toFixed(1)}% of E&M` : ""} />
        <StatCard label="Total E&M Services" value={formatNumber(grandTotal)} icon={Activity} />
      </div>
      <h3 className="text-lg font-semibold mb-4">New Patient Codes</h3>
      <div className="space-y-3 max-w-3xl mb-8">
        {newPatient.map((c) => (
          <div key={c.hcpcs_code} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/codes/${c.hcpcs_code}`} className="font-mono text-sm font-semibold hover:text-[#2F5EA8] transition-colors">{c.hcpcs_code}</Link>
              <span className="text-sm font-bold font-mono text-[#2F5EA8]">{formatNumber(c.totalServices)}</span>
            </div>
            <Bar value={c.totalServices} max={estTotal > 0 ? established[0]?.totalServices ?? 1 : 1} color="bg-emerald-400" />
            <p className="text-xs text-[var(--text-secondary)] mt-2">{formatCurrency(c.avgPayment)} avg/svc | {formatNumber(c.totalProviders)} providers</p>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-semibold mb-4">Established Patient Codes</h3>
      <div className="space-y-3 max-w-3xl">
        {established.map((c) => (
          <div key={c.hcpcs_code} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/codes/${c.hcpcs_code}`} className="font-mono text-sm font-semibold hover:text-[#2F5EA8] transition-colors">{c.hcpcs_code}</Link>
              <span className="text-sm font-bold font-mono text-[#2F5EA8]">{formatNumber(c.totalServices)}</span>
            </div>
            <Bar value={c.totalServices} max={established[0]?.totalServices ?? 1} />
            <p className="text-xs text-[var(--text-secondary)] mt-2">{formatCurrency(c.avgPayment)} avg/svc | {formatNumber(c.totalProviders)} providers</p>
          </div>
        ))}
      </div>
      <RelatedLinks links={[
        { href: "/codes", label: "All Billing Codes" },
        { href: "/insights/em-coding-patterns", label: "E&M Coding Patterns" },
      ]} />
    </>
  );
}

function ProcedureVsEvaluation({ benchmarks }: { benchmarks: Benchmarks }) {
  // Use avg_total_services vs E&M percentages as a proxy
  const sorted = [...benchmarks].sort((a, b) => {
    const aEmPct = a.pct_99213 + a.pct_99214 + a.pct_99215;
    const bEmPct = b.pct_99213 + b.pct_99214 + b.pct_99215;
    return aEmPct - bEmPct; // Lower E&M % = more procedural
  });

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-12">
        <StatCard label="Most Procedural" value={sorted[0]?.specialty ?? "N/A"} icon={Scissors} sub="lowest E&M percentage" />
        <StatCard label="Most E&M Heavy" value={sorted[sorted.length - 1]?.specialty ?? "N/A"} icon={BarChart3} sub="highest E&M percentage" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-2xl">
        Specialties with lower E&M percentages tend to be more procedure-oriented,
        while those with higher percentages focus primarily on evaluation and management visits.
      </p>
      <h3 className="text-lg font-semibold mb-4">Specialties by E&M Concentration</h3>
      <div className="space-y-3 max-w-3xl">
        {sorted.map((b) => {
          const emPct = b.pct_99213 + b.pct_99214 + b.pct_99215;
          const emDisplay = (emPct * 100).toFixed(0);
          return (
            <div key={b.specialty} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <Link href={`/specialties/${specialtyToSlug(b.specialty)}`} className="text-sm font-semibold hover:text-[#2F5EA8] transition-colors">{b.specialty}</Link>
                <span className="text-sm font-bold font-mono text-[#2F5EA8]">{emDisplay}% E&M</span>
              </div>
              <Bar value={emPct} max={1} />
              <p className="text-xs text-[var(--text-secondary)] mt-2">{formatNumber(b.provider_count)} providers | {formatCurrency(b.avg_total_payment)} avg payment</p>
            </div>
          );
        })}
      </div>
      <RelatedLinks links={[
        { href: "/insights/em-coding-patterns", label: "E&M Coding Patterns" },
        { href: "/specialties", label: "All Specialties" },
      ]} />
    </>
  );
}

function MedicarePaymentTrends({ codes, benchmarks }: { codes: Codes; benchmarks: Benchmarks }) {
  // Payment distribution analysis
  const highValueCodes = codes.filter((c) => c.avgPayment > 200);
  const midValueCodes = codes.filter((c) => c.avgPayment >= 50 && c.avgPayment <= 200);
  const lowValueCodes = codes.filter((c) => c.avgPayment < 50);

  const sortedBenchmarks = [...benchmarks].sort((a, b) => b.avg_total_payment - a.avg_total_payment);

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-12">
        <StatCard label="High Value Codes" value={String(highValueCodes.length)} icon={DollarSign} sub="> $200/service" />
        <StatCard label="Mid Value Codes" value={String(midValueCodes.length)} icon={DollarSign} sub="$50 - $200/service" />
        <StatCard label="Low Value Codes" value={String(lowValueCodes.length)} icon={DollarSign} sub="< $50/service" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-2xl">
        Analysis of payment distribution patterns across the top 50 Medicare billing codes,
        categorized by average payment per service.
      </p>
      {highValueCodes.length > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-4">High-Value Codes (&gt; $200/service)</h3>
          <div className="space-y-3 max-w-3xl mb-8">
            {highValueCodes.map((c) => (
              <div key={c.hcpcs_code} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/codes/${c.hcpcs_code}`} className="font-mono text-sm font-semibold hover:text-[#2F5EA8] transition-colors">{c.hcpcs_code}</Link>
                  <span className="text-sm font-bold font-mono text-[#2F5EA8]">{formatCurrency(c.avgPayment)}/svc</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{formatNumber(c.totalServices)} services | {formatNumber(c.totalProviders)} providers</p>
              </div>
            ))}
          </div>
        </>
      )}
      <h3 className="text-lg font-semibold mb-4">Payment by Specialty (Avg per Provider)</h3>
      <div className="space-y-3 max-w-3xl">
        {sortedBenchmarks.slice(0, 10).map((b, i) => (
          <div key={b.specialty} className="rounded-xl border border-[var(--border-light)] bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <Link href={`/specialties/${specialtyToSlug(b.specialty)}`} className="text-sm font-semibold hover:text-[#2F5EA8] transition-colors">
                <span className="text-[#2F5EA8]/40 font-mono mr-2">#{i + 1}</span>
                {b.specialty}
              </Link>
              <span className="text-sm font-bold font-mono text-[#2F5EA8]">{formatCurrency(b.avg_total_payment)}</span>
            </div>
            <Bar value={b.avg_total_payment} max={sortedBenchmarks[0]?.avg_total_payment ?? 1} />
          </div>
        ))}
      </div>
      <RelatedLinks links={[
        { href: "/codes", label: "All Billing Codes" },
        { href: "/insights/highest-paying-specialties", label: "Highest-Paying Specialties" },
        { href: "/insights/most-common-billing-codes", label: "Most Common Codes" },
      ]} />
    </>
  );
}

// ── Render router (receives pre-fetched data) ───────────────

function InsightContent({
  slug,
  benchmarks,
  states,
  codes10,
  codes25,
  codes50,
  codes200,
  nationalStats,
  topProviders,
}: {
  slug: string;
  benchmarks: Benchmarks;
  states: States;
  codes10: Codes;
  codes25: Codes;
  codes50: Codes;
  codes200: Codes;
  nationalStats: NationalStats;
  topProviders: TopProviders;
}) {
  switch (slug) {
    case "medicare-billing-overview":
      return <MedicareBillingOverview stats={nationalStats} benchmarks={benchmarks} codes={codes10} />;
    case "highest-paying-specialties":
      return <HighestPayingSpecialties benchmarks={benchmarks} />;
    case "most-common-billing-codes":
      return <MostCommonBillingCodes codes={codes25} />;
    case "ccm-adoption-rates":
      return <CcmAdoptionRates benchmarks={benchmarks} />;
    case "rpm-adoption-rates":
      return <RpmAdoptionRates benchmarks={benchmarks} />;
    case "awv-completion-rates":
      return <AwvCompletionRates benchmarks={benchmarks} />;
    case "bhi-screening-rates":
      return <BhiScreeningRates benchmarks={benchmarks} />;
    case "em-coding-patterns":
      return <EmCodingPatterns benchmarks={benchmarks} />;
    case "medicare-revenue-by-state":
      return <MedicareRevenueByState states={states} />;
    case "revenue-gap-by-specialty":
      return <RevenueGapBySpecialty benchmarks={benchmarks} />;
    case "top-billing-providers":
      return <TopBillingProviders providers={topProviders} />;
    case "rural-vs-urban-billing":
      return <RuralVsUrbanBilling states={states} />;
    case "new-patient-vs-established":
      return <NewPatientVsEstablished codes={codes200} />;
    case "procedure-vs-evaluation":
      return <ProcedureVsEvaluation benchmarks={benchmarks} />;
    case "medicare-payment-trends":
      return <MedicarePaymentTrends codes={codes50} benchmarks={benchmarks} />;
    default:
      return null;
  }
}

// ── Page component ─────────────────────────────────────────

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = INSIGHTS[slug];
  if (!config) notFound();

  const Icon = config.icon;

  // Pre-fetch ALL data at the async page level so sub-components
  // receive resolved data (not Promises). This fixes the missing-await
  // bug that caused 404s in production with Neon PostgreSQL.
  const [benchmarks, states, codes10, codes25, codes50, codes200, nationalStats, topProviders] = await Promise.all([
    getAllBenchmarks(),
    getAllStates(),
    getTopCodes(10),
    getTopCodes(25),
    getTopCodes(50),
    getTopCodes(200),
    getNationalStats(),
    getTopProvidersByPayment(50),
  ]);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Insights", href: "/insights" },
              { label: config.title },
            ]}
          />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.06]">
              <Icon className="h-6 w-6 text-[#2F5EA8]" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {config.title}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Medicare Data Report
              </p>
            </div>
          </div>

          <p className="mt-4 text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            {config.description}
          </p>
        </div>
      </section>

      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <InsightContent
            slug={slug}
            benchmarks={benchmarks}
            states={states}
            codes10={codes10}
            codes25={codes25}
            codes50={codes50}
            codes200={codes200}
            nationalStats={nationalStats}
            topProviders={topProviders}
          />
        </div>
      </section>

      {/* Site-Wide Related Links */}
      <SiteRelatedLinks pageType="insight" currentSlug={slug} />

      <section className="border-t border-[var(--border-light)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <InlineScanner />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <DataCoverage providerCount={nationalStats?.totalProviders ?? 0} />
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
