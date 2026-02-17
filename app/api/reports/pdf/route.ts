import { NextRequest, NextResponse } from "next/server";
import {
  getStateStats,
  getAllStates,
  getAllBenchmarks,
  getBenchmarkBySpecialty,
  getNationalStats,
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

function computeGrade(score: number): { letter: string; color: string } {
  if (score >= 90) return { letter: "A", color: "#22c55e" };
  if (score >= 80) return { letter: "B", color: "#84cc16" };
  if (score >= 70) return { letter: "C", color: "#E8A824" };
  if (score >= 60) return { letter: "D", color: "#f97316" };
  return { letter: "F", color: "#ef4444" };
}

function stateScore(stats: StateStats, allStates: StateStats[]): number {
  const avgPayments = allStates.map((s) => s.avgPayment);
  const maxAvg = Math.max(...avgPayments);
  const minAvg = Math.min(...avgPayments);
  const range = maxAvg - minAvg || 1;
  return Math.round(((stats.avgPayment - minAvg) / range) * 40 + 60);
}

function specialtyScore(b: BenchmarkRow): number {
  const emScore = Math.min((b.pct_99214 + b.pct_99215) * 100, 40);
  const adoptionScore =
    (b.ccm_adoption_rate + b.rpm_adoption_rate + b.bhi_adoption_rate + b.awv_adoption_rate) * 50;
  return Math.round(Math.min(emScore + adoptionScore + 30, 100));
}

const BASE_CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #ffffff;
    color: #1a1a1a;
    line-height: 1.6;
    padding: 0;
  }
  .page { max-width: 800px; margin: 0 auto; padding: 40px; }
  @media print {
    .page { padding: 20px; }
    .no-print { display: none !important; }
    @page { margin: 0.75in; }
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 3px solid #E8A824;
    padding-bottom: 16px;
    margin-bottom: 32px;
  }
  .logo { font-size: 28px; font-weight: 700; color: #0c0b09; letter-spacing: -0.5px; }
  .logo span { color: #E8A824; }
  .report-date { font-size: 12px; color: #666; }
  .title-section { margin-bottom: 32px; }
  .title-section h1 { font-size: 24px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
  .title-section p { font-size: 14px; color: #666; }
  .grade-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin-right: 16px;
    vertical-align: middle;
  }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
  .stat-card {
    background: #f8f8f6;
    border: 1px solid #e5e5e0;
    border-radius: 8px;
    padding: 16px;
  }
  .stat-card .label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .stat-card .value { font-size: 22px; font-weight: 700; color: #E8A824; font-variant-numeric: tabular-nums; }
  .section { margin-bottom: 32px; }
  .section h2 { font-size: 18px; font-weight: 600; color: #1a1a1a; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid #e5e5e0; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead th { background: #f8f8f6; text-align: left; padding: 10px 12px; font-weight: 600; color: #555; border-bottom: 2px solid #e5e5e0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
  tbody td { padding: 10px 12px; border-bottom: 1px solid #f0f0ec; }
  tbody tr:nth-child(even) { background: #fafaf8; }
  .text-right { text-align: right; }
  .text-gold { color: #E8A824; font-weight: 600; }
  .bar-container { background: #e5e5e0; border-radius: 4px; height: 8px; width: 100%; }
  .bar-fill { background: #E8A824; border-radius: 4px; height: 8px; }
  .footer {
    margin-top: 48px;
    padding-top: 16px;
    border-top: 2px solid #E8A824;
    font-size: 11px;
    color: #888;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .footer a { color: #E8A824; text-decoration: none; font-weight: 600; }
  .print-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #E8A824;
    color: #0c0b09;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  .print-btn:hover { background: #d49a1f; }
`;

function buildHeader(): string {
  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `
    <div class="header">
      <div class="logo">NPI<span>xray</span></div>
      <div class="report-date">Generated ${escapeHtml(now)}</div>
    </div>
  `;
}

function buildFooter(): string {
  return `
    <div class="footer">
      <div>
        Data source: CMS Medicare Physician &amp; Other Practitioners<br>
        This report uses publicly available government data.
      </div>
      <div>
        Scan your NPI at <a href="https://npixray.com">npixray.com</a>
      </div>
    </div>
  `;
}

function buildPrintButton(): string {
  return `<button class="print-btn no-print" onclick="window.print()">Print / Save as PDF</button>`;
}

function buildStateReport(stateAbbr: string): string | null {
  const stats = getStateStats(stateAbbr);
  if (!stats || !stats.totalProviders) return null;

  const stateName = stateAbbrToName(stateAbbr);
  const allStates = getAllStates();
  const score = stateScore(stats, allStates);
  const grade = computeGrade(score);

  // Get rank among all states
  const sorted = [...allStates].sort((a, b) => b.avgPayment - a.avgPayment);
  const rank = sorted.findIndex((s) => s.state === stateAbbr) + 1;

  // Top 10 states for comparison
  const top10 = sorted.slice(0, 10);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(stateName)} Medicare Revenue Report | NPIxray</title>
      <style>${BASE_CSS}</style>
    </head>
    <body>
      ${buildPrintButton()}
      <div class="page">
        ${buildHeader()}

        <div class="title-section">
          <h1>
            <span class="grade-badge" style="background:${grade.color}">${grade.letter}</span>
            ${escapeHtml(stateName)} Medicare Revenue Report
          </h1>
          <p>State-level analysis of ${formatNumber(stats.totalProviders)} Medicare providers in ${escapeHtml(stateName)} (${escapeHtml(stateAbbr)})</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">Total Providers</div>
            <div class="value">${formatNumber(stats.totalProviders)}</div>
          </div>
          <div class="stat-card">
            <div class="label">Total Medicare Payment</div>
            <div class="value">${formatCurrency(stats.totalPayment)}</div>
          </div>
          <div class="stat-card">
            <div class="label">Avg Payment / Provider</div>
            <div class="value">${formatCurrency(stats.avgPayment)}</div>
          </div>
          <div class="stat-card">
            <div class="label">National Rank</div>
            <div class="value">#${rank}</div>
          </div>
        </div>

        <div class="section">
          <h2>Performance Score: ${score}/100</h2>
          <div class="bar-container" style="height:12px;margin-bottom:8px;">
            <div class="bar-fill" style="width:${score}%;height:12px;"></div>
          </div>
          <p style="font-size:13px;color:#666;">
            Based on average Medicare payment per provider compared to national benchmarks.
            Rank ${rank} out of ${allStates.length} states and territories.
          </p>
        </div>

        <div class="section">
          <h2>State Comparison — Top 10 by Avg Payment</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>State</th>
                <th class="text-right">Providers</th>
                <th class="text-right">Avg Payment</th>
                <th class="text-right">Total Payment</th>
              </tr>
            </thead>
            <tbody>
              ${top10
                .map(
                  (s, i) => `
                <tr${s.state === stateAbbr ? ' style="background:#FDF8E8;font-weight:600;"' : ""}>
                  <td>#${i + 1}</td>
                  <td>${escapeHtml(stateAbbrToName(s.state))} (${escapeHtml(s.state)})</td>
                  <td class="text-right">${formatNumber(s.totalProviders)}</td>
                  <td class="text-right text-gold">${formatCurrency(s.avgPayment)}</td>
                  <td class="text-right">${formatCurrency(s.totalPayment)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Key Insights</h2>
          <ul style="list-style:none;padding:0;">
            <li style="padding:8px 0;border-bottom:1px solid #f0f0ec;">
              <strong>${escapeHtml(stateName)}</strong> ranks <strong>#${rank}</strong> nationally by average Medicare payment per provider.
            </li>
            <li style="padding:8px 0;border-bottom:1px solid #f0f0ec;">
              Total Medicare spending in ${escapeHtml(stateName)}: <strong class="text-gold">${formatCurrency(stats.totalPayment)}</strong> across ${formatNumber(stats.totalProviders)} providers.
            </li>
            <li style="padding:8px 0;">
              Average payment per provider: <strong class="text-gold">${formatCurrency(stats.avgPayment)}</strong>.
            </li>
          </ul>
        </div>

        ${buildFooter()}
      </div>
    </body>
    </html>
  `;
}

function buildSpecialtyReport(specialtySlug: string): string | null {
  const benchmarks = getAllBenchmarks();
  const benchmark = benchmarks.find((b) => specialtyToSlug(b.specialty) === specialtySlug) ?? null;
  if (!benchmark) return null;

  const score = specialtyScore(benchmark);
  const grade = computeGrade(score);

  const emTotal = benchmark.pct_99213 + benchmark.pct_99214 + benchmark.pct_99215;
  const em213Pct = emTotal > 0 ? ((benchmark.pct_99213 / emTotal) * 100).toFixed(1) : "0";
  const em214Pct = emTotal > 0 ? ((benchmark.pct_99214 / emTotal) * 100).toFixed(1) : "0";
  const em215Pct = emTotal > 0 ? ((benchmark.pct_99215 / emTotal) * 100).toFixed(1) : "0";

  const programs = [
    { name: "CCM (Chronic Care Management)", rate: benchmark.ccm_adoption_rate, target: 0.15 },
    { name: "RPM (Remote Patient Monitoring)", rate: benchmark.rpm_adoption_rate, target: 0.10 },
    { name: "BHI (Behavioral Health Integration)", rate: benchmark.bhi_adoption_rate, target: 0.10 },
    { name: "AWV (Annual Wellness Visits)", rate: benchmark.awv_adoption_rate, target: 0.70 },
  ];

  // Find biggest gap
  const gaps = programs.map((p) => ({
    name: p.name,
    gap: p.target - p.rate,
    gapPct: ((p.target - p.rate) * 100).toFixed(1),
  }));
  const biggestGap = gaps.sort((a, b) => b.gap - a.gap)[0];

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${escapeHtml(benchmark.specialty)} Medicare Report | NPIxray</title>
      <style>${BASE_CSS}</style>
    </head>
    <body>
      ${buildPrintButton()}
      <div class="page">
        ${buildHeader()}

        <div class="title-section">
          <h1>
            <span class="grade-badge" style="background:${grade.color}">${grade.letter}</span>
            ${escapeHtml(benchmark.specialty)} Medicare Report
          </h1>
          <p>National specialty analysis of ${formatNumber(benchmark.provider_count)} Medicare providers</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">Provider Count</div>
            <div class="value">${formatNumber(benchmark.provider_count)}</div>
          </div>
          <div class="stat-card">
            <div class="label">Avg Medicare Patients</div>
            <div class="value">${formatNumber(benchmark.avg_medicare_patients)}</div>
          </div>
          <div class="stat-card">
            <div class="label">Avg Total Payment</div>
            <div class="value">${formatCurrency(benchmark.avg_total_payment)}</div>
          </div>
          <div class="stat-card">
            <div class="label">Avg Revenue/Patient</div>
            <div class="value">${formatCurrency(benchmark.avg_revenue_per_patient)}</div>
          </div>
        </div>

        <div class="section">
          <h2>E&M Coding Distribution</h2>
          <p style="font-size:13px;color:#666;margin-bottom:16px;">
            How ${escapeHtml(benchmark.specialty)} providers distribute evaluation and management visits across complexity levels.
          </p>
          <table>
            <thead>
              <tr>
                <th>CPT Code</th>
                <th>Level</th>
                <th class="text-right">Distribution</th>
                <th style="width:40%;">Visual</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>99213</strong></td>
                <td>Level 3 (Low Complexity)</td>
                <td class="text-right">${em213Pct}%</td>
                <td><div class="bar-container"><div class="bar-fill" style="width:${em213Pct}%;background:#f59e0b;"></div></div></td>
              </tr>
              <tr>
                <td><strong>99214</strong></td>
                <td>Level 4 (Moderate Complexity)</td>
                <td class="text-right text-gold">${em214Pct}%</td>
                <td><div class="bar-container"><div class="bar-fill" style="width:${em214Pct}%;"></div></div></td>
              </tr>
              <tr>
                <td><strong>99215</strong></td>
                <td>Level 5 (High Complexity)</td>
                <td class="text-right">${em215Pct}%</td>
                <td><div class="bar-container"><div class="bar-fill" style="width:${Math.min(parseFloat(em215Pct) * 2, 100)}%;background:#22c55e;"></div></div></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Care Management Program Adoption</h2>
          <p style="font-size:13px;color:#666;margin-bottom:16px;">
            Current adoption rates vs. target benchmarks. The biggest opportunity for ${escapeHtml(benchmark.specialty)} is <strong>${escapeHtml(biggestGap.name)}</strong> with a ${biggestGap.gapPct}% gap to target.
          </p>
          <table>
            <thead>
              <tr>
                <th>Program</th>
                <th class="text-right">Current</th>
                <th class="text-right">Target</th>
                <th class="text-right">Gap</th>
                <th style="width:30%;">Progress</th>
              </tr>
            </thead>
            <tbody>
              ${programs
                .map((p) => {
                  const currentPct = (p.rate * 100).toFixed(1);
                  const targetPct = (p.target * 100).toFixed(0);
                  const gapPct = ((p.target - p.rate) * 100).toFixed(1);
                  const fillPct = Math.min((p.rate / p.target) * 100, 100);
                  return `
                  <tr>
                    <td><strong>${escapeHtml(p.name)}</strong></td>
                    <td class="text-right">${currentPct}%</td>
                    <td class="text-right">${targetPct}%</td>
                    <td class="text-right" style="color:#ef4444;">${gapPct}%</td>
                    <td><div class="bar-container"><div class="bar-fill" style="width:${fillPct}%;"></div></div></td>
                  </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Revenue Opportunity Summary</h2>
          <ul style="list-style:none;padding:0;">
            <li style="padding:8px 0;border-bottom:1px solid #f0f0ec;">
              <strong>${escapeHtml(benchmark.specialty)}</strong> averages <strong class="text-gold">${formatCurrency(benchmark.avg_total_payment)}</strong> per provider in Medicare payments.
            </li>
            <li style="padding:8px 0;border-bottom:1px solid #f0f0ec;">
              At <strong class="text-gold">${formatCurrency(benchmark.avg_revenue_per_patient)}</strong> per patient, there are ${formatNumber(benchmark.avg_medicare_patients)} Medicare patients on average.
            </li>
            <li style="padding:8px 0;">
              Biggest program adoption gap: <strong>${escapeHtml(biggestGap.name)}</strong> at ${biggestGap.gapPct}% below target.
            </li>
          </ul>
        </div>

        ${buildFooter()}
      </div>
    </body>
    </html>
  `;
}

function buildNationalReport(): string | null {
  const national = getNationalStats();
  const allStates = getAllStates();
  const benchmarks = getAllBenchmarks();

  if (!national || allStates.length === 0) return null;

  const top10States = [...allStates].sort((a, b) => b.avgPayment - a.avgPayment).slice(0, 10);
  const topSpecialties = benchmarks.slice(0, 10);

  const avgPayment = national.totalProviders > 0 ? national.totalPayment / national.totalProviders : 0;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>National Medicare Revenue Report | NPIxray</title>
      <style>${BASE_CSS}</style>
    </head>
    <body>
      ${buildPrintButton()}
      <div class="page">
        ${buildHeader()}

        <div class="title-section">
          <h1>
            <span class="grade-badge" style="background:#E8A824">US</span>
            National Medicare Revenue Report
          </h1>
          <p>Comprehensive analysis of ${formatNumber(national.totalProviders)} Medicare providers across all states and specialties</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">Total Providers</div>
            <div class="value">${formatNumber(national.totalProviders)}</div>
          </div>
          <div class="stat-card">
            <div class="label">Total Medicare Payment</div>
            <div class="value">${formatCurrency(national.totalPayment)}</div>
          </div>
          <div class="stat-card">
            <div class="label">Avg Payment / Provider</div>
            <div class="value">${formatCurrency(avgPayment)}</div>
          </div>
          <div class="stat-card">
            <div class="label">States & Territories</div>
            <div class="value">${allStates.length}</div>
          </div>
        </div>

        <div class="section">
          <h2>Top 10 States by Average Payment</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>State</th>
                <th class="text-right">Providers</th>
                <th class="text-right">Avg Payment</th>
                <th class="text-right">Total Payment</th>
              </tr>
            </thead>
            <tbody>
              ${top10States
                .map(
                  (s, i) => `
                <tr>
                  <td>#${i + 1}</td>
                  <td>${escapeHtml(stateAbbrToName(s.state))} (${escapeHtml(s.state)})</td>
                  <td class="text-right">${formatNumber(s.totalProviders)}</td>
                  <td class="text-right text-gold">${formatCurrency(s.avgPayment)}</td>
                  <td class="text-right">${formatCurrency(s.totalPayment)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Top 10 Specialties by Provider Count</h2>
          <table>
            <thead>
              <tr>
                <th>Specialty</th>
                <th class="text-right">Providers</th>
                <th class="text-right">Avg Payment</th>
                <th class="text-right">CCM Adoption</th>
                <th class="text-right">AWV Adoption</th>
              </tr>
            </thead>
            <tbody>
              ${topSpecialties
                .map(
                  (b) => `
                <tr>
                  <td><strong>${escapeHtml(b.specialty)}</strong></td>
                  <td class="text-right">${formatNumber(b.provider_count)}</td>
                  <td class="text-right text-gold">${formatCurrency(b.avg_total_payment)}</td>
                  <td class="text-right">${(b.ccm_adoption_rate * 100).toFixed(1)}%</td>
                  <td class="text-right">${(b.awv_adoption_rate * 100).toFixed(1)}%</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Key National Insights</h2>
          <ul style="list-style:none;padding:0;">
            <li style="padding:8px 0;border-bottom:1px solid #f0f0ec;">
              <strong>${formatNumber(national.totalProviders)}</strong> Medicare providers generated <strong class="text-gold">${formatCurrency(national.totalPayment)}</strong> in total Medicare payments.
            </li>
            <li style="padding:8px 0;border-bottom:1px solid #f0f0ec;">
              Average Medicare payment per provider: <strong class="text-gold">${formatCurrency(avgPayment)}</strong>.
            </li>
            <li style="padding:8px 0;border-bottom:1px solid #f0f0ec;">
              <strong>${allStates.length}</strong> states and territories analyzed with ${formatNumber(national.totalServices)} total services rendered.
            </li>
            <li style="padding:8px 0;">
              Care management programs (CCM, RPM, BHI, AWV) represent the largest untapped revenue opportunity across all specialties.
            </li>
          </ul>
        </div>

        ${buildFooter()}
      </div>
    </body>
    </html>
  `;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type) {
    return NextResponse.json(
      { error: "Missing 'type' parameter. Use: state, specialty, or national" },
      { status: 400 }
    );
  }

  let html: string | null = null;

  switch (type) {
    case "state": {
      if (!id) {
        return NextResponse.json({ error: "Missing 'id' parameter (state abbreviation or slug)" }, { status: 400 });
      }
      const abbr = slugToStateAbbr(id) || id.toUpperCase();
      html = buildStateReport(abbr);
      break;
    }
    case "specialty": {
      if (!id) {
        return NextResponse.json({ error: "Missing 'id' parameter (specialty slug)" }, { status: 400 });
      }
      html = buildSpecialtyReport(id);
      break;
    }
    case "national": {
      html = buildNationalReport();
      break;
    }
    default:
      return NextResponse.json(
        { error: "Invalid type. Use: state, specialty, or national" },
        { status: 400 }
      );
  }

  if (!html) {
    return NextResponse.json({ error: "Report data not found" }, { status: 404 });
  }

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
