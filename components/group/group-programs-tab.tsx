"use client";

import { Heart, Wifi, Brain, ClipboardCheck, CheckCircle2, XCircle } from "lucide-react";
import type { GroupScanResult } from "@/lib/types";

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${Math.round(amount / 1_000)}K`;
  return `$${amount.toLocaleString()}`;
}

interface Props {
  data: GroupScanResult;
}

export function GroupProgramsTab({ data }: Props) {
  const programs = [
    {
      key: "ccm" as const,
      name: "Chronic Care Management",
      code: "99490",
      icon: <Heart className="h-5 w-5" />,
      color: "#34d399",
      gap: data.totalCcmGap,
    },
    {
      key: "rpm" as const,
      name: "Remote Patient Monitoring",
      code: "99454/99457",
      icon: <Wifi className="h-5 w-5" />,
      color: "#60a5fa",
      gap: data.totalRpmGap,
    },
    {
      key: "bhi" as const,
      name: "Behavioral Health Integration",
      code: "99484",
      icon: <Brain className="h-5 w-5" />,
      color: "#f472b6",
      gap: data.totalBhiGap,
    },
    {
      key: "awv" as const,
      name: "Annual Wellness Visit",
      code: "G0438/G0439",
      icon: <ClipboardCheck className="h-5 w-5" />,
      color: "#a78bfa",
      gap: data.totalAwvGap,
    },
  ];

  const successful = data.providers.filter((p) => p.status === "success");

  return (
    <div className="space-y-8">
      {/* Program Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {programs.map((prog) => {
          const adoption = data.programAdoption[prog.key];
          return (
            <div
              key={prog.key}
              className="rounded-2xl bg-white border border-[var(--border-light)] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${prog.color}15` }}
                >
                  <span style={{ color: prog.color }}>{prog.icon}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{prog.name}</h3>
                  <p className="text-xs text-[var(--text-secondary)]/60 font-mono">{prog.code}</p>
                </div>
              </div>

              {/* Adoption Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-[var(--text-secondary)]/60">Enrolled</p>
                  <p className="text-lg font-bold font-mono text-white">{adoption.enrolled}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]/60">Eligible</p>
                  <p className="text-lg font-bold font-mono text-white">{adoption.eligible}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]/60">Rate</p>
                  <p
                    className="text-lg font-bold font-mono"
                    style={{ color: adoption.rate >= 50 ? prog.color : "#fb923c" }}
                  >
                    {adoption.rate}%
                  </p>
                </div>
              </div>

              {/* Adoption Bar */}
              <div className="h-3 bg-[var(--bg)] rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${adoption.rate}%`,
                    backgroundColor: prog.color,
                    opacity: 0.7,
                  }}
                />
              </div>

              {/* Revenue Impact */}
              {prog.gap > 0 && (
                <p className="text-xs text-[var(--text-secondary)]">
                  Practice-wide opportunity:{" "}
                  <span className="text-[#2F5EA8] font-mono font-medium">
                    {formatCurrency(prog.gap)}/yr
                  </span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Provider Adoption Matrix */}
      <div className="rounded-2xl bg-white border border-[var(--border-light)] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Provider Adoption Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-[var(--text-secondary)] uppercase tracking-wider border-b border-[var(--border-light)]">
                <th className="text-left py-2 pr-4">Provider</th>
                <th className="text-center px-4 py-2">CCM</th>
                <th className="text-center px-4 py-2">RPM</th>
                <th className="text-center px-4 py-2">BHI</th>
                <th className="text-center px-4 py-2">AWV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-50/5">
              {successful.map((provider) => {
                const scan = provider.fullScan;
                const hasCcm = scan ? scan.billing.ccmPatients > 0 : false;
                const hasRpm = scan ? scan.billing.rpmPatients > 0 : false;
                const hasBhi = scan ? scan.billing.bhiPatients > 0 : false;
                const hasAwv = scan ? scan.billing.awvCount > 0 : false;

                return (
                  <tr key={provider.npi} className="hover:bg-[var(--bg)]">
                    <td className="py-2.5 pr-4">
                      <p className="text-white font-medium truncate max-w-[200px]">
                        {provider.fullName}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]/60">{provider.specialty}</p>
                    </td>
                    <td className="text-center px-4">
                      <AdoptionIcon adopted={hasCcm} />
                    </td>
                    <td className="text-center px-4">
                      <AdoptionIcon adopted={hasRpm} />
                    </td>
                    <td className="text-center px-4">
                      <AdoptionIcon adopted={hasBhi} />
                    </td>
                    <td className="text-center px-4">
                      <AdoptionIcon adopted={hasAwv} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdoptionIcon({ adopted }: { adopted: boolean }) {
  return adopted ? (
    <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto" />
  ) : (
    <XCircle className="h-4 w-4 text-[var(--text-secondary)]/60 mx-auto" />
  );
}
