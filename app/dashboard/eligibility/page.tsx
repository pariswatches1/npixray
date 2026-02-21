"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  Upload,
  Download,
  BarChart3,
  DollarSign,
  Loader2,
  ArrowRight,
  Activity,
  FileText,
} from "lucide-react";
import { UpgradeGate } from "@/components/paywall/upgrade-gate";
import { RevenueConnector } from "@/components/eligibility/RevenueConnector";
import { COMMON_PAYERS } from "@/lib/pverify";

// ── Types ─────────────────────────────────────────────────

interface UsageData {
  used: number;
  limit: number;
  remaining: number;
}

interface EligibilityResult {
  requestId: string;
  isSuccess: boolean;
  status: string;
  payerName: string;
  planName: string;
  planType: string;
  groupNumber: string;
  subscriberId: string;
  eligibilityStartDate: string;
  eligibilityEndDate: string;
  copay: {
    inNetwork: number | null;
    outOfNetwork: number | null;
    specialist: number | null;
    urgentCare: number | null;
    emergencyRoom: number | null;
  } | null;
  deductible: {
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
  } | null;
  outOfPocket: {
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
  } | null;
  coinsurance: {
    inNetwork: number | null;
    outOfNetwork: number | null;
  } | null;
  planCoverageDescription: string;
  errorMessage: string | null;
}

interface VerificationHistoryItem {
  timestamp: string;
  patientName: string;
  payer: string;
  status: string;
  result: EligibilityResult;
}

// ── Tab system ────────────────────────────────────────────

type TabId = "verify" | "batch" | "history";

// ── Main Component ────────────────────────────────────────

