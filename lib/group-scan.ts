/**
 * Group Practice Scan — batch scan + aggregation engine.
 *
 * Scans multiple NPIs in parallel (concurrency-limited) using the
 * existing `performScan()` pipeline, then aggregates results into
 * a practice-level GroupScanResult.
 */

import { performScan } from "@/lib/scan";
import { calculateRevenueScoreFromScan, getScoreTier, SCORE_TIERS } from "@/lib/revenue-score";
import type {
  ScanResult,
  GroupScanResult,
  ProviderScanSummary,
  PracticeActionItem,
} from "@/lib/types";

// ── Concurrency-limited batch scan ────────────────────────

const MAX_CONCURRENT = 5;

export async function scanBatch(
  npis: string[]
): Promise<Map<string, { result: ScanResult | null; error?: string }>> {
  const results = new Map<string, { result: ScanResult | null; error?: string }>();
  const queue = [...npis];

  async function worker() {
    while (queue.length > 0) {
      const npi = queue.shift()!;
      try {
        const result = await performScan(npi);
        results.set(npi, { result });
      } catch (err) {
        results.set(npi, {
          result: null,
          error: err instanceof Error ? err.message : "Scan failed",
        });
      }
    }
  }

  // Spawn concurrent workers
  await Promise.all(
    Array.from({ length: Math.min(MAX_CONCURRENT, npis.length) }, () => worker())
  );

  return results;
}

// ── Aggregate scan results into GroupScanResult ───────────

