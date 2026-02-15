import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-dark-50/50 bg-dark-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
                <Zap className="h-4 w-4 text-gold" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                NPI<span className="text-gold">xray</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              AI-powered revenue intelligence for medical practices. Built on free CMS public data.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  NPI Scanner
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/guides" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Billing Guides
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  State Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-dark-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-secondary)]">
            &copy; {new Date().getFullYear()} NPIxray. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            Data sourced from CMS.gov public datasets. Not medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
