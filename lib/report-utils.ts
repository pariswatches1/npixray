/**
 * Report Card Utilities — grading, share text, revenue estimates
 */

export function calculateGrade(captureRate: number): {
  grade: string;
  color: string;
  bgColor: string;
  label: string;
} {
  if (captureRate >= 90)
    return { grade: "A", color: "text-emerald-400", bgColor: "bg-emerald-500/20 border-emerald-500/40", label: "Excellent" };
  if (captureRate >= 75)
    return { grade: "B", color: "text-blue-400", bgColor: "bg-blue-500/20 border-blue-500/40", label: "Good" };
  if (captureRate >= 60)
    return { grade: "C", color: "text-yellow-400", bgColor: "bg-yellow-500/20 border-yellow-500/40", label: "Average" };
  if (captureRate >= 45)
    return { grade: "D", color: "text-orange-400", bgColor: "bg-orange-500/20 border-orange-500/40", label: "Below Average" };
  return { grade: "F", color: "text-red-400", bgColor: "bg-red-500/20 border-red-500/40", label: "Poor" };
}

export function estimateStateMissedRevenue(
  avgPayment: number,
  providerCount: number
): number {
  // Estimate based on national avg gap of ~15-25% of total Medicare payment
  const avgGapRate = 0.18;
  return Math.round(avgPayment * providerCount * avgGapRate);
}

export function estimatePerProviderGap(avgPayment: number): number {
  return Math.round(avgPayment * 0.18);
}

export function estimateCaptureRate(
  ccmRate: number,
  rpmRate: number,
  bhiRate: number,
  awvRate: number,
  pct99214: number,
  pct99215: number
): number {
  // Weighted score: program adoption + coding optimization
  const programScore =
    (ccmRate / 15) * 25 + // CCM target ~15%
    (rpmRate / 10) * 20 + // RPM target ~10%
    (bhiRate / 8) * 15 + // BHI target ~8%
    (awvRate / 50) * 15; // AWV target ~50%

  const codingScore =
    (Math.min(pct99214, 55) / 55) * 15 + // 99214 target ~55%
    (Math.min(pct99215, 15) / 15) * 10; // 99215 target ~15%

  return Math.min(Math.round(programScore + codingScore), 100);
}

export function generateShareText(
  type: "state" | "specialty" | "city" | "national",
  name: string,
  stats: {
    providers?: number;
    missedRevenue?: string;
    grade?: string;
    topGap?: string;
  }
): { twitter: string; linkedin: string } {
  const url = `https://npixray.com/reports/${type === "national" ? "national" : type === "state" ? `states/${name.toLowerCase().replace(/\s+/g, "-")}` : type === "specialty" ? `specialties/${name.toLowerCase().replace(/[\s\/]+/g, "-")}` : ""}`;

  if (type === "state") {
    return {
      twitter: `${name} Medicare providers are leaving an estimated ${stats.missedRevenue} in revenue uncaptured. Grade: ${stats.grade}. See the data:\n${url}`,
      linkedin: `New data: ${name} has ${stats.providers?.toLocaleString()} Medicare providers with an estimated ${stats.missedRevenue} in uncaptured revenue.\n\nReport card grade: ${stats.grade}\n\nThe biggest opportunity? ${stats.topGap || "Care management programs"} remain severely underadopted.\n\nFull report with real CMS data: ${url}\n\n#MedicareBilling #HealthcareRevenue #RevenueOptimization`,
    };
  }

  if (type === "specialty") {
    return {
      twitter: `${name} practices miss an avg of ${stats.missedRevenue}/year in billable Medicare revenue. Grade: ${stats.grade}. Data from 1.175M providers:\n${url}`,
      linkedin: `Interesting data for ${name} practices:\n\n${stats.providers?.toLocaleString()} Medicare providers nationally, with an average estimated revenue gap of ${stats.missedRevenue} per practice.\n\nReport card grade: ${stats.grade}\n\nBased on analysis of 1,175,281 Medicare providers and 8.15M billing records from CMS public data.\n\nFull report: ${url}\n\n#MedicareBilling #${name.replace(/[\s\/]+/g, "")} #HealthcareRevenue`,
    };
  }

  return {
    twitter: `US Medicare providers left an estimated ${stats.missedRevenue} on the table. Here's the state-by-state breakdown:\n${url}`,
    linkedin: `New analysis: US Medicare providers are leaving billions in revenue uncaptured annually.\n\nKey findings from 1,175,281 providers and 8.15M billing records:\n- CCM adoption: only 4.2% of eligible providers\n- RPM adoption: only 2.1%\n- Average E&M undercoding gap: $15K-35K/provider\n\nFull national report: ${url}\n\n#MedicareBilling #HealthcareRevenue #CMS`,
  };
}
