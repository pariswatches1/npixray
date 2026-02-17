// Answer page data for all 50 AEO slugs
// Slugs 1-25 have full content; 26-50 are placeholders for another agent

export interface AnswerSection {
  heading: string;
  content: string;
}

export interface AnswerFAQ {
  question: string;
  answer: string;
}

export interface AnswerData {
  question: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  answer: string;
  sections: AnswerSection[];
  tableOfContents: string[];
  relatedQuestions: { slug: string; question: string }[];
  dataPoints: string[];
  faqs: AnswerFAQ[];
}

export const ALL_SLUGS = [
  "what-is-npi-number",
  "how-to-bill-ccm-99490",
  "how-to-start-rpm-program",
  "awv-vs-regular-checkup",
  "99213-vs-99214",
  "how-much-does-ccm-pay",
  "rpm-device-requirements",
  "bhi-billing-requirements",
  "medicare-awv-requirements",
  "em-coding-guidelines-2026",
  "how-to-increase-medicare-revenue",
  "most-profitable-medicare-services",
  "average-medicare-revenue-by-specialty",
  "how-much-revenue-am-i-missing",
  "medicare-revenue-per-patient",
  "practice-revenue-benchmarks",
  "undercoding-em-visits",
  "how-to-audit-billing-patterns",
  "ccm-vs-rpm-revenue",
  "medicare-reimbursement-rates-2026",
  "how-to-lookup-npi-number",
  "npi-number-search-by-name",
  "check-doctor-medicare-billing",
  "cms-public-data-explained",
  "free-npi-lookup-tool",
  "medicare-physician-compare",
  "provider-utilization-data",
  "how-to-read-cms-data",
  "npi-registry-vs-npixray",
  "free-medicare-revenue-analysis",
  "best-ccm-software",
  "best-rpm-platform",
  "chartspan-alternative",
  "signallamp-alternative",
  "best-medicare-billing-software",
  "best-revenue-cycle-management",
  "ccm-software-comparison",
  "free-vs-paid-npi-tools",
  "best-em-coding-tool",
  "practice-analytics-tools",
  "ccm-patient-requirements",
  "rpm-20-minutes-requirement",
  "awv-components-checklist",
  "bhi-vs-ccm",
  "ccm-consent-requirements",
  "rpm-cpt-codes",
  "ccm-documentation-requirements",
  "medicare-preventive-services",
  "transitional-care-management",
  "chronic-care-management-workflow",
];

export const CATEGORIES: Record<string, { label: string; slugs: string[] }> = {
  "medicare-billing": {
    label: "Medicare Billing",
    slugs: ALL_SLUGS.slice(0, 10),
  },
  "revenue-practice": {
    label: "Revenue & Practice",
    slugs: ALL_SLUGS.slice(10, 20),
  },
  "data-lookup": {
    label: "Data & Lookup",
    slugs: ALL_SLUGS.slice(20, 30),
  },
  "comparison-buying": {
    label: "Comparison & Buying",
    slugs: ALL_SLUGS.slice(30, 40),
  },
  "program-specific": {
    label: "Program-Specific",
    slugs: ALL_SLUGS.slice(40, 50),
  },
};
