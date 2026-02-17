import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Check,
  X,
  Trophy,
  ArrowRight,
  Search,
  Zap,
  CircleDollarSign,
  HelpCircle,
  ListChecks,
  Crown,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import {
  getCategoryBySlug,
  getAllCategorySlugs,
  type CategoryTool,
} from "@/lib/category-data";

/* ── Static generation ────────────────────────────────────────────────── */

export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

/* ── SEO metadata ─────────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCategoryBySlug(slug);
  if (!page) return { title: "Category Not Found | NPIxray" };

  return {
    title: page.metaTitle,
    description: page.description,
    openGraph: {
      title: page.metaTitle,
      description: page.description,
    },
  };
}

/* ── Star rating component ────────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-gold fill-gold" : "text-dark-50"
          }`}
        />
      ))}
    </div>
  );
}

/* ── Tool card component ──────────────────────────────────────────────── */

function ToolCard({ tool, rank }: { tool: CategoryTool; rank: number }) {
  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 transition-all ${
        tool.isNpixray
          ? "border-gold/30 bg-gold/[0.04] shadow-lg shadow-gold/5"
          : "border-dark-50/50 bg-dark-400/50"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center justify-center h-8 w-8 rounded-lg text-sm font-bold ${
              rank === 1
                ? "bg-gold text-dark"
                : "bg-dark-300 text-[var(--text-secondary)]"
            }`}
          >
            {rank}
          </span>
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              {tool.name}
              {tool.isNpixray && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                  Our Pick
                </span>
              )}
            </h3>
            <StarRating rating={tool.rating} />
          </div>
        </div>
        <span className="text-sm font-mono text-gold whitespace-nowrap">
          {tool.pricing}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
        {tool.description}
      </p>

      {/* Best for */}
      <div className="rounded-lg bg-dark-300/50 border border-dark-50/30 px-4 py-3 mb-5">
        <p className="text-xs text-[var(--text-secondary)] mb-1">Best for</p>
        <p className="text-sm font-medium">{tool.bestFor}</p>
      </div>

      {/* Pros & Cons */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">
            Pros
          </p>
          <ul className="space-y-1.5">
            {tool.pros.map((pro) => (
              <li key={pro} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-[var(--text-secondary)]">{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
            Cons
          </p>
          <ul className="space-y-1.5">
            {tool.cons.map((con) => (
              <li key={con} className="flex items-start gap-2 text-sm">
                <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-[var(--text-secondary)]">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA for NPIxray */}
      {tool.isNpixray && (
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 mt-2 rounded-lg bg-gold text-dark text-sm font-semibold hover:bg-gold-300 transition-colors"
        >
          <Zap className="h-4 w-4" />
          Try Free Scanner
        </Link>
      )}
    </div>
  );
}

/* ── Page component ───────────────────────────────────────────────────── */

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCategoryBySlug(slug);
  if (!page) notFound();

  /* Collect all unique feature keys from all tools */
  const featureKeys = Array.from(
    new Set(page.tools.flatMap((t) => Object.keys(t.features)))
  );

  /* JSON-LD FAQ schema */
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
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
              { label: "Compare", href: "/compare" },
              { label: page.title },
            ]}
          />

          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-6">
            <Crown className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-medium text-gold">
              2026 Buyer&apos;s Guide
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 max-w-4xl leading-[1.1]">
            {page.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            {page.description}
          </p>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[var(--text-secondary)] leading-relaxed">
              {page.intro}
            </p>
          </div>
        </div>
      </section>

      {/* ── What to Look For ─────────────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Search className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-bold">
              What to <span className="text-gold">Look For</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.whatToLookFor.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-dark-50/50 bg-dark-400/50 p-4"
              >
                <ListChecks className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[var(--text-secondary)]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ranked Tool List ─────────────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-bold">
              Ranked <span className="text-gold">Reviews</span>
            </h2>
          </div>
          <div className="space-y-6">
            {page.tools.map((tool, i) => (
              <ToolCard key={tool.name} tool={tool} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Comparison Matrix ────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-6">
            Feature <span className="text-gold">Comparison</span>
          </h2>
          <div className="overflow-x-auto rounded-xl border border-dark-50/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-50/50 bg-dark-300">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] sticky left-0 bg-dark-300 z-10 min-w-[140px]">
                    Feature
                  </th>
                  {page.tools.map((tool) => (
                    <th
                      key={tool.name}
                      className={`text-center px-3 py-3 font-medium min-w-[100px] ${
                        tool.isNpixray ? "text-gold" : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {tool.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureKeys.map((feature) => (
                  <tr
                    key={feature}
                    className="border-b border-dark-50/30 hover:bg-dark-200/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium sticky left-0 bg-dark-400/80 z-10">
                      {feature}
                    </td>
                    {page.tools.map((tool) => (
                      <td key={tool.name} className="text-center px-3 py-3">
                        {tool.features[feature] ? (
                          <Check className="h-4 w-4 text-green-400 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-dark-50 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Pricing Overview ─────────────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <CircleDollarSign className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-bold">
              Pricing <span className="text-gold">Overview</span>
            </h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-dark-50/50">
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
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {page.tools.map((tool) => (
                  <tr
                    key={tool.name}
                    className={`border-b border-dark-50/30 hover:bg-dark-200/50 transition-colors ${
                      tool.isNpixray ? "bg-gold/[0.03]" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold flex items-center gap-2">
                      {tool.name}
                      {tool.isNpixray && (
                        <Crown className="h-3.5 w-3.5 text-gold" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-gold">
                      {tool.pricing}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] max-w-xs">
                      {tool.bestFor}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <StarRating rating={tool.rating} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Our Recommendation ───────────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-6 w-6 text-gold" />
              <h2 className="text-xl font-bold">Our Recommendation</h2>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-6 max-w-3xl">
              Start by understanding your revenue gaps before committing to any
              platform. NPIxray&apos;s free scanner analyzes your billing patterns
              against 1.175M+ providers using real CMS data, showing you exactly
              where you stand compared to specialty peers. This gives you the
              data you need to make an informed platform decision and negotiate
              with vendors from a position of knowledge.
            </p>
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

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-bold">
              Frequently Asked <span className="text-gold">Questions</span>
            </h2>
          </div>
          <div className="space-y-4 max-w-3xl">
            {page.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-dark-50/50 bg-dark-400/50 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none font-medium hover:text-gold transition-colors">
                  {item.q}
                  <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.a}
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
