/**
 * Structured Data (JSON-LD) helper functions for SEO.
 * Each function returns a schema.org JSON-LD object ready for injection.
 */

const SITE_URL = "https://npixray.com";
const ORG_NAME = "NPIxray";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-image.png`,
    description:
      "AI-powered revenue intelligence platform for medical practices. Analyzes free CMS public data to identify missed revenue opportunities in coding, CCM, RPM, BHI, and AWV programs.",
    foundingDate: "2024",
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: `${SITE_URL}/about`,
    },
  };
}

export function webApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "NPIxray NPI Scanner",
    url: SITE_URL,
    applicationCategory: "HealthcareApplication",
    operatingSystem: "Web",
    description:
      "Free NPI scanner that analyzes Medicare billing data to find missed revenue from E&M coding gaps, CCM, RPM, BHI, and AWV programs.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free NPI scan with unlimited usage",
    },
    creator: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
    },
  };
}

export function physicianJsonLd(provider: {
  npi: string;
  first_name: string;
  last_name: string;
  credential?: string;
  specialty: string;
  state: string;
  city: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: `${provider.first_name} ${provider.last_name}${provider.credential ? `, ${provider.credential}` : ""}`,
    identifier: provider.npi,
    medicalSpecialty: provider.specialty,
    address: {
      "@type": "PostalAddress",
      addressLocality: provider.city,
      addressRegion: provider.state,
      addressCountry: "US",
    },
    url: `${SITE_URL}/provider/${provider.npi}`,
  };
}

export function medicalCodeJsonLd(code: {
  code: string;
  name: string;
  description: string;
  codeSystem?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalCode",
    codeValue: code.code,
    codingSystem: code.codeSystem || "CPT",
    name: code.name,
    description: code.description,
    url: `${SITE_URL}/codes/${code.code}`,
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function qaPageJsonLd(question: string, answer: string) {
  return {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
        author: {
          "@type": "Organization",
          name: ORG_NAME,
          url: SITE_URL,
        },
      },
    },
  };
}

export function datasetJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "NPIxray Medicare Provider Revenue Analysis",
    description:
      "Analysis of 1,175,281 Medicare providers and 8,153,253 billing records from the CMS Medicare Physician & Other Practitioners dataset. Includes E&M coding distribution, care management program adoption rates, and specialty-level revenue benchmarks.",
    url: `${SITE_URL}/research`,
    license: "https://creativecommons.org/publicdomain/zero/1.0/",
    creator: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
    },
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: `${SITE_URL}/api/stats`,
    },
    temporalCoverage: "2022/2023",
    spatialCoverage: {
      "@type": "Place",
      name: "United States",
    },
    variableMeasured: [
      "Medicare provider billing patterns",
      "E&M code distribution (99211-99215)",
      "CCM adoption rates by specialty",
      "RPM adoption rates by state",
      "Revenue gap estimates",
    ],
    isBasedOn: {
      "@type": "Dataset",
      name: "Medicare Physician & Other Practitioners - by Provider and Service",
      url: "https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicare-physician-other-practitioners-by-provider-and-service",
      creator: {
        "@type": "GovernmentOrganization",
        name: "Centers for Medicare & Medicaid Services",
      },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
      })),
    ],
  };
}

export function articleJsonLd(
  title: string,
  description: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    author: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.png`,
      },
    },
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };
}

export function howToJsonLd(name: string, steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };
}

export function reportJsonLd(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Report",
    name,
    description,
    url: `${SITE_URL}/research`,
    author: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: ORG_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "MedicalStudy",
      studySubject: {
        "@type": "MedicalEntity",
        name: "Medicare Provider Revenue Analysis",
      },
    },
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };
}
