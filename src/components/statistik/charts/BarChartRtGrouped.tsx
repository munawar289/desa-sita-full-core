"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
  renderLegendLabel,
} from "./chart-theme";

export type BarChartRtGroupedDatum = { label: string } & Record<string, string | number>;

/**
 * Grouped bar chart horizontal — kategori per-RT dengan 2+ metrik (PRD §4.3).
 *
 * Warna seri TIDAK dioper pemanggil: ia diambil berurutan dari
 * `--color-chart-1…5` supaya grafik tidak pernah memunculkan warna di luar
 * tema desa (DESIGN.md §2.6).
 */
export function BarChartRtGrouped({
  data,
  series,
}: {
  data: BarChartRtGroupedDatum[];
  series: { key: string; label: string }[];
}) {
  return (
    <div className="h-90 sm:h-100 lg:h-110">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
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
          <Legend formatter={renderLegendLabel} />
          {series.map((s, index) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={chartSeriesColor(index)}
              radius={[0, 6, 6, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
