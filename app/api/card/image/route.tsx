import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { performScan } from "@/lib/scan";
import {
  calculateRevenueScoreFromScan,
  estimatePercentile,
} from "@/lib/revenue-score";

/**
 * GET /api/card/image?npi=1234567890
 * Generates a high-res PNG report card image for download / social sharing.
 * Size: 1080x1080 (Instagram-friendly square format)
 */
export async function GET(request: NextRequest) {
  const npi = request.nextUrl.searchParams.get("npi");

  if (!npi || !/^\d{10}$/.test(npi)) {
    return NextResponse.json(
      { error: "Invalid NPI. Must be a 10-digit number." },
      { status: 400 }
    );
  }

  let providerName = "Healthcare Provider";
  let credential = "";
  let specialty = "Medical Practice";
  let location = "";
  let score = 0;
  let percentile = 50;
  let tierLabel = "Average";
  let tierColor = "#facc15";
  let missedRevenue = "$0";
  let breakdown: { label: string; value: number; emoji: string }[] = [];
  let gaps: { label: string; value: string }[] = [];

  try {
    const { result } = await performScan(npi);
    providerName = result.provider.fullName;
    credential = result.provider.credential;
    specialty = result.provider.specialty;
    location = `${result.provider.address.city}, ${result.provider.address.state}`;
    missedRevenue =
      result.totalMissedRevenue >= 1000
        ? `$${Math.round(result.totalMissedRevenue / 1000)}K`
        : `$${result.totalMissedRevenue.toLocaleString()}`;

    const scoreResult = calculateRevenueScoreFromScan(result);
    score = scoreResult.overall;
    percentile = estimatePercentile(score);
    tierLabel = scoreResult.label;
    tierColor = scoreResult.hexColor;

    breakdown = [
      { label: "E&M Coding", value: scoreResult.breakdown.emCoding, emoji: "📋" },
      { label: "Programs", value: scoreResult.breakdown.programUtil, emoji: "🏥" },
      { label: "Revenue Eff.", value: scoreResult.breakdown.revenueEfficiency, emoji: "💰" },
      { label: "Diversity", value: scoreResult.breakdown.serviceDiversity, emoji: "🔀" },
      { label: "Volume", value: scoreResult.breakdown.patientVolume, emoji: "📊" },
    ];

    // Revenue gaps
    const rawGaps = [
      { label: "E&M Coding", value: result.codingGap.annualGap },
      { label: "CCM", value: result.ccmGap.annualGap },
      { label: "RPM", value: result.rpmGap.annualGap },
      { label: "BHI", value: result.bhiGap.annualGap },
      { label: "AWV", value: result.awvGap.annualGap },
    ]
      .filter((g) => g.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    gaps = rawGaps.map((g) => ({
      label: g.label,
      value:
        g.value >= 1000
          ? `$${Math.round(g.value / 1000)}K`
          : `$${g.value.toLocaleString()}`,
    }));
  } catch {
    return NextResponse.json(
      { error: "Failed to generate report card." },
      { status: 500 }
    );
  }

  // Score gauge SVG arc
  const radius = 72;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 0.75;
  const arcLength = circumference * arcFraction;
  const filledLength = arcLength * (score / 100);
  const gaugeSize = 190;
  const center = gaugeSize / 2;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(160deg, #0c0b09 0%, #15130e 35%, #1a1610 65%, #0c0b09 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gold gradient top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            background: "linear-gradient(90deg, #2F5EA8, #4FA3D1, #2F5EA8)",
          }}
        />

        {/* Subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "100px",
            left: "50%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${tierColor}06, transparent 70%)`,
            transform: "translateX(-50%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 60px",
            flex: 1,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "36px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "26px", fontWeight: 700, color: "#fff" }}>
                NPI<span style={{ color: "#2F5EA8" }}>xray</span>
              </span>
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#2F5EA8",
                background: "rgba(232, 168, 36, 0.1)",
                border: "1px solid rgba(232, 168, 36, 0.25)",
                borderRadius: "8px",
                padding: "5px 14px",
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Revenue Report Card
            </span>
          </div>

          {/* Score Gauge */}
          <div
            style={{
              position: "relative",
              width: `${gaugeSize}px`,
              height: `${gaugeSize}px`,
              display: "flex",
              marginBottom: "16px",
            }}
          >
            <svg width={gaugeSize} height={gaugeSize} viewBox={`0 0 ${gaugeSize} ${gaugeSize}`}>
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                strokeLinecap="round"
                transform={`rotate(135 ${center} ${center})`}
              />
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={tierColor}
                strokeWidth={strokeWidth}
                strokeDasharray={`${filledLength} ${circumference - filledLength}`}
                strokeLinecap="round"
                transform={`rotate(135 ${center} ${center})`}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "60px",
                  fontWeight: 800,
                  color: tierColor,
                  lineHeight: 1,
                }}
              >
                {score}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: tierColor,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  marginTop: "4px",
                }}
              >
                {tierLabel}
              </span>
            </div>
          </div>

          {/* Percentile pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(232, 168, 36, 0.08)",
              border: "1px solid rgba(232, 168, 36, 0.2)",
              borderRadius: "10px",
              padding: "8px 20px",
              marginBottom: "20px",
            }}
          >
            <span style={{ fontSize: "14px", color: "#999" }}>Top</span>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#2F5EA8" }}>
              {Math.max(1, 100 - percentile)}%
            </span>
            <span style={{ fontSize: "14px", color: "#999" }}>of {specialty}</span>
          </div>

          {/* Provider name */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#fff",
              textAlign: "center",
              marginBottom: "4px",
            }}
          >
            {providerName}
            {credential && (
              <span style={{ fontSize: "18px", color: "#888", fontWeight: 400 }}>
                {" "}
                {credential}
              </span>
            )}
          </div>
          <div
            style={{
              fontSize: "15px",
              color: "#888",
              textAlign: "center",
              marginBottom: "28px",
            }}
          >
            {specialty} · {location}
          </div>

          {/* Missed Revenue */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(232, 168, 36, 0.06)",
              border: "1px solid rgba(232, 168, 36, 0.2)",
              borderRadius: "16px",
              padding: "20px 40px",
              marginBottom: "28px",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: "6px",
              }}
            >
              Estimated Missed Revenue
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span
                style={{
                  fontSize: "52px",
                  fontWeight: 800,
                  color: "#2F5EA8",
                  lineHeight: 1,
                }}
              >
                {missedRevenue}
              </span>
              <span style={{ fontSize: "20px", color: "#666" }}>/yr</span>
            </div>
          </div>

          {/* Score breakdown */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
              maxWidth: "700px",
            }}
          >
            {breakdown.map((item) => {
              const barColor =
                item.value >= 80
                  ? "#34d399"
                  : item.value >= 60
                    ? "#facc15"
                    : item.value >= 40
                      ? "#fb923c"
                      : "#f87171";
              return (
                <div
                  key={item.label}
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span style={{ fontSize: "18px", width: "28px", textAlign: "center" }}>
                    {item.emoji}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#aaa",
                      width: "100px",
                      flexShrink: 0,
                    }}
                  >
                    {item.label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: "12px",
                      background: "rgba(255,255,255,0.06)",
                      borderRadius: "6px",
                      display: "flex",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${item.value}%`,
                        height: "100%",
                        background: barColor,
                        borderRadius: "6px",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#fff",
                      width: "36px",
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "16px",
            }}
          >
            <span style={{ fontSize: "15px", color: "#2F5EA8", fontWeight: 600 }}>
              Scan your NPI free → npixray.com
            </span>
            <span style={{ fontSize: "13px", color: "#555" }}>
              Based on CMS Medicare Public Data
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );

  // Return as downloadable PNG
  const headers = new Headers(image.headers);
  headers.set(
    "Content-Disposition",
    `attachment; filename="npixray-report-card-${npi}.png"`
  );
  headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");

  return new Response(image.body, {
    status: 200,
    headers,
  });
}
