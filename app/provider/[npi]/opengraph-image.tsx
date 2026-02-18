import { ImageResponse } from "next/og";
import {
  getProvider,
  getBenchmarkBySpecialty,
  getProviderCodeCount,
  stateAbbrToName,
} from "@/lib/db-queries";
import { calculateRevenueScore, getScoreTier } from "@/lib/revenue-score";

export const alt = "NPIxray Provider Revenue Score";
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
  let score: number | null = null;
  let tierLabel = "";
  let tierColor = "#E8A824";
  let breakdown: { label: string; value: number }[] = [];

  try {
    const provider = await getProvider(npi);
    if (provider) {
      providerName = `Dr. ${provider.first_name} ${provider.last_name}`;
      if (provider.credential) providerName += `, ${provider.credential}`;
      specialty = provider.specialty;
      location = `${provider.city}, ${stateAbbrToName(provider.state)}`;

      const [benchmark, codeCount] = await Promise.all([
        getBenchmarkBySpecialty(provider.specialty),
        getProviderCodeCount(npi),
      ]);

      if (benchmark) {
        const result = calculateRevenueScore(provider, benchmark, codeCount);
        score = result.overall;
        tierLabel = result.label;
        tierColor = result.hexColor;
        breakdown = [
          { label: "E&M Coding", value: result.breakdown.emCoding },
          { label: "Programs", value: result.breakdown.programUtil },
          { label: "Revenue Eff.", value: result.breakdown.revenueEfficiency },
          { label: "Diversity", value: result.breakdown.serviceDiversity },
          { label: "Volume", value: result.breakdown.patientVolume },
        ];
      }
    }
  } catch {
    // Fall through with defaults
  }

  // Score gauge SVG arc math (same as provider page: radius 64, 270° arc)
  const radius = 56;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const arcFraction = 0.75;
  const arcLength = circumference * arcFraction;
  const filledLength = score !== null ? arcLength * (score / 100) : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "48px 60px",
        }}
      >
        {/* Top border accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #E8A824, transparent)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(232, 168, 36, 0.1)",
              border: "1px solid rgba(232, 168, 36, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              color: "#E8A824",
            }}
          >
            {"🔍"}
          </div>
          <span style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>
            NPI
            <span style={{ color: "#E8A824" }}>xray</span>
          </span>
        </div>

        {/* Main content: Score gauge + Provider info */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "40px",
            flex: 1,
          }}
        >
          {/* Score Gauge */}
          {score !== null ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div style={{ position: "relative", width: "140px", height: "140px", display: "flex" }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                    strokeLinecap="round"
                    transform="rotate(135 70 70)"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="none"
                    stroke={tierColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${filledLength} ${circumference - filledLength}`}
                    strokeLinecap="round"
                    transform="rotate(135 70 70)"
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
                      fontSize: "44px",
                      fontWeight: 800,
                      color: tierColor,
                      lineHeight: 1,
                    }}
                  >
                    {score}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: tierColor,
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                      marginTop: "2px",
                    }}
                  >
                    {tierLabel}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                background: "rgba(232, 168, 36, 0.06)",
                border: "1px solid rgba(232, 168, 36, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                color: "#666",
                flexShrink: 0,
              }}
            >
              No Score
            </div>
          )}

          {/* Provider Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.2,
                marginBottom: "8px",
              }}
            >
              {providerName}
            </div>
            <div
              style={{
                fontSize: "18px",
                color: "#999",
                marginBottom: "4px",
              }}
            >
              {specialty}
              {location ? ` • ${location}` : ""}
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#666",
                marginBottom: "24px",
              }}
            >
              NPI: {npi}
            </div>

            {/* Breakdown Bars */}
            {breakdown.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
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
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#999",
                          width: "110px",
                          flexShrink: 0,
                        }}
                      >
                        {item.label}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: "8px",
                          background: "rgba(255,255,255,0.06)",
                          borderRadius: "4px",
                          display: "flex",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${item.value}%`,
                            height: "100%",
                            background: barColor,
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#fff",
                          width: "30px",
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
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "16px",
            marginTop: "16px",
          }}
        >
          <span style={{ fontSize: "14px", color: "#666" }}>
            npixray.com/provider/{npi}
          </span>
          <span style={{ fontSize: "14px", color: "#666" }}>
            Verified Medicare Data • Revenue Score
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
