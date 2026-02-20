"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Stethoscope,
  ChevronRight,
  Loader2,
  SearchX,
  RefreshCw,
  AlertTriangle,
  Info,
} from "lucide-react";
import { NPPESProvider } from "@/lib/types";
import { trackEvent } from "@/lib/analytics";

export function SearchResults() {
  const searchParams = useSearchParams();
  const lastName = searchParams.get("last_name") || "";
  const firstName = searchParams.get("first_name") || "";
  const state = searchParams.get("state") || "";

  const [results, setResults] = useState<NPPESProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const params = new URLSearchParams();
      params.set("last_name", lastName);
      if (firstName) params.set("first_name", firstName);
      if (state) params.set("state", state);

      const res = await fetch(`/api/npi?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Search failed. Please try again.");
        return;
      }
      setResults(json.results || []);
      trackEvent({
        action: "provider_search",
        category: "search",
        label: `${firstName} ${lastName} ${state}`.trim(),
        value: (json.results || []).length,
      });
    } catch {
      setError(
        "Unable to reach the NPPES Registry. Check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, [lastName, firstName, state]);

  useEffect(() => {
    search();
  }, [search]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Scanner
      </Link>

      <h1 className="text-2xl font-bold mb-2">Search Results</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        {firstName && `${firstName} `}
        {lastName}
        {state && ` in ${state}`}
      </p>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 text-[#2F5EA8] animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">
            Searching NPPES Registry...
          </p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="h-14 w-14 rounded-2xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>
          <div className="text-center max-w-md">
            <p className="font-semibold mb-1">Search Failed</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {error}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={search}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Search
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:border-[#2F5EA8]/15 hover:text-[#2F5EA8] transition-all"
            >
              New Search
            </Link>
          </div>
        </div>
      )}

      {/* No Results State */}
      {!loading && !error && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="h-14 w-14 rounded-2xl border border-[var(--border-light)] bg-white flex items-center justify-center">
            <SearchX className="h-7 w-7 text-[var(--text-secondary)]" />
          </div>
          <div className="text-center max-w-md">
            <p className="font-semibold mb-1">No Providers Found</p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We couldn&apos;t find any providers matching your search.
            </p>
          </div>
          <div className="mt-2 rounded-xl border border-[var(--border-light)] bg-white p-4 max-w-sm w-full">
            <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
              Try these tips:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-[#2F5EA8] mt-0.5">&#x2022;</span>
                Double-check the spelling of the name
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2F5EA8] mt-0.5">&#x2022;</span>
                Try searching by last name only
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2F5EA8] mt-0.5">&#x2022;</span>
                Remove the state filter to search nationally
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2F5EA8] mt-0.5">&#x2022;</span>
                If you know the NPI, search by number instead
              </li>
            </ul>
          </div>
          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            New Search
          </Link>
        </div>
      )}

      {/* Results List */}
      {!loading && !error && results.length > 0 && (
        <div className="space-y-3">
          {/* Results count + too many results hint */}
          <div className="flex flex-col gap-2 mb-4">
            <p className="text-xs text-[var(--text-secondary)]">
              {results.length} provider{results.length !== 1 ? "s" : ""} found
              {" "}&mdash; select one to scan
            </p>

            {results.length >= 20 && (
              <div className="flex items-start gap-2 rounded-lg border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.04] p-3">
                <Info className="h-4 w-4 text-[#2F5EA8] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Showing the first 20 matches. For more specific results, try
                  adding a <strong className="text-[var(--text-primary)]">state filter</strong> or include
                  a <strong className="text-[var(--text-primary)]">first name</strong>.
                </p>
              </div>
            )}
          </div>

          {results.map((provider) => (
            <Link
              key={provider.npi}
              href={`/scan/${provider.npi}`}
              className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-light)] bg-white hover:border-[#2F5EA8]/10 hover:bg-[var(--bg)] transition-all group"
            >
              <div>
                <p className="font-semibold group-hover:text-[#2F5EA8] transition-colors">
                  {provider.fullName}
                  {provider.credential && (
                    <span className="text-[var(--text-secondary)] font-normal ml-1.5 text-sm">
                      {provider.credential}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3 text-[#4FA3D1]" />
                    {provider.specialty}
                  </span>
                  {provider.address.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#4FA3D1]" />
                      {provider.address.city}, {provider.address.state}
                    </span>
                  )}
                  <span className="font-mono text-[var(--text-secondary)]/70">
                    NPI {provider.npi}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-[var(--text-secondary)] group-hover:text-[#2F5EA8] transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