function EligibilityDashboard() {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan || "free";

  const [activeTab, setActiveTab] = useState<TabId>("verify");
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [history, setHistory] = useState<VerificationHistoryItem[]>([]);

  // Load usage data
  useEffect(() => {
    fetch("/api/eligibility/usage")
      .then((r) => r.json())
      .then((data) => {
        if (data.eligibility) setUsage(data.eligibility);
      })
      .catch(console.error);
  }, []);

  const addToHistory = useCallback(
    (item: VerificationHistoryItem) => {
      setHistory((prev) => [item, ...prev].slice(0, 50));
    },
    []
  );

  const updateUsage = useCallback((u: UsageData) => {
    setUsage(u);
  }, []);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "verify", label: "Verify", icon: <Search className="h-4 w-4" /> },
    { id: "batch", label: "Batch", icon: <Upload className="h-4 w-4" /> },
    { id: "history", label: "History", icon: <Clock className="h-4 w-4" /> },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10">
            <ShieldCheck className="h-5 w-5 text-[#2F5EA8]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Eligibility Verification</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Verify patient coverage in real-time via pVerify
            </p>
          </div>
        </div>

        {/* Usage meter */}
        {usage && (
          <div className="rounded-xl border border-[var(--border-light)] bg-white px-4 py-3 min-w-[200px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-[var(--text-secondary)]">This Month</span>
              <span className="text-xs font-semibold">
                {usage.limit === -1
                  ? `${usage.used} used (unlimited)`
                  : `${usage.used} / ${usage.limit}`}
              </span>
            </div>
            {usage.limit > 0 && (
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (usage.used / usage.limit) * 100)}%`,
                    backgroundColor:
                      usage.used / usage.limit > 0.9
                        ? "#ef4444"
                        : usage.used / usage.limit > 0.7
                          ? "#f59e0b"
                          : "#2F5EA8",
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[var(--border-light)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-[#2F5EA8] text-[#2F5EA8]"
                : "border-transparent text-[var(--text-secondary)] hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.id === "history" && history.length > 0 && (
              <span className="text-[10px] bg-gray-100 rounded-full px-1.5 py-0.5">
                {history.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "verify" && (
        <VerifyTab onResult={addToHistory} onUsageUpdate={updateUsage} />
      )}
      {activeTab === "batch" && (
        <BatchTab plan={plan} onUsageUpdate={updateUsage} />
      )}
      {activeTab === "history" && <HistoryTab history={history} />}
    </div>
  );
}

// ── Verify Tab ────────────────────────────────────────────

function VerifyTab({
  onResult,
  onUsageUpdate,
}: {
  onResult: (item: VerificationHistoryItem) => void;
  onUsageUpdate: (usage: UsageData) => void;
}) {
  const [payerCode, setPayerCode] = useState("");
  const [providerNpi, setProviderNpi] = useState("");
  const [subscriberId, setSubscriberId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [dateOfService, setDateOfService] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/eligibility/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payerCode,
          providerNpi,
          subscriberId,
          memberFirstName: firstName,
          memberLastName: lastName,
          memberDob: dob,
          dateOfService: dateOfService || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed");
        return;
      }

      setResult(data.eligibility);
      if (data.usage) onUsageUpdate(data.usage);

      // Add to history
      onResult({
        timestamp: new Date().toISOString(),
        patientName: `${firstName} ${lastName}`,
        payer: COMMON_PAYERS.find((p) => p.code === payerCode)?.name || payerCode,
        status: data.eligibility.status,
        result: data.eligibility,
      });
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Verification Form */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-[#2F5EA8]" />
          Patient Verification
        </h2>
        <form onSubmit={handleVerify} className="space-y-4">
          {/* Payer */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Insurance Payer *
            </label>
            <select
              value={payerCode}
              onChange={(e) => setPayerCode(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#2F5EA8] focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]"
            >
              <option value="">Select payer...</option>
              {COMMON_PAYERS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Provider NPI */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Provider NPI *
            </label>
            <input
              type="text"
              value={providerNpi}
              onChange={(e) => setProviderNpi(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit NPI number"
              required
              pattern="\d{10}"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#2F5EA8] focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]"
            />
          </div>

          {/* Subscriber ID */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Member / Subscriber ID *
            </label>
            <input
              type="text"
              value={subscriberId}
              onChange={(e) => setSubscriberId(e.target.value)}
              placeholder="Insurance member ID"
              required
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#2F5EA8] focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]"
            />
          </div>

          {/* Patient Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Patient First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#2F5EA8] focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Patient Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#2F5EA8] focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]"
              />
            </div>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Date of Birth * (MM/DD/YYYY)
            </label>
            <input
              type="text"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="MM/DD/YYYY"
              required
              pattern="\d{2}/\d{2}/\d{4}"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#2F5EA8] focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]"
            />
          </div>

          {/* Date of Service (optional) */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Date of Service (optional)
            </label>
            <input
              type="text"
              value={dateOfService}
              onChange={(e) => setDateOfService(e.target.value)}
              placeholder="MM/DD/YYYY (defaults to today)"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#2F5EA8] focus:outline-none focus:ring-1 focus:ring-[#2F5EA8]"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#2F5EA8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Verify Eligibility
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Panel */}
      <div>
        {result ? (
          <EligibilityResultCard result={result} />
        ) : (
          <div className="rounded-xl border border-[var(--border-light)] bg-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2F5EA8]/[0.06]">
                <Activity className="h-7 w-7 text-[#2F5EA8]/40" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Verification results will appear here
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Fill out the form and click &quot;Verify Eligibility&quot; to check a patient&apos;s coverage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Result Card ───────────────────────────────────────────

function EligibilityResultCard({ result }: { result: EligibilityResult }) {
  const isActive = result.status === "Active";
  const isInactive = result.status === "Inactive";

  return (
    <div className="space-y-4">
      {/* Status */}
      <div
        className={`rounded-xl border p-5 ${
          isActive
            ? "border-emerald-200 bg-emerald-50/50"
            : isInactive
              ? "border-red-200 bg-red-50/50"
              : "border-amber-200 bg-amber-50/50"
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          {isActive ? (
            <CheckCircle className="h-6 w-6 text-emerald-500" />
          ) : isInactive ? (
            <XCircle className="h-6 w-6 text-red-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          )}
          <div>
            <h3 className="text-lg font-bold">
              {isActive ? "Active Coverage" : isInactive ? "Inactive Coverage" : "Status Unknown"}
            </h3>
            <p className="text-sm text-gray-600">
              {result.payerName} &middot; {result.planName || "Plan details pending"}
            </p>
          </div>
        </div>

        {result.errorMessage && (
          <div className="rounded-lg bg-white/60 border border-amber-200 px-3 py-2 mt-2">
            <p className="text-xs text-amber-800">{result.errorMessage}</p>
          </div>
        )}
      </div>

      {/* Plan Details */}
      {isActive && (
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#2F5EA8]" />
            Plan Details
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <DetailRow label="Plan Type" value={result.planType} />
            <DetailRow label="Group #" value={result.groupNumber} />
            <DetailRow label="Member ID" value={result.subscriberId} />
            <DetailRow
              label="Coverage Period"
              value={
                result.eligibilityStartDate
                  ? `${result.eligibilityStartDate} – ${result.eligibilityEndDate || "Ongoing"}`
                  : "—"
              }
            />
          </div>
        </div>
      )}

      {/* Cost Sharing */}
      {isActive && (result.copay || result.deductible || result.outOfPocket) && (
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[#2F5EA8]" />
            Patient Cost Sharing
          </h4>

          {/* Copay */}
          {result.copay && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 mb-1.5">Copay</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <CostBadge label="In-Network" amount={result.copay.inNetwork} />
                <CostBadge label="Specialist" amount={result.copay.specialist} />
                <CostBadge label="ER" amount={result.copay.emergencyRoom} />
              </div>
            </div>
          )}

          {/* Deductible */}
          {result.deductible && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 mb-1.5">Individual Deductible</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <CostBadge label="In-Network" amount={result.deductible.individual.inNetwork} />
                <CostBadge label="Out-of-Network" amount={result.deductible.individual.outOfNetwork} />
                <CostBadge
                  label="Remaining"
                  amount={result.deductible.individual.remaining}
                  highlight
                />
              </div>
            </div>
          )}

          {/* Out of Pocket */}
          {result.outOfPocket && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">Out-of-Pocket Max</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <CostBadge label="In-Network" amount={result.outOfPocket.individual.inNetwork} />
                <CostBadge label="Out-of-Network" amount={result.outOfPocket.individual.outOfNetwork} />
                <CostBadge
                  label="Remaining"
                  amount={result.outOfPocket.individual.remaining}
                  highlight
                />
              </div>
            </div>
          )}

          {/* Coinsurance */}
          {result.coinsurance && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-1.5">Coinsurance</p>
              <div className="grid grid-cols-2 gap-2">
                <CostBadge
                  label="In-Network"
                  amount={result.coinsurance.inNetwork}
                  isPercent
                />
                <CostBadge
                  label="Out-of-Network"
                  amount={result.coinsurance.outOfNetwork}
                  isPercent
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Revenue Connector */}
      {isActive && (
        <RevenueConnector
          planType={result.planName || result.payerName}
          isActive={isActive}
        />
      )}
    </div>
  );
}

// ── Helper components ─────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || "—"}</p>
    </div>
  );
}

function CostBadge({
  label,
  amount,
  highlight,
  isPercent,
}: {
  label: string;
  amount: number | null;
  highlight?: boolean;
  isPercent?: boolean;
}) {
  if (amount === null) return null;

  return (
    <div
      className={`rounded-lg px-3 py-2 text-center ${
        highlight ? "bg-emerald-50 border border-emerald-200" : "bg-gray-50 border border-gray-100"
      }`}
    >
      <p className="text-[10px] text-gray-500">{label}</p>
      <p className={`text-sm font-bold ${highlight ? "text-emerald-700" : "text-gray-800"}`}>
        {isPercent ? `${amount}%` : `$${amount.toLocaleString()}`}
      </p>
    </div>
  );
}

// ── Batch Tab ─────────────────────────────────────────────

function BatchTab({
  plan,
  onUsageUpdate,
}: {
  plan: string;
  onUsageUpdate: (usage: UsageData) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    summary: { total: number; successful: number; failed: number; active: number; inactive: number };
    results: { request: { memberFirstName: string; memberLastName: string }; response: EligibilityResult | null; error: string | null }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function downloadTemplate() {
    const csv = [
      "payerCode,providerNpi,subscriberId,memberFirstName,memberLastName,memberDob,dateOfService",
      "00001,1234567890,MBI123456789,John,Smith,01/15/1950,02/20/2026",
      "00003,1234567890,UHC987654321,Jane,Doe,03/22/1965,02/20/2026",
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eligibility-batch-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResults(null);
    setProgress(10);

    try {
      const text = await file.text();
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

      const requests = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((h, i) => {
          row[h] = values[i] || "";
        });
        return {
          payerCode: row.payercode || row.payer_code || "",
          providerNpi: row.providernpi || row.provider_npi || row.npi || "",
          subscriberId: row.subscriberid || row.subscriber_id || row.memberid || row.member_id || "",
          memberFirstName: row.memberfirstname || row.member_first_name || row.firstname || row.first_name || "",
          memberLastName: row.memberlastname || row.member_last_name || row.lastname || row.last_name || "",
          memberDob: row.memberdob || row.member_dob || row.dob || row.dateofbirth || "",
          dateOfService: row.dateofservice || row.date_of_service || row.dos || "",
        };
      });

      setProgress(30);

      const res = await fetch("/api/eligibility/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requests }),
      });

      setProgress(90);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Batch verification failed");
        return;
      }

      setResults(data);
      if (data.usage) onUsageUpdate(data.usage);
      setProgress(100);
    } catch (err) {
      setError("Failed to process batch. Please check your CSV format.");
    } finally {
      setLoading(false);
    }
  }

  function downloadResults() {
    if (!results) return;

    const csv = [
      "firstName,lastName,payer,status,planName,copayInNetwork,deductibleRemaining,errorMessage",
      ...results.results.map((r) =>
        [
          r.request.memberFirstName,
          r.request.memberLastName,
          r.response?.payerName || "",
          r.response?.status || "Error",
          r.response?.planName || "",
          r.response?.copay?.inNetwork ?? "",
          r.response?.deductible?.individual?.remaining ?? "",
          r.error || r.response?.errorMessage || "",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eligibility-results-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Upload section */}
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="h-4 w-4 text-[#2F5EA8]" />
          Batch Verification
        </h2>

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={downloadTemplate}
            className="text-sm text-[#2F5EA8] hover:underline flex items-center gap-1"
          >
            <Download className="h-3.5 w-3.5" />
            Download CSV template
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block mx-auto text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#2F5EA8]/10 file:text-[#2F5EA8] hover:file:bg-[#2F5EA8]/20"
          />
          {file && (
            <p className="text-xs text-gray-500 mt-2">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Progress bar */}
        {loading && (
          <div className="mb-4">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2F5EA8] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Processing... {progress}%
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="rounded-lg bg-[#2F5EA8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all disabled:opacity-60 flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          {loading ? "Processing..." : "Run Batch Verification"}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <StatCard label="Total" value={results.summary.total} color="#2F5EA8" />
            <StatCard label="Successful" value={results.summary.successful} color="#10b981" />
            <StatCard label="Failed" value={results.summary.failed} color="#ef4444" />
            <StatCard label="Active" value={results.summary.active} color="#10b981" />
            <StatCard label="Inactive" value={results.summary.inactive} color="#f59e0b" />
          </div>

          {/* Results table */}
          <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold">Results</h3>
              <button
                onClick={downloadResults}
                className="text-xs text-[#2F5EA8] hover:underline flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Patient</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Payer</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Plan</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {results.results.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-4 py-2 text-xs text-gray-400">{i + 1}</td>
                      <td className="px-4 py-2 font-medium">
                        {r.request.memberFirstName} {r.request.memberLastName}
                      </td>
                      <td className="px-4 py-2">
                        <StatusBadge status={r.response?.status || "Error"} />
                      </td>
                      <td className="px-4 py-2 text-gray-600">{r.response?.payerName || "—"}</td>
                      <td className="px-4 py-2 text-gray-600">{r.response?.planName || "—"}</td>
                      <td className="px-4 py-2 text-xs text-red-500">{r.error || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white p-3 text-center">
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-[var(--text-secondary)]">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  const isInactive = status === "Inactive";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : isInactive
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700"
      }`}
    >
      {isActive ? (
        <CheckCircle className="h-3 w-3" />
      ) : isInactive ? (
        <XCircle className="h-3 w-3" />
      ) : (
        <AlertTriangle className="h-3 w-3" />
      )}
      {status}
    </span>
  );
}

// ── History Tab ───────────────────────────────────────────

function HistoryTab({ history }: { history: VerificationHistoryItem[] }) {
  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border-light)] bg-white p-8 text-center">
        <Clock className="h-8 w-8 text-gray-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-gray-700 mb-1">No verifications yet</h3>
        <p className="text-xs text-[var(--text-secondary)]">
          Verification results will appear here as you check patients.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Patient</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Payer</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Plan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {history.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                <td className="px-4 py-2 text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-2 font-medium">{item.patientName}</td>
                <td className="px-4 py-2 text-gray-600">{item.payer}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-2 text-gray-600">{item.result.planName || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Page Wrapper ──────────────────────────────────────────

export default function EligibilityPage() {
  const { data: session } = useSession();
  const plan = (session?.user as any)?.plan;

  // Determine if user has PRO or above access
  const hasAccess =
    plan === "pro" ||
    plan === "intelligence" ||
    plan === "api" ||
    plan === "enterprise" ||
    plan === "care";

  if (!hasAccess) {
    return (
      <UpgradeGate
        feature="Eligibility Verification"
        requiredTier="pro"
        bullets={[
          "Verify patient coverage in 1\u20133 seconds",
          "Check copays, deductibles, and out-of-pocket max",
          "Medicare Advantage recursive identification",
          "Auto-detect CCM/AWV/TCM revenue opportunities",
          "Batch verification for up to 500 patients",
        ]}
      >
        <EligibilityDashboard />
      </UpgradeGate>
    );
  }

  return <EligibilityDashboard />;
}
