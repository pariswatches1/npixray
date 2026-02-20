"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Stethoscope,
  Hash,
  LayoutDashboard,
  Layers,
  BarChart3,
  ClipboardList,
  Loader2,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  Database,
  Sparkles,
  Share2,
  Download,
  ArrowRight,
} from "lucide-react";
import { ScanResult } from "@/lib/types";
import type { ScanWarning } from "@/lib/scan";
import { calculateRevenueScoreFromScan, estimatePercentile } from "@/lib/revenue-score";
import { UpgradeGate } from "@/components/paywall/upgrade-gate";
import { RevenueScoreGauge } from "@/components/score/revenue-score-gauge";
import { ScoreBreakdown } from "@/components/score/score-breakdown";
import { ScoreBadgeEmbed } from "@/components/score/score-badge-embed";
import { trackEvent } from "@/lib/analytics";
import { OverviewTab } from "@/components/report/overview-tab";
import { ProgramsTab } from "@/components/report/programs-tab";
import { CodingTab } from "@/components/report/coding-tab";
import { ActionPlanTab } from "@/components/report/action-plan-tab";
import { EmailCaptureModal, EmailCaptureInline } from "@/components/report/email-capture";
import { ShareResults } from "@/components/report/share-results";
import { CompetitionTab } from "@/components/report/competition-tab";
import { ForecastTab } from "@/components/report/forecast-tab";
import { Users, TrendingUp } from "lucide-react";

type Tab = "overview" | "programs" | "coding" | "action-plan" | "competition" | "forecast";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "programs", label: "Programs", icon: Layers },
  { id: "coding", label: "Coding", icon: BarChart3 },
  { id: "forecast", label: "12-Mo Forecast", icon: TrendingUp },
  { id: "action-plan", label: "Action Plan", icon: ClipboardList },
  { id: "competition", label: "Competition", icon: Users },
];

