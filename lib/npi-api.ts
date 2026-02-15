import { NPPESProvider } from "./types";

const NPPES_BASE = "https://npiregistry.cms.hhs.gov/api/?version=2.1";

interface NPPESResponse {
  result_count: number;
  results: NPPESResult[];
}

interface NPPESResult {
  number: string;
  enumeration_type: string;
  basic: {
    first_name?: string;
    last_name?: string;
    organization_name?: string;
    credential?: string;
    gender?: string;
    enumeration_date?: string;
    name_prefix?: string;
    status: string;
  };
  taxonomies: {
    code: string;
    taxonomy_group: string;
    desc: string;
    state: string;
    license: string;
    primary: boolean;
  }[];
  addresses: {
    country_code: string;
    country_name: string;
    address_purpose: string;
    address_type: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postal_code: string;
    telephone_number: string;
  }[];
}

function mapTaxonomyToSpecialty(taxonomyDesc: string): string {
  const desc = taxonomyDesc.toLowerCase();
  const map: Record<string, string> = {
    "family medicine": "Family Medicine",
    "family practice": "Family Medicine",
    "internal medicine": "Internal Medicine",
    "general practice": "General Practice",
    cardiology: "Cardiology",
    "cardiovascular disease": "Cardiology",
    pulmonary: "Pulmonology",
    pulmonology: "Pulmonology",
    endocrinology: "Endocrinology",
    "endocrinology, diabetes": "Endocrinology",
    orthopedic: "Orthopedics",
    orthopaedic: "Orthopedics",
    gastroenterology: "Gastroenterology",
    neurology: "Neurology",
    psychiatry: "Psychiatry",
    urology: "Urology",
    rheumatology: "Rheumatology",
    nephrology: "Nephrology",
    dermatology: "Dermatology",
    "obstetrics & gynecology": "OB/GYN",
    "obstetrics": "OB/GYN",
    "gynecology": "OB/GYN",
  };

  for (const [key, value] of Object.entries(map)) {
    if (desc.includes(key)) return value;
  }
  return "Internal Medicine"; // default fallback
}

function parseResult(r: NPPESResult): NPPESProvider {
  const isOrg = r.enumeration_type === "NPI-2";
  const primaryTaxonomy = r.taxonomies?.find((t) => t.primary) || r.taxonomies?.[0];
  const practiceAddress =
    r.addresses?.find((a) => a.address_purpose === "LOCATION") ||
    r.addresses?.[0];

  return {
    npi: r.number,
    firstName: isOrg ? "" : r.basic?.first_name || "",
    lastName: isOrg ? r.basic?.organization_name || "" : r.basic?.last_name || "",
    fullName: isOrg
      ? r.basic?.organization_name || ""
      : `${r.basic?.first_name || ""} ${r.basic?.last_name || ""}`.trim(),
    credential: r.basic?.credential || "",
    specialty: primaryTaxonomy
      ? mapTaxonomyToSpecialty(primaryTaxonomy.desc)
      : "Internal Medicine",
    taxonomyCode: primaryTaxonomy?.code || "",
    address: {
      line1: practiceAddress?.address_1 || "",
      line2: practiceAddress?.address_2 || "",
      city: practiceAddress?.city || "",
      state: practiceAddress?.state || "",
      zip: practiceAddress?.postal_code?.substring(0, 5) || "",
    },
    phone: practiceAddress?.telephone_number || "",
    gender: r.basic?.gender || "",
    entityType: isOrg ? "organization" : "individual",
  };
}

export async function lookupByNPI(npi: string): Promise<NPPESProvider | null> {
  const res = await fetch(`${NPPES_BASE}&number=${encodeURIComponent(npi)}`);
  if (!res.ok) throw new Error(`NPPES API error: ${res.status}`);

  const data: NPPESResponse = await res.json();
  if (!data.result_count || !data.results?.length) return null;

  return parseResult(data.results[0]);
}

export async function searchByName(
  lastName: string,
  firstName?: string,
  state?: string
): Promise<NPPESProvider[]> {
  const params = new URLSearchParams();
  params.set("version", "2.1");
  params.set("last_name", lastName);
  if (firstName) params.set("first_name", firstName);
  if (state) params.set("state", state);
  params.set("limit", "20");
  params.set("enumeration_type", "NPI-1"); // individuals only

  const res = await fetch(
    `https://npiregistry.cms.hhs.gov/api/?${params.toString()}`
  );
  if (!res.ok) throw new Error(`NPPES API error: ${res.status}`);

  const data: NPPESResponse = await res.json();
  if (!data.result_count || !data.results?.length) return [];

  return data.results.map(parseResult);
}
