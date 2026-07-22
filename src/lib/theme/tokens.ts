/**
 * Color derivation engine — mengubah 3 warna pilihan admin desa
 * (`warna_primer`, `warna_sekunder`, `warna_aksen` di tabel `desa_profil`)
 * menjadi satu set semantic token yang dijamin harmonis & terbaca.
 *
 * Kontrak: warna APAPUN yang lolos validasi form (hex 6-digit) harus
 * menghasilkan tampilan yang layak. Karena itu setiap token di sini adalah
 * hasil PERHITUNGAN, bukan pemetaan langsung dari nilai mentah admin. Empat
 * guardrail yang menegakkannya:
 *
 *   1. Chroma di-clamp (scale.ts, MAX_BRAND_CHROMA) — warna neon dijinakkan.
 *   2. Warna interaktif tidak boleh terlalu terang. Kalau admin memilih kuning
 *      muda, `--color-primary` turun ke shade yang lebih gelap dari scale,
 *      sementara warna aslinya tetap hidup di `--color-*-soft` dan scale 50–400.
 *   3. `--color-on-*` dipilih lewat rasio kontras WCAG, tidak pernah diasumsikan
 *      putih.
 *   4. Netral (surface/border/text) diberi tint hue tenant yang sangat tipis —
 *      cukup untuk terasa menyatu, tidak cukup untuk terbaca sebagai berwarna.
 */

import {
  CONTRAST_TEXT_AA,
  CONTRAST_UI_AA,
  contrastRatio,
  pickReadableForeground,
} from "./contrast";
import { clampToGamut, hexToOklch, type Oklch } from "./oklch";
import {
  buildBrandScale,
  buildNeutralScale,
  clampBrandChroma,
  MAX_BRAND_CHROMA,
  SCALE_STEPS,
  type ColorScale,
  type ScaleStep,
} from "./scale";

/** Tiga slot warna yang disimpan per tenant. Nama field mengikuti kolom DB. */
export type ThemeSlots = {
  warna_primer: string;
  warna_sekunder: string;
  warna_aksen: string;
};

/**
 * Nilai identik default kolom di migrations/0005_desa_profil.sql. Dipakai kalau
 * hex dari DB tidak bisa di-parse — engine tidak boleh melempar error dan
 * membuat seluruh halaman gagal render hanya karena satu warna korup.
 */
export const DEFAULT_THEME_SLOTS: ThemeSlots = {
  warna_primer: "#c1602a",
  warna_sekunder: "#5b7a41",
  warna_aksen: "#d9a441",
};

/**
 * Warna status TIDAK diturunkan dari tenant — merah/kuning/hijau/biru adalah
 * makna universal, dan desa berprimer hijau tidak boleh punya pesan galat
 * hijau. Hue-nya dipatok di sini; lightness & chroma-nya tetap melewati
 * guardrail yang sama dengan warna brand, jadi kontrasnya tetap dijamin.
 *
 * Catatan soal `warning`: tidak ada kuning terang yang sanggup memenuhi 3:1
 * terhadap surface putih, jadi G2 pasti memekatkannya jadi amber tua. Kuning
 * cerahnya tetap hidup di `--color-warning-soft` — itu memang tempat yang
 * benar untuk kuning: latar, bukan permukaan bertulisan.
 */
const STATUS_BASES = {
  danger: { l: 0.55, c: 0.17, h: 25 },
  warning: { l: 0.76, c: 0.16, h: 85 },
  success: { l: 0.58, c: 0.14, h: 145 },
  info: { l: 0.52, c: 0.16, h: 250 },
} as const satisfies Record<string, Oklch>;

export type StatusName = keyof typeof STATUS_BASES;

export const STATUS_NAMES = Object.keys(STATUS_BASES) as readonly StatusName[];

/** Redaman chroma panel gelap (Navbar/Footer) — lihat catatan di deriveTheme(). */
const PANEL_CHROMA_DAMPING = 0.75;

/** Batas lightness untuk warna yang dipakai sebagai permukaan komponen interaktif. */
const INTERACTIVE_MAX_L = 0.7;

/** Selisih lightness untuk state hover & active. */
const HOVER_DELTA = 0.055;
const ACTIVE_DELTA = 0.105;

