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
import type { StatistikKelompokUmur } from "@/lib/data/statistik-kelompok-umur";

export function BarChartKelompokUmur({ data }: { data: StatistikKelompokUmur[] }) {
  const sorted = [...data].sort((a, b) => a.urutan - b.urutan);

  return (
    <div className="h-55 sm:h-65 lg:h-75">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2D8C3" horizontal={false} />
          <XAxis type="number" stroke="#5C4F3F" fontSize={12} />
          <YAxis
            type="category"
            dataKey="kelompok_usia"
            stroke="#5C4F3F"
            fontSize={12}
            width={80}
          />
          <Tooltip
            contentStyle={{ borderColor: "#E2D8C3", borderRadius: 8 }}
            cursor={{ fill: "#F0EADA" }}
          />
          <Bar dataKey="jumlah" fill="#C1602A" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
