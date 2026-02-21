import type { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  MapPin,
  Stethoscope,
  Building2,
  ArrowRight,
  Crown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  getAllStates,
  stateAbbrToName,
  stateToSlug,
  formatNumber,
  formatCurrency,
} from "@/lib/db-queries";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { InlineScanner } from "@/components/seo/inline-scanner";
import { DataCoverage } from "@/components/seo/data-coverage";

export const revalidate = 86400; // ISR: cache at runtime for 24 hours

export const metadata: Metadata = {
  title: "Medicare Provider Rankings — Top Doctors by Revenue | NPIxray",
  description:
    "Explore Medicare provider rankings by state, specialty, and city. See top-earning providers, highest-revenue specialties, and leading healthcare markets across the U.S.",
  keywords: [
    "Medicare provider rankings",
    "top doctors by revenue",
    "highest paid Medicare providers",
    "top Medicare specialties",
    "healthcare provider rankings",
  ],
  alternates: {
    canonical: "https://npixray.com/rankings",
  },
  openGraph: {
    title: "Medicare Provider Rankings — Top Doctors by Revenue | NPIxray",
    description:
      "Explore Medicare provider rankings by state, specialty, and city. See top-earning providers and highest-revenue specialties.",
  },
};

export default async function RankingsHubPage() {
  const states = await getAllStates();

  const rankingCategories = [
    {
      title: "Top Providers by State",
      description:
        "See the top 100 highest-earning Medicare providers in each state, ranked by total Medicare payments.",
      icon: MapPin,
      href: null as string | null,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Top Specialties by Revenue",
      description:
        "Medical specialties ranked by average Medicare revenue per provider. See which specialties earn the most.",
      icon: Stethoscope,
      href: "/rankings/top-specialties",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Top Cities by Provider Count",
      description:
        "The 100 largest healthcare markets in the U.S. ranked by number of Medicare providers and average revenue.",
      icon: Building2,
      href: "/rankings/top-cities",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <Breadcrumbs items={[{ label: "Rankings" }]} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-1.5 mb-8">
              <Trophy className="h-3.5 w-3.5 text-[#2F5EA8]" />
              <span className="text-xs font-medium text-[#2F5EA8]">
                Medicare Provider Rankings
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Medicare Provider{" "}
              <span className="text-[#2F5EA8]">Rankings</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Explore top Medicare providers ranked by revenue, specialty, state,
              and city. Powered by real CMS billing data.
            </p>
          </div>
        </div>
      </section>

      {/* Ranking Categories */}
      <section className="pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rankingCategories.map((cat) => {
              const inner = (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${cat.bgColor}`}
                    >
                      <cat.icon className={`h-5 w-5 ${cat.color}`} />
                    </div>
                    <h2 className="text-lg font-semibold group-hover:text-[#2F5EA8] transition-colors">
                      {cat.title}
                    </h2>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {cat.description}
                  </p>
                  {cat.href && (
                    <div className="mt-4 flex items-center gap-1 text-sm text-[#2F5EA8]">
                      View rankings
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </>
              );

              if (cat.href) {
                return (
                  <Link
                    key={cat.title}
                    href={cat.href}
                    className="group rounded-xl border border-[var(--border-light)] bg-white p-6 hover:border-[#2F5EA8]/15 hover:shadow-lg hover:shadow-[#2F5EA8]/[0.04] transition-all"
                  >
                    {inner}
                  </Link>
                );
              }

              return (
                <div
                  key={cat.title}
                  className="rounded-xl border border-[var(--border-light)] bg-white p-6"
                >
                  {inner}
                  <p className="mt-4 text-xs text-[var(--text-secondary)]">
                    Select a state below
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Providers by State */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Crown className="h-5 w-5 text-[#2F5EA8]" />
            <h2 className="text-2xl font-bold">
              Top Providers <span className="text-[#2F5EA8]">by State</span>
            </h2>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Click any state to see the top 100 highest-earning Medicare providers.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {states.map((s) => {
              const name = stateAbbrToName(s.state);
              const slug = stateToSlug(s.state);
              return (
                <Link
                  key={s.state}
                  href={`/rankings/top-providers/${slug}`}
                  className="group rounded-lg border border-[var(--border-light)] bg-white p-3 hover:border-[#2F5EA8]/15 hover:shadow-md hover:shadow-[#2F5EA8]/[0.04] transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-[var(--text-secondary)]">
                      {s.state}
                    </span>
                    <ArrowRight className="h-3 w-3 text-[var(--text-secondary)] group-hover:text-[#2F5EA8] transition-colors" />
                  </div>
                  <p className="text-sm font-semibold group-hover:text-[#2F5EA8] transition-colors truncate">
                    {name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] font-mono mt-1">
                    {formatNumber(s.totalProviders)} providers
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">
            More <span className="text-[#2F5EA8]">Rankings</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <Link
              href="/rankings/top-specialties"
              className="group flex items-center gap-4 rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/15 transition-all"
            >
              <TrendingUp className="h-5 w-5 text-[#2F5EA8] flex-shrink-0" />
              <div>
                <p className="font-semibold group-hover:text-[#2F5EA8] transition-colors">
                  Top Specialties by Revenue
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Specialties ranked by avg Medicare payment
                </p>
              </div>
            </Link>
            <Link
              href="/rankings/top-cities"
              className="group flex items-center gap-4 rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/15 transition-all"
            >
              <Users className="h-5 w-5 text-[#2F5EA8] flex-shrink-0" />
              <div>
                <p className="font-semibold group-hover:text-[#2F5EA8] transition-colors">
                  Top Cities by Provider Count
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Largest healthcare markets in the U.S.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Inline Scanner */}
      <section className="border-t border-[var(--border-light)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <InlineScanner />
        </div>
      </section>

      {/* Data Coverage */}
      <section className="border-t border-[var(--border-light)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <DataCoverage providerCount={states.reduce((sum, s) => sum + s.totalProviders, 0)} />
        </div>
      </section>
    </>
  );
}
