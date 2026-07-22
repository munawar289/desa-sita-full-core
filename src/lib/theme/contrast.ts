/**
 * Rasio kontras WCAG 2.1 — dipakai engine tema untuk MEMILIH warna, bukan
 * sekadar memvalidasinya. Semua keputusan "teks putih atau teks gelap" dan
 * "shade mana yang cukup pekat untuk jadi tombol" lewat sini.
 */

import { oklchToRgb, type Oklch, type Rgb } from "./oklch";

/** Ambang WCAG AA untuk teks normal (CLAUDE.md §Aksesibilitas dasar). */
export const CONTRAST_TEXT_AA = 4.5;

/** Ambang WCAG AA untuk teks besar (≥ 24px, atau ≥ 18.66px bold). */
export const CONTRAST_TEXT_LARGE_AA = 3;

/**
 * Ambang WCAG 1.4.11 (Non-text Contrast) — batas komponen UI terhadap
 * background di sekitarnya. Dipakai supaya tombol/badge berwarna terang tetap
 * kelihatan tepinya di atas surface putih.
 */
export const CONTRAST_UI_AA = 3;

function relativeLuminanceFromRgb({ r, g, b }: Rgb): number {
  const [lr, lg, lb] = [r, g, b].map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4),
  );
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function relativeLuminance(color: Oklch): number {
  return relativeLuminanceFromRgb(oklchToRgb(color));
}

/** Rasio kontras 1..21. Urutan argumen tidak berpengaruh. */
export function contrastRatio(a: Oklch, b: Oklch): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pilih warna teks di atas `background`: kandidat terang dulu (sesuai brief
 * Langkah 2 — putih kalau kontrasnya >= 4.5), jika gagal pakai near-black.
 * Kalau dua-duanya gagal (background di lightness tengah dengan chroma
 * tinggi), ambil yang kontrasnya paling besar supaya tetap sebaik mungkin.
 */
export function pickReadableForeground(
  background: Oklch,
  light: Oklch,
  dark: Oklch,
  threshold: number = CONTRAST_TEXT_AA,
): Oklch {
  const lightRatio = contrastRatio(background, light);
  if (lightRatio >= threshold) return light;

  const darkRatio = contrastRatio(background, dark);
  if (darkRatio >= threshold) return dark;

  return lightRatio >= darkRatio ? light : dark;
}
