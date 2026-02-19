import { NextRequest, NextResponse } from "next/server";
import { getProvider, getAllBenchmarks, type ProviderRow, type BenchmarkRow } from "@/lib/db-queries";
import { checkRateLimit, validateApiKey } from "@/lib/api-keys";

/**
 * FHIR R4-compatible Practitioner endpoint.
 *
 * GET /api/v1/fhir?npi=1234567890
 *
 * Returns a FHIR Practitioner resource with NPIxray extensions
 * for Revenue Score, billing data, and program adoption.
 * Compatible with SMART on FHIR EHR integrations.
 */
export async function GET(request: NextRequest) {
  const npi = request.nextUrl.searchParams.get("npi") || request.nextUrl.searchParams.get("identifier") || "";

  if (!/^\d{10}$/.test(npi)) {
    return NextResponse.json(
      { resourceType: "OperationOutcome", issue: [{ severity: "error", code: "invalid", diagnostics: "Valid 10-digit NPI required" }] },
      { status: 400, headers: fhirHeaders() }
    );
  }

  // Rate limiting
  const authHeader = request.headers.get("authorization") || request.headers.get("x-api-key") || "";
  const apiKey = authHeader.replace(/^Bearer\s+/i, "").trim();
  let identifier = `ip:${request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"}`;
  let tier = "anonymous";

  if (apiKey && apiKey.startsWith("npx_")) {
    const keyData = validateApiKey(apiKey);
    if (keyData) {
      identifier = `key:${apiKey}`;
      tier = keyData.tier;
    }
  }

  const rl = checkRateLimit(identifier, tier);
  if (!rl.allowed) {
    return NextResponse.json(
      { resourceType: "OperationOutcome", issue: [{ severity: "error", code: "throttled", diagnostics: "Rate limit exceeded" }] },
      { status: 429, headers: { ...fhirHeaders(), "X-RateLimit-Remaining": "0" } }
    );
  }

  try {
    const provider = await getProvider(npi);
    if (!provider) {
      return NextResponse.json(
        { resourceType: "OperationOutcome", issue: [{ severity: "error", code: "not-found", diagnostics: `Practitioner with NPI ${npi} not found` }] },
        { status: 404, headers: fhirHeaders() }
      );
    }

    const benchmarks = await getAllBenchmarks();
    const benchmark = (benchmarks as BenchmarkRow[]).find((b) => b.specialty === provider.specialty) ?? null;

    const fhirResource = toFhirPractitioner(provider as ProviderRow, benchmark);

    return NextResponse.json(fhirResource, {
      status: 200,
      headers: fhirHeaders(),
    });
  } catch (err) {
    console.error("[fhir] Error:", err);
    return NextResponse.json(
      { resourceType: "OperationOutcome", issue: [{ severity: "error", code: "exception", diagnostics: "Internal server error" }] },
      { status: 500, headers: fhirHeaders() }
    );
  }
}

function fhirHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/fhir+json; fhirVersion=4.0",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, s-maxage=3600",
  };
}

function toFhirPractitioner(p: ProviderRow, benchmark: BenchmarkRow | null) {
  // Calculate a simple revenue score
  let revenueScore = 50;
  if (benchmark && p.total_beneficiaries) {
    let score = 0, factors = 0;
    const emTotal = p.em_total || 1;
    score += Math.min((p.em_99214 || 0) / emTotal / (benchmark.pct_99214 || 0.5), 1.0);
    factors++;
    const actualRPP = p.total_beneficiaries > 0 ? p.total_medicare_payment / p.total_beneficiaries : 0;
    score += Math.min(actualRPP / (benchmark.avg_revenue_per_patient || 400), 1.0);
    factors++;
    const cm = ((p.ccm_99490_services || 0) > 0 ? 1 : 0) +
      (((p.rpm_99454_services || 0) > 0 || (p.rpm_99457_services || 0) > 0) ? 1 : 0) +
      (((p.awv_g0438_services || 0) > 0 || (p.awv_g0439_services || 0) > 0) ? 1 : 0) +
      ((p.bhi_99484_services || 0) > 0 ? 1 : 0);
    score += cm / 4;
    factors++;
    revenueScore = Math.round((score / factors) * 100);
  }

  return {
    resourceType: "Practitioner",
    id: p.npi,
    meta: {
      versionId: "1",
      lastUpdated: new Date().toISOString(),
      profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-practitioner"],
    },
    identifier: [
      {
        system: "http://hl7.org/fhir/sid/us-npi",
        value: p.npi,
      },
    ],
    name: [
      {
        use: "official",
        family: p.last_name,
        given: [p.first_name],
        suffix: p.credential ? [p.credential] : undefined,
      },
    ],
    qualification: [
      {
        code: {
          coding: [
            {
              system: "http://nucc.org/provider-taxonomy",
              display: p.specialty,
            },
          ],
          text: p.specialty,
        },
      },
    ],
    address: [
      {
        use: "work",
        city: p.city,
        state: p.state,
      },
    ],
    // NPIxray-specific extensions
    extension: [
      {
        url: "https://npixray.com/fhir/extension/revenue-score",
        valueInteger: revenueScore,
      },
      {
        url: "https://npixray.com/fhir/extension/total-medicare-payment",
        valueMoney: {
          value: p.total_medicare_payment,
          currency: "USD",
        },
      },
      {
        url: "https://npixray.com/fhir/extension/total-beneficiaries",
        valueInteger: p.total_beneficiaries,
      },
      {
        url: "https://npixray.com/fhir/extension/em-distribution",
        extension: [
          { url: "em-99213", valueInteger: p.em_99213 || 0 },
          { url: "em-99214", valueInteger: p.em_99214 || 0 },
          { url: "em-99215", valueInteger: p.em_99215 || 0 },
          { url: "em-total", valueInteger: p.em_total || 0 },
        ],
      },
      {
        url: "https://npixray.com/fhir/extension/care-management",
        extension: [
          { url: "ccm-enrolled", valueBoolean: (p.ccm_99490_services || 0) > 0 },
          { url: "rpm-enrolled", valueBoolean: (p.rpm_99454_services || 0) > 0 || (p.rpm_99457_services || 0) > 0 },
          { url: "bhi-enrolled", valueBoolean: (p.bhi_99484_services || 0) > 0 },
          { url: "awv-enrolled", valueBoolean: (p.awv_g0438_services || 0) > 0 || (p.awv_g0439_services || 0) > 0 },
        ],
      },
      {
        url: "https://npixray.com/fhir/extension/report-url",
        valueUrl: `https://npixray.com/scan/${p.npi}`,
      },
    ],
  };
}
