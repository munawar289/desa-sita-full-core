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
import {
  CHART_AXIS_STROKE,
  CHART_CURSOR_FILL,
  CHART_GRID_STROKE,
  CHART_TOOLTIP_ITEM_STYLE,
  CHART_TOOLTIP_LABEL_STYLE,
  CHART_TOOLTIP_STYLE,
  chartSeriesColor,
} from "./chart-theme";

export type BarChartRtDatum = { label: string; value: number };

/** Bar chart horizontal, sorted descending — pola per-RT (PRD statistik-lanjutan §4.3). */
export function BarChartRt({ data }: { data: BarChartRtDatum[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="h-90 sm:h-100 lg:h-110">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ left: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} horizontal={false} />
          <XAxis type="number" stroke={CHART_AXIS_STROKE} fontSize={12} />
          <YAxis
            type="category"
            dataKey="label"
            stroke={CHART_AXIS_STROKE}
            fontSize={12}
            width={70}
          />
          <Tooltip
            contentStyle={CHART_TOOLTIP_STYLE}
            itemStyle={CHART_TOOLTIP_ITEM_STYLE}
            labelStyle={CHART_TOOLTIP_LABEL_STYLE}
            cursor={CHART_CURSOR_FILL}
          />
          <Bar dataKey="value" fill={chartSeriesColor(0)} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
