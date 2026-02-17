import { NextRequest, NextResponse } from "next/server";
import {
  getStateStats,
  getBenchmarkBySpecialty,
  stateAbbrToName,
  slugToStateAbbr,
  specialtyToSlug,
  stateToSlug,
} from "@/lib/db-queries";
import { SPECIALTY_LIST } from "@/lib/benchmark-data";
import { formatCurrency, formatNumber } from "@/lib/format";
import { calculateGrade, estimatePerProviderGap, estimateCaptureRate } from "@/lib/report-utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "state";
  const id = searchParams.get("id") || "CA";

  let name = "";
  let grade = "C";
  let gradeColor = "#eab308";
  let stat1 = "";
  let stat2 = "";
  let reportUrl = "https://npixray.com/reports";

  if (type === "state") {
    const abbr = slugToStateAbbr(id) || id.toUpperCase();
    name = stateAbbrToName(abbr);
    const stats = await getStateStats(abbr);
    if (stats) {
      const allStates = await (await import("@/lib/db-queries")).getAllStates();
      const nationalAvg = allStates.reduce((a: number, b: any) => a + b.avgPayment, 0) / allStates.length;
      const rate = Math.min(Math.round((stats.avgPayment / (nationalAvg * 1.3)) * 75 + 15), 95);
      const gi = calculateGrade(rate);
      grade = gi.grade;
      gradeColor = gi.grade === "A" ? "#10b981" : gi.grade === "B" ? "#3b82f6" : gi.grade === "C" ? "#eab308" : gi.grade === "D" ? "#f97316" : "#ef4444";
      stat1 = `${formatNumber(stats.totalProviders)} providers`;
      stat2 = `~${formatCurrency(estimatePerProviderGap(stats.avgPayment))} avg gap`;
      reportUrl = `https://npixray.com/reports/states/${stateToSlug(abbr)}`;
    }
  } else {
    const specialty = SPECIALTY_LIST.find((s) => specialtyToSlug(s) === id) || id;
    name = specialty;
    const benchmark = await getBenchmarkBySpecialty(specialty);
    if (benchmark) {
      const rate = estimateCaptureRate(benchmark.ccm_adoption_rate, benchmark.rpm_adoption_rate, benchmark.bhi_adoption_rate, benchmark.awv_adoption_rate, benchmark.pct_99214, benchmark.pct_99215);
      const gi = calculateGrade(rate);
      grade = gi.grade;
      gradeColor = gi.grade === "A" ? "#10b981" : gi.grade === "B" ? "#3b82f6" : gi.grade === "C" ? "#eab308" : gi.grade === "D" ? "#f97316" : "#ef4444";
      stat1 = `${formatNumber(benchmark.provider_count)} providers`;
      stat2 = `~${formatCurrency(estimatePerProviderGap(benchmark.avg_total_payment))} avg gap`;
      reportUrl = `https://npixray.com/reports/specialties/${specialtyToSlug(specialty)}`;
    }
  }

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f0f1a;color:#e5e5e5;padding:16px;height:180px;overflow:hidden}
.card{border:1px solid #2a2a3a;border-radius:12px;padding:16px;height:148px;display:flex;flex-direction:column;justify-content:space-between}
.top{display:flex;align-items:center;gap:12px}
.grade{width:48px;height:48px;border-radius:50%;border:2px solid ${gradeColor};display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;color:${gradeColor}}
.name{font-size:16px;font-weight:600}
.stats{font-size:12px;color:#999;margin-top:4px}
.bottom{display:flex;justify-content:space-between;align-items:center}
.powered{font-size:10px;color:#666}
a{color:#E8A824;text-decoration:none;font-size:12px;font-weight:600}
a:hover{text-decoration:underline}
</style></head><body>
<div class="card">
<div class="top">
<div class="grade">${grade}</div>
<div><div class="name">${name}</div><div class="stats">${stat1} | ${stat2}</div></div>
</div>
<div class="bottom">
<span class="powered">Powered by NPIxray</span>
<a href="${reportUrl}" target="_blank">See Full Report &rarr;</a>
</div>
</div>
</body></html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}
