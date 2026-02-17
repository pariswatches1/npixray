import Link from "next/link";
import { Zap } from "lucide-react";

export function ScanCTA({ providerName }: { providerName?: string }) {
  return (
    <div className="mt-12 rounded-2xl border border-gold/20 bg-gold/5 p-8 text-center">
      <Zap className="h-8 w-8 text-gold mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">
        {providerName ? `See ${providerName}'s Full Revenue Analysis` : "Scan Any Provider's Revenue"}
      </h2>
      <p className="text-[var(--text-secondary)] mb-6 max-w-lg mx-auto">
        Enter any NPI number to instantly see missed revenue from E&M coding gaps, CCM, RPM, BHI, and AWV programs.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold text-dark font-semibold hover:bg-gold-300 transition-colors"
      >
        <Zap className="h-4 w-4" />
        Run Free Scan
      </Link>
    </div>
  );
}
