import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  BarChart3,
  Users,
  Check,
  ArrowRight,
  Shield,
  Star,
  Minus,
  Database,
  Wrench,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { TrackPageView } from "@/components/analytics/track-pageview";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "NPIxray pricing plans — from free NPI scans to full care management platform. Capture missed revenue at every level.",
  alternates: {
    canonical: "https://npixray.com/pricing",
  },
};

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description:
      "Start with a free NPI scan — see exactly what revenue you're missing in 30 seconds. No signup, no credit card, no strings.",
    icon: Zap,
    cta: "Scan Now",
    ctaHref: "/",
    highlight: false,
    features: [
      "Unlimited NPI scans",
      "E&M coding gap analysis",
      "CCM / RPM / BHI / AWV gap estimates",
      "90-day action plan roadmap",
      "Specialty benchmark comparisons",
      "AI Revenue Coach",
      "Shareable report link",
    ],
  },
  {
    name: "Intelligence",
    price: "$99",
    period: "/month",
    description:
      "Go deeper with patient-level data. Upload your own billing CSV for AI-powered coding recommendations and monthly benchmark tracking.",
    icon: BarChart3,
    cta: "Get Started",
    ctaHref: "#",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Everything in Free, plus:",
      "CSV billing data upload & analysis",
      "Patient-level eligibility lists",
      "AI-powered coding recommendations",
      "Monthly benchmark tracking",
      "MIPS quality score dashboard",
      "Payer performance analytics",
      "Email & PDF report exports",
      "Priority support",
    ],
  },
  {
    name: "Care Management",
    price: "$299\u2013699",
    period: "/month",
    description:
      "Full-stack care management platform with CCM, RPM, BHI, and AWV modules — plus a dedicated implementation manager.",
    icon: Users,
    cta: "Contact Sales",
    ctaHref: "#",
    highlight: false,
    features: [
      "Everything in Intelligence, plus:",
      "CCM module (care plans, time tracking, billing)",
      "RPM module (device integration, vitals monitoring)",
      "BHI module (screening, care coordination)",
      "AWV module (HRA forms, visit workflows)",
      "AI documentation & coding optimizer",
      "Automated billing submission",
      "Dedicated implementation manager",
      "Staff training & onboarding",
    ],
  },
];

const COMPARISON_FEATURES: {
  feature: string;
  free: boolean;
  intelligence: boolean;
  care: boolean;
}[] = [
  { feature: "NPI Revenue Scans", free: true, intelligence: true, care: true },
  { feature: "E&M Coding Analysis", free: true, intelligence: true, care: true },
  { feature: "CCM/RPM/BHI/AWV Gaps", free: true, intelligence: true, care: true },
  { feature: "90-Day Action Plan", free: true, intelligence: true, care: true },
  { feature: "Specialty Benchmarks", free: true, intelligence: true, care: true },
  { feature: "AI Revenue Coach", free: true, intelligence: true, care: true },
  { feature: "CSV Billing Upload", free: false, intelligence: true, care: true },
  { feature: "Patient Eligibility Lists", free: false, intelligence: true, care: true },
  { feature: "AI Coding Recommendations", free: false, intelligence: true, care: true },
  { feature: "MIPS Quality Tracker", free: false, intelligence: true, care: true },
  { feature: "Payer Analytics", free: false, intelligence: true, care: true },
  { feature: "PDF Report Exports", free: false, intelligence: true, care: true },
  { feature: "CCM Module", free: false, intelligence: false, care: true },
  { feature: "RPM Module", free: false, intelligence: false, care: true },
  { feature: "BHI/AWV Modules", free: false, intelligence: false, care: true },
  { feature: "AI Documentation Optimizer", free: false, intelligence: false, care: true },
  { feature: "Dedicated Manager", free: false, intelligence: false, care: true },
  { feature: "Staff Training", free: false, intelligence: false, care: true },
];

