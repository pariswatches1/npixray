import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Zap,
  Clock,
  TrendingUp,
  Shield,
  BarChart3,
  DollarSign,
  Users,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";

// ────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────

interface PainPoint {
  title: string;
  description: string;
}

interface MigrationStep {
  title: string;
  description: string;
  duration: string;
}

interface Benefit {
  icon: "trending" | "clock" | "shield" | "chart" | "dollar" | "users" | "sparkles" | "target";
  title: string;
  description: string;
}

interface ConcernFAQ {
  question: string;
  answer: string;
}

interface SuccessMetric {
  label: string;
  value: string;
  note: string;
}

interface SwitchPageData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  source: string;
  heroSubtitle: string;
  painPoints: PainPoint[];
  steps: MigrationStep[];
  benefits: Benefit[];
  concerns: ConcernFAQ[];
  metrics: SuccessMetric[];
}

// ────────────────────────────────────────────────────────────
// Icon helper
// ────────────────────────────────────────────────────────────

function BenefitIcon({ icon }: { icon: Benefit["icon"] }) {
  const cls = "h-5 w-5 text-gold";
  switch (icon) {
    case "trending":
      return <TrendingUp className={cls} />;
    case "clock":
      return <Clock className={cls} />;
    case "shield":
      return <Shield className={cls} />;
    case "chart":
      return <BarChart3 className={cls} />;
    case "dollar":
      return <DollarSign className={cls} />;
    case "users":
      return <Users className={cls} />;
    case "sparkles":
      return <Sparkles className={cls} />;
    case "target":
      return <Target className={cls} />;
  }
}

// ────────────────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────────────────

