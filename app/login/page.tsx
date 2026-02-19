import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Shield } from "lucide-react";
import { SignInButton } from "@/components/auth/sign-in-button";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to NPIxray to access your personalized revenue intelligence dashboard.",
  alternates: { canonical: "https://npixray.com/login" },
};

export default function LoginPage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/[0.03] rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-md px-4 sm:px-6 pt-20 pb-32 sm:pt-28 sm:pb-40">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
              <Zap className="h-5 w-5 text-gold" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              NPI<span className="text-gold">xray</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-dark-50/80 bg-dark-400/50 p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            Sign in to <span className="text-gold">NPIxray</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)] text-center mb-8 leading-relaxed">
            Access your revenue intelligence dashboard, saved scans, and AI coaching.
          </p>

          {/* Google Sign In */}
          <SignInButton />

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-50/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-dark-400/50 px-3 text-[var(--text-secondary)]">
                What you get
              </span>
            </div>
          </div>

          {/* Benefits */}
          <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
            {[
              "Save and track your NPI scans",
              "Personalized revenue recommendations",
              "AI Revenue Coach with your data",
              "Monthly benchmark updates",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <p className="text-xs text-[var(--text-secondary)] text-center mt-6 leading-relaxed">
          By signing in, you agree to our{" "}
          <Link href="/about" className="text-gold hover:underline">
            Terms of Service
          </Link>
          . We only use public CMS data — no patient information is accessed.
        </p>
      </div>
    </section>
  );
}
