"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Zap,
  Loader2,
  Search,
  ArrowRight,
  Shield,
  Activity,
  FileText,
  AlertCircle,
} from "lucide-react";

interface PartnerInfo {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
}

export default function PartnerScanPage() {
  const params = useParams();
  const router = useRouter();
  const partnerId = params.id as string;

  const [partner, setPartner] = useState<PartnerInfo | null>(null);
  const [partnerLoading, setPartnerLoading] = useState(true);
  const [partnerError, setPartnerError] = useState<string | null>(null);

  const [npi, setNpi] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");

  // Fetch partner info on mount
  useEffect(() => {
    async function loadPartner() {
      try {
        const res = await fetch(
          `/api/partners?id=${encodeURIComponent(partnerId)}`
        );
        if (!res.ok) {
          setPartnerError("Partner not found.");
          return;
        }
        const data = await res.json();
        setPartner(data.partner || data);
      } catch {
        setPartnerError("Unable to load partner information.");
      } finally {
        setPartnerLoading(false);
      }
    }

    loadPartner();
  }, [partnerId]);

  const isValid = npi.length === 10 && /^\d+$/.test(npi);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setScanError("");
    setIsScanning(true);

    try {
      // Increment partner scan count
      await fetch("/api/partners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: partnerId }),
      }).catch(() => {
        // Non-critical: don't block scan if partner tracking fails
      });

      // Redirect to scan results
      router.push(`/scan/${npi}`);
    } catch {
      setScanError("Something went wrong. Please try again.");
      setIsScanning(false);
    }
  };

  // ── Loading state ──────────────────────────────────────────
  if (partnerLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-[#2F5EA8] animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  // ── Partner not found ──────────────────────────────────────
  if (partnerError || !partner) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="h-16 w-16 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <div className="text-center max-w-md">
          <p className="text-lg font-semibold">Partner Not Found</p>
          <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
            {partnerError ||
              "We couldn't find a partner with this ID. Please check the URL and try again."}
          </p>
        </div>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-colors"
        >
          Go to NPIxray
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // ── Main partner scan page ─────────────────────────────────
  return (
    <section className="relative overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(47,94,168,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(47,94,168,0.15) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#2F5EA8]/[0.04] rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Partner co-branding header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-xl font-bold text-white tracking-tight">
            NPI<span className="text-[#2F5EA8]">xray</span>
          </span>
          <span className="text-[var(--text-secondary)] text-lg">&times;</span>
          {partner.logo ? (
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-8 object-contain"
            />
          ) : (
            <span className="text-xl font-bold text-white tracking-tight">
              {partner.name}
            </span>
          )}
        </div>

        {/* Powered by badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#2F5EA8] animate-pulse" />
            <span className="text-xs font-medium text-[#2F5EA8]">
              Powered by NPIxray for {partner.name}
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-center text-4xl sm:text-5xl font-bold tracking-tight text-balance max-w-3xl mx-auto leading-[1.1]">
          X-Ray Your{" "}
          <span className="text-[#2F5EA8]">Practice Revenue</span>
        </h1>

        <p className="mt-6 text-center text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Enter any NPI number to instantly see how much revenue your practice
          is leaving on the table. Free. No login required.
        </p>

        {/* Scanner Card */}
        <div className="mt-12 mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[var(--border-light)] bg-white/80 backdrop-blur-sm p-6 sm:p-8 glow-blue">
            <form onSubmit={handleScan}>
              {/* NPI Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="h-5 w-5 text-[var(--text-secondary)]" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter 10-digit NPI number"
                  value={npi}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) setNpi(val);
                  }}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-4 pl-12 pr-4 text-lg font-mono tracking-wider placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20/50 focus:ring-1 focus:ring-[#2F5EA8]/10 outline-none transition-all"
                  aria-label="NPI number"
                />
                {npi.length > 0 && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span
                      className={`text-xs font-mono ${
                        npi.length === 10
                          ? "text-green-400"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {npi.length}/10
                    </span>
                  </div>
                )}
              </div>

              {/* Scan Button */}
              <button
                type="submit"
                disabled={!isValid || isScanning}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] py-4 text-base font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#264D8C] disabled:hover:shadow-none"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Scan Now
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Helper text */}
            <p className="mt-4 text-center text-xs text-[var(--text-secondary)]">
              Don&apos;t know your NPI?{" "}
              <Link href="/" className="text-[#2F5EA8] hover:underline">
                Search by provider name
              </Link>
            </p>

            {scanError && (
              <p className="mt-2 text-center text-xs text-red-400">
                {scanError}
              </p>
            )}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-[#4FA3D1]" />
            No login required
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-[#4FA3D1]" />
            1.2M+ providers indexed
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-[#4FA3D1]" />
            CMS public data only
          </div>
        </div>

        {/* What you'll see */}
        <div className="mt-20 mx-auto max-w-3xl">
          <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight mb-8">
            What Your Scan{" "}
            <span className="text-[#2F5EA8]">Reveals</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "E&M Coding Gaps",
                desc: "See if you're undercoding 99213 vs 99214/99215 visits compared to your specialty.",
              },
              {
                title: "CCM & RPM Opportunities",
                desc: "Identify patients eligible for Chronic Care Management and Remote Patient Monitoring.",
              },
              {
                title: "AWV Revenue Gap",
                desc: "Annual Wellness Visits are massively underbilled. See your missed revenue.",
              },
              {
                title: "90-Day Action Plan",
                desc: "Get a prioritized roadmap to capture missed revenue, ranked by impact.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/10 transition-colors"
              >
                <h3 className="text-sm font-semibold mb-1.5">{item.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Partner attribution */}
        <div className="mt-16 text-center">
          <p className="text-xs text-[var(--text-secondary)]">
            Revenue intelligence provided by{" "}
            <Link href="/" className="text-[#2F5EA8] hover:underline">
              NPIxray
            </Link>
            {partner.website && (
              <>
                {" "}
                in partnership with{" "}
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2F5EA8] hover:underline"
                >
                  {partner.name}
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