const SWITCH_PAGES: Record<string, SwitchPageData> = {
  "from-chartspan": {
    title: "Switching from ChartSpan to NPIxray",
    metaTitle:
      "Switch from ChartSpan to NPIxray — Better Analytics, More Revenue",
    metaDescription:
      "Thinking of switching from ChartSpan? NPIxray provides deeper Medicare revenue analytics, CMS data-driven insights, and benchmarking that ChartSpan does not offer. See your revenue gaps instantly.",
    source: "ChartSpan",
    heroSubtitle:
      "ChartSpan handles CCM workflows well, but it cannot tell you what you are missing across your entire Medicare billing profile. NPIxray fills that gap with real CMS data analytics.",
    painPoints: [
      {
        title: "Limited visibility beyond CCM",
        description:
          "ChartSpan focuses exclusively on Chronic Care Management. You have no insight into E&M coding gaps, RPM opportunities, AWV completion rates, or other revenue streams that may represent larger opportunities than CCM alone.",
      },
      {
        title: "Revenue share reduces your margins",
        description:
          "ChartSpan's revenue share model means you keep only a portion of each CCM dollar. As your program grows, the amount paid to ChartSpan grows too — without a corresponding increase in the value you receive.",
      },
      {
        title: "No CMS data benchmarking",
        description:
          "ChartSpan cannot tell you how your billing patterns compare to specialty peers or geographic averages. Without benchmarking, you have no way to know if your coding is optimal or if you are leaving money on the table.",
      },
      {
        title: "Black box patient interactions",
        description:
          "When ChartSpan handles patient outreach, you lose visibility into the quality and content of those interactions. Your patients are talking to ChartSpan staff, not your team, which can create disconnects in care continuity.",
      },
    ],
    steps: [
      {
        title: "Run a free NPIxray scan",
        description:
          "Enter your NPI number on NPIxray.com to instantly see your complete Medicare billing profile — E&M coding distribution, care management adoption rates, and specific revenue gaps. This takes 30 seconds and requires no account.",
        duration: "30 seconds",
      },
      {
        title: "Review your full revenue picture",
        description:
          "Compare the revenue opportunities NPIxray identifies across all programs (E&M, CCM, RPM, BHI, AWV) against what ChartSpan is currently capturing from CCM alone. Most practices find that CCM is only 20-30% of their total missed revenue.",
        duration: "15 minutes",
      },
      {
        title: "Evaluate your CCM program performance",
        description:
          "Use NPIxray's benchmarking data to assess whether your ChartSpan-managed CCM enrollment rate is meeting, exceeding, or falling short of your specialty peers. This gives you leverage in any conversation about program performance.",
        duration: "10 minutes",
      },
      {
        title: "Set up NPIxray's analytics dashboard",
        description:
          "Create your NPIxray account to get ongoing analytics, automated monitoring of your billing patterns, and alerts when new revenue opportunities emerge. NPIxray works alongside or independently of your CCM platform.",
        duration: "5 minutes",
      },
    ],
    benefits: [
      {
        icon: "chart",
        title: "Complete revenue visibility",
        description:
          "See every Medicare revenue opportunity — not just CCM — including E&M coding gaps, RPM, BHI, and AWV programs.",
      },
      {
        icon: "trending",
        title: "CMS data benchmarking",
        description:
          "Compare your billing against 1.2M+ providers by specialty and geography using real CMS Medicare data.",
      },
      {
        icon: "dollar",
        title: "No revenue share",
        description:
          "NPIxray charges a flat monthly fee. You keep 100% of the revenue you capture from the insights.",
      },
      {
        icon: "sparkles",
        title: "AI-powered analysis",
        description:
          "Get intelligent, personalized recommendations based on your specific billing patterns and peer comparisons.",
      },
      {
        icon: "clock",
        title: "Instant results",
        description:
          "No onboarding process or implementation timeline. Run a free scan and see your revenue gaps in 30 seconds.",
      },
      {
        icon: "target",
        title: "Quantified revenue gaps",
        description:
          "Every opportunity comes with a dollar amount so you can prioritize the highest-impact changes first.",
      },
    ],
    concerns: [
      {
        question: "Can I use NPIxray and ChartSpan together?",
        answer:
          "Yes. NPIxray and ChartSpan serve different functions. ChartSpan manages your CCM workflow and patient outreach, while NPIxray provides revenue analytics and benchmarking across all programs. Many practices use both — NPIxray identifies the opportunities, and ChartSpan (or another platform) executes on CCM specifically.",
      },
      {
        question: "Will switching disrupt my current CCM patients?",
        answer:
          "NPIxray is an analytics platform, not a CCM workflow replacement. Adding NPIxray does not affect your current ChartSpan CCM operations. If you later decide to transition CCM to an in-house program, NPIxray's data helps you make that decision with full visibility into the financial impact.",
      },
      {
        question: "How is NPIxray's data different from ChartSpan's reports?",
        answer:
          "ChartSpan reports on the CCM patients they manage — enrollment counts, billing generated, and program metrics. NPIxray uses the full CMS Medicare dataset to show your complete billing profile, compare you against every peer in your specialty, and identify revenue opportunities ChartSpan does not cover.",
      },
      {
        question: "What if I want to bring CCM in-house?",
        answer:
          "NPIxray's benchmarking data gives you the exact information you need to evaluate in-house vs. outsourced CCM. You will see your eligible patient count, the revenue at stake, and what it would take to capture it yourself rather than paying a revenue share.",
      },
    ],
    metrics: [
      {
        label: "Additional Revenue Identified",
        value: "$40K-$120K/yr",
        note: "Beyond what CCM alone captures",
      },
      {
        label: "Time to First Insight",
        value: "30 seconds",
        note: "Free NPI scan with no account required",
      },
      {
        label: "Average E&M Uplift Found",
        value: "15-25%",
        note: "From coding optimization benchmarks",
      },
      {
        label: "Programs Analyzed",
        value: "5+",
        note: "E&M, CCM, RPM, BHI, AWV, and more",
      },
    ],
  },

  "from-signallamp": {
    title: "Switching from SignalLamp to NPIxray",
    metaTitle:
      "Switch from SignalLamp to NPIxray — Deeper Analytics, Free Entry Point",
    metaDescription:
      "Considering switching from SignalLamp? NPIxray offers a free NPI scan, broader revenue analysis, and AI-powered benchmarking using real CMS Medicare data.",
    source: "SignalLamp",
    heroSubtitle:
      "SignalLamp offers Medicare analytics, but NPIxray goes further with a free entry point, AI-powered insights, and broader revenue gap analysis across all care management programs.",
    painPoints: [
      {
        title: "No free tier to evaluate before committing",
        description:
          "SignalLamp requires a paid subscription before you see any results. You have to invest $200-$600/month without knowing whether the insights will be actionable for your specific practice.",
      },
      {
        title: "Limited care management program analysis",
        description:
          "While SignalLamp provides general billing analytics, it does not offer the deep, program-specific analysis of CCM, RPM, BHI, and AWV opportunities that directly translate into new revenue streams.",
      },
      {
        title: "Complex interface with steep learning curve",
        description:
          "SignalLamp's interface was built for data analysts, not busy physicians and practice managers. Getting actionable insights often requires significant time investment learning to navigate the platform.",
      },
      {
        title: "Missing AI-powered recommendations",
        description:
          "SignalLamp presents data but lacks AI-powered analysis that translates raw numbers into specific, prioritized action items. You are left to interpret the data yourself.",
      },
    ],
    steps: [
      {
        title: "Run your free NPIxray scan",
        description:
          "Enter your NPI number on NPIxray.com to immediately see your E&M coding distribution, care management adoption rates, and revenue gaps. Compare the depth of this free scan against what you are paying SignalLamp for today.",
        duration: "30 seconds",
      },
      {
        title: "Compare insights side by side",
        description:
          "Look at the revenue opportunities NPIxray identifies and compare them against your SignalLamp reports. Note the specific dollar amounts, the care management programs analyzed, and the peer benchmarking data.",
        duration: "20 minutes",
      },
      {
        title: "Set up your NPIxray account",
        description:
          "Create your NPIxray account for ongoing monitoring, automated alerts, and full access to AI-powered revenue analysis. The setup takes minutes, not weeks.",
        duration: "5 minutes",
      },
      {
        title: "Cancel SignalLamp when ready",
        description:
          "Once you have confirmed that NPIxray provides equal or better insights, cancel your SignalLamp subscription. With NPIxray's lower pricing, most practices save $100-$400/month while getting deeper analytics.",
        duration: "5 minutes",
      },
    ],
    benefits: [
      {
        icon: "dollar",
        title: "Free NPI scan — no commitment",
        description:
          "See your complete revenue analysis before paying a cent. No credit card, no account required for the initial scan.",
      },
      {
        icon: "sparkles",
        title: "AI-powered recommendations",
        description:
          "NPIxray does not just show data — it provides specific, prioritized recommendations backed by AI analysis of your billing patterns.",
      },
      {
        icon: "trending",
        title: "Broader program coverage",
        description:
          "Deep analysis across E&M coding, CCM, RPM, BHI, and AWV — not just general billing trends.",
      },
      {
        icon: "users",
        title: "Larger benchmark database",
        description:
          "Benchmark against 1.2M+ Medicare providers for the most accurate peer comparisons available.",
      },
      {
        icon: "clock",
        title: "Intuitive interface",
        description:
          "Designed for physicians and practice managers, not data analysts. Get insights in seconds, not hours.",
      },
      {
        icon: "shield",
        title: "Lower total cost",
        description:
          "Starting at $99/month for full analytics — significantly less than SignalLamp's $200-$600/month pricing.",
      },
    ],
    concerns: [
      {
        question: "Is NPIxray's data as comprehensive as SignalLamp's?",
        answer:
          "NPIxray uses the same CMS Medicare Physician and Other Practitioners dataset that SignalLamp references, covering 1.2M+ providers and 10M+ service records. NPIxray adds AI analysis and program-specific revenue gap calculations on top of this data.",
      },
      {
        question: "Can I test NPIxray before canceling SignalLamp?",
        answer:
          "Absolutely. Run a free NPIxray scan to see the results instantly. There is no commitment or account required. Compare the insights against your current SignalLamp reports before making any changes.",
      },
      {
        question: "Will I lose access to my historical SignalLamp data?",
        answer:
          "Export any reports you need from SignalLamp before canceling. NPIxray builds your analytics from CMS data, so your historical billing patterns are reflected in the analysis from day one — you do not need to import historical data.",
      },
      {
        question: "How does NPIxray's pricing compare?",
        answer:
          "NPIxray starts with a completely free NPI scan and paid plans from $99/month. SignalLamp typically costs $200-$600/month. Most practices save $100-$400/month while getting more actionable insights.",
      },
    ],
    metrics: [
      {
        label: "Monthly Savings",
        value: "$100-$400",
        note: "Compared to typical SignalLamp pricing",
      },
      {
        label: "Revenue Gaps Identified",
        value: "5+ programs",
        note: "E&M, CCM, RPM, BHI, AWV analyzed",
      },
      {
        label: "Time to Results",
        value: "30 seconds",
        note: "Free scan vs. weeks of onboarding",
      },
      {
        label: "Benchmark Database",
        value: "1.2M+ providers",
        note: "Full CMS Medicare dataset",
      },
    ],
  },

  "from-spreadsheets": {
    title: "Switching from Spreadsheets to NPIxray",
    metaTitle:
      "Switch from Spreadsheets to NPIxray — Automate Your Revenue Analysis",
    metaDescription:
      "Stop analyzing Medicare billing data in spreadsheets. NPIxray automates revenue analysis, benchmarking, and gap identification using real CMS data — with a free NPI scan.",
    source: "Spreadsheets",
    heroSubtitle:
      "If you are analyzing Medicare billing data in Excel or Google Sheets, you are spending hours on work that NPIxray automates in seconds — with more accuracy and depth.",
    painPoints: [
      {
        title: "Hours wasted on manual data processing",
        description:
          "Downloading CMS data files, cleaning columns, building pivot tables, and formatting reports consumes hours every month. That is time you could spend on patient care or practice growth.",
      },
      {
        title: "Error-prone calculations",
        description:
          "Manual formula errors in spreadsheets can lead to incorrect revenue projections, missed opportunities, and flawed benchmarking. A single misplaced cell reference can cascade through your entire analysis.",
      },
      {
        title: "No real-time benchmarking",
        description:
          "Building peer benchmarks in a spreadsheet requires downloading and processing data for thousands of providers. Most practices give up and benchmark against outdated or incomplete data — or do not benchmark at all.",
      },
      {
        title: "Stale data with no automated updates",
        description:
          "CMS releases updated data periodically, but updating your spreadsheet analysis requires repeating the entire download-clean-analyze process. Most spreadsheet analyses quickly become outdated.",
      },
    ],
    steps: [
      {
        title: "Run your free NPIxray scan",
        description:
          "Enter your NPI number and see in 30 seconds what takes hours in a spreadsheet: your complete E&M coding distribution, care management adoption rates, revenue gaps, and peer benchmarks — all calculated automatically.",
        duration: "30 seconds",
      },
      {
        title: "Compare against your spreadsheet analysis",
        description:
          "Open your most recent spreadsheet analysis alongside NPIxray's results. Note any gaps or discrepancies — NPIxray typically identifies revenue opportunities that manual spreadsheet analysis misses, especially across care management programs.",
        duration: "15 minutes",
      },
      {
        title: "Create your NPIxray account",
        description:
          "Set up your account for ongoing access to automated analytics, real-time benchmarking, and alerts when new revenue opportunities appear. No more manual data refreshes.",
        duration: "5 minutes",
      },
      {
        title: "Retire the spreadsheets",
        description:
          "Archive your billing analysis spreadsheets and redirect those hours to acting on the insights NPIxray surfaces. Focus on capturing revenue rather than calculating it.",
        duration: "Immediate",
      },
    ],
    benefits: [
      {
        icon: "clock",
        title: "Hours saved every month",
        description:
          "Replace days of manual data processing with a 30-second automated scan. Reclaim time for patient care and practice operations.",
      },
      {
        icon: "shield",
        title: "Elimination of manual errors",
        description:
          "Automated calculations eliminate formula errors, misplaced references, and data processing mistakes that plague spreadsheet analysis.",
      },
      {
        icon: "trending",
        title: "Real-time peer benchmarking",
        description:
          "Benchmark against 1.2M+ providers instantly — something that would take weeks to build manually in a spreadsheet.",
      },
      {
        icon: "sparkles",
        title: "AI-powered insights",
        description:
          "NPIxray does not just present numbers — it interprets them with AI analysis that identifies specific actions you should take.",
      },
      {
        icon: "chart",
        title: "Automatic data updates",
        description:
          "When CMS releases new data, NPIxray updates automatically. No more manual downloads, parsing, and reformatting.",
      },
      {
        icon: "target",
        title: "Complete program coverage",
        description:
          "Analyze E&M coding, CCM, RPM, BHI, and AWV in one view. Building this across programs in a spreadsheet would require dozens of tabs.",
      },
    ],
    concerns: [
      {
        question: "Can NPIxray export data for my own analysis?",
        answer:
          "Yes. NPIxray provides exportable reports and data that you can use in spreadsheets, presentations, or board reports. You get the best of both worlds: automated analysis plus raw data when you need it.",
      },
      {
        question: "Is the data the same as what I download from CMS?",
        answer:
          "NPIxray processes the same CMS Medicare Physician and Other Practitioners dataset, but applies automated cleaning, normalization, benchmarking, and AI analysis that would take days to replicate manually.",
      },
      {
        question: "I am comfortable with spreadsheets — why change?",
        answer:
          "We appreciate the skill it takes to build billing analysis in spreadsheets. NPIxray is not about replacing your expertise — it is about eliminating the hours of data processing so you can focus on interpreting and acting on the insights. Most spreadsheet users find NPIxray surfaces opportunities they missed.",
      },
      {
        question: "What about custom analyses I currently run?",
        answer:
          "NPIxray covers the most impactful revenue analyses automatically. For truly custom analyses, you can export NPIxray data into your preferred spreadsheet tool. Over time, most users find they need fewer custom spreadsheets as NPIxray covers their key questions.",
      },
    ],
    metrics: [
      {
        label: "Time Saved Per Month",
        value: "10-20 hours",
        note: "Automated vs. manual data processing",
      },
      {
        label: "Error Rate Reduction",
        value: "Near zero",
        note: "Automated calculations eliminate formula errors",
      },
      {
        label: "Peer Benchmark Size",
        value: "1.2M+ providers",
        note: "vs. a handful in manual analysis",
      },
      {
        label: "Programs Covered",
        value: "5+",
        note: "E&M, CCM, RPM, BHI, AWV automated",
      },
    ],
  },

  "from-manual-billing": {
    title: "Switching from Manual Billing Analysis to NPIxray",
    metaTitle:
      "Switch from Manual Billing Analysis to NPIxray — Automated Revenue Intelligence",
    metaDescription:
      "Stop reviewing EOBs and claims reports manually. NPIxray automates Medicare billing analysis with real CMS data, AI insights, and peer benchmarking. Free NPI scan available.",
    source: "Manual Billing Analysis",
    heroSubtitle:
      "If your billing analysis consists of reviewing EOBs, eyeballing claims reports, or relying on your billing company's monthly summary, you are likely missing significant revenue opportunities that automated analytics would catch.",
    painPoints: [
      {
        title: "Reactive instead of proactive",
        description:
          "Manual billing review is inherently backward-looking. You see what was billed and paid — but you cannot see what should have been billed. Missed revenue from undercoding and unenrolled care management programs goes undetected.",
      },
      {
        title: "No peer benchmarking capability",
        description:
          "Without automated benchmarking, you have no way to know if your coding distribution, care management adoption, or revenue per patient is in line with specialty peers. You could be significantly underperforming without knowing it.",
      },
      {
        title: "Billing company reports are limited",
        description:
          "Billing companies report on what they process — collections, denials, and payment rates. They do not analyze whether you are billing for everything you should be. Their incentive is processing claims, not optimizing your coding.",
      },
      {
        title: "Care management programs fall through the cracks",
        description:
          "CCM, RPM, BHI, and AWV programs require proactive patient identification and enrollment. Manual billing analysis rarely covers these programs because the revenue is not in your current claims — it is in the claims you are not generating.",
      },
    ],
    steps: [
      {
        title: "Run your free NPIxray scan",
        description:
          "Enter your NPI number to see a complete Medicare billing analysis in 30 seconds. Compare your E&M coding distribution, care management adoption rates, and revenue per patient against specialty peers.",
        duration: "30 seconds",
      },
      {
        title: "Identify your biggest revenue gaps",
        description:
          "Review the specific opportunities NPIxray identifies. Most practices find their largest gaps in E&M coding optimization (99213 vs 99214 distribution) and care management program enrollment (CCM, RPM, AWV).",
        duration: "15 minutes",
      },
      {
        title: "Share results with your billing team",
        description:
          "Use NPIxray's reports to start a data-driven conversation with your billing staff or billing company. The peer benchmarks provide objective evidence for coding pattern changes and program implementation.",
        duration: "30 minutes",
      },
      {
        title: "Set up ongoing automated monitoring",
        description:
          "Create your NPIxray account for continuous analytics. Instead of manual quarterly reviews, get automated insights and alerts whenever new revenue opportunities are identified.",
        duration: "5 minutes",
      },
      {
        title: "Track your improvement over time",
        description:
          "As you implement changes based on NPIxray's recommendations, track your coding distribution and care management adoption moving toward benchmark levels. NPIxray shows your progress over time.",
        duration: "Ongoing",
      },
    ],
    benefits: [
      {
        icon: "trending",
        title: "Proactive opportunity identification",
        description:
          "See what you should be billing — not just what you already billed. NPIxray identifies revenue you are currently missing.",
      },
      {
        icon: "users",
        title: "Objective peer benchmarking",
        description:
          "Compare against 1.2M+ providers. No more guessing whether your billing patterns are optimal.",
      },
      {
        icon: "sparkles",
        title: "AI-powered prioritization",
        description:
          "NPIxray ranks opportunities by dollar impact so you focus on the changes that matter most.",
      },
      {
        icon: "chart",
        title: "Complete program analysis",
        description:
          "Coverage of E&M coding, CCM, RPM, BHI, AWV, and more — the programs manual analysis typically misses.",
      },
      {
        icon: "clock",
        title: "Automated monitoring",
        description:
          "Replace quarterly manual reviews with continuous automated analytics and real-time alerts.",
      },
      {
        icon: "dollar",
        title: "Quantified dollar impact",
        description:
          "Every gap comes with a specific revenue number. No more wondering if a change is worth pursuing.",
      },
    ],
    concerns: [
      {
        question: "Will NPIxray replace my billing company?",
        answer:
          "No. NPIxray complements your billing company by providing the analytics layer they do not. Your billing company processes claims; NPIxray identifies whether you are generating all the claims you should be. Use NPIxray's data to hold your billing company accountable.",
      },
      {
        question: "How accurate is the revenue gap analysis?",
        answer:
          "NPIxray uses official CMS Medicare data covering 1.2M+ providers. Revenue gap estimates are based on the difference between your actual billing patterns and your specialty peer benchmarks, using real Medicare reimbursement rates. The data is as accurate as the CMS source.",
      },
      {
        question: "What if my practice is already well-optimized?",
        answer:
          "Run the free scan and find out. If your coding distribution and care management adoption match or exceed your specialty benchmarks, NPIxray will confirm that. Most practices discover at least one significant opportunity they were not aware of.",
      },
      {
        question: "I do not understand Medicare data — will I understand NPIxray?",
        answer:
          "NPIxray translates complex Medicare data into simple, actionable insights. You do not need to understand CMS datasets or coding statistics. The platform tells you specifically what to do, why, and how much revenue is at stake in plain language.",
      },
    ],
    metrics: [
      {
        label: "Avg Revenue Gap Found",
        value: "$40K-$100K+/yr",
        note: "Across all programs for typical practice",
      },
      {
        label: "Setup Time",
        value: "30 seconds",
        note: "Free scan, no account required",
      },
      {
        label: "E&M Undercoding Found",
        value: "30-50%",
        note: "Of visits coded below documentation support",
      },
      {
        label: "Care Management Gaps",
        value: "85%+",
        note: "Of eligible patients not enrolled nationally",
      },
    ],
  },

  "from-consultant": {
    title: "Why NPIxray Replaces Your Revenue Consultant",
    metaTitle:
      "Replace Your Revenue Consultant with NPIxray — Better Data, Lower Cost",
    metaDescription:
      "NPIxray provides the Medicare billing analysis your revenue consultant charges $10K+ for — using real CMS data, AI insights, and continuous monitoring. Free NPI scan available.",
    source: "Revenue Consultant",
    heroSubtitle:
      "Revenue consultants charge $5,000-$25,000 for analysis that NPIxray delivers instantly using real CMS data. Get deeper insights, continuous monitoring, and quantified revenue gaps — starting with a free scan.",
    painPoints: [
      {
        title: "Expensive one-time assessments",
        description:
          "Revenue consultants typically charge $5,000-$25,000 for a billing analysis that takes weeks to complete. The insights are valuable but the price tag is prohibitive for many practices — especially small and mid-size groups.",
      },
      {
        title: "Snapshots instead of continuous monitoring",
        description:
          "A consultant delivers a report and moves on. Your billing patterns evolve monthly, but you do not get another analysis until you pay for another engagement. Revenue gaps can develop between assessments without detection.",
      },
      {
        title: "Subjective methodology varies by consultant",
        description:
          "Each consultant has their own approach and benchmarks. Two consultants analyzing the same practice may deliver different recommendations. There is no standardized, data-driven methodology that ensures consistent and accurate analysis.",
      },
      {
        title: "Limited benchmarking data",
        description:
          "Most consultants benchmark against a small set of practices they have worked with previously. This is a fraction of the CMS dataset that covers 1.2M+ providers — meaning their benchmarks may not accurately represent your specialty and geography.",
      },
    ],
    steps: [
      {
        title: "Run a free NPIxray scan",
        description:
          "Enter any NPI number and see a complete Medicare billing analysis in 30 seconds — the same type of analysis that takes a consultant weeks and costs thousands. Compare the depth and specificity of the results.",
        duration: "30 seconds",
      },
      {
        title: "Compare against your consultant's report",
        description:
          "If you have a recent consultant report, compare it line-by-line against NPIxray's analysis. Note the coding distribution data, care management gaps, peer benchmarks, and revenue calculations. Most users find NPIxray's analysis is more comprehensive.",
        duration: "30 minutes",
      },
      {
        title: "Subscribe for continuous monitoring",
        description:
          "For the cost of one hour of consultant time, get a full year of NPIxray analytics. Set up ongoing monitoring with automated alerts so you never have a blind spot between consultant engagements again.",
        duration: "5 minutes",
      },
    ],
    benefits: [
      {
        icon: "dollar",
        title: "95% cost reduction",
        description:
          "NPIxray's annual cost is less than a single consultant engagement. Get continuous analytics for the price of one assessment.",
      },
      {
        icon: "clock",
        title: "Instant results vs. weeks of waiting",
        description:
          "See your complete revenue analysis in 30 seconds. No scheduling, no waiting for deliverables, no follow-up meetings.",
      },
      {
        icon: "chart",
        title: "Objective, standardized methodology",
        description:
          "Every analysis uses the same CMS data and benchmarking algorithms. No variability based on which consultant you hire.",
      },
      {
        icon: "users",
        title: "1.2M+ provider benchmark database",
        description:
          "Benchmark against the full CMS Medicare dataset — not a consultant's limited portfolio of past clients.",
      },
      {
        icon: "trending",
        title: "Continuous monitoring, not snapshots",
        description:
          "Ongoing analytics with automated alerts mean you catch new revenue opportunities as they emerge, not months later.",
      },
      {
        icon: "sparkles",
        title: "AI analysis improves over time",
        description:
          "NPIxray's AI gets smarter as CMS releases new data. Your consultant's methodology stays fixed between engagements.",
      },
    ],
    concerns: [
      {
        question: "Can software really replace a human consultant?",
        answer:
          "For Medicare billing analysis, yes. NPIxray processes the same CMS data a consultant would use, but benchmarks against 1.2M+ providers (vs. a consultant's handful of clients) and applies consistent AI analysis. Human consultants add value for implementation coaching and change management — but for the analytical work, NPIxray is faster, cheaper, and more comprehensive.",
      },
      {
        question: "What about the implementation guidance consultants provide?",
        answer:
          "NPIxray's AI-powered recommendations include specific, prioritized action items. For practices that want additional implementation support, NPIxray's analytics provide the data foundation that makes any consultant engagement shorter and more focused — saving money on consulting hours.",
      },
      {
        question: "How current is NPIxray's data compared to a consultant's?",
        answer:
          "NPIxray uses the latest available CMS Medicare data, which is the same source most consultants reference. Because NPIxray processes data automatically, updates are immediate when CMS releases new datasets — faster than a consultant can manually refresh their analysis.",
      },
      {
        question: "What if I need a consultant for something NPIxray cannot do?",
        answer:
          "Some practices benefit from consultants for workflow redesign, staff training, or complex compliance issues. NPIxray's analytics make those engagements more efficient by providing the data foundation upfront. You spend consultant hours on execution, not analysis.",
      },
    ],
    metrics: [
      {
        label: "Cost Savings",
        value: "$4,000-$24,000",
        note: "Per engagement vs. annual NPIxray subscription",
      },
      {
        label: "Speed of Analysis",
        value: "30 sec vs. 4-6 weeks",
        note: "NPIxray instant scan vs. consultant timeline",
      },
      {
        label: "Benchmark Database",
        value: "1.2M+ vs. ~50-200",
        note: "NPIxray CMS data vs. typical consultant portfolio",
      },
      {
        label: "Monitoring Frequency",
        value: "Continuous",
        note: "vs. annual or semi-annual consultant visits",
      },
    ],
  },
};

