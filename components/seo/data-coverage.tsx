/**
 * Data Coverage — attribution line shown near data-heavy sections.
 *
 * Displays data source, coverage (provider count), and last updated date.
 * Signals trustworthiness and grounding for AI-adjacent content.
 */

import { Database } from "lucide-react";

interface DataCoverageProps {
  providerCount?: number;
  dataYear?: string;
  lastUpdated?: string;
  className?: string;
}

export function DataCoverage({
  providerCount,
  dataYear = "2024",
  lastUpdated = "January 2026",
  className = "",
}: DataCoverageProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)] ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        <Database className="h-3 w-3" />
        Data: CMS Medicare Physician &amp; Other Practitioners, {dataYear}
      </span>
      {providerCount != null && providerCount > 0 && (
        <span>Coverage: {providerCount.toLocaleString()} providers analyzed</span>
      )}
      <span>Last updated: {lastUpdated}</span>
    </div>
  );
}
