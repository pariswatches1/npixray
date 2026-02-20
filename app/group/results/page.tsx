"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutDashboard,
  Users,
  Layers,
  BarChart3,
  ClipboardList,
  Share2,
  Building2,
  Database,
  AlertCircle,
  Loader2,
} from "lucide-react";
import type { GroupScanResult } from "@/lib/types";
import { GroupProgress } from "@/components/group/group-progress";
import { GroupOverviewTab } from "@/components/group/group-overview-tab";
import { GroupProvidersTab } from "@/components/group/group-providers-tab";
import { GroupProgramsTab } from "@/components/group/group-programs-tab";
import { GroupCodingTab } from "@/components/group/group-coding-tab";
import { GroupActionPlanTab } from "@/components/group/group-action-plan-tab";

type Tab = "overview" | "providers" | "programs" | "coding" | "action-plan";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "providers", label: "Providers", icon: Users },
  { id: "programs", label: "Programs", icon: Layers },
  { id: "coding", label: "Coding", icon: BarChart3 },
  { id: "action-plan", label: "Action Plan", icon: ClipboardList },
];

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount.toLocaleString()}`;
}

export default function GroupResultsPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-[#2F5EA8] animate-spin" />
        </div>
      }
    >
      <GroupResultsPage />
    </Suspense>
  );
}

function GroupResultsPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<GroupScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [copied, setCopied] = useState(false);

  const npisParam = searchParams.get("npis") || "";
  const nameParam = searchParams.get("name") || "";
  const npis = npisParam.split(",").filter((n) => /^\d{10}$/.test(n));

  useEffect(() => {
    if (npis.length < 2) {
      setError("At least 2 valid NPIs are required");
      setLoading(false);
      return;
    }

    async function runScan() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/group-scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ npis, practiceName: nameParam || "Group Practice" }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Scan failed (${res.status})`);
        }

        const json = await res.json();
        setData(json.groupResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Scan failed");
      } finally {
        setLoading(false);
      }
    }

    runScan();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [npisParam]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        <GroupProgress total={npis.length} completed={0} failed={0} />
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center px-4">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Scan Error</h2>
          <p className="text-[var(--text-secondary)] mb-6">{error || "Something went wrong"}</p>
          <Link
            href="/group"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2F5EA8] px-6 py-3 font-bold text-white hover:bg-[#264D8C]/90 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <Link
          href="/group"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          New Group Scan
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-6 w-6 text-[#2F5EA8]" />
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                {data.practiceName}
              </h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {data.successfulScans} provider{data.successfulScans !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Database className="h-4 w-4" />
                {data.cmsDataCount > 0 ? `${data.cmsDataCount} CMS verified` : "Estimated data"}
              </span>
            </div>
          </div>

          {/* Hero Stat + Share */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-[var(--text-secondary)]/60 uppercase tracking-wider mb-1">
                Total Missed Revenue
              </p>
              <p className="text-3xl font-bold font-mono text-[#2F5EA8]">
                {formatCurrency(data.totalMissedRevenue)}
              </p>
            </div>
            <button
              onClick={handleShare}
              className="rounded-xl bg-[var(--bg)] border border-[var(--border-light)] px-4 py-3 text-sm text-[var(--text-primary)] hover:text-[#2F5EA8] hover:border-[#2F5EA8]/15 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </button>
          </div>
        </div>

        {/* Copied Toast */}
        {copied && (
          <div className="fixed top-4 right-4 z-50 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-sm text-emerald-400">
            Link copied!
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-[var(--border-light)] mb-8">
          <div className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-[#2F5EA8]/20 text-[#2F5EA8]"
                      : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border)]/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && <GroupOverviewTab data={data} />}
        {activeTab === "providers" && <GroupProvidersTab data={data} />}
        {activeTab === "programs" && <GroupProgramsTab data={data} />}
        {activeTab === "coding" && <GroupCodingTab data={data} />}
        {activeTab === "action-plan" && <GroupActionPlanTab data={data} />}
      </div>
    </div>
  );
}
