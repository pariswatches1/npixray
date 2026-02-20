import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Zap,
  Clock,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  ArrowRight,
  Heart,
  Activity,
  Stethoscope,
  Brain,
  TrendingUp,
} from "lucide-react";
import { TrackPageView } from "@/components/analytics/track-pageview";
import { RelatedLinks } from "@/components/seo/related-links";

// ────────────────────────────────────────────────────────────
// Guide data — all content lives here for easy maintenance
// ────────────────────────────────────────────────────────────

interface GuideSection {
  heading: string;
  content: string[];
  listItems?: string[];
  tip?: string;
  warning?: string;
}

interface GuideData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  category: string;
  readTime: string;
  revenue: string;
  lastUpdated: string;
  intro: string[];
  sections: GuideSection[];
  keyTakeaways: string[];
}

const GUIDES: Record<string, GuideData> = {
  "ccm-billing-99490": {
    title: "Complete Guide to CCM Billing (CPT 99490)",
    metaTitle: "CCM Billing Guide: CPT 99490 — Requirements, Reimbursement & Best Practices",
    metaDescription:
      "Master Chronic Care Management billing with CPT 99490. Learn patient eligibility, 20-minute time requirements, documentation standards, and how to earn $66-144 per patient per month.",
    icon: Heart,
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    category: "Care Management",
    readTime: "8 min read",
    revenue: "$66–$144/patient/mo",
    lastUpdated: "February 2026",
    intro: [
      "Chronic Care Management (CCM) represents one of the largest untapped revenue streams for primary care and specialty practices. Despite being available since 2015, national adoption rates remain below 15% — meaning the vast majority of eligible Medicare patients aren't receiving this service, and practices are leaving significant revenue on the table.",
      "This guide covers everything you need to implement and bill CCM successfully: patient eligibility, code selection, time tracking, documentation requirements, and common pitfalls that lead to claim denials.",
    ],
    sections: [
      {
        heading: "What Is Chronic Care Management?",
        content: [
          "CCM is a Medicare program that reimburses providers for the non-face-to-face care coordination they provide to patients with two or more chronic conditions expected to last at least 12 months. This includes medication management, care plan oversight, coordination with specialists, and patient check-ins between office visits.",
          "CMS designed CCM to incentivize the kind of proactive, between-visit care that keeps patients healthier and reduces costly emergency visits and hospitalizations.",
        ],
      },
      {
        heading: "CPT Codes and Reimbursement Rates",
        content: [
          "CCM billing centers around three primary codes. Understanding when to use each code is critical for maximizing revenue while maintaining compliance.",
        ],
        listItems: [
          "99490 — Non-complex CCM: 20 minutes of clinical staff time per calendar month. Reimbursement: ~$66/month",
          "99439 — Each additional 20 minutes beyond the initial 20 minutes for non-complex CCM. Reimbursement: ~$47/month (can be billed up to 2 additional times)",
          "99491 — Complex CCM: 30 minutes of physician or qualified healthcare professional time. Reimbursement: ~$94/month",
        ],
        tip: "A single patient receiving both 99490 and two units of 99439 generates approximately $160/month ($1,920/year). With 50 enrolled patients, that's $96,000 in annual revenue from CCM alone.",
      },
      {
        heading: "Patient Eligibility Requirements",
        content: [
          "Not every Medicare patient qualifies for CCM. To bill these codes, patients must meet specific clinical criteria that CMS has established.",
        ],
        listItems: [
          "Two or more chronic conditions expected to last at least 12 months (or until death)",
          "Conditions place the patient at significant risk of death, acute exacerbation, or functional decline",
          "Patient must provide verbal or written consent (document in the chart)",
          "Must have a comprehensive care plan established, maintained, and available to all care team members",
          "Only one practitioner can bill CCM per patient per month",
        ],
        warning: "The consent requirement is the #1 reason for CCM claim denials. Always document the date, who obtained consent, and that the patient was informed about cost-sharing. Phone consent is acceptable but must be documented.",
      },
      {
        heading: "Common Qualifying Conditions",
        content: [
          "Almost any combination of chronic conditions qualifies. The most common pairings in Medicare patients include hypertension with diabetes, COPD with heart failure, diabetes with chronic kidney disease, depression with any chronic condition, and arthritis combined with cardiovascular disease.",
          "In a typical primary care panel of 300-400 Medicare patients, 40-60% will have two or more qualifying chronic conditions — that's 120-240 potentially eligible patients.",
        ],
      },
      {
        heading: "Time Tracking and Documentation",
        content: [
          "Accurate time tracking is the backbone of compliant CCM billing. CMS requires at least 20 minutes of clinical staff time per calendar month for 99490.",
        ],
        listItems: [
          "Time must be documented with start/stop times or cumulative logs",
          "Activities that count: care plan review, medication reconciliation, specialist coordination, patient/caregiver outreach, lab result follow-up",
          "Activities that DON'T count: scheduling appointments, billing tasks, travel time, or time spent on services billed separately",
          "General supervision is required (physician doesn't need to perform the work but must be available)",
          "Time resets on the 1st of each calendar month",
        ],
        tip: "Invest in CCM software that automates time tracking with built-in timers. Manual tracking is error-prone and makes audits much harder to defend.",
      },
      {
        heading: "Implementation Workflow",
        content: [
          "Successful CCM programs follow a structured workflow. Start by identifying eligible patients through your EHR — query for patients with 2+ chronic conditions on their problem list. Prioritize high-risk patients first, as they generate the most value from proactive management.",
          "Next, obtain and document consent during an office visit or by phone. Create or update the comprehensive care plan, then assign a care coordinator (nurse, medical assistant, or clinical staff) to manage monthly outreach. Track all activities meticulously, and bill at the end of each month once the 20-minute threshold is met.",
        ],
      },
      {
        heading: "Common Billing Mistakes to Avoid",
        content: [
          "Even practices that attempt CCM often leave money on the table due to avoidable errors.",
        ],
        listItems: [
          "Failing to obtain or document patient consent before billing",
          "Not meeting the 20-minute minimum (billing with only 15 minutes documented)",
          "Forgetting to bill 99439 for additional time beyond the first 20 minutes",
          "Overlapping with other care management codes (RPM, BHI) incorrectly",
          "Not updating the care plan at least once per billing period",
          "Billing CCM during a month when the patient was admitted to a hospital or SNF for a significant portion of the month",
        ],
      },
    ],
    keyTakeaways: [
      "CCM (99490) requires 2+ chronic conditions and documented patient consent",
      "Base reimbursement is ~$66/month, scaling to $160+/month with add-on codes",
      "Time tracking must be meticulous with start/stop or cumulative documentation",
      "Most practices have 100+ eligible patients but fewer than 15% are enrolled nationally",
      "ROI is immediate — a single dedicated care coordinator can manage 150-200 patients",
    ],
  },

  "rpm-billing-99453-99458": {
    title: "RPM Billing Guide (CPT 99453–99458)",
    metaTitle: "RPM Billing Guide: CPT 99453-99458 — Setup, Monitoring & Revenue Optimization",
    metaDescription:
      "Complete guide to Remote Patient Monitoring billing. Learn device setup (99453), data transmission (99454), treatment management (99457/99458), and how to earn $120+ per patient per month.",
    icon: Activity,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    category: "Remote Monitoring",
    readTime: "9 min read",
    revenue: "$120+/patient/mo",
    lastUpdated: "February 2026",
    intro: [
      "Remote Patient Monitoring (RPM) has exploded since 2020, with CMS making it one of the most attractive revenue programs for practices of all sizes. RPM allows you to bill for monitoring patient health data — like blood pressure, weight, glucose levels, and pulse oximetry — collected through FDA-cleared devices used at home.",
      "With four distinct CPT codes that can be stacked, a single RPM patient can generate over $120 per month in revenue. This guide breaks down each code, device requirements, and the operational workflow to build a profitable RPM program.",
    ],
    sections: [
      {
        heading: "Understanding the RPM Code Set",
        content: [
          "RPM billing uses four codes that cover different aspects of the monitoring process. Each code has unique requirements and can often be billed together for the same patient in a single month.",
        ],
        listItems: [
          "99453 — Initial device setup and patient education on using the device. One-time billing per episode of care. Reimbursement: ~$19",
          "99454 — Device supply and daily data transmission. Requires 16+ days of data per 30-day period. Reimbursement: ~$56/month",
          "99457 — First 20 minutes of interactive communication with the patient per month about their data. Reimbursement: ~$49/month",
          "99458 — Each additional 20 minutes of interactive communication (billable once per month). Reimbursement: ~$39/month",
        ],
        tip: "When all four codes are billed together in the first month (99453 + 99454 + 99457 + 99458), you can generate approximately $163 for that patient. In subsequent months, 99454 + 99457 + 99458 still yields $144/month.",
      },
      {
        heading: "Patient Eligibility and Consent",
        content: [
          "RPM eligibility is broader than many providers realize. Any Medicare patient with a chronic or acute condition that requires regular monitoring can qualify. Unlike CCM, RPM does not require two or more chronic conditions.",
        ],
        listItems: [
          "Patient must have a condition requiring remote monitoring (hypertension, diabetes, COPD, heart failure, etc.)",
          "An initial face-to-face or telehealth visit is required to establish the monitoring plan (this can be an existing E&M visit)",
          "Written or verbal consent must be obtained and documented",
          "Devices must be FDA-cleared (not consumer wellness devices)",
          "Data must be automatically transmitted — patient-reported data alone is not sufficient for 99454",
        ],
      },
      {
        heading: "The 16-Day Rule for 99454",
        content: [
          "This is the most commonly misunderstood RPM requirement. To bill 99454, the patient's device must transmit data on at least 16 of 30 calendar days during the billing period.",
          "This means if a patient only transmits blood pressure readings 12 days out of the month, you cannot bill 99454 for that month. Patient engagement and compliance are therefore critical to RPM profitability. Practices with the best RPM programs invest heavily in patient education and proactive outreach when transmission gaps occur.",
        ],
        warning: "The 16-day threshold is non-negotiable. Billing 99454 with fewer than 16 days of data is a compliance risk. Build automated alerts into your workflow to flag patients falling behind mid-month so staff can intervene early.",
      },
      {
        heading: "Device Selection and Setup",
        content: [
          "Choosing the right devices impacts both patient compliance and data quality. The most commonly monitored conditions and their devices include blood pressure cuffs for hypertension, glucometers for diabetes, pulse oximeters for COPD and post-COVID monitoring, and weight scales for heart failure.",
          "Cellular-enabled devices that transmit automatically are strongly preferred over Bluetooth devices, as they require no smartphone and are easier for elderly patients. The device cost is typically included in the 99454 reimbursement — many RPM platform vendors provide devices as part of their service.",
        ],
      },
      {
        heading: "Interactive Communication (99457/99458)",
        content: [
          "These codes require live, interactive communication with the patient or caregiver about their monitoring data. This is not passive data review — it requires actual engagement.",
        ],
        listItems: [
          "Communication can be phone, video, or secure messaging (asynchronous messaging counts if it's interactive)",
          "Must total at least 20 minutes per month for 99457",
          "Each additional 20-minute block qualifies for one unit of 99458",
          "Topics must relate to the monitored data: discussing readings, adjusting treatment plans, medication changes, symptom assessment",
          "Clinical staff under general supervision can perform this time (RN, LPN, MA in many states)",
        ],
      },
      {
        heading: "Building Your RPM Workflow",
        content: [
          "A successful RPM program requires a systematic approach. Start by identifying your highest-volume chronic condition — hypertension is the easiest entry point because blood pressure monitoring is straightforward and patient compliance tends to be high.",
          "Enroll patients during office visits, distribute and set up devices before they leave, and assign a monitoring coordinator to review daily readings and conduct monthly check-ins. Flag abnormal readings for same-day physician review. Bill monthly once all code requirements are met.",
        ],
        tip: "Start with 25-50 patients and one dedicated staff member. Once the workflow is dialed in, scale to 150+ patients per coordinator. Most practices see break-even within the first month of operation.",
      },
      {
        heading: "RPM vs. RTM: Know the Difference",
        content: [
          "CMS also introduced Remote Therapeutic Monitoring (RTM) codes 98975-98981, which cover musculoskeletal conditions, respiratory therapy, and medication adherence. RTM can be billed by a wider range of providers including physical therapists and pharmacists.",
          "RPM and RTM cannot be billed for the same patient in the same month. Choose the program that best fits the patient's primary monitoring need and your practice's specialty focus.",
        ],
      },
    ],
    keyTakeaways: [
      "RPM uses 4 codes (99453, 99454, 99457, 99458) that can stack to $120+/month per patient",
      "99454 requires 16+ days of device data transmission per 30-day period — this is the most common compliance issue",
      "Devices must be FDA-cleared and automatically transmit data",
      "Interactive communication (99457/99458) must involve discussing the patient's monitoring data",
      "Hypertension is the easiest condition to start with — highest patient volume and compliance",
    ],
  },

  "awv-billing-g0438-g0439": {
    title: "Annual Wellness Visit Billing Guide (G0438 & G0439)",
    metaTitle: "AWV Billing Guide: G0438 & G0439 — HRA, Documentation & Revenue Capture",
    metaDescription:
      "Complete guide to Annual Wellness Visit billing. Learn the difference between initial (G0438) and subsequent (G0439) AWVs, HRA requirements, and how to capture $118-175 per visit.",
    icon: Stethoscope,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    category: "Preventive Care",
    readTime: "7 min read",
    revenue: "$118–$175/visit",
    lastUpdated: "February 2026",
    intro: [
      "The Annual Wellness Visit (AWV) is one of the most underutilized preventive services in Medicare. Unlike a traditional annual physical, the AWV is a structured health risk assessment and personalized prevention plan that CMS reimburses at $118-175 per visit — with zero patient copay.",
      "Despite having no cost-sharing for patients and strong reimbursement for providers, national AWV completion rates hover around 50%. For many practices, this means hundreds of eligible patients who could be seen for an AWV each year — generating significant revenue while improving population health outcomes.",
    ],
    sections: [
      {
        heading: "G0438 vs. G0439: Initial and Subsequent AWV",
        content: [
          "Medicare uses two HCPCS codes for AWV billing, depending on whether the patient has had an AWV before.",
        ],
        listItems: [
          "G0438 — Initial Preventive Physical Examination (IPPE) / Welcome to Medicare visit, OR first-ever AWV. Reimbursement: ~$175. Can only be billed once per patient's Medicare lifetime.",
          "G0439 — Subsequent AWV (annual). Reimbursement: ~$119. Billable once per 12-month period after the initial AWV.",
        ],
        tip: "The AWV has ZERO patient cost-sharing — no copay, no deductible. This makes it one of the easiest services to get patients to schedule, since there's no financial barrier.",
      },
      {
        heading: "What the AWV Is (and Isn't)",
        content: [
          "The AWV is NOT a head-to-toe physical exam. It's a structured health risk assessment and personalized prevention planning session. Understanding this distinction is critical for both proper billing and efficient workflow.",
          "The AWV includes a Health Risk Assessment (HRA) questionnaire, review of medical and family history, establishing or updating a list of current providers and medications, height, weight, BMI, blood pressure, cognitive assessment, screening schedule development, and a personalized written prevention plan.",
        ],
        warning: "Do NOT perform a comprehensive physical exam and bill it as an AWV. If you need to do a problem-oriented exam, bill the appropriate E&M code with modifier 25 in addition to the AWV. Combining G0439 + 99214 (with modifier 25) is legitimate when documented properly.",
      },
      {
        heading: "Health Risk Assessment (HRA) Requirements",
        content: [
          "The HRA is the cornerstone of every AWV. CMS requires a structured questionnaire that collects information about the patient's health status, psychosocial risks, and behavioral risks. The HRA must be completed by the patient (or with staff assistance) and reviewed by the provider.",
        ],
        listItems: [
          "Demographic data (age, gender, race/ethnicity)",
          "Self-assessment of health status and function (ADLs/IADLs)",
          "Psychosocial risks (depression screening, social isolation, safety concerns)",
          "Behavioral risks (smoking, alcohol use, physical activity, nutrition, seatbelt use)",
          "List of current medications (including OTC and supplements)",
          "Review of cognitive function (observation-based or validated tool like the Mini-Cog)",
        ],
      },
      {
        heading: "Personalized Prevention Plan",
        content: [
          "After completing the HRA, providers must create a written, individualized prevention plan that includes a screening schedule for the next 5-10 years based on USPSTF recommendations, updated list of risk factors and conditions, a list of treatment recommendations, and referrals to preventive services.",
          "This plan must be provided to the patient in writing. Many practices use templated EHR forms that auto-populate based on HRA responses, making this process efficient and consistent.",
        ],
      },
      {
        heading: "Maximizing AWV Revenue with Add-On Billing",
        content: [
          "The AWV visit is an excellent opportunity to layer additional reimbursable services. When properly documented and medically necessary, several services can be billed alongside the AWV.",
        ],
        listItems: [
          "E&M code (99212-99215) with modifier 25 — when a separate, identifiable problem is addressed during the same visit",
          "Advance Care Planning (99497) — discussing living wills, healthcare proxies, and end-of-life preferences. Adds ~$86",
          "Depression screening (G0444) — if not included in the HRA. Adds ~$19",
          "Alcohol screening and counseling (G0442/G0443) — if clinically indicated",
          "Tobacco cessation counseling (99406/99407) — for current smokers",
        ],
        tip: "AWV + Advance Care Planning (99497) + E&M with modifier 25 can turn a $119 visit into a $300+ encounter — all in a single appointment. Build these into your AWV workflow template.",
      },
      {
        heading: "Efficient AWV Workflow",
        content: [
          "Practices that successfully capture AWV revenue build a systematic workflow. Mail or electronically send the HRA questionnaire 1-2 weeks before the visit so patients arrive with it completed. Have your MA review the HRA, take vitals, and update medication lists before the provider enters.",
          "The provider reviews the HRA, conducts the cognitive assessment, discusses the prevention plan, and addresses any new concerns. A well-designed workflow takes 20-25 minutes per patient. Schedule AWV appointments in dedicated time blocks for maximum efficiency.",
        ],
      },
      {
        heading: "Patient Identification and Outreach",
        content: [
          "The biggest barrier to AWV revenue is simply getting patients scheduled. Run a quarterly report from your EHR identifying Medicare patients who haven't had an AWV in the past 12 months. Use automated appointment reminders, patient portal messages, and proactive phone outreach.",
          "Many practices achieve 70-80% AWV completion rates with proactive outreach. At 400 Medicare patients and 70% completion, that's 280 AWV visits at $119 each — over $33,000 in annual revenue from a single preventive service.",
        ],
      },
    ],
    keyTakeaways: [
      "G0438 (initial AWV) pays ~$175; G0439 (subsequent) pays ~$119 — both with zero patient copay",
      "The AWV is a structured health risk assessment, NOT a physical exam",
      "Health Risk Assessment (HRA) questionnaire must be completed and reviewed",
      "Layer additional services (ACP, depression screening, E&M w/mod 25) to reach $300+ per visit",
      "Most practices have 50%+ of Medicare patients who haven't had an AWV in the past year",
    ],
  },

  "bhi-billing-99484": {
    title: "Behavioral Health Integration Billing (CPT 99484)",
    metaTitle: "BHI Billing Guide: CPT 99484 — Behavioral Health Integration Requirements & Revenue",
    metaDescription:
      "Complete guide to Behavioral Health Integration billing with CPT 99484. Learn the collaborative care model, eligibility criteria, and how to earn $48+ per patient per month.",
    icon: Brain,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    category: "Behavioral Health",
    readTime: "7 min read",
    revenue: "$48+/patient/mo",
    lastUpdated: "February 2026",
    intro: [
      "Behavioral Health Integration (BHI) is the fastest-growing opportunity in Medicare care management. As mental health awareness increases and CMS expands coverage for integrated behavioral health services, practices that implement BHI are capturing significant new revenue while addressing a critical gap in patient care.",
      "CPT 99484 allows primary care and specialty practices to bill for behavioral health care management — even without an in-house psychiatrist. This guide explains the BHI model, billing requirements, and how to build a BHI program that generates sustainable revenue.",
    ],
    sections: [
      {
        heading: "What Is Behavioral Health Integration?",
        content: [
          "BHI is a CMS program that reimburses for care management services provided to patients with behavioral health conditions (depression, anxiety, substance use disorders, etc.) when those conditions are managed in a primary care or specialist setting rather than referred out to mental health providers.",
          "The program recognizes that many patients with behavioral health conditions receive their mental health care — or should receive it — from their primary care provider. BHI creates a billing mechanism for the coordination and management work that was previously uncompensated.",
        ],
      },
      {
        heading: "BHI CPT Codes and Reimbursement",
        content: [
          "BHI billing uses several codes, depending on the care model implemented.",
        ],
        listItems: [
          "99484 — General BHI: 20+ minutes per month of clinical staff time for behavioral health care management. Reimbursement: ~$49/month",
          "99492 — Psychiatric Collaborative Care Model (CoCM): initial 70+ minutes in the first month. Reimbursement: ~$164/month",
          "99493 — Subsequent CoCM: 60+ minutes per month. Reimbursement: ~$130/month",
          "99494 — Additional 30 minutes of CoCM in the same month. Reimbursement: ~$67",
        ],
        tip: "99484 (General BHI) is the easiest code to implement because it doesn't require a consulting psychiatrist. It's the best starting point for most practices. CoCM codes (99492-99494) pay more but require a formal collaborative care team including a behavioral health care manager and a psychiatric consultant.",
      },
      {
        heading: "Patient Eligibility for BHI",
        content: [
          "BHI eligibility is straightforward. Patients must have a diagnosed behavioral health condition that requires ongoing care management.",
        ],
        listItems: [
          "Diagnosed behavioral health condition: depression, anxiety, PTSD, bipolar disorder, substance use disorder, ADHD, eating disorders, etc.",
          "Condition is being actively treated or managed by the billing provider",
          "Patient consent must be obtained and documented",
          "Only one provider can bill BHI per patient per month",
          "Patient does NOT need to have other chronic conditions (unlike CCM)",
        ],
        warning: "BHI and CCM can technically be billed for the same patient, but the time used for BHI activities cannot double-count toward CCM time. Keep separate time logs for each program.",
      },
      {
        heading: "Qualifying Activities for 99484",
        content: [
          "To bill 99484, clinical staff must spend at least 20 minutes per month on behavioral health care management activities. These activities must be directly related to the patient's behavioral health condition.",
        ],
        listItems: [
          "Systematic assessment using validated tools (PHQ-9 for depression, GAD-7 for anxiety)",
          "Care plan development and revision for behavioral health conditions",
          "Patient outreach and engagement (phone calls, portal messages about mental health)",
          "Medication monitoring and side effect assessment",
          "Coordination with therapists, social workers, or psychiatrists",
          "Crisis intervention planning and safety assessments",
          "Facilitating referrals to community behavioral health resources",
        ],
      },
      {
        heading: "Screening: The Gateway to BHI Revenue",
        content: [
          "Universal behavioral health screening is the key to identifying BHI-eligible patients at scale. Implementing the PHQ-2/PHQ-9 for depression and GAD-7 for anxiety as standard intake questionnaires ensures you're catching patients who qualify.",
          "In a typical primary care panel, 20-30% of patients screen positive for depression or anxiety. Many of these patients are already being managed informally — BHI simply creates a billing structure for that work. Start by screening all Medicare patients at every annual wellness visit and problem-focused visits.",
        ],
      },
      {
        heading: "Building a BHI Program",
        content: [
          "Start with 99484 (General BHI) since it has the lowest implementation barrier. Identify a care coordinator (RN, LCSW, or trained MA) to manage your BHI patient panel. This person conducts monthly outreach, administers screening tools, updates care plans, and coordinates with the supervising provider.",
          "Establish a workflow where positive screens trigger automatic BHI enrollment conversations. Create standardized care plan templates in your EHR for common conditions. Track time meticulously using the same tools you'd use for CCM. Review population health metrics monthly to measure outcomes.",
        ],
        tip: "BHI pairs exceptionally well with CCM. Many patients with chronic conditions also have depression or anxiety. A patient enrolled in both CCM and BHI can generate $115+ per month — just ensure time is tracked separately for each program.",
      },
      {
        heading: "The Collaborative Care Model (CoCM) — Advanced",
        content: [
          "Once your BHI program is established, consider upgrading to the Collaborative Care Model for higher reimbursement. CoCM requires three team members: the billing provider (PCP), a behavioral health care manager (LCSW, RN, or psychologist), and a consulting psychiatrist who reviews cases weekly.",
          "CoCM pays significantly more ($130-164/month vs $49 for general BHI) but requires the psychiatric consultant relationship. Many practices contract with tele-psychiatry services to meet this requirement cost-effectively.",
        ],
      },
    ],
    keyTakeaways: [
      "99484 (General BHI) pays ~$49/month for 20+ minutes of behavioral health care management",
      "No consulting psychiatrist needed for 99484 — making it easy to implement",
      "Universal PHQ-9/GAD-7 screening identifies eligible patients at scale",
      "20-30% of primary care Medicare patients screen positive for depression or anxiety",
      "BHI can be combined with CCM for the same patient (track time separately)",
    ],
  },

  "em-coding-optimization": {
    title: "E&M Coding Optimization — 99213 vs 99214 vs 99215",
    metaTitle: "E&M Coding Guide: 99213 vs 99214 vs 99215 — MDM Levels & Revenue Optimization",
    metaDescription:
      "Stop undercoding E&M visits. Learn the 2021 MDM-based guidelines, the difference between 99213/99214/99215, documentation strategies, and how to capture $15K-40K more per year.",
    icon: TrendingUp,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    category: "Coding & Compliance",
    readTime: "10 min read",
    revenue: "$15K–$40K/yr uplift",
    lastUpdated: "February 2026",
    intro: [
      "Evaluation and Management (E&M) coding is the backbone of medical practice revenue — and it's where most practices leave the most money on the table. Studies consistently show that 30-50% of office visits are undercoded, with providers defaulting to 99213 when their documentation supports 99214 or even 99215.",
      "The 2021 E&M guideline changes eliminated the history and exam requirements for code selection, basing it entirely on Medical Decision Making (MDM) or total time. This was a game-changer for practices willing to adapt their documentation habits. This guide breaks down the new framework and shows you exactly how to optimize your coding without any compliance risk.",
    ],
    sections: [
      {
        heading: "The 2021 E&M Revolution",
        content: [
          "Before 2021, E&M level selection required providers to document specific elements of history (HPI, ROS, PFSH) and physical exam (body systems and areas). This led to template-driven documentation bloat and frequent undercoding because providers couldn't remember which exam bullet points were needed.",
          "The current guidelines eliminated these requirements entirely. Now, E&M level is determined by either the level of Medical Decision Making (MDM) or total time spent on the encounter (including non-face-to-face time on the date of service). Most practices use MDM as the primary method.",
        ],
      },
      {
        heading: "Medical Decision Making: The Three Elements",
        content: [
          "MDM is evaluated across three elements. You need to meet or exceed the threshold for at least two of the three elements to qualify for a given code level.",
        ],
        listItems: [
          "Number and complexity of problems addressed — how many problems you're managing and how complex they are (self-limited, chronic stable, chronic worsening, new problem with workup, etc.)",
          "Amount and complexity of data reviewed — labs, imaging, external records, discussions with other providers, independent interpretation of tests",
          "Risk of complications, morbidity, or mortality — prescription drug management, decisions about surgery, hospitalization risk, etc.",
        ],
      },
      {
        heading: "99213 vs 99214: Where the Money Lives",
        content: [
          "The gap between 99213 ($92) and 99214 ($130) is about $38 per visit. For a provider seeing 20 patients per day, shifting just 3 visits per day from 99213 to 99214 (where documentation supports it) adds over $28,000 per year.",
        ],
        listItems: [
          "99213 (Low MDM) — 1-2 self-limited or minor problems; minimal data review; low risk (OTC drugs, minor surgery with no risk factors)",
          "99214 (Moderate MDM) — 1+ chronic conditions with mild exacerbation, or 2+ chronic stable conditions, or new problem requiring additional workup; moderate data (ordering/reviewing tests, reviewing external records); moderate risk (prescription drug management, decisions about minor surgery with risk factors)",
          "99215 (High MDM) — 1+ chronic conditions with severe exacerbation, or 1+ acute/chronic condition posing threat to life/function; extensive data (independent interpretation, discussion with external physician); high risk (drug therapy requiring intensive monitoring, decisions about hospitalization, DNR decisions)",
        ],
        tip: "The single biggest trigger for 99214 is \"prescription drug management.\" If you're prescribing, adjusting, or continuing any prescription medication during a visit, you've met the Risk element for moderate MDM. Combined with 2+ stable chronic conditions (Problems element), that's 99214.",
      },
      {
        heading: "Time-Based Coding",
        content: [
          "Since 2021, you can select E&M level based on total time spent on the date of encounter. This includes face-to-face time, chart review, ordering, care coordination, and documentation — all on the date of service.",
        ],
        listItems: [
          "99213 — 20-29 minutes total time",
          "99214 — 30-39 minutes total time",
          "99215 — 40-54 minutes total time",
          "99417 (prolonged services) — each additional 15 minutes beyond 99215 threshold",
        ],
        warning: "Time-based coding requires you to document the total time and a brief description of activities. It does NOT require start/stop times, but you must note the total minutes. Time-based coding is especially useful for complex visits where MDM may be low but the visit legitimately took 30+ minutes.",
      },
      {
        heading: "Documentation Strategies That Support Higher Coding",
        content: [
          "Better coding starts with better documentation habits. The goal isn't to upcode — it's to accurately capture the complexity of the care you're already providing.",
        ],
        listItems: [
          "Document every problem addressed, not just the chief complaint. If you refill a blood pressure medication, adjust diabetes management, and discuss an anxiety concern — that's 3 problems, not 1",
          "Explicitly state when you review labs, imaging, or external records. A simple note like \"Reviewed 12/15 CMP — creatinine stable at 1.2\" satisfies the data element",
          "Document your decision-making rationale. \"Continuing metoprolol for rate control, monitoring for bradycardia\" demonstrates prescription drug management and risk",
          "Use assessment and plan sections that mirror the number of problems. If you addressed 4 problems, your A&P should have 4 distinct items",
          "Record total time when it supports a higher code than MDM alone",
        ],
      },
      {
        heading: "Common Undercoding Patterns",
        content: [
          "After analyzing millions of Medicare claims, clear undercoding patterns emerge across specialties. Understanding these patterns helps identify where your practice may be leaving revenue behind.",
        ],
        listItems: [
          "The \"99213 default\" — providers reflexively select 99213 for all follow-up visits regardless of complexity. This is the single largest revenue leak.",
          "Ignoring data review — reviewing a specialist's note, hospital discharge summary, or outside imaging counts toward MDM but is often undocumented",
          "Single-problem thinking — documenting only the primary complaint even when multiple problems were managed during the visit",
          "Fear of audit — providers undercode as a \"safety margin\" against audits. Modern audit standards under the 2021 guidelines actually make higher coding easier to defend",
          "Not using time-based coding — for visits that are legitimately time-intensive but have straightforward MDM",
        ],
      },
      {
        heading: "Audit-Proof Your Documentation",
        content: [
          "The best defense against audits is clean, specific documentation that clearly supports the code selected. Under the 2021 guidelines, auditors look at MDM elements (problems, data, risk) or documented time — not history and exam requirements.",
          "Focus your documentation on the assessment and plan. Each problem should have a clear assessment (what's happening) and plan (what you're doing about it). Include the rationale for your decisions. If you reviewed data, say what you reviewed and what it showed. If there's risk, identify it specifically.",
        ],
        tip: "Do a quarterly self-audit: pull 10 random charts and re-evaluate the E&M level. If you find that your documentation consistently supports a higher code than what was billed, you have a coding optimization opportunity. Many practices find 15-25% of their 99213 visits should have been 99214.",
      },
    ],
    keyTakeaways: [
      "2021 guidelines base E&M level on MDM or time — not history/exam requirements",
      "The 99213→99214 gap ($38/visit) is the biggest revenue opportunity for most practices",
      "Prescription drug management automatically meets the \"Risk\" element for 99214",
      "Document every problem addressed, all data reviewed, and your clinical reasoning",
      "Quarterly self-audits identify undercoding patterns — most practices find 15-25% uplift potential",
    ],
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
  const guide = GUIDES[slug];
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: {
      canonical: `https://npixray.com/guides/${slug}`,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      type: "article",
    },
  };
}