export function aggregateGroupResults(
  scanMap: Map<string, { result: ScanResult | null; error?: string }>,
  practiceName: string
): GroupScanResult {
  const providers: ProviderScanSummary[] = [];

  for (const [npi, entry] of scanMap) {
    if (entry.result) {
      const scan = entry.result;
      const scoreResult = calculateRevenueScoreFromScan(scan);
      const tier = getScoreTier(scoreResult.overall);

      providers.push({
        npi,
        fullName: scan.provider.fullName,
        credential: scan.provider.credential,
        specialty: scan.provider.specialty,
        city: scan.provider.address.city,
        state: scan.provider.address.state,
        revenueScore: scoreResult.overall,
        scoreTier: tier.label,
        scoreColor: tier.hexColor,
        currentRevenue: scan.billing.totalMedicarePayment,
        missedRevenue: scan.totalMissedRevenue,
        potentialRevenue: scan.billing.totalMedicarePayment + scan.totalMissedRevenue,
        codingGap: scan.codingGap.annualGap,
        ccmGap: scan.ccmGap.annualGap,
        rpmGap: scan.rpmGap.annualGap,
        bhiGap: scan.bhiGap.annualGap,
        awvGap: scan.awvGap.annualGap,
        dataSource: scan.dataSource,
        status: "success",
        fullScan: scan,
      });
    } else {
      providers.push({
        npi,
        fullName: `Provider ${npi}`,
        credential: "",
        specialty: "Unknown",
        city: "",
        state: "",
        revenueScore: 0,
        scoreTier: "Critical",
        scoreColor: "#f87171",
        currentRevenue: 0,
        missedRevenue: 0,
        potentialRevenue: 0,
        codingGap: 0,
        ccmGap: 0,
        rpmGap: 0,
        bhiGap: 0,
        awvGap: 0,
        dataSource: "estimated",
        status: "failed",
        fullScan: null,
      });
    }
  }

  const successful = providers.filter((p) => p.status === "success");
  const failed = providers.filter((p) => p.status === "failed");

  // Revenue aggregates
  const totalCurrentRevenue = successful.reduce((s, p) => s + p.currentRevenue, 0);
  const totalMissedRevenue = successful.reduce((s, p) => s + p.missedRevenue, 0);
  const totalPotentialRevenue = totalCurrentRevenue + totalMissedRevenue;
  const revenueIncreasePct = totalCurrentRevenue > 0
    ? Math.round((totalMissedRevenue / totalCurrentRevenue) * 100)
    : 0;

  // Score aggregates
  const averageRevenueScore = successful.length > 0
    ? Math.round(successful.reduce((s, p) => s + p.revenueScore, 0) / successful.length)
    : 0;

  // Score distribution by tier
  const scoreDistribution = SCORE_TIERS.map((tier) => ({
    tier: tier.label,
    count: successful.filter((p) => p.revenueScore >= tier.min && p.revenueScore <= tier.max).length,
    color: tier.hexColor,
  })).filter((d) => d.count > 0);

  // Gap aggregates
  const totalCodingGap = successful.reduce((s, p) => s + p.codingGap, 0);
  const totalCcmGap = successful.reduce((s, p) => s + p.ccmGap, 0);
  const totalRpmGap = successful.reduce((s, p) => s + p.rpmGap, 0);
  const totalBhiGap = successful.reduce((s, p) => s + p.bhiGap, 0);
  const totalAwvGap = successful.reduce((s, p) => s + p.awvGap, 0);

  // Program adoption
  const programAdoption = buildProgramAdoption(successful);

  // Specialty breakdown
  const specialtyMap = new Map<string, { count: number; totalRevenue: number }>();
  for (const p of successful) {
    const existing = specialtyMap.get(p.specialty) || { count: 0, totalRevenue: 0 };
    existing.count++;
    existing.totalRevenue += p.currentRevenue;
    specialtyMap.set(p.specialty, existing);
  }
  const specialtyBreakdown = Array.from(specialtyMap.entries())
    .map(([specialty, data]) => ({ specialty, ...data }))
    .sort((a, b) => b.count - a.count);

  // Rankings
  const sortedByScore = [...successful].sort((a, b) => b.revenueScore - a.revenueScore);
  const sortedByMissed = [...successful].sort((a, b) => b.missedRevenue - a.missedRevenue);

  // Practice action plan
  const practiceActionPlan = buildPracticeActionPlan(successful);

  // Data source counts
  const cmsDataCount = successful.filter((p) => p.dataSource === "cms").length;
  const estimatedDataCount = successful.filter((p) => p.dataSource === "estimated").length;

  return {
    practiceName,
    scannedAt: new Date().toISOString(),
    providers,
    totalProviders: providers.length,
    successfulScans: successful.length,
    failedScans: failed.length,
    totalCurrentRevenue,
    totalMissedRevenue,
    totalPotentialRevenue,
    revenueIncreasePct,
    averageRevenueScore,
    scoreDistribution,
    totalCodingGap,
    totalCcmGap,
    totalRpmGap,
    totalBhiGap,
    totalAwvGap,
    programAdoption,
    specialtyBreakdown,
    topPerformer: sortedByScore[0] ?? null,
    bottomPerformer: sortedByScore[sortedByScore.length - 1] ?? null,
    biggestOpportunity: sortedByMissed[0] ?? null,
    practiceActionPlan,
    cmsDataCount,
    estimatedDataCount,
  };
}

// ── Program adoption aggregation ─────────────────────────

function buildProgramAdoption(providers: ProviderScanSummary[]) {
  function adoption(gapKey: "ccmGap" | "rpmGap" | "bhiGap" | "awvGap") {
    const withGap = providers.filter((p) => p.fullScan != null);
    let enrolled = 0;
    let eligible = 0;

    for (const p of withGap) {
      const scan = p.fullScan!;
      let gap: { currentPatients: number; eligiblePatients: number };
      switch (gapKey) {
        case "ccmGap": gap = scan.ccmGap; break;
        case "rpmGap": gap = scan.rpmGap; break;
        case "bhiGap": gap = scan.bhiGap; break;
        case "awvGap": gap = scan.awvGap; break;
      }
      enrolled += gap.currentPatients;
      eligible += gap.eligiblePatients;
    }

    return {
      enrolled,
      eligible,
      rate: eligible > 0 ? Math.round((enrolled / eligible) * 100) : 0,
    };
  }

  return {
    ccm: adoption("ccmGap"),
    rpm: adoption("rpmGap"),
    bhi: adoption("bhiGap"),
    awv: adoption("awvGap"),
  };
}

