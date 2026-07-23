/**
 * Pembentuk scale 50–900 dari satu warna dasar, di ruang OKLCH.
 *
 * Prinsip: lightness tiap step DITENTUKAN (bukan hasil mixing), hue diwarisi
 * apa adanya dari warna tenant, chroma diskalakan mengikuti amplop yang
 * memuncak di tengah. Amplop ini yang bikin step 50/100 tidak pernah jadi
 * pastel menyala dan step 800/900 tidak pernah jadi lumpur — dua kegagalan
 * paling khas kalau scale dibuat dengan mix ke putih/hitam.
 */

import { clampToGamut, type Oklch } from "./oklch";

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

export type ScaleStep = (typeof SCALE_STEPS)[number];

export type ColorScale = Record<ScaleStep, Oklch>;

type RampEntry = { step: ScaleStep; l: number; chromaFactor: number };

/**
 * Amplop lightness + chroma. `chromaFactor` adalah pengali terhadap chroma
 * warna dasar (setelah di-clamp), bukan nilai absolut — jadi desa yang memilih
 * warna kalem tetap dapat scale yang kalem, tidak dipaksa jenuh.
 */
const BRAND_RAMP: readonly RampEntry[] = [
  { step: 50, l: 0.974, chromaFactor: 0.14 },
  { step: 100, l: 0.942, chromaFactor: 0.28 },
  { step: 200, l: 0.894, chromaFactor: 0.48 },
  { step: 300, l: 0.832, chromaFactor: 0.68 },
  { step: 400, l: 0.754, chromaFactor: 0.88 },
  { step: 500, l: 0.674, chromaFactor: 1.0 },
  { step: 600, l: 0.592, chromaFactor: 1.0 },
  { step: 700, l: 0.506, chromaFactor: 0.92 },
  { step: 800, l: 0.412, chromaFactor: 0.8 },
  { step: 900, l: 0.302, chromaFactor: 0.66 },
];

/**
 * Amplop netral — lightness untuk surface/border/teks, dengan chroma tipis.
 *
 * `chromaFactor` di sini MEMUNCAK DI UJUNG TERANG, kebalikan dari BRAND_RAMP.
 * Alasannya perseptual: pada lightness tinggi, chroma yang sama jauh lebih
 * tidak terlihat. Tanpa bobot ini surface dan border kehilangan kehangatan
 * "kertas" dan situs jatuh jadi abu-abu template generik — persis yang bikin
 * latar palet lama (#f5efe2, chroma 0.0184) terasa lebih bernyawa daripada
 * netral versi pertama engine ini (chroma 0.0051).
 */
const NEUTRAL_RAMP: readonly RampEntry[] = [
  { step: 50, l: 0.982, chromaFactor: 0.85 },
  { step: 100, l: 0.958, chromaFactor: 1.0 },
  { step: 200, l: 0.912, chromaFactor: 1.1 },
  { step: 300, l: 0.86, chromaFactor: 1.0 },
  { step: 400, l: 0.722, chromaFactor: 0.8 },
  { step: 500, l: 0.604, chromaFactor: 0.66 },
  { step: 600, l: 0.502, chromaFactor: 0.58 },
  { step: 700, l: 0.408, chromaFactor: 0.52 },
  { step: 800, l: 0.314, chromaFactor: 0.46 },
  { step: 900, l: 0.232, chromaFactor: 0.4 },
];

/**
 * Batas chroma warna brand. Nilai ini duduk sedikit di atas chroma warna
 * default desa (terracotta ≈ 0.11, olive ≈ 0.07, gold ≈ 0.10) sehingga tema
 * bawaan lewat tanpa disentuh, tapi memangkas warna neon (hijau #00ff00 ≈ 0.29,
 * merah #ff0000 ≈ 0.26) ke tingkat yang masih bisa dipandang lama di layar HP.
 */
export const MAX_BRAND_CHROMA = 0.17;

/**
 * Batas chroma netral: tint hue tenant yang boleh menempel di surface/border/
 * teks. 0.020 setara kehangatan latar palet lama (chroma 0.0184) — terasa
 * sebagai kertas hangat, belum terbaca sebagai warna.
 */
export const MAX_NEUTRAL_CHROMA = 0.02;

/**
 * Netral ikut kalem kalau warna tenant kalem. Tanpa pengali ini, input abu-abu
 * murni (chroma 0) tetap akan diberi tint dari hue 0 (merah) — salah.
 */
const NEUTRAL_TINT_FROM_BRAND = 0.16;

function buildFromRamp(hue: number, chroma: number, ramp: readonly RampEntry[]): ColorScale {
  const scale = {} as ColorScale;
  for (const { step, l, chromaFactor } of ramp) {
    scale[step] = clampToGamut({ l, c: chroma * chromaFactor, h: hue });
  }
  return scale;
}

/** Chroma warna dasar setelah di-clamp — dipakai juga sebagai basis netral. */
export function clampBrandChroma(chroma: number): number {
  return Math.min(chroma, MAX_BRAND_CHROMA);
}

export function buildBrandScale(base: Oklch): ColorScale {
  return buildFromRamp(base.h, clampBrandChroma(base.c), BRAND_RAMP);
}

export function buildNeutralScale(base: Oklch): ColorScale {
  const tint = Math.min(MAX_NEUTRAL_CHROMA, clampBrandChroma(base.c) * NEUTRAL_TINT_FROM_BRAND);
  return buildFromRamp(base.h, tint, NEUTRAL_RAMP);
}

/** Step scale dengan lightness terdekat ke `l`, dipakai memilih shade efektif. */
export function nearestStep(scale: ColorScale, l: number): ScaleStep {
  let best: ScaleStep = SCALE_STEPS[0];
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const step of SCALE_STEPS) {
    const distance = Math.abs(scale[step].l - l);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = step;
    }
  }
  return best;
}