const FAQS = [
  {
    q: "Is the Free NPI scan really free?",
    a: "Yes, 100% free. No credit card, no login, no limits. Scan as many NPIs as you want.",
  },
  {
    q: "Where does the data come from?",
    a: "We use public CMS Medicare Physician & Other Practitioners data — the same dataset CMS publishes for transparency. No patient data is used.",
  },
  {
    q: "How accurate are the revenue estimates?",
    a: "Estimates are based on specialty benchmarks and national Medicare averages. Your actual numbers will depend on payer mix, patient panel, and documentation practices.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no cancellation fees. Cancel your subscription at any time from your dashboard.",
  },
  {
    q: "What if I don't have Medicare patients?",
    a: "NPIxray's free tools work for any provider with an NPI number. While revenue estimates are based on Medicare data, the E&M coding analysis and practice benchmarks are valuable for any payer mix.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. NPIxray is 100% web-based. There's nothing to download, install, or integrate. The free tier works instantly — just enter an NPI number.",
  },
  {
    q: "How is this different from my billing software?",
    a: "Your billing software tells you what you billed. NPIxray tells you what you should have billed. We compare your coding patterns against specialty benchmarks from 1.175M+ providers to find specific gaps.",
  },
  {
    q: "Is my data secure?",
    a: "NPIxray uses only publicly available CMS data published by the federal government. No patient PHI is ever accessed or stored. The Intelligence tier CSV uploads are encrypted in transit and at rest.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

const STATS = [
  { value: "1.175M+", label: "Providers Analyzed", icon: Users },
  { value: "8.15M+", label: "Billing Records", icon: Database },
  { value: "$0", label: "Required to Start", icon: DollarSign },
  { value: "13", label: "Free Tools", icon: Wrench },
];

export default function PricingPage() {
  return (
    <>
      <TrackPageView event="pricing_viewed" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <Breadcrumbs items={[{ label: "Pricing" }]} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <Shield className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                No credit card required for Free tier
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Capture Every <span className="text-gold">Dollar</span> You&apos;re
              Missing
            </h1>

            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              From free NPI scans to full care management automation.
              Choose the plan that fits your practice.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Stats Bar */}
      <section className="pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 rounded-xl border border-dark-50/50 bg-dark-400/30 py-5 sm:py-6 sm:divide-x sm:divide-dark-50/50">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center px-4">
                <stat.icon className="h-4 w-4 text-gold mx-auto mb-1.5" />
                <p className="text-lg sm:text-xl font-bold font-mono text-gold">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  tier.highlight
                    ? "border-gold/40 bg-gold/[0.03] shadow-lg shadow-gold/10"
                    : "border-dark-50/80 bg-dark-400/50"
                }`}
              >
                {/* Popular badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-1 text-xs font-semibold text-dark">
                      <Star className="h-3 w-3" />
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Icon + Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                      tier.highlight
                        ? "bg-gold/15 border-gold/30"
                        : "bg-gold/10 border-gold/20"
                    }`}
                  >
                    <tier.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-4xl font-bold font-mono">
                    {tier.price}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)] ml-1">
                    {tier.period}
                  </span>
                </div>

                <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
                  {tier.description}
                </p>

                {/* CTA Button */}
                <Link
                  href={tier.ctaHref}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all mb-4 ${
                    tier.highlight
                      ? "bg-gold text-dark hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
                      : "border border-dark-50 text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Money-back guarantee for paid tiers */}
                {tier.price !== "$0" && (
                  <p className="text-center text-[11px] text-[var(--text-secondary)] mb-6">
                    <ShieldCheck className="h-3 w-3 inline-block mr-1 text-gold/60 -mt-px" />
                    30-day money-back guarantee
                  </p>
                )}

                {tier.price === "$0" && <div className="mb-6" />}

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-[var(--text-secondary)] leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="border-t border-dark-50/50 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-4">
            Full Feature <span className="text-gold">Comparison</span>
          </h2>
          <p className="text-center text-[var(--text-secondary)] mb-12 max-w-xl mx-auto">
            See exactly what you get at every tier. The free plan is generous on purpose — we want you to see the value before you pay.
          </p>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[600px] px-4 sm:px-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-50/50">
                    <th className="text-left text-sm font-semibold py-4 pr-4 w-2/5">
                      Feature
                    </th>
                    <th className="text-center text-sm font-semibold py-4 px-4 w-1/5">
                      <span className="text-[var(--text-secondary)]">Free</span>
                    </th>
                    <th className="text-center text-sm font-semibold py-4 px-4 w-1/5">
                      <span className="text-gold">Intelligence</span>
                    </th>
                    <th className="text-center text-sm font-semibold py-4 pl-4 w-1/5">
                      <span className="text-[var(--text-secondary)]">Care Mgmt</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-b border-dark-50/30 ${
                        i % 2 === 0 ? "bg-dark-400/20" : ""
                      }`}
                    >
                      <td className="text-sm text-[var(--text-secondary)] py-3.5 pr-4">
                        {row.feature}
                      </td>
                      <td className="text-center py-3.5 px-4">
                        {row.free ? (
                          <Check className="h-4 w-4 text-gold mx-auto" />
                        ) : (
                          <Minus className="h-4 w-4 text-dark-50/60 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3.5 px-4">
                        {row.intelligence ? (
                          <Check className="h-4 w-4 text-gold mx-auto" />
                        ) : (
                          <Minus className="h-4 w-4 text-dark-50/60 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3.5 pl-4">
                        {row.care ? (
                          <Check className="h-4 w-4 text-gold mx-auto" />
                        ) : (
                          <Minus className="h-4 w-4 text-dark-50/60 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Questions? <span className="text-gold">We&apos;ve got answers.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {FAQS.map((faq) => (
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

      {/* Bottom CTA */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto">
            Stop Leaving Revenue <span className="text-gold">on the Table</span>
          </h2>

          <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            The average practice misses $50,000&ndash;$200,000/year in billable
            Medicare revenue. Start with a free scan to see your number.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
            >
              <Zap className="h-5 w-5" />
              Start Free Scan
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl border border-dark-50 px-8 py-4 text-base font-semibold text-[var(--text-secondary)] transition-all hover:border-gold/30 hover:text-gold"
            >
              View All Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <p className="mt-6 text-xs text-[var(--text-secondary)]">
            <ShieldCheck className="h-3.5 w-3.5 inline-block mr-1 text-gold/60 -mt-px" />
            30-day money-back guarantee on all paid plans. No questions asked.
          </p>
        </div>
      </section>
    </>
  );
}
