/**
 * Color derivation engine tema desa. Titik masuk yang dipakai aplikasi:
 *
 *   buildThemeCssVariables({ warna_primer, warna_sekunder, warna_aksen })
 *     → Record<string, string> siap dipasang sebagai inline style di <html>.
 *
 * Dokumentasi lengkap token & aturan pemakaiannya ada di DESIGN.md.
 */

export { buildThemeCssVariables, themeToCssVariables, type ThemeCssVariables } from "./css";
export {
  CONTRAST_TEXT_AA,
  CONTRAST_TEXT_LARGE_AA,
  CONTRAST_UI_AA,
  contrastRatio,
  relativeLuminance,
} from "./contrast";
export { hexToOklch, oklchToHex, type Oklch, type Rgb } from "./oklch";
export {
  MAX_BRAND_CHROMA,
  MAX_NEUTRAL_CHROMA,
  SCALE_STEPS,
  type ColorScale,
  type ScaleStep,
} from "./scale";
export {
  DEFAULT_THEME_SLOTS,
  deriveTheme,
  STATUS_NAMES,
  type DerivedTheme,
  type SemanticTokens,
  type SlotDiagnostic,
  type StatusName,
  type StatusTokens,
  type ThemeDiagnostics,
  type ThemeSlots,
} from "./tokens";
