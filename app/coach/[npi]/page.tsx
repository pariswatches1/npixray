import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoachChat } from "@/components/coach/chat";
import { getProvider } from "@/lib/db-queries";
import { BENCHMARKS } from "@/lib/benchmark-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ npi: string }>;
}): Promise<Metadata> {
  const { npi } = await params;
  return {
    title: `AI Revenue Coach for NPI ${npi} | NPIxray`,
    description: `Personalized Medicare billing advice for NPI ${npi} backed by real CMS data. Ask about revenue gaps, coding optimization, and care management programs.`,
    alternates: {
      canonical: `https://npixray.com/coach/${npi}`,
    },
    robots: { index: false, follow: false },
  };
}

export default async function CoachWithNPIPage({
  params,
}: {
  params: Promise<{ npi: string }>;
}) {
  const { npi } = await params;

  if (!/^\d{10}$/.test(npi)) notFound();

  // Fetch provider data from Neon
  const provider = await getProvider(npi);
  if (!provider) notFound();

  const benchmark =
    BENCHMARKS[provider.specialty] || BENCHMARKS["Internal Medicine"];

  // Build scan-like data for the coach
  const emTotal =
    (provider.em_99211 || 0) +
    (provider.em_99212 || 0) +
    (provider.em_99213 || 0) +
    (provider.em_99214 || 0) +
    (provider.em_99215 || 0);

  // Calculate eligible patients
  const totalPatients = provider.total_beneficiaries || 0;
  const chronicPct = 0.6; // Estimated chronic rate
  const ccmEligible = Math.round(totalPatients * chronicPct);
  const rpmEligible = Math.round(totalPatients * 0.4);
  const bhiEligible = Math.round(totalPatients * 0.15);

  // Calculate gaps
  const ccmCurrentPatients = provider.ccm_99490_services > 0 ? Math.round(provider.ccm_99490_services / 12) : 0;
  const ccmGap = (ccmEligible - ccmCurrentPatients) * 62 * 12;

  const rpmCurrent = (provider.rpm_99454_services || 0) > 0 ? Math.round(provider.rpm_99454_services / 12) : 0;
  const rpmGap = (rpmEligible - rpmCurrent) * 106 * 12;

  const bhiCurrent = (provider.bhi_99484_services || 0) > 0 ? Math.round(provider.bhi_99484_services / 12) : 0;
  const bhiGap = (bhiEligible - bhiCurrent) * 49 * 12;

  const awvTotal = (provider.awv_g0438_services || 0) + (provider.awv_g0439_services || 0);
  const awvEligible = totalPatients;
  const awvGap = (awvEligible - awvTotal) * 125;

  // E&M coding gap
  const em99213 = provider.em_99213 || 0;
  const em99214 = provider.em_99214 || 0;
  const shiftable = Math.round(em99213 * 0.15);
  const codingGap = shiftable * 40;

  const totalMissedRevenue = Math.max(0, ccmGap) + Math.max(0, rpmGap) + Math.max(0, bhiGap) + Math.max(0, awvGap) + codingGap;

  const scanData = {
    provider: {
      npi: provider.npi,
      fullName: `${provider.first_name} ${provider.last_name}`,
      specialty: provider.specialty,
      address: {
        city: provider.city || "",
        state: provider.state || "",
      },
    },
    billing: {
      totalMedicarePatients: totalPatients,
      totalMedicarePayment: provider.total_medicare_payment || 0,
      ccmPatients: ccmCurrentPatients,
      rpmPatients: rpmCurrent,
      awvCount: awvTotal,
      em99213Count: em99213,
      em99214Count: em99214,
      em99215Count: provider.em_99215 || 0,
      emTotalCount: emTotal,
    },
    totalMissedRevenue,
    ccmGap: {
      eligiblePatients: ccmEligible,
      annualGap: Math.max(0, ccmGap),
    },
    rpmGap: {
      eligiblePatients: rpmEligible,
      annualGap: Math.max(0, rpmGap),
    },
    bhiGap: {
      eligiblePatients: bhiEligible,
      annualGap: Math.max(0, bhiGap),
    },
    awvGap: {
      eligiblePatients: awvEligible,
      annualGap: Math.max(0, awvGap),
    },
    codingGap: {
      annualGap: codingGap,
    },
  };

  return (
    <div className="mx-auto max-w-4xl">
      <CoachChat scanData={scanData} />
    </div>
  );
}
