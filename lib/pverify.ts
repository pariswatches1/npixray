/**
 * pVerify API client for real-time eligibility verification.
 *
 * OAuth 2.0 client credentials flow with automatic token refresh.
 * Supports single and batch eligibility checks.
 *
 * Docs: https://docs.pverify.com/
 */

// ── Types ─────────────────────────────────────────────────

export interface PVerifyConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
}

export interface EligibilityRequest {
  payerCode: string;
  payerName?: string;
  providerNpi: string;
  providerLastName?: string;
  providerFirstName?: string;
  subscriberId: string;
  memberFirstName: string;
  memberLastName: string;
  memberDob: string; // MM/DD/YYYY
  dateOfService?: string; // MM/DD/YYYY
  isSubscriberPatient?: boolean;
}

export interface EligibilityResponse {
  requestId: string;
  isSuccess: boolean;
  status: "Active" | "Inactive" | "Unknown" | "Error";
  payerName: string;
  planName: string;
  planType: string;
  groupNumber: string;
  subscriberId: string;
  eligibilityStartDate: string;
  eligibilityEndDate: string;
  copay: CopayInfo | null;
  deductible: DeductibleInfo | null;
  outOfPocket: OutOfPocketInfo | null;
  coinsurance: CoinsuranceInfo | null;
  planCoverageDescription: string;
  serviceTypes: string[];
  errorMessage: string | null;
  rawResponse?: Record<string, unknown>;
}

export interface CopayInfo {
  inNetwork: number | null;
  outOfNetwork: number | null;
  specialist: number | null;
  urgentCare: number | null;
  emergencyRoom: number | null;
}

export interface DeductibleInfo {
  individual: {
    inNetwork: number | null;
    outOfNetwork: number | null;
    remaining: number | null;
  };
  family: {
    inNetwork: number | null;
    outOfNetwork: number | null;
    remaining: number | null;
  };
}

export interface OutOfPocketInfo {
  individual: {
    inNetwork: number | null;
    outOfNetwork: number | null;
    remaining: number | null;
  };
  family: {
    inNetwork: number | null;
    outOfNetwork: number | null;
    remaining: number | null;
  };
}

export interface CoinsuranceInfo {
  inNetwork: number | null;
  outOfNetwork: number | null;
}

export interface BatchEligibilityResult {
  request: EligibilityRequest;
  response: EligibilityResponse | null;
  error: string | null;
}

// ── Common payer codes ────────────────────────────────────

export const COMMON_PAYERS: { code: string; name: string }[] = [
  { code: "00001", name: "Medicare" },
  { code: "00002", name: "Medicaid" },
  { code: "00003", name: "UnitedHealthcare" },
  { code: "00004", name: "Blue Cross Blue Shield" },
  { code: "00005", name: "Aetna" },
  { code: "00006", name: "Cigna" },
  { code: "00007", name: "Humana" },
  { code: "00008", name: "Kaiser Permanente" },
  { code: "00009", name: "Anthem" },
  { code: "00010", name: "Centene" },
  { code: "00011", name: "Molina Healthcare" },
  { code: "00012", name: "WellCare" },
  { code: "00013", name: "Tricare" },
  { code: "00014", name: "Health Net" },
  { code: "00015", name: "Bright Health" },
];

// ── Token management ──────────────────────────────────────

interface TokenCache {
  accessToken: string;
  expiresAt: number; // Unix ms
}

let tokenCache: TokenCache | null = null;

function getConfig(): PVerifyConfig {
  const clientId = process.env.PVERIFY_CLIENT_ID;
  const clientSecret = process.env.PVERIFY_CLIENT_SECRET;
  const baseUrl = process.env.PVERIFY_BASE_URL || "https://api.pverify.com/api";

  if (!clientId || !clientSecret) {
    throw new Error("pVerify credentials not configured. Set PVERIFY_CLIENT_ID and PVERIFY_CLIENT_SECRET.");
  }

  return { clientId, clientSecret, baseUrl };
}

