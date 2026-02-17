import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
  Zap,
  BarChart3,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import {
  getSwitchPageBySlug,
  getAllSwitchSlugs,
} from "@/lib/switch-data";

/* ── Static generation ────────────────────────────────────────────────── */

export async function generateStaticParams() {
  return getAllSwitchSlugs().map((slug) => ({ slug }));
}

/* ── SEO metadata ─────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getSwitchPageBySlug(slug);
  if (!page) return { title: "Switch Guide Not Found | NPIxray" };

  return {
    title: page.metaTitle,
    description: page.description,
    openGraph: {
      title: page.metaTitle,
      description: page.description,
    },
  };
}

/* ── Page component ───────────────────────────────────────────────────── */

export default async function SwitchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSwitchPageBySlug(slug);
  if (!page) notFound();

  /* JSON-LD FAQ schema from concerns */
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.concerns.map((c) => ({
      "@type": "Question",
      name: c.concern,
      acceptedAnswer: {
        "@type": "Answer",
        text: c.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Switch", href: "/switch" },
              { label: `From ${page.fromProduct}` },
            ]}
          />

          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-6">
            <ArrowRightLeft className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-medium text-gold">
              Migration Guide
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 max-w-4xl leading-[1.1]">
            Switching from{" "}
            <span className="text-[var(--text-secondary)]">
              {page.fromProduct}
            </span>{" "}
            to <span className="text-gold">NPIxray</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            {page.description}
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-dark font-semibold hover:bg-gold-300 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Run Free Scan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Success Metrics ──────────────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {page.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-dark-50/50 bg-dark-400/50 p-4 text-center"
              >
                <p className="text-2xl sm:text-3xl font-bold font-mono text-gold mb-1">
                  {metric.value}
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-tight">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pain Points ──────────────────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <h2 className="text-xl font-bold">
              Why Practices Switch from{" "}
              <span className="text-[var(--text-secondary)]">
                {page.fromProduct}
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.painPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-xl border border-red-500/10 bg-red-500/[0.03] p-5"
              >
                <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Migration Steps ──────────────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-bold">
              How to <span className="text-gold">Switch</span> — Step by Step
            </h2>
          </div>
          <div className="space-y-4 max-w-3xl">
            {page.steps.map((step, i) => (
              <div
                key={step.title}
                className="flex gap-5 rounded-xl border border-dark-50/50 bg-dark-400/50 p-6"
              >
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center h-10 w-10 rounded-xl bg-gold text-dark text-lg font-bold">
                    {i + 1}
                  </span>
                </div>
                <div>
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

      {/* ── Benefits ─────────────────────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-bold">
              What You <span className="text-gold">Gain</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
            {page.benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-start gap-3 rounded-xl border border-green-500/10 bg-green-500/[0.03] p-5"
              >
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Common Concerns FAQ ──────────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-bold">
              Common <span className="text-gold">Concerns</span>
            </h2>
          </div>
          <div className="space-y-4 max-w-3xl">
            {page.concerns.map((item) => (
              <details
                key={item.concern}
                className="group rounded-xl border border-dark-50/50 bg-dark-400/50 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-medium hover:text-gold transition-colors">
                  {item.concern}
                  <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
