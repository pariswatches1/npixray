import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  Shield,
  Database,
  BarChart3,
  Brain,
  Lock,
  Eye,
  Globe,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Server,
  FileText,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About NPIxray — How We Turn Public CMS Data Into Revenue Intelligence",
  description:
    "Learn how NPIxray uses free CMS Medicare public data to help medical practices identify missed revenue in coding, CCM, RPM, BHI, and AWV programs. No patient data. No PHI.",
  openGraph: {
    title: "About NPIxray — AI Revenue Intelligence for Medical Practices",
    description:
      "NPIxray turns free CMS Medicare public data into actionable revenue intelligence. See exactly how much your practice is leaving on the table.",
  },
};

const METHODOLOGY_STEPS = [
  {
    step: "01",
    title: "NPI Lookup",
    description:
      "We query the NPPES Registry to identify the provider — name, specialty, location, and taxonomy code. This is the same free, public registry that CMS maintains for all healthcare providers.",
    icon: Globe,
  },
  {
    step: "02",
    title: "CMS Data Analysis",
    description:
      "We analyze the provider's Medicare billing patterns from the CMS Physician & Other Practitioners dataset — including every CPT code billed, service frequency, and payment amounts.",
    icon: Database,
  },
  {
    step: "03",
    title: "Specialty Benchmarking",
    description:
      "We compare the provider's billing patterns against specialty-specific benchmarks derived from the full CMS dataset — covering 1.2M+ providers and 10M+ billing records.",
    icon: BarChart3,
  },
  {
    step: "04",
    title: "Gap Identification",
    description:
      "Our engine identifies specific gaps in E&M coding, care management programs (CCM, RPM, BHI), and preventive services (AWV) — quantifying each opportunity in dollars.",
    icon: TrendingUp,
  },
  {
    step: "05",
    title: "Action Plan Generation",
    description:
      "We generate a prioritized 90-day roadmap ranked by revenue impact and implementation difficulty — so practices know exactly what to do first for the biggest return.",
    icon: Brain,
  },
];

const DATA_SOURCES = [
  {
    name: "NPPES NPI Registry",
    description:
      "Provider identification, specialty, location, and taxonomy codes. Updated monthly by CMS.",
    url: "https://npiregistry.cms.hhs.gov",
    records: "7M+ NPIs",
  },
  {
    name: "Medicare Physician & Other Practitioners",
    description:
      "Individual provider-level billing data — CPT codes, frequencies, charges, and payments. Published annually by CMS.",
    url: "https://data.cms.gov",
    records: "10M+ records",
  },
  {
    name: "Specialty Benchmarks",
    description:
      "National averages for E&M code distribution, care management adoption rates, and program revenue by specialty.",
    records: "15+ specialties",
  },
  {
    name: "Medicare Fee Schedule",
    description:
      "Official CMS reimbursement rates for all CPT/HCPCS codes used in revenue calculations.",
    records: "Updated annually",
  },
];

const TRUST_ITEMS = [
  {
    icon: Lock,
    title: "No Patient Data",
    description:
      "We never access, store, or process any Protected Health Information (PHI). Every data point comes from publicly available CMS datasets.",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description:
      "Our methodology is open. We show you exactly which benchmarks we use, how gaps are calculated, and where the data comes from.",
  },
  {
    icon: Shield,
    title: "HIPAA Non-Applicable",
    description:
      "Because we use only public CMS data (no PHI), HIPAA regulations do not apply to our scanner. No BAA required.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description:
      "Hosted on Vercel's enterprise infrastructure with HTTPS everywhere, encrypted storage, and SOC 2 compliant hosting.",
  },
];

const aboutFaqs = [
  { q: "What data does NPIxray use?", a: "NPIxray uses publicly available CMS Medicare Physician & Other Practitioners data — the same dataset published by the Centers for Medicare & Medicaid Services for transparency. This includes provider-level billing patterns, CPT codes, frequencies, and payment amounts. No patient data (PHI) is ever accessed." },
  { q: "How accurate are the revenue estimates?", a: "Revenue estimates are based on specialty benchmarks calculated from the full CMS dataset of 1.175M+ providers. While actual revenue depends on payer mix, patient panel, and documentation practices, our benchmarks represent real national averages — not surveys or projections." },
  { q: "Is NPIxray HIPAA compliant?", a: "HIPAA does not apply to NPIxray because we never access, store, or process Protected Health Information (PHI). All data used is publicly available government data published by CMS. No Business Associate Agreement (BAA) is needed." },
  { q: "Who built NPIxray?", a: "NPIxray was built by a team with deep experience in healthcare revenue cycle management, medical billing analytics, and health information technology. Our analysis uses the same CMS datasets relied upon by academic researchers and major healthcare consulting firms." },
  { q: "How often is the data updated?", a: "The underlying CMS Medicare Physician & Other Practitioners dataset is published annually by CMS. NPIxray processes each new release to update benchmarks, provider data, and specialty statistics. NPI Registry data is updated more frequently." },
  { q: "Can I use NPIxray for competitive analysis?", a: "Yes. Because NPIxray uses public CMS data, you can look up any provider's NPI to see their Medicare billing patterns. This is commonly used for competitive benchmarking, practice acquisition due diligence, and group practice performance comparisons." },
];

const aboutFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: aboutFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutFaqJsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <Zap className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                Built on Free Public Data
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
              Making Revenue Intelligence{" "}
              <span className="text-gold">Accessible</span> to Every Practice
            </h1>

            <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              NPIxray turns publicly available CMS Medicare data into
              actionable revenue intelligence. No expensive consultants, no
              lengthy audits — just enter an NPI and see exactly what you&apos;re
              missing.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
                The Problem We Solve
              </h2>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                <p>
                  The average medical practice leaves <span className="text-gold font-semibold">$50,000–$200,000 per year</span> in
                  uncaptured revenue — from undercoded E&M visits, unenrolled
                  care management programs, and missed preventive services.
                </p>
                <p>
                  Until now, discovering these gaps required expensive billing
                  consultants charging $10,000+ for audits, or months of manual
                  data analysis. Most practices simply never look — and never
                  know what they&apos;re missing.
                </p>
                <p>
                  NPIxray changes that. We built a platform that analyzes
                  publicly available CMS data to instantly show any provider
                  their revenue gaps — for free. No login required, no
                  consulting fees, no waiting.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gold/20 bg-gold/5 p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gold" />
                Why This Data Exists
              </h3>
              <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                <p>
                  CMS publishes detailed provider-level billing data as part of
                  its transparency initiative. The{" "}
                  <span className="text-white font-medium">
                    Medicare Physician & Other Practitioners
                  </span>{" "}
                  dataset includes every CPT code each provider bills, how
                  often, and how much they&apos;re paid.
                </p>
                <p>
                  This data is freely available to anyone at{" "}
                  <span className="text-gold">data.cms.gov</span>. We simply
                  built the intelligence layer on top — comparing individual
                  providers against specialty benchmarks to identify gaps.
                </p>
                <p>
                  No patient information is included. No PHI is ever accessed.
                  Just provider-level aggregate billing data that CMS made
                  public for exactly this kind of analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* E-E-A-T: Experience, Expertise, Authoritativeness */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
                Built by People Who Understand{" "}
                <span className="text-gold">Healthcare Revenue</span>
              </h2>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
                <p>
                  NPIxray was created by a team with deep experience in healthcare
                  revenue cycle management, medical billing analytics, and health
                  information technology. We&apos;ve spent years working with
                  practices that didn&apos;t know they were leaving money on the
                  table — and built NPIxray to fix that at scale.
                </p>
                <p>
                  Our analysis engine is grounded in the same CMS datasets used by
                  academic researchers, health policy analysts, and the largest
                  healthcare consulting firms. The difference: we make it free,
                  instant, and accessible to every practice in America.
                </p>
                <p>
                  Every benchmark, every revenue estimate, and every recommendation
                  is derived from real Medicare billing data — not surveys, not
                  estimates, not projections. When we say a specialty has an 8% CCM
                  adoption rate, that number comes from analyzing every provider in
                  that specialty across the entire CMS dataset.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  metric: "1,175,281",
                  label: "Medicare Providers Analyzed",
                  detail: "Every provider in the CMS dataset, across all 50 states and territories",
                },
                {
                  metric: "8,153,253",
                  label: "Billing Records Processed",
                  detail: "Individual provider-service line items with CPT codes, frequencies, and payments",
                },
                {
                  metric: "20",
                  label: "Specialty Benchmarks",
                  detail: "Full E&M distribution, program adoption rates, and revenue benchmarks per specialty",
                },
                {
                  metric: "50+",
                  label: "State-Level Reports",
                  detail: "City-level drill-downs, provider rankings, and specialty breakdowns per state",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 flex items-start gap-4"
                >
                  <span className="text-xl font-bold font-mono text-gold flex-shrink-0 w-24 text-right">
                    {item.metric}
                  </span>
                  <div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Our <span className="text-gold">Methodology</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Every NPIxray scan follows a five-step analysis pipeline that
              transforms raw CMS data into prioritized revenue opportunities.
            </p>
          </div>

          <div className="space-y-6 max-w-3xl mx-auto">
            {METHODOLOGY_STEPS.map((step, i) => (
              <div
                key={i}
                className="flex gap-5 rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 hover:border-gold/20 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
                    <step.icon className="h-5 w-5 text-gold" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gold/50">
                      Step {step.step}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Data <span className="text-gold">Sources</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              Every number in an NPIxray report is derived from authoritative
              CMS datasets. Here&apos;s exactly where the data comes from.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {DATA_SOURCES.map((source) => (
              <div
                key={source.name}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{source.name}</h3>
                  <span className="text-[10px] font-mono font-semibold text-gold px-2 py-0.5 rounded-full bg-gold/10">
                    {source.records}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {source.description}
                </p>
                {source.url && (
                  <p className="mt-2 text-xs text-gold/60">{source.url}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Privacy */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Trust & <span className="text-gold">Privacy</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              We take data privacy seriously. NPIxray is designed from the
              ground up to use only public data — never patient information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/20 bg-gold/10">
                    <item.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "1.2M+", label: "Providers Indexed" },
              { value: "10M+", label: "Billing Records" },
              { value: "15+", label: "Specialties Covered" },
              { value: "$0", label: "Cost to Scan" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-gold">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — for Google AI Overviews */}
      <section className="border-t border-dark-50/50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Frequently Asked <span className="text-gold">Questions</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "What data does NPIxray use?",
                a: "NPIxray uses publicly available CMS Medicare Physician & Other Practitioners data — the same dataset published by the Centers for Medicare & Medicaid Services for transparency. This includes provider-level billing patterns, CPT codes, frequencies, and payment amounts. No patient data (PHI) is ever accessed.",
              },
              {
                q: "How accurate are the revenue estimates?",
                a: "Revenue estimates are based on specialty benchmarks calculated from the full CMS dataset of 1.175M+ providers. While actual revenue depends on payer mix, patient panel, and documentation practices, our benchmarks represent real national averages — not surveys or projections.",
              },
              {
                q: "Is NPIxray HIPAA compliant?",
                a: "HIPAA does not apply to NPIxray because we never access, store, or process Protected Health Information (PHI). All data used is publicly available government data published by CMS. No Business Associate Agreement (BAA) is needed.",
              },
              {
                q: "Who built NPIxray?",
                a: "NPIxray was built by a team with deep experience in healthcare revenue cycle management, medical billing analytics, and health information technology. Our analysis uses the same CMS datasets relied upon by academic researchers and major healthcare consulting firms.",
              },
              {
                q: "How often is the data updated?",
                a: "The underlying CMS Medicare Physician & Other Practitioners dataset is published annually by CMS. NPIxray processes each new release to update benchmarks, provider data, and specialty statistics. NPI Registry data is updated more frequently.",
              },
              {
                q: "Can I use NPIxray for competitive analysis?",
                a: "Yes. Because NPIxray uses public CMS data, you can look up any provider's NPI to see their Medicare billing patterns. This is commonly used for competitive benchmarking, practice acquisition due diligence, and group practice performance comparisons.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6"
              >
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/30 p-6 max-w-3xl mx-auto">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-[var(--text-secondary)]" />
              Important Disclaimer
            </h3>
            <div className="text-xs text-[var(--text-secondary)] leading-relaxed space-y-2">
              <p>
                NPIxray revenue estimates are illustrative projections based on
                publicly available CMS Medicare data and specialty benchmarks.
                Actual revenue will vary based on payer mix, patient panel
                composition, documentation practices, and local market factors.
              </p>
              <p>
                NPIxray does not provide medical, legal, or financial advice.
                Revenue estimates should be validated with your billing team and
                compliance officer before making operational changes. All CPT
                codes and reimbursement rates are based on national Medicare
                averages and may differ by locality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Ready to See Your{" "}
            <span className="text-gold">Revenue Gaps</span>?
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            Enter any NPI number to get an instant, free revenue analysis.
            No login, no credit card, no strings attached.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
            >
              <Zap className="h-5 w-5" />
              Scan Your NPI — Free
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 rounded-xl border border-dark-50 px-8 py-4 text-base font-semibold text-[var(--text-secondary)] transition-all hover:border-gold/30 hover:text-gold"
            >
              Browse Billing Guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
