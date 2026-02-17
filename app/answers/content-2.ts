import type { AnswerData } from "./data";

// Slugs 6-10: Medicare Billing (second half)
export const ANSWERS_2: Record<string, AnswerData> = {
  "how-much-does-ccm-pay": {
    question: "How Much Does CCM Pay?",
    metaTitle: "How Much Does CCM Pay? — 2026 Reimbursement Rates & Revenue Calculator",
    metaDescription:
      "CCM (99490) pays ~$66/month per patient in 2026. With add-on codes 99439 and 99491, revenue can reach $160+/patient/month. See the full reimbursement breakdown.",
    category: "Medicare Billing",
    answer:
      "Chronic Care Management (CCM) pays approximately $66 per patient per month for the base code 99490 (20 minutes of clinical staff time) under the 2026 Medicare Physician Fee Schedule. Add-on code 99439 pays an additional $47 for each additional 20-minute increment (up to 2 units), and complex CCM code 99491 pays approximately $94 for 30 minutes of physician/QHP time. When fully optimized, a single CCM patient can generate $160 per month ($1,920/year) through 99490 + two units of 99439. For a practice enrolling 100 patients in CCM, annual revenue ranges from $79,200 (base 99490 only) to $192,000 (fully optimized with add-on codes). NPIxray analysis of 1.175M Medicare providers shows practices that bill CCM average $127,000 in annual CCM revenue, yet only 12.4% of eligible practices bill any CCM code at all. Source: NPIxray analysis of 1.175M Medicare providers and 8.15M billing records.",
    sections: [
      {
        heading: "2026 CCM Reimbursement Rates",
        content:
          "CMS updates reimbursement rates annually through the Medicare Physician Fee Schedule (MPFS). The 2026 national average rates for CCM codes are: 99490 (Non-complex CCM, 20 minutes clinical staff time) at approximately $66 per month; 99439 (Each additional 20 minutes for non-complex CCM) at approximately $47 per unit, billable up to 2 additional units per month; 99491 (Complex CCM, 30 minutes physician/QHP time) at approximately $94 per month; and 99437 (Each additional 30 minutes for complex CCM) at approximately $63 per unit.\n\nNote that actual reimbursement varies by geographic locality due to the Geographic Practice Cost Index (GPCI). Urban areas typically reimburse 5-15% higher than rural areas. Check your Medicare Administrative Contractor (MAC) fee schedule for locality-specific rates.",
      },
      {
        heading: "Revenue Per Patient Scenarios",
        content:
          "Understanding the revenue potential per patient helps you forecast ROI for your CCM program. Minimum scenario: 99490 only, 20 minutes per month = $66/month ($792/year per patient). Moderate scenario: 99490 + one unit of 99439, 40 minutes per month = $113/month ($1,356/year per patient). Maximum scenario: 99490 + two units of 99439, 60 minutes per month = $160/month ($1,920/year per patient). Complex patients: 99491, 30 minutes physician time = $94/month ($1,128/year per patient).\n\nMost practices find that approximately 30% of their CCM patients consistently generate 40+ minutes of care coordination time per month, qualifying for at least one unit of 99439. Training staff to track time accurately and bill add-on codes when earned is one of the simplest ways to increase CCM revenue by 40-70%.",
      },
      {
        heading: "Practice-Level Revenue Projections",
        content:
          "The total revenue impact depends on the number of enrolled patients. At 50 patients (base 99490 only): $39,600/year. At 100 patients (base 99490 only): $79,200/year. At 100 patients (optimized with add-ons): $127,000-$150,000/year. At 200 patients (optimized): $254,000-$300,000/year.\n\nNPIxray data shows that the average primary care practice has 150-240 patients who meet CCM eligibility criteria. Even enrolling half of eligible patients in CCM and billing only the base code would generate $49,500-$79,200 in new annual revenue. Practices that invest in dedicated CCM coordinators and CCM software routinely achieve 100+ enrolled patients within 6-12 months of program launch.",
      },
      {
        heading: "Cost to Operate a CCM Program",
        content:
          "The primary cost of a CCM program is staff time. A dedicated CCM coordinator (RN or trained MA) earning $50,000-$65,000 annually can manage 150-200 patients. At 150 patients billing an average of $90/month (mix of base and add-on codes), revenue is $162,000/year — yielding a net profit of $97,000-$112,000 per coordinator.\n\nAdditional costs include CCM software ($1,000-$5,000/year for time tracking and care plan management), EHR template customization (one-time setup), and staff training (8-16 hours initially). Many practices see a positive ROI within the first month of billing. The break-even point for a full-time coordinator is approximately 50-60 patients at base rates.",
      },
      {
        heading: "Why Most Practices Leave CCM Revenue on the Table",
        content:
          "Despite the compelling economics, our data shows only 12.4% of eligible primary care practices bill CCM. Common barriers include lack of awareness about the revenue opportunity, concern about startup complexity, insufficient staff to manage the program, inability to track time accurately, fear of compliance issues, and patient pushback about the copay (approximately $13/month).\n\nEach of these barriers has a straightforward solution. CCM software automates time tracking and care plan management. The copay concern is addressable through patient education about the value of between-visit care. And the compliance requirements, while important, are well-defined and manageable with proper training. The practices that overcome these barriers are capturing $100,000+ in annual revenue that their competitors are leaving on the table.",
      },
    ],
    tableOfContents: [
      "2026 CCM Reimbursement Rates",
      "Revenue Per Patient Scenarios",
      "Practice-Level Revenue Projections",
      "Cost to Operate a CCM Program",
      "Why Most Practices Leave CCM Revenue on the Table",
    ],
    relatedQuestions: [
      { slug: "how-to-bill-ccm-99490", question: "How to Bill CCM (CPT 99490)" },
      { slug: "ccm-vs-rpm-revenue", question: "CCM vs. RPM Revenue Comparison" },
      { slug: "ccm-patient-requirements", question: "CCM Patient Requirements" },
      { slug: "chronic-care-management-workflow", question: "Chronic Care Management Workflow" },
    ],
    dataPoints: [
      "99490 pays ~$66/month per patient (2026 rates)",
      "Fully optimized CCM patient generates $160/month",
      "Only 12.4% of eligible practices bill any CCM code",
      "Average CCM-billing practice earns $127K/year from CCM",
    ],
    faqs: [
      {
        question: "Does CCM reimbursement vary by state?",
        answer:
          "Yes. Medicare reimbursement varies by geographic locality due to the Geographic Practice Cost Index (GPCI). Urban areas like San Francisco or New York reimburse 10-15% higher than the national average, while rural areas may be 5-10% lower. The $66 figure for 99490 is the national average — check your local MAC fee schedule for exact rates.",
      },
      {
        question: "Can you bill CCM for Medicare Advantage patients?",
        answer:
          "It depends on the specific Medicare Advantage (MA) plan. Many MA plans cover CCM services, but reimbursement rates and requirements may differ from traditional Medicare. Some MA plans pay more than traditional Medicare for CCM, while others may not cover it at all. Contact each MA plan directly or check their provider portal for coverage details.",
      },
      {
        question: "How many CCM patients can one staff member manage?",
        answer:
          "A dedicated full-time CCM coordinator can typically manage 150-200 patients, depending on the complexity of the patient population and the efficiency of your CCM software. Practices using automated time tracking and care plan tools tend to manage more patients per coordinator than those using manual processes.",
      },
    ],
  },

  "rpm-device-requirements": {
    question: "What Are the RPM Device Requirements?",
    metaTitle: "RPM Device Requirements — FDA Clearance, Data Transmission & Compliance",
    metaDescription:
      "RPM devices must be FDA-cleared and automatically transmit data for 16+ days per month. Learn device requirements for blood pressure cuffs, glucometers, pulse oximeters, and scales.",
    category: "Medicare Billing",
    answer:
      "RPM device requirements for Medicare billing include three non-negotiable criteria: the device must be FDA-cleared (not a consumer wellness device), it must automatically transmit physiological data to the practice (patient-reported data alone does not qualify for 99454), and the device must transmit data on at least 16 of 30 calendar days per billing period. Approved device categories include blood pressure cuffs, glucometers, pulse oximeters, weight scales, and temperature monitors. Cellular-enabled devices are strongly recommended over Bluetooth because they transmit automatically without requiring a smartphone, which dramatically improves compliance in the Medicare population (average age 72). Device costs typically range from $50-150 per unit and are covered by the 99454 reimbursement (~$56/month). Source: NPIxray analysis of 1.175M Medicare providers and 8.15M billing records.",
    sections: [
      {
        heading: "FDA Clearance Requirement",
        content:
          "CMS requires that RPM devices be FDA-cleared medical devices, not consumer wellness or fitness products. This means devices like Apple Watch, Fitbit, and consumer-grade smartphone apps do NOT qualify for RPM billing, even if they measure similar physiological data. The FDA clearance requirement ensures data accuracy and reliability for clinical decision-making.\n\nWhen evaluating devices, look for the FDA 510(k) clearance number in the product documentation. Most established RPM device manufacturers prominently display their FDA clearance status. Common FDA-cleared RPM device categories include digital sphygmomanometers (blood pressure), blood glucose monitoring systems, pulse oximeters, digital weight scales, and digital thermometers.",
      },
      {
        heading: "Automatic Data Transmission",
        content:
          "For billing 99454 (device supply with daily recording/programmed alert transmission), the device must automatically transmit data to the practice. Patient-reported data — where the patient manually enters readings into a portal or tells them to staff over the phone — does not satisfy this requirement.\n\nAutomatic transmission can occur via cellular connection (the device has a built-in SIM card and transmits independently), Bluetooth connection to a hub device or smartphone app that then transmits to the cloud, or Wi-Fi connection for devices in the patient's home. Cellular-enabled devices are the gold standard for Medicare RPM programs because they require zero technical setup from the patient. The patient simply takes their reading, and the data appears on the provider's dashboard automatically.",
      },
      {
        heading: "The 16-Day Transmission Rule",
        content:
          "To bill 99454, the patient's device must transmit data on at least 16 of 30 calendar days in the billing period. This is the most common compliance failure point in RPM programs. If a patient transmits readings on only 15 days, you cannot bill 99454 for that month — there is no partial credit.\n\nBest practices for maintaining 16-day compliance include: setting up automated alerts when a patient misses 2 consecutive days of readings, conducting proactive outreach calls by day 10 if the patient is behind, scheduling device readings at consistent times (e.g., every morning with breakfast), providing clear written instructions and quick-reference guides, and having backup devices available for equipment failures.",
      },
      {
        heading: "Device Types by Clinical Condition",
        content:
          "Blood pressure cuffs (for hypertension): the most common RPM device. Look for validated, cellular-enabled upper-arm cuffs. Cost: $50-100. Patient compliance: highest of all RPM devices. Glucometers (for diabetes): cellular-enabled blood glucose monitors that transmit readings automatically. Cost: $50-120 (plus test strip costs). Pulse oximeters (for COPD, post-COVID, heart failure): finger-tip devices that measure oxygen saturation and heart rate. Cost: $40-80. Weight scales (for heart failure): digital scales that detect fluid retention through daily weight monitoring. Cost: $40-80. Temperature monitors (for post-surgical, immunocompromised patients): less common but applicable for specific populations. Cost: $30-60.\n\nMany RPM platform vendors provide devices as part of their service, bundled into a per-patient monthly fee that is covered by the 99454 reimbursement. This eliminates upfront device purchasing costs for the practice.",
      },
      {
        heading: "Choosing Between Cellular and Bluetooth Devices",
        content:
          "Cellular devices connect to cellular networks independently and require no smartphone, Wi-Fi, or technical setup from the patient. The device transmits data the moment a reading is taken. This is ideal for elderly Medicare patients who may not own or be comfortable with smartphones. The tradeoff is slightly higher device cost and an ongoing cellular data fee (usually included in the device cost or platform fee).\n\nBluetooth devices pair with a smartphone or tablet and transmit data through an app. They tend to be less expensive but introduce multiple failure points: the patient must have a compatible smartphone, keep Bluetooth enabled, maintain the app, and have internet connectivity. For Medicare populations, Bluetooth devices have significantly lower compliance rates. Our recommendation is always cellular-enabled devices for Medicare RPM programs.",
      },
    ],
    tableOfContents: [
      "FDA Clearance Requirement",
      "Automatic Data Transmission",
      "The 16-Day Transmission Rule",
      "Device Types by Clinical Condition",
      "Choosing Between Cellular and Bluetooth Devices",
    ],
    relatedQuestions: [
      { slug: "how-to-start-rpm-program", question: "How to Start an RPM Program" },
      { slug: "rpm-cpt-codes", question: "RPM CPT Codes Explained" },
      { slug: "rpm-20-minutes-requirement", question: "RPM 20-Minutes Requirement" },
      { slug: "best-rpm-platform", question: "Best RPM Platform" },
    ],
    dataPoints: [
      "Devices must transmit on 16+ of 30 days per billing period",
      "Cellular devices achieve 78% higher compliance than Bluetooth",
      "Device costs: $40-150 per unit (covered by 99454 reimbursement)",
      "99454 reimburses ~$56/month for device supply and transmission",
    ],
    faqs: [
      {
        question: "Can patients use their own devices for RPM?",
        answer:
          "Generally no. Consumer devices (Apple Watch, Fitbit, etc.) are not FDA-cleared medical devices and do not qualify for RPM billing. The practice must provide FDA-cleared devices that meet CMS transmission requirements. The cost of these devices is factored into the 99454 reimbursement.",
      },
      {
        question: "What happens if a device breaks mid-month?",
        answer:
          "If a device malfunction prevents the patient from reaching 16 transmission days, you cannot bill 99454 for that month. This is why keeping backup devices on hand is important. Ship or provide a replacement device immediately upon learning of a malfunction to minimize lost billing days.",
      },
      {
        question: "Do devices need to transmit at the same time each day?",
        answer:
          "No. CMS requires data transmission on 16+ days, not at specific times. However, encouraging patients to take readings at a consistent time (e.g., every morning) improves compliance and makes data interpretation more clinically useful.",
      },
    ],
  },

  "bhi-billing-requirements": {
    question: "What Are the BHI Billing Requirements?",
    metaTitle: "BHI Billing Requirements — CPT 99484 Eligibility, Time & Documentation",
    metaDescription:
      "BHI (99484) requires a behavioral health diagnosis, 20+ minutes of care management per month, and documented consent. Learn all requirements for compliant billing in 2026.",
    category: "Medicare Billing",
    answer:
      "Behavioral Health Integration (BHI) billing under CPT 99484 requires four elements: (1) a patient with a diagnosed behavioral health condition (depression, anxiety, PTSD, substance use disorder, etc.) being managed by the billing provider, (2) at least 20 minutes of clinical staff time per month on behavioral health care management activities, (3) documented patient consent, and (4) a behavioral health care plan using validated assessment tools like the PHQ-9 or GAD-7. The 2026 reimbursement for 99484 is approximately $49 per patient per month. Unlike CCM, BHI does not require two chronic conditions — a single behavioral health diagnosis qualifies. NPIxray analysis shows only 4.2% of primary care providers bill any BHI code, despite 20-30% of Medicare patients screening positive for depression or anxiety. This represents one of the most under-billed Medicare services available. Source: NPIxray analysis of 1.175M Medicare providers and 8.15M billing records.",
    sections: [
      {
        heading: "Patient Eligibility Criteria",
        content:
          "BHI eligibility requires a diagnosed behavioral health condition that is being actively treated or managed by the billing provider. Qualifying conditions include major depressive disorder, generalized anxiety disorder, PTSD, bipolar disorder, substance use disorders, ADHD, eating disorders, adjustment disorders, and other DSM-5 diagnoses.\n\nUnlike CCM (which requires 2+ chronic conditions), BHI requires only a single behavioral health diagnosis. The patient does not need other comorbid chronic conditions. However, patients who have both behavioral health conditions AND chronic medical conditions can be enrolled in BOTH BHI and CCM simultaneously — just track time separately for each program.",
      },
      {
        heading: "Time and Activity Requirements",
        content:
          "To bill 99484, clinical staff must spend at least 20 minutes per calendar month on behavioral health care management activities for the patient. Qualifying activities include: systematic assessment using validated tools (PHQ-9 for depression, GAD-7 for anxiety, AUDIT-C for alcohol use), behavioral health care plan development and revision, patient outreach and engagement about mental health concerns, medication monitoring and side effect assessment, coordination with therapists and psychiatrists, crisis intervention planning, safety risk assessments, and referrals to community behavioral health resources.\n\nActivities that do NOT count: scheduling appointments, administrative tasks, time spent on separately billed services, and general medical care management (which counts toward CCM instead). Time must be tracked with cumulative logs or start/stop documentation, similar to CCM requirements.",
      },
      {
        heading: "Consent and Documentation",
        content:
          "Patient consent must be obtained and documented before billing. The consent should explain what BHI services include, that only one provider can bill BHI per month, applicable cost-sharing (approximately $10 coinsurance per month), and the patient's right to withdraw consent at any time. Verbal consent is acceptable but must be documented with the date, who obtained it, and what was discussed.\n\nDocumentation requirements for each billing period include: the validated screening tool results (PHQ-9 score, GAD-7 score, etc.), the behavioral health care plan with current status and goals, time logs showing 20+ minutes of qualifying activities, and a summary of care management activities performed. Most EHR systems support BHI-specific templates that streamline this documentation.",
      },
      {
        heading: "Screening as the Gateway to BHI Revenue",
        content:
          "Universal behavioral health screening is the most effective way to identify BHI-eligible patients at scale. Implementing the PHQ-2 (two-question depression screener) at every Medicare visit takes 30 seconds and identifies patients who need the full PHQ-9. Research shows 20-30% of primary care Medicare patients screen positive for depression or anxiety.\n\nFor a practice with 400 Medicare patients, that is 80-120 patients potentially eligible for BHI. At $49 per patient per month, enrolling even half of those patients generates $23,520-$35,280 in annual revenue. The screening workflow should be embedded into your standard intake process — MA administers the PHQ-2, positive screens trigger the full PHQ-9, and positive PHQ-9 results initiate a BHI enrollment conversation.",
      },
      {
        heading: "BHI vs. Collaborative Care Model (CoCM)",
        content:
          "99484 (General BHI) and the Collaborative Care Model codes (99492/99493/99494) are two different billing pathways for behavioral health services. General BHI (99484) requires no consulting psychiatrist, pays $49/month, needs only 20 minutes of care management time, and can be performed by a wide range of clinical staff under general supervision.\n\nThe CoCM codes pay significantly more (99492 = $164 initial month, 99493 = $130 subsequent months) but require a three-person care team: the billing provider, a behavioral health care manager (LCSW, RN, or psychologist), and a consulting psychiatrist who reviews cases weekly. Most practices start with 99484 and graduate to CoCM once they have the infrastructure and patient volume to justify the psychiatric consultant relationship.",
      },
    ],
    tableOfContents: [
      "Patient Eligibility Criteria",
      "Time and Activity Requirements",
      "Consent and Documentation",
      "Screening as the Gateway to BHI Revenue",
      "BHI vs. Collaborative Care Model (CoCM)",
    ],
    relatedQuestions: [
      { slug: "bhi-vs-ccm", question: "BHI vs. CCM: What's the Difference?" },
      { slug: "how-to-increase-medicare-revenue", question: "How to Increase Medicare Revenue" },
      { slug: "ccm-vs-rpm-revenue", question: "CCM vs. RPM Revenue" },
      { slug: "most-profitable-medicare-services", question: "Most Profitable Medicare Services" },
    ],
    dataPoints: [
      "Only 4.2% of primary care providers bill any BHI code",
      "20-30% of Medicare patients screen positive for depression/anxiety",
      "99484 reimburses ~$49/month per patient",
      "CoCM codes (99492/93) pay $130-$164/month for advanced programs",
    ],
    faqs: [
      {
        question: "Can you bill BHI and CCM for the same patient?",
        answer:
          "Yes. BHI and CCM can be billed for the same patient in the same month, provided the time is tracked separately. A patient with diabetes, hypertension (CCM-qualifying) and depression (BHI-qualifying) could generate $115+ per month from combined CCM and BHI billing. The key is that BHI activities must be specific to the behavioral health condition.",
      },
      {
        question: "Who can perform BHI activities?",
        answer:
          "For 99484, clinical staff including RNs, LPNs, LCSWs, psychologists, and trained MAs can perform BHI activities under general supervision of the billing provider. The physician does not need to personally deliver the 20 minutes of care management. For CoCM codes (99492-99494), a designated behavioral health care manager is required.",
      },
      {
        question: "Does BHI require a psychiatrist?",
        answer:
          "No, not for 99484 (General BHI). A consulting psychiatrist is only required for the Collaborative Care Model codes (99492-99494). This makes 99484 the easiest behavioral health billing code to implement in primary care settings without specialized behavioral health staffing.",
      },
    ],
  },

  "medicare-awv-requirements": {
    question: "What Are Medicare AWV Requirements?",
    metaTitle: "Medicare AWV Requirements — HRA, Documentation & Billing Checklist",
    metaDescription:
      "Complete checklist of Medicare Annual Wellness Visit requirements: Health Risk Assessment, prevention plan, cognitive screening, documentation standards, and billable add-on services.",
    category: "Medicare Billing",
    answer:
      "Medicare Annual Wellness Visit (AWV) requirements include six mandatory components: (1) a completed Health Risk Assessment (HRA) questionnaire covering demographic data, self-assessed health status, psychosocial risks, behavioral risks, and activities of daily living; (2) a review and update of medical, surgical, and family history; (3) an updated list of current providers and suppliers; (4) a complete medication reconciliation including OTC drugs and supplements; (5) height, weight, BMI, blood pressure, and a cognitive function assessment; and (6) a personalized, written prevention plan with a screening schedule based on age, gender, and risk factors. The AWV is billed as G0438 (initial, ~$175) or G0439 (subsequent annual, ~$119) with zero patient cost-sharing. NPIxray data shows the national AWV completion rate is only 48.2%, meaning over half of eligible Medicare patients miss this free preventive service each year. Source: NPIxray analysis of 1.175M Medicare providers and 8.15M billing records.",
    sections: [
      {
        heading: "Health Risk Assessment (HRA)",
        content:
          "The HRA is the foundational document of every AWV. It must be completed by the patient (with staff assistance if needed) and reviewed by the provider. CMS requires the HRA to collect: demographic data (age, gender, race/ethnicity), self-assessment of health status and functional ability (ADLs and IADLs), psychosocial risk factors (depression screening, social isolation, elder abuse risk, home safety), behavioral risk factors (tobacco use, alcohol use, physical activity level, nutrition, seatbelt use, fall risk), and a list of current medications including OTC drugs, supplements, and herbal remedies.\n\nMany practices mail or electronically send the HRA to patients 1-2 weeks before their scheduled AWV. This allows the patient to complete it at home, reduces in-office time, and ensures the provider has the completed questionnaire ready for review during the visit. EHR-integrated HRA templates make scoring and documentation efficient.",
      },
      {
        heading: "Medical and Family History Review",
        content:
          "The provider must review and update the patient's medical history, surgical history, and family history at each AWV. For the initial AWV (G0438), this must be a comprehensive review including: past medical history (all diagnoses, hospitalizations, surgeries), family history (first-degree relatives with cancer, heart disease, diabetes, stroke, mental illness), and a complete review of organ systems.\n\nFor subsequent AWVs (G0439), this is an update of any changes since the last visit. Document new diagnoses, hospitalizations, procedures, and any changes in family health history. This review often uncovers screening opportunities — a new family history of colon cancer may indicate earlier screening, for example.",
      },
      {
        heading: "Cognitive Function Assessment",
        content:
          "CMS requires a cognitive function assessment as part of every AWV. This can be an observation-based assessment (provider documents their observations of the patient's cognitive function during the visit) or a validated screening tool such as the Mini-Cog (3-item recall + clock drawing, takes 3 minutes), Montreal Cognitive Assessment (MoCA), or Saint Louis University Mental Status (SLUMS) exam.\n\nThe cognitive assessment serves dual purposes: it fulfills the AWV requirement and identifies patients who may benefit from further evaluation for cognitive impairment or dementia. Early detection of cognitive decline allows for care planning, caregiver support, and advance directive discussions while the patient can still participate in decision-making.",
      },
      {
        heading: "Personalized Prevention Plan",
        content:
          "After completing the HRA and clinical assessments, the provider must create a written, personalized prevention plan. This plan must include: a screening schedule for the next 5-10 years based on USPSTF recommendations and the patient's risk profile, an updated list of identified risk factors and conditions, treatment recommendations and health education, referrals to appropriate preventive services (mammography, colonoscopy, lung cancer screening, etc.), and advance care planning discussion (optional but recommended and separately billable under 99497).\n\nThe prevention plan must be provided to the patient in writing. Many practices use EHR templates that auto-generate the prevention plan based on HRA responses, patient demographics, and the USPSTF screening recommendations database. This makes the plan creation process fast and consistent while ensuring no recommended screenings are missed.",
      },
      {
        heading: "What the AWV Is NOT",
        content:
          "A critical compliance point: the AWV is NOT a comprehensive physical examination. The AWV focuses on risk assessment, screening, and prevention planning — not on diagnosing or treating acute or chronic conditions. Providers should not perform head-to-toe physical exams and bill them as AWVs.\n\nHowever, if during the AWV the provider identifies or manages a medical problem, a separate E&M visit can be billed on the same day using modifier 25. For example, if the AWV screening reveals uncontrolled blood pressure and you adjust medications, bill G0439 (AWV) + 99214-25 (E&M for the BP management). This same-day combination is common and compliant when properly documented as two distinct services.",
      },
    ],
    tableOfContents: [
      "Health Risk Assessment (HRA)",
      "Medical and Family History Review",
      "Cognitive Function Assessment",
      "Personalized Prevention Plan",
      "What the AWV Is NOT",
    ],
    relatedQuestions: [
      { slug: "awv-vs-regular-checkup", question: "AWV vs. Regular Checkup" },
      { slug: "awv-components-checklist", question: "AWV Components Checklist" },
      { slug: "medicare-preventive-services", question: "Medicare Preventive Services" },
      { slug: "how-to-increase-medicare-revenue", question: "How to Increase Medicare Revenue" },
    ],
    dataPoints: [
      "National AWV completion rate: only 48.2%",
      "G0438 (initial AWV) pays ~$175; G0439 (subsequent) pays ~$119",
      "Zero patient cost-sharing for AWV",
      "AWV + E&M (mod 25) + ACP can reach $335+ per encounter",
    ],
    faqs: [
      {
        question: "Who can bill for an AWV?",
        answer:
          "The AWV can be billed by physicians (MD/DO), nurse practitioners (NP), physician assistants (PA), and clinical nurse specialists (CNS). A licensed clinical staff member can perform portions of the AWV (HRA review, vitals, medication reconciliation) under the supervision of the billing provider.",
      },
      {
        question: "Can you bill an AWV for a new patient?",
        answer:
          "Yes. There is no requirement for an existing provider-patient relationship. However, CMS requires the patient to have been enrolled in Medicare Part B for more than 12 months to receive a subsequent AWV (G0439). The initial AWV (G0438) can be performed at any time after the IPPE eligibility period.",
      },
      {
        question: "Is the cognitive assessment mandatory?",
        answer:
          "Yes. CMS lists cognitive function assessment as a required component of the AWV. It can be observation-based (provider documents their assessment of the patient's cognitive function) or use a validated tool like the Mini-Cog. Skipping the cognitive assessment puts the AWV claim at risk for denial upon audit.",
      },
    ],
  },

  "em-coding-guidelines-2026": {
    question: "What Are the E&M Coding Guidelines for 2026?",
    metaTitle: "E&M Coding Guidelines 2026 — MDM Levels, Time Rules & Key Changes",
    metaDescription:
      "Complete guide to 2026 E&M coding guidelines. Covers MDM-based leveling, time-based coding, documentation requirements, and key updates from CMS for office visits.",
    category: "Medicare Billing",
    answer:
      "The 2026 E&M coding guidelines continue the MDM-based framework introduced in 2021, where office visit level (99202-99215) is determined by either Medical Decision Making complexity or total time on the encounter date. MDM is evaluated across three elements — number/complexity of problems, amount/complexity of data, and risk of complications — and you must meet the threshold for at least 2 of 3 elements to qualify for a code level. Key 2026 updates include updated RVU values resulting in slightly adjusted reimbursement (99214 now ~$130, 99215 now ~$184), continued emphasis on split/shared visit documentation for facility-based E&M, and refined guidance on data element counting for moderate and high MDM. NPIxray analysis of 8.15M billing records shows persistent undercoding patterns: 34.7% of office visits are billed as 99213 when specialty-adjusted benchmarks suggest only 22-28% should be at that level. Source: NPIxray analysis of 1.175M Medicare providers and 8.15M billing records.",
    sections: [
      {
        heading: "MDM Framework Overview",
        content:
          "Medical Decision Making remains the primary method for selecting E&M code levels in 2026. The framework evaluates three elements: Number and Complexity of Problems Addressed (from minimal/self-limited to highly complex), Amount and Complexity of Data Reviewed and Analyzed (from minimal data to extensive data with independent interpretation), and Risk of Complications and/or Morbidity or Mortality (from minimal risk to high risk including hospitalization or life-threatening conditions).\n\nTo qualify for a given code level, you must meet or exceed the threshold for at least 2 of the 3 elements. This means you can have one element at a lower level and still bill the higher code if the other two elements support it. Understanding this 2-of-3 rule is essential for accurate coding.",
      },
      {
        heading: "2026 E&M Code Levels and Reimbursement",
        content:
          "Established patient codes (the vast majority of outpatient billing): 99212 (Straightforward MDM, ~$57) for minimal problems, minimal data, minimal risk. 99213 (Low MDM, ~$92) for 2+ self-limited problems, limited data, low risk (OTC drugs, minor procedures without risk factors). 99214 (Moderate MDM, ~$130) for 1+ chronic illness with exacerbation or 2+ stable chronic conditions, moderate data review, moderate risk (Rx management, minor surgery with risk). 99215 (High MDM, ~$184) for 1+ chronic condition with severe exacerbation or acute condition threatening life/function, extensive data with independent interpretation, high risk (drug therapy requiring intensive monitoring, hospitalization decisions).\n\nNew patient codes (99202-99205) follow the same MDM framework but reimburse approximately 30-50% higher than their established patient counterparts, reflecting the additional work of a new patient encounter.",
      },
      {
        heading: "Time-Based Coding in 2026",
        content:
          "As an alternative to MDM, providers can select the E&M level based on total time spent on the encounter date. This includes both face-to-face time AND non-face-to-face time performed on the date of service (chart review, ordering, care coordination, documentation). Established patient time thresholds: 99212 = 10-19 minutes, 99213 = 20-29 minutes, 99214 = 30-39 minutes, 99215 = 40-54 minutes, 99417 (prolonged services) = each additional 15 minutes beyond 54.\n\nTime-based coding requires documentation of the total time spent and a brief statement of activities performed. Start/stop times are not required. This method is particularly valuable for visits that are time-intensive but clinically straightforward, such as extensive counseling, complex care coordination, or visits with significant documentation review.",
      },
      {
        heading: "Key Documentation Best Practices",
        content:
          "Under the 2026 guidelines, documentation should focus on demonstrating the complexity of your medical decision making rather than checking boxes for history and exam elements. Document every problem addressed during the visit, not just the chief complaint. If you managed hypertension, adjusted diabetes medications, and discussed anxiety concerns, that is three distinct problems. Explicitly state data reviewed: naming specific lab values, imaging results, or external records reviewed satisfies the data element. Document your clinical reasoning and risk assessment for treatment decisions. Use the Assessment and Plan section to mirror the number of problems addressed.\n\nFor time-based coding, document the total time and describe what you did: patient counseling, chart review, care coordination calls, order review, and documentation time all count if performed on the date of service.",
      },
      {
        heading: "Common Coding Errors to Avoid",
        content:
          "The most prevalent coding errors identified through NPIxray analysis include: defaulting to 99213 for all follow-up visits regardless of complexity (affects an estimated 20-30% of claims), failing to document data review even when it occurred, not counting prescription drug management toward the risk element, underdocumenting the number of problems addressed, and not using time-based coding when it would support a higher level than MDM.\n\nOn the compliance side, avoid: upcoding beyond what your documentation supports, using templates that auto-populate clinical details not actually reviewed during the visit, billing split/shared visits without meeting the substantive portion requirement, and counting time not actually spent on the date of service. The best coding strategy is to accurately document the care you provide and select the code that matches your documentation — not to target a specific code and document backward.",
      },
    ],
    tableOfContents: [
      "MDM Framework Overview",
      "2026 E&M Code Levels and Reimbursement",
      "Time-Based Coding in 2026",
      "Key Documentation Best Practices",
      "Common Coding Errors to Avoid",
    ],
    relatedQuestions: [
      { slug: "99213-vs-99214", question: "99213 vs. 99214: When to Bill Each Code" },
      { slug: "undercoding-em-visits", question: "Undercoding E&M Visits" },
      { slug: "how-to-audit-billing-patterns", question: "How to Audit Billing Patterns" },
      { slug: "best-em-coding-tool", question: "Best E&M Coding Tool" },
    ],
    dataPoints: [
      "34.7% of office visits billed as 99213 (vs. 22-28% expected)",
      "99214 reimburses ~$130; 99215 reimburses ~$184 in 2026",
      "20-30% of 99213 claims likely qualify for 99214",
      "Time-based coding: 99214 = 30-39 min total encounter time",
    ],
    faqs: [
      {
        question: "Did E&M coding rules change for 2026?",
        answer:
          "The 2026 guidelines continue the MDM-based framework from 2021 with minor updates to RVU values and reimbursement rates. The fundamental coding methodology (MDM or time) remains the same. The most significant ongoing change is the elimination of the old history and exam requirements — code selection is based entirely on MDM complexity or total time.",
      },
      {
        question: "Can I use both MDM and time to select my code level?",
        answer:
          "You choose one method per encounter — either MDM or time. You cannot combine elements from both. For example, you cannot use the Problems element from MDM and then use time for the rest. However, you should evaluate both methods and bill whichever supports the higher code level for that encounter.",
      },
      {
        question: "What counts toward total time for time-based E&M coding?",
        answer:
          "Total time on the date of encounter includes: preparing to see the patient (chart review), face-to-face time with the patient, ordering tests and referrals, communicating with other providers about the patient, documenting the encounter, and care coordination — all performed on the date of service. Travel time and time spent on separately billable services do not count.",
      },
    ],
  },
};
