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
  | "ranking"
  | "program"
  | "provider"
  | "city"
  | "state-specialty";

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
  city?: string;
  slug?: string;
}

// ── Static data ──────────────────────────────────────────────

const ALL_STATES: RelatedLink[] = [
  { label: "California", href: "/states/california" },
  { label: "Florida", href: "/states/florida" },
  { label: "Texas", href: "/states/texas" },
  { label: "New York", href: "/states/new-york" },
  { label: "Pennsylvania", href: "/states/pennsylvania" },
  { label: "Ohio", href: "/states/ohio" },
  { label: "Illinois", href: "/states/illinois" },
  { label: "Michigan", href: "/states/michigan" },
  { label: "Georgia", href: "/states/georgia" },
  { label: "North Carolina", href: "/states/north-carolina" },
  { label: "New Jersey", href: "/states/new-jersey" },
  { label: "Virginia", href: "/states/virginia" },
];

const TOP_STATES = ALL_STATES.slice(0, 5);

const ALL_SPECIALTIES: RelatedLink[] = [
  { label: "Family Medicine", href: "/specialties/family-medicine" },
  { label: "Internal Medicine", href: "/specialties/internal-medicine" },
  { label: "Cardiology", href: "/specialties/cardiology" },
  { label: "Orthopedic Surgery", href: "/specialties/orthopedic-surgery" },
  { label: "Dermatology", href: "/specialties/dermatology" },
  { label: "Ophthalmology", href: "/specialties/ophthalmology" },
  { label: "Gastroenterology", href: "/specialties/gastroenterology" },
  { label: "Psychiatry", href: "/specialties/psychiatry" },
  { label: "Neurology", href: "/specialties/neurology" },
  { label: "Urology", href: "/specialties/urology" },
  { label: "Pulmonary Disease", href: "/specialties/pulmonary-disease" },
  { label: "Emergency Medicine", href: "/specialties/emergency-medicine" },
];

const TOP_SPECIALTIES = ALL_SPECIALTIES.slice(0, 5);

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

const PROGRAMS: RelatedLink[] = [
  { label: "CCM Program", href: "/programs/ccm" },
  { label: "RPM Program", href: "/programs/rpm" },
  { label: "AWV Program", href: "/programs/awv" },
  { label: "BHI Program", href: "/programs/bhi" },
  { label: "E&M Coding", href: "/programs/em-coding" },
];

const INSIGHTS: RelatedLink[] = [
  { label: "Medicare Billing Overview", href: "/insights/medicare-billing-overview" },
  { label: "E&M Coding Patterns", href: "/insights/em-coding-patterns" },
  { label: "CCM Adoption Rates", href: "/insights/ccm-adoption-rates" },
  { label: "Revenue Gap by Specialty", href: "/insights/revenue-gap-by-specialty" },
  { label: "Highest-Paying Specialties", href: "/insights/highest-paying-specialties" },
];

const HUB_PAGES: RelatedLink[] = [
  { label: "All States", href: "/states" },
  { label: "All Specialties", href: "/specialties" },
  { label: "All Billing Codes", href: "/codes" },
  { label: "Free NPI Scanner", href: "/" },
  { label: "Practice Solutions", href: "/solutions" },
];

