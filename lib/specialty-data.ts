// ────────────────────────────────────────────────────────────
// Specialty page data for programmatic SEO
// Extends benchmarks.ts with SEO-friendly slugs and descriptions
// ────────────────────────────────────────────────────────────

import { SPECIALTY_BENCHMARKS } from "./benchmarks";

export interface SpecialtyPageData {
  name: string;
  slug: string;
  description: string;
  overview: string;
  totalProviders: number;
  avgMissedRevenue: number;
  topRevenueGaps: { name: string; avgGap: number; description: string }[];
  relatedGuides: { slug: string; title: string }[];
  commonConditions: string[];
  keyInsight: string;
}

const SPECIALTIES: Record<string, SpecialtyPageData> = {
  "family-medicine": {
    name: "Family Medicine",
    slug: "family-medicine",
    description: "Revenue intelligence for Family Medicine practices. See national E&M coding benchmarks, CCM/RPM/BHI adoption rates, and AWV completion data.",
    overview: "Family Medicine providers are the backbone of Medicare primary care, managing complex multi-condition patients across all age groups. Despite seeing the highest volume of Medicare patients eligible for care management programs, Family Medicine has some of the lowest adoption rates for CCM, RPM, and BHI — creating the largest untapped revenue opportunity in primary care.",
    totalProviders: 148200,
    avgMissedRevenue: 94600,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 26400, description: "35% of Family Medicine practices overuse 99213 when documentation supports 99214. The national benchmark shows optimal distribution at 30% 99213 / 50% 99214 / 20% 99215." },
      { name: "CCM (99490)", avgGap: 28800, description: "Only 12% of eligible patients are enrolled in CCM nationally. With 380 avg Medicare patients and 55%+ having 2+ chronic conditions, most practices have 100+ eligible patients generating zero CCM revenue." },
      { name: "RPM (99453-99458)", avgGap: 18400, description: "RPM adoption is only 6% among Family Medicine providers. Hypertension monitoring alone could cover 40%+ of the Medicare panel." },
      { name: "AWV (G0438/G0439)", avgGap: 14200, description: "AWV completion rate averages 35% nationally. With zero patient copay, proactive outreach can push completion above 70% — doubling AWV revenue." },
      { name: "BHI (99484)", avgGap: 6800, description: "Behavioral health integration is adopted by only 4% of Family Medicine practices despite 22% of Medicare patients screening positive for depression." },
    ],
    relatedGuides: [
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
      { slug: "rpm-billing-99453-99458", title: "RPM Billing Guide" },
      { slug: "awv-billing-g0438-g0439", title: "AWV Billing Guide" },
    ],
    commonConditions: ["Hypertension (58%)", "Diabetes (35%)", "Depression (22%)", "COPD (14%)", "Heart Failure (12%)"],
    keyInsight: "A Family Medicine practice with 380 Medicare patients implementing CCM, RPM, and proper E&M coding can capture an additional $94,600+ per year — the equivalent of hiring another staff member.",
  },
  "internal-medicine": {
    name: "Internal Medicine",
    slug: "internal-medicine",
    description: "Revenue benchmarks for Internal Medicine practices. National E&M coding data, care management adoption rates, and revenue gap analysis.",
    overview: "Internal Medicine providers manage the most complex Medicare patients, with the highest average chronic conditions per patient (3.2) among primary care specialties. This complexity creates enormous revenue opportunity — Internal Medicine has the highest per-provider missed revenue of any primary care specialty, primarily from underutilized CCM and RPM programs.",
    totalProviders: 162400,
    avgMissedRevenue: 108200,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 28200, description: "Internal Medicine has the strongest documentation to support higher E&M levels, yet 25% of visits are still coded as 99213. Benchmark: 25% 99213 / 52% 99214 / 23% 99215." },
      { name: "CCM (99490)", avgGap: 34600, description: "With 420 avg Medicare patients and 62% having hypertension, the eligible pool for CCM is enormous. Only 14% adoption nationally." },
      { name: "RPM (99453-99458)", avgGap: 22400, description: "At 7% adoption, RPM is massively underutilized. Internal Medicine patients with diabetes and hypertension are ideal candidates for blood pressure and glucose monitoring." },
      { name: "AWV (G0438/G0439)", avgGap: 15800, description: "AWV completion at 32% is actually lower than Family Medicine. With larger patient panels, the absolute number of missed AWVs is significant." },
      { name: "BHI (99484)", avgGap: 7200, description: "5% BHI adoption despite 20% depression prevalence. The collaborative care model could add substantial revenue." },
    ],
    relatedGuides: [
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
      { slug: "rpm-billing-99453-99458", title: "RPM Billing Guide" },
      { slug: "bhi-billing-99484", title: "BHI Billing Guide" },
    ],
    commonConditions: ["Hypertension (62%)", "Diabetes (38%)", "Depression (20%)", "COPD (16%)", "Heart Failure (15%)"],
    keyInsight: "Internal Medicine practices manage the most complex patients and have the largest CCM-eligible pool of any specialty — yet adoption is only 14%. This represents the single largest revenue gap in primary care.",
  },
  "general-practice": {
    name: "General Practice",
    slug: "general-practice",
    description: "Revenue analysis for General Practice providers. Benchmark data, coding optimization, and care management revenue opportunities.",
    overview: "General Practice providers serve a broad Medicare population with slightly lower complexity than Internal Medicine but similar care management opportunities. Many General Practice providers transitioned from older practice models and may not have adopted newer billing codes like CCM, RPM, and BHI.",
    totalProviders: 42800,
    avgMissedRevenue: 82400,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 22600, description: "General Practice has the highest 99213 usage (35%) of any primary care specialty, suggesting significant undercoding. Benchmark shifts could recover $22K+ annually." },
      { name: "CCM (99490)", avgGap: 24200, description: "10% adoption rate — the lowest among primary care. Smaller average patient panels (350) mean focused enrollment is even more critical." },
      { name: "RPM (99453-99458)", avgGap: 16400, description: "Only 5% RPM adoption. Starting with hypertension monitoring is the fastest path to revenue." },
      { name: "AWV (G0438/G0439)", avgGap: 12800, description: "30% AWV completion rate means 245 patients per year are missing their wellness visit. That's $29K in unrealized AWV revenue alone." },
      { name: "BHI (99484)", avgGap: 6400, description: "3% adoption with 20% depression prevalence. PHQ-9 screening at every visit is the gateway to BHI revenue." },
    ],
    relatedGuides: [
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
      { slug: "awv-billing-g0438-g0439", title: "AWV Billing Guide" },
    ],
    commonConditions: ["Hypertension (55%)", "Diabetes (32%)", "Depression (20%)", "COPD (12%)", "Heart Failure (10%)"],
    keyInsight: "General Practice has the highest undercoding rate of any primary care specialty — optimizing E&M coding alone can recover $22,000+ per year before any new programs are implemented.",
  },
  cardiology: {
    name: "Cardiology",
    slug: "cardiology",
    description: "Revenue intelligence for Cardiology practices. CCM and RPM benchmarks, E&M coding data, and heart failure management revenue opportunities.",
    overview: "Cardiology practices manage the highest-acuity Medicare patients, with an average HCC risk score of 1.55 and 78% hypertension prevalence. This creates outsized opportunities in CCM and RPM — particularly for heart failure and hypertension monitoring programs. Cardiology also has the highest justified 99215 usage of any specialty.",
    totalProviders: 28600,
    avgMissedRevenue: 142800,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 32400, description: "Cardiology benchmarks show 30% of visits should be 99215, but many practices undercode. With $176 per 99215, each shifted visit adds significant revenue." },
      { name: "CCM (99490)", avgGap: 48200, description: "18% adoption rate but 78% of patients have hypertension and 35% have heart failure. The eligible CCM pool in cardiology is massive — 200+ patients per practice." },
      { name: "RPM (99453-99458)", avgGap: 38400, description: "At 12%, cardiology leads RPM adoption but still has enormous room to grow. Blood pressure and weight monitoring for heart failure patients is clinically compelling and highly reimbursable." },
      { name: "AWV (G0438/G0439)", avgGap: 12600, description: "15% AWV rate reflects the specialist focus, but AWV-eligible patients should still be identified and referred or co-managed." },
      { name: "BHI (99484)", avgGap: 11200, description: "Depression prevalence of 15% in cardiac patients is often under-recognized. Cardiac rehabilitation plus BHI is an emerging revenue stream." },
    ],
    relatedGuides: [
      { slug: "rpm-billing-99453-99458", title: "RPM Billing Guide" },
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
    ],
    commonConditions: ["Hypertension (78%)", "Diabetes (40%)", "Heart Failure (35%)", "COPD (20%)", "Depression (15%)"],
    keyInsight: "Cardiology has the highest per-provider missed revenue ($142K) of any specialty, driven by the combination of high-acuity patients and strong CCM/RPM eligibility. Heart failure RPM programs alone can generate $100K+ annually.",
  },
  pulmonology: {
    name: "Pulmonology",
    slug: "pulmonology",
    description: "Revenue benchmarks for Pulmonology practices. COPD management programs, RPM opportunities, and E&M coding optimization data.",
    overview: "Pulmonology practices manage high-complexity respiratory patients with significant care management needs. COPD, the hallmark condition, requires ongoing monitoring and care coordination that aligns perfectly with CCM and RPM billing. Pulse oximetry RPM for COPD patients is one of the highest-ROI programs available.",
    totalProviders: 12400,
    avgMissedRevenue: 128400,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 30200, description: "Complex respiratory patients justify high-level MDM. Benchmark: 22% 99213 / 50% 99214 / 28% 99215." },
      { name: "CCM (99490)", avgGap: 42800, description: "16% adoption with 45% COPD prevalence. Most pulmonology patients have multiple qualifying conditions." },
      { name: "RPM (99453-99458)", avgGap: 34600, description: "Pulse oximetry monitoring for COPD patients is clinically effective and generates $120+/month per patient. Only 10% adoption." },
      { name: "AWV (G0438/G0439)", avgGap: 11400, description: "18% AWV rate — these patients should be screened for all preventive services." },
      { name: "BHI (99484)", avgGap: 9400, description: "COPD and depression are strongly comorbid. Screening and BHI enrollment can address both clinical and financial gaps." },
    ],
    relatedGuides: [
      { slug: "rpm-billing-99453-99458", title: "RPM Billing Guide" },
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
    ],
    commonConditions: ["COPD (45%)", "Hypertension (55%)", "Diabetes (30%)", "Depression (18%)", "Heart Failure (18%)"],
    keyInsight: "Pulse oximetry RPM for COPD patients is one of the highest-margin programs in healthcare — requiring minimal staff time while generating $120+/month per enrolled patient.",
  },
  endocrinology: {
    name: "Endocrinology",
    slug: "endocrinology",
    description: "Revenue analysis for Endocrinology practices. Diabetes management programs, CGM monitoring revenue, and care management benchmarks.",
    overview: "Endocrinology practices are uniquely positioned for RPM and CCM revenue because diabetes — their primary condition — is ideal for both remote glucose monitoring and chronic care management. With 72% diabetes prevalence and the highest average chronic conditions (3.4) among specialists, virtually every endocrinology patient qualifies for at least one care management program.",
    totalProviders: 8200,
    avgMissedRevenue: 136400,
    topRevenueGaps: [
      { name: "RPM (99453-99458)", avgGap: 44800, description: "Glucose monitoring via CGM is the gold standard for diabetes management and ideal for RPM billing. Only 14% adoption despite 72% of patients having diabetes." },
      { name: "CCM (99490)", avgGap: 42200, description: "20% adoption is the highest of any specialty but still leaves 80% of eligible patients unenrolled. Diabetes plus hypertension qualifies 60%+ of the panel." },
      { name: "E&M Coding Gap", avgGap: 28600, description: "Complex medication management and insulin titration support high-level MDM. Benchmark: 22% 99213 / 52% 99214 / 26% 99215." },
      { name: "AWV (G0438/G0439)", avgGap: 12400, description: "20% AWV rate could be doubled with proactive outreach to diabetic patients." },
      { name: "BHI (99484)", avgGap: 8400, description: "Diabetes distress and depression are highly comorbid. 18% depression prevalence makes BHI a natural fit." },
    ],
    relatedGuides: [
      { slug: "rpm-billing-99453-99458", title: "RPM Billing Guide" },
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
    ],
    commonConditions: ["Diabetes (72%)", "Hypertension (60%)", "Depression (18%)", "Heart Failure (12%)", "COPD (10%)"],
    keyInsight: "Endocrinology has the highest RPM potential of any specialty because CGM data transmits automatically — meeting the 16-day requirement with minimal patient effort. A 200-patient RPM program generates $288K+ annually.",
  },
  orthopedics: {
    name: "Orthopedics",
    slug: "orthopedics",
    description: "Revenue intelligence for Orthopedic practices. E&M coding benchmarks, surgical documentation, and emerging care management opportunities.",
    overview: "Orthopedic practices have traditionally focused on surgical revenue, but E&M coding optimization represents the largest missed opportunity. With 480 average Medicare patients and the highest 99213 usage (35%) of any specialty, the undercoding gap is substantial. Care management programs are less applicable but still relevant for patients with comorbid chronic conditions.",
    totalProviders: 24200,
    avgMissedRevenue: 68400,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 34200, description: "35% 99213 usage is the highest of any specialty. Post-operative visits and complex injury management support higher coding levels." },
      { name: "CCM (99490)", avgGap: 14800, description: "Only 5% adoption, but patients with arthritis plus another chronic condition qualify. The volume may be lower but per-patient value is the same." },
      { name: "RPM (99453-99458)", avgGap: 10200, description: "RTM (Remote Therapeutic Monitoring) for post-surgical recovery is an emerging opportunity. 4% current adoption." },
      { name: "AWV (G0438/G0439)", avgGap: 5800, description: "8% AWV rate reflects specialist focus, but patients should be referred for wellness visits." },
      { name: "BHI (99484)", avgGap: 3400, description: "Chronic pain and depression overlap frequently. Screening orthopedic patients for BHI eligibility is low-hanging fruit." },
    ],
    relatedGuides: [
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
    ],
    commonConditions: ["Hypertension (48%)", "Diabetes (25%)", "Depression (15%)", "COPD (8%)", "Heart Failure (8%)"],
    keyInsight: "Orthopedics leaves the most money in E&M coding — shifting just 5 visits per day from 99213 to 99214 adds $47,000+ annually with zero additional patient volume.",
  },
  gastroenterology: {
    name: "Gastroenterology",
    slug: "gastroenterology",
    description: "Revenue benchmarks for Gastroenterology practices. E&M coding optimization, care management opportunities, and procedure-adjacent billing.",
    overview: "Gastroenterology practices generate significant procedure revenue but often overlook E&M coding optimization for office visits. With moderate chronic disease prevalence, GI practices have a meaningful but often ignored care management opportunity, particularly for patients with IBD, liver disease, and comorbid conditions.",
    totalProviders: 16800,
    avgMissedRevenue: 86200,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 28800, description: "Office visits for complex GI conditions support moderate-to-high MDM. Benchmark: 28% 99213 / 50% 99214 / 22% 99215." },
      { name: "CCM (99490)", avgGap: 26400, description: "8% adoption. IBD patients with comorbid conditions are strong CCM candidates." },
      { name: "RPM (99453-99458)", avgGap: 14600, description: "Weight monitoring for liver disease and nutrition tracking are emerging RPM use cases. 4% adoption." },
      { name: "AWV (G0438/G0439)", avgGap: 10200, description: "12% AWV rate. Proactive screening identification during colonoscopy follow-ups can increase AWV referrals." },
      { name: "BHI (99484)", avgGap: 6200, description: "IBS, IBD, and chronic GI conditions are strongly associated with anxiety and depression. 16% prevalence." },
    ],
    relatedGuides: [
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
    ],
    commonConditions: ["Hypertension (50%)", "Diabetes (28%)", "Depression (16%)", "COPD (10%)", "Heart Failure (10%)"],
    keyInsight: "GI practices focused on procedures often neglect E&M optimization for office visits — where $28K+ in annual coding gap exists before any new programs are added.",
  },
  neurology: {
    name: "Neurology",
    slug: "neurology",
    description: "Revenue analysis for Neurology practices. Complex patient management, care coordination billing, and behavioral health integration.",
    overview: "Neurology practices manage highly complex patients with conditions that require extensive care coordination — Alzheimer's, Parkinson's, MS, and epilepsy all involve multi-specialist management. This complexity supports high-level E&M coding and creates strong CCM eligibility, yet many neurology practices underutilize both.",
    totalProviders: 18400,
    avgMissedRevenue: 102600,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 30400, description: "Neurological conditions involve complex MDM. Benchmark: 24% 99213 / 50% 99214 / 26% 99215." },
      { name: "CCM (99490)", avgGap: 32800, description: "10% adoption. Neurodegenerative disease patients almost universally qualify for CCM." },
      { name: "BHI (99484)", avgGap: 16200, description: "28% depression prevalence — the highest outside psychiatry. Neurology patients are ideal BHI candidates." },
      { name: "RPM (99453-99458)", avgGap: 14600, description: "Seizure monitoring and medication adherence tracking are emerging RPM applications. 5% adoption." },
      { name: "AWV (G0438/G0439)", avgGap: 8600, description: "14% AWV rate. Cognitive screening during AWV is particularly valuable for neurology patients." },
    ],
    relatedGuides: [
      { slug: "bhi-billing-99484", title: "BHI Billing Guide" },
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
    ],
    commonConditions: ["Hypertension (52%)", "Depression (28%)", "Diabetes (28%)", "COPD (10%)", "Heart Failure (10%)"],
    keyInsight: "Neurology has the highest BHI opportunity outside of psychiatry — 28% depression prevalence means nearly 1 in 3 patients could generate BHI revenue on top of existing visit revenue.",
  },
  psychiatry: {
    name: "Psychiatry",
    slug: "psychiatry",
    description: "Revenue intelligence for Psychiatry practices. BHI billing, collaborative care model revenue, and E&M coding benchmarks.",
    overview: "Psychiatry practices have the most natural fit for Behavioral Health Integration billing — yet BHI adoption remains at just 15%. The collaborative care model (CoCM) codes pay significantly more than general BHI and can be billed by psychiatrists serving as consultants to primary care. This represents a major revenue stream most psychiatrists haven't tapped.",
    totalProviders: 48200,
    avgMissedRevenue: 78400,
    topRevenueGaps: [
      { name: "BHI/CoCM (99484/99492-99494)", avgGap: 32400, description: "15% adoption is highest of any specialty but still leaves 85% of the opportunity uncaptured. CoCM codes (99492-99494) pay $130-164/month." },
      { name: "E&M Coding Gap", avgGap: 24200, description: "Medication management and complex psychiatric conditions support moderate-to-high MDM. Many psychiatrists undercode office visits." },
      { name: "CCM (99490)", avgGap: 12800, description: "6% adoption. Patients with psychiatric conditions plus a chronic medical condition qualify for CCM." },
      { name: "AWV (G0438/G0439)", avgGap: 6200, description: "10% AWV rate. Psychiatrists can conduct AWVs when they're the primary Medicare provider for a patient." },
      { name: "RPM (99453-99458)", avgGap: 2800, description: "2% adoption. Medication adherence monitoring is an emerging psychiatric RPM use case." },
    ],
    relatedGuides: [
      { slug: "bhi-billing-99484", title: "BHI Billing Guide" },
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
    ],
    commonConditions: ["Depression (55%)", "Hypertension (40%)", "Diabetes (22%)", "COPD (8%)", "Heart Failure (8%)"],
    keyInsight: "Psychiatrists can serve as CoCM consultants to primary care practices — reviewing cases weekly and earning $130-164/month per patient without face-to-face visits. This is the highest-leverage BHI opportunity.",
  },
  urology: {
    name: "Urology",
    slug: "urology",
    description: "Revenue benchmarks for Urology practices. E&M coding optimization, care management opportunities, and procedure-adjacent billing.",
    overview: "Urology practices manage a large Medicare patient base (500 avg) with moderate chronic disease complexity. E&M coding optimization is the primary revenue opportunity, as many urology visits for complex conditions like prostate cancer management and recurrent UTIs support higher MDM levels than typically coded.",
    totalProviders: 12800,
    avgMissedRevenue: 76200,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 30600, description: "32% 99213 usage is high for a specialty managing cancer and complex surgical follow-ups. Benchmark: 32% 99213 / 48% 99214 / 20% 99215." },
      { name: "CCM (99490)", avgGap: 22400, description: "7% adoption. Patients with BPH plus hypertension or diabetes qualify for CCM." },
      { name: "RPM (99453-99458)", avgGap: 12400, description: "Post-surgical monitoring and chronic condition management via RPM. 4% adoption." },
      { name: "AWV (G0438/G0439)", avgGap: 6800, description: "10% AWV rate. PSA screening discussion is a natural AWV add-on." },
      { name: "BHI (99484)", avgGap: 4000, description: "Prostate cancer diagnosis frequently triggers depression and anxiety. 14% prevalence." },
    ],
    relatedGuides: [
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
    ],
    commonConditions: ["Hypertension (52%)", "Diabetes (28%)", "Depression (14%)", "Heart Failure (10%)", "COPD (8%)"],
    keyInsight: "Urology sees 500 Medicare patients on average — the 3rd highest volume of any specialty. Even small E&M coding improvements across that volume create outsized revenue impact.",
  },
  rheumatology: {
    name: "Rheumatology",
    slug: "rheumatology",
    description: "Revenue analysis for Rheumatology practices. Complex medication management, care coordination billing, and E&M coding benchmarks.",
    overview: "Rheumatology practices manage complex autoimmune conditions requiring intensive medication management (biologics, DMARDs) and multi-specialist coordination. This complexity naturally supports high-level E&M coding and strong CCM eligibility, yet many rheumatologists undercode and haven't adopted care management programs.",
    totalProviders: 6200,
    avgMissedRevenue: 98400,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 28400, description: "Biologic medication management meets high-risk MDM criteria. Benchmark: 25% 99213 / 50% 99214 / 25% 99215." },
      { name: "CCM (99490)", avgGap: 32600, description: "12% adoption. RA patients with comorbid conditions are ideal CCM candidates — medication monitoring alone requires significant coordination." },
      { name: "RPM (99453-99458)", avgGap: 18200, description: "Disease activity monitoring and medication adherence tracking. 6% adoption." },
      { name: "BHI (99484)", avgGap: 10800, description: "Chronic pain and autoimmune conditions are strongly associated with depression (22% prevalence)." },
      { name: "AWV (G0438/G0439)", avgGap: 8400, description: "16% AWV completion. Rheumatology patients benefit from comprehensive preventive screening." },
    ],
    relatedGuides: [
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
      { slug: "bhi-billing-99484", title: "BHI Billing Guide" },
    ],
    commonConditions: ["Hypertension (50%)", "Diabetes (26%)", "Depression (22%)", "COPD (10%)", "Heart Failure (10%)"],
    keyInsight: "Biologic medication management automatically meets the 'high risk' MDM element for 99215 — yet many rheumatologists code these visits as 99214, leaving $84+ per visit on the table.",
  },
  nephrology: {
    name: "Nephrology",
    slug: "nephrology",
    description: "Revenue intelligence for Nephrology practices. CKD management programs, dialysis-adjacent billing, and care management opportunities.",
    overview: "Nephrology practices manage the highest-acuity patients in outpatient medicine, with an average HCC risk score of 1.65 and 4.0 chronic conditions per patient. This creates the strongest care management revenue opportunity of any specialty — CKD patients require intensive medication management, dietary coordination, and multi-specialist communication.",
    totalProviders: 10200,
    avgMissedRevenue: 156200,
    topRevenueGaps: [
      { name: "CCM (99490)", avgGap: 54800, description: "22% adoption is the highest of any specialty, but 78% of the opportunity remains. CKD patients virtually all qualify for CCM." },
      { name: "RPM (99453-99458)", avgGap: 42400, description: "Blood pressure and weight monitoring for CKD patients is critical and highly reimbursable. 12% adoption." },
      { name: "E&M Coding Gap", avgGap: 34200, description: "Complex medication management and high-risk patients support 99215. Benchmark: 20% 99213 / 50% 99214 / 30% 99215." },
      { name: "AWV (G0438/G0439)", avgGap: 14200, description: "14% AWV rate. CKD patients need comprehensive preventive care planning." },
      { name: "BHI (99484)", avgGap: 10600, description: "18% depression prevalence in CKD patients. Dialysis patients especially benefit from behavioral health support." },
    ],
    relatedGuides: [
      { slug: "ccm-billing-99490", title: "CCM Billing Guide (99490)" },
      { slug: "rpm-billing-99453-99458", title: "RPM Billing Guide" },
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
    ],
    commonConditions: ["Hypertension (75%)", "Diabetes (48%)", "Heart Failure (28%)", "Depression (18%)", "COPD (14%)"],
    keyInsight: "Nephrology has the highest per-provider missed revenue ($156K) of any specialty. A single nephrologist with a 200-patient RPM program and full CCM enrollment can add $300K+ in annual revenue.",
  },
  dermatology: {
    name: "Dermatology",
    slug: "dermatology",
    description: "Revenue benchmarks for Dermatology practices. E&M coding optimization, procedure documentation, and emerging care management.",
    overview: "Dermatology has the highest patient volume (550 avg Medicare patients) but the lowest per-patient revenue and care management adoption rates. The primary opportunity is E&M coding optimization — dermatology visits for complex conditions like skin cancer management and chronic dermatitis support higher coding levels than commonly billed.",
    totalProviders: 14200,
    avgMissedRevenue: 52800,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 32400, description: "40% 99213 usage — the highest of any specialty. Skin cancer management, biopsy follow-ups, and complex medication management support 99214+." },
      { name: "CCM (99490)", avgGap: 8400, description: "3% adoption. Patients with psoriasis plus another chronic condition qualify." },
      { name: "AWV (G0438/G0439)", avgGap: 5200, description: "6% AWV rate is the lowest of any specialty. Skin cancer screening can be incorporated into AWV workflow." },
      { name: "RPM (99453-99458)", avgGap: 3800, description: "Wound care monitoring is an emerging RPM application for dermatology. 2% adoption." },
      { name: "BHI (99484)", avgGap: 3000, description: "12% depression prevalence. Chronic skin conditions significantly impact quality of life." },
    ],
    relatedGuides: [
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
    ],
    commonConditions: ["Hypertension (42%)", "Diabetes (20%)", "Depression (12%)", "COPD (6%)", "Heart Failure (6%)"],
    keyInsight: "Dermatology sees the highest patient volume but has the widest E&M coding gap. With 550 Medicare patients, shifting 99213→99214 for just 10% of visits adds $23,000+ annually.",
  },
  "ob-gyn": {
    name: "OB/GYN",
    slug: "ob-gyn",
    description: "Revenue analysis for OB/GYN practices. Medicare wellness billing, preventive care revenue, and behavioral health integration opportunities.",
    overview: "OB/GYN practices have a smaller Medicare panel (280 avg) but strong AWV and BHI opportunities. Many Medicare-age patients see their OB/GYN as a primary care provider, making them eligible for wellness visits and care management programs that OB/GYN practices often don't bill.",
    totalProviders: 22400,
    avgMissedRevenue: 62400,
    topRevenueGaps: [
      { name: "E&M Coding Gap", avgGap: 22800, description: "32% 99213 usage. Complex medication management and menopausal care support higher coding levels." },
      { name: "AWV (G0438/G0439)", avgGap: 14200, description: "22% AWV rate. OB/GYNs who serve as primary Medicare providers can and should bill AWVs." },
      { name: "CCM (99490)", avgGap: 11800, description: "6% adoption. Patients with menopause-related conditions plus hypertension or diabetes qualify." },
      { name: "BHI (99484)", avgGap: 8200, description: "24% depression prevalence — the second highest outside psychiatry and neurology. Postmenopausal depression screening is critical." },
      { name: "RPM (99453-99458)", avgGap: 5400, description: "Blood pressure monitoring for perimenopausal patients. 4% adoption." },
    ],
    relatedGuides: [
      { slug: "awv-billing-g0438-g0439", title: "AWV Billing Guide" },
      { slug: "bhi-billing-99484", title: "BHI Billing Guide" },
      { slug: "em-coding-optimization", title: "E&M Coding Optimization" },
    ],
    commonConditions: ["Hypertension (40%)", "Depression (24%)", "Diabetes (22%)", "COPD (6%)", "Heart Failure (6%)"],
    keyInsight: "OB/GYN practices that serve as primary Medicare providers are leaving $14K+ in AWV revenue alone — a zero-copay service that patients readily accept when offered.",
  },
};

export function getSpecialtyBySlug(slug: string): SpecialtyPageData | undefined {
  return SPECIALTIES[slug];
}

export function getAllSpecialtySlugs(): string[] {
  return Object.keys(SPECIALTIES);
}

export function getAllSpecialties(): SpecialtyPageData[] {
  return Object.values(SPECIALTIES).sort((a, b) => b.avgMissedRevenue - a.avgMissedRevenue);
}

// Get benchmark data for a specialty by slug
export function getBenchmarkForSlug(slug: string) {
  const specialty = SPECIALTIES[slug];
  if (!specialty) return undefined;
  return SPECIALTY_BENCHMARKS[specialty.name];
}
