import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-dark-50/50 bg-dark-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
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
              <li>
                <Link href="/about" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Guides */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Guides
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/guides/ccm-billing-99490" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  CCM Billing (99490)
                </Link>
              </li>
              <li>
                <Link href="/guides/rpm-billing-99453-99458" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  RPM Billing
                </Link>
              </li>
              <li>
                <Link href="/guides/awv-billing-g0438-g0439" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  AWV Billing
                </Link>
              </li>
              <li>
                <Link href="/guides/em-coding-optimization" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  E&M Coding
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-gold hover:text-gold-300 transition-colors font-medium">
                  All Guides →
                </Link>
              </li>
            </ul>
          </div>

          {/* Top States */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Top States
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/states/california" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  California
                </Link>
              </li>
              <li>
                <Link href="/states/florida" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Florida
                </Link>
              </li>
              <li>
                <Link href="/states/texas" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Texas
                </Link>
              </li>
              <li>
                <Link href="/states/new-york" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  New York
                </Link>
              </li>
              <li>
                <Link href="/states" className="text-sm text-gold hover:text-gold-300 transition-colors font-medium">
                  All 50 States →
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Specialties
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/specialties/family-medicine" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Family Medicine
                </Link>
              </li>
              <li>
                <Link href="/specialties/cardiology" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Cardiology
                </Link>
              </li>
              <li>
                <Link href="/specialties/internal-medicine" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Internal Medicine
                </Link>
              </li>
              <li>
                <Link href="/specialties/orthopedics" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Orthopedics
                </Link>
              </li>
              <li>
                <Link href="/specialties" className="text-sm text-gold hover:text-gold-300 transition-colors font-medium">
                  All Specialties →
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
