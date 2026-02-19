import { ImageResponse } from "next/og";
import { performScan } from "@/lib/scan";
import {
  calculateRevenueScoreFromScan,
  estimatePercentile,
} from "@/lib/revenue-score";

export const alt = "NPIxray Revenue Report Card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ npi: string }>;
}) {
  const { npi } = await params;

  let providerName = "Healthcare Provider";
  let specialty = "Medical Practice";
  let location = "";
  let score = 0;
  let percentile = 50;
  let tierLabel = "Average";
  let tierColor = "#facc15";
  let missedRevenue = "$0";
  let breakdown: { label: string; value: number; emoji: string }[] = [];
  let topGap = { label: "", value: "" };

  try {
    const result = await performScan(npi);
    providerName = result.provider.fullName;
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
      { label: "Revenue", value: scoreResult.breakdown.revenueEfficiency, emoji: "💰" },
      { label: "Diversity", value: scoreResult.breakdown.serviceDiversity, emoji: "🔀" },
      { label: "Volume", value: scoreResult.breakdown.patientVolume, emoji: "📊" },
    ];

    // Find biggest revenue gap
    const gaps = [
      { label: "E&M Coding", value: result.codingGap.annualGap },
      { label: "CCM Program", value: result.ccmGap.annualGap },
      { label: "RPM Program", value: result.rpmGap.annualGap },
      { label: "BHI Program", value: result.bhiGap.annualGap },
      { label: "AWV Program", value: result.awvGap.annualGap },
    ].sort((a, b) => b.value - a.value);

    if (gaps[0] && gaps[0].value > 0) {
      topGap = {
        label: gaps[0].label,
        value:
          gaps[0].value >= 1000
            ? `$${Math.round(gaps[0].value / 1000)}K`
            : `$${gaps[0].value.toLocaleString()}`,
      };
    }
  } catch {
    // Fall through with defaults
  }

  // Score gauge SVG arc
  const radius = 52;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 0.75;
  const arcLength = circumference * arcFraction;
  const filledLength = arcLength * (score / 100);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, #0c0b09 0%, #15130e 40%, #1a1610 70%, #0c0b09 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Gold gradient top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #E8A824, #f0c040, #E8A824)",
          }}
        />

        {/* Subtle gold glow behind score */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "60px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${tierColor}08, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "40px 52px",
            flex: 1,
          }}
        >
          {/* Top row: Logo + NPIxray */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>
                NPI
                <span style={{ color: "#E8A824" }}>xray</span>
              </span>
              <span
                style={{
                  fontSize: "11px",
                  color: "#E8A824",
                  background: "rgba(232, 168, 36, 0.12)",
                  border: "1px solid rgba(232, 168, 36, 0.25)",
                  borderRadius: "6px",
                  padding: "3px 10px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Revenue Report Card
              </span>
            </div>
            <span style={{ fontSize: "13px", color: "#555" }}>npixray.com</span>
          </div>

          {/* Main content area */}
          <div style={{ display: "flex", gap: "40px", flex: 1 }}>
            {/* Left: Score gauge + Provider */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "260px",
                flexShrink: 0,
              }}
            >
              {/* Score Gauge */}
              <div
                style={{
                  position: "relative",
                  width: "130px",
                  height: "130px",
                  display: "flex",
                  marginBottom: "16px",
                }}
              >
                <svg width="130" height="130" viewBox="0 0 130 130">
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                    strokeLinecap="round"
                    transform="rotate(135 65 65)"
                  />
                  <circle
                    cx="65"
                    cy="65"
                    r={radius}
                    fill="none"
                    stroke={tierColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${filledLength} ${circumference - filledLength}`}
                    strokeLinecap="round"
                    transform="rotate(135 65 65)"
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
                    paddingTop: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "42px",
                      fontWeight: 800,
                      color: tierColor,
                      lineHeight: 1,
                    }}
                  >
                    {score}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: tierColor,
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      marginTop: "2px",
                    }}
                  >
                    {tierLabel}
                  </span>
                </div>
              </div>

              {/* Percentile */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(232, 168, 36, 0.08)",
                  border: "1px solid rgba(232, 168, 36, 0.2)",
                  borderRadius: "8px",
                  padding: "6px 16px",
                  marginBottom: "16px",
                }}
              >
                <span style={{ fontSize: "12px", color: "#999" }}>Top</span>
                <span style={{ fontSize: "18px", fontWeight: 800, color: "#E8A824" }}>
                  {Math.max(1, 100 - percentile)}%
                </span>
                <span style={{ fontSize: "12px", color: "#999" }}>of {specialty}</span>
              </div>

              {/* Provider info */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.3,
                  }}
                >
                  {providerName}
                </span>
                <span style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
                  {specialty}
                </span>
                <span style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                  {location}
                </span>
              </div>
            </div>

            {/* Right: Metrics */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: "16px",
              }}
            >
              {/* Missed Revenue Hero */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(232, 168, 36, 0.06)",
                  border: "1px solid rgba(232, 168, 36, 0.2)",
                  borderRadius: "16px",
                  padding: "20px 24px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#888",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    marginBottom: "6px",
                  }}
                >
                  Estimated Missed Revenue
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "48px",
                      fontWeight: 800,
                      color: "#E8A824",
                      lineHeight: 1,
                    }}
                  >
                    {missedRevenue}
                  </span>
                  <span style={{ fontSize: "18px", color: "#666" }}>/yr</span>
                </div>
                {topGap.label && (
                  <span style={{ fontSize: "13px", color: "#888", marginTop: "6px" }}>
                    Biggest gap: {topGap.label} ({topGap.value}/yr)
                  </span>
                )}
              </div>

              {/* Score breakdown bars */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  padding: "4px 0",
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
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontSize: "15px", width: "24px" }}>
                        {item.emoji}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#aaa",
                          width: "90px",
                          flexShrink: 0,
                        }}
                      >
                        {item.label}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: "10px",
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: "5px",
                          display: "flex",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${item.value}%`,
                            height: "100%",
                            background: barColor,
                            borderRadius: "5px",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#fff",
                          width: "32px",
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
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "14px",
              marginTop: "12px",
            }}
          >
            <span style={{ fontSize: "14px", color: "#E8A824", fontWeight: 600 }}>
              Scan your NPI free → npixray.com
            </span>
            <span style={{ fontSize: "12px", color: "#555" }}>
              Based on CMS Medicare Public Data
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