// ── Practice-level action plan ───────────────────────────

function buildPracticeActionPlan(providers: ProviderScanSummary[]): PracticeActionItem[] {
  const items: PracticeActionItem[] = [];

  // Coding optimization
  const codingProviders = providers.filter((p) => p.codingGap > 5000);
  if (codingProviders.length > 0) {
    items.push({
      priority: 1,
      title: "Optimize E&M Coding Across Practice",
      description: `${codingProviders.length} provider${codingProviders.length > 1 ? "s" : ""} could benefit from documentation review and upcoding education. Focus on shifting appropriate visits from 99213 to 99214/99215.`,
      affectedProviders: codingProviders.length,
      totalEstimatedRevenue: codingProviders.reduce((s, p) => s + p.codingGap, 0),
      difficulty: "medium",
      category: "coding",
    });
  }

  // CCM
  const ccmProviders = providers.filter((p) => p.ccmGap > 3000);
  if (ccmProviders.length > 0) {
    items.push({
      priority: 2,
      title: "Launch Chronic Care Management (CCM) Program",
      description: `${ccmProviders.length} provider${ccmProviders.length > 1 ? "s" : ""} have eligible patients not enrolled in CCM. A practice-wide CCM program with dedicated care coordinators can capture this revenue.`,
      affectedProviders: ccmProviders.length,
      totalEstimatedRevenue: ccmProviders.reduce((s, p) => s + p.ccmGap, 0),
      difficulty: "medium",
      category: "ccm",
    });
  }

  // RPM
  const rpmProviders = providers.filter((p) => p.rpmGap > 2000);
  if (rpmProviders.length > 0) {
    items.push({
      priority: 3,
      title: "Implement Remote Patient Monitoring (RPM)",
      description: `${rpmProviders.length} provider${rpmProviders.length > 1 ? "s" : ""} have patients who would benefit from RPM. Deploy connected devices for blood pressure, glucose, and weight monitoring.`,
      affectedProviders: rpmProviders.length,
      totalEstimatedRevenue: rpmProviders.reduce((s, p) => s + p.rpmGap, 0),
      difficulty: "hard",
      category: "rpm",
    });
  }

  // AWV
  const awvProviders = providers.filter((p) => p.awvGap > 1000);
  if (awvProviders.length > 0) {
    items.push({
      priority: 4,
      title: "Increase Annual Wellness Visit (AWV) Capture",
      description: `${awvProviders.length} provider${awvProviders.length > 1 ? "s" : ""} are under-billing AWVs. Implement proactive patient outreach and scheduling for Medicare wellness visits.`,
      affectedProviders: awvProviders.length,
      totalEstimatedRevenue: awvProviders.reduce((s, p) => s + p.awvGap, 0),
      difficulty: "easy",
      category: "awv",
    });
  }

  // BHI
  const bhiProviders = providers.filter((p) => p.bhiGap > 1000);
  if (bhiProviders.length > 0) {
    items.push({
      priority: 5,
      title: "Add Behavioral Health Integration (BHI)",
      description: `${bhiProviders.length} provider${bhiProviders.length > 1 ? "s" : ""} have patients eligible for BHI services. Integrate depression screening and behavioral health follow-up into workflows.`,
      affectedProviders: bhiProviders.length,
      totalEstimatedRevenue: bhiProviders.reduce((s, p) => s + p.bhiGap, 0),
      difficulty: "medium",
      category: "bhi",
    });
  }

  // Sort by total revenue impact
  items.sort((a, b) => b.totalEstimatedRevenue - a.totalEstimatedRevenue);
  items.forEach((item, i) => (item.priority = i + 1));

  return items;
}
