import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Hash, Users, Activity, DollarSign } from "lucide-react";
import { getTopCodes, formatCurrency, formatNumber } from "@/lib/db-queries";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { ScanCTA } from "@/components/seo/scan-cta";

export const dynamic = "force-dynamic";
export const revalidate = 86400; // ISR: cache at runtime for 24 hours

export const metadata: Metadata = {
  title: "Medicare Billing Code Encyclopedia — CPT & HCPCS Data | NPIxray",
  description:
    "Explore the top 200 HCPCS/CPT codes billed to Medicare, with real payment data from 1.175M+ providers. See provider counts, total services, and average payments per code.",
  keywords: [
    "Medicare billing codes",
    "CPT code data",
    "HCPCS codes",
    "Medicare payment data",
    "billing code encyclopedia",
    "medical coding reference",
  ],
  alternates: {
    canonical: "https://npixray.com/codes",
  },
  openGraph: {
    title: "Medicare Billing Code Encyclopedia | NPIxray",
    description:
      "Explore the top 200 HCPCS/CPT codes billed to Medicare with real CMS payment data from 1.175M+ providers.",
  },
};

export default async function CodesIndexPage() {
  const codes = await getTopCodes(200) || [];

  const totalServices = codes.reduce((sum: number, c: any) => sum + c.totalServices, 0);
  const totalProviders = codes.reduce((sum: number, c: any) => sum + c.totalProviders, 0);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <Breadcrumbs items={[{ label: "Codes", href: "/codes" }]} />

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-1.5 mb-8">
              <BookOpen className="h-3.5 w-3.5 text-[#2F5EA8]" />
              <span className="text-xs font-medium text-[#2F5EA8]">
                Top 200 Codes
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Medicare Billing Code{" "}
              <span className="text-[#2F5EA8]">Encyclopedia</span>
            </h1>
            <p className="mt-6 text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
              Explore the top 200 HCPCS/CPT codes billed to Medicare, with real
              payment data from 1.175M+ providers.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-12">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-[#2F5EA8]">200</p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Codes
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-[#2F5EA8]">
                {formatNumber(totalServices)}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Total Services
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold font-mono text-[#2F5EA8]">
                1.175M+
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-1">
                Providers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Codes Table */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto rounded-xl border border-[var(--border-light)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-light)] bg-white">
                  <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5" />
                      Code
                    </div>
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                    <div className="flex items-center justify-end gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      Providers
                    </div>
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">
                    <div className="flex items-center justify-end gap-1.5">
                      <Activity className="h-3.5 w-3.5" />
                      Total Services
                    </div>
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">
                    <div className="flex items-center justify-end gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" />
                      Avg $/Service
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code, i) => (
                  <tr
                    key={code.hcpcs_code}
                    className={`border-b border-[var(--border-light)] hover:bg-white transition-colors ${
                      i % 2 === 0 ? "bg-white" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/codes/${code.hcpcs_code}`}
                        className="text-[#2F5EA8] hover:text-[#264D8C] font-mono font-semibold transition-colors"
                      >
                        {code.hcpcs_code}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {formatNumber(code.totalProviders)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums hidden sm:table-cell">
                      {formatNumber(code.totalServices)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-[#2F5EA8]">
                      {formatCurrency(code.avgPayment)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <ScanCTA />
      </section>
    </>
  );
}
