import { NextRequest, NextResponse } from "next/server";
import {
  getStateStats,
  getAllStates,
  getAllBenchmarks,
  getBenchmarkBySpecialty,
  stateAbbrToName,
  slugToStateAbbr,
  specialtyToSlug,
  stateToSlug,
  formatCurrency,
  formatNumber,
  type StateStats,
  type BenchmarkRow,
} from "@/lib/db-queries";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stateGrade(stats: StateStats, allStates: StateStats[]): { letter: string; color: string } {
  const avgPayments = allStates.map((s) => s.avgPayment);
  const maxAvg = Math.max(...avgPayments);
  const minAvg = Math.min(...avgPayments);
  const range = maxAvg - minAvg || 1;
  const score = Math.round(((stats.avgPayment - minAvg) / range) * 40 + 60);
  if (score >= 90) return { letter: "A", color: "#22c55e" };
  if (score >= 80) return { letter: "B", color: "#84cc16" };
  if (score >= 70) return { letter: "C", color: "#E8A824" };
  if (score >= 60) return { letter: "D", color: "#f97316" };
  return { letter: "F", color: "#ef4444" };
}

function specialtyGrade(b: BenchmarkRow): { letter: string; color: string } {
  const emScore = Math.min((b.pct_99214 + b.pct_99215) * 100, 40);
  const adoptionScore =
    (b.ccm_adoption_rate + b.rpm_adoption_rate + b.bhi_adoption_rate + b.awv_adoption_rate) * 50;
  const score = Math.round(Math.min(emScore + adoptionScore + 30, 100));
  if (score >= 90) return { letter: "A", color: "#22c55e" };
  if (score >= 80) return { letter: "B", color: "#84cc16" };
  if (score >= 70) return { letter: "C", color: "#E8A824" };
  if (score >= 60) return { letter: "D", color: "#f97316" };
  return { letter: "F", color: "#ef4444" };
}

async function buildStateWidget(stateAbbr: string): Promise<string | null> {
  const stats = await getStateStats(stateAbbr);
  if (!stats || !stats.totalProviders) return null;

  const stateName = stateAbbrToName(stateAbbr);
  const allStates = await getAllStates();
  const grade = stateGrade(stats, allStates);
  const slug = stateToSlug(stateAbbr);

  return buildWidgetHtml({
    title: `${stateName} Medicare Report`,
    gradeLetter: grade.letter,
    gradeColor: grade.color,
    stat1Label: "Providers",
    stat1Value: formatNumber(stats.totalProviders),
    stat2Label: "Avg Payment",
    stat2Value: formatCurrency(stats.avgPayment),
    reportUrl: `https://npixray.com/states/${slug}`,
  });
}

async function buildSpecialtyWidget(specialtySlug: string): Promise<string | null> {
  const benchmarks = await getAllBenchmarks();
  const benchmark = benchmarks.find((b) => specialtyToSlug(b.specialty) === specialtySlug) ?? null;
  if (!benchmark) return null;

  const grade = specialtyGrade(benchmark);
  const slug = specialtyToSlug(benchmark.specialty);

  return buildWidgetHtml({
    title: `${benchmark.specialty} Medicare Report`,
    gradeLetter: grade.letter,
    gradeColor: grade.color,
    stat1Label: "Providers",
    stat1Value: formatNumber(benchmark.provider_count),
    stat2Label: "Avg Payment",
    stat2Value: formatCurrency(benchmark.avg_total_payment),
    reportUrl: `https://npixray.com/specialties/${slug}`,
  });
}

interface WidgetData {
  title: string;
  gradeLetter: string;
  gradeColor: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  reportUrl: string;
}

function buildWidgetHtml(data: WidgetData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(data.title)} | NPIxray</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #0c0b09;
    color: #f5f5f0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .widget {
    width: 100%;
    max-width: 380px;
    margin: 12px auto;
    background: #15140e;
    border: 1px solid #2a2820;
    border-radius: 12px;
    padding: 20px;
  }
  .widget-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }
  .grade {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .widget-title {
    font-size: 15px;
    font-weight: 600;
    color: #f5f5f0;
    line-height: 1.3;
  }
  .widget-sub {
    font-size: 11px;
    color: #a09c8c;
    margin-top: 2px;
  }
  .stats-row {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
  .stat {
    flex: 1;
    background: #0c0b09;
    border: 1px solid #2a2820;
    border-radius: 8px;
    padding: 10px 12px;
    text-align: center;
  }
  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #E8A824;
    font-variant-numeric: tabular-nums;
  }
  .stat-label {
    font-size: 10px;
    color: #a09c8c;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }
  .powered-by {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid #2a2820;
  }
  .powered-by-text {
    font-size: 10px;
    color: #a09c8c;
  }
  .powered-by-text strong {
    color: #E8A824;
    font-weight: 600;
  }
  .powered-by a {
    font-size: 11px;
    color: #E8A824;
    text-decoration: none;
    font-weight: 600;
    transition: opacity 0.2s;
  }
  .powered-by a:hover { opacity: 0.8; }
</style>
</head>
<body>
  <div class="widget">
    <div class="widget-header">
      <div class="grade" style="background:${data.gradeColor}">${escapeHtml(data.gradeLetter)}</div>
      <div>
        <div class="widget-title">${escapeHtml(data.title)}</div>
        <div class="widget-sub">CMS Medicare Data Analysis</div>
      </div>
    </div>
    <div class="stats-row">
      <div class="stat">
        <div class="stat-value">${escapeHtml(data.stat1Value)}</div>
        <div class="stat-label">${escapeHtml(data.stat1Label)}</div>
      </div>
      <div class="stat">
        <div class="stat-value">${escapeHtml(data.stat2Value)}</div>
        <div class="stat-label">${escapeHtml(data.stat2Label)}</div>
      </div>
    </div>
    <div class="powered-by">
      <div class="powered-by-text">Powered by <strong>NPIxray</strong></div>
      <a href="${escapeHtml(data.reportUrl)}" target="_blank" rel="noopener">See Full Report &rarr;</a>
    </div>
  </div>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type) {
    return NextResponse.json(
      { error: "Missing 'type' parameter. Use: state or specialty" },
      { status: 400 }
    );
  }

  let html: string | null = null;

  switch (type) {
    case "state": {
      if (!id) {
        return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 });
      }
      const abbr = slugToStateAbbr(id) || id.toUpperCase();
      html = await buildStateWidget(abbr);
      break;
    }
    case "specialty": {
      if (!id) {
        return NextResponse.json({ error: "Missing 'id' parameter" }, { status: 400 });
      }
      html = await buildSpecialtyWidget(id);
      break;
    }
    default:
      return NextResponse.json(
        { error: "Invalid type. Use: state or specialty" },
        { status: 400 }
      );
  }

  if (!html) {
    return NextResponse.json({ error: "Widget data not found" }, { status: 404 });
  }

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Frame-Options": "ALLOWALL",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
