#!/usr/bin/env npx tsx
/**
 * CMS Medicare Physician & Other Practitioners — Data Processing Script
 *
 * Stream-parses the downloaded CSV and generates:
 *   1. Per-NPI JSON files under data/cms-processed/{first-2-digits}/{npi}.json
 *   2. Specialty benchmark averages under data/cms-processed/benchmarks.json
 *
 * Usage:
 *   npx tsx data/scripts/process-cms.ts
 *   — or —
 *   npm run cms:process
 *
 * The CSV columns we care about (CMS column names):
 *   Rndrng_NPI              — Provider NPI
 *   Rndrng_Prvdr_Last_Org_Name  — Last name / org name
 *   Rndrng_Prvdr_First_Name — First name
 *   Rndrng_Prvdr_Crdntls     — Credentials
 *   Rndrng_Prvdr_Type       — Specialty / provider type
 *   Rndrng_Prvdr_State_Abrvtn — State abbreviation
 *   Rndrng_Prvdr_City       — City
 *   HCPCS_Cd                — HCPCS / CPT code
 *   HCPCS_Desc              — Code description
 *   Tot_Benes               — Total beneficiaries for this code
 *   Tot_Srvcs               — Total services for this code
 *   Tot_Sbmtd_Chrg          — Total submitted charges
 *   Tot_Mdcr_Alowd_Amt      — Total Medicare allowed amount
 *   Tot_Mdcr_Pymt_Amt       — Total Medicare payment amount
 *   Tot_Mdcr_Stdzd_Amt      — Total standardized Medicare payment
 */

import { createReadStream, existsSync, mkdirSync, writeFileSync } from "fs";
import { createInterface } from "readline";
import { join } from "path";

// ── Paths ─────────────────────────────────────────────────

const INPUT_FILE = join(
  process.cwd(),
  "data",
  "cms-raw",
  "medicare-physician-services.csv"
);
const OUTPUT_DIR = join(process.cwd(), "data", "cms-processed");

// ── Types ─────────────────────────────────────────────────

/** Aggregated data we accumulate per NPI as we stream through the CSV */
interface NPIAccumulator {
  npi: string;
  lastName: string;
  firstName: string;
  credential: string;
  specialty: string;
  state: string;
  city: string;
  totalBeneficiaries: number;
  totalServices: number;
  totalMedicarePayment: number;
  /** Services by HCPCS code: { "99213": { services: 120, payment: 11043, beneficiaries: 80 } } */
  hcpcsCodes: Record<
    string,
    { services: number; payment: number; beneficiaries: number }
  >;
}

/** The processed JSON file saved per NPI */
interface ProcessedNPIData {
  npi: string;
  lastName: string;
  firstName: string;
  credential: string;
  specialty: string;
  state: string;
  city: string;
  totalBeneficiaries: number;
  totalServices: number;
  totalMedicarePayment: number;
  // E&M breakdown
  em99211: number;
  em99212: number;
  em99213: number;
  em99214: number;
  em99215: number;
  emTotal: number;
  // Program codes billed
  ccm99490Services: number;
  ccm99490Payment: number;
  rpm99454Services: number;
  rpm99457Services: number;
  rpmPayment: number;
  bhi99484Services: number;
  bhi99484Payment: number;
  awvG0438Services: number;
  awvG0439Services: number;
  awvPayment: number;
  // Top 20 HCPCS codes by payment volume
  topCodes: { code: string; services: number; payment: number; beneficiaries: number }[];
}

/** Specialty-level aggregation for benchmarks */
interface SpecialtyAccumulator {
  providerCount: number;
  totalBeneficiaries: number;
  totalPayment: number;
  totalServices: number;
  // E&M totals across all providers in this specialty
  em99213Total: number;
  em99214Total: number;
  em99215Total: number;
  emTotalAll: number;
  // Program adoption
  ccmProviders: number; // count of providers who billed CCM
  rpmProviders: number;
  bhiProviders: number;
  awvProviders: number;
}

// ── E&M and Program Codes ─────────────────────────────────

