"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/format";

interface ProviderTableRow {
  npi: string;
  first_name: string;
  last_name: string;
  credential: string;
  specialty: string;
  city: string;
  state: string;
  total_medicare_payment: number;
  total_beneficiaries: number;
}

export function ProviderTable({ providers, showCity = true, showSpecialty = true }: {
  providers: ProviderTableRow[];
  showCity?: boolean;
  showSpecialty?: boolean;
}) {
  if (!providers.length) return <p className="text-[var(--text-secondary)]">No providers found.</p>;

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-light)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-light)] bg-white">
            <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)]">Provider</th>
            {showSpecialty && <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] hidden md:table-cell">Specialty</th>}
            {showCity && <th className="text-left px-4 py-3 font-medium text-[var(--text-secondary)] hidden sm:table-cell">Location</th>}
            <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Patients</th>
            <th className="text-right px-4 py-3 font-medium text-[var(--text-secondary)]">Medicare $</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((p, i) => (
            <tr key={p.npi} className={`border-b border-[var(--border-light)] hover:bg-white transition-colors ${i % 2 === 0 ? "bg-white" : ""}`}>
              <td className="px-4 py-3">
                <Link href={`/provider/${p.npi}`} className="text-[#2F5EA8] hover:text-[#264D8C] font-medium transition-colors">
                  {p.first_name} {p.last_name}
                </Link>
                {p.credential && <span className="text-[var(--text-secondary)] ml-1 text-xs">{p.credential}</span>}
              </td>
              {showSpecialty && <td className="px-4 py-3 text-[var(--text-secondary)] hidden md:table-cell">{p.specialty}</td>}
              {showCity && <td className="px-4 py-3 text-[var(--text-secondary)] hidden sm:table-cell">{p.city}, {p.state}</td>}
              <td className="px-4 py-3 text-right tabular-nums">{p.total_beneficiaries.toLocaleString()}</td>
              <td className="px-4 py-3 text-right tabular-nums font-medium text-[#2F5EA8]">{formatCurrency(p.total_medicare_payment)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
