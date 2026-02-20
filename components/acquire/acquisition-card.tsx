import Link from "next/link";
import type { AcquisitionScoreResult } from "@/lib/acquisition-utils";
import { formatAcquisitionCurrency } from "@/lib/acquisition-utils";
import { TrendingUp, Users, MapPin, ArrowRight } from "lucide-react";

interface AcquisitionCardProps {
  npi: string;
  name: string;
  specialty: string;
  state: string;
  city: string;
  patients: number;
  currentRevenue: number;
  score: AcquisitionScoreResult;
  rank?: number;
}

export function AcquisitionCard({
  npi,
  name,
  specialty,
  state,
  city,
  patients,
  currentRevenue,
  score,
  rank,
}: AcquisitionCardProps) {
  return (
    <div className="group rounded-2xl border border-[var(--border-light)] bg-white p-6 transition-all hover:border-[#2F5EA8]/15 hover:shadow-lg hover:shadow-[#2F5EA8]/[0.04]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          {rank && (
            <span className="text-xs font-bold text-[var(--text-secondary)] mb-1 block">
              #{rank}
            </span>
          )}
          <h3 className="font-bold text-lg truncate">{name}</h3>
          <p className="text-sm text-[var(--text-secondary)]">{specialty}</p>
          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mt-1">
            <MapPin className="h-3 w-3" />
            {city}, {state}
          </div>
        </div>
        <div className={`flex flex-col items-center rounded-xl border ${score.borderColor} ${score.bgColor} px-3 py-2`}>
          <span className={`text-2xl font-bold ${score.color}`}>{score.overall}</span>
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${score.color}`}>
            {score.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg bg-[var(--bg)]/80 p-3">
          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mb-1">
            <Users className="h-3 w-3" />
            Patients
          </div>
          <p className="text-sm font-bold">{patients.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-[var(--bg)]/80 p-3">
          <div className="text-xs text-[var(--text-secondary)] mb-1">Current Revenue</div>
          <p className="text-sm font-bold">{formatAcquisitionCurrency(currentRevenue)}</p>
        </div>
        <div className="rounded-lg bg-[var(--bg)]/80 p-3">
          <div className="flex items-center gap-1 text-xs text-emerald-400 mb-1">
            <TrendingUp className="h-3 w-3" />
            Upside
          </div>
          <p className="text-sm font-bold text-emerald-400">
            +{formatAcquisitionCurrency(score.estimatedUpsideRevenue)}
          </p>
        </div>
        <div className="rounded-lg bg-[var(--bg)]/80 p-3">
          <div className="text-xs text-[var(--text-secondary)] mb-1">Growth Potential</div>
          <p className="text-sm font-bold text-[#2F5EA8]">+{score.revenueIncreasePct}%</p>
        </div>
      </div>

      <Link
        href={`/provider/${npi}`}
        className="flex items-center justify-center gap-2 w-full rounded-xl border border-[var(--border-light)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8]"
      >
        View Full Analysis
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