async function getAccessToken(): Promise<string> {
  // Check cache (refresh 5 min before expiry)
  if (tokenCache && tokenCache.expiresAt > Date.now() + 5 * 60 * 1000) {
    return tokenCache.accessToken;
  }

  const config = getConfig();

  const tokenUrl = config.baseUrl.replace("/api", "") + "/Token";

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`pVerify auth failed (${res.status}): ${body}`);
  }

  const data = await res.json();

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
  };

  return tokenCache.accessToken;
}

// ── Response cache (24h TTL) ──────────────────────────────

interface CacheEntry {
  response: EligibilityResponse;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCacheKey(req: EligibilityRequest): string {
  return `${req.payerCode}:${req.subscriberId}:${req.providerNpi}:${req.memberDob}:${req.dateOfService || "today"}`;
}

function getCachedResponse(key: string): EligibilityResponse | null {
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    responseCache.delete(key);
    return null;
  }
  return entry.response;
}

function setCachedResponse(key: string, response: EligibilityResponse): void {
  // Limit cache size
  if (responseCache.size > 5000) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey) responseCache.delete(firstKey);
  }
  responseCache.set(key, { response, expiresAt: Date.now() + CACHE_TTL });
}

// ── API calls ─────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 30_000;

/**
 * Verify eligibility for a single patient.
 */
export async function verifyEligibility(
  req: EligibilityRequest
): Promise<EligibilityResponse> {
  // Check cache first
  const cacheKey = getCacheKey(req);
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return { ...cached, requestId: `cached-${Date.now()}` };
  }

  const config = getConfig();
  const token = await getAccessToken();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const payload = {
      payerCode: req.payerCode,
      payerName: req.payerName || "",
      provider: {
        npi: req.providerNpi,
        lastName: req.providerLastName || "",
        firstName: req.providerFirstName || "",
      },
      subscriber: {
        memberId: req.subscriberId,
        firstName: req.memberFirstName,
        lastName: req.memberLastName,
        dob: req.memberDob,
      },
      isSubscriberPatient: req.isSubscriberPatient !== false ? "True" : "False",
      doS_StartDate: req.dateOfService || new Date().toLocaleDateString("en-US"),
      doS_EndDate: req.dateOfService || new Date().toLocaleDateString("en-US"),
    };

    const res = await fetch(`${config.baseUrl}/EligibilitySummary`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Client-API-Id": config.clientId,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`pVerify API error (${res.status}): ${body}`);
    }

    const data = await res.json();
    const parsed = parseEligibilityResponse(data, req);

    // Cache successful responses
    if (parsed.isSuccess) {
      setCachedResponse(cacheKey, parsed);
    }

    return parsed;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Verify eligibility for multiple patients.
 * Processes in parallel with a concurrency limit.
 */
