"use client";

import { Users, Activity, Heart, Calendar } from "lucide-react";
import { ScanResult, ProgramGap } from "@/lib/types";

function formatCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

function ProgramCard({
  gap,
  icon: Icon,
  color,
  description,
}: {
  gap: ProgramGap;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}) {
  const captureWidth = Math.max(2, Math.min(100, gap.captureRate * 100));

  return (
    <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg border"
            style={{
              backgroundColor: `${color}15`,
              borderColor: `${color}30`,
            }}
          >
            <span style={{ color }}><Icon className="h-5 w-5" /></span>
          </div>
          <div>
            <h3 className="font-semibold">{gap.programName}</h3>
            <p className="text-xs text-[var(--text-secondary)] font-mono">
              {gap.code}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold font-mono text-gold">
            {formatCurrency(gap.annualGap)}
          </p>
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
            annual gap
          </p>
        </div>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">
        {description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
            Eligible
          </p>
          <p className="text-lg font-bold font-mono">
            {gap.eligiblePatients}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
            Enrolled
          </p>
          <p className="text-lg font-bold font-mono">
            {gap.currentPatients}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
            Rate/Patient
          </p>
          <p className="text-lg font-bold font-mono">
            ${Math.round(gap.revenuePerPatientPerMonth)}
            <span className="text-xs text-[var(--text-secondary)] font-sans">
              /mo
            </span>
          </p>
        </div>
      </div>

      {/* Capture Rate Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[var(--text-secondary)]">Capture Rate</span>
          <span className="font-mono font-semibold">
            {Math.round(gap.captureRate * 100)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-dark-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${captureWidth}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      {/* Revenue comparison */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-dark-200/50 p-3">
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
            Current/Year
          </p>
          <p className="text-sm font-bold font-mono mt-1">
            {formatCurrency(gap.currentAnnualRevenue)}
          </p>
        </div>
        <div className="rounded-lg bg-dark-200/50 p-3">
          <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
            Potential/Year
          </p>
          <p className="text-sm font-bold font-mono mt-1 text-gold">
            {formatCurrency(gap.potentialAnnualRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ProgramsTab({ data }: { data: ScanResult }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProgramCard
        gap={data.ccmGap}
        icon={Users}
        color="#E8A824"
        description={`${data.ccmGap.eligiblePatients} patients have 2+ chronic conditions and qualify for monthly CCM billing. Currently only ${data.ccmGap.currentPatients} are enrolled.`}
      />
      <ProgramCard
        gap={data.rpmGap}
        icon={Activity}
        color="#22C55E"
        description={`${data.rpmGap.eligiblePatients} patients with hypertension, diabetes, or COPD are candidates for remote monitoring devices and monthly RPM billing.`}
      />
      <ProgramCard
        gap={data.bhiGap}
        icon={Heart}
        color="#A855F7"
        description={`${data.bhiGap.eligiblePatients} patients show indicators for behavioral health integration. PHQ-9 screening can identify additional candidates.`}
      />
      <ProgramCard
        gap={data.awvGap}
        icon={Calendar}
        color="#3B82F6"
        description={`${data.awvGap.eligiblePatients} Medicare patients are eligible for an Annual Wellness Visit. Only ${data.awvGap.currentPatients} completed one this year.`}
      />
    </div>
  );
}
