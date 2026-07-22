/**
 * Konversi ruang warna sRGB ↔ OKLab ↔ OKLCH (Björn Ottosson, 2020).
 *
 * OKLCH dipakai sebagai ruang kerja karena perceptually uniform: menaikkan
 * lightness sebesar 0.05 terasa sama besar untuk hue apapun. Ini yang bikin
 * satu rumus scale bisa dipakai untuk warna tenant APAPUN tanpa hasil yang
 * kusam di hue tertentu — beda dengan `color-mix(in srgb, ...)` yang dipakai
 * palet lama, di mana kuning dan biru dengan langkah mix sama menghasilkan
 * kontras yang jauh berbeda.
 *
 * Hasil akhir SELALU diserialisasi kembali ke hex sRGB (lihat serializeTheme
 * di ./css.ts), bukan `oklch()` CSS — supaya tetap jalan di browser lama pada
 * HP kelas menengah-bawah yang jadi mayoritas pengunjung (CLAUDE.md §Standar
 * Kualitas). Semua manfaat perseptualnya sudah "dibakar" di server.
 */

/** sRGB, 0..1 per kanal. */
export type Rgb = { r: number; g: number; b: number };

/** OKLCH — l 0..1 (lightness perseptual), c chroma (0..~0.4), h hue 0..360. */
export type Oklch = { l: number; c: number; h: number };

const HEX_RE = /^#([0-9a-f]{6})$/i;

export function hexToRgb(hex: string): Rgb | null {
  const match = HEX_RE.exec(hex.trim());
  if (!match) return null;
  const int = Number.parseInt(match[1], 16);
  return {
    r: ((int >> 16) & 0xff) / 255,
    g: ((int >> 8) & 0xff) / 255,
    b: (int & 0xff) / 255,
  };
}

function clamp01(value: number): number {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

function channelToHex(value: number): string {
  return Math.round(clamp01(value) * 255)
    .toString(16)
    .padStart(2, "0");
}

export function rgbToHex({ r, g, b }: Rgb): string {
  return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`;
}

// Transfer function sRGB (IEC 61966-2-1).
function toLinear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

function toGamma(channel: number): number {
  return channel <= 0.0031308 ? channel * 12.92 : 1.055 * Math.pow(channel, 1 / 2.4) - 0.055;
}

export function rgbToOklch(rgb: Rgb): Oklch {
  const r = toLinear(rgb.r);
  const g = toLinear(rgb.g);
  const b = toLinear(rgb.b);

  const lCone = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const mCone = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const sCone = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const l = 0.2104542553 * lCone + 0.793617785 * mCone - 0.0040720468 * sCone;
  const a = 1.9779984951 * lCone - 2.428592205 * mCone + 0.4505937099 * sCone;
  const bAxis = 0.0259040371 * lCone + 0.7827717662 * mCone - 0.808675766 * sCone;

  const c = Math.sqrt(a * a + bAxis * bAxis);
  // Hue tak bermakna saat warnanya abu-abu murni — dinolkan supaya turunan
  // netral untuk input abu-abu tetap benar-benar netral, bukan hue acak.
  const h = c < 1e-6 ? 0 : ((Math.atan2(bAxis, a) * 180) / Math.PI + 360) % 360;

  return { l, c, h };
}

/** Konversi mentah — hasilnya BISA di luar gamut sRGB (kanal < 0 atau > 1). */
function oklchToRgbRaw({ l, c, h }: Oklch): Rgb {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const bAxis = c * Math.sin(rad);

  const lCone = (l + 0.3963377774 * a + 0.2158037573 * bAxis) ** 3;
  const mCone = (l - 0.1055613458 * a - 0.0638541728 * bAxis) ** 3;
  const sCone = (l - 0.0894841775 * a - 1.291485548 * bAxis) ** 3;

  return {
    r: toGamma(4.0767416621 * lCone - 3.3077115913 * mCone + 0.2309699292 * sCone),
    g: toGamma(-1.2684380046 * lCone + 2.6097574011 * mCone - 0.3413193965 * sCone),
    b: toGamma(-0.0041960863 * lCone - 0.7034186147 * mCone + 1.707614701 * sCone),
  };
}

const GAMUT_EPSILON = 0.0001;

function isInGamut({ r, g, b }: Rgb): boolean {
  return (
    r >= -GAMUT_EPSILON &&
    r <= 1 + GAMUT_EPSILON &&
    g >= -GAMUT_EPSILON &&
    g <= 1 + GAMUT_EPSILON &&
    b >= -GAMUT_EPSILON &&
    b <= 1 + GAMUT_EPSILON
  );
}

/**
 * Turunkan chroma sampai warnanya muat di gamut sRGB, dengan lightness & hue
 * dipertahankan. Tanpa ini, warna hasil scale (mis. hijau L 0.75 dengan chroma
 * tinggi) akan "terpotong" per kanal saat di-hex dan hue-nya bergeser.
 */
export function clampToGamut(color: Oklch): Oklch {
  if (isInGamut(oklchToRgbRaw(color))) return color;

  let low = 0;
  let high = color.c;
  // 18 iterasi ≈ presisi 4e-6 pada chroma — jauh di bawah 1 step 8-bit.
  for (let i = 0; i < 18; i += 1) {
    const mid = (low + high) / 2;
    if (isInGamut(oklchToRgbRaw({ ...color, c: mid }))) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return { ...color, c: low };
}

export function oklchToRgb(color: Oklch): Rgb {
  const { r, g, b } = oklchToRgbRaw(clampToGamut(color));
  return { r: clamp01(r), g: clamp01(g), b: clamp01(b) };
}

export function oklchToHex(color: Oklch): string {
  return rgbToHex(oklchToRgb(color));
}

export function hexToOklch(hex: string): Oklch | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToOklch(rgb) : null;
}
