"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { SCORE_TIERS } from "@/lib/revenue-score";

interface ScoreHistogramProps {
  data: { bucket: number; count: number }[];
  avgScore?: number;
}

function getBucketColor(bucket: number): string {
  const tier = SCORE_TIERS.find((t) => bucket >= t.min);
  return tier?.hexColor ?? "#f87171";
}

function getBucketLabel(bucket: number): string {
  return `${bucket}-${Math.min(bucket + 9, 100)}`;
}

export function ScoreHistogram({ data, avgScore }: ScoreHistogramProps) {
  const chartData = data.map((d) => ({
    name: getBucketLabel(d.bucket),
    count: d.count,
    bucket: d.bucket,
  }));

  const totalProviders = data.reduce((a, d) => a + d.count, 0);

  return (
    <div>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={{ stroke: "#374151" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a2e",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [
                `${value.toLocaleString()} providers (${((value / totalProviders) * 100).toFixed(1)}%)`,
                "Count",
              ]}
              labelFormatter={(label) => `Score: ${label}`}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={getBucketColor(entry.bucket)} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {avgScore !== undefined && (
        <p className="text-center text-sm text-[var(--text-secondary)] mt-2">
          Average Score: <span className="font-bold text-[#2F5EA8]">{Math.round(avgScore)}</span>
        </p>
      )}
    </div>
  );
}
