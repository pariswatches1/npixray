import { type LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon, sub }: {
  label: string;
  value: string;
  icon?: LucideIcon;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-light)] bg-white p-5">
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2F5EA8]/[0.06] border border-[#2F5EA8]/10">
            <Icon className="h-4 w-4 text-[#2F5EA8]" />
          </div>
        )}
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-[var(--text-secondary)] mt-1">{sub}</p>}
    </div>
  );
}