export function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

// ────────────────────────────────────────────────────────────
// Page component
// ────────────────────────────────────────────────────────────

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = GUIDES[slug];
  if (!guide) notFound();

  const Icon = guide.icon;

  // Structured data for Google AI Overviews
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    url: `https://npixray.com/guides/${slug}`,
    author: {
      "@type": "Organization",
      name: "NPIxray",
      url: "https://npixray.com",
    },
    publisher: {
      "@type": "Organization",
      name: "NPIxray",
      url: "https://npixray.com",
      logo: {
        "@type": "ImageObject",
        url: "https://npixray.com/og-image.png",
      },
    },
    datePublished: "2025-01-01",
    dateModified: "2026-02-01",
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.metaDescription,
    step: guide.sections.map((section, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: section.heading,
      text: section.content.join(" "),
    })),
  };

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <TrackPageView event="guide_viewed" label={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [articleJsonLd, howToJsonLd],
          }),
        }}
      />
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Guides
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${guide.bgColor} ${guide.color} uppercase tracking-wider`}
          >
            {guide.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)]">
            <Clock className="h-3 w-3" />
            {guide.readTime}
          </span>
          <span className="text-[11px] text-[var(--text-secondary)]">
            Updated {guide.lastUpdated}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
          {guide.title}
        </h1>

        <div className="flex items-center gap-3 rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-3">
          <DollarSign className="h-5 w-5 text-[#2F5EA8] flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#2F5EA8]">
              Revenue Opportunity: {guide.revenue}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Per eligible patient based on national Medicare rates
            </p>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div className="prose-section mb-10">
        {guide.intro.map((paragraph, i) => (
          <p
            key={i}
            className="text-[var(--text-secondary)] leading-relaxed mb-4 last:mb-0"
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Table of Contents */}
      <nav className="rounded-xl border border-[var(--border-light)] bg-white p-6 mb-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#2F5EA8] mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          In This Guide
        </h2>
        <ol className="space-y-2">
          {guide.sections.map((section, i) => (
            <li key={i}>
              <a
                href={`#section-${i}`}
                className="text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors flex items-center gap-2"
              >
                <span className="text-[#4FA3D1] font-mono text-xs w-5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Sections */}
      <div className="space-y-10">
        {guide.sections.map((section, i) => (
          <section key={i} id={`section-${i}`}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 scroll-mt-24">
              {section.heading}
            </h2>

            {section.content.map((paragraph, j) => (
              <p
                key={j}
                className="text-[var(--text-secondary)] leading-relaxed mb-4"
              >
                {paragraph}
              </p>
            ))}

            {section.listItems && (
              <ul className="space-y-3 mb-4">
                {section.listItems.map((item, j) => (
                  <li key={j} className="flex gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--text-secondary)] leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {section.tip && (
              <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-4 my-4">
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold text-[#2F5EA8]">💡 Pro Tip: </span>
                  <span className="text-[var(--text-secondary)]">
                    {section.tip}
                  </span>
                </p>
              </div>
            )}

            {section.warning && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 my-4">
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold text-red-400 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Common Pitfall
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    {section.warning}
                  </span>
                </p>
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Key Takeaways */}
      <div className="mt-12 rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6 sm:p-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-[#2F5EA8]" />
          Key Takeaways
        </h2>
        <ul className="space-y-3">
          {guide.keyTakeaways.map((takeaway, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-[#2F5EA8] font-mono font-bold mt-0.5 flex-shrink-0">
                {i + 1}.
              </span>
              <span className="text-[var(--text-secondary)] leading-relaxed">
                {takeaway}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-2xl border border-[var(--border-light)] bg-white p-8 sm:p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10 mx-auto mb-5">
          <Icon className={`h-7 w-7 ${guide.color}`} />
        </div>
        <h3 className="text-xl font-bold mb-3">
          See How Much Revenue You&apos;re Missing
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md mx-auto leading-relaxed">
          Run a free NPI scan to get a personalized revenue analysis showing
          your specific gaps in coding, CCM, RPM, BHI, and AWV — based on real
          CMS Medicare data.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F5EA8] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/10"
        >
          <Zap className="h-4 w-4" />
          Scan Your NPI — Free
        </Link>
      </div>

      {/* Related Links */}
      <div className="mt-12">
        <RelatedLinks pageType="guide" currentSlug={slug} />
      </div>
    </article>
  );
}
