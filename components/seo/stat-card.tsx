import { type LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon, sub }: {
  label: string;
  value: string;
  icon?: LucideIcon;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-dark-50/50 bg-dark-300 p-5">
      <div className="flex items-center gap-3 mb-2">
        {Icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
            <Icon className="h-4 w-4 text-gold" />
          </div>
        )}
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-[var(--text-secondary)] mt-1">{sub}</p>}
    </div>
  );
}
