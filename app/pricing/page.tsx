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
} from "lucide-react";
import { TrackPageView } from "@/components/analytics/track-pageview";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "NPIxray pricing plans — from free NPI scans to full care management platform. Capture missed revenue at every level.",
};

const TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "X-ray any practice with our NPI scanner",
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
      "Shareable report link",
    ],
  },
  {
    name: "Intelligence",
    price: "$99",
    period: "/month",
    description: "Patient-level insights to capture every dollar",
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
    description: "Full-stack revenue capture with dedicated support",
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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20">
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
                  className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all mb-8 ${
                    tier.highlight
                      ? "bg-gold text-dark hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
                      : "border border-dark-50 text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold"
                  }`}
                >
                  {tier.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>

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

      {/* FAQ / Bottom CTA */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Questions? <span className="text-gold">We&apos;ve got answers.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
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

          <div className="mt-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
            >
              <Zap className="h-5 w-5" />
              Start With a Free Scan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
