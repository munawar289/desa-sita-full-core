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
import type { StatistikPendidikan } from "@/lib/data/statistik-pendidikan";

export function BarChartPendidikan({ data }: { data: StatistikPendidikan[] }) {
  const sorted = [...data].sort((a, b) => a.urutan - b.urutan);

  return (
    <div className="h-55 sm:h-65 lg:h-75">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted}>
          <defs>
            <linearGradient id="gradientKopi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B07040" />
              <stop offset="100%" stopColor="#7C4A22" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8CEAA" vertical={false} />
          <XAxis dataKey="tingkat" stroke="#3D2010" fontSize={12} />
          <YAxis stroke="#3D2010" fontSize={12} />
          <Tooltip
            contentStyle={{ borderColor: "#E8CEAA", borderRadius: 8 }}
            cursor={{ fill: "#F3E8DC" }}
          />
          <Bar dataKey="jumlah" fill="url(#gradientKopi)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
