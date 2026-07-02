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
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8CEAA" horizontal={false} />
        <XAxis type="number" stroke="#3D2010" fontSize={12} />
        <YAxis
          type="category"
          dataKey="kelompok_usia"
          stroke="#3D2010"
          fontSize={12}
          width={80}
        />
        <Tooltip
          contentStyle={{ borderColor: "#E8CEAA", borderRadius: 8 }}
          cursor={{ fill: "#F3E8DC" }}
        />
        <Bar dataKey="jumlah" fill="#7C4A22" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
