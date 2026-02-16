import { lookupByNPI } from "@/lib/npi-api";
import { calculateScanResult } from "@/lib/revenue-calc";
import { NPPESProvider, ScanResult } from "@/lib/types";

/**
 * Creates a simulated provider when NPPES lookup returns no results.
 * Uses the NPI as a seed so the same NPI always produces the same demo provider.
 */
export function createDemoProvider(npi: string): NPPESProvider {
  const seed = parseInt(npi.slice(-6), 10);
  const rng = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  const specialties = [
    "Family Medicine",
    "Internal Medicine",
    "Cardiology",
    "Orthopedics",
    "Gastroenterology",
    "Neurology",
    "Pulmonology",
    "Endocrinology",
    "Dermatology",
    "Urology",
  ];
  const cities = [
    { city: "HOUSTON", state: "TX" },
    { city: "CHICAGO", state: "IL" },
    { city: "PHOENIX", state: "AZ" },
    { city: "PHILADELPHIA", state: "PA" },
    { city: "DALLAS", state: "TX" },
    { city: "ATLANTA", state: "GA" },
    { city: "MIAMI", state: "FL" },
    { city: "DENVER", state: "CO" },
    { city: "SEATTLE", state: "WA" },
    { city: "BOSTON", state: "MA" },
  ];
  const firstNames = [
    "JAMES", "ROBERT", "MICHAEL", "DAVID", "RICHARD",
    "SARAH", "JENNIFER", "MARIA", "LISA", "KAREN",
  ];
  const lastNames = [
    "SMITH", "JOHNSON", "WILLIAMS", "BROWN", "JONES",
    "GARCIA", "MILLER", "DAVIS", "RODRIGUEZ", "MARTINEZ",
  ];

  const specialty = specialties[Math.floor(rng(1) * specialties.length)];
  const location = cities[Math.floor(rng(2) * cities.length)];
  const firstName = firstNames[Math.floor(rng(3) * firstNames.length)];
  const lastName = lastNames[Math.floor(rng(4) * lastNames.length)];

  return {
    npi,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    credential: "M.D.",
    specialty,
    taxonomyCode: "208D00000X",
    address: {
      line1: `${Math.floor(rng(5) * 9000 + 1000)} MEDICAL PKWY`,
      line2: `STE ${Math.floor(rng(6) * 400 + 100)}`,
      city: location.city,
      state: location.state,
      zip: `${Math.floor(rng(7) * 90000 + 10000)}`,
    },
    phone: "",
    gender: rng(8) > 0.5 ? "M" : "F",
    entityType: "individual",
  };
}

/**
 * Performs a full scan for a given NPI.
 * Looks up the provider via NPPES, falls back to a deterministic demo provider,
 * then runs the revenue gap calculation.
 */
export async function performScan(npi: string): Promise<ScanResult> {
  let provider = await lookupByNPI(npi);

  if (!provider) {
    provider = createDemoProvider(npi);
  }

  return calculateScanResult(provider);
}
