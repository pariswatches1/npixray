// ────────────────────────────────────────────────────────────
// Internal linking system — returns related links by page type
// ────────────────────────────────────────────────────────────

export type PageType =
  | "state"
  | "specialty"
  | "guide"
  | "tool"
  | "compare"
  | "code"
  | "insight"
  | "solution"
  | "answer"
  | "report"
  | "leaderboard"
  | "score"
  | "market"
  | "ranking";

export interface RelatedLink {
  label: string;
  href: string;
}

export interface LinkGroup {
  category: string;
  icon: string; // Lucide icon name
  links: RelatedLink[];
}

interface LinkContext {
  state?: string;
  specialty?: string;
  slug?: string;
}

// ── Static data ──────────────────────────────────────────────

const TOP_STATES: RelatedLink[] = [
  { label: "California", href: "/states/california" },
  { label: "Florida", href: "/states/florida" },
  { label: "Texas", href: "/states/texas" },
  { label: "New York", href: "/states/new-york" },
  { label: "Pennsylvania", href: "/states/pennsylvania" },
];

const TOP_SPECIALTIES: RelatedLink[] = [
  { label: "Family Medicine", href: "/specialties/family-medicine" },
  { label: "Internal Medicine", href: "/specialties/internal-medicine" },
  { label: "Cardiology", href: "/specialties/cardiology" },
  { label: "Orthopedics", href: "/specialties/orthopedic-surgery" },
  { label: "Dermatology", href: "/specialties/dermatology" },
];

const GUIDES: RelatedLink[] = [
  { label: "CCM Billing Guide", href: "/guides/ccm-billing-99490" },
  { label: "RPM Billing Guide", href: "/guides/rpm-billing-99453-99458" },
  { label: "AWV Billing Guide", href: "/guides/awv-billing-g0438-g0439" },
  { label: "BHI Billing Guide", href: "/guides/bhi-billing-99484" },
  { label: "E&M Coding Guide", href: "/guides/em-coding-optimization" },
];

const TOP_TOOLS: RelatedLink[] = [
  { label: "NPI Lookup", href: "/tools/npi-lookup" },
  { label: "Revenue Calculator", href: "/tools/revenue-calculator" },
  { label: "ROI Calculator", href: "/tools/roi-calculator" },
  { label: "CCM Calculator", href: "/tools/ccm-calculator" },
  { label: "RPM Calculator", href: "/tools/rpm-calculator" },
];

const MORE_TOOLS: RelatedLink[] = [
  { label: "E&M Audit Tool", href: "/tools/em-audit" },
  { label: "Practice Benchmark", href: "/tools/practice-benchmark" },
  { label: "Code Lookup", href: "/tools/code-lookup" },
];

const COMPARISONS: RelatedLink[] = [
  { label: "NPIxray vs ChartSpan", href: "/vs/chartspan" },
  { label: "NPIxray vs SignalLamp", href: "/vs/signallamp" },
  { label: "NPIxray vs Chronic Care IQ", href: "/vs/chronic-care-iq" },
  { label: "NPIxray vs Prevounce", href: "/vs/prevounce" },
  { label: "NPIxray vs Aledade", href: "/vs/aledade" },
];

const INSIGHTS: RelatedLink[] = [
  { label: "Medicare Billing Overview", href: "/insights/medicare-billing-overview" },
  { label: "E&M Coding Patterns", href: "/insights/em-coding-patterns" },
  { label: "CCM Adoption Rates", href: "/insights/ccm-adoption-rates" },
  { label: "Revenue Gap by Specialty", href: "/insights/revenue-gap-by-specialty" },
  { label: "Highest-Paying Specialties", href: "/insights/highest-paying-specialties" },
];

// ── Helpers ──────────────────────────────────────────────────

function filterOutCurrent(links: RelatedLink[], currentSlug?: string): RelatedLink[] {
  if (!currentSlug) return links;
  return links.filter((link) => !link.href.includes(currentSlug));
}

function take(links: RelatedLink[], n: number): RelatedLink[] {
  return links.slice(0, n);
}

// ── Main function ────────────────────────────────────────────

