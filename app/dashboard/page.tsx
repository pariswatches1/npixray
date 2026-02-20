"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import {
  Zap,
  BarChart3,
  Sparkles,
  Wrench,
  ArrowRight,
  Crown,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";

function DashboardContent() {
  const { data: session, update } = useSession();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get("upgraded") === "true";
  const user = session?.user;
  const plan = (user as any)?.plan || "free";
  const subscriptionStatus = (user as any)?.subscriptionStatus || "none";
  const firstName = user?.name?.split(" ")[0] || "there";

  // Refresh session to pick up new plan after upgrade
  if (upgraded && plan === "free") {
    update();
  }

  return (
    <div className="space-y-8">
      {/* Upgrade success banner */}
      {upgraded && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-900">
              Welcome to NPIxray Intelligence!
            </p>
            <p className="text-sm text-emerald-700 mt-0.5">
              Your 14-day free trial has started. You now have access to AI coding recommendations, revenue forecasts, and more.
            </p>
          </div>
          <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-600 transition-colors">
            <X className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Past due payment warning */}
      {subscriptionStatus === "past_due" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">
              Payment failed
            </p>
            <p className="text-sm text-amber-700 mt-0.5">
              Your last payment didn&apos;t go through. Please update your payment method to keep your subscription active.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors whitespace-nowrap"
          >
            Update Payment
          </Link>
        </div>
      )}

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, <span className="text-[#2F5EA8]">{firstName}</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Your revenue intelligence dashboard
        </p>
      </div>

      {/* Plan badge */}
      {plan === "free" && (
        <div className="rounded-xl border border-[#2F5EA8]/10 bg-[#2F5EA8]/[0.03] p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-[#2F5EA8]" />
              <span className="text-sm font-semibold text-[#2F5EA8]">
                Upgrade to Intelligence
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-md">
              Unlock patient-level insights, AI coding recommendations, and
              monthly benchmark tracking for $99/month.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg bg-[#2F5EA8] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#264D8C] transition-all"
          >
            View Plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          href="/"
          icon={Zap}
          title="Scan NPI"
          description="Analyze any provider"
        />
        <QuickAction
          href="/tools"
          icon={Wrench}
          title="Tools"
          description="13 free calculators"
        />
        <QuickAction
          href="/coach"
          icon={Sparkles}
          title="AI Coach"
          description="Ask revenue questions"
        />
        <QuickAction
          href="/rankings"
          icon={BarChart3}
          title="Rankings"
          description="Top providers & markets"
        />
      </div>

      {/* Coming soon section for paid features */}
      {plan !== "free" && (
        <div className="rounded-xl border border-[var(--border-light)] bg-white p-8 text-center">
          <h2 className="text-lg font-bold mb-2">Intelligence Dashboard</h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
            CSV upload, patient eligibility lists, AI coding recommendations,
            and monthly benchmarks are coming soon. We&apos;ll notify you when
            they launch.
          </p>
        </div>
      )}
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[var(--border-light)] bg-white p-5 hover:border-[#2F5EA8]/15 hover:bg-[#264D8C]/[0.03] transition-all group"
    >
      <Icon className="h-5 w-5 text-[#2F5EA8] mb-3" />
      <h3 className="text-sm font-semibold group-hover:text-[#2F5EA8] transition-colors">
        {title}
      </h3>
      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</p>
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
