"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Zap,
} from "lucide-react";
import { ScanResult } from "@/lib/types";
import {
  calculateRevenueScoreFromScan,
  estimatePercentile,
  getScoreTier,
  type RevenueScoreResult,
} from "@/lib/revenue-score";
import { trackEvent } from "@/lib/analytics";

// ─── Score Ring (SVG, not canvas) ──────────────────────
function ScoreRing({
  score,
  size: ringSize,
  tierColor,
  tierLabel,
}: {
  score: number;
  size: number;
  tierColor: string;
  tierLabel: string;
}) {
  const radius = (ringSize - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 0.75;
  const arcLength = circumference * arcFraction;
  const filledLength = arcLength * (score / 100);
  const center = ringSize / 2;

  return (
    <div className="relative" style={{ width: ringSize, height: ringSize }}>
      <svg width={ringSize} height={ringSize} className="drop-shadow-lg">
        {/* Background arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={12}
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeLinecap="round"
          transform={`rotate(135 ${center} ${center})`}
        />
        {/* Filled arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={tierColor}
          strokeWidth={12}
          strokeDasharray={`${filledLength} ${circumference - filledLength}`}
          strokeLinecap="round"
          transform={`rotate(135 ${center} ${center})`}
          style={{
            filter: `drop-shadow(0 0 8px ${tierColor}40)`,
            transition: "stroke-dasharray 1.5s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span
          className="text-5xl font-black tabular-nums"
          style={{ color: tierColor }}
        >
          {score}
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-[2px] mt-0.5"
          style={{ color: tierColor }}
        >
          {tierLabel}
        </span>
      </div>
    </div>
  );
}

// ─── Breakdown Bar ──────────────────────────────────────
function BreakdownBar({
  label,
  value,
  emoji,
  delay,
}: {
  label: string;
  value: number;
  emoji: string;
  delay: number;
}) {
  const color =
    value >= 80
      ? "#34d399"
      : value >= 60
        ? "#facc15"
        : value >= 40
          ? "#fb923c"
          : "#f87171";

  return (
    <div
      className="flex items-center gap-3 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-base w-6 text-center">{emoji}</span>
      <span className="text-sm text-[var(--text-secondary)] w-24 flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-3 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}30`,
            transitionDelay: `${delay + 200}ms`,
          }}
        />
      </div>
      <span className="text-sm font-bold w-8 text-right tabular-nums">
        {value}
      </span>
    </div>
  );
}

// ─── Revenue Gap Card ───────────────────────────────────
function GapCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  if (value <= 0) return null;
  const display =
    value >= 1000
      ? `$${Math.round(value / 1000)}K`
      : `$${value.toLocaleString()}`;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-dark-50/50 bg-dark-400/30 p-3">
      <span className="text-lg">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[var(--text-secondary)]">{label}</p>
        <p className="text-sm font-bold text-gold">{display}/yr</p>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────
export default function ReportCardPage() {
  const params = useParams();
  const npi = params.npi as string;
  const [data, setData] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const runScan = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/scan?npi=${encodeURIComponent(npi)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Scan failed.");
        return;
      }
      setData(json.result);
      trackEvent({
        action: "report_card_view",
        category: "card",
        label: npi,
      });
    } catch {
      setError("Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  }, [npi]);

  useEffect(() => {
    runScan();
  }, [runScan]);

  // Share helpers
  const cardUrl = `https://npixray.com/scan/${npi}/card`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      trackEvent({ action: "card_share", category: "card", label: "copy" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = cardUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    trackEvent({ action: "card_download", category: "card", label: npi });
    try {
      const res = await fetch(`/api/card/image?npi=${npi}`);
      if (!res.ok) throw new Error("Failed to generate image");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `npixray-report-card-${npi}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  // ─── Loading ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 text-gold animate-spin" />
        <p className="text-sm text-[var(--text-secondary)]">
          Generating your report card...
        </p>
      </div>
    );
  }

  // ─── Error ───────────────────────────────────────────
  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="h-16 w-16 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <p className="text-lg font-semibold">Could not generate report card</p>
        <p className="text-sm text-[var(--text-secondary)]">{error}</p>
        <button
          onClick={runScan}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-dark hover:bg-gold-300"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  // ─── Compute data ────────────────────────────────────
  const scoreResult: RevenueScoreResult = calculateRevenueScoreFromScan(data);
  const percentile = estimatePercentile(scoreResult.overall);
  const tier = getScoreTier(scoreResult.overall);
  const missed =
    data.totalMissedRevenue >= 1000
      ? `$${Math.round(data.totalMissedRevenue / 1000)}K`
      : `$${data.totalMissedRevenue.toLocaleString()}`;

  const breakdownItems = [
    { label: "E&M Coding", value: scoreResult.breakdown.emCoding, emoji: "📋" },
    { label: "Programs", value: scoreResult.breakdown.programUtil, emoji: "🏥" },
    { label: "Revenue Eff.", value: scoreResult.breakdown.revenueEfficiency, emoji: "💰" },
    { label: "Diversity", value: scoreResult.breakdown.serviceDiversity, emoji: "🔀" },
    { label: "Volume", value: scoreResult.breakdown.patientVolume, emoji: "📊" },
  ];

  const gaps = [
    { label: "E&M Coding", value: data.codingGap.annualGap, icon: "📋" },
    { label: "CCM Program", value: data.ccmGap.annualGap, icon: "❤️" },
    { label: "RPM Program", value: data.rpmGap.annualGap, icon: "📡" },
    { label: "BHI Program", value: data.bhiGap.annualGap, icon: "🧠" },
    { label: "AWV Program", value: data.awvGap.annualGap, icon: "🩺" },
  ]
    .filter((g) => g.value > 0)
    .sort((a, b) => b.value - a.value);

  // Social share text
  const shareText = `I just got my Revenue Report Card from @NPIxray! Score: ${scoreResult.overall}/100 (${scoreResult.label}) — missing ${missed}/yr in revenue. Get your free report card:`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(cardUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cardUrl)}`;

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/scan/${npi}`}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-gold transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Full Report
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg border border-dark-50 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-all disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {downloading ? "Generating..." : "Download"}
            </span>
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg border border-dark-50 px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-all"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Share Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ═══ THE REPORT CARD ═══ */}
      <div
        ref={cardRef}
        className="rounded-2xl border border-dark-50/80 bg-gradient-to-br from-dark-400/80 via-dark-400/50 to-dark-400/80 overflow-hidden"
      >
        {/* Gold top accent */}
        <div className="h-1 bg-gradient-to-r from-gold/40 via-gold to-gold/40" />

        {/* Card header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-gold" />
            <span className="text-lg font-bold">
              NPI<span className="text-gold">xray</span>
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-gold uppercase tracking-[2px] bg-gold/10 border border-gold/20 rounded-md px-3 py-1">
            Revenue Report Card
          </span>
        </div>

        {/* Provider + Score */}
        <div className="px-6 sm:px-8 pb-6 flex flex-col sm:flex-row items-center gap-6">
          <ScoreRing
            score={scoreResult.overall}
            size={160}
            tierColor={tier.hexColor}
            tierLabel={scoreResult.label}
          />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">
              {data.provider.fullName}
              {data.provider.credential && (
                <span className="text-[var(--text-secondary)] font-normal text-base ml-1.5">
                  {data.provider.credential}
                </span>
              )}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {data.provider.specialty} · {data.provider.address.city},{" "}
              {data.provider.address.state}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 bg-gold/[0.06] border border-gold/20 rounded-lg px-4 py-2">
              <TrendingUp className="h-4 w-4 text-gold" />
              <span className="text-sm text-[var(--text-secondary)]">
                Top{" "}
                <span className="text-gold font-bold text-lg">
                  {Math.max(1, 100 - percentile)}%
                </span>{" "}
                of {data.provider.specialty} providers
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 sm:mx-8 border-t border-dark-50/50" />

        {/* Missed Revenue Hero */}
        <div className="px-6 sm:px-8 py-6">
          <div className="rounded-xl bg-gold/[0.04] border border-gold/15 p-5">
            <p className="text-[10px] uppercase tracking-[2px] text-[var(--text-secondary)] mb-2">
              Estimated Missed Revenue
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-gold tabular-nums">
                {missed}
              </span>
              <span className="text-lg text-[var(--text-secondary)]">/yr</span>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="px-6 sm:px-8 pb-6 space-y-3">
          <h3 className="text-xs uppercase tracking-[2px] text-[var(--text-secondary)] mb-4">
            Score Breakdown
          </h3>
          {breakdownItems.map((item, i) => (
            <BreakdownBar
              key={item.label}
              label={item.label}
              value={item.value}
              emoji={item.emoji}
              delay={i * 100}
            />
          ))}
        </div>

        {/* Revenue Gaps */}
        {gaps.length > 0 && (
          <div className="px-6 sm:px-8 pb-6">
            <h3 className="text-xs uppercase tracking-[2px] text-[var(--text-secondary)] mb-3">
              Revenue Gaps by Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {gaps.slice(0, 4).map((gap) => (
                <GapCard
                  key={gap.label}
                  label={gap.label}
                  value={gap.value}
                  icon={gap.icon}
                />
              ))}
            </div>
          </div>
        )}

        {/* Card Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-dark-50/30 bg-dark-400/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-secondary)]">
            Based on CMS Medicare Public Data · NPI {npi}
          </p>
          <p className="text-xs font-semibold text-gold">
            Scan your NPI free → npixray.com
          </p>
        </div>
      </div>

      {/* ═══ SHARE SECTION ═══ */}
      <div className="mt-8 rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-4 w-4 text-gold" />
          <h3 className="text-sm font-semibold">Share Your Report Card</h3>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {/* Twitter/X */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-dark-50 px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-all"
            onClick={() =>
              trackEvent({ action: "card_share", category: "card", label: "twitter" })
            }
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Post on X
          </a>

          {/* LinkedIn */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-dark-50 px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:border-blue-500/30 hover:text-blue-400 transition-all"
            onClick={() =>
              trackEvent({ action: "card_share", category: "card", label: "linkedin" })
            }
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Share on LinkedIn
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 rounded-lg border border-dark-50 px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-all"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Link
              </>
            )}
          </button>

          {/* Download Image */}
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg border border-dark-50 px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-all disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Generating..." : "Download Image"}
          </button>
        </div>

        {/* LinkedIn pre-written post */}
        <LinkedInPostHelper
          providerName={data.provider.fullName}
          score={scoreResult.overall}
          tierLabel={scoreResult.label}
          missed={missed}
          specialty={data.provider.specialty}
          cardUrl={cardUrl}
        />
      </div>

      {/* ═══ CTA: Full Report ═══ */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Link
          href={`/scan/${npi}`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-dark hover:bg-gold-300 transition-all"
        >
          View Full Revenue Report
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={`/coach/${npi}`}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-gold/30 px-6 py-3.5 text-sm font-semibold text-gold hover:bg-gold/5 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Ask AI Revenue Coach
        </Link>
      </div>

      {/* Scan your own */}
      <div className="mt-8 text-center">
        <p className="text-sm text-[var(--text-secondary)] mb-3">
          Not your report card?
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline"
        >
          <Zap className="h-4 w-4" />
          Get your own free report card
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ─── LinkedIn Post Helper ────────────────────────────────
function LinkedInPostHelper({
  providerName,
  score,
  tierLabel,
  missed,
  specialty,
  cardUrl,
}: {
  providerName: string;
  score: number;
  tierLabel: string;
  missed: string;
  specialty: string;
  cardUrl: string;
}) {
  const [copied, setCopied] = useState(false);

  const postText = `Just discovered an incredible (free) tool that X-rays your Medicare billing data.

My Revenue Score: ${score}/100 (${tierLabel})
Missed revenue identified: ${missed}/yr

NPIxray analyzes every CPT code you bill against ${specialty} benchmarks and shows exactly where you're leaving money on the table.

If you bill Medicare, scan your NPI — it takes 10 seconds:
${cardUrl}

#HealthcareBilling #MedicalPractice #RevenueOptimization #MedicareData`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      trackEvent({ action: "card_share", category: "card", label: "linkedin_post_copy" });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="rounded-xl border border-dark-50/50 bg-dark-400/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          One-Click LinkedIn Post
        </p>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-all"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy Post
            </>
          )}
        </button>
      </div>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line line-clamp-6">
        {postText}
      </p>
    </div>
  );
}