/**
 * Di bawah lightness ini, hover dibuat LEBIH TERANG, bukan lebih gelap — kalau
 * tidak, tombol yang sudah pekat tidak menunjukkan perubahan apa pun saat
 * disentuh.
 */
const HOVER_INVERT_BELOW_L = 0.42;

/** Satu warna status beserta latar lembut dan pasangan teksnya. */
export type StatusTokens = {
  base: Oklch;
  soft: Oklch;
  on: Oklch;
  onSoft: Oklch;
};

export type SemanticTokens = {
  primary: Oklch;
  primaryHover: Oklch;
  primaryActive: Oklch;
  primarySoft: Oklch;
  onPrimary: Oklch;
  onPrimarySoft: Oklch;

  secondary: Oklch;
  secondaryHover: Oklch;
  secondaryActive: Oklch;
  secondarySoft: Oklch;
  onSecondary: Oklch;
  onSecondarySoft: Oklch;

  accent: Oklch;
  accentHover: Oklch;
  accentActive: Oklch;
  accentSoft: Oklch;
  onAccent: Oklch;
  onAccentSoft: Oklch;

  surface: Oklch;
  surfaceAlt: Oklch;
  border: Oklch;
  borderStrong: Oklch;
  text: Oklch;
  textMuted: Oklch;

  panel: Oklch;
  panelStrong: Oklch;
  panelBorder: Oklch;
  onPanel: Oklch;
  onPanelMuted: Oklch;

  link: Oklch;
  linkHover: Oklch;
  focusRing: Oklch;

  status: Record<StatusName, StatusTokens>;

  /**
   * Lima seri chart, diambil dari step scale yang SUDAH ada — bukan hue baru
   * (K13). Dengan begitu grafik tidak pernah memunculkan warna yang tak pernah
   * dipilih admin.
   *
   * Kelimanya sengaja mengambil LIMA step lightness yang berbeda (700/500/900/
   * 300/800), dirotasi antar scale primary/secondary/accent. Konsekuensinya
   * ganda: desa multi-hue tetap dapat variasi warna (tiga hue tampil), sementara
   * desa berwarna netral — yang ketiga slotnya nyaris sehue — tetap terbedakan
   * lewat lightness saja. Ini yang memperbaiki AC6: versi lama menaruh tiga seri
   * di step 600 yang sama, sehingga untuk tema abu-abu chart-1..3 keluar hex
   * identik. Sekarang ΔE terkecil antar seri ≥ 0.094 di seluruh preset ekstrem.
   */
  chart: readonly [Oklch, Oklch, Oklch, Oklch, Oklch];
};

export type SlotDiagnostic = {
  /** Hex mentah dari DB, apa adanya. */
  input: string;
  /** Nilai OKLCH sebelum guardrail apa pun. */
  base: Oklch;
  /** True kalau chroma-nya dipangkas MAX_BRAND_CHROMA (warna terlalu neon). */
  chromaClamped: boolean;
  /**
   * Terisi kalau warna asli terlalu terang untuk jadi permukaan interaktif dan
   * engine memakai shade scale yang lebih gelap. `null` = warna asli dipakai.
   */
  shiftedToStep: ScaleStep | null;
};

export type ThemeDiagnostics = {
  primer: SlotDiagnostic;
  sekunder: SlotDiagnostic;
  aksen: SlotDiagnostic;
  contrast: {
    onPrimary: number;
    onSecondary: number;
    onAccent: number;
    onPrimarySoft: number;
    textOnSurface: number;
    textMutedOnSurface: number;
    primaryOnSurface: number;
    borderOnSurface: number;
    borderStrongOnSurface: number;
    onPanel: number;
    linkOnSurface: number;
  };
  /** Kontras tiap warna status terhadap pasangan teksnya masing-masing. */
  status: Record<StatusName, { on: number; onSoft: number }>;
};

export type DerivedTheme = {
  scales: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    neutral: ColorScale;
  };
  semantic: SemanticTokens;
  diagnostics: ThemeDiagnostics;
};

function parseSlot(hex: string, fallback: string): Oklch {
  return hexToOklch(hex) ?? hexToOklch(fallback) ?? { l: 0.6, c: 0.1, h: 40 };
}

/** Warna dasar setelah chroma di-clamp — titik awal semua turunan. */
function tamed(base: Oklch): Oklch {
  return clampToGamut({ ...base, c: clampBrandChroma(base.c) });
}

