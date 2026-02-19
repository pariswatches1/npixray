/**
 * Confidence Badge — shows data trustworthiness per page.
 *
 * Displays peer group size, confidence level, data source, and last updated date.
 * For pages with <10 providers, shows a "limited data" warning instead.
 */

import { Shield, Database, Calendar, Users } from "lucide-react";

interface ConfidenceBadgeProps {
  providerCount: number;
  dataSource?: string;
  lastUpdated?: string;
  className?: string;
}

export function ConfidenceBadge({
  providerCount,
  dataSource = "CMS Medicare Public Data 2024",
  lastUpdated = "2024",
  className = "",
}: ConfidenceBadgeProps) {
  const confidence =
    providerCount >= 100 ? "high" : providerCount >= 20 ? "medium" : "low";

  const confidenceConfig = {
    high: { label: "High", color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
    medium: { label: "Medium", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
    low: { label: "Low", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" },
  };

  const conf = confidenceConfig[confidence];

  if (providerCount < 10) {
    return (
      <div className={`rounded-lg border border-orange-500/20 bg-orange-500/5 p-4 ${className}`}>
        <div className="flex items-center gap-2 text-orange-400 text-sm">
          <Shield className="h-4 w-4" />
          <span className="font-medium">Limited Data Available</span>
        </div>
        <p className="text-[var(--text-secondary)] text-sm mt-1">
          Only {providerCount} provider{providerCount !== 1 ? "s" : ""} in this group.
          Results may not be statistically representative.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] ${className}`}>
      <div className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5" />
        <span>Peer group: <span className="text-[var(--text-primary)] font-medium">{providerCount.toLocaleString()}</span> providers</span>
      </div>
      <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 border ${conf.bg}`}>
        <Shield className="h-3 w-3" />
        <span className={conf.color}>Confidence: {conf.label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Database className="h-3.5 w-3.5" />
        <span>{dataSource}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" />
        <span>Data year: {lastUpdated}</span>
      </div>
    </div>
  );
}
