import type { AnswerData } from "./data";

// Slugs 1-5: Medicare Billing (first half)
export const ANSWERS_1: Record<string, AnswerData> = {
  "what-is-npi-number": {
    question: "What Is an NPI Number?",
    metaTitle: "What Is an NPI Number? — Definition, Types & How to Find Yours",
    metaDescription:
      "An NPI (National Provider Identifier) is a unique 10-digit number assigned to every healthcare provider in the U.S. Learn what it is, the two types, and how to look one up instantly.",
    category: "Medicare Billing",
    answer:
      "An NPI (National Provider Identifier) is a unique, 10-digit identification number issued by CMS (Centers for Medicare & Medicaid Services) to every healthcare provider in the United States. Required by HIPAA since May 2007, the NPI is used in all electronic healthcare transactions — billing claims, eligibility checks, referrals, and prescriptions. There are two types: Type 1 NPI for individual providers (physicians, nurses, therapists) and Type 2 NPI for organizations (group practices, hospitals, clinics). Unlike older identifiers such as UPIN or Medicare PIN, the NPI is permanent, never expires, and stays with a provider even if they change states, specialties, or employers. As of 2026, there are over 8.2 million active NPI numbers in the NPPES database. Source: NPIxray analysis of 1.175M Medicare providers and 8.15M billing records.",
    sections: [
      {
        heading: "NPI Number Basics",
        content:
          "The National Provider Identifier was established under the Health Insurance Portability and Accountability Act (HIPAA) Administrative Simplification provisions. Before the NPI, providers juggled multiple identifiers — one for Medicare, another for Medicaid, and different numbers for each commercial payer. The NPI replaced all of those with a single, universal identifier.\n\nEvery covered healthcare provider must have an NPI, whether they are a solo practitioner, part of a large hospital system, or a non-physician provider such as a nurse practitioner, physical therapist, or psychologist. Even providers who do not bill Medicare directly need an NPI if they transmit any electronic health transactions.",
      },
      {
        heading: "Type 1 vs. Type 2 NPI Numbers",
        content:
          "Type 1 NPI is assigned to individual providers — any single person who delivers healthcare services. This includes physicians (MD/DO), nurse practitioners, physician assistants, dentists, chiropractors, physical therapists, psychologists, social workers, and many other provider types. A Type 1 NPI is tied to the individual, not their employer or practice location.\n\nType 2 NPI is assigned to organization providers — group practices, hospitals, home health agencies, nursing facilities, pharmacies, laboratories, and other entities that provide healthcare services. A solo practitioner who has incorporated their practice may have both a Type 1 (individual) and Type 2 (organization) NPI.\n\nUnderstanding the distinction matters for billing. Claims typically require both the rendering provider's Type 1 NPI and the billing entity's Type 2 NPI (if applicable). Incorrect NPI usage is a leading cause of claim denials.",
      },
      {
        heading: "How to Get an NPI Number",
        content:
          "Providers apply for an NPI through the National Plan and Provider Enumeration System (NPPES), operated by CMS. The application can be completed online at nppes.cms.hhs.gov, by mail using the CMS-10114 form, or through an Electronic File Interchange Organization (EFIO) that submits bulk applications.\n\nThe online application takes approximately 15-20 minutes. Required information includes the provider's legal name, date of birth, Social Security Number (for Type 1), Employer Identification Number (for Type 2), taxonomy code (specialty classification), practice address, and contact information. There is no fee to apply, and NPIs are typically issued within 1-5 business days for online applications.\n\nOnce issued, the NPI must be shared with all payers, clearinghouses, and billing entities the provider works with. Most credentialing and enrollment processes now revolve around the NPI as the primary identifier.",
      },
      {
        heading: "How to Look Up an NPI Number",
        content:
          "There are several free ways to look up an NPI number. The official NPPES NPI Registry at npiregistry.cms.hhs.gov allows searches by name, NPI number, specialty, or location. NPIxray provides enhanced NPI lookup with Medicare billing data — enter any NPI to see not just the provider's basic information, but their actual billing patterns, revenue benchmarks, and missed revenue opportunities based on CMS public data.\n\nNPIxray's database covers 1,175,281 Medicare providers with 8.15 million billing records. When you look up an NPI on NPIxray, you get the standard directory information plus a complete revenue analysis showing how the provider's billing compares to specialty benchmarks. This is especially valuable for practice managers evaluating coding patterns and revenue opportunities.",
      },
      {
        heading: "Why Your NPI Number Matters for Revenue",
        content:
          "Your NPI is the key that unlocks your entire Medicare billing history in the CMS public dataset. Every claim you submit is linked to your NPI, which means tools like NPIxray can analyze your billing patterns — which CPT codes you bill, how frequently, and how your payments compare to peers in your specialty and state.\n\nThis transparency creates both an opportunity and a responsibility. Practices that proactively analyze their NPI-linked data can identify undercoding patterns (e.g., billing 99213 when 99214 is supported), missed care management revenue (CCM, RPM, BHI), and low AWV completion rates. Our analysis shows the average primary care provider is missing $42,000-$67,000 per year in capturable Medicare revenue — and it all starts with understanding what your NPI data reveals.",
      },
    ],
    tableOfContents: [
      "NPI Number Basics",
      "Type 1 vs. Type 2 NPI Numbers",
      "How to Get an NPI Number",
      "How to Look Up an NPI Number",
      "Why Your NPI Number Matters for Revenue",
    ],
    relatedQuestions: [
      { slug: "how-to-lookup-npi-number", question: "How to Look Up an NPI Number" },
      { slug: "npi-number-search-by-name", question: "NPI Number Search by Name" },
      { slug: "free-npi-lookup-tool", question: "Free NPI Lookup Tool" },
      { slug: "npi-registry-vs-npixray", question: "NPI Registry vs. NPIxray" },
    ],
    dataPoints: [
      "8.2M+ active NPI numbers in the NPPES database",
      "1,175,281 Medicare providers analyzed by NPIxray",
      "8.15M billing records in the NPIxray database",
      "NPI has been required since May 2007 (19 years)",
    ],
    faqs: [
      {
        question: "Does an NPI number expire?",
        answer:
          "No. An NPI is permanent and never expires. It stays with the provider for their entire career, regardless of changes in state, specialty, employer, or practice setting. However, providers must update their NPPES record within 30 days of any changes to their practice information.",
      },
      {
        question: "Can a provider have more than one NPI?",
        answer:
          "An individual provider receives only one Type 1 NPI for life. However, if they also operate a group practice or organization, that entity would have its own separate Type 2 NPI. A provider can be associated with multiple Type 2 NPIs (multiple organizations) but will always have just one Type 1 NPI.",
      },
      {
        question: "Is an NPI number the same as a DEA number?",
        answer:
          "No. The NPI is for healthcare transaction identification. The DEA number is issued by the Drug Enforcement Administration and is required to prescribe controlled substances. They serve different purposes and are issued by different agencies. A provider typically needs both if they prescribe controlled substances.",
      },
    ],
  },

  "how-to-bill-ccm-99490": {
    question: "How to Bill CCM (CPT 99490)?",
    metaTitle: "How to Bill CCM 99490 — Step-by-Step Medicare Billing Guide",
    metaDescription:
      "Learn exactly how to bill Chronic Care Management CPT 99490. Covers patient eligibility, consent, time tracking, documentation, and reimbursement rates for 2026.",
    category: "Medicare Billing",
    answer:
      "To bill CCM (CPT 99490), you need a Medicare patient with two or more chronic conditions expected to last at least 12 months, documented patient consent, a comprehensive care plan, and at least 20 minutes of non-face-to-face clinical staff time per calendar month. The 2026 national reimbursement for 99490 is approximately $66 per patient per month. Add-on code 99439 pays an additional $47 for each extra 20-minute increment (up to 2 additional units), and complex CCM (99491) pays $94 for 30 minutes of physician time. A practice with 100 enrolled CCM patients billing 99490 alone generates $79,200 per year; with add-on codes, that figure can exceed $150,000. Despite this, NPIxray analysis of 1.175M Medicare providers shows only 12.4% of eligible primary care practices currently bill any CCM code. Source: NPIxray analysis of 1.175M Medicare providers and 8.15M billing records.",
    sections: [
      {
        heading: "Step 1: Identify Eligible Patients",
        content:
          "The first step in billing CCM is identifying patients who qualify. CMS requires that the patient have two or more chronic conditions expected to last at least 12 months (or until the patient's death) and that place the patient at significant risk of death, acute exacerbation, or functional decline.\n\nCommon qualifying condition pairs include hypertension with diabetes, COPD with heart failure, diabetes with chronic kidney disease, depression with any chronic condition, and arthritis with cardiovascular disease. Run a query in your EHR for Medicare patients with 2+ chronic conditions on their active problem list. In a typical primary care panel of 400 Medicare patients, 40-60% (160-240 patients) will meet the clinical criteria.",
      },
      {
        heading: "Step 2: Obtain and Document Consent",
        content:
          "Before billing CCM, you must obtain patient consent and document it in the medical record. The consent must include: an explanation of CCM services, notification that only one provider can bill CCM per month for that patient, information about applicable cost-sharing (approximately 20% coinsurance), and the patient's right to revoke consent at any time.\n\nConsent can be obtained verbally (including by telephone) or in writing. Document the date consent was obtained, who obtained it, and that all required elements were discussed. This is the number one reason for CCM claim denials — missing or incomplete consent documentation. Many practices use a standardized consent form template to ensure consistency.",
      },
      {
        heading: "Step 3: Create the Care Plan",
        content:
          "CMS requires a comprehensive, patient-centered care plan that is established, implemented, revised, or monitored during the billing period. The care plan must include: the patient's chronic conditions and current status, expected outcomes and prognosis, measurable treatment goals, symptom management, planned interventions and responsible parties, medication management, and coordination with outside providers.\n\nThe care plan must be available electronically to all care team members and must be updated at least once during each billing period. Many EHR systems have CCM care plan templates that streamline this process. The care plan does not need to be re-created from scratch each month — updating and reviewing the existing plan satisfies the requirement.",
      },
      {
        heading: "Step 4: Track Your Time (20-Minute Minimum)",
        content:
          "For 99490, you must document at least 20 minutes of non-face-to-face clinical staff time per calendar month. Qualifying activities include: care plan review and updates, medication reconciliation, coordination with specialists and other providers, patient or caregiver outreach (phone calls, portal messages), lab result follow-up and communication, referral management, and health education.\n\nActivities that do NOT count toward CCM time: scheduling appointments, billing and administrative tasks, travel time, and time spent on services billed separately (such as RPM monitoring). Time must be tracked with either start/stop times or cumulative time logs. The time resets on the first of each calendar month — you cannot carry over unused time.",
      },
      {
        heading: "Step 5: Bill Monthly After Meeting the Threshold",
        content:
          "Submit the claim at the end of each calendar month once the 20-minute threshold is met. Bill 99490 with the date of service as the last day of the month (or the last day services were provided). The rendering provider on the claim should be the supervising physician or qualified healthcare professional, even if clinical staff performed the actual CCM activities under general supervision.\n\nFor additional time beyond the first 20 minutes, bill 99439 for each additional 20-minute increment (maximum 2 units per month). If the physician personally performed 30+ minutes of complex CCM work, consider billing 99491 instead. These codes cannot be combined for the same patient in the same month — choose the code set that maximizes appropriate reimbursement.",
      },
      {
        heading: "Common CCM Billing Mistakes",
        content:
          "The most frequent CCM billing errors include: failing to document consent before the first billing month, not meeting the 20-minute minimum (billing at 15 or 18 minutes), forgetting to bill add-on code 99439 when staff spent 40+ minutes, billing CCM during months when the patient was hospitalized for a significant portion, not updating the care plan within the billing period, and overlapping CCM time with RPM or BHI time for the same patient.\n\nAnother critical mistake is not billing CCM at all. Our data shows that only 12.4% of eligible primary care practices bill any CCM code, despite having large populations of qualifying patients. The average eligible practice has 150+ patients who meet criteria. At $66 per patient per month, that represents over $118,800 in annual revenue that most practices are not capturing.",
      },
    ],
    tableOfContents: [
      "Step 1: Identify Eligible Patients",
      "Step 2: Obtain and Document Consent",
      "Step 3: Create the Care Plan",
      "Step 4: Track Your Time (20-Minute Minimum)",
      "Step 5: Bill Monthly After Meeting the Threshold",
      "Common CCM Billing Mistakes",
    ],
    relatedQuestions: [
      { slug: "how-much-does-ccm-pay", question: "How Much Does CCM Pay?" },
      { slug: "ccm-vs-rpm-revenue", question: "CCM vs. RPM Revenue Comparison" },
      { slug: "ccm-patient-requirements", question: "CCM Patient Requirements" },
      { slug: "ccm-consent-requirements", question: "CCM Consent Requirements" },
    ],
    dataPoints: [
      "Only 12.4% of eligible primary care practices bill CCM",
      "Average primary care panel has 150+ CCM-eligible patients",
      "99490 reimburses ~$66/month per patient in 2026",
      "100 CCM patients = $79,200+ annual revenue",
    ],
    faqs: [
      {
        question: "Can clinical staff bill CCM or does it have to be the physician?",
        answer:
          "Clinical staff (RNs, LPNs, MAs) can perform CCM activities under general supervision of the billing physician. The physician does not need to personally provide the 20 minutes of service. However, the claim is submitted under the supervising physician's NPI.",
      },
      {
        question: "Can you bill CCM and an office visit in the same month?",
        answer:
          "Yes. CCM is billed for non-face-to-face care coordination activities. If the patient also has an in-person E&M visit during the same month, both can be billed. However, time spent during the face-to-face encounter cannot count toward the CCM 20-minute requirement.",
      },
      {
        question: "Does the patient have a copay for CCM?",
        answer:
          "Yes. Medicare patients are responsible for approximately 20% coinsurance on CCM services, which works out to roughly $13 per month for 99490. Patients must be informed of this cost-sharing obligation as part of the consent process. Some practices have found that waiving the copay (where legally permissible) increases enrollment.",
      },
    ],
  },

  "how-to-start-rpm-program": {
    question: "How to Start an RPM Program?",
    metaTitle: "How to Start an RPM Program — Complete Implementation Guide 2026",
    metaDescription:
      "Step-by-step guide to launching a Remote Patient Monitoring program. Covers device selection, patient enrollment, billing codes 99453-99458, and scaling to profitability.",
    category: "Medicare Billing",
    answer:
      "To start an RPM (Remote Patient Monitoring) program, you need five components: FDA-cleared monitoring devices that automatically transmit data, a patient population with chronic conditions requiring monitoring, a clinical workflow for reviewing data and conducting monthly patient interactions, staff dedicated to monitoring and outreach, and a billing system to capture CPT codes 99453 (device setup, ~$19 one-time), 99454 (device supply/data transmission, ~$56/month), 99457 (first 20 minutes interactive communication, ~$49/month), and 99458 (additional 20 minutes, ~$39/month). A fully-enrolled RPM patient generates $125-163 per month. NPIxray analysis shows only 8.7% of eligible Medicare providers currently bill RPM codes, making this one of the largest untapped revenue streams in outpatient medicine. Start with hypertension monitoring (blood pressure cuffs) for 25-50 patients, as it offers the highest compliance rates and simplest workflow. Source: NPIxray analysis of 1.175M Medicare providers and 8.15M billing records.",
    sections: [
      {
        heading: "Choose Your Clinical Focus",
        content:
          "The most successful RPM programs start with a single condition and expand from there. Hypertension is the recommended starting point because blood pressure monitoring devices are inexpensive and reliable, patient compliance is highest (the measurement takes 60 seconds), hypertension is the most prevalent chronic condition in Medicare patients, and clinical protocols for BP management are well-established.\n\nOther strong RPM candidates include diabetes (glucose monitoring), heart failure (weight monitoring), COPD (pulse oximetry), and post-surgical recovery. Each condition requires different devices and clinical protocols. Starting with one condition allows you to perfect your workflow before expanding.",
      },
      {
        heading: "Select Your Device and Platform",
        content:
          "RPM devices must be FDA-cleared (not consumer wellness devices like Fitbit or Apple Watch). For billing 99454, devices must automatically transmit data — patient-reported readings alone are insufficient. Cellular-enabled devices are strongly preferred because they transmit automatically without requiring a smartphone or Bluetooth pairing, which significantly improves compliance in elderly Medicare populations.\n\nYou have two main options: purchase devices independently and use your own EHR for data management, or partner with an RPM platform vendor that provides devices, a monitoring dashboard, and billing support as a bundled service. Most practices starting out choose a platform vendor because it reduces the technical and operational complexity. Typical platform costs range from $30-60 per patient per month, which is easily covered by the $125+ in monthly RPM reimbursement.",
      },
      {
        heading: "Enroll Your First 25-50 Patients",
        content:
          "Start with a manageable cohort of 25-50 patients. Identify candidates from your existing patient panel — look for Medicare patients with the chronic condition you selected who are engaged in their care and likely to be compliant with daily monitoring. Enroll patients during office visits: explain the program, obtain consent, provide the device, and demonstrate its use.\n\nThe device setup and education visit is billable under 99453 (~$19). This is a one-time code per episode of care. Ensure you document the setup, education provided, and the patient's understanding of how to use the device. Many practices combine this with a regular E&M visit, billing both the office visit and 99453.",
      },
      {
        heading: "Establish Your Monitoring Workflow",
        content:
          "Assign a dedicated staff member (RN, LPN, or trained MA) to serve as your RPM coordinator. This person reviews incoming device data daily, identifies abnormal readings that require clinical intervention, conducts monthly patient check-in calls (required for 99457/99458), and tracks compliance with the 16-day transmission requirement for 99454.\n\nThe critical billing threshold for 99454 is 16 days of data transmission per 30-day period. Build automated alerts into your workflow to flag patients who are falling behind on daily readings by day 10. Proactive outreach at this point — a simple reminder call or text — dramatically improves compliance rates and ensures you can bill 99454.",
      },
      {
        heading: "Bill the Full RPM Code Stack",
        content:
          "Maximize revenue by billing all applicable codes each month. In month one, bill 99453 (setup) + 99454 (data transmission) + 99457 (first 20 min interaction) + 99458 (additional 20 min) for approximately $163. In subsequent months, bill 99454 + 99457 + 99458 for approximately $144/month per patient.\n\nThe interactive communication codes (99457/99458) require live engagement with the patient or caregiver about their monitoring data. This can be phone, video, or interactive secure messaging. Document the time spent, the data discussed, and any clinical decisions made. One coordinator can manage 100-150 RPM patients, generating $150,000-215,000 in annual revenue per coordinator FTE.",
      },
      {
        heading: "Scale to Profitability",
        content:
          "With your first cohort running smoothly, expand systematically. Add new patients during every relevant office visit. Expand to additional conditions (add diabetes monitoring once BP is established). Consider hiring a second coordinator once you reach 100 patients.\n\nThe economics are compelling: at 150 patients billing the full RPM stack ($144/month ongoing), your annual RPM revenue is $259,200. After deducting a coordinator salary ($55,000-65,000), device/platform costs ($54,000-108,000 at $30-60/patient/month), and overhead, the net profit is $86,000-150,000 per year — from a program that also improves clinical outcomes and patient satisfaction.",
      },
    ],
    tableOfContents: [
      "Choose Your Clinical Focus",
      "Select Your Device and Platform",
      "Enroll Your First 25-50 Patients",
      "Establish Your Monitoring Workflow",
      "Bill the Full RPM Code Stack",
      "Scale to Profitability",
    ],
    relatedQuestions: [
      { slug: "rpm-device-requirements", question: "RPM Device Requirements" },
      { slug: "rpm-cpt-codes", question: "RPM CPT Codes Explained" },
      { slug: "ccm-vs-rpm-revenue", question: "CCM vs. RPM Revenue" },
      { slug: "rpm-20-minutes-requirement", question: "RPM 20-Minutes Requirement" },
    ],
    dataPoints: [
      "Only 8.7% of eligible providers bill RPM codes",
      "Full RPM code stack generates $144/month per patient (ongoing)",
      "One coordinator manages 100-150 RPM patients",
      "Net profit potential: $86K-$150K/year per coordinator",
    ],
    faqs: [
      {
        question: "How much does it cost to start an RPM program?",
        answer:
          "Startup costs vary based on your approach. Using an RPM platform vendor typically costs $30-60 per patient per month (devices included), with minimal upfront investment. Purchasing devices independently costs $50-150 per device upfront. Most practices reach profitability within the first month of billing because the per-patient reimbursement ($125-163/month) exceeds costs from day one.",
      },
      {
        question: "Can you bill RPM and CCM for the same patient?",
        answer:
          "Yes. RPM and CCM can be billed for the same patient in the same month, as long as the time is tracked separately and not double-counted. A patient enrolled in both programs can generate $190+ per month. However, RPM time cannot count toward CCM's 20-minute requirement and vice versa.",
      },
      {
        question: "What is the 16-day rule for RPM?",
        answer:
          "To bill 99454 (device supply/data transmission), the patient's device must transmit data on at least 16 of 30 calendar days in the billing period. This is a strict requirement — transmitting on only 15 days means you cannot bill 99454 for that month. Proactive patient outreach when transmission gaps occur is essential.",
      },
    ],
  },

  "awv-vs-regular-checkup": {
    question: "AWV vs. Regular Checkup: What's the Difference?",
    metaTitle: "AWV vs. Regular Checkup — Key Differences in Medicare Visits",
    metaDescription:
      "Understand the difference between a Medicare Annual Wellness Visit (AWV) and a regular checkup. Learn what each covers, costs, billing codes, and how to maximize both.",
    category: "Medicare Billing",
    answer:
      "The Annual Wellness Visit (AWV) and a regular checkup (routine physical or problem-focused E&M visit) are fundamentally different services with different purposes, billing codes, and patient cost-sharing. An AWV (G0438 initial/$175, G0439 subsequent/$119) is a structured health risk assessment and prevention planning session with zero patient copay. A regular checkup or office visit (99213/$92, 99214/$130, 99215/$184) is a problem-oriented evaluation and management encounter with standard copay and deductible. The AWV is NOT a head-to-toe physical exam — it focuses on screening, prevention planning, and health risk assessment using a standardized questionnaire (HRA). NPIxray analysis shows only 48.2% of eligible Medicare patients receive an AWV each year, meaning over half of your Medicare panel is missing this free preventive service — and you are missing $119-175 per uncompleted visit. Source: NPIxray analysis of 1.175M Medicare providers and 8.15M billing records.",
    sections: [
      {
        heading: "What Is an Annual Wellness Visit (AWV)?",
        content:
          "The Annual Wellness Visit is a Medicare preventive service introduced in 2011 under the Affordable Care Act. It is designed to focus on prevention and health risk assessment rather than diagnosing or treating existing problems. The AWV includes a Health Risk Assessment (HRA) questionnaire covering physical function, psychosocial risks, and behavioral risks; review of medical and family history; establishment of a current provider list and medication list; height, weight, BMI, blood pressure, and other routine measurements; a cognitive function assessment; a personalized written prevention plan with screening schedule; and advance care planning discussion (optional, but billable).\n\nThe AWV is billed using G0438 for the initial visit (~$175) or G0439 for subsequent annual visits (~$119). Critically, the AWV has zero patient cost-sharing — no copay, no deductible. This makes it one of the easiest services to get patients to schedule.",
      },
      {
        heading: "What Is a Regular Checkup or Office Visit?",
        content:
          "A regular checkup refers to a standard Evaluation and Management (E&M) office visit billed under CPT codes 99202-99215. These visits are problem-oriented: the provider evaluates specific complaints, manages chronic conditions, and makes clinical decisions about diagnosis and treatment. The visit level is determined by Medical Decision Making (MDM) complexity or total time.\n\nUnlike the AWV, regular E&M visits have standard Medicare cost-sharing. The patient pays their Part B deductible (if not met) plus 20% coinsurance. For a 99214 ($130 allowed amount), the patient's coinsurance is approximately $26. This cost-sharing difference is why some patients resist scheduling regular visits but will readily accept an AWV.",
      },
      {
        heading: "Key Differences at a Glance",
        content:
          "Purpose: AWV focuses on prevention and screening; regular visit focuses on problem evaluation and treatment. Billing codes: AWV uses G0438/G0439; regular visits use 99202-99215. Patient cost: AWV has zero copay or deductible; regular visits have 20% coinsurance plus deductible. Frequency: AWV is once per 12-month period; regular visits have no frequency limit. Documentation: AWV requires HRA questionnaire and prevention plan; regular visits require MDM documentation. Physical exam: AWV does not include a comprehensive physical exam; regular visits may include problem-focused examination. Who can bill: AWV can be billed by physicians, NPs, PAs, and CNS; E&M visits have the same eligible provider types.\n\nImportantly, these are not mutually exclusive. You can bill an AWV and a separate E&M visit on the same day if you address a distinct, medically necessary problem during the encounter. Use modifier 25 on the E&M code to indicate a separately identifiable service.",
      },
      {
        heading: "Can You Bill Both on the Same Day?",
        content:
          "Yes. One of the most powerful revenue strategies is combining an AWV with a problem-focused E&M visit on the same day. If a patient comes in for their AWV and you also address a chronic condition (adjust medication, discuss new symptoms, review lab results), you can bill both G0439 and the appropriate E&M code (99213, 99214, or 99215) with modifier 25.\n\nExample: Patient arrives for AWV. During the visit, you also adjust their blood pressure medication and review their latest A1c results. Bill G0439 ($119) + 99214-25 ($130) = $249 total for a single encounter. Add Advance Care Planning (99497, ~$86) and you reach $335.\n\nThis combination billing is legitimate and common, but requires that the E&M service be separately identifiable and medically necessary. Document the AWV components and the E&M problem separately in your note.",
      },
      {
        heading: "Maximizing AWV Revenue in Your Practice",
        content:
          "With only 48.2% of Medicare patients receiving AWVs nationally, there is enormous room for improvement. Practices that proactively schedule and manage AWVs can capture significant additional revenue. For a practice with 500 Medicare patients at 48% current completion rate, increasing to 75% completion adds 135 AWVs per year — approximately $16,065 in revenue from G0439 alone, and $33,000+ if combined with E&M visits and ACP.\n\nImplementation strategies include: sending HRA questionnaires to patients before the visit (reduces in-office time), scheduling AWV-specific appointment blocks, using MA time for HRA review and vitals (physician time focuses on prevention plan and problem management), tracking completion rates monthly, and conducting proactive outreach to patients who haven't scheduled.",
      },
    ],
    tableOfContents: [
      "What Is an Annual Wellness Visit (AWV)?",
      "What Is a Regular Checkup or Office Visit?",
      "Key Differences at a Glance",
      "Can You Bill Both on the Same Day?",
      "Maximizing AWV Revenue in Your Practice",
    ],
    relatedQuestions: [
      { slug: "medicare-awv-requirements", question: "Medicare AWV Requirements" },
      { slug: "awv-components-checklist", question: "AWV Components Checklist" },
      { slug: "medicare-preventive-services", question: "Medicare Preventive Services" },
      { slug: "how-to-increase-medicare-revenue", question: "How to Increase Medicare Revenue" },
    ],
    dataPoints: [
      "Only 48.2% of eligible Medicare patients receive an AWV annually",
      "G0438 (initial AWV) reimburses ~$175 with zero patient copay",
      "G0439 (subsequent AWV) reimburses ~$119 with zero patient copay",
      "AWV + E&M + ACP same-day billing can exceed $335 per encounter",
    ],
    faqs: [
      {
        question: "Do patients pay anything for an AWV?",
        answer:
          "No. The AWV is covered at 100% by Medicare Part B with zero copay and zero deductible. However, if the provider also addresses a medical problem during the same visit (billed as a separate E&M with modifier 25), the patient would owe their normal cost-sharing on the E&M portion only.",
      },
      {
        question: "How often can a patient have an AWV?",
        answer:
          "Medicare covers one AWV per 12-month period. The 12-month clock starts from the date of the last AWV, not the calendar year. So a patient who had their AWV on March 15, 2025 is eligible again on March 15, 2026.",
      },
      {
        question: "Is the AWV the same as the Welcome to Medicare visit?",
        answer:
          "No. The Initial Preventive Physical Examination (IPPE), also called the Welcome to Medicare visit (G0402), is a one-time benefit available within the first 12 months of Medicare Part B enrollment. The AWV (G0438 initial, G0439 subsequent) is a separate annual benefit. A patient who had the IPPE can still receive AWVs going forward.",
      },
    ],
  },

  "99213-vs-99214": {
    question: "99213 vs. 99214: When to Bill Each Code?",
    metaTitle: "99213 vs. 99214 — When to Bill Each E&M Code (2026 Guidelines)",
    metaDescription:
      "Learn the exact criteria for billing 99213 vs. 99214 under 2026 MDM guidelines. The $38 per-visit difference adds up to $15K-$40K per year for most providers.",
    category: "Medicare Billing",
    answer:
      "The difference between 99213 (established patient, low MDM, ~$92) and 99214 (established patient, moderate MDM, ~$130) comes down to Medical Decision Making complexity under the 2026 guidelines. Bill 99213 when you manage 1-2 self-limited problems with minimal data review and low risk. Bill 99214 when you manage 1+ chronic condition with mild exacerbation OR 2+ stable chronic conditions, with moderate data review, AND moderate risk (such as prescription drug management). The $38 per-visit difference is the single largest revenue lever for most outpatient practices. NPIxray analysis of 1.175M Medicare providers reveals that 34.7% of office visits are billed as 99213, and audit studies consistently show 20-30% of those should be 99214 based on documentation. For a provider seeing 20 patients per day, shifting just 3 undercoded visits daily from 99213 to 99214 generates $28,500+ in additional annual revenue. Source: NPIxray analysis of 1.175M Medicare providers and 8.15M billing records.",
    sections: [
      {
        heading: "Understanding MDM-Based Code Selection",
        content:
          "Since the 2021 E&M guideline update, code level selection for office visits is based on Medical Decision Making (MDM) or total time — not the old history and exam requirements. MDM has three elements, and you must meet the threshold for at least two of three to qualify for a code level.\n\nThe three MDM elements are: (1) Number and Complexity of Problems Addressed, (2) Amount and Complexity of Data Reviewed and Analyzed, and (3) Risk of Complications and/or Morbidity or Mortality of Patient Management. Understanding how these map to 99213 vs. 99214 is the key to accurate coding.",
      },
      {
        heading: "99213: Low Medical Decision Making",
        content:
          "Bill 99213 when MDM is low, requiring at least 2 of these 3 elements. Problems: 2 or more self-limited or minor problems (e.g., URI, seasonal allergies, minor rash). Data: limited data — ordering or reviewing a simple test (e.g., strep test, urinalysis), without extensive outside record review. Risk: low — treatment involves OTC medications, minor procedures with no identified risk factors, rest, ice, elevation.\n\nTypical 99213 scenarios: follow-up for a resolved acute problem, refill of a single medication for a well-controlled condition with no changes, evaluation of a simple self-limited illness (cold, minor sprain), or a brief check-in for a stable chronic condition where no clinical decisions are required.",
      },
      {
        heading: "99214: Moderate Medical Decision Making",
        content:
          "Bill 99214 when MDM is moderate, requiring at least 2 of these 3 elements. Problems: 1 or more chronic illnesses with mild exacerbation, progression, or side effects of treatment; OR 2 or more stable chronic illnesses; OR 1 undiagnosed new problem with uncertain prognosis; OR 1 acute illness with systemic symptoms. Data: moderate — ordering and reviewing tests, reviewing external notes or records, independent interpretation of a test, OR discussion with external physician/provider. Risk: moderate — prescription drug management, decisions about minor surgery with identified patient or procedure risk factors, diagnosis or treatment significantly limited by social determinants.\n\nThe prescription drug management trigger is the most commonly missed indicator for 99214. If you prescribe, adjust, continue, or refill any prescription medication AND make a clinical decision about that medication, you have met the Risk element for moderate MDM. Combined with managing 2+ stable chronic conditions, that is 99214.",
      },
      {
        heading: "Time-Based Alternative",
        content:
          "You can also select the code level based on total time spent on the encounter date, including face-to-face time and non-face-to-face time (chart review, ordering, documentation, care coordination) performed on the date of service. For established patients: 99213 = 20-29 minutes total time, 99214 = 30-39 minutes total time, 99215 = 40-54 minutes total time.\n\nTime-based coding is especially useful when the clinical complexity is straightforward but the visit was time-intensive (e.g., extensive patient education, coordination calls, complex documentation review). You must document the total time spent and a brief description of activities. You do not need to record start/stop times.",
      },
      {
        heading: "Common Undercoding Scenarios",
        content:
          "After analyzing millions of Medicare claims, several patterns of undercoding from 99213 to 99214 appear consistently. The 99213 default: providers select 99213 for all follow-up visits out of habit, regardless of complexity. Medication management visits: any visit where prescription drugs are managed meets the Risk element — pair this with 2+ chronic conditions and you have 99214. Multiple problem management: addressing diabetes, hypertension, and hyperlipidemia at one visit is 3 chronic conditions, easily qualifying for moderate complexity. Data review not documented: reviewing a specialist consult note or hospital discharge summary counts toward data, but only if documented. Fear-based undercoding: providers undercode as audit protection, but the 2021 guidelines actually make 99214 easier to justify than ever.\n\nNPIxray scans routinely identify providers billing 50-70% of their visits as 99213 when their patient demographics and specialty suggest a much higher proportion of visits should be 99214. A 10-percentage-point shift in your 99213/99214 mix can mean $15,000-40,000 in additional annual revenue.",
      },
    ],
    tableOfContents: [
      "Understanding MDM-Based Code Selection",
      "99213: Low Medical Decision Making",
      "99214: Moderate Medical Decision Making",
      "Time-Based Alternative",
      "Common Undercoding Scenarios",
    ],
    relatedQuestions: [
      { slug: "em-coding-guidelines-2026", question: "E&M Coding Guidelines 2026" },
      { slug: "undercoding-em-visits", question: "Undercoding E&M Visits" },
      { slug: "how-to-audit-billing-patterns", question: "How to Audit Billing Patterns" },
      { slug: "best-em-coding-tool", question: "Best E&M Coding Tool" },
    ],
    dataPoints: [
      "34.7% of office visits are billed as 99213 nationally",
      "20-30% of 99213 visits should be 99214 per audit studies",
      "$38 per-visit gap between 99213 ($92) and 99214 ($130)",
      "3 shifted visits per day = $28,500+ additional annual revenue",
    ],
    faqs: [
      {
        question: "What is the biggest trigger for billing 99214 instead of 99213?",
        answer:
          "Prescription drug management. If you prescribe, adjust, or actively manage any prescription medication during the visit, you meet the Risk element for moderate MDM. Combined with managing 2+ chronic conditions (Problems element), you qualify for 99214. Most internal medicine and family medicine visits involve prescription management.",
      },
      {
        question: "Can I be audited for billing too many 99214s?",
        answer:
          "Audits look for patterns that deviate significantly from peers in your specialty and geography. Under the 2021 guidelines, 99214 is well-supported when 2 of 3 MDM elements are documented at the moderate level. Focus on accurate documentation rather than artificially limiting your code selection. Undercoding is also a compliance issue — it misrepresents the care provided.",
      },
      {
        question: "Should I use MDM or time to select my E&M level?",
        answer:
          "Use whichever method supports the higher code for the encounter. Most visits are coded by MDM, but time-based coding is preferable when the visit was time-intensive but clinically straightforward (extensive counseling, care coordination, complex documentation review). You choose one method per encounter — you cannot combine MDM and time elements.",
      },
    ],
  },
};
