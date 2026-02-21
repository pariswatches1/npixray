import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Users, DollarSign, ArrowRight, Activity } from "lucide-react";
import { getAllStates, stateAbbrToName, stateToSlug, formatCurrency, formatNumber } from "@/lib/db-queries";

export const revalidate = 86400; // ISR: cache at runtime for 24 hours

export const metadata: Metadata = {
  title: "Medicare Provider Analysis by State — All 50 States | NPIxray",
  description:
    "Explore Medicare provider data for every U.S. state. See provider counts, total Medicare payments, average payments per provider, and drill into city and specialty breakdowns.",
  keywords: [
    "Medicare providers by state",
    "state Medicare billing data",
    "Medicare provider statistics",
    "state healthcare analytics",
    "Medicare payment data",
  ],
  alternates: {
    canonical: "https://npixray.com/states",
  },
  openGraph: {
    title: "Medicare Provider Analysis by State — All 50 States | NPIxray",
    description:
      "Explore Medicare provider data for every U.S. state. Provider counts, total payments, and average reimbursement by state.",
  },
};

export default async function StatesIndexPage() {
  const states = await getAllStates();

  const totalProviders = states.reduce((sum, s) => sum + s.totalProviders, 0);
  const totalPayment = states.reduce((sum, s) => sum + s.totalPayment, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-1.5 mb-8">
              <MapPin className="h-3.5 w-3.5 text-[#2F5EA8]" />
              <span className="text-xs font-medium text-[#2F5EA8]">
                All 50 States + Territories
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Medicare Provider Data{" "}
              <span className="text-[#2F5EA8]">by State</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Explore provider-level Medicare billing data for every state.
              See provider counts, total payments, and drill into cities and specialties.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="mt-12 grid grid-cols-2 gap-6 max-w-md mx-auto">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-[#2F5EA8]">
                {formatNumber(totalProviders)}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Total Providers
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-[#2F5EA8]">
                {formatCurrency(totalPayment)}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Total Medicare Payments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* State Grid */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Sorted by provider count &mdash; {states.length} states and territories
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {states.map((s) => {
              const name = stateAbbrToName(s.state);
              const slug = stateToSlug(s.state);
              return (
                <Link
                  key={s.state}
                  href={`/states/${slug}`}
                  className="group rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/15 hover:shadow-lg hover:shadow-[#2F5EA8]/[0.04] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h2 className="font-semibold group-hover:text-[#2F5EA8] transition-colors">
                        {name}
                      </h2>
                      <span className="text-xs text-[var(--text-secondary)] font-mono">
                        {s.state}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[#2F5EA8] group-hover:translate-x-0.5 transition-all mt-1" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-[var(--bg)]/50 p-2">
                      <p className="text-sm font-bold font-mono text-[#2F5EA8]">
                        {formatNumber(s.totalProviders)}
                      </p>
                      <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                        Providers
                      </p>
                    </div>
                    <div className="rounded-lg bg-[var(--bg)]/50 p-2">
                      <p className="text-sm font-bold font-mono text-[#2F5EA8]">
                        {formatCurrency(s.totalPayment)}
                      </p>
                      <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                        Total $
                      </p>
                    </div>
                    <div className="rounded-lg bg-[var(--bg)]/50 p-2">
                      <p className="text-sm font-bold font-mono text-[#2F5EA8]">
                        {formatCurrency(s.avgPayment)}
                      </p>
                      <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                        Avg/Prov
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border-light)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Find Your Practice&apos;s{" "}
            <span className="text-[#2F5EA8]">Revenue Gap</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            State-level data shows the big picture. Scan your NPI to see your
            specific revenue opportunities.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2F5EA8] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/10"
          >
            <Activity className="h-5 w-5" />
            Scan Your NPI &mdash; Free
          </Link>
        </div>
      </section>
    </>
  );
}
