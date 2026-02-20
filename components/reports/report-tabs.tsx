"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Stethoscope, Globe, ArrowRight, TrendingDown } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/format";

interface StateCard {
  abbr: string;
  name: string;
  slug: string;
  grade: string;
  gradeColor: string;
  providers: number;
  missedRevenue: number;
}

interface SpecialtyCard {
  specialty: string;
  slug: string;
  grade: string;
  gradeColor: string;
  providers: number;
  avgPayment: number;
  missedRevenue: number;
}

interface ReportTabsProps {
  states: StateCard[];
  specialties: SpecialtyCard[];
}

type TabKey = "states" | "specialties" | "national";

export function ReportTabs({ states, specialties }: ReportTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("states");

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "states", label: "States", icon: <MapPin className="h-4 w-4" /> },
    { key: "specialties", label: "Specialties", icon: <Stethoscope className="h-4 w-4" /> },
    { key: "national", label: "National", icon: <Globe className="h-4 w-4" /> },
  ];

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex items-center gap-1 rounded-xl border border-[var(--border-light)] bg-white p-1 mb-8 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-[#2F5EA8] text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* States tab */}
      {activeTab === "states" && (
        <div>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {states.length} states and territories ranked by revenue capture grade
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {states.map((s) => (
              <Link
                key={s.abbr}
                href={`/reports/states/${s.slug}`}
                className="group rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/15 hover:shadow-lg hover:shadow-[#2F5EA8]/[0.04] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold text-lg ${s.gradeColor}`}
                    >
                      {s.grade}
                    </span>
                    <div>
                      <h3 className="font-semibold group-hover:text-[#2F5EA8] transition-colors">
                        {s.name}
                      </h3>
                      <span className="text-xs text-[var(--text-secondary)] font-mono">
                        {s.abbr}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[#2F5EA8] group-hover:translate-x-0.5 transition-all mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-[var(--bg)]/50 p-2">
                    <p className="text-sm font-bold font-mono text-[#2F5EA8]">
                      {formatNumber(s.providers)}
                    </p>
                    <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                      Providers
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--bg)]/50 p-2">
                    <p className="text-sm font-bold font-mono text-red-400">
                      {formatCurrency(s.missedRevenue)}
                    </p>
                    <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                      Missed Rev
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Specialties tab */}
      {activeTab === "specialties" && (
        <div>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            {specialties.length} specialties ranked by revenue capture grade
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialties.map((s) => (
              <Link
                key={s.specialty}
                href={`/reports/specialties/${s.slug}`}
                className="group rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/15 hover:shadow-lg hover:shadow-[#2F5EA8]/[0.04] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold text-lg ${s.gradeColor}`}
                    >
                      {s.grade}
                    </span>
                    <h3 className="font-semibold group-hover:text-[#2F5EA8] transition-colors leading-tight">
                      {s.specialty}
                    </h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--text-secondary)] group-hover:text-[#2F5EA8] group-hover:translate-x-0.5 transition-all mt-1 flex-shrink-0" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-[var(--bg)]/50 p-2">
                    <p className="text-xs font-bold font-mono text-[#2F5EA8]">
                      {formatNumber(s.providers)}
                    </p>
                    <p className="text-[8px] text-[var(--text-secondary)] uppercase tracking-wider">
                      Providers
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--bg)]/50 p-2">
                    <p className="text-xs font-bold font-mono text-[#2F5EA8]">
                      {formatCurrency(s.avgPayment)}
                    </p>
                    <p className="text-[8px] text-[var(--text-secondary)] uppercase tracking-wider">
                      Avg Pay
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--bg)]/50 p-2">
                    <p className="text-xs font-bold font-mono text-red-400">
                      {formatCurrency(s.missedRevenue)}
                    </p>
                    <p className="text-[8px] text-[var(--text-secondary)] uppercase tracking-wider">
                      Missed
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* National tab */}
      {activeTab === "national" && (
        <div className="max-w-2xl">
          <Link
            href="/reports/national"
            className="group block rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-8 hover:border-[#2F5EA8]/15/40 hover:shadow-lg hover:shadow-[#2F5EA8]/[0.06] transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.06]">
                <Globe className="h-7 w-7 text-[#2F5EA8]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold group-hover:text-[#2F5EA8] transition-colors">
                  National Medicare Revenue Report 2026
                </h3>
                <p className="text-[var(--text-secondary)]">
                  The definitive analysis of Medicare revenue capture across the United States
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#2F5EA8] font-medium">
              View Full Report
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
