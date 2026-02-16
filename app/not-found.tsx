import Link from "next/link";
import { Zap, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      {/* 404 Number */}
      <div className="text-[120px] sm:text-[160px] font-bold font-mono text-gold/20 leading-none select-none">
        404
      </div>

      {/* Message */}
      <div className="text-center -mt-4 max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">Page Not Found</h1>
        <p className="text-[var(--text-secondary)] leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Try scanning an NPI number or browsing our billing guides.
        </p>
      </div>

      {/* CTAs */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
        >
          <Zap className="h-4 w-4" />
          Scan Your NPI
        </Link>
        <Link
          href="/guides"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-dark-50 px-6 py-3 text-sm font-medium text-[var(--text-secondary)] hover:border-gold/30 hover:text-gold transition-all"
        >
          <BookOpen className="h-4 w-4" />
          Browse Guides
        </Link>
      </div>
    </div>
  );
}
