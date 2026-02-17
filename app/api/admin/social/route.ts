import { NextRequest, NextResponse } from "next/server";
import {
  getAllStates,
  getAllBenchmarks,
  getNationalStats,
  stateAbbrToName,
  stateToSlug,
  specialtyToSlug,
  formatCurrency,
  formatNumber,
  type StateStats,
  type BenchmarkRow,
} from "@/lib/db-queries";

const COOKIE_NAME = "npixray_admin";
const COOKIE_VALUE = "authenticated";

function isAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get(COOKIE_NAME);
  return cookie?.value === COOKIE_VALUE;
}

interface SocialPost {
  id: string;
  category: "state" | "specialty" | "national";
  label: string;
  twitter: string;
  linkedin: string;
  twitterChars: number;
  linkedinChars: number;
}

function buildStatePosts(allStates: StateStats[]): SocialPost[] {
  const sorted = [...allStates].sort((a, b) => b.avgPayment - a.avgPayment);

  return sorted
    .filter((s) => s.totalProviders > 0)
    .map((s, idx) => {
      const name = stateAbbrToName(s.state);
      const slug = stateToSlug(s.state);
      const rank = idx + 1;
      const avgPay = formatCurrency(s.avgPayment);
      const totalPay = formatCurrency(s.totalPayment);
      const providers = formatNumber(s.totalProviders);

      const twitter = `${name} ranks #${rank} nationally for Medicare avg payment (${avgPay}/provider). ${providers} providers, ${totalPay} total. See full report card \u2192 npixray.com/states/${slug}`;

      const linkedin = `${name} Medicare Revenue Report Card

Key findings from CMS public data:
- National Rank: #${rank} by avg payment/provider
- ${providers} Medicare providers analyzed
- Average Payment: ${avgPay} per provider
- Total Medicare Spending: ${totalPay}

Low adoption of care management programs (CCM, RPM, BHI, AWV) means significant untapped revenue potential for ${name} practices.

See the full ${name} report card: https://npixray.com/states/${slug}

#Medicare #HealthcareRevenue #${name.replace(/\s+/g, "")} #MedicalBilling`;

      return {
        id: `state-${s.state}`,
        category: "state" as const,
        label: name,
        twitter,
        linkedin,
        twitterChars: twitter.length,
        linkedinChars: linkedin.length,
      };
    });
}

function buildSpecialtyPosts(benchmarks: BenchmarkRow[]): SocialPost[] {
  return benchmarks
    .filter((b) => b.provider_count > 0)
    .map((b) => {
      const slug = specialtyToSlug(b.specialty);
      const providers = formatNumber(b.provider_count);
      const avgPay = formatCurrency(b.avg_total_payment);
      const ccmPct = (b.ccm_adoption_rate * 100).toFixed(1);
      const awvPct = (b.awv_adoption_rate * 100).toFixed(1);

      const twitter = `${b.specialty} providers average ${avgPay} in Medicare payments. Only ${ccmPct}% use CCM billing. See the data \u2192 npixray.com/specialties/${slug}`;

      const linkedin = `${b.specialty} Medicare Revenue Analysis

CMS data reveals major revenue gaps in ${b.specialty}:
- ${providers} providers analyzed nationally
- Average Medicare Payment: ${avgPay}/provider
- Average Medicare Patients: ${formatNumber(b.avg_medicare_patients)}
- CCM Adoption: ${ccmPct}% (target: 15%+)
- AWV Adoption: ${awvPct}% (target: 70%+)
- 99214 Rate: ${(b.pct_99214 * 100).toFixed(1)}%

Most ${b.specialty} practices are leaving significant revenue on the table through under-adoption of care management programs.

Full analysis: https://npixray.com/specialties/${slug}

#${b.specialty.replace(/[^a-zA-Z]/g, "")} #Medicare #RevenueCycleManagement #HealthcareData`;

      return {
        id: `specialty-${slug}`,
        category: "specialty" as const,
        label: b.specialty,
        twitter,
        linkedin,
        twitterChars: twitter.length,
        linkedinChars: linkedin.length,
      };
    });
}

function buildNationalPost(
  national: { totalProviders: number; totalPayment: number; totalServices: number; totalCodes: number },
  stateCount: number,
  specialtyCount: number
): SocialPost {
  const avgPay = formatCurrency(national.totalProviders > 0 ? national.totalPayment / national.totalProviders : 0);
  const totalPay = formatCurrency(national.totalPayment);
  const providers = formatNumber(national.totalProviders);

  const twitter = `We analyzed ${providers} Medicare providers across all 50 states. Avg payment: ${avgPay}/provider. ${totalPay} total. Free report cards for every state \u2192 npixray.com/reports`;

  const linkedin = `National Medicare Revenue Report Card \u2014 2026

We analyzed CMS public data covering the entire U.S. Medicare provider ecosystem:
- ${providers} providers across ${stateCount} states
- ${totalPay} in total Medicare payments
- ${avgPay} average per provider
- ${specialtyCount} specialties benchmarked
- ${formatNumber(national.totalServices)} total services rendered

Key insight: Care management programs (CCM, RPM, BHI, AWV) remain massively under-adopted across nearly every specialty. This represents billions in uncaptured revenue nationally.

Every state and specialty has been graded. See how yours performs: https://npixray.com/reports

#Medicare #HealthcareRevenue #CMS #MedicalBilling #RevenueCycleManagement`;

  return {
    id: "national",
    category: "national",
    label: "National Overview",
    twitter,
    linkedin,
    twitterChars: twitter.length,
    linkedinChars: linkedin.length,
  };
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allStates = getAllStates();
  const benchmarks = getAllBenchmarks();
  const national = getNationalStats();

  const posts: SocialPost[] = [];

  // National post first
  if (national) {
    posts.push(buildNationalPost(national, allStates.length, benchmarks.length));
  }

  // State posts
  posts.push(...buildStatePosts(allStates));

  // Specialty posts
  posts.push(...buildSpecialtyPosts(benchmarks));

  return NextResponse.json({
    posts,
    counts: {
      national: national ? 1 : 0,
      states: allStates.filter((s) => s.totalProviders > 0).length,
      specialties: benchmarks.filter((b) => b.provider_count > 0).length,
    },
  });
}
