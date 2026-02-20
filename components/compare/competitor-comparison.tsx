"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  ChevronDown,
  Zap,
  ArrowRight,
  ExternalLink,
  Shield,
  Target,
  DollarSign,
} from "lucide-react";

export interface CompetitorData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  website: string;
  pricing: string;
  focus: string;
  strengths: string[];
  weaknesses: string[];
  features: Record<string, boolean | string>;
}

interface FAQ {
  question: string;
  answer: string;
}

export const NPIXRAY: CompetitorData = {
  name: "NPIxray",
  slug: "npixray",
  tagline: "AI-powered revenue intelligence built on free CMS data",
  description:
    "NPIxray uses real Medicare claims data from CMS.gov to analyze 1.175M+ providers. Instantly see revenue gaps, E&M coding patterns, and care management opportunities.",
  website: "npixray.com",
  pricing: "Free scanner \u2022 Intelligence: $99/mo \u2022 Platform: $299-699/mo",
  focus: "Revenue Intelligence & Benchmarking",
  strengths: [
    "Free tier with instant results",
    "Real CMS Medicare data (1.175M providers)",
    "No setup required \u2014 instant NPI scan",
    "E&M coding analysis with benchmarks",
    "CCM/RPM/BHI/AWV opportunity detection",
    "State and specialty benchmarking",
  ],
  weaknesses: [
    "New platform (2026 launch)",
    "Medicare-focused (not commercial payers yet)",
    "No direct EHR integration yet",
  ],
  features: {
    "Free Tier Available": true,
    "Real CMS Medicare Data": true,
    "Revenue Gap Analysis": true,
    "E&M Coding Audit": true,
    "CCM/RPM/BHI/AWV Analysis": true,
    "1.175M+ Provider Database": true,
    "NPI Lookup": true,
    "Specialty Benchmarks": true,
    "State & City Analytics": true,
    "Practice Comparison Tools": true,
    "API Access": true,
    "No Setup Required": true,
  },
};

const FEATURE_LIST = [
  "Free Tier Available",
  "Real CMS Medicare Data",
  "Revenue Gap Analysis",
  "E&M Coding Audit",
  "CCM/RPM/BHI/AWV Analysis",
  "1.175M+ Provider Database",
  "NPI Lookup",
  "Specialty Benchmarks",
  "State & City Analytics",
  "Practice Comparison Tools",
  "API Access",
  "No Setup Required",
];

