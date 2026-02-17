import type { Metadata } from "next";
import Link from "next/link";
import {
  Handshake,
  BarChart3,
  Users,
  DollarSign,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Building,
  HeartPulse,
  Monitor,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Partner Program — Offer NPIxray to Your Clients | NPIxray",
  description:
    "Join the NPIxray partner program. Get branded scan links, track leads, and help your clients capture missed revenue with free CMS data analysis.",
  openGraph: {
    title: "NPIxray Partner Program",
    description:
      "Offer free revenue intelligence to your healthcare clients. Branded scan links, lead tracking, and revenue share.",
  },
};

const PARTNER_TYPES = [
  {
    icon: DollarSign,
    title: "Medical Billing Companies",
    description:
      "Show prospects exactly how much revenue they're missing before they even sign up. NPIxray scans become your most powerful sales tool.",
    benefit: "Close more deals with data-driven proof",
  },
  {
    icon: Building,
    title: "Healthcare Consultants",
    description:
      "Add revenue intelligence to your consulting toolkit. Provide clients with CMS-backed analysis of their billing patterns and opportunities.",
    benefit: "Differentiate with free revenue assessments",
  },
  {
    icon: Monitor,
    title: "EHR & Practice Management Vendors",
    description:
      "Embed NPIxray revenue scans into your platform. Show users the ROI of better documentation and coding directly in their workflow.",
    benefit: "Increase engagement and reduce churn",
  },
  {
    icon: HeartPulse,
    title: "Care Management Companies",
    description:
      "Identify practices with low CCM, RPM, and BHI adoption. Target providers who are leaving the most care management revenue on the table.",
    benefit: "Find high-potential prospects automatically",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Apply",
    description: "Tell us about your business and how you'll use NPIxray with your clients.",
  },
  {
    step: "2",
    title: "Get Your Branded Link",
    description: "Receive a unique partner scan URL: npixray.com/partners/[your-name]/scan",
  },
  {
    step: "3",
    title: "Share With Clients",
    description: "Send the link to prospects and clients. They get a free revenue scan instantly.",
  },
  {
    step: "4",
    title: "Track & Convert",
    description: "See how many scans and leads your link generates in your partner dashboard.",
  },
];

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Hero */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-6">
          <Handshake className="h-3.5 w-3.5 text-gold" />
          <span className="text-xs font-medium text-gold">Partner Program</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-balance max-w-3xl mx-auto">
          Offer <span className="text-gold">Revenue Intelligence</span> to Your Healthcare Clients
        </h1>

        <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Give your clients free CMS-backed revenue scans with your branded link.
          Track leads, close more deals, and help practices capture missed revenue.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:partners@npixray.com?subject=Partner Program Application"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-3.5 text-base font-semibold text-dark hover:bg-gold-300 transition-all"
          >
            <Zap className="h-5 w-5" />
            Apply to Partner Program
          </a>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-xl border border-dark-50 px-8 py-3.5 text-base font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/30 transition-all"
          >
            Learn About NPIxray
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Partner types */}
      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          Who Should <span className="text-gold">Partner</span> With Us?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PARTNER_TYPES.map((type) => (
            <div
              key={type.title}
              className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 hover:border-gold/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 shrink-0">
                  <type.icon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">{type.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                    {type.description}
                  </p>
                  <p className="text-sm font-medium text-gold">{type.benefit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
          How It <span className="text-gold">Works</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.step}
              className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 text-center"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/20 text-gold font-bold text-xl mb-4">
                {step.step}
              </div>
              <h3 className="font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* What partners get */}
      <div className="mb-20 rounded-2xl border border-gold/20 bg-gold/5 p-8 sm:p-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          What You <span className="text-gold">Get</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: BarChart3,
              title: "Branded Scan Links",
              desc: "Custom URL with your company name. All scans are co-branded with your logo.",
            },
            {
              icon: Users,
              title: "Lead Dashboard",
              desc: "See every scan and email capture your link generates. Export leads as CSV.",
            },
            {
              icon: TrendingUp,
              title: "Revenue Share",
              desc: "Earn a share of revenue when your referred leads upgrade to paid plans.",
            },
            {
              icon: Shield,
              title: "White-Label Reports",
              desc: "Coming soon: fully white-labeled PDF reports with your branding.",
            },
            {
              icon: Zap,
              title: "API Access",
              desc: "Embed NPIxray scans directly in your product with our partner API.",
            },
            {
              icon: DollarSign,
              title: "Free for Your Clients",
              desc: "Every scan is free. Your clients get instant value with no friction.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 shrink-0">
                <item.icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="font-semibold mb-1">{item.title}</p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Ready to <span className="text-gold">Partner</span>?
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
          Join healthcare companies already using NPIxray to generate leads and close deals faster.
        </p>
        <a
          href="mailto:partners@npixray.com?subject=Partner Program Application"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-3.5 text-base font-semibold text-dark hover:bg-gold-300 transition-all"
        >
          <Handshake className="h-5 w-5" />
          Apply Now
        </a>
      </div>
    </div>
  );
}