const HIGH_VALUE_PAGES: RelatedLink[] = [
  { label: "Free NPI Scanner", href: "/" },
  { label: "Acquisition Intelligence", href: "/acquire" },
  { label: "All Free Tools", href: "/tools" },
  { label: "Pricing", href: "/pricing" },
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
          category: "Other States",
          icon: "MapPin",
          links: take(filterOutCurrent(ALL_STATES, slug), 6),
        },
        {
          category: "Top Specialties",
          icon: "Stethoscope",
          links: take(TOP_SPECIALTIES, 5),
        },
        {
          category: "Guides & Tools",
          icon: "BookOpen",
          links: [
            ...take(GUIDES, 2),
            { label: "Free NPI Scanner", href: "/" },
            { label: "All Free Tools", href: "/tools" },
          ],
        },
      ];

    case "specialty":
      return [
        {
          category: "Other Specialties",
          icon: "Stethoscope",
          links: take(filterOutCurrent(ALL_SPECIALTIES, slug), 6),
        },
        {
          category: "Top States",
          icon: "MapPin",
          links: take(TOP_STATES, 5),
        },
        {
          category: "Guides & Tools",
          icon: "BookOpen",
          links: [
            ...take(GUIDES, 2),
            { label: "Free NPI Scanner", href: "/" },
            { label: "Practice Benchmark", href: "/tools/practice-benchmark" },
          ],
        },
      ];

    case "provider": {
      const providerBrowseLinks: RelatedLink[] = [];
      if (context?.state) providerBrowseLinks.push({ label: "State Overview", href: `/states/${context.state}` });
      if (context?.state && context?.city) providerBrowseLinks.push({ label: "City Providers", href: `/states/${context.state}/${context.city}` });
      if (context?.specialty) providerBrowseLinks.push({ label: "Specialty Benchmarks", href: `/specialties/${context.specialty}` });
      providerBrowseLinks.push({ label: "All States", href: "/states" });
      providerBrowseLinks.push({ label: "All Specialties", href: "/specialties" });
      return [
        {
          category: "Browse Data",
          icon: "MapPin",
          links: providerBrowseLinks.slice(0, 5),
        },
        {
          category: "Billing Guides",
          icon: "BookOpen",
          links: take(GUIDES, 3),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: [
            { label: "Revenue Calculator", href: "/tools/revenue-calculator" },
            { label: "E&M Audit Tool", href: "/tools/em-audit" },
            { label: "Practice Benchmark", href: "/tools/practice-benchmark" },
            { label: "All Free Tools", href: "/tools" },
          ],
        },
      ];
    }

    case "city":
      return [
        {
          category: "State Data",
          icon: "MapPin",
          links: [
            ...(context?.state ? [{ label: "State Overview", href: `/states/${context.state}` }] : []),
            ...take(filterOutCurrent(ALL_STATES, context?.state), 4),
          ].slice(0, 5),
        },
        {
          category: "Top Specialties",
          icon: "Stethoscope",
          links: take(TOP_SPECIALTIES, 4),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: [
            { label: "Free NPI Scanner", href: "/" },
            { label: "NPI Lookup", href: "/tools/npi-lookup" },
            { label: "Practice Benchmark", href: "/tools/practice-benchmark" },
          ],
        },
      ];

    case "state-specialty":
      return [
        {
          category: "Browse More",
          icon: "MapPin",
          links: [
            ...(context?.state ? [{ label: "State Overview", href: `/states/${context.state}` }] : []),
            ...(context?.specialty ? [{ label: "Specialty Nationally", href: `/specialties/${context.specialty}` }] : []),
            { label: "All States", href: "/states" },
            { label: "All Specialties", href: "/specialties" },
          ].slice(0, 4),
        },
        {
          category: "Billing Guides",
          icon: "BookOpen",
          links: take(GUIDES, 3),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: [
            { label: "Free NPI Scanner", href: "/" },
            { label: "Revenue Calculator", href: "/tools/revenue-calculator" },
            { label: "Practice Benchmark", href: "/tools/practice-benchmark" },
          ],
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
          links: [
            ...take(INSIGHTS, 2),
            { label: "Free NPI Scanner", href: "/" },
          ],
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
            { label: "All States", href: "/states" },
            { label: "All Specialties", href: "/specialties" },
            { label: "All Billing Codes", href: "/codes" },
            { label: "Free NPI Scanner", href: "/" },
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
          links: [
            { label: "Free NPI Scanner", href: "/" },
            ...take(TOP_TOOLS, 2),
          ],
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
          category: "Browse Data",
          icon: "Stethoscope",
          links: [
            ...take(TOP_SPECIALTIES, 2),
            { label: "All Billing Codes", href: "/codes" },
            { label: "All States", href: "/states" },
          ],
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
            { label: "All Billing Codes", href: "/codes" },
          ],
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: [
            { label: "Free NPI Scanner", href: "/" },
            ...take(TOP_TOOLS, 2),
          ],
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
          links: [
            { label: "Free NPI Scanner", href: "/" },
            ...take(TOP_TOOLS, 2),
          ],
        },
        {
          category: "See the Data",
          icon: "BarChart3",
          links: [
            { label: "Pricing", href: "/pricing" },
            { label: "All Insights", href: "/insights" },
            { label: "All Specialties", href: "/specialties" },
            { label: "Acquisition Intelligence", href: "/acquire" },
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
          links: [
            { label: "Free NPI Scanner", href: "/" },
            ...take(TOP_TOOLS, 2),
          ],
        },
        {
          category: "Browse Data",
          icon: "MapPin",
          links: [
            { label: "All States", href: "/states" },
            { label: "All Specialties", href: "/specialties" },
            { label: "All Billing Codes", href: "/codes" },
          ],
        },
      ];

    case "program":
      return [
        {
          category: "More Programs",
          icon: "Activity",
          links: take(filterOutCurrent(PROGRAMS, slug), 4),
        },
        {
          category: "Billing Guides",
          icon: "BookOpen",
          links: take(GUIDES, 3),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: [
            { label: "Free NPI Scanner", href: "/" },
            ...take(TOP_TOOLS, 2),
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
          category: "Browse States",
          icon: "MapPin",
          links: take(filterOutCurrent(ALL_STATES, slug), 5),
        },
        {
          category: "Top Specialties",
          icon: "Stethoscope",
          links: take(filterOutCurrent(ALL_SPECIALTIES, slug), 5),
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: [
            { label: "Free NPI Scanner", href: "/" },
            ...take(TOP_TOOLS, 2),
          ],
        },
      ];

    default:
      return [
        {
          category: "Browse Data",
          icon: "MapPin",
          links: [
            ...take(TOP_STATES, 3),
            { label: "All States", href: "/states" },
          ],
        },
        {
          category: "Top Specialties",
          icon: "Stethoscope",
          links: [
            ...take(TOP_SPECIALTIES, 3),
            { label: "All Specialties", href: "/specialties" },
          ],
        },
        {
          category: "Free Tools",
          icon: "Wrench",
          links: [
            { label: "Free NPI Scanner", href: "/" },
            ...take(TOP_TOOLS, 2),
          ],
        },
      ];
  }
}
