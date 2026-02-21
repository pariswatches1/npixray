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
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="NPIxray home">
            <svg width="380" height="80" viewBox="0 0 380 80" xmlns="http://www.w3.org/2000/svg">
              <text x="30" y="38" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="36" fill="#1e293b" letterSpacing="-1">NPI</text>
              <text x="120" y="38" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="36" fill="#3b82f6" letterSpacing="-1">xray</text>
              {/* EKG heartbeat trace line */}
              <polyline fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" opacity="0.35"
                points="0,62 35,62 55,62 75,62 90,60 98,64 106,62 125,62 136,48 144,76 152,36 160,72 168,52 176,62 200,62 230,62 260,62 280,62"/>
              {/* Traveling glow dot along EKG */}
              <circle r="3.5" fill="#3b82f6" opacity="0.6">
                <animateMotion dur="2s" repeatCount="indefinite"
                  path="M0,62 L35,62 L55,62 L75,62 L90,60 L98,64 L106,62 L125,62 L136,48 L144,76 L152,36 L160,72 L168,52 L176,62 L200,62 L230,62 L260,62 L280,62"/>
              </circle>
              {/* BPM number pulsing */}
              <text x="300" y="32" fontFamily="monospace" fontWeight="700" fontSize="28" fill="#ef4444" opacity="0.6">
                72
                <animate attributeName="opacity" values="0.4;0.7;0.4" dur="1s" repeatCount="indefinite"/>
              </text>
              <text x="338" y="32" fontFamily="monospace" fontWeight="600" fontSize="10" fill="#94a3b8">BPM</text>
              {/* Beating heart icon */}
              <path d="M312,44 C312,40 316,38 318,40 C320,38 324,40 324,44 C324,48 318,52 318,54 C318,52 312,48 312,44Z" fill="#ef4444" opacity="0.5">
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1s" repeatCount="indefinite"/>
                <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="1s" repeatCount="indefinite" additive="sum"/>
              </path>
              {/* Practice Health label */}
              <text x="296" y="68" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="8" fill="#10b981" letterSpacing="2">
                PRACTICE HEALTH
                <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
              </text>
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
