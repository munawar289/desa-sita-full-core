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
import {
  CHART_AXIS_STROKE,
  CHART_CURSOR_FILL,
  CHART_GRID_STROKE,
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
  chartSeriesColor,
} from "./chart-theme";

export function BarChartPendidikan({ data }: { data: StatistikPendidikan[] }) {
  const sorted = [...data].sort((a, b) => a.urutan - b.urutan);

  return (
    <div className="h-55 sm:h-65 lg:h-75">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
          <XAxis dataKey="tingkat" stroke={CHART_AXIS_STROKE} fontSize={12} />
          <YAxis stroke={CHART_AXIS_STROKE} fontSize={12} />
          <Tooltip
            contentStyle={CHART_TOOLTIP_STYLE}
            itemStyle={CHART_TOOLTIP_ITEM_STYLE}
            labelStyle={CHART_TOOLTIP_LABEL_STYLE}
            cursor={CHART_CURSOR_FILL}
          />
          <Bar dataKey="jumlah" fill={chartSeriesColor(0)} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
