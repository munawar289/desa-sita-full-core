"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#C1602A", "#5B7A41"]; // terracotta (kopi-600), olive (sawah-400)

export function PieChartGender({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="h-55 sm:h-65 lg:h-75">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderColor: "#E2D8C3", borderRadius: 8 }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