export async function verifyBatch(
  requests: EligibilityRequest[],
  concurrency: number = 10
): Promise<BatchEligibilityResult[]> {
  const results: BatchEligibilityResult[] = [];
  const queue = [...requests];

  async function processNext(): Promise<void> {
    while (queue.length > 0) {
      const req = queue.shift()!;
      try {
        const response = await verifyEligibility(req);
        results.push({ request: req, response, error: null });
      } catch (err) {
        results.push({
          request: req,
          response: null,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }
  }

  // Run workers in parallel (limited concurrency)
  const workers = Array.from({ length: Math.min(concurrency, requests.length) }, () =>
    processNext()
  );
  await Promise.all(workers);

  return results;
}

/**
 * Check if pVerify is configured and available.
 */
export function isPVerifyEnabled(): boolean {
  return !!(process.env.PVERIFY_CLIENT_ID && process.env.PVERIFY_CLIENT_SECRET);
}

// ── Response parser ───────────────────────────────────────

function parseEligibilityResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  req: EligibilityRequest
): EligibilityResponse {
  const isActive =
    data.PlanStatus === "Active Coverage" ||
    data.PlanStatus === "Active" ||
    data.IsActive === true;

  // Parse copay from service details
  const copay = parseCopay(data);
  const deductible = parseDeductible(data);
  const outOfPocket = parseOutOfPocket(data);
  const coinsurance = parseCoinsurance(data);

  return {
    requestId: data.RequestID || data.TransactionId || `pv-${Date.now()}`,
    isSuccess: !data.APIResponseMessage || data.APIResponseCode === "0",
    status: isActive ? "Active" : data.PlanStatus === "Inactive" ? "Inactive" : "Unknown",
    payerName: data.PayerName || req.payerName || "",
    planName: data.PlanName || data.PlanDescription || "",
    planType: data.PlanType || "",
    groupNumber: data.GroupNumber || "",
    subscriberId: data.MemberId || req.subscriberId,
    eligibilityStartDate: data.EligibilityBeginDate || "",
    eligibilityEndDate: data.EligibilityEndDate || "",
    copay,
    deductible,
    outOfPocket,
    coinsurance,
    planCoverageDescription: data.PlanCoverageDescription || "",
    serviceTypes: data.ServiceTypes || [],
    errorMessage: data.APIResponseMessage && data.APIResponseCode !== "0"
      ? data.APIResponseMessage
      : null,
    rawResponse: data,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCopay(data: any): CopayInfo | null {
  if (!data.CopayInNetwork && !data.Copay) return null;

  return {
    inNetwork: parseAmount(data.CopayInNetwork || data.Copay),
    outOfNetwork: parseAmount(data.CopayOutOfNetwork),
    specialist: parseAmount(data.SpecialistCopay || data.SpecialistCopayInNetwork),
    urgentCare: parseAmount(data.UrgentCareCopay),
    emergencyRoom: parseAmount(data.EmergencyCopay || data.ERCopay),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseDeductible(data: any): DeductibleInfo | null {
  if (!data.IndividualDeductibleInNetwork && !data.IndividualDeductible) return null;

  return {
    individual: {
      inNetwork: parseAmount(data.IndividualDeductibleInNetwork || data.IndividualDeductible),
      outOfNetwork: parseAmount(data.IndividualDeductibleOutOfNetwork),
      remaining: parseAmount(data.IndividualDeductibleRemainingInNetwork || data.IndividualDeductibleRemaining),
    },
    family: {
      inNetwork: parseAmount(data.FamilyDeductibleInNetwork || data.FamilyDeductible),
      outOfNetwork: parseAmount(data.FamilyDeductibleOutOfNetwork),
      remaining: parseAmount(data.FamilyDeductibleRemainingInNetwork || data.FamilyDeductibleRemaining),
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseOutOfPocket(data: any): OutOfPocketInfo | null {
  if (!data.IndividualOOPInNetwork && !data.IndividualOOPMax) return null;

  return {
    individual: {
      inNetwork: parseAmount(data.IndividualOOPInNetwork || data.IndividualOOPMax),
      outOfNetwork: parseAmount(data.IndividualOOPOutOfNetwork),
      remaining: parseAmount(data.IndividualOOPRemainingInNetwork || data.IndividualOOPRemaining),
    },
    family: {
      inNetwork: parseAmount(data.FamilyOOPInNetwork || data.FamilyOOPMax),
      outOfNetwork: parseAmount(data.FamilyOOPOutOfNetwork),
      remaining: parseAmount(data.FamilyOOPRemainingInNetwork || data.FamilyOOPRemaining),
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseCoinsurance(data: any): CoinsuranceInfo | null {
  if (!data.CoinsuranceInNetwork && !data.Coinsurance) return null;

  return {
    inNetwork: parsePercent(data.CoinsuranceInNetwork || data.Coinsurance),
    outOfNetwork: parsePercent(data.CoinsuranceOutOfNetwork),
  };
}

function parseAmount(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  const str = String(val).replace(/[$,]/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

function parsePercent(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  const str = String(val).replace(/%/g, "");
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}
