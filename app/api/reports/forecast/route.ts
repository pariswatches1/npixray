import { NextRequest, NextResponse } from "next/server";

/**
 * Forecast PDF Report — returns printable HTML.
 * Query: ?npi=<npi>
 * Uses browser print-to-PDF (same approach as existing PDF reports).
 */
export async function GET(request: NextRequest) {
  const npi = request.nextUrl.searchParams.get("npi") || "";

  if (!npi || !/^\d{10}$/.test(npi)) {
    return NextResponse.json({ error: "Valid 10-digit NPI required" }, { status: 400 });
  }

  // Fetch scan data server-side
  const origin = request.nextUrl.origin;
  let scanData;
  try {
    const scanRes = await fetch(`${origin}/api/scan?npi=${npi}`, { cache: "no-store" });
    if (!scanRes.ok) throw new Error("Scan failed");
    const json = await scanRes.json();
    scanData = json.result;
  } catch {
    return NextResponse.json({ error: "Unable to fetch provider data" }, { status: 500 });
  }

  if (!scanData) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  // Build forecast data inline (same logic as client, but simplified for the report)
  const programs = [
    { name: "CCM (99490)", eligible: scanData.ccmGap?.eligiblePatients || 0, rate: 62, ramp: 0.5, months: [] as number[] },
    { name: "RPM (99454/57)", eligible: scanData.rpmGap?.eligiblePatients || 0, rate: 103, ramp: 0.4, months: [] as number[] },
    { name: "BHI (99484)", eligible: scanData.bhiGap?.eligiblePatients || 0, rate: 51, ramp: 0.3, months: [] as number[] },
    { name: "AWV (G0438/39)", eligible: scanData.awvGap?.eligiblePatients || 0, rate: 158, ramp: 0.7, months: [] as number[] },
  ];

  const emGapMonthly = Math.round((scanData.codingGap?.annualGap || 0) / 12);
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthly: { label: string; total: number; cumulative: number }[] = [];
  let cumulative = 0;

  for (let m = 1; m <= 12; m++) {
    const sigmoid = 1 / (1 + Math.exp(-0.8 * (m - 5)));
    let total = 0;

    for (const prog of programs) {
      const target = Math.round(prog.eligible * prog.ramp);
      const patients = Math.round(target * sigmoid);
      const rev = prog.name.includes("AWV")
        ? Math.round((target / 12) * Math.min(1, sigmoid * 1.5)) * prog.rate
        : patients * prog.rate;
      prog.months.push(rev);
      total += rev;
    }

    const emRev = Math.round(emGapMonthly * Math.min(m / 6, 1));
    total += emRev;
    cumulative += total;
    monthly.push({ label: monthLabels[m - 1], total, cumulative });
  }

  const totalYear1 = monthly.reduce((s, m) => s + m.total, 0);
  const month12Rate = monthly[11].total;
  const providerName = scanData.provider?.fullName || `NPI ${npi}`;
  const specialty = scanData.provider?.specialty || "Unknown";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>12-Month Revenue Forecast — ${providerName} | NPIxray</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #FFFFFF; color: #1A2B4A; padding: 40px; max-width: 900px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #2F5EA8; padding-bottom: 24px; }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .header .gold { color: #2F5EA8; }
    .header .meta { color: #6B7A99; font-size: 14px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
    .stat { background: #FFFFFF; border: 1px solid #E9EEF6; border-radius: 12px; padding: 16px; text-align: center; }
    .stat .label { font-size: 11px; color: #6B7A99; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .stat .value { font-size: 24px; font-weight: 700; color: #2F5EA8; }
    .stat .value.green { color: #34d399; }
    .stat .value.blue { color: #38bdf8; }
    .section { margin-bottom: 32px; }
    .section h2 { font-size: 20px; margin-bottom: 16px; color: #1A2B4A; }
    table { width: 100%; border-collapse: collapse; background: #FFFFFF; border-radius: 8px; overflow: hidden; }
    th { background: #E9EEF6; text-align: left; padding: 10px 16px; font-size: 12px; color: #6B7A99; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 10px 16px; font-size: 13px; border-top: 1px solid #E9EEF6; }
    .right { text-align: right; }
    .gold-text { color: #2F5EA8; font-weight: 700; }
    .green-text { color: #34d399; font-weight: 700; }
    .programs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 32px; }
    .program-card { background: #FFFFFF; border: 1px solid #E9EEF6; border-radius: 12px; padding: 20px; }
    .program-card h3 { font-size: 14px; margin-bottom: 12px; }
    .program-card .milestones { display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #E9EEF6; }
    .program-card .milestone { text-align: center; }
    .program-card .milestone .m-label { font-size: 10px; color: #6B7A99; }
    .program-card .milestone .m-value { font-size: 12px; font-weight: 700; }
    .footer { text-align: center; padding-top: 24px; border-top: 1px solid #E9EEF6; color: #6B7A99; font-size: 11px; }
    .print-btn { position: fixed; top: 20px; right: 20px; background: #2F5EA8; color: #FFFFFF; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 13px; z-index: 100; }
    .print-btn:hover { background: #D49A1F; }
    @media print { .print-btn { display: none !important; } body { padding: 20px; } @page { margin: 0.75in; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>

  <div class="header">
    <h1>12-Month <span class="gold">Revenue Forecast</span></h1>
    <div class="meta">${providerName} &middot; ${specialty} &middot; NPI ${npi}</div>
    <div class="meta" style="margin-top: 4px;">Generated ${new Date().toLocaleDateString()} by NPIxray.com</div>
  </div>

  <div class="stats">
    <div class="stat">
      <div class="label">Year 1 Additional</div>
      <div class="value">+$${Math.round(totalYear1).toLocaleString()}</div>
    </div>
    <div class="stat">
      <div class="label">Month 12 Rate</div>
      <div class="value green">+$${Math.round(month12Rate).toLocaleString()}/mo</div>
    </div>
    <div class="stat">
      <div class="label">Annualized at M12</div>
      <div class="value blue">+$${Math.round(month12Rate * 12).toLocaleString()}/yr</div>
    </div>
    <div class="stat">
      <div class="label">Current Revenue</div>
      <div class="value" style="color: #6B7A99;">$${Math.round(scanData.billing?.totalMedicarePayment || 0).toLocaleString()}</div>
    </div>
  </div>

  <div class="section">
    <h2>Monthly Projection</h2>
    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th class="right">Additional Revenue</th>
          <th class="right">Cumulative</th>
        </tr>
      </thead>
      <tbody>
        ${monthly.map((m) => `
        <tr>
          <td>${m.label}</td>
          <td class="right gold-text">+$${m.total.toLocaleString()}</td>
          <td class="right green-text">$${m.cumulative.toLocaleString()}</td>
        </tr>`).join("")}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2>Program Trajectories</h2>
    <div class="programs">
      ${programs.map((prog) => `
      <div class="program-card">
        <h3>${prog.name}</h3>
        <div style="font-size: 12px; color: #6B7A99; margin-bottom: 8px;">
          Target: ${Math.round(prog.eligible * prog.ramp)} patients &middot;
          Year 1: <span class="gold-text">$${prog.months.reduce((s, v) => s + v, 0).toLocaleString()}</span>
        </div>
        <div class="milestones">
          ${[0, 2, 5, 11].map((i) => `
          <div class="milestone">
            <div class="m-label">M${i + 1}</div>
            <div class="m-value">+$${prog.months[i]?.toLocaleString() || "0"}</div>
          </div>`).join("")}
        </div>
      </div>`).join("")}
    </div>
  </div>

  ${emGapMonthly > 0 ? `
  <div class="section">
    <h2>E&M Coding Optimization</h2>
    <div class="program-card">
      <h3>99213 → 99214/99215 Shift</h3>
      <div style="font-size: 12px; color: #6B7A99;">
        Annual coding gap: <span class="gold-text">$${(scanData.codingGap?.annualGap || 0).toLocaleString()}</span>
        &middot; Ramps to full effect by Month 6
      </div>
    </div>
  </div>` : ""}

  <div class="footer">
    <p>This forecast uses industry-average ramp-up curves and Medicare reimbursement rates.</p>
    <p>Actual results depend on patient enrollment, payer mix, and implementation timeline.</p>
    <p style="margin-top: 8px; color: #2F5EA8;">NPIxray.com &mdash; AI Revenue Intelligence for Healthcare</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