/**
 * Ada "zona mati" kontras di lightness menengah: warna dengan luminansi relatif
 * antara ~0.18 dan ~0.24 gagal mencapai 4.5:1 BAIK terhadap putih MAUPUN
 * terhadap near-black. Abu-abu #808080 dan hijau tua adalah contoh yang jatuh
 * persis di sana. Permukaan interaktif wajib keluar dari zona ini, kalau tidak
 * label tombolnya mustahil memenuhi AA apa pun warna teks yang dipilih.
 */
function canCarryLabel(color: Oklch, paper: Oklch, ink: Oklch): boolean {
  return Math.max(contrastRatio(color, paper), contrastRatio(color, ink)) >= CONTRAST_TEXT_AA;
}

/**
 * Guardrail 2: cari permukaan interaktif yang layak. Warna asli dipakai kalau
 * ia lolos ketiga syarat: (a) tidak terlalu terang, (b) tepinya masih terlihat
 * di atas surface (WCAG 1.4.11), (c) sanggup menampung label teks yang
 * memenuhi AA.
 *
 * Kalau gagal, penggantinya dicari ke arah GELAP lebih dulu — shade gelap
 * mempertahankan karakter warna pilihan admin jauh lebih baik daripada shade
 * terang (terracotta yang dipaksa terang berubah jadi oranye pucat, sementara
 * terracotta yang dipekatkan tetap terbaca sebagai terracotta). Arah terang
 * hanya dipakai sebagai jaring pengaman untuk warna yang sudah sangat gelap.
 */
function pickInteractive(
  base: Oklch,
  scale: ColorScale,
  surface: Oklch,
  paper: Oklch,
  ink: Oklch,
): { color: Oklch; shiftedToStep: ScaleStep | null } {
  const isUsable = (color: Oklch): boolean =>
    color.l <= INTERACTIVE_MAX_L &&
    contrastRatio(color, surface) >= CONTRAST_UI_AA &&
    canCarryLabel(color, paper, ink);

  const candidate = tamed(base);
  if (isUsable(candidate)) return { color: candidate, shiftedToStep: null };

  // SCALE_STEPS urut dari paling terang ke paling gelap, jadi memfilter step
  // yang lebih gelap dan mengiterasinya apa adanya = mulai dari yang paling
  // dekat ke warna asli. Arah terang dibalik supaya juga mulai dari terdekat.
  const towardDark = SCALE_STEPS.filter((step) => scale[step].l < candidate.l);
  const towardLight = SCALE_STEPS.filter((step) => scale[step].l >= candidate.l).reverse();

  for (const step of [...towardDark, ...towardLight]) {
    if (isUsable(scale[step])) return { color: scale[step], shiftedToStep: step };
  }
  return { color: scale[900], shiftedToStep: 900 };
}

/** Shade tertentu dengan lightness digeser, hue & chroma dipertahankan. */
function shiftLightness(color: Oklch, delta: number): Oklch {
  const direction = color.l > HOVER_INVERT_BELOW_L ? -1 : 1;
  return clampToGamut({ ...color, l: Math.min(0.98, Math.max(0.06, color.l + direction * delta)) });
}

/**
 * Shade tertentu dari `scale` yang kontrasnya terhadap `background` memenuhi
 * `threshold`. `order` menentukan preferensi: elemen pertama yang lolos yang
 * dipakai, jadi urutannya harus dari yang paling diinginkan.
 */
function pickAgainst(
  background: Oklch,
  scale: ColorScale,
  order: readonly ScaleStep[],
  threshold: number,
): Oklch {
  for (const step of order) {
    if (contrastRatio(scale[step], background) >= threshold) return scale[step];
  }
  return scale[order[order.length - 1]];
}

/** Urutan pencarian teks berwarna di atas latar terang: mulai dari yang paling terang. */
const TEXT_ON_LIGHT_ORDER: readonly ScaleStep[] = [500, 600, 700, 800, 900];

/** Urutan pencarian teks netral di atas latar gelap: mulai dari yang paling redup. */
const TEXT_ON_DARK_ORDER: readonly ScaleStep[] = [500, 400, 300, 200, 100, 50];