export function getRelatedLinks(
  pageType: PageType,
  context?: LinkContext
): LinkGroup[] {
  const slug = context?.slug;

  switch (pageType) {
    case "state":
      return [
        {
          category: "Top Specialties",
          icon: "Stethoscope",
          links: take(filterOutCurrent(TOP_SPECIALTIES, slug), 5),
        },
        {
          category: "Billing Guides",
          icon: "BookOpen",
          links: take(GUIDES, 3),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: take(TOP_TOOLS, 3),
        },
      ];

    case "specialty":
      return [
        {
          category: "Top States",
          icon: "MapPin",
          links: take(TOP_STATES, 5),
        },
        {
          category: "Billing Guides",
          icon: "BookOpen",
          links: take(GUIDES, 3),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: take(TOP_TOOLS, 3),
        },
      ];

    case "guide":
      return [
        {
          category: "More Guides",
          icon: "BookOpen",
          links: take(filterOutCurrent(GUIDES, slug), 4),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: take([...TOP_TOOLS, ...MORE_TOOLS], 4),
        },
        {
          category: "Data Insights",
          icon: "BarChart3",
          links: take(INSIGHTS, 3),
        },
      ];

    case "tool":
      return [
        {
          category: "More Tools",
          icon: "Wrench",
          links: take(filterOutCurrent([...TOP_TOOLS, ...MORE_TOOLS], slug), 5),
        },
        {
          category: "Billing Guides",
          icon: "BookOpen",
          links: take(GUIDES, 3),
        },
        {
          category: "Browse Data",
          icon: "MapPin",
          links: [
            { label: "States Hub", href: "/states" },
            { label: "Specialties Hub", href: "/specialties" },
            { label: "Billing Codes", href: "/codes" },
          ],
        },
      ];

    case "compare":
      return [
        {
          category: "More Comparisons",
          icon: "ArrowLeftRight",
          links: take(filterOutCurrent(COMPARISONS, slug), 4),
        },
        {
          category: "Alternatives Hub",
          icon: "Layers",
          links: [
            { label: "All Comparisons", href: "/vs" },
            { label: "Alternatives Hub", href: "/alternatives" },
            { label: "Switch to NPIxray", href: "/switch" },
          ],
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: take(TOP_TOOLS, 3),
        },
      ];

    case "code":
      return [
        {
          category: "Billing Guides",
          icon: "BookOpen",
          links: take(GUIDES, 3),
        },
        {
          category: "Related Tools",
          icon: "Wrench",
          links: [
            { label: "Code Lookup", href: "/tools/code-lookup" },
            { label: "E&M Audit Tool", href: "/tools/em-audit" },
            { label: "Revenue Calculator", href: "/tools/revenue-calculator" },
          ],
        },
        {
          category: "Top Specialties",
          icon: "Stethoscope",
          links: take(TOP_SPECIALTIES, 3),
        },
      ];

    case "insight":
      return [
        {
          category: "More Insights",
          icon: "BarChart3",
          links: take(filterOutCurrent(INSIGHTS, slug), 4),
        },
        {
          category: "Browse Data",
          icon: "MapPin",
          links: [
            { label: "All States", href: "/states" },
            { label: "All Specialties", href: "/specialties" },
            { label: "All Codes", href: "/codes" },
          ],
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: take(TOP_TOOLS, 3),
        },
      ];

    case "solution":
      return [
        {
          category: "Billing Guides",
          icon: "BookOpen",
          links: take(GUIDES, 3),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: take(TOP_TOOLS, 3),
        },
        {
          category: "See the Data",
          icon: "BarChart3",
          links: [
            { label: "Pricing", href: "/pricing" },
            { label: "All Insights", href: "/insights" },
            { label: "All Specialties", href: "/specialties" },
          ],
        },
      ];

    case "answer":
      return [
        {
          category: "Billing Guides",
          icon: "BookOpen",
          links: take(GUIDES, 3),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: take(TOP_TOOLS, 3),
        },
        {
          category: "Browse Data",
          icon: "MapPin",
          links: [
            { label: "All States", href: "/states" },
            { label: "All Specialties", href: "/specialties" },
            { label: "All Codes", href: "/codes" },
          ],
        },
      ];

    case "report":
    case "leaderboard":
    case "score":
    case "market":
    case "ranking":
      return [
        {
          category: "Browse Data",
          icon: "MapPin",
          links: take(TOP_STATES, 3),
        },
        {
          category: "Top Specialties",
          icon: "Stethoscope",
          links: take(TOP_SPECIALTIES, 3),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: take(TOP_TOOLS, 3),
        },
      ];

    default:
      return [
        {
          category: "Browse Data",
          icon: "MapPin",
          links: take(TOP_STATES, 3),
        },
        {
          category: "Top Specialties",
          icon: "Stethoscope",
          links: take(TOP_SPECIALTIES, 3),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: take(TOP_TOOLS, 3),
        },
      ];
  }
}
