export interface SpecialtyBenchmark {
  specialty: string;
  providerCount: number;
  avgMedicarePatients: number;
  avgTotalPayment: number;
  avgRevenuePerPatient: number;
  pct99213: number;
  pct99214: number;
  pct99215: number;
  ccmAdoptionRate: number;
  rpmAdoptionRate: number;
  bhiAdoptionRate: number;
  awvAdoptionRate: number;
}

export const BENCHMARKS: Record<string, SpecialtyBenchmark> = {
  "Internal Medicine": {
    specialty: "Internal Medicine",
    providerCount: 88703,
    avgMedicarePatients: 169,
    avgTotalPayment: 77297,
    avgRevenuePerPatient: 457,
    pct99213: 0.2988,
    pct99214: 0.6073,
    pct99215: 0.0665,
    ccmAdoptionRate: 0.045,
    rpmAdoptionRate: 0.0199,
    bhiAdoptionRate: 0.0011,
    awvAdoptionRate: 0.3536,
  },
  "Family Medicine": {
    specialty: "Family Medicine",
    providerCount: 78514,
    avgMedicarePatients: 144,
    avgTotalPayment: 55556,
    avgRevenuePerPatient: 385,
    pct99213: 0.3221,
    pct99214: 0.6133,
    pct99215: 0.0416,
    ccmAdoptionRate: 0.052,
    rpmAdoptionRate: 0.0172,
    bhiAdoptionRate: 0.0014,
    awvAdoptionRate: 0.5352,
  },
  "Orthopedics": {
    specialty: "Orthopedics",
    providerCount: 20699,
    avgMedicarePatients: 160,
    avgTotalPayment: 102233,
    avgRevenuePerPatient: 638,
    pct99213: 0.5388,
    pct99214: 0.3856,
    pct99215: 0.0222,
    ccmAdoptionRate: 0.0015,
    rpmAdoptionRate: 0.0022,
    bhiAdoptionRate: 0,
    awvAdoptionRate: 0.0002,
  },
  "Cardiology": {
    specialty: "Cardiology",
    providerCount: 19399,
    avgMedicarePatients: 480,
    avgTotalPayment: 179674,
    avgRevenuePerPatient: 374,
    pct99213: 0.1611,
    pct99214: 0.7367,
    pct99215: 0.083,
    ccmAdoptionRate: 0.0235,
    rpmAdoptionRate: 0.0405,
    bhiAdoptionRate: 0.0002,
    awvAdoptionRate: 0.0113,
  },
  "Psychiatry": {
    specialty: "Psychiatry",
    providerCount: 18253,
    avgMedicarePatients: 82,
    avgTotalPayment: 31564,
    avgRevenuePerPatient: 385,
    pct99213: 0.35,
    pct99214: 0.5,
    pct99215: 0.1,
    ccmAdoptionRate: 0.001,
    rpmAdoptionRate: 0.001,
    bhiAdoptionRate: 0.05,
    awvAdoptionRate: 0.01,
  },
  "OB/GYN": {
    specialty: "OB/GYN",
    providerCount: 17962,
    avgMedicarePatients: 45,
    avgTotalPayment: 15432,
    avgRevenuePerPatient: 343,
    pct99213: 0.45,
    pct99214: 0.45,
    pct99215: 0.05,
    ccmAdoptionRate: 0.001,
    rpmAdoptionRate: 0.001,
    bhiAdoptionRate: 0.001,
    awvAdoptionRate: 0.05,
  },
  "Neurology": {
    specialty: "Neurology",
    providerCount: 15573,
    avgMedicarePatients: 220,
    avgTotalPayment: 79417,
    avgRevenuePerPatient: 361,
    pct99213: 0.25,
    pct99214: 0.6,
    pct99215: 0.1,
    ccmAdoptionRate: 0.02,
    rpmAdoptionRate: 0.015,
    bhiAdoptionRate: 0.005,
    awvAdoptionRate: 0.05,
  },
  "Gastroenterology": {
    specialty: "Gastroenterology",
    providerCount: 14124,
    avgMedicarePatients: 280,
    avgTotalPayment: 76335,
    avgRevenuePerPatient: 273,
    pct99213: 0.35,
    pct99214: 0.55,
    pct99215: 0.05,
    ccmAdoptionRate: 0.01,
    rpmAdoptionRate: 0.005,
    bhiAdoptionRate: 0.001,
    awvAdoptionRate: 0.02,
  },
  "Dermatology": {
    specialty: "Dermatology",
    providerCount: 12160,
    avgMedicarePatients: 350,
    avgTotalPayment: 224383,
    avgRevenuePerPatient: 641,
    pct99213: 0.5,
    pct99214: 0.4,
    pct99215: 0.03,
    ccmAdoptionRate: 0.001,
    rpmAdoptionRate: 0.001,
    bhiAdoptionRate: 0.001,
    awvAdoptionRate: 0.01,
  },
  "Pulmonology": {
    specialty: "Pulmonology",
    providerCount: 10381,
    avgMedicarePatients: 300,
    avgTotalPayment: 95480,
    avgRevenuePerPatient: 318,
    pct99213: 0.2,
    pct99214: 0.65,
    pct99215: 0.1,
    ccmAdoptionRate: 0.04,
    rpmAdoptionRate: 0.05,
    bhiAdoptionRate: 0.002,
    awvAdoptionRate: 0.08,
  },
  "Urology": {
    specialty: "Urology",
    providerCount: 9500,
    avgMedicarePatients: 250,
    avgTotalPayment: 85000,
    avgRevenuePerPatient: 340,
    pct99213: 0.4,
    pct99214: 0.5,
    pct99215: 0.05,
    ccmAdoptionRate: 0.01,
    rpmAdoptionRate: 0.005,
    bhiAdoptionRate: 0.001,
    awvAdoptionRate: 0.02,
  },
  "Endocrinology": {
    specialty: "Endocrinology",
    providerCount: 6500,
    avgMedicarePatients: 280,
    avgTotalPayment: 72000,
    avgRevenuePerPatient: 257,
    pct99213: 0.25,
    pct99214: 0.6,
    pct99215: 0.1,
    ccmAdoptionRate: 0.06,
    rpmAdoptionRate: 0.04,
    bhiAdoptionRate: 0.003,
    awvAdoptionRate: 0.1,
  },
  "Nephrology": {
    specialty: "Nephrology",
    providerCount: 8500,
    avgMedicarePatients: 200,
    avgTotalPayment: 90000,
    avgRevenuePerPatient: 450,
    pct99213: 0.2,
    pct99214: 0.65,
    pct99215: 0.1,
    ccmAdoptionRate: 0.05,
    rpmAdoptionRate: 0.03,
    bhiAdoptionRate: 0.002,
    awvAdoptionRate: 0.05,
  },
  "Rheumatology": {
    specialty: "Rheumatology",
    providerCount: 5200,
    avgMedicarePatients: 220,
    avgTotalPayment: 65000,
    avgRevenuePerPatient: 295,
    pct99213: 0.3,
    pct99214: 0.55,
    pct99215: 0.1,
    ccmAdoptionRate: 0.03,
    rpmAdoptionRate: 0.02,
    bhiAdoptionRate: 0.002,
    awvAdoptionRate: 0.06,
  },
  "Hematology/Oncology": {
    specialty: "Hematology/Oncology",
    providerCount: 9000,
    avgMedicarePatients: 300,
    avgTotalPayment: 150000,
    avgRevenuePerPatient: 500,
    pct99213: 0.2,
    pct99214: 0.6,
    pct99215: 0.15,
    ccmAdoptionRate: 0.02,
    rpmAdoptionRate: 0.01,
    bhiAdoptionRate: 0.005,
    awvAdoptionRate: 0.03,
  },
  "Infectious Disease": {
    specialty: "Infectious Disease",
    providerCount: 5000,
    avgMedicarePatients: 180,
    avgTotalPayment: 68000,
    avgRevenuePerPatient: 378,
    pct99213: 0.25,
    pct99214: 0.6,
    pct99215: 0.1,
    ccmAdoptionRate: 0.03,
    rpmAdoptionRate: 0.02,
    bhiAdoptionRate: 0.002,
    awvAdoptionRate: 0.04,
  },
  "Allergy/Immunology": {
    specialty: "Allergy/Immunology",
    providerCount: 4000,
    avgMedicarePatients: 150,
    avgTotalPayment: 55000,
    avgRevenuePerPatient: 367,
    pct99213: 0.4,
    pct99214: 0.45,
    pct99215: 0.05,
    ccmAdoptionRate: 0.01,
    rpmAdoptionRate: 0.005,
    bhiAdoptionRate: 0.001,
    awvAdoptionRate: 0.03,
  },
  "Physical Medicine": {
    specialty: "Physical Medicine",
    providerCount: 3500,
    avgMedicarePatients: 200,
    avgTotalPayment: 60000,
    avgRevenuePerPatient: 300,
    pct99213: 0.35,
    pct99214: 0.5,
    pct99215: 0.08,
    ccmAdoptionRate: 0.01,
    rpmAdoptionRate: 0.02,
    bhiAdoptionRate: 0.003,
    awvAdoptionRate: 0.02,
  },
  "Geriatric Medicine": {
    specialty: "Geriatric Medicine",
    providerCount: 2500,
    avgMedicarePatients: 250,
    avgTotalPayment: 70000,
    avgRevenuePerPatient: 280,
    pct99213: 0.25,
    pct99214: 0.55,
    pct99215: 0.15,
    ccmAdoptionRate: 0.1,
    rpmAdoptionRate: 0.06,
    bhiAdoptionRate: 0.01,
    awvAdoptionRate: 0.4,
  },
  "Critical Care": {
    specialty: "Critical Care",
    providerCount: 3000,
    avgMedicarePatients: 150,
    avgTotalPayment: 120000,
    avgRevenuePerPatient: 800,
    pct99213: 0.15,
    pct99214: 0.55,
    pct99215: 0.2,
    ccmAdoptionRate: 0.02,
    rpmAdoptionRate: 0.03,
    bhiAdoptionRate: 0.005,
    awvAdoptionRate: 0.02,
  },
};

