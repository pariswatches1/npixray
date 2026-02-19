"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Zap,
  BarChart3,
  Sparkles,
  Wrench,
  ArrowRight,
  Crown,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const plan = (user as any)?.plan || "free";
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, <span className="text-gold">{firstName}</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Your revenue intelligence dashboard
        </p>
      </div>

      {/* Plan badge */}
      {plan === "free" && (
        <div className="rounded-xl border border-gold/20 bg-gold/[0.03] p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-4 w-4 text-gold" />
              <span className="text-sm font-semibold text-gold">
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
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-dark hover:bg-gold-300 transition-all"
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
        <div className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-8 text-center">
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
      className="rounded-xl border border-dark-50/80 bg-dark-400/50 p-5 hover:border-gold/30 hover:bg-gold/[0.03] transition-all group"
    >
      <Icon className="h-5 w-5 text-gold mb-3" />
      <h3 className="text-sm font-semibold group-hover:text-gold transition-colors">
        {title}
      </h3>
      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{description}</p>
    </Link>
  );
}