// ─── Skeleton Loading ───
function ScanSkeleton({ npi }: { npi: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Back link placeholder */}
        <div className="h-4 w-20 bg-gray-100 rounded mb-6" />

        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex-1">
            <div className="h-8 w-64 bg-gray-100 rounded-lg mb-3" />
            <div className="flex gap-4">
              <div className="h-4 w-32 bg-gray-100 rounded" />
              <div className="h-4 w-28 bg-gray-100 rounded" />
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
          </div>
          <div className="text-right">
            <div className="h-3 w-20 bg-gray-100 rounded mb-2 ml-auto" />
            <div className="h-10 w-40 bg-[#2F5EA8]/[0.06] rounded-lg ml-auto" />
          </div>
        </div>

        {/* Tab bar skeleton */}
        <div className="border-b border-[var(--border-light)] mb-8">
          <div className="flex gap-1 -mb-px">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-28 bg-gray-100 rounded-t-lg" />
            ))}
          </div>
        </div>

        {/* Content skeleton - stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border-light)] bg-white p-5"
            >
              <div className="h-3 w-24 bg-gray-100 rounded mb-3" />
              <div className="h-8 w-20 bg-gray-100 rounded-lg mb-2" />
              <div className="h-2 w-full bg-gray-50 rounded" />
            </div>
          ))}
        </div>

        {/* Content skeleton - chart area */}
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-6 mb-6">
          <div className="h-5 w-40 bg-gray-100 rounded mb-4" />
          <div className="h-48 w-full bg-gray-50 rounded-lg" />
        </div>

        {/* Content skeleton - action items */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--border-light)] bg-white p-4 flex items-center gap-4"
            >
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex-shrink-0" />
              <div className="flex-1">
                <div className="h-4 w-48 bg-gray-100 rounded mb-2" />
                <div className="h-3 w-72 bg-gray-50 rounded" />
              </div>
              <div className="h-6 w-16 bg-[#2F5EA8]/[0.06] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Status text */}
      <div className="mt-8 flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 text-[#2F5EA8] animate-spin" />
        <div className="text-center">
          <p className="text-sm font-medium">Scanning NPI {npi}</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Looking up provider &amp; analyzing revenue patterns...
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ScanResultPage() {
  const params = useParams();
  const npi = params.npi as string;
  const [data, setData] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<ScanWarning[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const runScan = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);
    setWarnings([]);

    try {
      const res = await fetch(`/api/scan?npi=${encodeURIComponent(npi)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Scan failed. The server returned an error.");
        return;
      }
      setData(json.result);
      if (json.warnings?.length) setWarnings(json.warnings);
      trackEvent({
        action: "npi_scan",
        category: "scan",
        label: npi,
        value: json.result?.totalMissedRevenue,
      });
    } catch {
      setError(
        "Unable to reach the server. Check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [npi]);

  useEffect(() => {
    runScan();
  }, [runScan]);

  if (loading) {
    return <ScanSkeleton npi={npi} />;
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="h-16 w-16 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <div className="text-center max-w-md">
          <p className="text-lg font-semibold">Scan Failed</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            {error || "Unable to complete scan."}
          </p>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={runScan}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F5EA8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Scan
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-6 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Try a Different NPI
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back + Provider Info */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          New Scan
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {data.provider.fullName}
              {data.provider.credential && (
                <span className="text-[var(--text-secondary)] font-normal text-lg ml-2">
                  {data.provider.credential}
                </span>
              )}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-[#4FA3D1]" />
                {data.provider.specialty}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#4FA3D1]" />
                {data.provider.address.city}, {data.provider.address.state}
              </span>
              <span className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-[#4FA3D1]" />
                NPI {data.provider.npi}
              </span>
              {/* Data Source Badge */}
              {data.dataSource === "cms" ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  <Database className="h-3 w-3" />
                  Real CMS Data
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#2F5EA8]/15 bg-[#2F5EA8]/[0.06] px-2.5 py-0.5 text-xs font-medium text-[#2F5EA8]">
                  <Sparkles className="h-3 w-3" />
                  Specialty Estimates
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
              Missed Revenue
            </p>
            <p className="text-3xl font-bold text-[#2F5EA8] font-mono">
              ${data.totalMissedRevenue.toLocaleString()}
              <span className="text-sm text-[var(--text-secondary)] font-sans">
                /yr
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Warning banner for partial data */}
      {warnings.length > 0 && (
        <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-400">Partial Data</p>
              {warnings.map((w) => (
                <p key={w.code} className="text-xs text-[var(--text-secondary)] mt-1">
                  {w.message}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Revenue Score ──────────────────────────────── */}
      {(() => {
        const scoreResult = calculateRevenueScoreFromScan(data);
        const percentile = estimatePercentile(scoreResult.overall);
        return (
          <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <RevenueScoreGauge
                score={scoreResult.overall}
                size="lg"
                animate={true}
                percentile={percentile}
                specialty={data.provider.specialty}
              />
              <div className="flex-1 w-full space-y-4">
                <ScoreBreakdown breakdown={scoreResult.breakdown} />
                <button
                  onClick={() => setActiveTab("action-plan")}
                  className="text-xs text-[#2F5EA8] hover:underline"
                >
                  How to improve your score →
                </button>
              </div>
            </div>
            {/* Badge embed */}
            <div className="mt-6 pt-4 border-t border-[var(--border-light)]">
              <ScoreBadgeEmbed npi={data.provider.npi} score={scoreResult.overall} />
            </div>
          </div>
        );
      })()}

      {/* AI Coach CTA */}
      <Link
        href={`/coach/${data.provider.npi}`}
        className="group flex items-center gap-4 rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-5 transition-all hover:border-[#2F5EA8]/15/40 hover:bg-[#264D8C]/10"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 flex-shrink-0 group-hover:bg-[#2F5EA8]/10 transition-colors">
          <Sparkles className="h-6 w-6 text-[#2F5EA8]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-white group-hover:text-[#2F5EA8] transition-colors">
            Ask AI Revenue Coach About Your Results
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Get personalized advice based on your actual billing data — &ldquo;How do I capture that missed CCM revenue?&rdquo;
          </p>
        </div>
        <ArrowLeft className="h-5 w-5 text-[#2F5EA8] rotate-180 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
      </Link>

      {/* Report Card CTA */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Link
          href={`/scan/${npi}/card`}
          className="flex-1 group flex items-center justify-center gap-3 rounded-2xl border border-[var(--border-light)] bg-white p-4 transition-all hover:border-[#2F5EA8]/15 hover:bg-[#264D8C]/[0.03]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 flex-shrink-0 group-hover:bg-[#2F5EA8]/10 transition-colors">
            <Share2 className="h-5 w-5 text-[#2F5EA8]" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold group-hover:text-[#2F5EA8] transition-colors">
              Get Your Report Card
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Share your Revenue Score on social media
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[#2F5EA8] transition-colors ml-auto" />
        </Link>
        <a
          href={`/api/card/image?npi=${npi}`}
          download={`npixray-report-card-${npi}.png`}
          className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-light)] bg-white px-5 py-4 transition-all hover:border-[#2F5EA8]/15 hover:bg-[#264D8C]/[0.03] text-sm font-medium text-[var(--text-secondary)] hover:text-[#2F5EA8]"
        >
          <Download className="h-4 w-4" />
          <span className="sm:hidden">Download Card</span>
          <span className="hidden sm:inline">Download Image</span>
        </a>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-[var(--border-light)] mb-8">
        <nav className="flex gap-1 -mb-px overflow-x-auto" aria-label="Report tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[#2F5EA8]/20 text-[#2F5EA8]"
                  : "border-transparent text-[var(--text-secondary)] hover:text-white hover:border-[var(--border)]"
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && <OverviewTab data={data} />}
        {activeTab === "programs" && <ProgramsTab data={data} />}
        {activeTab === "coding" && <CodingTab data={data} />}
        {activeTab === "forecast" && (
          <UpgradeGate feature="12-Month Revenue Forecast">
            <ForecastTab data={data} />
          </UpgradeGate>
        )}
        {activeTab === "action-plan" && (
          <UpgradeGate feature="90-Day Action Plan">
            <ActionPlanTab data={data} />
          </UpgradeGate>
        )}
        {activeTab === "competition" && <CompetitionTab npi={data.provider.npi} />}
      </div>

      {/* Share Results */}
      <div className="mt-8">
        <ShareResults
          npi={npi}
          providerName={data.provider.fullName}
          missedRevenue={data.totalMissedRevenue}
        />
      </div>

      {/* Email Capture — Inline */}
      <div className="mt-6">
        <EmailCaptureInline data={data} />
      </div>

      {/* Footer note */}
      <div className="mt-6 mb-8 rounded-lg border border-[var(--border-light)] bg-[var(--bg)] p-4 text-center">
        <p className="text-xs text-[var(--text-secondary)]">
          {data.dataSource === "cms" ? (
            <>
              Analysis based on this provider&apos;s actual CMS Medicare Physician
              &amp; Other Practitioners billing data. Revenue estimates use real
              service counts compared to specialty benchmarks and may vary based
              on practice-specific factors.
            </>
          ) : (
            <>
              Analysis based on specialty benchmarks derived from CMS Medicare
              Physician &amp; Other Practitioners public data. Revenue estimates
              are illustrative and may vary based on practice-specific factors.
            </>
          )}
        </p>
      </div>

      {/* Email Capture — Modal (appears after 5s) */}
      <EmailCaptureModal data={data} />
    </div>
  );
}