const EM_CODES = new Set(["99211", "99212", "99213", "99214", "99215"]);
const CCM_CODES = new Set(["99490", "99439", "99491"]);
const RPM_CODES = new Set(["99453", "99454", "99457", "99458"]);
const BHI_CODES = new Set(["99484", "99492", "99493", "99494"]);
const AWV_CODES = new Set(["G0438", "G0439"]);

// ── CSV Parsing Helpers ───────────────────────────────────

/** Parse a CSV line handling quoted fields with commas inside */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

// ── Main ──────────────────────────────────────────────────

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  NPIxray — CMS Data Processing");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (!existsSync(INPUT_FILE)) {
    console.error(`  ✗ Input file not found: ${INPUT_FILE}`);
    console.error("  Run 'npm run cms:download' first.\n");
    process.exit(1);
  }

  // Ensure output dir
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`  Input: ${INPUT_FILE}`);
  console.log(`  Output: ${OUTPUT_DIR}\n`);
  console.log("  Phase 1: Streaming CSV and aggregating per NPI...\n");

  // ─── Phase 1: Stream and aggregate ───

  const npiMap = new Map<string, NPIAccumulator>();

  const rl = createInterface({
    input: createReadStream(INPUT_FILE, { encoding: "utf-8" }),
    crlfDelay: Infinity,
  });

  let headerMap: Record<string, number> = {};
  let lineNumber = 0;
  let dataRows = 0;
  const startTime = Date.now();

  for await (const line of rl) {
    lineNumber++;

    // First line is the header
    if (lineNumber === 1) {
      const headers = parseCSVLine(line);
      headers.forEach((h, i) => {
        headerMap[h] = i;
      });

      // Validate we have the columns we need
      const required = [
        "Rndrng_NPI",
        "HCPCS_Cd",
        "Tot_Srvcs",
        "Avg_Mdcr_Pymt_Amt",
      ];
      const missing = required.filter((r) => !(r in headerMap));
      if (missing.length > 0) {
        console.error(`  ✗ Missing required columns: ${missing.join(", ")}`);
        console.error(`  Found columns: ${headers.slice(0, 10).join(", ")}...`);
        process.exit(1);
      }

      console.log(`  ✓ Header parsed — ${headers.length} columns`);
      continue;
    }

    // Parse data row
    const fields = parseCSVLine(line);
    dataRows++;

    // Progress indicator
    if (dataRows % 500_000 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      process.stdout.write(
        `\r  Processing record ${dataRows.toLocaleString()}... (${elapsed}s)    `
      );
    }

    // Extract fields
    const npi = fields[headerMap["Rndrng_NPI"]] || "";
    if (!npi || npi.length !== 10) continue; // skip invalid NPIs

    const hcpcsCode = (fields[headerMap["HCPCS_Cd"]] || "").trim();
    const services = parseFloat(fields[headerMap["Tot_Srvcs"]] || "0") || 0;
    const avgPayment =
      parseFloat(fields[headerMap["Avg_Mdcr_Pymt_Amt"]] || "0") || 0;
    const payment = avgPayment * services; // total = avg per service × service count
    const beneficiaries =
      parseFloat(fields[headerMap["Tot_Benes"]] || "0") || 0;

    // Get or create accumulator for this NPI
    let acc = npiMap.get(npi);
    if (!acc) {
      acc = {
        npi,
        lastName: fields[headerMap["Rndrng_Prvdr_Last_Org_Name"]] || "",
        firstName: fields[headerMap["Rndrng_Prvdr_First_Name"]] || "",
        credential: fields[headerMap["Rndrng_Prvdr_Crdntls"]] || "",
        specialty: fields[headerMap["Rndrng_Prvdr_Type"]] || "",
        state: fields[headerMap["Rndrng_Prvdr_State_Abrvtn"]] || "",
        city: fields[headerMap["Rndrng_Prvdr_City"]] || "",
        totalBeneficiaries: 0,
        totalServices: 0,
        totalMedicarePayment: 0,
        hcpcsCodes: {},
      };
      npiMap.set(npi, acc);
    }

    // Accumulate totals
    acc.totalServices += services;
    acc.totalMedicarePayment += payment;
    // Beneficiaries is per-code so we track a max unique
    if (beneficiaries > acc.totalBeneficiaries) {
      acc.totalBeneficiaries = beneficiaries;
    }

    // Accumulate per-HCPCS
    if (hcpcsCode) {
      if (!acc.hcpcsCodes[hcpcsCode]) {
        acc.hcpcsCodes[hcpcsCode] = { services: 0, payment: 0, beneficiaries: 0 };
      }
      acc.hcpcsCodes[hcpcsCode].services += services;
      acc.hcpcsCodes[hcpcsCode].payment += payment;
      acc.hcpcsCodes[hcpcsCode].beneficiaries += beneficiaries;
    }
  }

  console.log(
    `\r  ✓ Processed ${dataRows.toLocaleString()} records → ${npiMap.size.toLocaleString()} unique NPIs                \n`
  );

  // ─── Phase 2: Write per-NPI JSON files ───

  console.log("  Phase 2: Writing per-NPI JSON files...\n");

  let filesWritten = 0;
  const specialtyMap = new Map<string, SpecialtyAccumulator>();

  for (const [npi, acc] of npiMap) {
    // Extract E&M counts
    const em99211 = acc.hcpcsCodes["99211"]?.services ?? 0;
    const em99212 = acc.hcpcsCodes["99212"]?.services ?? 0;
    const em99213 = acc.hcpcsCodes["99213"]?.services ?? 0;
    const em99214 = acc.hcpcsCodes["99214"]?.services ?? 0;
    const em99215 = acc.hcpcsCodes["99215"]?.services ?? 0;
    const emTotal = em99211 + em99212 + em99213 + em99214 + em99215;

    // CCM
    const ccm99490Services = acc.hcpcsCodes["99490"]?.services ?? 0;
    const ccm99490Payment = sumCodePayment(acc, CCM_CODES);

    // RPM
    const rpm99454Services = acc.hcpcsCodes["99454"]?.services ?? 0;
    const rpm99457Services = acc.hcpcsCodes["99457"]?.services ?? 0;
    const rpmPayment = sumCodePayment(acc, RPM_CODES);

    // BHI
    const bhi99484Services = acc.hcpcsCodes["99484"]?.services ?? 0;
    const bhi99484Payment = sumCodePayment(acc, BHI_CODES);

    // AWV
    const awvG0438Services = acc.hcpcsCodes["G0438"]?.services ?? 0;
    const awvG0439Services = acc.hcpcsCodes["G0439"]?.services ?? 0;
    const awvPayment = sumCodePayment(acc, AWV_CODES);

    // Top codes by payment
    const topCodes = Object.entries(acc.hcpcsCodes)
      .map(([code, d]) => ({
        code,
        services: Math.round(d.services),
        payment: Math.round(d.payment),
        beneficiaries: Math.round(d.beneficiaries),
      }))
      .sort((a, b) => b.payment - a.payment)
      .slice(0, 20);

    const processed: ProcessedNPIData = {
      npi,
      lastName: acc.lastName,
      firstName: acc.firstName,
      credential: acc.credential,
      specialty: acc.specialty,
      state: acc.state,
      city: acc.city,
      totalBeneficiaries: Math.round(acc.totalBeneficiaries),
      totalServices: Math.round(acc.totalServices),
      totalMedicarePayment: Math.round(acc.totalMedicarePayment),
      em99211: Math.round(em99211),
      em99212: Math.round(em99212),
      em99213: Math.round(em99213),
      em99214: Math.round(em99214),
      em99215: Math.round(em99215),
      emTotal: Math.round(emTotal),
      ccm99490Services: Math.round(ccm99490Services),
      ccm99490Payment: Math.round(ccm99490Payment),
      rpm99454Services: Math.round(rpm99454Services),
      rpm99457Services: Math.round(rpm99457Services),
      rpmPayment: Math.round(rpmPayment),
      bhi99484Services: Math.round(bhi99484Services),
      bhi99484Payment: Math.round(bhi99484Payment),
      awvG0438Services: Math.round(awvG0438Services),
      awvG0439Services: Math.round(awvG0439Services),
      awvPayment: Math.round(awvPayment),
      topCodes,
    };

    // Save to data/cms-processed/{first-2-digits}/{npi}.json
    const prefix = npi.slice(0, 2);
    const dir = join(OUTPUT_DIR, prefix);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(join(dir, `${npi}.json`), JSON.stringify(processed));

    filesWritten++;
    if (filesWritten % 50_000 === 0) {
      process.stdout.write(
        `\r  Writing NPI files... ${filesWritten.toLocaleString()} / ${npiMap.size.toLocaleString()}    `
      );
    }

    // ─── Aggregate for specialty benchmarks ───
    const specialty = normalizeSpecialty(acc.specialty);
    if (!specialty) continue;

    let sa = specialtyMap.get(specialty);
    if (!sa) {
      sa = {
        providerCount: 0,
        totalBeneficiaries: 0,
        totalPayment: 0,
        totalServices: 0,
        em99213Total: 0,
        em99214Total: 0,
        em99215Total: 0,
        emTotalAll: 0,
        ccmProviders: 0,
        rpmProviders: 0,
        bhiProviders: 0,
        awvProviders: 0,
      };
      specialtyMap.set(specialty, sa);
    }

    sa.providerCount++;
    sa.totalBeneficiaries += acc.totalBeneficiaries;
    sa.totalPayment += acc.totalMedicarePayment;
    sa.totalServices += acc.totalServices;
    sa.em99213Total += em99213;
    sa.em99214Total += em99214;
    sa.em99215Total += em99215;
    sa.emTotalAll += emTotal;
    if (ccm99490Services > 0) sa.ccmProviders++;
    if (rpm99454Services > 0 || rpm99457Services > 0) sa.rpmProviders++;
    if (bhi99484Services > 0) sa.bhiProviders++;
    if (awvG0438Services > 0 || awvG0439Services > 0) sa.awvProviders++;
  }

  console.log(
    `\r  ✓ Wrote ${filesWritten.toLocaleString()} NPI files                            \n`
  );

  // ─── Phase 3: Generate specialty benchmarks ───

  console.log("  Phase 3: Generating specialty benchmark averages...\n");

  const benchmarks: Record<
    string,
    {
      specialty: string;
      providerCount: number;
      avgMedicarePatients: number;
      avgRevenuePerPatient: number;
      avgTotalPayment: number;
      avgTotalServices: number;
      pct99213: number;
      pct99214: number;
      pct99215: number;
      ccmAdoptionRate: number;
      rpmAdoptionRate: number;
      bhiAdoptionRate: number;
      awvAdoptionRate: number;
    }
  > = {};

  for (const [specialty, sa] of specialtyMap) {
    if (sa.providerCount < 10) continue; // skip tiny specialties

    const avgPatients = sa.totalBeneficiaries / sa.providerCount;
    const avgPayment = sa.totalPayment / sa.providerCount;
    const avgRevPerPatient = avgPatients > 0 ? avgPayment / avgPatients : 0;
    const emTotal = sa.emTotalAll || 1;

    benchmarks[specialty] = {
      specialty,
      providerCount: sa.providerCount,
      avgMedicarePatients: Math.round(avgPatients),
      avgRevenuePerPatient: Math.round(avgRevPerPatient),
      avgTotalPayment: Math.round(avgPayment),
      avgTotalServices: Math.round(sa.totalServices / sa.providerCount),
      pct99213: parseFloat((sa.em99213Total / emTotal).toFixed(4)),
      pct99214: parseFloat((sa.em99214Total / emTotal).toFixed(4)),
      pct99215: parseFloat((sa.em99215Total / emTotal).toFixed(4)),
      ccmAdoptionRate: parseFloat(
        (sa.ccmProviders / sa.providerCount).toFixed(4)
      ),
      rpmAdoptionRate: parseFloat(
        (sa.rpmProviders / sa.providerCount).toFixed(4)
      ),
      bhiAdoptionRate: parseFloat(
        (sa.bhiProviders / sa.providerCount).toFixed(4)
      ),
      awvAdoptionRate: parseFloat(
        (sa.awvProviders / sa.providerCount).toFixed(4)
      ),
    };
  }

  // Sort by provider count descending
  const sortedBenchmarks = Object.fromEntries(
    Object.entries(benchmarks).sort(([, a], [, b]) => b.providerCount - a.providerCount)
  );

  const benchmarkFile = join(OUTPUT_DIR, "benchmarks.json");
  writeFileSync(benchmarkFile, JSON.stringify(sortedBenchmarks, null, 2));

  console.log(`  ✓ Generated benchmarks for ${Object.keys(sortedBenchmarks).length} specialties`);
  console.log(`  Saved to: ${benchmarkFile}\n`);

  // ─── Summary ───

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);

  // Top 10 specialties by provider count
  const top10 = Object.values(sortedBenchmarks).slice(0, 10);

  console.log("  ━━ Processing Complete ━━\n");
  console.log(`  Records processed:   ${dataRows.toLocaleString()}`);
  console.log(`  Unique NPIs:         ${npiMap.size.toLocaleString()}`);
  console.log(`  NPI files written:   ${filesWritten.toLocaleString()}`);
  console.log(`  Specialty benchmarks: ${Object.keys(sortedBenchmarks).length}`);
  console.log(`  Elapsed:             ${elapsed}s\n`);

  console.log("  Top 10 Specialties:");
  console.log("  ─────────────────────────────────────────────────");
  for (const b of top10) {
    const pad = b.specialty.padEnd(30);
    console.log(
      `  ${pad} ${b.providerCount.toLocaleString().padStart(8)} providers   avg $${b.avgTotalPayment.toLocaleString().padStart(8)}`
    );
  }
  console.log("");
}