export const SPECIALTY_LIST = Object.keys(BENCHMARKS);

/**
 * Convert a specialty name to a URL-safe slug.
 * Client-safe version (no Node.js deps) matching the logic in db-queries.ts.
 */
export function specialtyToSlug(specialty: string): string {
  return specialty.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "").replace(/^-+/, "");
}

export const STATE_LIST: { abbr: string; name: string }[] = [
  { abbr: "AL", name: "Alabama" },
  { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" },
  { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" },
  { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" },
  { abbr: "DE", name: "Delaware" },
  { abbr: "DC", name: "District of Columbia" },
  { abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" },
  { abbr: "HI", name: "Hawaii" },
  { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" },
  { abbr: "IN", name: "Indiana" },
  { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" },
  { abbr: "KY", name: "Kentucky" },
  { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" },
  { abbr: "MD", name: "Maryland" },
  { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" },
  { abbr: "MN", name: "Minnesota" },
  { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" },
  { abbr: "MT", name: "Montana" },
  { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" },
  { abbr: "NH", name: "New Hampshire" },
  { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" },
  { abbr: "NY", name: "New York" },
  { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" },
  { abbr: "OH", name: "Ohio" },
  { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" },
  { abbr: "PA", name: "Pennsylvania" },
  { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" },
  { abbr: "SD", name: "South Dakota" },
  { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" },
  { abbr: "UT", name: "Utah" },
  { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" },
  { abbr: "WA", name: "Washington" },
  { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" },
  { abbr: "WY", name: "Wyoming" },
];

/**
 * Top ~200 most commonly billed HCPCS/CPT codes in Medicare.
 * Used for sitemap generation to avoid DB dependency.
 * Source: CMS Medicare Physician & Other Practitioners dataset.
 * These codes are stable — update annually when CMS releases new data.
 */
export const TOP_BILLING_CODES: string[] = [
  // E&M Office/Outpatient Visits (Established)
  "99211", "99212", "99213", "99214", "99215",
  // E&M Office/Outpatient Visits (New Patient)
  "99202", "99203", "99204", "99205",
  // E&M Hospital Inpatient (Initial)
  "99221", "99222", "99223",
  // E&M Hospital Inpatient (Subsequent)
  "99231", "99232", "99233",
  // E&M Hospital Discharge
  "99238", "99239",
  // E&M Emergency Department
  "99281", "99282", "99283", "99284", "99285",
  // E&M Observation
  "99217", "99218", "99219", "99220",
  // E&M Nursing Facility
  "99304", "99305", "99306", "99307", "99308", "99309", "99310",
  // E&M Home/Residence
  "99341", "99342", "99344", "99345", "99347", "99348", "99349", "99350",
  // Chronic Care Management (CCM)
  "99490", "99491", "99437", "99439",
  // Remote Patient Monitoring (RPM)
  "99453", "99454", "99457", "99458",
  // Behavioral Health Integration (BHI/CoCM)
  "99484", "99492", "99493", "99494",
  // Annual Wellness Visits
  "G0438", "G0439", "G0402",
  // Transitional Care Management
  "99495", "99496",
  // Telehealth/Phone E&M
  "99441", "99442", "99443",
  // Prolonged Services
  "99354", "99355", "99356", "99357", "99417",
  // Critical Care
  "99291", "99292",
  // Consultations (Inpatient)
  "99251", "99252", "99253", "99254", "99255",
  // Preventive Medicine
  "99381", "99382", "99383", "99384", "99385", "99386", "99387",
  "99391", "99392", "99393", "99394", "99395", "99396", "99397",
  // Minor Procedures - Skin
  "10060", "10061", "10120", "10121", "10140", "10160",
  "11042", "11043", "11044",
  "11102", "11104", "11106",
  "11200", "11201",
  "11300", "11301", "11302", "11303",
  "11400", "11401", "11402", "11403", "11404", "11406",
  "11440", "11441", "11442", "11443",
  "11600", "11601", "11602", "11603", "11604", "11606",
  "11719", "11720", "11721", "11730", "11740", "11750",
  // Destruction/Lesion Removal
  "17000", "17003", "17004", "17110", "17111",
  // Injections & Joint Procedures
  "20550", "20551", "20552", "20553",
  "20600", "20605", "20610", "20611",
  // Drug Administration
  "96372", "96373", "96374", "96375",
  // Immunizations
  "90471", "90472", "90656", "90658", "90662",
  // Common Drug Codes
  "J0585", "J1030", "J1040", "J1050", "J1071", "J3301", "J3303",
  // ECG/Cardiac
  "93000", "93005", "93010", "93015", "93016", "93017", "93018",
  // Echocardiography
  "93303", "93304", "93306", "93307", "93308", "93350", "93351",
  // Vascular Studies
  "93880", "93882", "93922", "93923", "93925", "93926", "93970", "93971",
  // Pulmonary Function
  "94010", "94060", "94375", "94664", "94726", "94727", "94729",
  // Ophthalmology
  "92004", "92012", "92014", "92015", "92083", "92133", "92134", "92250",
  // Radiology - Chest/Spine
  "71046", "71250", "71260", "72148", "72170",
  // Radiology - Extremities
  "73030", "73060", "73070", "73080", "73090", "73100", "73110", "73120", "73130",
  "73560", "73562", "73564", "73590", "73600", "73610", "73620", "73630",
  // Ultrasound
  "76512", "76514", "76519", "76770", "76856", "76857",
  // DEXA
  "77080", "77081",
  // Lab - Venipuncture
  "36415", "36416",
  // Lab - Panels
  "80048", "80050", "80053", "80061",
  // Lab - Urinalysis
  "81001", "81002", "81003",
  // Lab - Chemistry
  "82043", "82947", "82950", "82962", "83036", "84443",
  // Lab - Hematology
  "85025", "85027",
  // Lab - Microbiology
  "87086", "87088",
  // Psychiatry/Psychotherapy
  "90791", "90792",
  "90832", "90833", "90834", "90836", "90837", "90838",
  "90839", "90840", "90846", "90847", "90853",
  // Physical Therapy/Rehab
  "97110", "97112", "97116", "97140", "97161", "97162", "97163", "97530", "97535",
  // GI Endoscopy
  "43239", "43249", "45378", "45380", "45385",
];
