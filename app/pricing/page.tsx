import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  BarChart3,
  Users,
  Check,
  Shield,
  Star,
} from "lucide-react";
import { TrackPageView } from "@/components/analytics/track-pageview";
import { PricingCTA } from "@/components/pricing/pricing-cta";
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
    description: "X-ray any practice with our NPI scanner",
    icon: Zap,
    cta: "Scan Now",
    ctaHref: "/",
    planId: "free",
    highlight: false,
    features: [
      "Unlimited NPI scans",
      "E&M coding gap analysis",
      "CCM / RPM / BHI / AWV gap estimates",
      "Specialty benchmark comparisons",
      "Revenue Score & badge",
      "Shareable report link",
    ],
  },
  {
    name: "Pro",
    price: "$199",
    period: "/month",
    description: "Real-time verification + revenue intelligence",
    icon: BarChart3,
    cta: "Start 14-Day Free Trial",
    ctaHref: "#",
    planId: "pro",
    highlight: true,
    badge: "Most Popular",
    subtext: "Verify eligibility & capture every dollar",
    features: [
      "Everything in Free, plus:",
      "Real-time eligibility verification (500/mo)",
      "Patient cost estimation",
      "Enhanced analytics dashboard",
      "Care management opportunity alerts",
      "AI-powered coding recommendations",
      "Unlimited AI Coach sessions",
      "CSV billing data upload & analysis",
      "Monthly benchmark tracking",
      "Email & PDF report exports",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "$499",
    period: "/month",
    description: "Claims processing + AI coding + full revenue capture",
    icon: Users,
    cta: "Start 14-Day Free Trial",
    ctaHref: "#",
    planId: "enterprise",
    highlight: false,
    features: [
      "Everything in Pro, plus:",
      "Unlimited eligibility verification",
      "Claims processing & submission",
      "AI-powered coding assistance",
      "Claims scrubbing & denial management",
      "Multi-payer analytics",
      "Revenue recovery tracking",
      "Dedicated implementation manager",
      "Priority support",
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
    q: "What does eligibility verification include?",
    a: "Pro subscribers can verify patient eligibility in real-time via pVerify integration. Check coverage status, copays, deductibles, and out-of-pocket maximums — plus auto-detect revenue opportunities for each verified patient.",
  },
  {
    q: "What's included in claims processing?",
    a: "Enterprise subscribers can submit claims directly through DrChrono, with pre-submission scrubbing that catches errors before they cause denials. Track claims from submission to payment with denial management and AI-suggested corrective actions.",
  },
  {
    q: "How accurate are the revenue estimates?",
    a: "Estimates are based on specialty benchmarks and national Medicare averages. Your actual numbers will depend on payer mix, patient panel, and documentation practices.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no cancellation fees. All paid plans start with a 14-day free trial. Cancel anytime from your dashboard.",
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <Breadcrumbs items={[{ label: "Pricing" }]} />
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-1.5 mb-8">
              <Shield className="h-3.5 w-3.5 text-[#2F5EA8]" />
              <span className="text-xs font-medium text-[#2F5EA8]">
                No credit card required for Free tier
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Capture Every <span className="text-[#2F5EA8]">Dollar</span> You&apos;re
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
                    ? "border-[#2F5EA8]/20 bg-[#2F5EA8]/[0.03] shadow-lg shadow-[#2F5EA8]/[0.06]"
                    : "border-[var(--border-light)] bg-white"
                }`}
              >
                {/* Popular badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2F5EA8] px-4 py-1 text-xs font-semibold text-white">
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
                        ? "bg-[#2F5EA8]/10 border-[#2F5EA8]/15"
                        : "bg-[#2F5EA8]/[0.06] border-[#2F5EA8]/10"
                    }`}
                  >
                    <tier.icon className="h-5 w-5 text-[#2F5EA8]" />
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

                <p className="text-sm text-[var(--text-secondary)] mb-2 leading-relaxed">
                  {tier.description}
                </p>
                {(tier as any).subtext && (
                  <p className="text-xs text-[#2F5EA8] font-medium mb-4">
                    {(tier as any).subtext}
                  </p>
                )}
                {!(tier as any).subtext && <div className="mb-4" />}

                {/* CTA Button */}
                <PricingCTA
                  planId={tier.planId}
                  label={tier.cta}
                  highlight={tier.highlight}
                />

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
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
      <section className="border-t border-[var(--border-light)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Questions? <span className="text-[#2F5EA8]">We&apos;ve got answers.</span>
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-[var(--border-light)] bg-white p-6"
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
              className="inline-flex items-center gap-2 rounded-xl bg-[#2F5EA8] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/10"
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
