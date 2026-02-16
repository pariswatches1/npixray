import type { Metadata } from "next";
import { performScan } from "@/lib/scan";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ npi: string }>;
}): Promise<Metadata> {
  const { npi } = await params;

  // Validate NPI format
  if (!/^\d{10}$/.test(npi)) {
    return { title: "Invalid NPI" };
  }

  try {
    const result = await performScan(npi);
    const missed = result.totalMissedRevenue >= 1000
      ? `$${Math.round(result.totalMissedRevenue / 1000)}K`
      : `$${result.totalMissedRevenue.toLocaleString()}`;

    const title = `${result.provider.fullName} is missing ${missed}/yr in revenue`;
    const description = `${result.provider.specialty} provider in ${result.provider.address.city}, ${result.provider.address.state}. NPIxray found ${missed}/year in missed revenue from E&M coding gaps, CCM, RPM, BHI, and AWV programs.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://npixray.com/scan/${npi}`,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return {
      title: `NPI ${npi} Revenue Analysis`,
      description: `Medicare revenue gap analysis for NPI ${npi}. See missed revenue from E&M coding, CCM, RPM, BHI, and AWV programs.`,
    };
  }
}

export default function ScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
