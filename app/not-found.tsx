import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  BookOpen,
  DollarSign,
  MapPin,
  Stethoscope,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist. Try our NPI Scanner, browse billing guides, or explore Medicare data by state and specialty.",
  robots: { index: false, follow: true },
};

const quickLinks = [
  {
    href: "/",
    label: "NPI Scanner",
    description: "Scan any NPI number",
    icon: Zap,
  },
  {
    href: "/tools/revenue-calculator",
    label: "Revenue Calculator",
    description: "Estimate missed revenue",
    icon: DollarSign,
  },
  {
    href: "/states",
    label: "Browse by State",
    description: "Medicare data by state",
    icon: MapPin,
  },
  {
    href: "/specialties",
    label: "Browse by Specialty",
    description: "Data by specialty",
    icon: Stethoscope,
  },
  {
    href: "/guides",
    label: "Billing Guides",
    description: "CPT code deep dives",
    icon: BookOpen,
  },
  {
    href: "/vs",
    label: "Compare Platforms",
    description: "Side-by-side comparisons",
    icon: BarChart3,
  },
];

const popularTools = [
  { href: "/tools/ccm-calculator", label: "CCM Calculator" },
  { href: "/tools/rpm-calculator", label: "RPM Calculator" },
  { href: "/tools/em-audit", label: "E&M Audit" },
  { href: "/tools/practice-benchmark", label: "Practice Benchmark" },
  { href: "/tools/npi-lookup", label: "NPI Lookup" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://npixray.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Page Not Found",
    },
  ],
};

export default function NotFound() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
        {/* 404 Number */}
        <div className="text-[120px] sm:text-[160px] font-bold font-mono text-[#2F5EA8]/20 leading-none select-none">
          404
        </div>

        {/* Message */}
        <div className="text-center -mt-4 max-w-lg">
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            Page Not Found
          </h1>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Try scanning an NPI number, browsing our billing guides, or
            explore one of the destinations below.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/10"
          >
            <Zap className="h-4 w-4" />
            Scan Your NPI
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 text-sm font-medium text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all"
          >
            <BookOpen className="h-4 w-4" />
            Browse Guides
          </Link>
        </div>

        {/* Quick Links Grid */}
        <div className="mt-12 w-full max-w-2xl">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-center mb-4">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-white p-4 transition-all hover:border-[#2F5EA8]/15 hover:bg-[var(--bg)]"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#2F5EA8] shrink-0" />
                    <span className="text-sm font-semibold group-hover:text-[#2F5EA8] transition-colors">
                      {link.label}
                    </span>
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] leading-snug">
                    {link.description}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Popular Tools */}
        <div className="mt-10 w-full max-w-2xl">
          <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider text-center mb-3">
            Popular Tools
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            {popularTools.map((tool, index) => (
              <span key={tool.href} className="flex items-center">
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors py-1 px-1"
                >
                  {tool.label}
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
                {index < popularTools.length - 1 && (
                  <span className="text-[var(--text-secondary)] mx-1" aria-hidden="true">
                    /
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
