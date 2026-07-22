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

export type BarChartStatistikDatum = { label: string; value: number };

/** Bar chart vertikal generik untuk daftar kategori kecil dari tabel `statistik`. */
export function BarChartStatistik({ data }: { data: BarChartStatistikDatum[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="h-55 sm:h-65 lg:h-75">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_STROKE} vertical={false} />
          <XAxis dataKey="label" stroke={CHART_AXIS_STROKE} fontSize={12} />
          <YAxis stroke={CHART_AXIS_STROKE} fontSize={12} />
          <Tooltip
            contentStyle={CHART_TOOLTIP_STYLE}
            itemStyle={CHART_TOOLTIP_ITEM_STYLE}
            labelStyle={CHART_TOOLTIP_LABEL_STYLE}
            cursor={CHART_CURSOR_FILL}
          />
          <Bar dataKey="value" fill={chartSeriesColor(0)} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
