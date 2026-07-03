"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type BarChartRtGroupedDatum = { label: string } & Record<string, string | number>;

/** Grouped bar chart horizontal — kategori per-RT dengan 2+ metrik (PRD §4.3). */
export function BarChartRtGrouped({
  data,
  series,
}: {
  data: BarChartRtGroupedDatum[];
  series: { key: string; label: string; color: string }[];
}) {
  return (
    <div className="h-90 sm:h-100 lg:h-110">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2D8C3" horizontal={false} />
          <XAxis type="number" stroke="#5C4F3F" fontSize={12} />
          <YAxis type="category" dataKey="label" stroke="#5C4F3F" fontSize={12} width={70} />
          <Tooltip
            contentStyle={{ borderColor: "#E2D8C3", borderRadius: 8 }}
            cursor={{ fill: "#F0EADA" }}
          />
          <Legend />
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[0, 6, 6, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
