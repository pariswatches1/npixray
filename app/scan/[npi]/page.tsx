"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { ScanResult } from "@/lib/types";
import { OverviewTab } from "@/components/report/overview-tab";
import { ProgramsTab } from "@/components/report/programs-tab";
import { CodingTab } from "@/components/report/coding-tab";
import { ActionPlanTab } from "@/components/report/action-plan-tab";
import { EmailCaptureModal, EmailCaptureInline } from "@/components/report/email-capture";

type Tab = "overview" | "programs" | "coding" | "action-plan";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "programs", label: "Programs", icon: Layers },
  { id: "coding", label: "Coding", icon: BarChart3 },
  { id: "action-plan", label: "Action Plan", icon: ClipboardList },
];

export default function ScanResultPage() {
  const params = useParams();
  const npi = params.npi as string;
  const [data, setData] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    async function runScan() {
      try {
        const res = await fetch(`/api/scan?npi=${encodeURIComponent(npi)}`);
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || "Scan failed");
          return;
        }
        setData(json.result);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    runScan();
  }, [npi]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl border border-gold/20 bg-gold/5 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-gold animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">Scanning NPI {npi}</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Looking up provider &amp; analyzing revenue patterns...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="h-16 w-16 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <div className="text-center max-w-md">
          <p className="text-lg font-semibold">Scan Failed</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {error || "Unable to complete scan."}
          </p>
        </div>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-dark hover:bg-gold-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back + Provider Info */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-gold transition-colors mb-4"
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
                <Stethoscope className="h-3.5 w-3.5 text-gold/60" />
                {data.provider.specialty}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gold/60" />
                {data.provider.address.city}, {data.provider.address.state}
              </span>
              <span className="flex items-center gap-1.5">
                <Hash className="h-3.5 w-3.5 text-gold/60" />
                NPI {data.provider.npi}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">
              Missed Revenue
            </p>
            <p className="text-3xl font-bold text-gold font-mono">
              ${data.totalMissedRevenue.toLocaleString()}
              <span className="text-sm text-[var(--text-secondary)] font-sans">
                /yr
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-dark-50/50 mb-8">
        <nav className="flex gap-1 -mb-px overflow-x-auto" aria-label="Report tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-gold text-gold"
                  : "border-transparent text-[var(--text-secondary)] hover:text-white hover:border-dark-50"
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
        {activeTab === "action-plan" && <ActionPlanTab data={data} />}
      </div>

      {/* Email Capture — Inline */}
      <div className="mt-12">
        <EmailCaptureInline data={data} />
      </div>

      {/* Footer note */}
      <div className="mt-6 mb-8 rounded-lg border border-dark-50/50 bg-dark-300/30 p-4 text-center">
        <p className="text-xs text-[var(--text-secondary)]">
          Analysis based on CMS Medicare Physician &amp; Other Practitioners
          public data and specialty benchmarks. Revenue estimates are
          illustrative and may vary based on practice-specific factors.
        </p>
      </div>

      {/* Email Capture — Modal (appears after 5s) */}
      <EmailCaptureModal data={data} />
    </div>
  );
}
