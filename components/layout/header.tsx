"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-dark-50/50 bg-dark/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 border border-gold/20 group-hover:bg-gold/20 transition-colors">
              <Zap className="h-4 w-4 text-gold" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              NPI<span className="text-gold">xray</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <Link
              href="/guides"
              className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors"
            >
              Guides
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm text-[var(--text-secondary)] hover:text-gold transition-colors"
            >
              About
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-dark transition-all hover:bg-gold-300 hover:shadow-lg hover:shadow-gold/20"
            >
              <Zap className="h-3.5 w-3.5" />
              Scan NPI
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-gold transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-dark-50/50 pt-4 space-y-3" aria-label="Mobile navigation">
            <Link
              href="/guides"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-[var(--text-secondary)] hover:text-gold transition-colors py-1"
            >
              Guides
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-[var(--text-secondary)] hover:text-gold transition-colors py-1"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-[var(--text-secondary)] hover:text-gold transition-colors py-1"
            >
              About
            </Link>
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-dark transition-all hover:bg-gold-300"
            >
              <Zap className="h-3.5 w-3.5" />
              Scan NPI
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
