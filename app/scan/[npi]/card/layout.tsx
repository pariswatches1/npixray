import type { Metadata } from "next";
import { performScan } from "@/lib/scan";
import { calculateRevenueScoreFromScan, estimatePercentile } from "@/lib/revenue-score";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ npi: string }>;
}): Promise<Metadata> {
  const { npi } = await params;

  if (!/^\d{10}$/.test(npi)) {
    return { title: "Invalid NPI" };
  }

  try {
    const result = await performScan(npi);
    const scoreResult = calculateRevenueScoreFromScan(result);
    const percentile = estimatePercentile(scoreResult.overall);
    const missed =
      result.totalMissedRevenue >= 1000
        ? `$${Math.round(result.totalMissedRevenue / 1000)}K`
        : `$${result.totalMissedRevenue.toLocaleString()}`;

    const title = `${result.provider.fullName} — Revenue Score: ${scoreResult.overall}/100 (${scoreResult.label})`;
    const description = `${result.provider.specialty} in ${result.provider.address.city}, ${result.provider.address.state}. Revenue Score ${scoreResult.overall}/100, top ${Math.max(1, 100 - percentile)}% of peers. Missing ${missed}/yr in Medicare revenue. Get your free report card at NPIxray.com`;

    return {
      title,
      description,
      alternates: {
        canonical: `https://npixray.com/scan/${npi}/card`,
      },
      openGraph: {
        title,
        description,
        url: `https://npixray.com/scan/${npi}/card`,
        type: "article",
        siteName: "NPIxray",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch {
    return {
      title: `NPI ${npi} Revenue Report Card`,
      description: `Revenue report card for NPI ${npi}. See your Revenue Score, missed revenue, and peer comparison.`,
      alternates: {
        canonical: `https://npixray.com/scan/${npi}/card`,
      },
    };
  }
}

export default function CardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
