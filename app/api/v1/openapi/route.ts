import { NextResponse } from "next/server";

/**
 * GET /api/v1/openapi — OpenAPI 3.0 specification for the NPIxray API.
 */
export async function GET() {
  const spec = {
    openapi: "3.0.3",
    info: {
      title: "NPIxray API",
      version: "1.0.0",
      description:
        "Medicare billing intelligence API. Access provider data, Revenue Scores, specialty benchmarks, market intelligence, and group practice analysis for 1.2M+ providers.",
      contact: { url: "https://npixray.com/developers" },
      license: { name: "Proprietary", url: "https://npixray.com/terms" },
    },
    servers: [{ url: "https://npixray.com/api/v1", description: "Production" }],
    security: [{ ApiKeyAuth: [] }],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "X-API-Key",
          description: "API key with npx_ prefix. Free tier: 100 req/day, Pro: 10K req/day.",
        },
      },
      schemas: {
        Provider: {
          type: "object",
          properties: {
            npi: { type: "string", example: "1234567890" },
            name: { type: "string", example: "John Smith" },
            credential: { type: "string", example: "M.D.", nullable: true },
            specialty: { type: "string", example: "Internal Medicine" },
            state: { type: "string", example: "TX" },
            city: { type: "string", example: "HOUSTON" },
            total_medicare_payment: { type: "number", example: 245000 },
            total_beneficiaries: { type: "integer", example: 850 },
            total_services: { type: "integer", example: 4200 },
            revenue_score: { type: "integer", example: 72, minimum: 0, maximum: 100 },
          },
        },
        FullProvider: {
          allOf: [
            { $ref: "#/components/schemas/Provider" },
            {
              type: "object",
              properties: {
                em_distribution: {
                  type: "object",
                  properties: {
                    em_99211: { type: "integer" },
                    em_99212: { type: "integer" },
                    em_99213: { type: "integer" },
                    em_99214: { type: "integer" },
                    em_99215: { type: "integer" },
                    em_total: { type: "integer" },
                  },
                },
                care_management: {
                  type: "object",
                  properties: {
                    ccm_99490_services: { type: "integer" },
                    ccm_99490_payment: { type: "number" },
                    rpm_99454_services: { type: "integer" },
                    rpm_99457_services: { type: "integer" },
                    rpm_payment: { type: "number" },
                    bhi_99484_services: { type: "integer" },
                    bhi_99484_payment: { type: "number" },
                    awv_g0438_services: { type: "integer" },
                    awv_g0439_services: { type: "integer" },
                    awv_payment: { type: "number" },
                  },
                },
                estimated_missed_revenue: { type: "number", nullable: true },
                benchmark: { type: "object", nullable: true },
              },
            },
          ],
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            status: { type: "integer" },
          },
        },
      },
    },
    paths: {
      "/provider/{npi}": {
        get: {
          summary: "Get provider by NPI",
          description: "Returns basic provider info and Revenue Score. Free tier.",
          tags: ["Providers"],
          security: [],
          parameters: [
            { name: "npi", in: "path", required: true, schema: { type: "string", pattern: "^\\d{10}$" } },
          ],
          responses: {
            "200": { description: "Provider data", content: { "application/json": { schema: { type: "object", properties: { data: { $ref: "#/components/schemas/Provider" } } } } } },
            "404": { description: "Provider not found" },
          },
        },
      },
      "/provider/{npi}/full": {
        get: {
          summary: "Full provider billing breakdown",
          description: "Returns complete E&M distribution, care management data, benchmark comparison, and estimated missed revenue. Pro tier required.",
          tags: ["Providers"],
          parameters: [
            { name: "npi", in: "path", required: true, schema: { type: "string", pattern: "^\\d{10}$" } },
          ],
          responses: {
            "200": { description: "Full provider data", content: { "application/json": { schema: { type: "object", properties: { data: { $ref: "#/components/schemas/FullProvider" } } } } } },
            "403": { description: "Pro API key required" },
          },
        },
      },
      "/provider/{npi}/codes": {
        get: {
          summary: "Provider billing codes",
          description: "All CPT/HCPCS codes billed by this provider. Pro tier required.",
          tags: ["Providers"],
          parameters: [
            { name: "npi", in: "path", required: true, schema: { type: "string" } },
            { name: "limit", in: "query", schema: { type: "integer", default: 50, maximum: 200 } },
          ],
          responses: { "200": { description: "Billing codes list" }, "403": { description: "Pro required" } },
        },
      },
      "/providers/batch": {
        post: {
          summary: "Batch provider lookup",
          description: "Look up 1-100 providers at once. Returns full billing data for each. Pro tier required.",
          tags: ["Providers"],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", required: ["npis"], properties: { npis: { type: "array", items: { type: "string" }, maxItems: 100 } } } } },
          },
          responses: { "200": { description: "Batch results" }, "403": { description: "Pro required" } },
        },
      },
      "/search": {
        get: {
          summary: "Search providers",
          description: "Search providers by name, state, or specialty. Free tier.",
          tags: ["Search"],
          security: [],
          parameters: [
            { name: "name", in: "query", schema: { type: "string" } },
            { name: "state", in: "query", schema: { type: "string" } },
            { name: "specialty", in: "query", schema: { type: "string" } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 50 } },
          ],
          responses: { "200": { description: "Search results" } },
        },
      },
      "/benchmarks": {
        get: {
          summary: "All specialty benchmarks",
          description: "Returns benchmarks for all specialties. Free tier.",
          tags: ["Benchmarks"],
          security: [],
          responses: { "200": { description: "Benchmark data" } },
        },
      },
      "/benchmarks/{specialty}": {
        get: {
          summary: "Specialty benchmark",
          description: "Returns benchmark data for a specific specialty. Free tier.",
          tags: ["Benchmarks"],
          security: [],
          parameters: [{ name: "specialty", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "Benchmark data" }, "404": { description: "Not found" } },
        },
      },
      "/stats": {
        get: {
          summary: "All state statistics",
          description: "Returns aggregate statistics for all states. Free tier.",
          tags: ["Statistics"],
          security: [],
          responses: { "200": { description: "State statistics" } },
        },
      },
      "/stats/{state}": {
        get: {
          summary: "State statistics",
          description: "Returns detailed statistics for a specific state. Free tier.",
          tags: ["Statistics"],
          security: [],
          parameters: [{ name: "state", in: "path", required: true, schema: { type: "string" } }],
          responses: { "200": { description: "State data" }, "404": { description: "Not found" } },
        },
      },
      "/compare": {
        get: {
          summary: "Compare providers",
          description: "Compare 2-10 providers side by side. Pro tier required.",
          tags: ["Analysis"],
          parameters: [{ name: "npis", in: "query", required: true, schema: { type: "string", description: "Comma-separated NPIs" } }],
          responses: { "200": { description: "Comparison data" }, "403": { description: "Pro required" } },
        },
      },
      "/market/{state}": {
        get: {
          summary: "Market intelligence",
          description: "Market data for a state, optionally filtered by city and/or specialty. Pro tier required.",
          tags: ["Analysis"],
          parameters: [
            { name: "state", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: { "200": { description: "Market data" }, "403": { description: "Pro required" } },
        },
      },
      "/group-scan": {
        post: {
          summary: "Group practice scan",
          description: "Scan 2-50 providers as a group and get aggregated practice-level results including total missed revenue, program adoption, and action plan. Pro tier required.",
          tags: ["Analysis"],
          requestBody: {
            required: true,
            content: { "application/json": { schema: { type: "object", required: ["npis"], properties: { npis: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 50 }, practice_name: { type: "string" } } } } },
          },
          responses: { "200": { description: "Group scan results" }, "403": { description: "Pro required" } },
        },
      },
      "/specialties": {
        get: {
          summary: "List specialties",
          description: "Returns all available specialties. Free tier.",
          tags: ["Reference"],
          security: [],
          responses: { "200": { description: "Specialty list" } },
        },
      },
    },
    tags: [
      { name: "Providers", description: "Individual provider data and billing details" },
      { name: "Search", description: "Search across 1.2M+ providers" },
      { name: "Benchmarks", description: "Specialty-level benchmark data" },
      { name: "Statistics", description: "State and national aggregate statistics" },
      { name: "Analysis", description: "Advanced analytics — comparison, market intelligence, group scans" },
      { name: "Reference", description: "Reference data and lookups" },
    ],
  };

  return NextResponse.json(spec, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
