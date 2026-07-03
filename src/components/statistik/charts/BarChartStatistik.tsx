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

export type BarChartStatistikDatum = { label: string; value: number };

/** Bar chart vertikal generik untuk daftar kategori kecil dari tabel `statistik`. */
export function BarChartStatistik({ data }: { data: BarChartStatistikDatum[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="h-55 sm:h-65 lg:h-75">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted}>
          <defs>
            <linearGradient id="gradientKopi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D07B3F" />
              <stop offset="100%" stopColor="#C1602A" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2D8C3" vertical={false} />
          <XAxis dataKey="label" stroke="#5C4F3F" fontSize={12} />
          <YAxis stroke="#5C4F3F" fontSize={12} />
          <Tooltip
            contentStyle={{ borderColor: "#E2D8C3", borderRadius: 8 }}
            cursor={{ fill: "#F0EADA" }}
          />
          <Bar dataKey="value" fill="url(#gradientKopi)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
