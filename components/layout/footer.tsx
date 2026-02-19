import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-dark-50/50 bg-dark-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Row 1: Brand + main sections */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Tools
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/tools/revenue-calculator" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Revenue Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/roi-calculator" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  ROI Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/npi-lookup" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  NPI Lookup
                </Link>
              </li>
              <li>
                <Link href="/tools/em-audit" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  E&M Audit Tool
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-sm text-gold hover:text-gold-300 transition-colors font-medium">
                  All Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Data */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Data
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/codes" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Billing Codes
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Data Insights
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Provider Rankings
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Compare Specialties
                </Link>
              </li>
              <li>
                <Link href="/reports/2026-medicare-revenue-gap" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  2026 Revenue Gap Report
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Public API
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Row 2: Compare, Solutions, Programs, States, Specialties */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-8 pt-8 border-t border-dark-50/30">
          {/* Compare */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Compare
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/vs/chartspan" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  vs ChartSpan
                </Link>
              </li>
              <li>
                <Link href="/vs/signallamp" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  vs SignalLamp
                </Link>
              </li>
              <li>
                <Link href="/alternatives" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Alternatives
                </Link>
              </li>
              <li>
                <Link href="/switch" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Switch to NPIxray
                </Link>
              </li>
              <li>
                <Link href="/vs" className="text-sm text-gold hover:text-gold-300 transition-colors font-medium">
                  All Comparisons →
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Solutions
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/solutions/solo-practice" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Solo Practices
                </Link>
              </li>
              <li>
                <Link href="/solutions/group-practice" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Group Practices
                </Link>
              </li>
              <li>
                <Link href="/solutions/billing-companies" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Billing Companies
                </Link>
              </li>
              <li>
                <Link href="/solutions/practice-managers" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  Practice Managers
                </Link>
              </li>
              <li>
                <Link href="/solutions" className="text-sm text-gold hover:text-gold-300 transition-colors font-medium">
                  All Solutions →
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-sm font-semibold text-gold mb-4 uppercase tracking-wider">
              Programs
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/programs/ccm" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  CCM
                </Link>
              </li>
              <li>
                <Link href="/programs/rpm" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  RPM
                </Link>
              </li>
              <li>
                <Link href="/programs/awv" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  AWV
                </Link>
              </li>
              <li>
                <Link href="/programs/bhi" className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors">
                  BHI
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-sm text-gold hover:text-gold-300 transition-colors font-medium">
                  All Programs →
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
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-xs text-[var(--text-secondary)] hover:text-gold transition-colors">About</Link>
            <Link href="/pricing" className="text-xs text-[var(--text-secondary)] hover:text-gold transition-colors">Pricing</Link>
            <Link href="/guides" className="text-xs text-[var(--text-secondary)] hover:text-gold transition-colors">Guides</Link>
            <Link href="/methodology" className="text-xs text-[var(--text-secondary)] hover:text-gold transition-colors">Methodology</Link>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Data sourced from CMS.gov public datasets. Not medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
