import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function GuideNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <div className="h-16 w-16 rounded-2xl border border-dark-50/50 bg-dark-400/50 flex items-center justify-center">
        <BookOpen className="h-8 w-8 text-[var(--text-secondary)]" />
      </div>
      <div className="text-center max-w-md">
        <p className="text-lg font-semibold">Guide Not Found</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          The billing guide you&apos;re looking for doesn&apos;t exist yet.
          Check out our available guides below.
        </p>
      </div>
      <Link
        href="/guides"
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-dark hover:bg-gold-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Browse All Guides
      </Link>
    </div>
  );
}