/** Urutan pencarian teks netral redup di atas latar terang. */
const MUTED_ON_LIGHT_ORDER: readonly ScaleStep[] = [500, 600, 700, 800, 900];

/** Urutan pencarian batas kontrol form: mulai dari yang paling halus. */
const BORDER_STRONG_ORDER: readonly ScaleStep[] = [300, 400, 500, 600, 700];

function buildSlotDiagnostic(
  input: string,
  base: Oklch,
  shiftedToStep: ScaleStep | null,
): SlotDiagnostic {
  return {
    input,
    base,
    chromaClamped: base.c > MAX_BRAND_CHROMA,
    shiftedToStep,
  };
}

/**
 * Satu warna status lewat pipeline yang sama persis dengan warna brand:
 * permukaannya dicari lewat pickInteractive() sehingga dijamin 3:1 terhadap
 * surface dan sanggup menampung label, teksnya dipilih lewat rasio kontras.
 * `paper`/`ink` tetap netral TENANT supaya badge status menyatu dengan halaman.
 */
function buildStatus(base: Oklch, surface: Oklch, paper: Oklch, ink: Oklch): StatusTokens {
  const scale = buildBrandScale(base);
  const { color } = pickInteractive(base, scale, surface, paper, ink);
  const soft = scale[100];

  return {
    base: color,
    soft,
    on: pickReadableForeground(color, paper, ink),
    onSoft: pickAgainst(soft, scale, TEXT_ON_LIGHT_ORDER, CONTRAST_TEXT_AA),
  };
}

