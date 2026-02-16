import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Zap, ArrowRight, TrendingUp, Users } from "lucide-react";
import { getAllStates } from "@/lib/state-data";

export const metadata: Metadata = {
  title: "Medicare Revenue Gaps by State — All 50 States | NPIxray",
  description:
    "Explore Medicare billing data and revenue gap analysis for every state. See provider counts, top specialties, average missed revenue, and care management adoption rates.",
  keywords: [
    "Medicare revenue by state",
    "state Medicare billing data",
    "healthcare revenue gaps",
    "Medicare provider statistics",
    "state healthcare analytics",
  ],
  openGraph: {
    title: "Medicare Revenue Gaps by State | NPIxray",
    description:
      "Explore Medicare billing data and revenue gap analysis for all 50 states. See how much revenue practices are leaving on the table.",
  },
};

export default function StatesIndexPage() {
  const states = getAllStates();

  const totalProviders = states.reduce((sum, s) => sum + s.totalProviders, 0);
  const avgGap = Math.round(
    states.reduce((sum, s) => sum + s.avgRevenueGap, 0) / states.length
  );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <MapPin className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                All 50 States
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Medicare Revenue Gaps{" "}
              <span className="text-gold">by State</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Explore provider-level Medicare billing data for every state.
              See how revenue gaps vary by geography, specialty mix, and care management adoption.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-gold">
                {(totalProviders / 1000).toFixed(0)}K+
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Providers
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-gold">50</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                States
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-gold">
                ${(avgGap / 1000).toFixed(0)}K
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Avg Gap
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* State Grid */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/states/${state.slug}`}
                className="group rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-semibold group-hover:text-gold transition-colors">
                      {state.name}
                    </h2>
                    <span className="text-xs text-[var(--text-secondary)] font-mono">
                      {state.abbr}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-gold group-hover:translate-x-0.5 transition-all mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-lg bg-dark-500/50 p-2">
                    <p className="text-sm font-bold font-mono text-gold">
                      {(state.totalProviders / 1000).toFixed(1)}K
                    </p>
                    <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                      Providers
                    </p>
                  </div>
                  <div className="rounded-lg bg-dark-500/50 p-2">
                    <p className="text-sm font-bold font-mono text-gold">
                      ${(state.avgRevenueGap / 1000).toFixed(0)}K
                    </p>
                    <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                      Avg Gap
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-[10px] text-[var(--text-secondary)] truncate">
                  Top: {state.topSpecialties.slice(0, 3).join(", ")}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Find Your Practice&apos;s{" "}
            <span className="text-gold">Revenue Gap</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            State-level data shows the big picture. Scan your NPI to see your
            specific revenue opportunities.
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