// ────────────────────────────────────────────────────────────
// Metadata
// ────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = SWITCH_PAGES[slug];
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: "article",
    },
  };
}

export function generateStaticParams() {
  return Object.keys(SWITCH_PAGES).map((slug) => ({ slug }));
}

// ────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────

export default async function SwitchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = SWITCH_PAGES[slug];
  if (!page) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Switch from ${page.source} to NPIxray`,
    description: page.metaDescription,
    url: `https://npixray.com/switch/${slug}`,
    step: page.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs
            items={[
              { label: "Switch", href: "/switch" },
              { label: `From ${page.source}` },
            ]}
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 mb-6">
            <RefreshCw className="h-3.5 w-3.5 text-gold" />
            <span className="text-xs font-medium text-gold">
              Migration Guide
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-4">
            Switch from{" "}
            <span className="text-[var(--text-secondary)]">
              {page.source}
            </span>{" "}
            to <span className="text-gold">NPIxray</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            {page.heroSubtitle}
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-dark font-semibold hover:bg-gold-300 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Run Free Scan Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Switch */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-2">
            Why Switch from{" "}
            <span className="text-gold">{page.source}</span>?
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8">
            Common pain points that drive practices to seek a better solution.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {page.painPoints.map((point, i) => (
              <div
                key={i}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-6"
              >
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <h3 className="font-semibold text-sm">{point.title}</h3>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-2">
            How to <span className="text-gold">Switch</span> — Step by Step
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8">
            A simple migration path that takes minutes, not weeks.
          </p>
          <div className="space-y-4">
            {page.steps.map((step, i) => (
              <div
                key={i}
                className="flex gap-4 sm:gap-6 rounded-xl border border-dark-50/80 bg-dark-400/50 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 text-gold font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                    <h3 className="font-semibold">{step.title}</h3>
                    <span className="inline-flex items-center gap-1 text-xs text-gold">
                      <Clock className="h-3 w-3" />
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Gain */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-2">
            What You <span className="text-gold">Gain</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8">
            The benefits of switching to data-driven revenue intelligence.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {page.benefits.map((benefit, i) => (
              <div
                key={i}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 border border-gold/20 mb-3">
                  <BenefitIcon icon={benefit.icon} />
                </div>
                <h3 className="font-semibold text-sm mb-1.5">
                  {benefit.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-8">
            What to <span className="text-gold">Expect</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {page.metrics.map((metric, i) => (
              <div
                key={i}
                className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 text-center"
              >
                <p className="text-2xl sm:text-3xl font-bold font-mono text-gold mb-1">
                  {metric.value}
                </p>
                <p className="text-xs font-semibold mb-1">{metric.label}</p>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  {metric.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Concerns FAQ */}
      <section className="border-t border-dark-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold mb-2">
            Common <span className="text-gold">Concerns</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-8">
            Answers to the questions practices ask most when considering the switch.
          </p>
          <div className="space-y-4">
            {page.concerns.map((concern, i) => (
              <details
                key={i}
                className="group rounded-xl border border-dark-50/80 bg-dark-400/50 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer hover:bg-dark-300/50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                  <span className="font-semibold text-sm">
                    {concern.question}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[var(--text-secondary)] flex-shrink-0 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {concern.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
