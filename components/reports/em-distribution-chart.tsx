"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EMDistributionChartProps {
  data: {
    code: string;
    actual: number;
    benchmark: number;
  }[];
  entityLabel?: string;
}

export function EMDistributionChart({ data, entityLabel = "Actual" }: EMDistributionChartProps) {
  const chartData = data.map((d) => ({
    code: d.code,
    [entityLabel]: parseFloat((d.actual * 100).toFixed(1)),
    Benchmark: parseFloat((d.benchmark * 100).toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="#E9EEF6" />
        <XAxis
          dataKey="code"
          tick={{ fill: "#6B7A99", fontSize: 12 }}
          axisLine={{ stroke: "#E9EEF6" }}
        />
        <YAxis
          tick={{ fill: "#6B7A99", fontSize: 12 }}
          axisLine={{ stroke: "#E9EEF6" }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E9EEF6",
            borderRadius: "8px",
            color: "#1A2B4A",
          }}
          formatter={(value: number) => [`${value}%`, undefined]}
        />
        <Legend
          wrapperStyle={{ color: "#6B7A99", fontSize: 12 }}
        />
        <Bar dataKey={entityLabel} fill="#2F5EA8" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Benchmark" fill="#4a4535" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
