export interface SwitchPage {
  slug: string;
  fromProduct: string;
  title: string;
  metaTitle: string;
  description: string;
  painPoints: string[];
  benefits: string[];
  steps: { title: string; description: string }[];
  concerns: { concern: string; answer: string }[];
  metrics: { label: string; value: string }[];
}

export const SWITCH_PAGES: SwitchPage[] = [
  // ─── 1. FROM CHARTSPAN ──────────────────────────────────────────────────
  {
    slug: "from-chartspan",
    fromProduct: "ChartSpan",
    title: "Switching from ChartSpan to NPIxray",
    metaTitle: "Switch from ChartSpan to NPIxray — Migration Guide | NPIxray",
    description:
      "Step-by-step guide to switching from ChartSpan to NPIxray for your practice's revenue intelligence needs.",
    painPoints: [
      "High per-patient pricing ($100-200/patient/mo) eating into CCM margins",
      "No visibility into E&M coding gaps or undercoding revenue",
      "No benchmarking against similar practices in your specialty",
      "Cannot see total revenue picture across CCM, RPM, BHI, and AWV programs",
      "Limited analytics — you know what you bill but not what you are missing",
      "Locked into a single vendor for care management without comparison data",
    ],
    benefits: [
      "See all missed revenue sources, not just CCM — including E&M coding gaps, RPM, BHI, and AWV",
      "Free scanner to evaluate your revenue profile before committing to any plan",
      "Real CMS data from 1.175M+ providers for accurate specialty benchmarking",
      "E&M coding analysis identifies undercoding revenue worth $30-50 per visit",
      "Quantified dollar amounts for every revenue gap — not just percentages",
      "Use NPIxray insights to negotiate better rates with ChartSpan or any CCM vendor",
    ],
    steps: [
      {
        title: "Run a free NPI scan",
        description:
          "Enter your NPI on NPIxray to instantly see your complete Medicare revenue profile compared to specialty benchmarks. No signup required.",
      },
      {
        title: "Review your CCM gap analysis",
        description:
          "NPIxray shows your CCM adoption rate versus specialty peers. See if ChartSpan is capturing the full opportunity or if patients are being missed.",
      },
      {
        title: "Identify additional revenue streams",
        description:
          "Discover RPM, BHI, AWV, and E&M coding opportunities you may be missing. Many ChartSpan users find their biggest revenue gaps are outside CCM.",
      },
      {
        title: "Evaluate your vendor relationship",
        description:
          "Use NPIxray data to assess whether your per-patient CCM cost makes sense given your total revenue opportunity. Negotiate from a position of data.",
      },
      {
        title: "Choose your NPIxray plan",
        description:
          "Start free or upgrade to Intelligence ($99/mo) for deep analytics. NPIxray works alongside or instead of your CCM vendor — the choice is yours.",
      },
    ],
    concerns: [
      {
        concern: "Will I lose my CCM patients?",
        answer:
          "NPIxray is an analytics and revenue intelligence layer — you can keep ChartSpan for CCM operations while using NPIxray to identify all your revenue gaps. They are complementary tools.",
      },
      {
        concern: "Is the CMS data accurate and up to date?",
        answer:
          "NPIxray uses official CMS Medicare Physician & Other Practitioners data — the same data CMS publishes for transparency. It covers 1.175M+ providers and is updated with each CMS release.",
      },
      {
        concern: "How long does it take to see results?",
        answer:
          "Your first revenue scan takes less than 30 seconds. There is no onboarding, no data upload, and no contract. You see your revenue gaps immediately.",
      },
      {
        concern: "Can NPIxray replace ChartSpan entirely?",
        answer:
          "NPIxray provides revenue intelligence and analytics. If you need hands-on CCM care coordination, you will still need a CCM operations platform. However, NPIxray helps you decide if the cost is justified by quantifying the full revenue picture.",
      },
    ],
    metrics: [
      { label: "Average CCM adoption rate nationally", value: "12%" },
      { label: "Revenue missed by non-CCM practices", value: "$47K/year" },
      { label: "Time to first insight", value: "< 30 seconds" },
      { label: "Providers in CMS dataset", value: "1.175M+" },
      { label: "Average E&M undercoding gap", value: "$38K/year" },
    ],
  },

  // ─── 2. FROM SIGNALLAMP ─────────────────────────────────────────────────
  {
    slug: "from-signallamp",
    fromProduct: "Signallamp Health",
    title: "Switching from Signallamp Health to NPIxray",
    metaTitle:
      "Switch from Signallamp Health to NPIxray — Migration Guide | NPIxray",
    description:
      "Step-by-step guide to switching from Signallamp Health to NPIxray for complete revenue intelligence and practice benchmarking.",
    painPoints: [
      "Opaque pricing makes it hard to evaluate true ROI on your CCM program",
      "Minimum patient volume requirements lock out smaller practices",
      "Long onboarding process delays revenue generation by weeks",
      "No visibility into revenue opportunities beyond CCM",
      "Cannot benchmark your practice against specialty peers on all metrics",
      "Limited self-service analytics — dependent on account manager for insights",
    ],
    benefits: [
      "Transparent pricing with a free tier and clear upgrade path",
      "No minimum patient volumes — works for any size practice",
      "Instant results with zero onboarding time",
      "Full revenue picture across CCM, RPM, BHI, AWV, and E&M coding",
      "Self-service analytics powered by real CMS data from 1.175M+ providers",
      "Data you own and can use to evaluate any vendor relationship",
    ],
    steps: [
      {
        title: "Scan your practice for free",
        description:
          "Enter your NPI on NPIxray to see your complete revenue profile in under 30 seconds. No contract, no calls with sales reps.",
      },
      {
        title: "Compare your Signallamp results",
        description:
          "See how your CCM adoption rate from Signallamp compares to what NPIxray shows as your total opportunity. Many practices discover significant uncaptured revenue.",
      },
      {
        title: "Explore non-CCM revenue gaps",
        description:
          "NPIxray surfaces RPM, BHI, AWV, and E&M coding opportunities that Signallamp does not analyze. These often exceed CCM revenue potential.",
      },
      {
        title: "Make a data-driven vendor decision",
        description:
          "Use NPIxray analytics to decide whether to keep, renegotiate, or replace your Signallamp contract based on quantified revenue data.",
      },
    ],
    concerns: [
      {
        concern: "Is NPIxray a direct replacement for Signallamp?",
        answer:
          "NPIxray focuses on revenue intelligence and benchmarking, while Signallamp provides care management operations. You can use NPIxray alongside Signallamp to get a complete picture, or use NPIxray data to evaluate alternative CCM vendors.",
      },
      {
        concern: "Do I need to cancel Signallamp first?",
        answer:
          "No. Start with NPIxray's free scan to understand your full revenue opportunity. You can run both in parallel. Many practices use NPIxray data to optimize their Signallamp program.",
      },
      {
        concern: "What if my practice is too small for enterprise analytics?",
        answer:
          "NPIxray has no minimum practice size. The free scanner works for solo practitioners, and paid plans start at $99/month — far less than enterprise analytics platforms.",
      },
    ],
    metrics: [
      { label: "Average onboarding time with NPIxray", value: "0 days" },
      { label: "Practices scanned", value: "1.175M+" },
      { label: "Revenue programs analyzed", value: "5+" },
      { label: "Average missed revenue identified", value: "$85K/year" },
    ],
  },

  // ─── 3. FROM SPREADSHEETS ───────────────────────────────────────────────
  {
    slug: "from-spreadsheets",
    fromProduct: "Spreadsheets",
    title: "Switching from Spreadsheets to NPIxray",
    metaTitle:
      "Switch from Spreadsheets to NPIxray — Stop Manual Revenue Tracking | NPIxray",
    description:
      "Why practices are replacing Excel spreadsheets with NPIxray for revenue analysis. Get instant benchmarking without manual data entry.",
    painPoints: [
      "Hours spent manually entering and updating billing data each month",
      "No benchmark data to compare against — you only see your own numbers",
      "Formula errors and version control issues corrupt analysis",
      "Data becomes stale the moment it is entered",
      "Cannot identify revenue gaps you do not know exist",
      "No specialty-specific context for your coding patterns",
    ],
    benefits: [
      "Instant analysis from real CMS data — no manual data entry required",
      "Automatic benchmarking against 1.175M+ providers in your specialty",
      "Always current with the latest CMS data release",
      "Revenue gaps quantified in dollar amounts, not just raw numbers",
      "Surfaces opportunities you did not know to look for (CCM, RPM, BHI, AWV)",
      "Shareable reports replace scattered spreadsheet files",
    ],
    steps: [
      {
        title: "Run your first NPI scan",
        description:
          "Enter your NPI to get instant revenue intelligence. In 30 seconds, you will have more benchmarking data than months of spreadsheet work.",
      },
      {
        title: "Review coding distribution analysis",
        description:
          "See your E&M coding distribution (99211-99215) compared to specialty averages. Spreadsheets cannot tell you where you rank against peers.",
      },
      {
        title: "Identify care management gaps",
        description:
          "NPIxray automatically checks your CCM, RPM, BHI, and AWV adoption rates against specialty benchmarks — programs your spreadsheet does not track.",
      },
      {
        title: "Share insights with your team",
        description:
          "Replace emailed spreadsheets with NPIxray reports that everyone can access. No more version confusion or outdated data.",
      },
    ],
    concerns: [
      {
        concern: "Can NPIxray import my existing spreadsheet data?",
        answer:
          "NPIxray does not need your spreadsheet data. It uses official CMS Medicare billing data that is already available for your NPI. Your historical spreadsheets remain useful for commercial payer tracking that CMS data does not cover.",
      },
      {
        concern: "Will I still need spreadsheets for anything?",
        answer:
          "NPIxray covers Medicare revenue intelligence comprehensively. You may still use spreadsheets for commercial payer tracking, operational metrics, or other non-Medicare data. But for Medicare benchmarking and revenue gap analysis, NPIxray replaces the spreadsheet entirely.",
      },
      {
        concern: "Is it really free to start?",
        answer:
          "Yes. The NPI scanner is completely free with no signup required. You can scan any provider and see their revenue profile, coding distribution, and care management adoption rates instantly.",
      },
    ],
    metrics: [
      { label: "Time to first insight", value: "< 30 seconds" },
      { label: "Hours saved per month vs spreadsheets", value: "10-20 hours" },
      { label: "Revenue gaps spreadsheets miss", value: "5+ programs" },
      { label: "Accuracy vs manual tracking", value: "CMS-verified data" },
    ],
  },

  // ─── 4. FROM MANUAL BILLING ─────────────────────────────────────────────
  {
    slug: "from-manual-billing",
    fromProduct: "Manual Billing Reviews",
    title: "Switching from Manual Billing Reviews to NPIxray",
    metaTitle:
      "Switch from Manual Billing Reviews to NPIxray — Automate Revenue Analysis | NPIxray",
    description:
      "Replace time-consuming manual billing reviews with instant NPIxray revenue intelligence. See your complete Medicare revenue profile in seconds.",
    painPoints: [
      "Manual billing reviews take days and only happen quarterly at best",
      "Reviews focus on claims already submitted, missing upstream coding opportunities",
      "No external benchmark data — you cannot see where you rank against peers",
      "Billing team bandwidth limits how many providers can be analyzed",
      "Revenue from care management programs (CCM, RPM, AWV) rarely gets reviewed",
      "Findings are point-in-time snapshots that quickly become outdated",
    ],
    benefits: [
      "Instant revenue analysis for any provider in under 30 seconds",
      "Automatic benchmarking against 1.175M+ specialty peers",
      "Identifies upstream coding opportunities, not just downstream billing errors",
      "Covers all revenue programs: E&M coding, CCM, RPM, BHI, and AWV",
      "Scan every provider in your practice, not just a sample",
      "Always up to date with the latest CMS data release",
    ],
    steps: [
      {
        title: "Scan your providers",
        description:
          "Enter each provider's NPI to get instant revenue profiles. What takes your billing team days, NPIxray delivers in seconds per provider.",
      },
      {
        title: "Identify coding pattern issues",
        description:
          "NPIxray compares each provider's E&M distribution to specialty benchmarks. Spot undercoding immediately without chart audits.",
      },
      {
        title: "Discover untapped revenue programs",
        description:
          "See which care management programs (CCM, RPM, BHI, AWV) your providers are not billing for, with estimated revenue for each.",
      },
      {
        title: "Prioritize your highest-impact actions",
        description:
          "NPIxray quantifies each opportunity in dollars, so you can focus your billing team's limited time on the changes that matter most.",
      },
    ],
    concerns: [
      {
        concern: "Does NPIxray replace our billing team?",
        answer:
          "No. NPIxray gives your billing team better data to work with. Instead of spending days on manual reviews, they can focus on acting on the specific revenue gaps NPIxray identifies. It makes your team more effective, not redundant.",
      },
      {
        concern: "Can we trust automated analysis over manual review?",
        answer:
          "NPIxray uses official CMS Medicare data — the same data used for government transparency reporting. It provides the macro view (coding distribution, program adoption) while your billing team handles the micro view (individual claim accuracy).",
      },
      {
        concern: "How does this work with our existing billing workflow?",
        answer:
          "NPIxray is a standalone analytics layer that does not require integration with your billing system. Your team can access it through any web browser and use the insights to guide their existing processes.",
      },
    ],
    metrics: [
      { label: "Time per provider analysis", value: "< 30 seconds" },
      { label: "Providers analyzable per hour", value: "120+" },
      { label: "Revenue programs covered", value: "5+ programs" },
      { label: "Average missed revenue found", value: "$85K/provider/year" },
      { label: "Cost to get started", value: "Free" },
    ],
  },

  // ─── 5. FROM CONSULTANT ─────────────────────────────────────────────────
  {
    slug: "from-consultant",
    fromProduct: "Revenue Consultants",
    title: "Switching from Revenue Consultants to NPIxray",
    metaTitle:
      "Switch from Revenue Consultants to NPIxray — Self-Service Revenue Intelligence | NPIxray",
    description:
      "Replace expensive revenue consulting engagements with always-on NPIxray analytics. Get the same insights at a fraction of the cost.",
    painPoints: [
      "Consulting engagements cost $10,000-50,000+ per assessment",
      "Reports take 4-8 weeks to deliver — data is stale by the time you get it",
      "Consultants use the same CMS data you could access yourself",
      "One-time assessments do not provide ongoing monitoring",
      "Consultant recommendations often lack specificity to your practice",
      "You pay again every time you want updated analysis",
    ],
    benefits: [
      "Instant access to the same CMS data consultants use, for free",
      "Always-on analytics instead of point-in-time consulting reports",
      "Costs $99/month instead of $10,000+ per engagement",
      "Self-service — run scans anytime without scheduling calls",
      "Specific to your NPI with quantified dollar amounts for every gap",
      "Benchmark against 1.175M+ providers, not a consultant's limited client base",
    ],
    steps: [
      {
        title: "Replicate your consultant's baseline",
        description:
          "Run a free NPI scan to see the same type of revenue analysis consultants charge thousands for. Compare the findings to your last consulting report.",
      },
      {
        title: "Go deeper than any consultant",
        description:
          "NPIxray benchmarks against 1.175M+ providers — far more than any consultant's client base. See exactly where you rank in your specialty and region.",
      },
      {
        title: "Set up ongoing monitoring",
        description:
          "Unlike one-time consulting engagements, NPIxray Intelligence ($99/mo) provides continuous revenue monitoring and alerts when your metrics shift.",
      },
      {
        title: "Redirect consulting budget to action",
        description:
          "Use the $10,000-50,000 you save on consulting to fund the actual revenue programs NPIxray identifies — CCM, RPM, AWV implementation, or coding education.",
      },
    ],
    concerns: [
      {
        concern: "Can software really replace a consultant?",
        answer:
          "For data analysis and benchmarking, yes. NPIxray uses the same CMS data consultants rely on, but delivers it instantly and continuously. Where consultants still add value is in organizational change management and implementation — but you need the data first.",
      },
      {
        concern: "What about the strategic advice consultants provide?",
        answer:
          "NPIxray provides data-driven recommendations based on your specific revenue gaps. For complex organizational strategy, a consultant may still be valuable — but you will get far more value from a consultant when you arrive with NPIxray data in hand.",
      },
      {
        concern: "Is the CMS data the same data consultants use?",
        answer:
          "Yes. The CMS Medicare Physician & Other Practitioners dataset is publicly available and is the foundation of most healthcare revenue consulting. NPIxray simply makes it accessible and actionable without the consulting markup.",
      },
    ],
    metrics: [
      { label: "Typical consulting engagement cost", value: "$10K-50K+" },
      { label: "NPIxray Intelligence plan cost", value: "$99/month" },
      { label: "Time to first analysis", value: "< 30 seconds" },
      { label: "Consulting report delivery time", value: "4-8 weeks" },
      { label: "Data freshness", value: "Latest CMS release" },
    ],
  },
];

export function getSwitchPageBySlug(slug: string): SwitchPage | undefined {
  return SWITCH_PAGES.find((p) => p.slug === slug);
}

export function getAllSwitchSlugs(): string[] {
  return SWITCH_PAGES.map((p) => p.slug);
}
