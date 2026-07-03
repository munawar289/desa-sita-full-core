"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type BarChartRtDatum = { label: string; value: number };

/** Bar chart horizontal, sorted descending — pola per-RT (PRD statistik-lanjutan §4.3). */
export function BarChartRt({ data }: { data: BarChartRtDatum[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="h-90 sm:h-100 lg:h-110">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2D8C3" horizontal={false} />
          <XAxis type="number" stroke="#5C4F3F" fontSize={12} />
          <YAxis type="category" dataKey="label" stroke="#5C4F3F" fontSize={12} width={70} />
          <Tooltip
            contentStyle={{ borderColor: "#E2D8C3", borderRadius: 8 }}
            cursor={{ fill: "#F0EADA" }}
          />
          <Bar dataKey="value" fill="#C1602A" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
