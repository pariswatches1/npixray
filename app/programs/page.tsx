import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Heart, Brain, CalendarCheck, FileCode, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { PROGRAM_HUBS } from "@/lib/program-data";

export const metadata: Metadata = {
  title: "Medicare Revenue Programs — CCM, RPM, AWV, BHI, E&M | NPIxray",
  description:
    "Explore Medicare revenue programs: Chronic Care Management (CCM), Remote Patient Monitoring (RPM), Annual Wellness Visits (AWV), Behavioral Health Integration (BHI), and E&M Coding Optimization. Billing codes, adoption data, and revenue calculators.",
  alternates: {
    canonical: "https://npixray.com/programs",
  },
  openGraph: {
    title: "Medicare Revenue Programs | NPIxray",
    description:
      "Complete guide to Medicare revenue programs with live adoption data, billing codes, and revenue calculators.",
  },
};

const PROGRAM_ICONS: Record<string, typeof Activity> = {
  ccm: Activity,
  rpm: Heart,
  awv: CalendarCheck,
  bhi: Brain,
  "em-coding": FileCode,
};

const PROGRAM_COLORS: Record<string, string> = {
  ccm: "text-emerald-400 border-emerald-400/20 bg-emerald-400/10",
  rpm: "text-blue-400 border-blue-400/20 bg-blue-400/10",
  awv: "text-amber-400 border-amber-400/20 bg-amber-400/10",
  bhi: "text-purple-400 border-purple-400/20 bg-purple-400/10",
  "em-coding": "text-gold border-gold/20 bg-gold/10",
};

export default function ProgramsIndexPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "Programs" }]} />

          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
              <Activity className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Medicare Revenue Programs
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Billing codes, adoption data &amp; calculators for every major program
              </p>
            </div>
          </div>

          <p className="text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            Most medical practices leave significant Medicare revenue on the table by not adopting
            care management programs. Explore each program below to see billing codes, eligibility
            criteria, live adoption data by state and specialty, and revenue calculators.
          </p>
        </div>
      </section>

      {/* Program Cards Grid */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROGRAM_HUBS.map((program) => {
              const Icon = PROGRAM_ICONS[program.slug] ?? Activity;
              const colorClasses = PROGRAM_COLORS[program.slug] ?? "text-gold border-gold/20 bg-gold/10";
              const [iconColor, borderColor, bgColor] = colorClasses.split(" ");

              return (
                <Link
                  key={program.slug}
                  href={`/programs/${program.slug}`}
                  className="group rounded-xl border border-dark-50/50 bg-dark-400/50 p-6 hover:border-gold/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${borderColor} ${bgColor}`}>
                      <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold group-hover:text-gold transition-colors">
                        {program.name}
                      </h2>
                      <p className="text-xs text-[var(--text-secondary)]">{program.fullName}</p>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
                    {program.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">
                      {program.billingCodes.length} billing code{program.billingCodes.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-sm text-gold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-dark-50/50 p-4">
              <h3 className="text-sm font-semibold text-gold mb-2">Billing Guides</h3>
              <ul className="space-y-1.5">
                {PROGRAM_HUBS.map((p) => (
                  <li key={p.slug}>
                    <Link href={p.guideLink} className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                      {p.name} Billing Guide →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-dark-50/50 p-4">
              <h3 className="text-sm font-semibold text-gold mb-2">Revenue Calculators</h3>
              <ul className="space-y-1.5">
                {PROGRAM_HUBS.filter((p) => p.calculatorLink).map((p) => (
                  <li key={p.slug}>
                    <Link href={p.calculatorLink!} className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                      {p.name} Calculator →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-dark-50/50 p-4">
              <h3 className="text-sm font-semibold text-gold mb-2">Data Insights</h3>
              <ul className="space-y-1.5">
                {PROGRAM_HUBS.filter((p) => p.insightLink).map((p) => (
                  <li key={p.slug}>
                    <Link href={p.insightLink!} className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                      {p.name} Adoption Data →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
