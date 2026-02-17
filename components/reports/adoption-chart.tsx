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

interface AdoptionChartProps {
  data: {
    program: string;
    actual: number;
    national: number;
  }[];
  entityLabel?: string;
}

export function AdoptionChart({ data, entityLabel = "Actual" }: AdoptionChartProps) {
  const chartData = data.map((d) => ({
    program: d.program,
    [entityLabel]: parseFloat((d.actual * 100).toFixed(1)),
    "National Avg": parseFloat((d.national * 100).toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2820" />
        <XAxis
          dataKey="program"
          tick={{ fill: "#a09c8c", fontSize: 12 }}
          axisLine={{ stroke: "#2a2820" }}
        />
        <YAxis
          tick={{ fill: "#a09c8c", fontSize: 12 }}
          axisLine={{ stroke: "#2a2820" }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#15140e",
            border: "1px solid #2a2820",
            borderRadius: "8px",
            color: "#f5f5f0",
          }}
          formatter={(value: number) => [`${value}%`, undefined]}
        />
        <Legend
          wrapperStyle={{ color: "#a09c8c", fontSize: 12 }}
        />
        <Bar dataKey={entityLabel} fill="#E8A824" radius={[4, 4, 0, 0]} />
        <Bar dataKey="National Avg" fill="#4a4535" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
