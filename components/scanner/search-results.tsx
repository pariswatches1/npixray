"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Stethoscope,
  ChevronRight,
  Loader2,
  SearchX,
} from "lucide-react";
import { NPPESProvider } from "@/lib/types";

export function SearchResults() {
  const searchParams = useSearchParams();
  const lastName = searchParams.get("last_name") || "";
  const firstName = searchParams.get("first_name") || "";
  const state = searchParams.get("state") || "";

  const [results, setResults] = useState<NPPESProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function search() {
      try {
        const params = new URLSearchParams();
        params.set("last_name", lastName);
        if (firstName) params.set("first_name", firstName);
        if (state) params.set("state", state);

        const res = await fetch(`/api/npi?${params.toString()}`);
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || "Search failed");
          return;
        }
        setResults(json.results || []);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    search();
  }, [lastName, firstName, state]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-gold transition-colors mb-6"
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

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 text-gold animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">
            Searching NPPES Registry...
          </p>
        </div>
      )}

      {error && (
        <div className="text-center py-16">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <SearchX className="h-10 w-10 text-[var(--text-secondary)]" />
          <p className="text-[var(--text-secondary)]">
            No providers found. Try adjusting your search.
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-[var(--text-secondary)] mb-4">
            {results.length} provider{results.length !== 1 ? "s" : ""} found —
            select one to scan
          </p>
          {results.map((provider) => (
            <Link
              key={provider.npi}
              href={`/scan/${provider.npi}`}
              className="flex items-center justify-between p-4 rounded-xl border border-dark-50/80 bg-dark-400/50 hover:border-gold/20 hover:bg-dark-300/80 transition-all group"
            >
              <div>
                <p className="font-semibold group-hover:text-gold transition-colors">
                  {provider.fullName}
                  {provider.credential && (
                    <span className="text-[var(--text-secondary)] font-normal ml-1.5 text-sm">
                      {provider.credential}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Stethoscope className="h-3 w-3 text-gold/50" />
                    {provider.specialty}
                  </span>
                  {provider.address.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gold/50" />
                      {provider.address.city}, {provider.address.state}
                    </span>
                  )}
                  <span className="font-mono text-[var(--text-secondary)]/70">
                    NPI {provider.npi}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-[var(--text-secondary)] group-hover:text-gold transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