function FeatureIcon({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return (
      <span className="text-sm text-[var(--text-secondary)]">{value}</span>
    );
  }
  if (value) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/10">
        <Check className="h-4 w-4 text-green-400" />
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10">
      <X className="h-4 w-4 text-red-400/60" />
    </span>
  );
}

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--border-light)] last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium pr-4 group-hover:text-[#2F5EA8] transition-colors">
          {faq.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-[var(--text-secondary)] flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-[var(--text-secondary)] leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export function CompetitorComparison({
  competitor,
  faqs,
}: {
  competitor: CompetitorData;
  faqs: FAQ[];
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const npixrayFeatureCount = FEATURE_LIST.filter(
    (f) => NPIXRAY.features[f] === true
  ).length;
  const competitorFeatureCount = FEATURE_LIST.filter(
    (f) => competitor.features[f] === true
  ).length;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          {/* VS Badge */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-3 sm:gap-4 mb-6">
              <div className="rounded-xl border border-[#2F5EA8]/15 bg-[#2F5EA8]/[0.06] px-4 py-2 sm:px-6 sm:py-3">
                <span className="text-[#2F5EA8] font-bold text-lg sm:text-2xl">
                  NPIxray
                </span>
              </div>
              <div className="rounded-full border border-[var(--border-light)] bg-[var(--bg)]/80 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                <span className="text-sm sm:text-base font-bold text-[var(--text-secondary)]">
                  VS
                </span>
              </div>
              <div className="rounded-xl border border-[var(--border-light)] bg-white px-4 py-2 sm:px-6 sm:py-3">
                <span className="font-bold text-lg sm:text-2xl">
                  {competitor.name}
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl leading-[1.1]">
              NPIxray vs {competitor.name}{" "}
              <span className="text-[#2F5EA8]">Comparison</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
              Compare features, pricing, and capabilities. See which platform
              better fits your practice&apos;s revenue intelligence needs.
            </p>
          </div>

          {/* Quick Score */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-4 text-center">
              <p className="text-3xl font-bold font-mono text-[#2F5EA8]">
                {npixrayFeatureCount}/{FEATURE_LIST.length}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                NPIxray Features
              </p>
            </div>
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-4 text-center">
              <p className="text-3xl font-bold font-mono">
                {competitorFeatureCount}/{FEATURE_LIST.length}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {competitor.name} Features
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NPIxray Card */}
            <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-[#2F5EA8]/10 p-2">
                  <Zap className="h-5 w-5 text-[#2F5EA8]" />
                </div>
                <h2 className="text-xl font-bold text-[#2F5EA8]">NPIxray</h2>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                {NPIXRAY.tagline}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                {NPIXRAY.description}
              </p>
              <div className="text-xs text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">
                  Focus:
                </span>{" "}
                {NPIXRAY.focus}
              </div>
            </div>

            {/* Competitor Card */}
            <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-lg bg-white p-2">
                  <Target className="h-5 w-5 text-[var(--text-secondary)]" />
                </div>
                <h2 className="text-xl font-bold">{competitor.name}</h2>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                {competitor.tagline}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                {competitor.description}
              </p>
              <div className="text-xs text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-primary)]">
                  Focus:
                </span>{" "}
                {competitor.focus}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-2">
            Feature <span className="text-[#2F5EA8]">Comparison</span>
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Side-by-side breakdown of key capabilities.
          </p>
          <div className="overflow-x-auto rounded-xl border border-[var(--border-light)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-white">
                  <th className="text-left px-4 sm:px-6 py-4 font-medium text-[var(--text-secondary)]">
                    Feature
                  </th>
                  <th className="text-center px-4 sm:px-6 py-4 font-medium text-[#2F5EA8] w-36 sm:w-48">
                    NPIxray
                  </th>
                  <th className="text-center px-4 sm:px-6 py-4 font-medium text-[var(--text-secondary)] w-36 sm:w-48">
                    {competitor.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_LIST.map((feature) => {
                  const npVal = NPIXRAY.features[feature];
                  const compVal =
                    feature in competitor.features
                      ? competitor.features[feature]
                      : false;
                  return (
                    <tr
                      key={feature}
                      className="border-b border-[var(--border-light)] hover:bg-white transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-4 font-medium">
                        {feature}
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <FeatureIcon value={npVal} />
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <FeatureIcon value={compVal} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Pricing <span className="text-[#2F5EA8]">Comparison</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-[#2F5EA8]" />
                <h3 className="text-lg font-bold text-[#2F5EA8]">NPIxray Pricing</h3>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                {NPIXRAY.pricing}
              </p>
              <div className="rounded-lg bg-white p-3 text-xs text-[var(--text-secondary)]">
                Start with a free NPI scan, no credit card required. Upgrade
                when you need deeper analysis.
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-[var(--text-secondary)]" />
                <h3 className="text-lg font-bold">
                  {competitor.name} Pricing
                </h3>
              </div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
                {competitor.pricing}
              </p>
              <div className="rounded-lg bg-white p-3 text-xs text-[var(--text-secondary)]">
                Visit{" "}
                <span className="text-[var(--text-primary)]">
                  {competitor.website}
                </span>{" "}
                for the most up-to-date pricing information.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Differences / Strengths & Weaknesses */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Key <span className="text-[#2F5EA8]">Differences</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NPIxray Strengths */}
            <div>
              <h3 className="text-base font-semibold text-[#2F5EA8] mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                NPIxray Advantages
              </h3>
              <ul className="space-y-3">
                {NPIXRAY.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
                  >
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <h4 className="text-sm font-medium text-[var(--text-secondary)] mt-6 mb-3">
                NPIxray Limitations
              </h4>
              <ul className="space-y-2">
                {NPIXRAY.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
                  >
                    <X className="h-4 w-4 text-red-400/60 mt-0.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            {/* Competitor Strengths */}
            <div>
              <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                {competitor.name} Advantages
              </h3>
              <ul className="space-y-3">
                {competitor.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
                  >
                    <Check className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
              <h4 className="text-sm font-medium text-[var(--text-secondary)] mt-6 mb-3">
                {competitor.name} Limitations
              </h4>
              <ul className="space-y-2">
                {competitor.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
                  >
                    <X className="h-4 w-4 text-red-400/60 mt-0.5 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">
            Frequently Asked <span className="text-[#2F5EA8]">Questions</span>
          </h2>
          <div className="max-w-3xl mx-auto rounded-xl border border-[var(--border-light)] bg-white px-6">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border-light)] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-8 sm:p-12 text-center">
            <Zap className="h-10 w-10 text-[#2F5EA8] mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Try NPIxray Free &mdash; Scan Your NPI Now
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto leading-relaxed">
              Enter any NPI number and instantly see revenue gaps, coding
              patterns, and care management opportunities. No signup required.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#2F5EA8] text-white font-semibold hover:bg-[#264D8C] transition-colors text-lg"
            >
              <Zap className="h-5 w-5" />
              Run Free NPI Scan
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-4 text-xs text-[var(--text-secondary)]">
              Free forever &bull; No credit card &bull; Instant results
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
