import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SearchResults } from "@/components/scanner/search-results";

export const metadata: Metadata = {
  title: "Search Medicare Providers | NPIxray",
  description:
    "Search 1.175M+ Medicare providers by name, specialty, or location. View billing data and revenue analysis instantly.",
  alternates: {
    canonical: "https://npixray.com/search",
  },
};

function SearchFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Loader2 className="h-8 w-8 text-gold animate-spin" />
      <p className="text-sm text-[var(--text-secondary)]">Loading search...</p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchResults />
    </Suspense>
  );
}
