import { ImageResponse } from "next/og";
import { performScan } from "@/lib/scan";

export const alt = "NPIxray Revenue Analysis";
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
  let missedRevenue = "$0";

  try {
    const { result } = await performScan(npi);
    providerName = result.provider.fullName;
    specialty = result.provider.specialty;
    location = `${result.provider.address.city}, ${result.provider.address.state}`;
    missedRevenue = result.totalMissedRevenue >= 1000
      ? `$${Math.round(result.totalMissedRevenue / 1000)}K`
      : `$${result.totalMissedRevenue.toLocaleString()}`;
  } catch {
    // Fall through with defaults
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #E9EEF6 0%, #F5F7FA 50%, #E9EEF6 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
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
            background: "linear-gradient(90deg, transparent, #2F5EA8, transparent)",
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(232, 168, 36, 0.1)",
              border: "1px solid rgba(232, 168, 36, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              color: "#2F5EA8",
            }}
          >
            {"???"}
          </div>
          <span style={{ fontSize: "28px", fontWeight: 700, color: "#fff" }}>
            NPI
            <span style={{ color: "#2F5EA8" }}>xray</span>
          </span>
        </div>

        {/* Provider name */}
        <div
          style={{
            fontSize: "42px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: "8px",
          }}
        >
          {providerName}
        </div>

        {/* Specialty + Location */}
        <div
          style={{
            fontSize: "20px",
            color: "#999",
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          {specialty}
          {location ? ` \u2022 ${location}` : ""}
        </div>

        {/* Missed Revenue Box */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "rgba(232, 168, 36, 0.06)",
            border: "1px solid rgba(232, 168, 36, 0.25)",
            borderRadius: "20px",
            padding: "28px 60px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              color: "#999",
              textTransform: "uppercase",
              letterSpacing: "2px",
              marginBottom: "8px",
            }}
          >
            ESTIMATED MISSED REVENUE
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#2F5EA8",
              lineHeight: 1,
            }}
          >
            {missedRevenue}
            <span style={{ fontSize: "24px", color: "#999", fontWeight: 400 }}>
              /yr
            </span>
          </div>
        </div>

        {/* CTA text */}
        <div
          style={{
            fontSize: "18px",
            color: "#666",
          }}
        >
          Scan your NPI free at npixray.com
        </div>
      </div>
    ),
    { ...size }
  );
}
