import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Zap,
  AlertTriangle,
  Star,
  ArrowRight,
  HelpCircle,
  Trophy,
  DollarSign,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import {
  ALTERNATIVES,
  getAlternativeBySlug,
  getAllAlternativeSlugs,
} from "@/lib/competitor-data";

// ────────────────────────────────────────────────────────────
// Static generation
// ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return getAllAlternativeSlugs().map((slug) => ({ slug }));
}

// ────────────────────────────────────────────────────────────
// Metadata
// ────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getAlternativeBySlug(slug);
  if (!page) return { title: "Page Not Found" };

  return {
    title: `${page.title} | NPIxray`,
    description: page.description,
    openGraph: {
      title: `${page.title} | NPIxray`,
      description: page.description,
      type: "article",
    },
  };
}

// ────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────

export default async function AlternativesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getAlternativeBySlug(slug);
  if (!page) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const npixrayAlt = page.alternatives.find((a) => a.isNpixray);
  const otherAlts = page.alternatives.filter((a) => !a.isNpixray);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Alternatives", href: "/alternatives" },
              { label: page.title },
            ]}
          />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gold/10 text-gold uppercase tracking-wider">
              Alternatives Guide
            </span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-dark-400/50 border border-dark-50/50 text-[var(--text-secondary)] uppercase tracking-wider">
              Updated 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
            {page.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            {page.description}
          </p>
        </div>
      </section>

      {/* Why People Look for Alternatives */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-2">
            Why People Look for{" "}
            <span className="text-gold">{page.targetProduct} Alternatives</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Common pain points that drive practices to explore other options.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.painPoints.map((point, i) => (
              <div
                key={i}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 flex items-start gap-3"
              >
                <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Top Pick */}
      {npixrayAlt && (
        <section className="border-t border-dark-50/50 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="h-5 w-5 text-gold" />
              <h2 className="text-xl font-bold">
                Our Top Pick:{" "}
                <span className="text-gold">{npixrayAlt.name}</span>
              </h2>
            </div>
            <div className="rounded-xl border-2 border-gold/30 bg-gold/5 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
                      <Zap className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gold text-lg">
                        {npixrayAlt.name}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {npixrayAlt.pricing}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                    {npixrayAlt.description}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--text-primary)]">
                      Best for:
                    </span>{" "}
                    {npixrayAlt.bestFor}
                  </p>
                </div>
                <div className="sm:flex-shrink-0">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-dark font-semibold hover:bg-gold-300 transition-colors text-sm"
                  >
                    <Zap className="h-4 w-4" />
                    Try Free Scanner
                  </Link>
                </div>
              </div>

              {/* Why NPIxray */}
              <div className="mt-6 pt-6 border-t border-gold/20">
                <h4 className="text-sm font-semibold mb-3">
                  Why NPIxray stands out:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {page.whyNpixray.map((reason, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" />
                      <span className="text-[var(--text-secondary)]">
                        {reason}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Alternatives */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">
            All <span className="text-gold">Alternatives</span> Compared
          </h2>

          {/* Comparison Table */}
          <div className="overflow-x-auto rounded-xl border border-dark-50/50 mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-50/50 bg-dark-300">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Platform
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Pricing
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Best For
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-[var(--text-secondary)]">
                    Top Pick
                  </th>
                </tr>
              </thead>
              <tbody>
                {page.alternatives.map((alt, i) => (
                  <tr
                    key={i}
                    className={`border-b border-dark-50/30 transition-colors ${
                      alt.isNpixray
                        ? "bg-gold/5 hover:bg-gold/10"
                        : "hover:bg-dark-200/50"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold ${
                          alt.isNpixray ? "text-gold" : ""
                        }`}
                      >
                        {alt.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] whitespace-nowrap">
                      {alt.pricing}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {alt.bestFor}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {alt.isNpixray ? (
                        <Star className="h-4 w-4 text-gold mx-auto" />
                      ) : (
                        <span className="text-[var(--text-secondary)]">
                          &mdash;
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Individual Alternative Cards */}
          <div className="space-y-4">
            {otherAlts.map((alt, i) => (
              <div
                key={i}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-300 border border-dark-50/50 flex-shrink-0">
                    <span className="text-sm font-bold text-[var(--text-secondary)]">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-semibold">{alt.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-dark-300 border border-dark-50/50 text-[var(--text-secondary)]">
                        {alt.pricing}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                      {alt.description}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--text-primary)]">
                        Best for:
                      </span>{" "}
                      {alt.bestFor}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Verdict */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-4">
            The Verdict: Why Start with{" "}
            <span className="text-gold">NPIxray</span>
          </h2>
          <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 sm:p-8">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
              Before committing to any {page.targetProduct.toLowerCase()}{" "}
              platform, use NPIxray&apos;s free scanner to understand exactly
              where your practice stands. See your E&M coding patterns, identify
              care management gaps, and benchmark against specialty peers — all
              in seconds with no signup required.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-lg bg-dark-300/50 p-4 text-center">
                <DollarSign className="h-5 w-5 text-gold mx-auto mb-2" />
                <p className="text-lg font-bold font-mono text-gold">$0</p>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                  Cost to start
                </p>
              </div>
              <div className="rounded-lg bg-dark-300/50 p-4 text-center">
                <Zap className="h-5 w-5 text-gold mx-auto mb-2" />
                <p className="text-lg font-bold font-mono text-gold">
                  Instant
                </p>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                  Results
                </p>
              </div>
              <div className="rounded-lg bg-dark-300/50 p-4 text-center">
                <CheckCircle2 className="h-5 w-5 text-gold mx-auto mb-2" />
                <p className="text-lg font-bold font-mono text-gold">
                  1.175M+
                </p>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                  Providers
                </p>
              </div>
            </div>
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-dark font-semibold hover:bg-gold-300 transition-colors text-sm"
              >
                <Zap className="h-4 w-4" />
                Run Free Scan Now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-gold" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {page.faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5"
              >
                <h3 className="font-semibold mb-2 text-sm">{faq.question}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Pages */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold mb-4">
            More Alternatives Guides
          </h2>
          <div className="flex flex-wrap gap-3">
            {ALTERNATIVES.filter((a) => a.slug !== slug)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/alternatives/${a.slug}`}
                  className="rounded-lg border border-dark-50/80 bg-dark-400/30 px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-gold hover:border-gold/20 transition-colors flex items-center gap-1.5"
                >
                  {a.title.replace(" in 2026", "")}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
