"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#7C4A22", "#3D6B2C"]; // kopi-600, sawah-700

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
          <Tooltip contentStyle={{ borderColor: "#E8CEAA", borderRadius: 8 }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
