import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Zap,
  ArrowLeft,
  TrendingUp,
  Users,
  BarChart3,
  Heart,
  Activity,
  Stethoscope,
  Brain,
  Building2,
} from "lucide-react";
import { getStateBySlug, getAllStateSlugs, type StateData } from "@/lib/state-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return { title: "State Not Found" };

  return {
    title: `Medicare Revenue Gaps in ${state.name} — ${state.totalProviders.toLocaleString()} Providers | NPIxray`,
    description: `${state.name} Medicare billing analysis: ${state.totalProviders.toLocaleString()} providers, $${(state.avgRevenueGap / 1000).toFixed(0)}K average revenue gap. Top cities: ${state.topCities.slice(0, 3).map((c) => c.city).join(", ")}. See E&M coding, CCM, RPM, and AWV data.`,
    openGraph: {
      title: `Medicare Revenue Gaps in ${state.name} | NPIxray`,
      description: `Explore Medicare billing data for ${state.totalProviders.toLocaleString()} providers in ${state.name}. Average missed revenue: $${state.avgRevenueGap.toLocaleString()}/year.`,
    },
  };
}

export function generateStaticParams() {
  return getAllStateSlugs().map((state) => ({ state }));
}

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatPct(n: number): string {
  return `${(n * 100).toFixed(0)}%`;
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();

  const gapItems = [
    {
      name: "E&M Coding Gap",
      value: state.avgCodingGap,
      icon: BarChart3,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      description: "Average undercoding gap from 99213→99214 shifts",
    },
    {
      name: "CCM Revenue Gap",
      value: Math.round(state.avgRevenueGap * 0.32),
      icon: Heart,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      description: `${formatPct(state.ccmAdoptionRate)} adoption rate — national benchmark: 15%`,
    },
    {
      name: "RPM Revenue Gap",
      value: Math.round(state.avgRevenueGap * 0.22),
      icon: Activity,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      description: `${formatPct(state.rpmAdoptionRate)} adoption rate — national benchmark: 8%`,
    },
    {
      name: "AWV Revenue Gap",
      value: Math.round(state.avgRevenueGap * 0.14),
      icon: Stethoscope,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      description: `${formatPct(state.awvCompletionRate)} completion rate — target: 70%+`,
    },
    {
      name: "BHI Revenue Gap",
      value: Math.round(state.avgRevenueGap * 0.08),
      icon: Brain,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      description: "Behavioral health integration opportunity",
    },
  ];

  return (
    <>
      {/* Breadcrumb + Header */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <nav className="mb-6">
            <Link
              href="/states"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-gold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All States
            </Link>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <MapPin className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {state.name}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Medicare Revenue Gap Analysis
              </p>
            </div>
          </div>

          {/* Key Stats Row */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-center">
              <p className="text-2xl font-bold font-mono text-gold">
                {formatNum(state.totalProviders)}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Medicare Providers
              </p>
            </div>
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-center">
              <p className="text-2xl font-bold font-mono text-gold">
                {formatNum(state.totalMedicareBeneficiaries)}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Beneficiaries
              </p>
            </div>
            <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-center">
              <p className="text-2xl font-bold font-mono text-gold">
                ${formatNum(state.avgRevenueGap)}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Avg Missed/Provider
              </p>
            </div>
            <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-4 text-center">
              <p className="text-2xl font-bold font-mono text-gold">
                ${formatNum(state.avgRevenueGap * state.totalProviders)}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Total State Gap
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Gap Breakdown */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Revenue Gap <span className="text-gold">Breakdown</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gapItems.map((gap) => (
              <div
                key={gap.name}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${gap.bgColor}`}>
                    <gap.icon className={`h-5 w-5 ${gap.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{gap.name}</h3>
                    <p className="text-lg font-bold font-mono text-gold">
                      ${formatNum(gap.value)}/yr
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {gap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Cities */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Top Cities in <span className="text-gold">{state.name}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {state.topCities.map((city, i) => (
              <div
                key={city.city}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-[var(--text-secondary)]" />
                  <span className="text-xs text-gold/50 font-mono">#{i + 1}</span>
                </div>
                <h3 className="font-semibold mb-1">{city.city}</h3>
                <p className="text-sm font-mono text-gold">
                  {city.providers.toLocaleString()} providers
                </p>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                  Est. gap: ${formatNum(Math.round(city.providers * state.avgRevenueGap * 0.85))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Specialties */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Top Specialties in <span className="text-gold">{state.name}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {state.topSpecialties.map((specialty, i) => {
              const slug = specialty
                .toLowerCase()
                .replace(/\//g, "-")
                .replace(/\s+/g, "-");
              return (
                <Link
                  key={specialty}
                  href={`/specialties/${slug}`}
                  className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 hover:border-gold/20 transition-colors"
                >
                  <span className="text-xs text-gold/50 font-mono">#{i + 1}</span>
                  <h3 className="font-semibold mt-1 group-hover:text-gold transition-colors">
                    {specialty}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    View national benchmarks →
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Care Management Adoption */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Care Management <span className="text-gold">Adoption</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
            {[
              { label: "CCM Adoption", rate: state.ccmAdoptionRate, target: 0.15, guide: "/guides/ccm-billing-99490" },
              { label: "RPM Adoption", rate: state.rpmAdoptionRate, target: 0.10, guide: "/guides/rpm-billing-99453-99458" },
              { label: "AWV Completion", rate: state.awvCompletionRate, target: 0.70, guide: "/guides/awv-billing-g0438-g0439" },
            ].map((item) => {
              const pct = item.rate * 100;
              const targetPct = item.target * 100;
              return (
                <Link
                  key={item.label}
                  href={item.guide}
                  className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 hover:border-gold/20 transition-colors"
                >
                  <p className="text-sm font-semibold mb-3 group-hover:text-gold transition-colors">
                    {item.label}
                  </p>
                  {/* Progress bar */}
                  <div className="w-full bg-dark-500 rounded-full h-3 mb-2">
                    <div
                      className="bg-gold h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(pct / targetPct * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gold font-mono font-semibold">
                      {pct.toFixed(0)}%
                    </span>
                    <span className="text-[var(--text-secondary)]">
                      Target: {targetPct.toFixed(0)}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related Guides */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold mb-4">Related Billing Guides</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/guides/ccm-billing-99490", label: "CCM Billing Guide" },
              { href: "/guides/rpm-billing-99453-99458", label: "RPM Billing Guide" },
              { href: "/guides/awv-billing-g0438-g0439", label: "AWV Billing Guide" },
              { href: "/guides/em-coding-optimization", label: "E&M Coding Guide" },
              { href: "/guides/bhi-billing-99484", label: "BHI Billing Guide" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Practice in {state.name}?{" "}
            <span className="text-gold">See Your Gaps</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            State averages show the opportunity. Scan your NPI for a
            personalized revenue analysis based on your specialty and billing
            patterns.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
          >
            <Zap className="h-5 w-5" />
            Scan Your NPI — Free
          </Link>
        </div>
      </section>
    </>
  );
}