// ── Helpers ───────────────────────────────────────────────

function sumCodePayment(acc: NPIAccumulator, codes: Set<string>): number {
  let total = 0;
  for (const code of codes) {
    if (acc.hcpcsCodes[code]) {
      total += acc.hcpcsCodes[code].payment;
    }
  }
  return total;
}

/**
 * Normalize CMS specialty names to our internal specialty names.
 * CMS uses verbose strings like "Internal Medicine", "Family Practice", etc.
 */
function normalizeSpecialty(cmsSpecialty: string): string | null {
  const s = cmsSpecialty.trim();
  const map: Record<string, string> = {
    // Primary care
    "Internal Medicine": "Internal Medicine",
    "Family Practice": "Family Medicine",
    "Family Medicine": "Family Medicine",
    "General Practice": "General Practice",
    // Specialties
    Cardiology: "Cardiology",
    "Cardiovascular Disease": "Cardiology",
    "Cardiovascular Disease (Cardiology)": "Cardiology",
    "Pulmonary Disease": "Pulmonology",
    Pulmonology: "Pulmonology",
    Endocrinology: "Endocrinology",
    "Endocrinology, Diabetes & Metabolism": "Endocrinology",
    Nephrology: "Nephrology",
    "Orthopedic Surgery": "Orthopedics",
    Orthopedics: "Orthopedics",
    Gastroenterology: "Gastroenterology",
    Neurology: "Neurology",
    Psychiatry: "Psychiatry",
    "Psychiatry & Neurology": "Psychiatry",
    Urology: "Urology",
    Rheumatology: "Rheumatology",
    Dermatology: "Dermatology",
    "Obstetrics & Gynecology": "OB/GYN",
    "Obstetrics/Gynecology": "OB/GYN",
    "OB/GYN": "OB/GYN",
    // Additional common specialties we could support later
    "Hematology/Oncology": "Hematology/Oncology",
    "Hematology & Oncology": "Hematology/Oncology",
    "Medical Oncology": "Hematology/Oncology",
    "Infectious Disease": "Infectious Disease",
    "Allergy/Immunology": "Allergy/Immunology",
    "Physical Medicine and Rehabilitation": "Physical Medicine",
    "Geriatric Medicine": "Geriatric Medicine",
    "Critical Care (Intensivists)": "Critical Care",
  };

  return map[s] ?? null;
}

main().catch((err) => {
  console.error("\n  ✗ Processing failed:", err.message);
  console.error(err.stack);
  process.exit(1);
});
