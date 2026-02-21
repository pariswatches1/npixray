"use client";

import { DollarSign, TrendingUp, Zap } from "lucide-react";

interface RevenueOpportunity {
  program: string;
  code: string;
  description: string;
  annualRevenue: number;
  likelihood: "high" | "medium" | "low";
}

interface RevenueConnectorProps {
  planType: string;
  isActive: boolean;
  specialty?: string;
}

/**
 * After each eligibility verification, cross-reference the patient's
 * plan type with CCM/AWV/TCM opportunity data to show revenue opportunities.
 */
export function RevenueConnector({ planType, isActive, specialty }: RevenueConnectorProps) {
  if (!isActive) return null;

  const opportunities = getRevenueOpportunities(planType, specialty);
  if (opportunities.length === 0) return null;

  const totalAnnual = opportunities.reduce((sum, o) => sum + o.annualRevenue, 0);

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-emerald-900">Revenue Opportunity Detected</h4>
          <p className="text-xs text-emerald-700">
            Based on this patient&apos;s coverage, consider these programs:
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {opportunities.map((opp, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg bg-white border border-emerald-100 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  opp.likelihood === "high"
                    ? "bg-emerald-100 text-emerald-700"
                    : opp.likelihood === "medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {opp.likelihood === "high" ? "H" : opp.likelihood === "medium" ? "M" : "L"}
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-900">{opp.program}</p>
                <p className="text-[10px] text-gray-500">
                  {opp.code} &middot; {opp.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-700">
                ${opp.annualRevenue.toLocaleString()}/yr
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-200">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-800">
            Total potential per patient:
          </span>
        </div>
        <span className="text-sm font-bold text-emerald-700">
          ${totalAnnual.toLocaleString()}/yr
        </span>
      </div>
    </div>
  );
}

function getRevenueOpportunities(
  planType: string,
  specialty?: string
): RevenueOpportunity[] {
  const opportunities: RevenueOpportunity[] = [];
  const plan = (planType || "").toLowerCase();
  const isMedicare = plan.includes("medicare") || plan.includes("advantage");

  // CCM — Chronic Care Management (most common opportunity)
  opportunities.push({
    program: "Chronic Care Management",
    code: "99490",
    description: isMedicare
      ? "Medicare covers 80% — bill monthly for 2+ chronic conditions"
      : "Most commercial payers now cover CCM",
    annualRevenue: isMedicare ? 5_580 : 4_200,
    likelihood: "high",
  });

  // AWV — Annual Wellness Visit
  if (isMedicare) {
    opportunities.push({
      program: "Annual Wellness Visit",
      code: "G0438/G0439",
      description: "Medicare covers 100% — no patient copay",
      annualRevenue: 270,
      likelihood: "high",
    });
  }

  // TCM — Transitional Care Management
  opportunities.push({
    program: "Transitional Care Management",
    code: "99495/99496",
    description: "Post-discharge follow-up within 7-14 days",
    annualRevenue: 2_400,
    likelihood: "medium",
  });

  // RPM — Remote Patient Monitoring
  if (specialty === "Cardiology" || specialty === "Endocrinology" || specialty === "Internal Medicine" || specialty === "Family Medicine") {
    opportunities.push({
      program: "Remote Patient Monitoring",
      code: "99453/99458",
      description: "Device monitoring for chronic conditions",
      annualRevenue: isMedicare ? 7_800 : 6_000,
      likelihood: "medium",
    });
  }

  // BHI — Behavioral Health Integration
  if (specialty === "Family Medicine" || specialty === "Internal Medicine" || specialty === "Psychiatry") {
    opportunities.push({
      program: "Behavioral Health Integration",
      code: "99484",
      description: "Depression screening + care management",
      annualRevenue: 2_880,
      likelihood: "low",
    });
  }

  return opportunities;
}

/**
 * Aggregate summary for batch verifications.
 */
export function BatchRevenueSummary({
  activeCount,
  totalOpportunity,
}: {
  activeCount: number;
  totalOpportunity: number;
}) {
  return (
    <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.03] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-[#2F5EA8]" />
        <h4 className="text-sm font-semibold">Batch Revenue Summary</h4>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-white border border-[var(--border-light)] p-3 text-center">
          <p className="text-2xl font-bold text-[#2F5EA8]">{activeCount}</p>
          <p className="text-xs text-[var(--text-secondary)]">Active Coverage</p>
        </div>
        <div className="rounded-lg bg-white border border-[var(--border-light)] p-3 text-center">
          <p className="text-2xl font-bold text-emerald-600">
            ${totalOpportunity.toLocaleString()}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">Est. Annual Revenue</p>
        </div>
      </div>
    </div>
  );
}