export function deriveTheme(slots: ThemeSlots): DerivedTheme {
  const basePrimer = parseSlot(slots.warna_primer, DEFAULT_THEME_SLOTS.warna_primer);
  const baseSekunder = parseSlot(slots.warna_sekunder, DEFAULT_THEME_SLOTS.warna_sekunder);
  const baseAksen = parseSlot(slots.warna_aksen, DEFAULT_THEME_SLOTS.warna_aksen);

  const primary = buildBrandScale(basePrimer);
  const secondary = buildBrandScale(baseSekunder);
  const accent = buildBrandScale(baseAksen);
  // Netral selalu mewarisi hue PRIMER saja — kalau tiap slot menyumbang tint,
  // surface dan border bisa berasal dari hue berbeda dan halaman terasa kotor.
  const neutral = buildNeutralScale(basePrimer);

  const surface = neutral[50];
  const surfaceAlt = neutral[100];
  const ink = neutral[900];
  const paper = neutral[50];

  const primaryPick = pickInteractive(basePrimer, primary, surface, paper, ink);
  const secondaryPick = pickInteractive(baseSekunder, secondary, surface, paper, ink);
  const accentPick = pickInteractive(baseAksen, accent, surface, paper, ink);

  const primarySoft = primary[100];
  const secondarySoft = secondary[100];
  const accentSoft = accent[100];

  // Guardrail 4 (S6): panel gelap Navbar/Footer/Hero adalah shade gelap dari
  // warna PRIMER, bukan netral — supaya identitas desa tetap terasa di area
  // paling menonjol halaman. Kontras teksnya dijamin lewat pickAgainst().
  //
  // Chroma-nya diredam: shade 900 apa adanya 2,4× lebih berwarna daripada panel
  // palet lama, dan untuk desa berwarna jenuh hasilnya Navbar yang menyala
  // sepanjang halaman. 75% cukup untuk tetap terbaca sebagai warna desa.
  const panel = clampToGamut({ ...primary[900], c: primary[900].c * PANEL_CHROMA_DAMPING });
  const panelStrong = clampToGamut({
    l: 0.208,
    c: clampBrandChroma(basePrimer.c) * 0.6,
    h: basePrimer.h,
  });
  const panelBorder = clampToGamut({
    l: 0.36,
    c: clampBrandChroma(basePrimer.c) * 0.5,
    h: basePrimer.h,
  });

  const link = pickAgainst(surface, primary, TEXT_ON_LIGHT_ORDER, CONTRAST_TEXT_AA);

  const semantic: SemanticTokens = {
    primary: primaryPick.color,
    primaryHover: shiftLightness(primaryPick.color, HOVER_DELTA),
    primaryActive: shiftLightness(primaryPick.color, ACTIVE_DELTA),
    primarySoft,
    onPrimary: pickReadableForeground(primaryPick.color, paper, ink),
    onPrimarySoft: pickAgainst(primarySoft, primary, TEXT_ON_LIGHT_ORDER, CONTRAST_TEXT_AA),

    secondary: secondaryPick.color,
    secondaryHover: shiftLightness(secondaryPick.color, HOVER_DELTA),
    secondaryActive: shiftLightness(secondaryPick.color, ACTIVE_DELTA),
    secondarySoft,
    onSecondary: pickReadableForeground(secondaryPick.color, paper, ink),
    onSecondarySoft: pickAgainst(secondarySoft, secondary, TEXT_ON_LIGHT_ORDER, CONTRAST_TEXT_AA),

    accent: accentPick.color,
    accentHover: shiftLightness(accentPick.color, HOVER_DELTA),
    accentActive: shiftLightness(accentPick.color, ACTIVE_DELTA),
    accentSoft,
    onAccent: pickReadableForeground(accentPick.color, paper, ink),
    onAccentSoft: pickAgainst(accentSoft, accent, TEXT_ON_LIGHT_ORDER, CONTRAST_TEXT_AA),

    surface,
    surfaceAlt,
    border: neutral[200],
    // Batas kontrol form (input, select, checkbox) adalah satu-satunya penanda
    // keberadaan kontrol itu, jadi WCAG 1.4.11 menuntut 3:1 terhadap surface —
    // jauh lebih pekat dari `border` yang cuma divider dekoratif.
    borderStrong: pickAgainst(surface, neutral, BORDER_STRONG_ORDER, CONTRAST_UI_AA),
    text: ink,
    textMuted: pickAgainst(surface, neutral, MUTED_ON_LIGHT_ORDER, CONTRAST_TEXT_AA),

    panel,
    panelStrong,
    panelBorder,
    onPanel: pickReadableForeground(panel, paper, ink),
    onPanelMuted: pickAgainst(panel, neutral, TEXT_ON_DARK_ORDER, CONTRAST_TEXT_AA),

    link,
    linkHover: shiftLightness(link, HOVER_DELTA),
    focusRing: primaryPick.color,

    status: {
      danger: buildStatus(STATUS_BASES.danger, surface, paper, ink),
      warning: buildStatus(STATUS_BASES.warning, surface, paper, ink),
      success: buildStatus(STATUS_BASES.success, surface, paper, ink),
      info: buildStatus(STATUS_BASES.info, surface, paper, ink),
    },

    chart: [primary[700], secondary[500], accent[900], primary[300], secondary[800]],
  };

  const diagnostics: ThemeDiagnostics = {
    primer: buildSlotDiagnostic(slots.warna_primer, basePrimer, primaryPick.shiftedToStep),
    sekunder: buildSlotDiagnostic(slots.warna_sekunder, baseSekunder, secondaryPick.shiftedToStep),
    aksen: buildSlotDiagnostic(slots.warna_aksen, baseAksen, accentPick.shiftedToStep),
    contrast: {
      onPrimary: contrastRatio(semantic.primary, semantic.onPrimary),
      onSecondary: contrastRatio(semantic.secondary, semantic.onSecondary),
      onAccent: contrastRatio(semantic.accent, semantic.onAccent),
      onPrimarySoft: contrastRatio(semantic.primarySoft, semantic.onPrimarySoft),
      textOnSurface: contrastRatio(semantic.text, semantic.surface),
      textMutedOnSurface: contrastRatio(semantic.textMuted, semantic.surface),
      primaryOnSurface: contrastRatio(semantic.primary, semantic.surface),
      borderOnSurface: contrastRatio(semantic.border, semantic.surface),
      borderStrongOnSurface: contrastRatio(semantic.borderStrong, semantic.surface),
      onPanel: contrastRatio(semantic.panel, semantic.onPanel),
      linkOnSurface: contrastRatio(semantic.link, semantic.surface),
    },
    status: Object.fromEntries(
      STATUS_NAMES.map((name) => {
        const token = semantic.status[name];
        return [
          name,
          {
            on: contrastRatio(token.base, token.on),
            onSoft: contrastRatio(token.soft, token.onSoft),
          },
        ];
      }),
    ) as ThemeDiagnostics["status"],
  };

  return { scales: { primary, secondary, accent, neutral }, semantic, diagnostics };
}
