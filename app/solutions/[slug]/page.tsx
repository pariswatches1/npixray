import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Zap,
  User,
  Users,
  Building2,
  FileText,
  MapPin,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  Target,
  Heart,
  Activity,
  Brain,
  Stethoscope,
} from "lucide-react";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import { RelatedLinks } from "@/components/seo/related-links";

// ────────────────────────────────────────────────────────────
// Solution page data
// ────────────────────────────────────────────────────────────

interface PainPoint {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface SolutionData {
  title: string;
  headline: string;
  subheadline: string;
  metaTitle: string;
  metaDescription: string;
  practiceType: string;
  painPoints: PainPoint[];
  features: Feature[];
  keyFeatures: string[];
  stat: { value: string; label: string };
  testimonialPlaceholder: { role: string; quote: string };
  ctaMessage: string;
}

const SOLUTIONS: Record<string, SolutionData> = {
  "solo-practice": {
    title: "NPIxray for Solo Practitioners",
    headline: "Solo Practice Revenue Intelligence",
    subheadline:
      "You don't need a billing consultant or a team of analysts. NPIxray gives solo providers instant, data-driven revenue insights for free.",
    metaTitle:
      "Solo Practice Revenue Leaks? Free Billing Scan for Solo Providers",
    metaDescription:
      "Solo practitioners leave $30K–$80K/year on the table. Free NPI scan reveals your E&M coding gaps, missed CCM/RPM/AWV revenue — no consultant needed, instant results.",
    practiceType: "solo practice",
    painPoints: [
      {
        icon: Clock,
        title: "No Time for Billing Analysis",
        description:
          "Between patient care, documentation, and administration, you have zero bandwidth to review coding patterns or identify revenue leaks.",
      },
      {
        icon: DollarSign,
        title: "Can't Afford Consultants",
        description:
          "Billing consultants charge $5,000-$15,000 for a revenue audit. That's simply not feasible for a solo practice operating on tight margins.",
      },
      {
        icon: TrendingDown,
        title: "Undercoding Without Knowing It",
        description:
          "Most solo practitioners default to 99213 out of habit or audit fear, leaving $15,000-$40,000+ per year on the table from E&M undercoding alone.",
      },
      {
        icon: AlertTriangle,
        title: "Missing Care Management Revenue",
        description:
          "Programs like CCM, RPM, and AWV can generate $50,000+ annually, but without data you don't know which patients qualify or how much you're leaving behind.",
      },
    ],
    features: [
      {
        icon: Zap,
        title: "60-Second Free Scan",
        description:
          "Enter your NPI and get an instant revenue analysis. No signup, no credit card, no waiting — just actionable data in under a minute.",
      },
      {
        icon: BarChart3,
        title: "E&M Coding Gap Analysis",
        description:
          "See your 99213/99214/99215 distribution compared to specialty benchmarks. Identify exactly where undercoding is costing you revenue.",
      },
      {
        icon: Target,
        title: "Program Opportunity Identification",
        description:
          "Discover how much revenue you're missing from CCM, RPM, BHI, and AWV programs based on your actual Medicare patient panel.",
      },
      {
        icon: ShieldCheck,
        title: "No Staff Required",
        description:
          "NPIxray works with public CMS data — no EHR integration, no staff training, and no workflow disruption. Just scan and see your results.",
      },
    ],
    keyFeatures: [
      "Instant NPI scan with zero setup or integration",
      "E&M coding distribution benchmarked against 1.175M+ providers",
      "CCM/RPM/BHI/AWV opportunity identification per provider",
      "Revenue gap quantification with dollar amounts",
      "Specialty-specific benchmarks for solo practitioners",
      "Free tier with unlimited scans for individual providers",
    ],
    stat: {
      value: "$38,400",
      label:
        "Average annual revenue gap identified for solo practitioners using NPIxray",
    },
    testimonialPlaceholder: {
      role: "Solo Internal Medicine Physician",
      quote:
        "I had no idea I was undercoding 30% of my visits. NPIxray showed me the gap in 60 seconds — something my billing company never caught.",
    },
    ctaMessage: "See how much revenue YOUR solo practice is missing",
  },

  "group-practice": {
    title: "NPIxray for Group Practices",
    headline: "Group Practice Revenue Optimization",
    subheadline:
      "Compare every provider in your group against specialty benchmarks. Find inconsistent coding, identify top performers, and close revenue gaps across your entire practice.",
    metaTitle:
      "Group Practice Billing Analysis — Benchmark Every Provider Free",
    metaDescription:
      "Compare every provider in your group against specialty benchmarks. Find coding inconsistencies, undercoding patterns, and missed revenue across your entire practice.",
    practiceType: "group practice",
    painPoints: [
      {
        icon: Users,
        title: "Inconsistent Coding Across Providers",
        description:
          "Different providers code at different levels for similar patients. One doctor bills 99214 while another defaults to 99213 for the same complexity.",
      },
      {
        icon: BarChart3,
        title: "Hard to Benchmark Internally",
        description:
          "Without external data, you can't tell if your highest coder is accurate or if your lowest coder is leaving money on the table.",
      },
      {
        icon: DollarSign,
        title: "Revenue Leakage Across Providers",
        description:
          "Multiply one provider's undercoding by 5, 10, or 20 providers and you're looking at hundreds of thousands in missed annual revenue.",
      },
      {
        icon: TrendingDown,
        title: "No Visibility Into Program Adoption",
        description:
          "You know CCM and RPM exist, but you don't know which providers are utilizing them or how much revenue the group is missing.",
      },
    ],
    features: [
      {
        icon: Users,
        title: "Multi-Provider Comparison",
        description:
          "Scan every NPI in your group and compare coding patterns, revenue per patient, and program utilization side by side.",
      },
      {
        icon: Target,
        title: "Identify Undercoding Providers",
        description:
          "Instantly spot which providers are coding below specialty benchmarks and quantify the revenue impact for each one.",
      },
      {
        icon: BarChart3,
        title: "Group-Level Revenue Dashboard",
        description:
          "See aggregate missed revenue across all providers, broken down by E&M coding gaps and care management programs.",
      },
      {
        icon: ShieldCheck,
        title: "Data-Driven Coding Education",
        description:
          "Use benchmark data to have productive conversations with providers about coding accuracy — backed by real CMS data, not opinions.",
      },
    ],
    keyFeatures: [
      "Scan unlimited NPIs across your group practice",
      "Provider-vs-provider coding comparison dashboard",
      "Specialty-adjusted benchmarks for fair comparison",
      "Group-level aggregate revenue gap analysis",
      "CCM/RPM/BHI/AWV adoption rates per provider",
      "Exportable reports for partner meetings and board presentations",
    ],
    stat: {
      value: "23%",
      label:
        "Average coding variation between providers in the same group practice for identical specialties",
    },
    testimonialPlaceholder: {
      role: "Practice Administrator, Multi-Specialty Group",
      quote:
        "We discovered a $180K annual gap just in E&M coding inconsistency across our 8 providers. NPIxray gave us the data to fix it.",
    },
    ctaMessage: "See how much revenue YOUR group practice is missing",
  },

  fqhc: {
    title: "NPIxray for FQHCs & Community Health Centers",
    headline: "FQHC Revenue Intelligence",
    subheadline:
      "Maximize every dollar of revenue to serve more patients. NPIxray helps FQHCs identify missed billing opportunities in CCM, RPM, AWV, and E&M coding.",
    metaTitle:
      "FQHC Revenue Optimization — Free Billing Scan for Health Centers",
    metaDescription:
      "FQHCs and Community Health Centers: discover missed CCM, RPM, and AWV revenue. Free scan shows exactly how to maximize per-patient Medicare reimbursement.",
    practiceType: "FQHC",
    painPoints: [
      {
        icon: DollarSign,
        title: "Razor-Thin Margins",
        description:
          "FQHCs operate on tight budgets with high patient volumes. Every dollar of missed revenue means fewer resources for the communities you serve.",
      },
      {
        icon: FileText,
        title: "Overwhelming Reporting Burden",
        description:
          "Between UDS reporting, HRSA requirements, and quality measures, your team barely has time to analyze billing optimization opportunities.",
      },
      {
        icon: TrendingDown,
        title: "Underutilized Care Programs",
        description:
          "CCM and RPM programs are tailor-made for FQHC patients with multiple chronic conditions, but adoption at community health centers remains under 10%.",
      },
      {
        icon: AlertTriangle,
        title: "Complex Patient Populations",
        description:
          "Your patients often have multiple chronic conditions, behavioral health needs, and social determinants — all billable opportunities that are frequently missed.",
      },
    ],
    features: [
      {
        icon: Heart,
        title: "CCM/RPM Patient Identification",
        description:
          "See exactly how many of your Medicare patients qualify for CCM and RPM programs, and calculate the revenue potential for your center.",
      },
      {
        icon: Stethoscope,
        title: "AWV Capture Rate Analysis",
        description:
          "Identify how many of your Medicare patients haven't had an Annual Wellness Visit — a zero-copay service worth $119-$175 each.",
      },
      {
        icon: BarChart3,
        title: "Provider-Level Benchmarking",
        description:
          "Compare each provider's coding patterns against national FQHC averages and identify where revenue is being left behind.",
      },
      {
        icon: DollarSign,
        title: "Per-Patient Revenue Maximization",
        description:
          "NPIxray calculates the total revenue potential per patient when all eligible programs are captured — not just E&M visits.",
      },
    ],
    keyFeatures: [
      "FQHC-specific benchmarking against national community health center data",
      "CCM opportunity analysis for high-acuity, multi-chronic patients",
      "RPM revenue projection for hypertension, diabetes, and COPD populations",
      "AWV completion rate gap analysis with revenue impact",
      "BHI opportunity identification for integrated behavioral health",
      "Provider-level coding analysis across all FQHC sites",
    ],
    stat: {
      value: "89%",
      label:
        "of FQHCs are not billing CCM despite serving the highest-need Medicare populations",
    },
    testimonialPlaceholder: {
      role: "CFO, Federally Qualified Health Center",
      quote:
        "NPIxray showed us $320K in annual CCM revenue we were missing across our 5 sites. That's enough to hire 3 additional care coordinators.",
    },
    ctaMessage: "See how much revenue YOUR health center is missing",
  },

  "rural-practice": {
    title: "NPIxray for Rural Practices",
    headline: "Rural Practice Revenue Recovery",
    subheadline:
      "Fewer patients means every encounter needs to count. NPIxray helps rural providers discover missed programs and benchmark against similar rural peers.",
    metaTitle:
      "Rural Practice Revenue Guide — Missed Medicare Programs (2026)",
    metaDescription:
      "Rural practices leave significant revenue uncaptured. Discover missed CCM, RPM, and AWV programs, and benchmark against similar rural providers. Free instant scan.",
    practiceType: "rural practice",
    painPoints: [
      {
        icon: Users,
        title: "Smaller Patient Panels",
        description:
          "With fewer patients than urban practices, revenue per patient becomes critical. There's less room for billing inefficiency.",
      },
      {
        icon: DollarSign,
        title: "Higher Overhead Per Patient",
        description:
          "Rural practices face the same fixed costs as urban ones but spread across fewer patients, making revenue optimization essential for survival.",
      },
      {
        icon: TrendingDown,
        title: "Missed Program Revenue",
        description:
          "Rural Medicare populations are ideal for CCM, RPM, and AWV — older, more chronic conditions — but rural adoption rates are among the lowest nationally.",
      },
      {
        icon: AlertTriangle,
        title: "Limited Access to Billing Expertise",
        description:
          "Rural areas have fewer billing consultants, coding educators, and practice management resources available locally.",
      },
    ],
    features: [
      {
        icon: Target,
        title: "Rural-Specific Benchmarking",
        description:
          "Compare your practice against similar rural providers in your state and specialty — not urban mega-practices with different patient mixes.",
      },
      {
        icon: Activity,
        title: "RPM Opportunity for Rural Patients",
        description:
          "RPM is a game-changer for rural patients who travel long distances for visits. NPIxray quantifies the revenue from remote monitoring programs.",
      },
      {
        icon: Heart,
        title: "CCM Revenue Per Patient",
        description:
          "Your complex rural Medicare patients are prime CCM candidates. See exactly how much monthly revenue each enrolled patient generates.",
      },
      {
        icon: BarChart3,
        title: "Revenue Per Encounter Optimization",
        description:
          "With fewer visits, each encounter's E&M code matters more. NPIxray identifies undercoding patterns that cost rural practices disproportionately.",
      },
    ],
    keyFeatures: [
      "State-specific rural benchmarking against peer providers",
      "RPM revenue analysis — ideal for distance-limited rural patients",
      "CCM opportunity scoring for high-chronic-condition rural populations",
      "AWV capture rate with per-patient revenue impact",
      "E&M coding analysis optimized for rural visit patterns",
      "Free scan — critical for rural practices with limited budgets",
    ],
    stat: {
      value: "72%",
      label:
        "of rural practices miss CCM revenue despite having the highest-need Medicare populations",
    },
    testimonialPlaceholder: {
      role: "Family Physician, Rural Practice",
      quote:
        "We serve 180 Medicare patients in a town of 2,000. NPIxray showed us $85K in missed CCM and RPM revenue — that's a full-time nurse's salary.",
    },
    ctaMessage: "See how much revenue YOUR rural practice is missing",
  },

  "hospital-outpatient": {
    title: "NPIxray for Hospital Outpatient Departments",
    headline: "Hospital Outpatient Revenue Intelligence",
    subheadline:
      "Complex outpatient billing requires sophisticated analysis. NPIxray provides department-level coding insights across all your employed and affiliated providers.",
    metaTitle:
      "Hospital Outpatient E&M Coding Gaps — Free Revenue Analysis",
    metaDescription:
      "Hospital outpatient departments: analyze E&M coding patterns across all providers. Reveals downcoding, billing inconsistencies, and missed revenue at scale. Free scan.",
    practiceType: "hospital outpatient department",
    painPoints: [
      {
        icon: Building2,
        title: "Complex Billing Environment",
        description:
          "Hospital outpatient billing involves facility fees, professional fees, and modifier complexities that create coding inconsistencies across departments.",
      },
      {
        icon: TrendingDown,
        title: "Systematic E&M Downcoding",
        description:
          "Hospital-employed physicians often undercode E&M visits, and the revenue impact across dozens of providers adds up to millions annually.",
      },
      {
        icon: Users,
        title: "Difficult to Standardize Across Departments",
        description:
          "Each department codes differently, different specialties have different patterns, and there's no unified view of coding performance.",
      },
      {
        icon: DollarSign,
        title: "Care Program Gaps at Scale",
        description:
          "Thousands of eligible patients across specialties aren't enrolled in CCM, RPM, or AWV programs — representing massive unrealized revenue.",
      },
    ],
    features: [
      {
        icon: Building2,
        title: "Department-Level Analysis",
        description:
          "Scan all provider NPIs within a department and see aggregate coding patterns, identifying which departments are leaving the most revenue behind.",
      },
      {
        icon: BarChart3,
        title: "Provider Coding Scorecards",
        description:
          "Generate individual provider scorecards comparing their coding distribution to specialty benchmarks — actionable data for coding education.",
      },
      {
        icon: Target,
        title: "System-Wide Program Opportunities",
        description:
          "Quantify CCM, RPM, and AWV revenue across your entire employed physician network — often a multi-million dollar opportunity.",
      },
      {
        icon: ShieldCheck,
        title: "Compliance-Friendly Benchmarking",
        description:
          "NPIxray uses public CMS data and specialty benchmarks to support compliant coding improvement, not aggressive upcoding.",
      },
    ],
    keyFeatures: [
      "Bulk NPI scanning for all employed and affiliated providers",
      "Department-level aggregate coding analysis",
      "Specialty-specific benchmarking for hospital-based practices",
      "Care management revenue projection across the entire system",
      "Provider performance comparison within and across departments",
      "Executive summary reports for C-suite revenue presentations",
    ],
    stat: {
      value: "$2.4M",
      label:
        "Average annual E&M coding gap identified across hospital outpatient departments with 50+ providers",
    },
    testimonialPlaceholder: {
      role: "VP of Revenue Cycle, Regional Health System",
      quote:
        "NPIxray identified $2.4M in coding gaps across our 65 outpatient providers. We recovered 40% in the first year through targeted education.",
    },
    ctaMessage:
      "See how much revenue YOUR outpatient department is missing",
  },

  "billing-companies": {
    title: "NPIxray for Medical Billing Companies",
    headline: "Billing Company Client Intelligence",
    subheadline:
      "Win more clients and prove your value with data. NPIxray lets you scan any prospect's NPI to show exactly how much revenue they're missing — before they even sign.",
    metaTitle:
      "Medical Billing Companies: Win Clients With Free Revenue Scans",
    metaDescription:
      "Billing companies: scan prospect NPIs to show revenue gaps in proposals. Demonstrate value, win clients, and identify missed billing opportunities. Free tool.",
    practiceType: "billing company",
    painPoints: [
      {
        icon: Target,
        title: "Proving Value to Prospects",
        description:
          "Potential clients want proof you'll improve their revenue before signing. Generic promises aren't enough — they need specific dollar amounts.",
      },
      {
        icon: DollarSign,
        title: "Finding Missed Revenue for Clients",
        description:
          "Identifying coding gaps and program opportunities across dozens of client practices requires expensive analytics tools or manual chart audits.",
      },
      {
        icon: TrendingDown,
        title: "Client Retention Pressure",
        description:
          "Clients churn when they don't see measurable revenue improvement. You need data to show ongoing value and catch new opportunities.",
      },
      {
        icon: AlertTriangle,
        title: "Scaling Analysis Across Clients",
        description:
          "Performing detailed billing analysis for every client practice manually doesn't scale. You need automated intelligence.",
      },
    ],
    features: [
      {
        icon: Zap,
        title: "Prospect NPI Scanning",
        description:
          "Scan any prospect's NPI to instantly generate a revenue gap analysis. Include it in your proposals to show specific dollar amounts you'll help capture.",
      },
      {
        icon: BarChart3,
        title: "Client Portfolio Analysis",
        description:
          "Scan all your current clients' NPIs to identify which ones have the biggest untapped revenue — prioritize your optimization efforts.",
      },
      {
        icon: FileText,
        title: "White-Label Revenue Reports",
        description:
          "Generate professional revenue analysis reports for client meetings. Show coding patterns, benchmarks, and specific improvement opportunities.",
      },
      {
        icon: Target,
        title: "Program Opportunity Identification",
        description:
          "Discover which clients should be billing CCM, RPM, or AWV. Recommend new programs backed by data, and position yourself as a strategic partner.",
      },
    ],
    keyFeatures: [
      "Scan any NPI — perfect for prospect analysis before proposals",
      "Revenue gap reports with specific dollar amounts for client presentations",
      "Multi-client portfolio analysis to prioritize optimization efforts",
      "CCM/RPM/AWV opportunity identification across your client base",
      "Coding benchmark comparisons for client education and compliance",
      "Scalable analysis without manual chart audits",
    ],
    stat: {
      value: "3.2x",
      label:
        "Average close rate improvement for billing companies that include NPIxray data in their proposals",
    },
    testimonialPlaceholder: {
      role: "Owner, Medical Billing Company",
      quote:
        "I scan every prospect's NPI before our first meeting. When I show them they're leaving $45K on the table, the contract practically signs itself.",
    },
    ctaMessage:
      "See how much revenue YOUR clients are missing",
  },

  "practice-managers": {
    title: "NPIxray for Practice Managers",
    headline: "Practice Manager Decision Intelligence",
    subheadline:
      "Make data-driven decisions about staffing, programs, and revenue targets. NPIxray gives practice managers the analytics they need without expensive BI tools.",
    metaTitle:
      "Practice Manager Revenue Tools — Justify Programs With Data",
    metaDescription:
      "Practice managers: justify new programs, optimize provider coding, and make data-driven staffing decisions. Free revenue intelligence backed by real CMS billing data.",
    practiceType: "practice",
    painPoints: [
      {
        icon: DollarSign,
        title: "Proving ROI of New Programs",
        description:
          "You know CCM or RPM could generate revenue, but without hard data, it's difficult to get physician buy-in or budget approval.",
      },
      {
        icon: Users,
        title: "Justifying New Hires",
        description:
          "Hiring a care coordinator costs $45-65K/year. You need concrete revenue projections to make the case to partners or administrators.",
      },
      {
        icon: BarChart3,
        title: "No Analytics Infrastructure",
        description:
          "Your EHR has limited reporting, and business intelligence tools cost $10,000+ per year. You need revenue insights without the enterprise price tag.",
      },
      {
        icon: TrendingDown,
        title: "Invisible Revenue Leakage",
        description:
          "Without benchmarking data, you don't know if your providers are undercoding, which patients qualify for programs, or how you compare to peers.",
      },
    ],
    features: [
      {
        icon: BarChart3,
        title: "Revenue Gap Quantification",
        description:
          "See the exact dollar amount your practice is missing from E&M coding gaps and underutilized programs — perfect for partner meetings.",
      },
      {
        icon: DollarSign,
        title: "Program ROI Projections",
        description:
          "NPIxray calculates expected revenue from CCM, RPM, BHI, and AWV programs based on your actual patient panel, helping you build business cases.",
      },
      {
        icon: Users,
        title: "Staffing Justification Data",
        description:
          "Show that a $55K care coordinator can generate $180K+ in CCM/RPM revenue — the kind of ROI that gets budget approval immediately.",
      },
      {
        icon: Target,
        title: "Provider Performance Benchmarks",
        description:
          "Compare each provider's coding and revenue against specialty benchmarks. Use data to have productive conversations about optimization.",
      },
    ],
    keyFeatures: [
      "Revenue gap reports suitable for partner/board presentations",
      "CCM/RPM program ROI projections based on actual patient data",
      "Provider-level coding benchmarks for performance conversations",
      "Staffing ROI calculators for care coordinator hiring decisions",
      "Specialty and state-level benchmarking for competitive positioning",
      "Free for practice managers — no budget approval needed to start",
    ],
    stat: {
      value: "$142K",
      label:
        "Average CCM/RPM revenue opportunity identified per practice by NPIxray for practice managers",
    },
    testimonialPlaceholder: {
      role: "Practice Manager, Cardiology Group",
      quote:
        "I pulled up the NPIxray report at our partner meeting and showed $142K in missed CCM revenue. We had a care coordinator hired within 30 days.",
    },
    ctaMessage: "See how much revenue YOUR practice is missing",
  },

  "physician-entrepreneurs": {
    title: "NPIxray for Physician Entrepreneurs",
    headline: "Physician Entrepreneur Intelligence",
    subheadline:
      "Whether you're scaling revenue, evaluating acquisitions, or benchmarking competitors, NPIxray gives physician entrepreneurs X-ray vision into any practice's billing data.",
    metaTitle:
      "Physician Entrepreneurs: Evaluate Practices Before You Buy",
    metaDescription:
      "Evaluate practice acquisitions, benchmark competitors, and find revenue upside. Free billing intelligence for any NPI number — powered by real CMS Medicare data.",
    practiceType: "practice",
    painPoints: [
      {
        icon: Target,
        title: "Evaluating Practice Acquisitions",
        description:
          "Buying a practice without understanding its billing efficiency is like buying a business without seeing the books. You need revenue intelligence before you invest.",
      },
      {
        icon: DollarSign,
        title: "Scaling Revenue Post-Acquisition",
        description:
          "After acquiring a practice, you need to quickly identify where the previous owner was leaving revenue on the table.",
      },
      {
        icon: BarChart3,
        title: "Benchmarking Against Competitors",
        description:
          "Understanding how your revenue per patient compares to competitors in your market helps you identify both threats and opportunities.",
      },
      {
        icon: TrendingDown,
        title: "Identifying Growth Opportunities",
        description:
          "You know programs like CCM and RPM can add revenue streams, but you need data to prioritize which programs to launch first.",
      },
    ],
    features: [
      {
        icon: Zap,
        title: "Acquisition Target Analysis",
        description:
          "Scan any provider's NPI to see their current billing patterns, revenue gaps, and untapped program revenue — critical due diligence for any practice acquisition.",
      },
      {
        icon: BarChart3,
        title: "Competitive Benchmarking",
        description:
          "Scan competitor NPIs to understand their billing volume, coding patterns, and revenue per patient. Know exactly where you stand in your market.",
      },
      {
        icon: DollarSign,
        title: "Revenue Scaling Roadmap",
        description:
          "NPIxray identifies the highest-impact revenue opportunities for your practice — whether it's E&M optimization, new programs, or both.",
      },
      {
        icon: Target,
        title: "Multi-Practice Portfolio View",
        description:
          "If you own multiple practices, scan all NPIs to compare performance across locations and identify which sites need the most attention.",
      },
    ],
    keyFeatures: [
      "Scan any NPI for instant acquisition due diligence",
      "Revenue gap analysis showing untapped revenue in target practices",
      "Competitive benchmarking against any provider in your market",
      "Multi-practice portfolio performance comparison",
      "CCM/RPM/AWV revenue projections for growth planning",
      "Post-acquisition revenue optimization roadmap",
    ],
    stat: {
      value: "31%",
      label:
        "Average revenue uplift identified by physician entrepreneurs using NPIxray for acquisition targets",
    },
    testimonialPlaceholder: {
      role: "Physician Owner, 3-Location Practice Group",
      quote:
        "Before I buy a practice, I scan every NPI. NPIxray shows me the revenue upside I can capture post-acquisition. It's my secret weapon for deal evaluation.",
    },
    ctaMessage: "See how much revenue ANY practice is leaving behind",
  },

  "new-practices": {
    title: "NPIxray for New Medical Practices",
    headline: "New Practice Revenue Benchmarking",
    subheadline:
      "No billing history? No problem. NPIxray lets new practices benchmark against specialty peers, set realistic revenue targets, and build billing strategies from day one.",
    metaTitle:
      "New Medical Practice? Set Revenue Targets With Real Data",
    metaDescription:
      "New practices: set realistic revenue targets from day one. Benchmark against specialty peers and build an optimized billing strategy. Free — no login required.",
    practiceType: "new practice",
    painPoints: [
      {
        icon: BarChart3,
        title: "No Billing History to Analyze",
        description:
          "You just opened your doors and have no data to evaluate your billing performance. How do you know if your coding is on track?",
      },
      {
        icon: DollarSign,
        title: "Uncertain Revenue Projections",
        description:
          "Business plans need revenue forecasts, but without real data, you're guessing at what your practice should earn per patient.",
      },
      {
        icon: TrendingDown,
        title: "Risk of Developing Bad Habits",
        description:
          "Without benchmarks, new providers often develop undercoding habits that persist for years, costing hundreds of thousands over a career.",
      },
      {
        icon: AlertTriangle,
        title: "Unsure Which Programs to Launch",
        description:
          "Should you start CCM on day one? When should you add RPM? Without market data, program launch decisions are based on guesswork.",
      },
    ],
    features: [
      {
        icon: BarChart3,
        title: "Specialty Peer Benchmarks",
        description:
          "See exactly what providers in your specialty and state earn per patient, how they code, and which programs they utilize.",
      },
      {
        icon: DollarSign,
        title: "Revenue Target Setting",
        description:
          "Use real CMS data to set realistic revenue targets for your first year. Know what 'good' looks like for your specialty before you see your first patient.",
      },
      {
        icon: Target,
        title: "Program Launch Planning",
        description:
          "NPIxray shows which programs (CCM, RPM, AWV) have the highest adoption and revenue in your specialty, helping you prioritize launches.",
      },
      {
        icon: ShieldCheck,
        title: "Coding Accuracy from Day One",
        description:
          "Understand the expected 99213/99214/99215 distribution for your specialty so you can code correctly from your very first patient.",
      },
    ],
    keyFeatures: [
      "Specialty-specific E&M coding distribution benchmarks",
      "Revenue per patient targets based on CMS data for your specialty",
      "CCM/RPM/AWV adoption rates and revenue potential by specialty",
      "State-level market data for business planning",
      "Peer comparison once you start billing (scan your own NPI)",
      "Free — no cost to start benchmarking during your startup phase",
    ],
    stat: {
      value: "$52K",
      label:
        "Average first-year revenue gap for new practices that don't benchmark against specialty peers",
    },
    testimonialPlaceholder: {
      role: "New Practice Owner, Family Medicine",
      quote:
        "I used NPIxray before I even opened. I knew my revenue targets, my coding benchmarks, and which programs to launch first. It was like having a practice consultant for free.",
    },
    ctaMessage:
      "Benchmark your specialty and set revenue targets today",
  },

  "multi-location": {
    title: "NPIxray for Multi-Location Practices",
    headline: "Multi-Location Performance Intelligence",
    subheadline:
      "Different locations, different performance. NPIxray helps multi-site practices identify underperforming locations, standardize coding, and optimize revenue across every site.",
    metaTitle:
      "Multi-Location Practice Analytics — Compare Revenue Across Sites",
    metaDescription:
      "Multi-location practices: compare billing performance across all sites. Identify revenue gaps at each location and standardize coding for maximum reimbursement.",
    practiceType: "multi-location practice",
    painPoints: [
      {
        icon: MapPin,
        title: "Performance Variation Across Locations",
        description:
          "One location generates $600 per patient while another does $380 — and you're not sure if it's case mix, coding differences, or something else.",
      },
      {
        icon: Users,
        title: "Inconsistent Coding Standards",
        description:
          "Different office managers, different cultures, different coding habits. Without data, standardization is impossible.",
      },
      {
        icon: DollarSign,
        title: "Uneven Program Adoption",
        description:
          "Some locations run CCM and RPM programs while others don't, even when patient populations are similar. Revenue disparity grows.",
      },
      {
        icon: TrendingDown,
        title: "Difficult to Identify Root Causes",
        description:
          "When a location underperforms, it's hard to diagnose whether the problem is coding, patient mix, program utilization, or provider behavior.",
      },
    ],
    features: [
      {
        icon: MapPin,
        title: "Location-by-Location Comparison",
        description:
          "Scan every provider NPI at each location and see aggregate performance metrics. Instantly identify which sites are underperforming and why.",
      },
      {
        icon: BarChart3,
        title: "Coding Standardization Data",
        description:
          "Compare E&M coding distributions across locations to identify sites that are undercoding. Use the data to implement consistent coding practices.",
      },
      {
        icon: Target,
        title: "Program Rollout Prioritization",
        description:
          "See which locations have the highest untapped CCM, RPM, and AWV revenue. Prioritize program launches where the impact is greatest.",
      },
      {
        icon: DollarSign,
        title: "Revenue Equalization Analysis",
        description:
          "Quantify the revenue impact of bringing underperforming locations up to your best site's standards — a compelling case for investment.",
      },
    ],
    keyFeatures: [
      "Multi-site NPI scanning with location grouping",
      "Location performance ranking by revenue per patient",
      "Cross-location E&M coding consistency analysis",
      "Program adoption comparison across all sites",
      "Revenue gap quantification per location",
      "Standardization roadmap to bring all locations to top-performer levels",
    ],
    stat: {
      value: "41%",
      label:
        "Average revenue-per-patient variation between highest and lowest performing locations in multi-site practices",
    },
    testimonialPlaceholder: {
      role: "COO, 6-Location Orthopedic Practice",
      quote:
        "Our worst location was doing $380/patient while our best did $615. NPIxray showed us 60% of the gap was E&M coding differences, not patient mix.",
    },
    ctaMessage:
      "See how much revenue YOUR locations are leaving on the table",
  },
};

// ────────────────────────────────────────────────────────────
// Metadata generation
// ────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = SOLUTIONS[slug];
  if (!solution) return { title: "Solution Not Found" };

