import type { ReactNode } from "react";

/**
 * Token warna bersama untuk seluruh chart Recharts.
 *
 * Recharts menerima warna lewat prop JS, bukan kelas Tailwind — tapi nilainya
 * berakhir sebagai presentation attribute SVG (`fill`, `stroke`) atau inline
 * style, dan keduanya diurai sebagai nilai CSS. Jadi `var(--color-…)` cukup:
 * warna ikut berganti mengikuti tema desa tanpa membaca CSS variable di runtime
 * dan tanpa mengoper hex dari server ke 13 halaman pemanggil.
 *
 * Seri SELALU diambil dari `--color-chart-1…5` — jangan menyusun sendiri dari
 * step scale (DESIGN.md §2.4).
 */

/** Lima seri chart, urut. Ambil dengan index, jangan tulis var-nya manual. */
export const CHART_SERIES = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
] as const;

/** Warna seri ke-`index`, berputar kalau serinya lebih dari lima. */
export function chartSeriesColor(index: number): string {
  return CHART_SERIES[index % CHART_SERIES.length];
}

/** Garis sumbu & label tick. `text-muted` dijamin 4.5:1 terhadap surface. */
export const CHART_AXIS_STROKE = "var(--color-text-muted)";

/** Garis bantu grid — garis dekoratif, cukup `border`. */
export const CHART_GRID_STROKE = "var(--color-border)";

/**
 * Sorotan di belakang bar saat kursor melintas. `surface-alt` sengaja dipilih
 * karena ia memang permukaan redam satu tingkat di bawah kartu, jadi sorotannya
 * terbaca tanpa pernah menyaingi warna bar.
 */
export const CHART_CURSOR_FILL = { fill: "var(--color-surface-alt)" };

/**
 * Kotak tooltip. Latar dan teksnya diikat ke token — bawaan Recharts adalah
 * putih dengan teks abu-abu, yang tidak pernah ikut warna desa.
 */
export const CHART_TOOLTIP_STYLE = {
  backgroundColor: "var(--color-surface)",
  borderColor: "var(--color-border)",
  borderRadius: 8,
  color: "var(--color-text)",
} as const;

/** Nilai per seri di dalam tooltip — lihat catatan di renderLegendLabel(). */
export const CHART_TOOLTIP_ITEM_STYLE = { color: "var(--color-text)" } as const;

export const CHART_TOOLTIP_LABEL_STYLE = { color: "var(--color-text-muted)" } as const;

/**
 * Recharts mewarnai teks legenda dengan warna serinya sendiri. Seri chart hanya
 * dijamin 3:1 terhadap surface (cukup untuk bidang, tidak untuk teks), dan
 * `chart-4`/`chart-5` yang berasal dari step 300 jelas gagal 4.5:1. Karena itu
 * label legenda dipaksa ke `--color-text`; pembeda serinya tetap dibawa oleh
 * kotak warna di sebelah kirinya.
 */
export function renderLegendLabel(value: string): ReactNode {
  return <span className="text-sm text-text">{value}</span>;
}
