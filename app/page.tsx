"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Zap,
  TrendingUp,
  Shield,
  BarChart3,
  ArrowRight,
  Activity,
  DollarSign,
  Users,
  FileText,
  ChevronRight,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

type SearchMode = "npi" | "name";

const FAQS = [
  {
    q: "What is an NPI number?",
    a: "An NPI (National Provider Identifier) is a unique 10-digit number assigned to every healthcare provider in the United States by CMS. It's used for billing, claims, and identification across all health plans. Every doctor, nurse practitioner, and healthcare organization has one.",
  },
  {
    q: "Is this really free?",
    a: "Yes, 100% free with no limits. Our NPI scanner uses publicly available CMS Medicare data that the government publishes for transparency. There's no login required, no credit card, and you can scan as many NPIs as you want. We offer paid tiers for deeper analysis, but the scan is free forever.",
  },
  {
    q: "Where does the data come from?",
    a: "We use two public government data sources: the NPPES NPI Registry for provider information (name, specialty, location) and the CMS Medicare Physician & Other Practitioners dataset for billing patterns. This dataset contains over 10 million records covering 1.2M+ providers. No private patient data is ever used.",
  },
  {
    q: "How accurate are the revenue estimates?",
    a: "Our estimates are based on specialty benchmarks derived from national Medicare averages across 1.2M+ providers. They're directionally accurate for identifying gaps, but your actual numbers will vary based on your payer mix, patient panel, documentation practices, and geographic location. Think of it as a diagnostic tool, not an exact audit.",
  },
  {
    q: "Is my data private?",
    a: "We only use publicly available CMS data that the government publishes for anyone to access. We don't access any private patient records, EHR data, or protected health information (PHI). Your NPI scan results are generated on the fly and aren't stored or shared with third parties.",
  },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

export default function HomePage() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<SearchMode>("npi");
  const [npi, setNpi] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [state, setState] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    setScanError("");
    setIsScanning(true);

    if (searchMode === "npi") {
      router.push(`/scan/${npi}`);
    } else {
      const params = new URLSearchParams();
      params.set("last_name", lastName.trim());
      if (firstName.trim()) params.set("first_name", firstName.trim());
      if (state) params.set("state", state);
      router.push(`/search?${params.toString()}`);
    }
  };

  const isValid =
    searchMode === "npi"
      ? npi.length === 10 && /^\d+$/.test(npi)
      : lastName.trim().length > 0;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F4F7FB] to-[#E9EEF6]" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(47,94,168,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(47,94,168,0.4) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#2F5EA8]/[0.03] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/15 bg-white/80 backdrop-blur-sm px-4 py-1.5 shadow-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-[#22C1A1] animate-pulse" />
              <span className="text-xs font-medium text-[#2F5EA8]">
                Powered by CMS Medicare Public Data
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance max-w-4xl mx-auto leading-[1.1] text-[var(--text-primary)]">
            X-Ray Your{" "}
            <span className="text-[#2F5EA8]">Practice Revenue</span>
          </h1>

          <p className="mt-6 text-center text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
            Enter any NPI number to instantly see how much revenue your practice
            is leaving on the table. Free. No login required.
          </p>

          {/* Scanner Card */}
          <div className="mt-12 mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[var(--border-light)] bg-white/90 backdrop-blur-sm p-6 sm:p-8 shadow-lg shadow-[#2F5EA8]/[0.06]">
              {/* Search Mode Toggle */}
              <div className="flex gap-1 p-1 rounded-lg bg-[var(--surface-alt)] mb-6 max-w-xs">
                <button
                  onClick={() => setSearchMode("npi")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    searchMode === "npi"
                      ? "bg-[#2F5EA8] text-white shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  NPI Number
                </button>
                <button
                  onClick={() => setSearchMode("name")}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    searchMode === "name"
                      ? "bg-[#2F5EA8] text-white shadow-sm"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Search by Name
                </button>
              </div>

              <form onSubmit={handleScan}>
                {searchMode === "npi" ? (
                  /* NPI Input */
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Search className="h-5 w-5 text-[var(--text-muted)]" />
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
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] py-4 pl-12 pr-4 text-lg font-mono tracking-wider text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#2F5EA8]/40 focus:ring-2 focus:ring-[#2F5EA8]/10 outline-none transition-all"
                      aria-label="NPI number"
                    />
                    {npi.length > 0 && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className={`text-xs font-mono ${npi.length === 10 ? "text-[#22C1A1]" : "text-[var(--text-muted)]"}`}>
                          {npi.length}/10
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Name Search Inputs */
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3.5 px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#2F5EA8]/40 focus:ring-2 focus:ring-[#2F5EA8]/10 outline-none transition-all"
                      aria-label="Provider first name"
                    />
                    <input
                      type="text"
                      placeholder="Last name *"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3.5 px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[#2F5EA8]/40 focus:ring-2 focus:ring-[#2F5EA8]/10 outline-none transition-all"
                      aria-label="Provider last name"
                      required
                    />
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="rounded-xl border border-[var(--border)] bg-[var(--bg)] py-3.5 px-4 text-sm text-[var(--text-secondary)] focus:border-[#2F5EA8]/40 focus:ring-2 focus:ring-[#2F5EA8]/10 outline-none transition-all appearance-none cursor-pointer"
                      aria-label="State"
                    >
                      <option value="">All states</option>
                      {US_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Scan Button */}
                <button
                  type="submit"
                  disabled={!isValid || isScanning}
                  className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] py-4 text-base font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/15 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#2F5EA8] disabled:hover:shadow-none"
                >
                  {isScanning ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      Run Free Scan
                    </>
                  )}
                </button>
              </form>

              {/* Helper text */}
              <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
                {searchMode === "npi"
                  ? "Don't know your NPI? Switch to name search above."
                  : "For best results, include the state."}
              </p>
              {scanError && (
                <p className="mt-2 text-center text-xs text-red-500">
                  {scanError}
                </p>
              )}
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-[#22C1A1]" />
              No login required
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-[#4FA3D1]" />
              1.2M+ providers indexed
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-[#2F5EA8]" />
              CMS public data only
            </div>
          </div>

          {/* Group Practice CTA */}
          <div className="mt-8 flex justify-center">
            <a
              href="/group"
              className="group inline-flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white/80 backdrop-blur-sm px-6 py-3 hover:border-[#2F5EA8]/20 hover:shadow-md transition-all"
            >
              <Users className="h-5 w-5 text-[#4FA3D1] group-hover:text-[#2F5EA8] transition-colors" />
              <div className="text-left">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Scan Your Entire Practice</p>
                <p className="text-xs text-[var(--text-secondary)]">Enter multiple NPIs for practice-wide revenue analysis</p>
              </div>
              <ChevronRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[#2F5EA8] transition-colors" />
            </a>
          </div>
        </div>
      </section>

      {/* What the Scan Reveals */}
      <section className="border-t border-[var(--border-light)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              What Your Scan <span className="text-[#2F5EA8]">Reveals</span>
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto">
              We analyze your billing patterns against specialty benchmarks to find
              every dollar you&apos;re leaving on the table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "E&M Coding Gap",
                desc: "Compare your 99213/99214/99215 distribution against your specialty. Most practices undercode by $15,000\u2013$40,000/year.",
                metric: "$15K\u2013$40K",
                label: "avg. missed/year",
              },
              {
                icon: Users,
                title: "CCM Revenue (99490)",
                desc: "Identify patients with 2+ chronic conditions eligible for Chronic Care Management \u2014 $66\u2013$144/patient/month.",
                metric: "$66\u2013$144",
                label: "per patient/month",
              },
              {
                icon: Activity,
                title: "RPM Revenue (99453\u201399458)",
                desc: "Find patients eligible for Remote Patient Monitoring. Hypertension, diabetes, and COPD patients qualify.",
                metric: "$120+",
                label: "per patient/month",
              },
              {
                icon: TrendingUp,
                title: "AWV Gap (G0438/G0439)",
                desc: "Annual Wellness Visits are massively underbilled. Each missed AWV = $118\u2013$174 in lost revenue.",
                metric: "$118\u2013$174",
                label: "per missed visit",
              },
              {
                icon: DollarSign,
                title: "BHI Opportunity (99484)",
                desc: "Behavioral Health Integration is the most underutilized program. Depression screening unlocks new revenue.",
                metric: "$48+",
                label: "per patient/month",
              },
              {
                icon: FileText,
                title: "AI Action Plan",
                desc: "Get a prioritized 90-day roadmap to capture missed revenue, ranked by ease of implementation and dollar impact.",
                metric: "90-day",
                label: "capture roadmap",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group rounded-xl border border-[var(--border-light)] bg-white p-6 hover:border-[#2F5EA8]/15 hover:shadow-lg hover:shadow-[#2F5EA8]/[0.04] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10">
                    <card.icon className="h-5 w-5 text-[#2F5EA8]" />
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#2F5EA8]">{card.metric}</div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                      {card.label}
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">{card.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-[var(--border-light)] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              How It <span className="text-[#2F5EA8]">Works</span>
            </h2>
            <p className="mt-4 text-[var(--text-secondary)] max-w-xl mx-auto">
              Three steps. Thirty seconds. Zero cost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Enter Your NPI",
                desc: "Type any 10-digit NPI number or search by provider name. We pull live data from the NPPES Registry.",
              },
              {
                step: "02",
                title: "We Analyze CMS Data",
                desc: "Our engine cross-references your Medicare billing patterns against 1.2M+ providers and specialty benchmarks.",
              },
              {
                step: "03",
                title: "See Your Revenue Gaps",
                desc: "Get an interactive dashboard showing exactly where you're leaving money on the table \u2014 and how to capture it.",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t border-dashed border-[var(--border)]" />
                )}
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2F5EA8]/15 bg-[#2F5EA8]/[0.04] mb-4">
                  <span className="text-2xl font-bold text-[#2F5EA8] font-mono">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2F5EA8] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/15"
            >
              Scan Your NPI Now
              <ArrowRight className="h-5 w-5" />
            </a>
            <p className="mt-3 text-xs text-[var(--text-muted)]">
              Free forever. No credit card. No login.
            </p>
          </div>
        </div>
      </section>

      {/* Data Ticker / Social Proof */}
      <section className="border-t border-[var(--border-light)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "1.2M+", label: "Providers Indexed" },
              { value: "10M+", label: "Billing Records" },
              { value: "$180B+", label: "Medicare Data Analyzed" },
              { value: "15+", label: "Specialties Covered" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-[#2F5EA8] font-mono">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-[var(--text-muted)] uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-[var(--border-light)] bg-white">
        {/* FAQPage JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a,
                },
              })),
            }),
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] px-4 py-1.5 mb-6">
              <HelpCircle className="h-3.5 w-3.5 text-[#2F5EA8]" />
              <span className="text-xs font-medium text-[#2F5EA8]">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Frequently Asked <span className="text-[#2F5EA8]">Questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--border-light)] bg-white overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--bg)] transition-colors"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-[var(--text-primary)] pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#2F5EA8] flex-shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 -mt-1">
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[var(--border-light)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] max-w-2xl mx-auto">
            Stop leaving <span className="text-[#2F5EA8]">revenue</span> on the table
          </h2>
          <p className="mt-4 text-[var(--text-secondary)] max-w-lg mx-auto">
            The average practice misses $50,000\u2013$250,000 per year in billable revenue.
            Find out your number in 30 seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F5EA8] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-lg hover:shadow-[#2F5EA8]/15"
            >
              <Zap className="h-5 w-5" />
              Get Your Free Scan
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-8 py-4 text-base font-medium text-[var(--text-secondary)] hover:border-[#2F5EA8]/20 hover:text-[#2F5EA8] transition-all"
            >
              View Pricing
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
