import { NextResponse } from "next/server";

/**
 * /api/entity — Machine-readable entity description for AI crawlers.
 * Returns structured JSON-LD (schema.org) data about NPIxray as an
 * organization, its services, datasets, and API endpoints.
 *
 * Designed for consumption by ChatGPT, Perplexity, Gemini, Claude,
 * and other AI systems that need to understand what NPIxray is and
 * what data/services it provides.
 */

const SITE_URL = "https://npixray.com";

const entityData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "NPIxray",
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.png`,
      description:
        "AI-powered revenue intelligence platform for medical practices. Analyzes free CMS Medicare public data (1.175M+ providers, 8.15M+ billing records) to identify missed revenue from undercoded E&M visits, unenrolled care management programs, and missed preventive services.",
      foundingDate: "2024",
      slogan: "X-Ray Your Practice Revenue",
      knowsAbout: [
        "Medicare billing optimization",
        "E&M coding analysis (99211-99215)",
        "Chronic Care Management (CCM) — CPT 99490, 99439",
        "Remote Patient Monitoring (RPM) — CPT 99454, 99457, 99458",
        "Behavioral Health Integration (BHI) — CPT 99484",
        "Annual Wellness Visit (AWV) — G0438, G0439",
        "Medical practice revenue optimization",
        "CMS Medicare public data analysis",
        "NPI Registry and provider lookup",
        "Healthcare specialty benchmarking",
      ],
      sameAs: [],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: `${SITE_URL}/about`,
      },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#application`,
      name: "NPIxray NPI Scanner",
      url: SITE_URL,
      applicationCategory: "HealthcareApplication",
      operatingSystem: "Web",
      description:
        "Free NPI scanner that analyzes Medicare billing data to find missed revenue. Enter any NPI number to get instant revenue analysis with E&M coding gaps, care management program opportunities, and dollar-quantified recommendations.",
      featureList: [
        "Instant NPI lookup and revenue analysis",
        "Revenue Score (0-100 optimization grade)",
        "E&M coding distribution analysis (99211-99215)",
        "CCM/RPM/BHI/AWV program opportunity detection",
        "Specialty-specific benchmarking (20 specialties)",
        "Geographic benchmarking (50 states)",
        "AI Revenue Coach (interactive chat)",
        "13 free interactive billing tools",
        "Billing code database and guides",
        "State and city-level provider reports",
        "Provider rankings and comparisons",
        "Revenue forecasting with what-if scenarios",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description:
          "Free NPI scan, all 13 tools, AI Coach, and data insights with unlimited usage. No login required.",
      },
      creator: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "Dataset",
      "@id": `${SITE_URL}/#dataset`,
      name: "NPIxray Medicare Provider Revenue Analysis",
      description:
        "Analysis of 1,175,281 Medicare providers and 8,153,253 billing records from the CMS Medicare Physician & Other Practitioners dataset. Includes E&M coding distribution, care management program adoption rates, and specialty-level revenue benchmarks for 20 specialties across all 50 states.",
      url: `${SITE_URL}/research`,
      license: "https://creativecommons.org/publicdomain/zero/1.0/",
      creator: { "@id": `${SITE_URL}/#organization` },
      distribution: [
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/stats`,
          description: "National aggregate statistics",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE_URL}/api/data`,
          description:
            "Filtered data by state and specialty (query params: ?state=XX&specialty=YY)",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "text/markdown",
          contentUrl: `${SITE_URL}/llms.txt`,
          description: "LLMs.txt file for AI systems (concise)",
        },
        {
          "@type": "DataDownload",
          encodingFormat: "text/markdown",
          contentUrl: `${SITE_URL}/llms-full.txt`,
          description: "Extended LLMs.txt with full feature/data coverage",
        },
      ],
      temporalCoverage: "2022/2023",
      spatialCoverage: {
        "@type": "Place",
        name: "United States",
      },
      variableMeasured: [
        "Medicare provider billing patterns",
        "E&M code distribution (99211-99215)",
        "CCM adoption rates by specialty (99490)",
        "RPM adoption rates by state (99454/99457)",
        "BHI screening rates (99484)",
        "AWV completion rates (G0438/G0439)",
        "Revenue gap estimates per provider",
        "Specialty-level revenue benchmarks",
      ],
      measurementTechnique:
        "Statistical analysis of CMS Medicare Physician & Other Practitioners public dataset",
      isBasedOn: {
        "@type": "Dataset",
        name: "Medicare Physician & Other Practitioners - by Provider and Service",
        url: "https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-provider-and-service",
        creator: {
          "@type": "GovernmentOrganization",
          name: "Centers for Medicare & Medicaid Services",
          url: "https://www.cms.gov",
        },
      },
    },
    {
      "@type": "WebAPI",
      "@id": `${SITE_URL}/#api`,
      name: "NPIxray Public API",
      description:
        "Free, unauthenticated JSON APIs for accessing Medicare provider data, national statistics, and revenue analysis.",
      url: `${SITE_URL}/data-api`,
      documentation: `${SITE_URL}/data-api`,
      provider: { "@id": `${SITE_URL}/#organization` },
      termsOfService: `${SITE_URL}/about`,
    },
  ],
  _meta: {
    generatedAt: new Date().toISOString(),
    purpose:
      "Machine-readable entity description for AI systems (ChatGPT, Perplexity, Gemini, Claude, etc.)",
    moreInfo: {
      llmsTxt: `${SITE_URL}/llms.txt`,
      llmsFullTxt: `${SITE_URL}/llms-full.txt`,
      research: `${SITE_URL}/research`,
      dataApi: `${SITE_URL}/data-api`,
    },
  },
};

export async function GET() {
  return NextResponse.json(entityData, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "Content-Type": "application/ld+json",
    },
  });
}
