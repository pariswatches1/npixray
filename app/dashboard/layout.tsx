import type { Metadata } from "next";
import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  User,
  Zap,
  Briefcase,
  Key,
  ShieldCheck,
  FileText,
  Brain,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/account", label: "Account", icon: User },
];

const FEATURE_NAV = [
  { href: "/dashboard/eligibility", label: "Eligibility", icon: ShieldCheck, badge: "PRO" },
  { href: "/dashboard/claims", label: "Claims", icon: FileText, badge: "ENT" },
  { href: "/dashboard/coding", label: "AI Coding", icon: Brain, badge: "ENT" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 flex-shrink-0">
          <nav className="flex md:flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] hover:bg-[#2F5EA8]/[0.04] transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}

            {/* Feature sections divider */}
            <div className="hidden md:block border-t border-[var(--border-light)] my-3" />
            <p className="hidden md:block px-3 text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Features
            </p>
            {FEATURE_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[#2F5EA8] hover:bg-[#2F5EA8]/[0.04] transition-colors"
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#2F5EA8]/[0.06] text-[#2F5EA8]">
                  {item.badge}
                </span>
              </Link>
            ))}

            <div className="hidden md:block border-t border-[var(--border-light)] my-3" />
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-[#2F5EA8] font-medium hover:bg-[#2F5EA8]/[0.04] transition-colors"
            >
              <Zap className="h-4 w-4" />
              New Scan
            </Link>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
