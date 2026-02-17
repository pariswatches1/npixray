import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";
import {
  CompetitorComparison,
  type CompetitorData,
} from "@/components/compare/competitor-comparison";

/* ------------------------------------------------------------------ */
/*  Competitor data                                                    */
/* ------------------------------------------------------------------ */

const COMPETITORS: Record<
  string,
  {
    competitor: CompetitorData;
    faqs: { question: string; answer: string }[];
  }
> = {
  /* 1. ChartSpan ------------------------------------------------------ */
  chartspan: {
    competitor: {
      name: "ChartSpan",
      slug: "chartspan",
      tagline: "Turnkey chronic care management services",
      description:
        "ChartSpan provides outsourced Chronic Care Management (CCM) services for healthcare practices. They handle patient enrollment, care coordination, and monthly billing on behalf of providers.",
      website: "chartspan.com",
      pricing: "Approximately $150\u2013300/patient/year \u2022 No free tier \u2022 Revenue-share model",
      focus: "CCM Management & Patient Engagement",
      strengths: [
        "Fully managed CCM service \u2014 minimal staff effort",
        "Handles patient outreach and enrollment",
        "Clinical care coordinators included",
        "Proven patient engagement workflows",
        "Revenue-share model reduces upfront risk",
      ],
      weaknesses: [
        "No free tier or trial scan",
        "Limited to CCM \u2014 does not cover RPM, BHI, or AWV analysis",
        "No revenue gap analysis or E&M coding audit",
        "No public benchmarking or specialty data",
        "Requires implementation and onboarding period",
        "Practice gives up portion of CCM revenue to ChartSpan",
      ],
      features: {
        "Free Tier Available": false,
        "Real CMS Medicare Data": false,
        "Revenue Gap Analysis": false,
        "E&M Coding Audit": false,
        "CCM/RPM/BHI/AWV Analysis": "CCM only",
        "1.175M+ Provider Database": false,
        "NPI Lookup": false,
        "Specialty Benchmarks": false,
        "State & City Analytics": false,
        "Practice Comparison Tools": false,
        "API Access": false,
        "No Setup Required": false,
      },
    },
    faqs: [
      {
        question: "Is ChartSpan better than NPIxray?",
        answer:
          "ChartSpan and NPIxray serve different needs. ChartSpan is ideal if you want a fully outsourced CCM service \u2014 they handle patient calls and care coordination for you. NPIxray is a revenue intelligence platform that helps you identify all missed revenue opportunities (CCM, RPM, BHI, AWV, and E&M coding) using real CMS data. Many practices use analytics tools like NPIxray first to identify opportunities, then decide whether to manage programs in-house or outsource to services like ChartSpan.",
      },
      {
        question: "How much does ChartSpan cost?",
        answer:
          "ChartSpan typically charges approximately $150\u2013300 per patient per year, often through a revenue-share model where they keep a portion of the CCM reimbursement. There is no free tier. NPIxray offers a free NPI scanner to identify opportunities before you commit to any service.",
      },
      {
        question: "Can I use both NPIxray and ChartSpan?",
        answer:
          "Yes. NPIxray can help you identify which patients qualify for CCM and estimate the revenue opportunity. You can then use ChartSpan to manage the actual CCM delivery for those patients. NPIxray also covers RPM, BHI, AWV, and E&M coding analysis that ChartSpan does not.",
      },
      {
        question: "Does ChartSpan offer revenue gap analysis?",
        answer:
          "No. ChartSpan focuses on delivering CCM services, not on analyzing your overall revenue or coding patterns. NPIxray analyzes your real Medicare billing data to show exactly where you are leaving money on the table across all programs and E&M codes.",
      },
    ],
  },

  /* 2. SignalLamp Health ---------------------------------------------- */
  signallamp: {
    competitor: {
      name: "SignalLamp Health",
      slug: "signallamp",
      tagline: "Healthcare claims analytics and intelligence",
      description:
        "SignalLamp Health provides healthcare analytics solutions focused on claims data analysis, payer performance, and population health insights for healthcare organizations and payers.",
      website: "signallamphealth.com",
      pricing: "Enterprise pricing \u2022 Custom quotes \u2022 No free tier",
      focus: "Claims Analytics & Payer Intelligence",
      strengths: [
        "Deep claims data analytics capabilities",
        "Payer performance and contract analysis",
        "Population health insights",
        "Enterprise-grade reporting",
        "Multi-payer data analysis (beyond Medicare)",
      ],
      weaknesses: [
        "No free tier or self-service option",
        "Enterprise pricing is typically expensive",
        "Requires sales process and demo",
        "Not designed for individual practice revenue optimization",
        "No instant NPI lookup or scanning",
        "Longer implementation timeline",
      ],
      features: {
        "Free Tier Available": false,
        "Real CMS Medicare Data": "Varies",
        "Revenue Gap Analysis": "Enterprise",
        "E&M Coding Audit": false,
        "CCM/RPM/BHI/AWV Analysis": false,
        "1.175M+ Provider Database": false,
        "NPI Lookup": false,
        "Specialty Benchmarks": "Custom",
        "State & City Analytics": "Enterprise",
        "Practice Comparison Tools": "Enterprise",
        "API Access": "Enterprise",
        "No Setup Required": false,
      },
    },
    faqs: [
      {
        question: "Is SignalLamp Health better than NPIxray?",
        answer:
          "It depends on your needs. SignalLamp Health is geared toward large healthcare organizations and payers that need deep claims analytics across multiple payer types. NPIxray is built for individual practices and small groups that want instant, actionable revenue intelligence from CMS Medicare data. If you are a single practice looking for quick answers, NPIxray is more accessible. If you are a large health system needing enterprise analytics, SignalLamp may be a fit.",
      },
      {
        question: "How much does SignalLamp Health cost?",
        answer:
          "SignalLamp Health uses enterprise pricing with custom quotes, typically requiring a sales consultation. Exact pricing is not published publicly. NPIxray starts with a completely free NPI scanner and offers paid plans starting at $99/month for deeper analysis.",
      },
      {
        question: "Can I use both NPIxray and SignalLamp Health?",
        answer:
          "Yes. NPIxray provides immediate practice-level revenue intelligence using CMS Medicare data, while SignalLamp Health offers broader enterprise analytics. A practice could use NPIxray for quick benchmarking and coding analysis, and a larger organization might layer on SignalLamp for multi-payer claims analytics.",
      },
    ],
  },

  /* 3. Chronic Care IQ ------------------------------------------------ */
  "chronic-care-iq": {
    competitor: {
      name: "Chronic Care IQ",
      slug: "chronic-care-iq",
      tagline: "CCM and RPM software for care management programs",
      description:
        "Chronic Care IQ provides software for managing Chronic Care Management (CCM) and Remote Patient Monitoring (RPM) programs. The platform helps practices enroll patients, track care time, and handle billing compliance.",
      website: "chroniccareiq.com",
      pricing: "Custom pricing \u2022 Demo required \u2022 No free tier",
      focus: "CCM/RPM Program Management Software",
      strengths: [
        "Purpose-built for CCM and RPM workflows",
        "Patient enrollment and time-tracking tools",
        "Billing compliance tracking",
        "EHR integration capabilities",
        "Care plan management features",
      ],
      weaknesses: [
        "No free tier or instant scan",
        "Pricing requires a sales demo",
        "No revenue gap analysis from CMS data",
        "No E&M coding audit or benchmarking",
        "No AWV or BHI analysis",
        "Does not provide specialty or geographic benchmarks",
      ],
      features: {
        "Free Tier Available": false,
        "Real CMS Medicare Data": false,
        "Revenue Gap Analysis": false,
        "E&M Coding Audit": false,
        "CCM/RPM/BHI/AWV Analysis": "CCM & RPM only",
        "1.175M+ Provider Database": false,
        "NPI Lookup": false,
        "Specialty Benchmarks": false,
        "State & City Analytics": false,
        "Practice Comparison Tools": false,
        "API Access": false,
        "No Setup Required": false,
      },
    },
    faqs: [
      {
        question: "Is Chronic Care IQ better than NPIxray?",
        answer:
          "They serve different purposes. Chronic Care IQ is a care management platform for running CCM and RPM programs day-to-day (enrolling patients, tracking time, generating bills). NPIxray is a revenue intelligence tool that helps you discover which opportunities exist in the first place \u2014 including CCM, RPM, BHI, AWV, and E&M coding gaps. Use NPIxray to find the opportunities, then a tool like Chronic Care IQ to manage the program.",
      },
      {
        question: "How much does Chronic Care IQ cost?",
        answer:
          "Chronic Care IQ does not publish pricing publicly and requires a demo or sales consultation to get a quote. NPIxray offers a free NPI scanner with no demo required, and paid plans start at $99/month.",
      },
      {
        question: "Can I use both NPIxray and Chronic Care IQ?",
        answer:
          "Absolutely. NPIxray identifies how many patients may qualify for CCM and RPM and estimates the revenue opportunity. Chronic Care IQ can then be used to manage the operational delivery of those programs. They complement each other well.",
      },
      {
        question: "Does Chronic Care IQ provide Medicare data analysis?",
        answer:
          "No. Chronic Care IQ is an operational workflow tool, not a data analytics platform. NPIxray uses real CMS Medicare claims data covering 1.175M+ providers to deliver benchmarks, coding analysis, and revenue gap detection.",
      },
    ],
  },

  /* 4. Prevounce Health ----------------------------------------------- */
  prevounce: {
    competitor: {
      name: "Prevounce Health",
      slug: "prevounce",
      tagline: "CCM, RPM, and Annual Wellness Visit platform",
      description:
        "Prevounce Health offers a platform for managing Chronic Care Management (CCM), Remote Patient Monitoring (RPM), and Annual Wellness Visits (AWV). It helps practices streamline preventive care programs and increase revenue.",
      website: "prevounce.com",
      pricing: "Mid-market SaaS pricing \u2022 Per-provider or per-patient plans \u2022 No free tier",
      focus: "CCM, RPM & AWV Program Management",
      strengths: [
        "Strong Annual Wellness Visit (AWV) workflow tools",
        "Covers CCM, RPM, and AWV in one platform",
        "Health Risk Assessment (HRA) templates",
        "Patient enrollment management",
        "Billing and compliance tracking",
        "EHR integrations available",
      ],
      weaknesses: [
        "No free tier or instant NPI scan",
        "Does not use CMS public data for benchmarking",
        "No E&M coding analysis",
        "No revenue gap detection from claims data",
        "Limited BHI support",
        "No specialty or geographic benchmarking",
      ],
      features: {
        "Free Tier Available": false,
        "Real CMS Medicare Data": false,
        "Revenue Gap Analysis": false,
        "E&M Coding Audit": false,
        "CCM/RPM/BHI/AWV Analysis": "CCM, RPM & AWV",
        "1.175M+ Provider Database": false,
        "NPI Lookup": false,
        "Specialty Benchmarks": false,
        "State & City Analytics": false,
        "Practice Comparison Tools": false,
        "API Access": false,
        "No Setup Required": false,
      },
    },
    faqs: [
      {
        question: "Is Prevounce Health better than NPIxray?",
        answer:
          "Prevounce Health excels at operational management of CCM, RPM, and AWV programs. It is a workflow tool for running these programs. NPIxray is an intelligence platform that uses real CMS data to identify revenue opportunities. If you need to discover where you are leaving money on the table, NPIxray is the answer. If you are already running care management programs and need workflow tools, Prevounce may be a good fit.",
      },
      {
        question: "How much does Prevounce Health cost?",
        answer:
          "Prevounce Health uses mid-market SaaS pricing, typically per-provider or per-patient. Exact pricing is available through their sales team. NPIxray offers a free scanner with no commitment, with paid plans starting at $99/month.",
      },
      {
        question: "Can I use both NPIxray and Prevounce Health?",
        answer:
          "Yes. NPIxray helps you identify the revenue opportunity from CCM, RPM, AWV, and more. Once you know the potential, Prevounce Health can help you operationally run those programs. NPIxray also provides E&M coding analysis and geographic benchmarks that Prevounce does not.",
      },
    ],
  },

  /* 5. Care Management Suite ------------------------------------------ */
  "care-management-suite": {
    competitor: {
      name: "Care Management Suite",
      slug: "care-management-suite",
      tagline: "End-to-end care management platform for health systems",
      description:
        "Care Management Suite provides comprehensive care management workflows for health systems and large practices. It covers chronic care management, care transitions, and population health management.",
      website: "caremanagementsuite.com",
      pricing: "Enterprise pricing \u2022 Custom implementation \u2022 No free tier",
      focus: "Enterprise Care Management Workflows",
      strengths: [
        "Comprehensive care management workflow coverage",
        "Built for large health systems and enterprise",
        "Supports care transitions and population health",
        "Robust reporting and compliance tools",
        "Multi-program support (CCM, TCM, and more)",
      ],
      weaknesses: [
        "No free tier or self-service access",
        "Enterprise pricing and long sales cycles",
        "Not designed for individual practices or small groups",
        "No CMS data-driven benchmarking",
        "No instant NPI scanning or revenue gap analysis",
        "Heavy implementation and onboarding requirements",
      ],
      features: {
        "Free Tier Available": false,
        "Real CMS Medicare Data": false,
        "Revenue Gap Analysis": false,
        "E&M Coding Audit": false,
        "CCM/RPM/BHI/AWV Analysis": "CCM focused",
        "1.175M+ Provider Database": false,
        "NPI Lookup": false,
        "Specialty Benchmarks": false,
        "State & City Analytics": false,
        "Practice Comparison Tools": false,
        "API Access": "Enterprise",
        "No Setup Required": false,
      },
    },
    faqs: [
      {
        question: "Is Care Management Suite better than NPIxray?",
        answer:
          "Care Management Suite targets enterprise health systems needing complex care management workflows. NPIxray targets practices of all sizes that want instant revenue intelligence from CMS Medicare data. If you are a large health system managing care transitions and population health, Care Management Suite may fit. If you want to quickly understand your revenue gaps and benchmarks, NPIxray is faster and more accessible.",
      },
      {
        question: "How much does Care Management Suite cost?",
        answer:
          "Care Management Suite uses enterprise pricing with custom quotes based on organization size and needs. Implementation costs can be significant. NPIxray starts free and offers paid plans from $99/month with no enterprise sales process required.",
      },
      {
        question: "Can I use both NPIxray and Care Management Suite?",
        answer:
          "Yes. NPIxray provides the analytics layer to identify opportunities, while Care Management Suite provides the operational workflow layer to execute care management programs at scale. They address different parts of the revenue lifecycle.",
      },
    ],
  },

  /* 6. Wellbox -------------------------------------------------------- */
  wellbox: {
    competitor: {
      name: "Wellbox",
      slug: "wellbox",
      tagline: "RPM and CCM services with device integration",
      description:
        "Wellbox provides Remote Patient Monitoring (RPM) and Chronic Care Management (CCM) services, including connected health devices, clinical monitoring, and billing support for healthcare practices.",
      website: "wellbox.health",
      pricing: "Per-patient pricing \u2022 Includes devices \u2022 No free tier",
      focus: "RPM & CCM Services with Devices",
      strengths: [
        "Full-service RPM with connected devices included",
        "Clinical monitoring staff provided",
        "Device logistics and patient onboarding handled",
        "CCM and RPM billing support",
        "Proven device integration workflows",
        "Minimal practice staff time required",
      ],
      weaknesses: [
        "No free tier or instant analytics",
        "Per-patient cost can add up quickly",
        "No E&M coding analysis or benchmarking",
        "No revenue gap detection from claims data",
        "Limited to RPM and CCM (no AWV or BHI analysis)",
        "No NPI lookup or provider database",
      ],
      features: {
        "Free Tier Available": false,
        "Real CMS Medicare Data": false,
        "Revenue Gap Analysis": false,
        "E&M Coding Audit": false,
        "CCM/RPM/BHI/AWV Analysis": "CCM & RPM only",
        "1.175M+ Provider Database": false,
        "NPI Lookup": false,
        "Specialty Benchmarks": false,
        "State & City Analytics": false,
        "Practice Comparison Tools": false,
        "API Access": false,
        "No Setup Required": false,
      },
    },
    faqs: [
      {
        question: "Is Wellbox better than NPIxray?",
        answer:
          "Wellbox and NPIxray are complementary, not competitive. Wellbox is a full-service RPM/CCM delivery provider that ships devices and provides clinical monitoring. NPIxray is an analytics platform that helps you identify which patients qualify for RPM and CCM and how much revenue you are missing. Use NPIxray to find the opportunity, then Wellbox to deliver the service.",
      },
      {
        question: "How much does Wellbox cost?",
        answer:
          "Wellbox uses per-patient pricing that includes devices and clinical monitoring services. Specific pricing varies based on program type and volume. NPIxray starts free and helps you estimate the revenue potential before committing to any service provider.",
      },
      {
        question: "Can I use both NPIxray and Wellbox?",
        answer:
          "Yes, and it makes strategic sense. NPIxray identifies the revenue opportunity from RPM, CCM, and other programs using real CMS data. You can then engage Wellbox to operationally deliver the RPM/CCM services, knowing exactly what the expected revenue return should be.",
      },
    ],
  },

  /* 7. PCMH Plus ----------------------------------------------------- */
  "pcmh-plus": {
    competitor: {
      name: "PCMH Plus",
      slug: "pcmh-plus",
      tagline: "Patient-Centered Medical Home recognition tools",
      description:
        "PCMH Plus provides tools and support for practices seeking Patient-Centered Medical Home (PCMH) recognition. The platform helps with documentation, quality measure tracking, and the NCQA accreditation process.",
      website: "pcmhplus.com",
      pricing: "Subscription-based \u2022 Varies by practice size \u2022 No free tier",
      focus: "PCMH Recognition & Quality Tracking",
      strengths: [
        "Specialized PCMH accreditation support",
        "Quality measure tracking and reporting",
        "NCQA recognition workflow guidance",
        "Documentation templates and checklists",
        "Practice transformation consulting",
      ],
      weaknesses: [
        "Very niche \u2014 only useful for PCMH recognition",
        "No revenue gap analysis or coding insights",
        "No CMS data analysis or benchmarking",
        "No CCM, RPM, BHI, or AWV program analysis",
        "No NPI lookup or provider database",
        "Not a general-purpose revenue tool",
      ],
      features: {
        "Free Tier Available": false,
        "Real CMS Medicare Data": false,
        "Revenue Gap Analysis": false,
        "E&M Coding Audit": false,
        "CCM/RPM/BHI/AWV Analysis": false,
        "1.175M+ Provider Database": false,
        "NPI Lookup": false,
        "Specialty Benchmarks": false,
        "State & City Analytics": false,
        "Practice Comparison Tools": false,
        "API Access": false,
        "No Setup Required": false,
      },
    },
    faqs: [
      {
        question: "Is PCMH Plus better than NPIxray?",
        answer:
          "PCMH Plus and NPIxray address entirely different needs. PCMH Plus helps practices achieve Patient-Centered Medical Home recognition through NCQA accreditation. NPIxray is a revenue intelligence platform that analyzes Medicare billing data. If your goal is PCMH recognition, PCMH Plus is purpose-built for that. If your goal is maximizing practice revenue, NPIxray is the right tool.",
      },
      {
        question: "How much does PCMH Plus cost?",
        answer:
          "PCMH Plus uses subscription-based pricing that varies by practice size and the scope of services needed. Contact their team for a quote. NPIxray offers a free NPI scanner and paid plans starting at $99/month.",
      },
      {
        question: "Can I use both NPIxray and PCMH Plus?",
        answer:
          "Yes, but they serve very different functions. PCMH Plus helps with accreditation, while NPIxray helps with revenue optimization. There is minimal overlap. A practice pursuing PCMH recognition could use NPIxray independently to improve their billing performance.",
      },
    ],
  },

  /* 8. Aledade -------------------------------------------------------- */
  aledade: {
    competitor: {
      name: "Aledade",
      slug: "aledade",
      tagline: "ACO management and value-based care platform",
      description:
        "Aledade helps independent primary care practices participate in value-based care through Accountable Care Organization (ACO) networks. They provide technology, data analytics, and hands-on practice transformation support.",
      website: "aledade.com",
      pricing: "Shared savings model \u2022 No upfront cost \u2022 ACO membership required",
      focus: "ACO Management & Value-Based Care",
      strengths: [
        "Helps independent practices join ACOs and value-based care",
        "Shared savings revenue model (potential upside)",
        "Practice transformation support and coaching",
        "Population health analytics",
        "No upfront technology cost for participating practices",
        "Established network with proven savings track record",
      ],
      weaknesses: [
        "Requires ACO membership commitment",
        "Not a self-service analytics tool",
        "Focused on value-based care, not fee-for-service optimization",
        "No instant NPI scan or on-demand revenue analysis",
        "Practice gives up portion of shared savings",
        "Not available to all practice types or locations",
      ],
      features: {
        "Free Tier Available": false,
        "Real CMS Medicare Data": "ACO data",
        "Revenue Gap Analysis": "Value-based",
        "E&M Coding Audit": false,
        "CCM/RPM/BHI/AWV Analysis": "As part of ACO goals",
        "1.175M+ Provider Database": false,
        "NPI Lookup": false,
        "Specialty Benchmarks": "Within ACO network",
        "State & City Analytics": false,
        "Practice Comparison Tools": "Within ACO network",
        "API Access": false,
        "No Setup Required": false,
      },
    },
    faqs: [
      {
        question: "Is Aledade better than NPIxray?",
        answer:
          "Aledade and NPIxray serve fundamentally different purposes. Aledade is an ACO management company that helps practices participate in value-based care and earn shared savings. NPIxray is a revenue intelligence tool for optimizing fee-for-service billing using CMS data. Many practices could benefit from both \u2014 using NPIxray for immediate billing optimization while participating in Aledade for long-term value-based care revenue.",
      },
      {
        question: "How much does Aledade cost?",
        answer:
          "Aledade typically operates on a shared savings model with no upfront technology cost. They take a percentage of the shared savings generated through the ACO. The economics depend on your ACO performance. NPIxray is free to start and offers paid plans from $99/month for practices wanting fee-for-service revenue optimization.",
      },
      {
        question: "Can I use both NPIxray and Aledade?",
        answer:
          "Yes, and many practices should consider it. Aledade focuses on value-based care and shared savings through ACO participation. NPIxray focuses on fee-for-service revenue optimization, E&M coding analysis, and care management opportunity detection. Optimizing your fee-for-service billing with NPIxray while participating in Aledade's value-based programs can maximize total practice revenue.",
      },
      {
        question: "Does Aledade provide E&M coding analysis?",
        answer:
          "Aledade's analytics are focused on value-based care metrics, quality measures, and shared savings \u2014 not individual E&M coding patterns. NPIxray specifically analyzes your E&M coding distribution (99213 vs 99214 vs 99215) against specialty benchmarks to identify undercoding opportunities.",
      },
    ],
  },

  /* 9. Phynd Technologies --------------------------------------------- */
  phynd: {
    competitor: {
      name: "Phynd Technologies",
      slug: "phynd",
      tagline: "Provider directory and data management platform",
      description:
        "Phynd Technologies specializes in provider data management, helping health systems maintain accurate provider directories, credentialing data, and network adequacy information across their organizations.",
      website: "phynd.com",
      pricing: "Enterprise pricing \u2022 Custom implementation \u2022 No free tier",
      focus: "Provider Directory & Data Management",
      strengths: [
        "Comprehensive provider data management",
        "Credentialing and network adequacy tools",
        "Provider directory accuracy and maintenance",
        "Health system-grade data infrastructure",
        "Multi-system provider data synchronization",
      ],
      weaknesses: [
        "Enterprise-only \u2014 no individual practice tools",
        "No revenue analytics or billing optimization",
        "No E&M coding or care management analysis",
        "No benchmarking or specialty comparisons",
        "Focused on data management, not revenue intelligence",
        "Long implementation cycles",
      ],
      features: {
        "Free Tier Available": false,
        "Real CMS Medicare Data": false,
        "Revenue Gap Analysis": false,
        "E&M Coding Audit": false,
        "CCM/RPM/BHI/AWV Analysis": false,
        "1.175M+ Provider Database": "Directory management",
        "NPI Lookup": "Directory context",
        "Specialty Benchmarks": false,
        "State & City Analytics": false,
        "Practice Comparison Tools": false,
        "API Access": "Enterprise",
        "No Setup Required": false,
      },
    },
    faqs: [
      {
        question: "Is Phynd Technologies better than NPIxray?",
        answer:
          "Phynd and NPIxray solve different problems. Phynd is a provider data management platform for health systems that need to keep provider directories, credentialing, and network information accurate. NPIxray is a revenue intelligence platform that analyzes billing data to find missed revenue. Unless you need enterprise provider directory management, NPIxray is likely what you need for revenue optimization.",
      },
      {
        question: "How much does Phynd Technologies cost?",
        answer:
          "Phynd uses enterprise pricing with custom implementations for health systems. Pricing is not publicly available and requires a sales consultation. NPIxray offers a free NPI scanner and self-service plans starting at $99/month.",
      },
      {
        question: "Can I use both NPIxray and Phynd Technologies?",
        answer:
          "They serve very different purposes with minimal overlap. Phynd manages provider directory data for health systems, while NPIxray provides revenue intelligence and benchmarking for medical practices. A health system could theoretically use both, but they address different operational needs.",
      },
    ],
  },

  /* 10. NPI Registry (NPPES) ----------------------------------------- */
  "npi-registry": {
    competitor: {
      name: "NPI Registry (NPPES)",
      slug: "npi-registry",
      tagline: "Official government NPI lookup tool from CMS",
      description:
        "The NPI Registry, maintained by the National Plan and Provider Enumeration System (NPPES), is the official free government tool for looking up National Provider Identifier (NPI) numbers. It provides basic provider information including name, address, specialty, and taxonomy codes.",
      website: "npiregistry.cms.hhs.gov",
      pricing: "Completely free \u2022 Government-maintained \u2022 No paid tier",
      focus: "NPI Number Lookup & Provider Registry",
      strengths: [
        "Completely free and always will be",
        "Official government data source",
        "Comprehensive NPI database (all registered providers)",
        "API available for integration",
        "Real-time data updates",
        "Trusted authoritative source for NPI verification",
      ],
      weaknesses: [
        "Only provides basic provider information (name, address, specialty)",
        "No billing data, revenue analysis, or financial insights",
        "No E&M coding patterns or benchmarking",
        "No care management opportunity detection",
        "No specialty comparisons or analytics",
        "Basic search interface with no advanced analytics",
      ],
      features: {
        "Free Tier Available": true,
        "Real CMS Medicare Data": false,
        "Revenue Gap Analysis": false,
        "E&M Coding Audit": false,
        "CCM/RPM/BHI/AWV Analysis": false,
        "1.175M+ Provider Database": true,
        "NPI Lookup": true,
        "Specialty Benchmarks": false,
        "State & City Analytics": false,
        "Practice Comparison Tools": false,
        "API Access": true,
        "No Setup Required": true,
      },
    },
    faqs: [
      {
        question: "Is the NPI Registry better than NPIxray?",
        answer:
          "The NPI Registry is the official source for looking up NPI numbers and basic provider information \u2014 it is excellent for that specific purpose. However, it provides zero financial data, billing analysis, or revenue insights. NPIxray actually uses NPI Registry data as a starting point, then layers on real CMS Medicare billing data to provide revenue gap analysis, coding benchmarks, and care management opportunities. Think of it this way: the NPI Registry tells you who a doctor is; NPIxray tells you how much money they are leaving on the table.",
      },
      {
        question: "Is the NPI Registry free?",
        answer:
          "Yes, the NPI Registry (NPPES) is completely free and maintained by the federal government. NPIxray also offers a free NPI scanner that goes far beyond basic lookup \u2014 it analyzes the provider's actual Medicare billing patterns and identifies revenue opportunities at no cost.",
      },
      {
        question: "Can I use both NPIxray and the NPI Registry?",
        answer:
          "Absolutely. In fact, NPIxray uses the NPPES NPI Registry API under the hood for provider lookups. The NPI Registry is great for verifying basic provider information. NPIxray takes that further by connecting billing data from CMS to show you revenue analysis, coding patterns, and benchmarks.",
      },
      {
        question: "What does NPIxray show that the NPI Registry does not?",
        answer:
          "The NPI Registry shows basic info: name, address, specialty, and taxonomy code. NPIxray shows Medicare billing data including revenue per patient, E&M coding distribution (99213/99214/99215), CCM/RPM/BHI/AWV adoption rates, specialty benchmarks, state analytics, and a revenue gap analysis showing exactly how much additional revenue a provider could capture.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Static params for build-time generation                            */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return Object.keys(COMPETITORS).map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = COMPETITORS[slug];
  if (!data) {
    return { title: "Comparison Not Found" };
  }

  const { competitor } = data;
  const title = `NPIxray vs ${competitor.name} \u2014 Feature & Pricing Comparison 2026`;
  const description = `Compare NPIxray and ${competitor.name} side by side. See features, pricing, strengths, and weaknesses to find the best ${competitor.focus.toLowerCase()} solution for your practice.`;

  return {
    title,
    description,
    keywords: [
      `${competitor.name} alternative`,
      `${competitor.name} vs NPIxray`,
      `NPIxray vs ${competitor.name}`,
      `${competitor.name} comparison`,
      `${competitor.name} pricing`,
      `best ${competitor.focus.toLowerCase()}`,
      "medical practice revenue software",
      "healthcare analytics comparison",
    ],
    openGraph: {
      title,
      description,
      url: `https://npixray.com/vs/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://npixray.com/vs/${slug}`,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function VsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = COMPETITORS[slug];
  if (!data) notFound();

  const { competitor, faqs } = data;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `NPIxray vs ${competitor.name}`,
    description: `Feature and pricing comparison between NPIxray and ${competitor.name}.`,
    url: `https://npixray.com/vs/${slug}`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "Product",
          name: "NPIxray",
          url: "https://npixray.com",
          description:
            "AI-powered revenue intelligence platform built on free CMS Medicare data. Analyze 1.175M+ providers instantly.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "Free NPI scanner with paid plans from $99/mo",
          },
        },
        {
          "@type": "Product",
          name: competitor.name,
          url: `https://${competitor.website}`,
          description: competitor.description,
        },
      ],
    },
  };

  const faqJsonLd = {
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumbs
          items={[
            { label: "Compare", href: "/vs" },
            { label: `NPIxray vs ${competitor.name}` },
          ]}
        />
      </div>

      <CompetitorComparison competitor={competitor} faqs={faqs} />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
