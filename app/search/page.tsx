import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SearchResults } from "@/components/scanner/search-results";

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
