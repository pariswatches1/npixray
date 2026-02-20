import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  FileText,
  TrendingUp,
  ArrowRight,
  Home,
  ChevronRight,
  Users,
  Landmark,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Enterprise Solutions | NPIxray",
  description:
    "Revenue intelligence solutions for billing companies, PE firms, and hospital systems. Manage portfolios of NPIs with bulk scanning, white-label reports, and API access.",
  alternates: { canonical: "https://npixray.com/enterprise" },
};

const SOLUTIONS = [
  {
    name: "Billing Companies",
    description:
      "Manage 50\u2013500+ NPIs. Prove ROI to every client with automated revenue gap reports and monthly tracking.",
    icon: FileText,
    href: "/enterprise/billing-companies",
    ready: true,
    tagline: "Starting at $299/mo",
  },
  {
    name: "PE & Acquisition",
    description:
      "Due diligence for healthcare M&A. Score target practices, identify coding gaps, and model revenue upside before acquisition.",
    icon: TrendingUp,
    href: "/acquire",
    ready: true,
    tagline: "Custom pricing",
  },
  {
    name: "Hospital Systems",
    description:
      "Monitor employed physician revenue performance across departments. Identify coding variance and program adoption gaps system-wide.",
    icon: Landmark,
    href: "#",
    ready: false,
    tagline: "Coming soon",
  },
];

export default function EnterprisePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-[#2F5EA8] transition-colors">
          <Home className="h-3.5 w-3.5" />
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <span className="text-[var(--text-primary)]">Enterprise</span>
      </nav>

      {/* Hero */}
      <div className="text-center mb-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 mx-auto mb-6">
          <Building2 className="h-8 w-8 text-[#2F5EA8]" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
          Enterprise <span className="text-[#2F5EA8]">Solutions</span>
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Revenue intelligence at scale. Whether you manage 50 NPIs or 5,000,
          NPIxray gives you the data to prove value and capture more revenue.
        </p>
      </div>

      {/* Solution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {SOLUTIONS.map((sol) => (
          <div
            key={sol.name}
            className={`relative rounded-2xl border p-8 flex flex-col ${
              sol.ready
                ? "border-[var(--border-light)] bg-white hover:border-[#2F5EA8]/10 transition-colors"
                : "border-[var(--border)]/40 bg-[var(--bg)]/20 opacity-70"
            }`}
          >
            {!sol.ready && (
              <span className="absolute top-4 right-4 rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Coming Soon
              </span>
            )}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 mb-4">
              <sol.icon className="h-6 w-6 text-[#2F5EA8]" />
            </div>
            <h2 className="text-xl font-bold mb-2">{sol.name}</h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 flex-1">
              {sol.description}
            </p>
            <p className="text-xs text-[#2F5EA8] font-semibold mb-4">{sol.tagline}</p>
            {sol.ready ? (
              <Link
                href={sol.href}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] py-3 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all"
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] py-3 text-sm font-medium text-[var(--text-secondary)] opacity-50 cursor-not-allowed"
              >
                Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-10">
        <h2 className="text-2xl font-bold mb-3">
          Not Sure Which Plan Fits?
        </h2>
        <p className="text-[var(--text-secondary)] mb-6 max-w-lg mx-auto">
          Tell us about your organization and we&apos;ll recommend the right solution.
        </p>
        <a
          href="mailto:sales@npixray.com?subject=Enterprise%20Inquiry"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F5EA8] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all"
        >
          <Users className="h-4 w-4" />
          Contact Sales
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
