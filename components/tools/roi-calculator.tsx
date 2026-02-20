"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  Mail,
  CheckCircle2,
  Heart,
  Activity,
  Brain,
  Stethoscope,
  Info,
} from "lucide-react";
import { BENCHMARKS, SPECIALTY_LIST, STATE_LIST } from "@/lib/benchmark-data";

// ────────────────────────────────────────────────────────────
// Program revenue assumptions
// ────────────────────────────────────────────────────────────

const PROGRAM_REVENUE = {
  ccm: { perPatientPerMonth: 66, label: "Chronic Care Management (CCM)" },
  rpm: { perPatientPerMonth: 120, label: "Remote Patient Monitoring (RPM)" },
  bhi: { perPatientPerMonth: 49, label: "Behavioral Health Integration (BHI)" },
  awv: { perPatientPerYear: 119, label: "Annual Wellness Visits (AWV)" },
};

const PLAN_COSTS: Record<string, { monthly: number; label: string }> = {
  free: { monthly: 0, label: "Free" },
  intelligence: { monthly: 99, label: "Intelligence ($99/mo)" },
  platform: { monthly: 299, label: "Platform ($299/mo)" },
};

const EM_SHIFT_REVENUE = 38; // per visit shift from 99213 to 99214
const CAPTURE_RATE = 0.3; // 30% recovery assumption

// ────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────

