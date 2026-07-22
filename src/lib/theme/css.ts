/**
 * Serialisasi hasil deriveTheme() menjadi CSS custom properties yang siap
 * dipasang sebagai inline style di elemen <html> root layout.
 *
 * Nilainya sengaja HEX sRGB, bukan `oklch()`. Perhitungan perseptualnya sudah
 * selesai di server, jadi tidak ada alasan membebankan dukungan ruang warna
 * modern ke browser pengunjung — HP kelas menengah-bawah dengan WebView lama
 * tetap dapat warna yang persis sama (CLAUDE.md §Standar Kualitas).
 */

import { oklchToHex } from "./oklch";
import { SCALE_STEPS, type ColorScale } from "./scale";
import { deriveTheme, type DerivedTheme, type ThemeSlots } from "./tokens";

export type ThemeCssVariables = Record<string, string>;

function writeScale(target: ThemeCssVariables, name: string, scale: ColorScale): void {
  for (const step of SCALE_STEPS) {
    target[`--color-${name}-${step}`] = oklchToHex(scale[step]);
  }
}

export function themeToCssVariables(theme: DerivedTheme): ThemeCssVariables {
  const vars: ThemeCssVariables = {};

  writeScale(vars, "primary", theme.scales.primary);
  writeScale(vars, "secondary", theme.scales.secondary);
  writeScale(vars, "accent", theme.scales.accent);
  writeScale(vars, "neutral", theme.scales.neutral);

  const s = theme.semantic;
  const semantic: ReadonlyArray<readonly [string, string]> = [
    ["--color-primary", oklchToHex(s.primary)],
    ["--color-primary-hover", oklchToHex(s.primaryHover)],
    ["--color-primary-active", oklchToHex(s.primaryActive)],
    ["--color-primary-soft", oklchToHex(s.primarySoft)],
    ["--color-on-primary", oklchToHex(s.onPrimary)],
    ["--color-on-primary-soft", oklchToHex(s.onPrimarySoft)],

    ["--color-secondary", oklchToHex(s.secondary)],
    ["--color-secondary-hover", oklchToHex(s.secondaryHover)],
    ["--color-secondary-active", oklchToHex(s.secondaryActive)],
    ["--color-secondary-soft", oklchToHex(s.secondarySoft)],
    ["--color-on-secondary", oklchToHex(s.onSecondary)],
    ["--color-on-secondary-soft", oklchToHex(s.onSecondarySoft)],

    ["--color-accent", oklchToHex(s.accent)],
    ["--color-accent-hover", oklchToHex(s.accentHover)],
    ["--color-accent-active", oklchToHex(s.accentActive)],
    ["--color-accent-soft", oklchToHex(s.accentSoft)],
    ["--color-on-accent", oklchToHex(s.onAccent)],
    ["--color-on-accent-soft", oklchToHex(s.onAccentSoft)],

    ["--color-surface", oklchToHex(s.surface)],
    ["--color-surface-alt", oklchToHex(s.surfaceAlt)],
    ["--color-border", oklchToHex(s.border)],
    ["--color-border-strong", oklchToHex(s.borderStrong)],
    ["--color-text", oklchToHex(s.text)],
    ["--color-text-muted", oklchToHex(s.textMuted)],

    ["--color-panel", oklchToHex(s.panel)],
    ["--color-panel-strong", oklchToHex(s.panelStrong)],
    ["--color-panel-border", oklchToHex(s.panelBorder)],
    ["--color-on-panel", oklchToHex(s.onPanel)],
    ["--color-on-panel-muted", oklchToHex(s.onPanelMuted)],

    ["--color-link", oklchToHex(s.link)],
    ["--color-link-hover", oklchToHex(s.linkHover)],
    ["--color-focus-ring", oklchToHex(s.focusRing)],
  ];

  for (const [name, value] of semantic) {
    vars[name] = value;
  }

  return vars;
}

/**
 * Cache derivasi per kombinasi 3 warna. Perhitungannya sendiri murah (~0.1ms),
 * tapi ia jalan di SETIAP request untuk setiap tenant; memoisasi bikin biaya
 * itu nol setelah render pertama. Batas ukurannya menjaga memori tetap rata
 * walaupun jumlah tenant tumbuh.
 */
const MEMO_LIMIT = 64;
const memo = new Map<string, ThemeCssVariables>();

export function buildThemeCssVariables(slots: ThemeSlots): ThemeCssVariables {
  const key = `${slots.warna_primer}|${slots.warna_sekunder}|${slots.warna_aksen}`;
  const cached = memo.get(key);
  if (cached) return cached;

  const vars = themeToCssVariables(deriveTheme(slots));
  if (memo.size >= MEMO_LIMIT) {
    const oldest = memo.keys().next().value;
    if (oldest !== undefined) memo.delete(oldest);
  }
  memo.set(key, vars);
  return vars;
}