  return {
    title: solution.metaTitle,
    description: solution.metaDescription,
    alternates: {
      canonical: `https://npixray.com/solutions/${slug}`,
    },
    openGraph: {
      title: solution.metaTitle,
      description: solution.metaDescription,
      type: "website",
      url: `https://npixray.com/solutions/${slug}`,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(SOLUTIONS).map((slug) => ({ slug }));
}

// ────────────────────────────────────────────────────────────
// Page component
// ────────────────────────────────────────────────────────────

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const solution = SOLUTIONS[slug];
  if (!solution) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: solution.title,
    description: solution.metaDescription,
    url: `https://npixray.com/solutions/${slug}`,
    brand: {
      "@type": "Organization",
      name: "NPIxray",
    },
    audience: {
      "@type": "Audience",
      audienceType: solution.practiceType,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free NPI scan and revenue analysis",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <Breadcrumbs
          items={[
            { label: "Solutions", href: "/solutions" },
            { label: solution.title },
          ]}
        />

        {/* Hero */}
        <section className="max-w-4xl mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
            {solution.headline.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-[#2F5EA8]">
              {solution.headline.split(" ").slice(-1)}
            </span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            {solution.subheadline}
          </p>
        </section>

        {/* Pain Points */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            The Challenges You Face
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solution.painPoints.map((pain, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[var(--border-light)] bg-white p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
                  <pain.icon className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{pain.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {pain.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How NPIxray Helps */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            How <span className="text-[#2F5EA8]">NPIxray</span> Helps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solution.features.map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#2F5EA8]/[0.06] bg-[#2F5EA8]/[0.02] p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 mb-4">
                  <feature.icon className="h-5 w-5 text-[#2F5EA8]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features List */}
        <section className="mb-16">
          <div className="rounded-2xl border border-[var(--border-light)] bg-white p-8">
            <h2 className="text-xl font-bold mb-6">
              Key Features for Your {solution.practiceType.charAt(0).toUpperCase() + solution.practiceType.slice(1)}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {solution.keyFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Stat Callout */}
        <section className="mb-16">
          <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-8 sm:p-10 text-center">
            <p className="text-4xl sm:text-5xl font-bold text-[#2F5EA8] mb-3">
              {solution.stat.value}
            </p>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              {solution.stat.label}
            </p>
          </div>
        </section>

        {/* Testimonial Placeholder */}
        <section className="mb-16">
          <div className="rounded-2xl border border-[var(--border-light)] bg-white p-8 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 flex-shrink-0">
                <User className="h-6 w-6 text-[#2F5EA8]" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] italic leading-relaxed mb-4">
                  &ldquo;{solution.testimonialPlaceholder.quote}&rdquo;
                </p>
                <p className="text-sm font-medium">
                  {solution.testimonialPlaceholder.role}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <RelatedLinks pageType="solution" currentSlug={slug} />

        {/* CTA */}
        <section>
          <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-8 sm:p-10 text-center">
            <Zap className="h-8 w-8 text-[#2F5EA8] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{solution.ctaMessage}</h2>
            <p className="text-[var(--text-secondary)] mb-6 max-w-lg mx-auto">
              Enter any NPI number to instantly see missed revenue from E&M
              coding gaps, CCM, RPM, BHI, and AWV programs.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2F5EA8] text-white font-semibold hover:bg-[#264D8C] transition-colors"
            >
              <Zap className="h-4 w-4" />
              Run Free Scan
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
