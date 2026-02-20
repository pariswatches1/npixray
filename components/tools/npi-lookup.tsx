"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Loader2,
  MapPin,
  Stethoscope,
  ArrowRight,
  Zap,
  AlertCircle,
} from "lucide-react";

interface ProviderResult {
  npi: string;
  name: string;
  specialty: string;
  city: string;
  state: string;
  hasData?: boolean;
}

export function NpiLookupTool() {
  const [searchMode, setSearchMode] = useState<"npi" | "name">("npi");
  const [npi, setNpi] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [results, setResults] = useState<ProviderResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const US_STATES = [
    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
    "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
    "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
    "VA","WA","WV","WI","WY","DC",
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResults([]);
    setLoading(true);
    setSearched(true);

    try {
      let url: string;

      if (searchMode === "npi") {
        if (!/^\d{10}$/.test(npi)) {
          setError("Please enter a valid 10-digit NPI number.");
          setLoading(false);
          return;
        }
        url = `/api/cms/${npi}`;
      } else {
        if (!lastName.trim()) {
          setError("Last name is required for name search.");
          setLoading(false);
          return;
        }
        const params = new URLSearchParams();
        params.set("last_name", lastName.trim());
        if (firstName.trim()) params.set("first_name", firstName.trim());
        if (state) params.set("state", state);
        url = `/api/npi?${params.toString()}`;
      }

      const res = await fetch(url);

      if (!res.ok) {
        if (res.status === 404) {
          setResults([]);
          setLoading(false);
          return;
        }
        throw new Error("Search failed");
      }

      const data = await res.json();

      if (searchMode === "npi") {
        // Single provider result from CMS data
        if (data && data.npi) {
          setResults([
            {
              npi: data.npi,
              name: data.providerName || data.name || "Unknown",
              specialty: data.specialty || "Unknown",
              city: data.city || "",
              state: data.state || "",
              hasData: true,
            },
          ]);
        } else {
          setResults([]);
        }
      } else {
        // NPPES name search results
        const providers = data.results || data || [];
        setResults(
          providers.slice(0, 20).map((p: Record<string, string>) => ({
            npi: p.npi || p.number || "",
            name: p.name || `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Unknown",
            specialty: p.specialty || p.taxonomy_description || "Unknown",
            city: p.city || "",
            state: p.state || "",
          }))
        );
      }
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Search Form */}
      <div className="rounded-2xl border border-[var(--border-light)] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Search className="h-5 w-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold">Search Providers</h2>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--bg)] mb-6 max-w-xs">
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

        <form onSubmit={handleSearch}>
          {searchMode === "npi" ? (
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                NPI Number
              </label>
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
                className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] font-mono tracking-wider placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
                aria-label="NPI number"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
                  aria-label="First name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
                  aria-label="Last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] focus:border-[#2F5EA8]/20 focus:outline-none transition-colors appearance-none cursor-pointer"
                  aria-label="State"
                >
                  <option value="">All states</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Specialty
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cardiology"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border-light)] bg-white px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#2F5EA8]/20 focus:outline-none transition-colors"
                  aria-label="Specialty"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (searchMode === "npi" ? npi.length !== 10 : !lastName.trim())}
            className="mt-6 w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2F5EA8] text-white font-semibold rounded-lg px-6 py-3 hover:bg-[#264D8C] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Search
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 flex items-center gap-2 text-red-400 text-sm bg-red-500/5 border border-red-500/20 rounded-lg p-4">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {searched && !loading && !error && (
        <div className="mt-8">
          <h3 className="text-base font-semibold mb-4 text-[var(--text-secondary)]">
            {results.length > 0
              ? `${results.length} result${results.length !== 1 ? "s" : ""} found`
              : "No results found"}
          </h3>

          {results.length === 0 && (
            <div className="rounded-xl border border-[var(--border-light)] bg-white p-8 text-center">
              <Search className="h-8 w-8 text-[var(--text-secondary)]/30 mx-auto mb-3" />
              <p className="text-[var(--text-secondary)]">
                No providers found matching your search. Try adjusting your criteria.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {results.map((provider) => (
              <div
                key={provider.npi}
                className="rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/10 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-lg">{provider.name}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-sm text-[var(--text-secondary)]">
                      <span className="font-mono text-[#2F5EA8]/80">
                        NPI: {provider.npi}
                      </span>
                      {provider.specialty && (
                        <span className="flex items-center gap-1">
                          <Stethoscope className="h-3.5 w-3.5" />
                          {provider.specialty}
                        </span>
                      )}
                      {(provider.city || provider.state) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {[provider.city, provider.state].filter(Boolean).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/scan/${provider.npi}`}
                      className="inline-flex items-center gap-1.5 bg-[#2F5EA8] text-white font-semibold rounded-lg px-4 py-2 text-sm hover:bg-[#264D8C] transition-colors"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      Scan
                    </Link>
                    <Link
                      href={`/provider/${provider.npi}`}
                      className="inline-flex items-center gap-1.5 border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-colors"
                    >
                      Profile
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
