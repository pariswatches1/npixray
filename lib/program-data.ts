// ────────────────────────────────────────────────────────────
// Program Hub static data — powers /programs and /programs/[slug]
// ────────────────────────────────────────────────────────────

export interface BillingCode {
  code: string;
  description: string;
  rate: string;
}

export interface ProgramHub {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  dbKey: "ccm" | "rpm" | "bhi" | "awv" | null; // null = em-coding (no single adoption column)
  billingCodes: BillingCode[];
  eligibilityCriteria: string[];
  guideLink: string;
  calculatorLink: string | null;
  insightLink: string | null;
  codePageLinks: { label: string; href: string }[];
}

export const PROGRAM_HUBS: ProgramHub[] = [
  {
    slug: "ccm",
    name: "CCM",
    fullName: "Chronic Care Management",
    description:
      "CCM enables providers to bill Medicare for non-face-to-face care coordination for patients with two or more chronic conditions. With national adoption still under 15%, CCM represents one of the largest untapped revenue streams in primary care.",
    dbKey: "ccm",
    billingCodes: [
      { code: "99490", description: "CCM — first 20 minutes per month", rate: "$66.00" },
      { code: "99491", description: "CCM — complex, first 30 minutes (physician-led)", rate: "$87.46" },
      { code: "99437", description: "CCM — each additional 30 minutes", rate: "$63.62" },
      { code: "99439", description: "CCM — each additional 20 minutes", rate: "$47.44" },
    ],
    eligibilityCriteria: [
      "Patient has 2+ chronic conditions expected to last 12+ months",
      "Conditions place patient at significant risk of death, decompensation, or functional decline",
      "Written or verbal consent from the patient (documented in chart)",
      "Minimum 20 minutes of clinical staff time per calendar month",
    ],
    guideLink: "/guides/ccm-billing-99490",
    calculatorLink: "/tools/ccm-calculator",
    insightLink: "/insights/ccm-adoption-rates",
    codePageLinks: [
      { label: "CPT 99490", href: "/codes/99490" },
      { label: "CPT 99491", href: "/codes/99491" },
      { label: "CPT 99437", href: "/codes/99437" },
      { label: "CPT 99439", href: "/codes/99439" },
    ],
  },
  {
    slug: "rpm",
    name: "RPM",
    fullName: "Remote Patient Monitoring",
    description:
      "RPM allows providers to bill for remote monitoring of physiologic parameters (blood pressure, glucose, weight, pulse ox) using FDA-cleared devices. RPM revenue stacks on top of CCM and generates recurring monthly income per enrolled patient.",
    dbKey: "rpm",
    billingCodes: [
      { code: "99453", description: "RPM — initial device setup and patient education", rate: "$19.32" },
      { code: "99454", description: "RPM — device supply and daily recordings (30-day period)", rate: "$55.72" },
      { code: "99457", description: "RPM — first 20 minutes of monitoring per month", rate: "$51.60" },
      { code: "99458", description: "RPM — each additional 20 minutes", rate: "$42.22" },
    ],
    eligibilityCriteria: [
      "Patient has an acute or chronic condition requiring monitoring",
      "Uses FDA-cleared physiologic monitoring device",
      "Device transmits data at least 16 of 30 days per billing period",
      "Minimum 20 minutes of interactive communication per month (for 99457)",
    ],
    guideLink: "/guides/rpm-billing-99453-99458",
    calculatorLink: "/tools/rpm-calculator",
    insightLink: "/insights/rpm-adoption-rates",
    codePageLinks: [
      { label: "CPT 99453", href: "/codes/99453" },
      { label: "CPT 99454", href: "/codes/99454" },
      { label: "CPT 99457", href: "/codes/99457" },
      { label: "CPT 99458", href: "/codes/99458" },
    ],
  },
  {
    slug: "awv",
    name: "AWV",
    fullName: "Annual Wellness Visit",
    description:
      "The Annual Wellness Visit is a preventive service covered by Medicare with no patient copay. AWVs create a Health Risk Assessment, update care plans, and identify candidates for CCM, RPM, and BHI programs — making it the gateway to recurring revenue.",
    dbKey: "awv",
    billingCodes: [
      { code: "G0438", description: "AWV — initial visit (first AWV ever)", rate: "$174.79" },
      { code: "G0439", description: "AWV — subsequent annual visit", rate: "$118.88" },
    ],
    eligibilityCriteria: [
      "Patient has been enrolled in Medicare Part B for 12+ months",
      "Patient has not had an AWV in the preceding 12 months",
      "Includes Health Risk Assessment (HRA), review of functional ability, and detection of cognitive impairment",
      "No patient copay — 100% covered by Medicare",
    ],
    guideLink: "/guides/awv-billing-g0438-g0439",
    calculatorLink: "/tools/awv-calculator",
    insightLink: "/insights/awv-completion-rates",
    codePageLinks: [
      { label: "HCPCS G0438", href: "/codes/g0438" },
      { label: "HCPCS G0439", href: "/codes/g0439" },
    ],
  },
  {
    slug: "bhi",
    name: "BHI",
    fullName: "Behavioral Health Integration",
    description:
      "BHI allows primary care providers to bill for behavioral health services including depression screening, care management, and psychiatric consultation. With national adoption under 3%, BHI is the most underutilized Medicare revenue program.",
    dbKey: "bhi",
    billingCodes: [
      { code: "99484", description: "BHI — care management, 20+ minutes per month", rate: "$48.56" },
      { code: "99492", description: "Psychiatric CoCM — initial 70 minutes per month", rate: "$163.70" },
      { code: "99493", description: "Psychiatric CoCM — subsequent 60 minutes per month", rate: "$130.40" },
      { code: "99494", description: "Psychiatric CoCM — additional 30 minutes per month", rate: "$67.66" },
    ],
    eligibilityCriteria: [
      "Patient has a behavioral health condition (depression, anxiety, substance use, etc.)",
      "Systematic assessment using validated tools (PHQ-9, GAD-7, etc.)",
      "Care plan developed and documented",
      "Minimum 20 minutes of clinical staff time per calendar month (for 99484)",
    ],
    guideLink: "/guides/bhi-billing-99484",
    calculatorLink: null,
    insightLink: null,
    codePageLinks: [
      { label: "CPT 99484", href: "/codes/99484" },
      { label: "CPT 99492", href: "/codes/99492" },
      { label: "CPT 99493", href: "/codes/99493" },
    ],
  },
  {
    slug: "em-coding",
    name: "E&M Coding",
    fullName: "Evaluation & Management Coding Optimization",
    description:
      "E&M codes (99211–99215) make up the largest share of Medicare billing for most practices. Many providers systematically under-code by defaulting to 99213 when documentation supports 99214 or 99215. Optimizing E&M coding can increase revenue by $15,000–$40,000 per provider per year.",
    dbKey: null,
    billingCodes: [
      { code: "99211", description: "E&M — Level 1 (minimal problem, nurse visit)", rate: "$23.46" },
      { code: "99212", description: "E&M — Level 2 (straightforward MDM)", rate: "$57.68" },
      { code: "99213", description: "E&M — Level 3 (low MDM complexity)", rate: "$97.52" },
      { code: "99214", description: "E&M — Level 4 (moderate MDM complexity)", rate: "$143.52" },
      { code: "99215", description: "E&M — Level 5 (high MDM complexity)", rate: "$193.46" },
    ],
    eligibilityCriteria: [
      "Medical Decision Making (MDM) or total time determines E&M level",
      "2021 guidelines eliminated history and exam as determining factors",
      "99214 requires moderate complexity: 2+ chronic conditions or new problem with workup",
      "99215 requires high complexity: severe exacerbation or threat to life/function",
    ],
    guideLink: "/guides/em-coding-optimization",
    calculatorLink: "/tools/em-audit",
    insightLink: "/insights/em-coding-patterns",
    codePageLinks: [
      { label: "CPT 99213", href: "/codes/99213" },
      { label: "CPT 99214", href: "/codes/99214" },
      { label: "CPT 99215", href: "/codes/99215" },
      { label: "CPT 99212", href: "/codes/99212" },
    ],
  },
];

export function getProgramHub(slug: string): ProgramHub | undefined {
  return PROGRAM_HUBS.find((p) => p.slug === slug);
}

export function getAllProgramSlugs(): string[] {
  return PROGRAM_HUBS.map((p) => p.slug);
}
