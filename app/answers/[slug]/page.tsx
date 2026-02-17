import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BookOpen,
  ChevronRight,
  Zap,
  MessageSquare,
  BarChart3,
  Home,
  CheckCircle2,
  ArrowRight,
  Database,
} from "lucide-react";
import { ALL_SLUGS } from "../data";
import type { AnswerData } from "../data";
import { ANSWERS_1 } from "../content-1";
import { ANSWERS_2 } from "../content-2";
import { ANSWERS_3 } from "../content-3";
import { ANSWERS_4 } from "../content-4";
import { ANSWERS_5 } from "../content-5";
import { ANSWERS_PLACEHOLDERS } from "../content-placeholders";

// Merge all answer data
const ANSWERS: Record<string, AnswerData> = {
  ...ANSWERS_1,
  ...ANSWERS_2,
  ...ANSWERS_3,
  ...ANSWERS_4,
  ...ANSWERS_5,
  ...ANSWERS_PLACEHOLDERS,
};

// ── Static params for all 50 slugs ─────────────────────────
export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

// ── Metadata ────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = ANSWERS[slug];
  if (!data) return { title: "Answer Not Found" };

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      type: "article",
      url: `https://npixray.com/answers/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: data.metaTitle,
      description: data.metaDescription,
    },
    alternates: {
      canonical: `https://npixray.com/answers/${slug}`,
    },
  };
}

// ── Page Component ──────────────────────────────────────────
export default async function AnswerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = ANSWERS[slug];
  if (!data) notFound();

  // JSON-LD: QAPage + FAQPage + BreadcrumbList
  const qaJsonLd = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: data.question,
      text: data.question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: data.answer,
        url: `https://npixray.com/answers/${slug}`,
      },
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
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
        name: "Answers",
        item: "https://npixray.com/answers",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: data.question,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(qaJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] mb-6 flex-wrap"
        >
          <Link
            href="/"
            className="hover:text-gold transition-colors flex items-center gap-1"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
          <Link
            href="/answers"
            className="hover:text-gold transition-colors"
          >
            Answers
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-dark-50" />
          <span className="text-[var(--text-primary)]">{data.question}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-gold/10 text-gold uppercase tracking-wider">
              {data.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
            {data.question}
          </h1>
        </header>

        {/* Direct answer block */}
        <div className="rounded-2xl border border-gold/20 bg-gold/5 p-6 sm:p-8 mb-10">
          <div className="flex items-start gap-3 mb-3">
            <MessageSquare className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
            <h2 className="text-sm font-semibold text-gold uppercase tracking-wider">
              Quick Answer
            </h2>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed text-[15px]">
            {data.answer}
          </p>
        </div>

        {/* Data Points */}
        {data.dataPoints.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            {data.dataPoints.map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-dark-50/80 bg-dark-400/50 p-4"
              >
                <BarChart3 className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[var(--text-secondary)]">
                  {point}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Table of Contents */}
        {data.tableOfContents.length > 1 && (
          <nav className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6 mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gold mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Table of Contents
            </h2>
            <ol className="space-y-2">
              {data.tableOfContents.map((heading, i) => (
                <li key={i}>
                  <a
                    href={`#section-${i}`}
                    className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <span className="text-gold/50 font-mono text-xs w-5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Content Sections */}
        <div className="space-y-10">
          {data.sections.map((section, i) => (
            <section key={i} id={`section-${i}`}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 scroll-mt-24">
                {section.heading}
              </h2>
              {section.content.split("\n\n").map((paragraph, j) => (
                <p
                  key={j}
                  className="text-[var(--text-secondary)] leading-relaxed mb-4"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* FAQs */}
        {data.faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gold" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-dark-50/80 bg-dark-400/30"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-semibold hover:text-gold transition-colors">
                    {faq.question}
                    <ChevronRight className="h-4 w-4 text-gold/50 group-open:rotate-90 transition-transform flex-shrink-0 ml-4" />
                  </summary>
                  <div className="px-5 pb-5 pt-0">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-gold/20 bg-gold/5 p-8 text-center">
          <Zap className="h-8 w-8 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            See Your Practice&apos;s Specific Numbers
          </h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-lg mx-auto">
            Enter any NPI number to instantly see missed revenue from E&M coding
            gaps, CCM, RPM, BHI, and AWV programs — based on real CMS Medicare
            data.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-dark font-semibold hover:bg-gold-300 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Scan Your NPI
          </Link>
        </div>

        {/* Data source attribution */}
        <div className="mt-8 flex items-center gap-2 text-xs text-[var(--text-secondary)]/60">
          <Database className="h-3 w-3" />
          <span>
            Source: NPIxray analysis of 1.175M Medicare providers and 8.15M
            billing records from CMS public data
          </span>
        </div>

        {/* Related Questions */}
        {data.relatedQuestions.length > 0 && (
          <div className="mt-12 pt-8 border-t border-dark-50/50">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">
              Related Questions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.relatedQuestions.map((related) => (
                <Link
                  key={related.slug}
                  href={`/answers/${related.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-dark-50/80 bg-dark-400/30 p-4 hover:border-gold/20 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4 text-gold/50 group-hover:text-gold transition-colors flex-shrink-0" />
                  <span className="text-sm group-hover:text-gold transition-colors">
                    {related.question}
                  </span>
                  <ArrowRight className="h-3 w-3 ml-auto text-[var(--text-secondary)] group-hover:text-gold group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
