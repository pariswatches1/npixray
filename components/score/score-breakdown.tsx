"use client";

import type { ScoreBreakdown } from "@/lib/revenue-score";
import { BarChart3, Heart, DollarSign, Layers, Users } from "lucide-react";

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown;
}

const FACTORS = [
  { key: "emCoding" as const, label: "E&M Coding", weight: "25%", icon: BarChart3 },
  { key: "programUtil" as const, label: "Program Utilization", weight: "25%", icon: Heart },
  { key: "revenueEfficiency" as const, label: "Revenue Efficiency", weight: "20%", icon: DollarSign },
  { key: "serviceDiversity" as const, label: "Service Diversity", weight: "15%", icon: Layers },
  { key: "patientVolume" as const, label: "Patient Volume", weight: "15%", icon: Users },
];

function getBarColor(score: number): string {
  if (score >= 80) return "bg-emerald-400";
  if (score >= 60) return "bg-yellow-400";
  if (score >= 40) return "bg-orange-400";
  return "bg-red-400";
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
        Score Breakdown
      </h3>
      {FACTORS.map(({ key, label, weight, icon: Icon }) => {
        const value = breakdown[key];
        return (
          <div key={key} className="flex items-center gap-3">
            <Icon className="h-4 w-4 text-[var(--text-secondary)] shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[var(--text-secondary)] truncate">
                  {label} <span className="text-dark-50">({weight})</span>
                </span>
                <span className="text-xs font-mono font-semibold ml-2">{value}</span>
              </div>
              <div className="h-1.5 bg-dark-50/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(value)}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
