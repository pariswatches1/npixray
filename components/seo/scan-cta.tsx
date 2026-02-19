import Link from "next/link";
import { Zap } from "lucide-react";

interface ScanCTAProps {
  providerName?: string;
  state?: string;       // e.g., "California"
  specialty?: string;   // e.g., "Cardiology"
}

export function ScanCTA({ providerName, state, specialty }: ScanCTAProps) {
  // Build context-aware headline
  let headline = "Scan Any Provider's Revenue";
  let description = "Enter any NPI number to instantly see missed revenue from E&M coding gaps, CCM, RPM, BHI, and AWV programs.";

  if (providerName) {
    headline = `See ${providerName}'s Full Revenue Analysis`;
  } else if (state && specialty) {
    headline = `Find ${specialty} Providers in ${state} to Scan`;
    description = `Enter an NPI number for any ${specialty} provider in ${state} to see exactly how much revenue they're leaving on the table.`;
  } else if (state) {
    headline = `Scan a Provider in ${state}`;
    description = `Enter an NPI number for any Medicare provider in ${state} to instantly see missed revenue opportunities.`;
  } else if (specialty) {
    headline = `Scan a ${specialty} Provider`;
    description = `Enter any ${specialty} provider's NPI number to see their E&M coding patterns, program adoption, and revenue opportunities.`;
  }

  return (
    <div className="mt-12 rounded-2xl border border-gold/20 bg-gold/5 p-8 text-center">
      <Zap className="h-8 w-8 text-gold mx-auto mb-4" />
      <h2 className="text-2xl font-bold mb-2">{headline}</h2>
      <p className="text-[var(--text-secondary)] mb-6 max-w-lg mx-auto">
        {description}
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
