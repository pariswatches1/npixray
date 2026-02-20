import { formatAcquisitionCurrency } from "@/lib/acquisition-utils";
import { Building2, DollarSign, Users, TrendingUp, Target, AlertTriangle } from "lucide-react";

interface MarketStatsGridProps {
  totalProviders: number;
  totalRevenue: number;
  avgRevenue: number;
  estimatedMissedRevenue: number;
  underperformingCount: number;
  primeTargetCount: number;
}

export function MarketStatsGrid({
  totalProviders,
  totalRevenue,
  avgRevenue,
  estimatedMissedRevenue,
  underperformingCount,
  primeTargetCount,
}: MarketStatsGridProps) {
  const stats = [
    {
      label: "Total Practices",
      value: totalProviders.toLocaleString(),
      icon: Building2,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Total Medicare Revenue",
      value: formatAcquisitionCurrency(totalRevenue),
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Avg Revenue / Practice",
      value: formatAcquisitionCurrency(avgRevenue),
      icon: Users,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
    },
    {
      label: "Estimated Missed Revenue",
      value: formatAcquisitionCurrency(estimatedMissedRevenue),
      icon: TrendingUp,
      color: "text-[#2F5EA8]",
      bgColor: "bg-[#2F5EA8]/[0.06]",
      borderColor: "border-[#2F5EA8]/10",
    },
    {
      label: "Prime Targets",
      value: primeTargetCount.toLocaleString(),
      icon: Target,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Underperforming Practices",
      value: underperformingCount.toLocaleString(),
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl border ${stat.borderColor} ${stat.bgColor} p-4`}
        >
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            <span className="text-xs text-[var(--text-secondary)] font-medium">
              {stat.label}
            </span>
          </div>
          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
