import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageSquare,
  ArrowRight,
  Zap,
  DollarSign,
  Database,
  BarChart3,
  Stethoscope,
} from "lucide-react";
import { CATEGORIES } from "./data";
import type { AnswerData } from "./data";
import { ANSWERS_1 } from "./content-1";
import { ANSWERS_2 } from "./content-2";
import { ANSWERS_3 } from "./content-3";
import { ANSWERS_4 } from "./content-4";
import { ANSWERS_5 } from "./content-5";
import { ANSWERS_PLACEHOLDERS } from "./content-placeholders";

const ANSWERS: Record<string, AnswerData> = {
  ...ANSWERS_1,
  ...ANSWERS_2,
  ...ANSWERS_3,
  ...ANSWERS_4,
  ...ANSWERS_5,
  ...ANSWERS_PLACEHOLDERS,
};

export const metadata: Metadata = {
  title:
    "Medicare Billing Answers — Expert Q&A on NPI, CCM, RPM, AWV & Revenue",
  description:
    "Get expert answers to the most common Medicare billing questions. Covering NPI numbers, CCM/RPM/BHI billing, E&M coding, AWV requirements, and practice revenue optimization.",
  keywords: [
    "Medicare billing questions",
    "NPI number FAQ",
    "CCM billing answers",
    "RPM billing FAQ",
    "E&M coding questions",
    "Medicare revenue FAQ",
    "AWV requirements",
    "medical billing help",
  ],
  openGraph: {
    title: "Medicare Billing Answers | NPIxray",
    description:
      "Expert answers to 50+ Medicare billing questions. Data-driven insights on NPI, CCM, RPM, AWV, BHI, and revenue optimization.",
    url: "https://npixray.com/answers",
  },
  alternates: {
    canonical: "https://npixray.com/answers",
  },
};

const CATEGORY_META: Record<
  string,
  { icon: typeof MessageSquare; color: string; bgColor: string; description: string }
> = {
  "medicare-billing": {
    icon: Stethoscope,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    description:
      "NPI basics, CCM/RPM/BHI billing codes, AWV requirements, and E&M coding guidelines.",
  },
  "revenue-practice": {
    icon: DollarSign,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    description:
      "Revenue benchmarks, missed revenue analysis, reimbursement rates, and profit optimization.",
  },
  "data-lookup": {
    icon: Database,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    description:
      "NPI lookup tools, CMS public data, Medicare billing records, and provider search.",
  },
  "comparison-buying": {
    icon: BarChart3,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    description:
      "CCM/RPM software comparisons, billing tools, alternatives, and platform reviews.",
  },
  "program-specific": {
    icon: MessageSquare,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    description:
      "CCM workflows, RPM requirements, AWV checklists, BHI vs. CCM, and consent guides.",
  },
};

export default function AnswersIndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-8">
              <MessageSquare className="h-3.5 w-3.5 text-gold" />
              <span className="text-xs font-medium text-gold">
                50+ Expert Answers
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Medicare Billing{" "}
              <span className="text-gold">Answers</span>
            </h1>

            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Data-driven answers to the most common questions about NPI
              numbers, Medicare billing codes, care management programs, and
              practice revenue optimization. Backed by analysis of 1.175M
              Medicare providers.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {Object.entries(CATEGORIES).map(([catKey, cat]) => {
              const meta = CATEGORY_META[catKey];
              const Icon = meta?.icon ?? MessageSquare;

              return (
                <div key={catKey}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta?.bgColor ?? "bg-gold/10"}`}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 ${meta?.color ?? "text-gold"}`}
                      />
                    </div>
                    <h2 className="text-xl font-bold">{cat.label}</h2>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-6 ml-12">
                    {meta?.description}
                  </p>

                  {/* Question cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-0 sm:ml-12">
                    {cat.slugs.map((s) => {
                      const answer = ANSWERS[s];
                      if (!answer) return null;

                      return (
                        <Link
                          key={s}
                          href={`/answers/${s}`}
                          className="group flex items-start gap-3 rounded-xl border border-dark-50/80 bg-dark-400/30 p-4 hover:border-gold/20 hover:bg-dark-400/50 transition-all"
                        >
                          <MessageSquare className="h-4 w-4 text-gold/40 group-hover:text-gold transition-colors flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium group-hover:text-gold transition-colors leading-snug">
                              {answer.question}
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                              {answer.metaDescription}
                            </p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-[var(--text-secondary)] group-hover:text-gold group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-dark-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Get Your Practice&apos;s{" "}
            <span className="text-gold">Specific Answers</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            These answers use national averages. Scan your NPI for a
            personalized analysis showing exactly where your practice stands and
            how much revenue you may be missing.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-8 py-4 text-base font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
          >
            <Zap className="h-5 w-5" />
            Scan Your NPI — Free
          </Link>
        </div>
      </section>
    </>
  );
}
