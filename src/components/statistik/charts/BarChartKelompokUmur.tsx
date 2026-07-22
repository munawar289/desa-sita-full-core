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
import {
  CHART_AXIS_STROKE,
  CHART_CURSOR_FILL,
  CHART_GRID_STROKE,
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
  chartSeriesColor,
} from "./chart-theme";

export function BarChartKelompokUmur({ data }: { data: StatistikKelompokUmur[] }) {
  const sorted = [...data].sort((a, b) => a.urutan - b.urutan);

  return (
    <div className="h-55 sm:h-65 lg:h-75">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} horizontal={false} />
          <XAxis type="number" stroke={CHART_AXIS_STROKE} fontSize={12} />
          <YAxis
            type="category"
            dataKey="kelompok_usia"
            stroke={CHART_AXIS_STROKE}
            fontSize={12}
            width={80}
          />
          <Tooltip
            contentStyle={CHART_TOOLTIP_STYLE}
            itemStyle={CHART_TOOLTIP_ITEM_STYLE}
            labelStyle={CHART_TOOLTIP_LABEL_STYLE}
            cursor={CHART_CURSOR_FILL}
          />
          <Bar dataKey="jumlah" fill={chartSeriesColor(0)} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
