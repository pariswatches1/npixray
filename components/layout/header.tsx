"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Menu, X, Zap, Sparkles, LogIn } from "lucide-react";
import { UserMenu } from "@/components/auth/user-menu";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-light)] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="NPIxray home">
            <svg width="200" height="36" viewBox="0 0 200 36" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="thermalLogo" x1="0%" y1="140%" x2="0%" y2="-40%">
                  <stop offset="0%" stopColor="#1e3a5f"/>
                  <stop offset="10%" stopColor="#3b82f6"/>
                  <stop offset="25%" stopColor="#06b6d4"/>
                  <stop offset="40%" stopColor="#10b981"/>
                  <stop offset="55%" stopColor="#eab308"/>
                  <stop offset="70%" stopColor="#f59e0b"/>
                  <stop offset="85%" stopColor="#ef4444"/>
                  <stop offset="100%" stopColor="#1e3a5f"/>
                  <animate attributeName="y1" values="140%;-60%;140%" dur="1.2s" repeatCount="indefinite"/>
                  <animate attributeName="y2" values="-40%;-240%;-40%" dur="1.2s" repeatCount="indefinite"/>
                </linearGradient>
                <clipPath id="logoClip">
                  <text x="8" y="27" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="28" letterSpacing="-0.5">NPIxray</text>
                </clipPath>
              </defs>
              <rect x="0" y="0" width="200" height="36" fill="url(#thermalLogo)" clipPath="url(#logoClip)"/>
              <text x="8" y="27" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="28" fill="none" stroke="#1e3a5f" strokeWidth="0.15" letterSpacing="-0.5" opacity="0.06">NPIxray</text>
            </svg>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link
              href="/guides"
              className="text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
            >
              Guides
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
            >
              About
            </Link>
            <Link
              href="/coach"
              className="inline-flex items-center gap-1.5 text-sm text-[#2F5EA8] font-medium hover:text-[#264D8C] transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Coach
            </Link>

            {/* Auth section */}
            {!isLoading && (
              <>
                {session?.user ? (
                  <UserMenu />
                ) : (
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:border-[#2F5EA8]/20 hover:text-[#2F5EA8]"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Sign In
                  </Link>
                )}
              </>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#264D8C] hover:shadow-md hover:shadow-[#2F5EA8]/10"
            >
              <Zap className="h-3.5 w-3.5" />
              Scan NPI
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="md:hidden pb-4 border-t border-[var(--border-light)] pt-4 space-y-3" aria-label="Mobile navigation">
            <Link
              href="/guides"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors py-1"
            >
              Guides
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors py-1"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors py-1"
            >
              About
            </Link>
            <Link
              href="/coach"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1.5 text-sm text-[#2F5EA8] font-medium py-1"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Coach
            </Link>

            {/* Auth section (mobile) */}
            {!isLoading && !session?.user && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] transition-colors py-1"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Link>
            )}
            {!isLoading && session?.user && (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm text-[#2F5EA8] font-medium py-1"
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#264D8C]"
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