export function RoiCalculatorTool() {
  const [specialty, setSpecialty] = useState(SPECIALTY_LIST[0]);
  const [state, setState] = useState("TX");
  const [patientCount, setPatientCount] = useState(300);
  const [programs, setPrograms] = useState({
    ccm: false,
    rpm: false,
    bhi: false,
    awv: false,
  });
  const [plan, setPlan] = useState("intelligence");
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const benchmark = BENCHMARKS[specialty];

  const results = useMemo(() => {
    if (!benchmark) return null;

    // E&M coding gap
    const visitsPerYear = patientCount * 3.5; // avg Medicare visits/patient/year
    const undercodingRate = benchmark.pct99213 * 0.15; // 15% of 99213s could be 99214
    const emGap = visitsPerYear * undercodingRate * EM_SHIFT_REVENUE;

    // CCM opportunity
    const ccmEligibleRate = 0.45; // 45% of Medicare patients have 2+ chronic conditions
    const ccmEligible = patientCount * ccmEligibleRate;
    const ccmCurrentAdoption = programs.ccm ? benchmark.ccmAdoptionRate + 0.15 : benchmark.ccmAdoptionRate;
    const ccmNewPatients = ccmEligible * (1 - ccmCurrentAdoption);
    const ccmRevenue = programs.ccm ? 0 : ccmNewPatients * PROGRAM_REVENUE.ccm.perPatientPerMonth * 12;

    // RPM opportunity
    const rpmEligibleRate = 0.35;
    const rpmEligible = patientCount * rpmEligibleRate;
    const rpmCurrentAdoption = programs.rpm ? benchmark.rpmAdoptionRate + 0.10 : benchmark.rpmAdoptionRate;
    const rpmNewPatients = rpmEligible * (1 - rpmCurrentAdoption);
    const rpmRevenue = programs.rpm ? 0 : rpmNewPatients * PROGRAM_REVENUE.rpm.perPatientPerMonth * 12;

    // BHI opportunity
    const bhiEligibleRate = 0.25;
    const bhiEligible = patientCount * bhiEligibleRate;
    const bhiCurrentAdoption = programs.bhi ? benchmark.bhiAdoptionRate + 0.05 : benchmark.bhiAdoptionRate;
    const bhiNewPatients = bhiEligible * (1 - bhiCurrentAdoption);
    const bhiRevenue = programs.bhi ? 0 : bhiNewPatients * PROGRAM_REVENUE.bhi.perPatientPerMonth * 12;

    // AWV opportunity
    const awvEligible = patientCount;
    const awvCurrentRate = programs.awv ? benchmark.awvAdoptionRate + 0.30 : benchmark.awvAdoptionRate;
    const awvNewPatients = awvEligible * (1 - awvCurrentRate);
    const awvRevenue = programs.awv ? 0 : awvNewPatients * PROGRAM_REVENUE.awv.perPatientPerYear;

    const totalMissedRevenue = emGap + ccmRevenue + rpmRevenue + bhiRevenue + awvRevenue;
    const potentialRecovery = totalMissedRevenue * CAPTURE_RATE;
    const annualCost = PLAN_COSTS[plan].monthly * 12;
    const netRoi = potentialRecovery - annualCost;
    const roiRatio = annualCost > 0 ? potentialRecovery / annualCost : Infinity;

    return {
      emGap: Math.round(emGap),
      ccmRevenue: Math.round(ccmRevenue),
      rpmRevenue: Math.round(rpmRevenue),
      bhiRevenue: Math.round(bhiRevenue),
      awvRevenue: Math.round(awvRevenue),
      totalMissedRevenue: Math.round(totalMissedRevenue),
      potentialRecovery: Math.round(potentialRecovery),
      annualCost,
      netRoi: Math.round(netRoi),
      roiRatio: Math.round(roiRatio * 10) / 10,
    };
  }, [specialty, patientCount, programs, plan, benchmark]);

  const handleProgramToggle = (program: keyof typeof programs) => {
    setPrograms((prev) => ({ ...prev, [program]: !prev[program] }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxRevenue = results
    ? Math.max(
        results.emGap,
        results.ccmRevenue,
        results.rpmRevenue,
        results.bhiRevenue,
        results.awvRevenue,
        1
      )
    : 1;

  return (
    <div className="space-y-10">
      {/* Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column: Practice details */}
        <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 sm:p-8">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[#2F5EA8]" />
            Your Practice Details
          </h2>

          {/* Specialty */}
          <div className="mb-6">
            <label
              htmlFor="roi-specialty"
              className="block text-sm font-medium mb-2"
            >
              Specialty
            </label>
            <select
              id="roi-specialty"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-light)] bg-white px-4 py-3 text-sm focus:border-[#2F5EA8]/20/50 focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]/10 transition-colors appearance-none"
            >
              {SPECIALTY_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div className="mb-6">
            <label
              htmlFor="roi-state"
              className="block text-sm font-medium mb-2"
            >
              State
            </label>
            <select
              id="roi-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-light)] bg-white px-4 py-3 text-sm focus:border-[#2F5EA8]/20/50 focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]/10 transition-colors appearance-none"
            >
              {STATE_LIST.map((s) => (
                <option key={s.abbr} value={s.abbr}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Patient Count */}
          <div className="mb-6">
            <label
              htmlFor="roi-patients"
              className="block text-sm font-medium mb-2"
            >
              Medicare Patients:{" "}
              <span className="text-[#2F5EA8] font-bold">{patientCount}</span>
            </label>
            <input
              id="roi-patients"
              type="range"
              min={50}
              max={2000}
              step={10}
              value={patientCount}
              onChange={(e) => setPatientCount(Number(e.target.value))}
              className="w-full accent-[#2F5EA8] h-2 rounded-lg appearance-none bg-gray-100 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
              <span>50</span>
              <span>2,000</span>
            </div>
          </div>

          {/* Current Programs */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-3">
              Programs You Already Run
            </p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { key: "ccm" as const, label: "CCM", icon: Heart },
                { key: "rpm" as const, label: "RPM", icon: Activity },
                { key: "bhi" as const, label: "BHI", icon: Brain },
                { key: "awv" as const, label: "AWV", icon: Stethoscope },
              ]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleProgramToggle(key)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    programs[key]
                      ? "border-[#2F5EA8]/15 bg-[#2F5EA8]/[0.06] text-[#2F5EA8]"
                      : "border-[var(--border-light)] bg-white text-[var(--text-secondary)] hover:border-[var(--border)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {programs[key] && (
                    <CheckCircle2 className="h-3.5 w-3.5 ml-auto" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Check programs you already have. NPIxray calculates revenue from
              programs you&apos;re NOT currently running.
            </p>
          </div>

          {/* NPIxray Plan */}
          <div>
            <p className="text-sm font-medium mb-3">NPIxray Plan</p>
            <div className="space-y-2">
              {Object.entries(PLAN_COSTS).map(([key, { label }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPlan(key)}
                  className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all text-left ${
                    plan === key
                      ? "border-[#2F5EA8]/15 bg-[#2F5EA8]/[0.06] text-[#2F5EA8]"
                      : "border-[var(--border-light)] bg-white text-[var(--text-secondary)] hover:border-[var(--border)]"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      plan === key ? "border-[#2F5EA8]/20" : "border-[var(--border)]"
                    }`}
                  >
                    {plan === key && (
                      <div className="h-2 w-2 rounded-full bg-[#2F5EA8]" />
                    )}
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Results */}
        <div className="space-y-6">
          {/* Big numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Est. Annual Missed Revenue
              </p>
              <p className="text-3xl font-bold text-red-400">
                {results ? formatCurrency(results.totalMissedRevenue) : "$0"}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Potential Recovery (30%)
              </p>
              <p className="text-3xl font-bold text-emerald-400">
                {results ? formatCurrency(results.potentialRecovery) : "$0"}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                NPIxray Annual Cost
              </p>
              <p className="text-3xl font-bold">
                {results ? formatCurrency(results.annualCost) : "$0"}
              </p>
            </div>
            <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6">
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Net ROI
              </p>
              <p className="text-3xl font-bold text-[#2F5EA8]">
                {results ? formatCurrency(results.netRoi) : "$0"}
              </p>
            </div>
          </div>

          {/* ROI ratio callout */}
          {results && results.annualCost > 0 && (
            <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6 text-center">
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                For every $1 spent on NPIxray, you recover
              </p>
              <p className="text-4xl font-bold text-[#2F5EA8]">
                ${results.roiRatio.toFixed(1)}
              </p>
            </div>
          )}

          {results && results.annualCost === 0 && (
            <div className="rounded-2xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-6 text-center">
              <p className="text-sm text-[var(--text-secondary)] mb-1">
                The Free plan costs nothing
              </p>
              <p className="text-4xl font-bold text-[#2F5EA8]">
                Infinite ROI
              </p>
            </div>
          )}

          {/* Breakdown bar chart */}
          <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-6">
              Revenue Breakdown by Source
            </h3>
            <div className="space-y-5">
              {results && (
                <>
                  <RevenueBar
                    label="E&M Coding Gap"
                    value={results.emGap}
                    max={maxRevenue}
                    color="bg-amber-400"
                    formatCurrency={formatCurrency}
                  />
                  <RevenueBar
                    label="CCM Revenue"
                    value={results.ccmRevenue}
                    max={maxRevenue}
                    color="bg-rose-400"
                    disabled={programs.ccm}
                    formatCurrency={formatCurrency}
                  />
                  <RevenueBar
                    label="RPM Revenue"
                    value={results.rpmRevenue}
                    max={maxRevenue}
                    color="bg-blue-400"
                    disabled={programs.rpm}
                    formatCurrency={formatCurrency}
                  />
                  <RevenueBar
                    label="BHI Revenue"
                    value={results.bhiRevenue}
                    max={maxRevenue}
                    color="bg-purple-400"
                    disabled={programs.bhi}
                    formatCurrency={formatCurrency}
                  />
                  <RevenueBar
                    label="AWV Revenue"
                    value={results.awvRevenue}
                    max={maxRevenue}
                    color="bg-emerald-400"
                    disabled={programs.awv}
                    formatCurrency={formatCurrency}
                  />
                </>
              )}
            </div>
          </div>

          {/* Breakdown table */}
          <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-4">
              Detailed Breakdown
            </h3>
            {results && (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-light)]">
                    <th className="text-left text-xs text-[var(--text-secondary)] pb-2">
                      Source
                    </th>
                    <th className="text-right text-xs text-[var(--text-secondary)] pb-2">
                      Annual Missed
                    </th>
                    <th className="text-right text-xs text-[var(--text-secondary)] pb-2">
                      Recoverable (30%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[var(--border-light)]">
                    <td className="text-sm py-3">E&M Coding Optimization</td>
                    <td className="text-sm text-right text-red-400">
                      {formatCurrency(results.emGap)}
                    </td>
                    <td className="text-sm text-right text-emerald-400">
                      {formatCurrency(results.emGap * CAPTURE_RATE)}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-light)]">
                    <td className="text-sm py-3">
                      CCM (99490)
                      {programs.ccm && (
                        <span className="text-xs text-[#2F5EA8] ml-2">
                          Already running
                        </span>
                      )}
                    </td>
                    <td className="text-sm text-right text-red-400">
                      {formatCurrency(results.ccmRevenue)}
                    </td>
                    <td className="text-sm text-right text-emerald-400">
                      {formatCurrency(results.ccmRevenue * CAPTURE_RATE)}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-light)]">
                    <td className="text-sm py-3">
                      RPM (99453-99458)
                      {programs.rpm && (
                        <span className="text-xs text-[#2F5EA8] ml-2">
                          Already running
                        </span>
                      )}
                    </td>
                    <td className="text-sm text-right text-red-400">
                      {formatCurrency(results.rpmRevenue)}
                    </td>
                    <td className="text-sm text-right text-emerald-400">
                      {formatCurrency(results.rpmRevenue * CAPTURE_RATE)}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-light)]">
                    <td className="text-sm py-3">
                      BHI (99484)
                      {programs.bhi && (
                        <span className="text-xs text-[#2F5EA8] ml-2">
                          Already running
                        </span>
                      )}
                    </td>
                    <td className="text-sm text-right text-red-400">
                      {formatCurrency(results.bhiRevenue)}
                    </td>
                    <td className="text-sm text-right text-emerald-400">
                      {formatCurrency(results.bhiRevenue * CAPTURE_RATE)}
                    </td>
                  </tr>
                  <tr className="border-b border-[var(--border-light)]">
                    <td className="text-sm py-3">
                      AWV (G0438/G0439)
                      {programs.awv && (
                        <span className="text-xs text-[#2F5EA8] ml-2">
                          Already running
                        </span>
                      )}
                    </td>
                    <td className="text-sm text-right text-red-400">
                      {formatCurrency(results.awvRevenue)}
                    </td>
                    <td className="text-sm text-right text-emerald-400">
                      {formatCurrency(results.awvRevenue * CAPTURE_RATE)}
                    </td>
                  </tr>
                  <tr className="font-bold">
                    <td className="text-sm py-3">Total</td>
                    <td className="text-sm text-right text-red-400">
                      {formatCurrency(results.totalMissedRevenue)}
                    </td>
                    <td className="text-sm text-right text-emerald-400">
                      {formatCurrency(results.potentialRecovery)}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>

          {/* Assumptions note */}
          <div className="rounded-xl bg-white border border-[var(--border-light)] p-4 flex items-start gap-3">
            <Info className="h-4 w-4 text-[var(--text-secondary)] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Estimates based on CMS national specialty benchmarks and Medicare
              reimbursement rates. Actual results vary based on patient mix,
              payer contracts, and implementation quality. Recovery assumes a
              conservative 30% capture rate for identified opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Email Capture */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-8 sm:p-10 text-center max-w-2xl mx-auto">
        <Mail className="h-8 w-8 text-[#2F5EA8] mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">
          Get Your Custom ROI Report
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Enter your email to receive a detailed PDF report with your
          personalized ROI analysis, program recommendations, and
          implementation roadmap.
        </p>
        {emailSubmitted ? (
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">
              Report request submitted. Check your inbox.
            </span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setEmailSubmitted(true);
            }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 rounded-xl border border-[var(--border-light)] bg-white px-4 py-3 text-sm focus:border-[#2F5EA8]/20/50 focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]/10 transition-colors placeholder:text-[var(--text-secondary)]"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#264D8C] transition-colors whitespace-nowrap"
            >
              <Mail className="h-4 w-4" />
              Send Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Revenue bar component
// ────────────────────────────────────────────────────────────

function RevenueBar({
  label,
  value,
  max,
  color,
  disabled,
  formatCurrency,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  disabled?: boolean;
  formatCurrency: (v: number) => string;
}) {
  const width = max > 0 ? Math.max((value / max) * 100, 2) : 2;

  return (
    <div className={disabled ? "opacity-40" : ""}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm">
          {label}
          {disabled && (
            <span className="text-xs text-[#2F5EA8] ml-2">Already running</span>
          )}
        </span>
        <span className="text-sm font-semibold">{formatCurrency(value)}</span>
      </div>
      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${value > 0 ? width : 0}%` }}
        />
      </div>
    </div>
  );
}
