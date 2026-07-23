import { notFound } from "next/navigation";
import {
  DEFAULT_THEME_SLOTS,
  deriveTheme,
  hexToOklch,
  themeToCssVariables,
  type ThemeSlots,
} from "@/lib/theme";
import { previewCss } from "./preview.css";
import {
  ChartSection,
  ContrastTable,
  GuardrailTable,
  ScaleSection,
  StatusSection,
  TokenGrid,
} from "./sections";

/**
 * Preview color derivation engine — DEV ONLY.
 *
 * Gunanya menguji klaim inti engine: warna APAPUN yang diinput admin desa
 * harus menghasilkan tampilan yang harmonis dan terbaca. Ganti warna lewat
 * pemilih di atas halaman, lewat preset ekstrem, atau langsung lewat query
 * string: /dev/tema?primer=%23ffd400&sekunder=%235b7a41&aksen=%23d9a441
 *
 * Halaman ini mendeklarasikan ulang semua token pada wrapper-nya sendiri, jadi
 * yang tampil adalah keluaran engine untuk warna di query string — bukan tema
 * tenant yang kebetulan sedang diinjeksikan di <html>.
 */

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const PRESETS: ReadonlyArray<{ label: string; slots: ThemeSlots }> = [
  { label: "Default desa Sita", slots: DEFAULT_THEME_SLOTS },
  {
    label: "Kuning terang",
    slots: { warna_primer: "#ffd400", warna_sekunder: "#ffe97a", warna_aksen: "#fff3b0" },
  },
  {
    label: "Hijau neon",
    slots: { warna_primer: "#00ff00", warna_sekunder: "#39ff14", warna_aksen: "#7cff5a" },
  },
  {
    label: "Merah gelap",
    slots: { warna_primer: "#5c0d0d", warna_sekunder: "#7a1f1f", warna_aksen: "#a33a3a" },
  },
  {
    label: "Abu-abu",
    slots: { warna_primer: "#808080", warna_sekunder: "#9e9e9e", warna_aksen: "#c4c4c4" },
  },
  {
    label: "Biru pekat",
    slots: { warna_primer: "#0b3d91", warna_sekunder: "#1565c0", warna_aksen: "#42a5f5" },
  },
  {
    label: "Magenta neon",
    slots: { warna_primer: "#ff00d4", warna_sekunder: "#ff5ce6", warna_aksen: "#ffa3f0" },
  },
];

function readHex(raw: string | string[] | undefined, fallback: string): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return fallback;
  const normalized = value.startsWith("#") ? value : `#${value}`;
  return hexToOklch(normalized) ? normalized.toLowerCase() : fallback;
}

function presetHref(slots: ThemeSlots): string {
  const params = new URLSearchParams({
    primer: slots.warna_primer,
    sekunder: slots.warna_sekunder,
    aksen: slots.warna_aksen,
  });
  return `/dev/tema?${params.toString()}`;
}

export default async function PreviewTemaPage({ searchParams }: PageProps) {
  // Perkakas internal — tidak pernah ada di produksi, jadi tidak perlu
  // digerbangi auth dan tidak bisa bocor ke pengunjung desa.
  if (process.env.NODE_ENV === "production") notFound();

  const params = await searchParams;
  const slots: ThemeSlots = {
    warna_primer: readHex(params.primer, DEFAULT_THEME_SLOTS.warna_primer),
    warna_sekunder: readHex(params.sekunder, DEFAULT_THEME_SLOTS.warna_sekunder),
    warna_aksen: readHex(params.aksen, DEFAULT_THEME_SLOTS.warna_aksen),
  };

  const theme = deriveTheme(slots);
  const vars = themeToCssVariables(theme);

  const fields = [
    { name: "primer", label: "Warna Utama", value: slots.warna_primer },
    { name: "sekunder", label: "Warna Sekunder", value: slots.warna_sekunder },
    { name: "aksen", label: "Warna Aksen", value: slots.warna_aksen },
  ];

  return (
    <>
      <style>{previewCss}</style>
      <div className="tema" style={vars as React.CSSProperties}>
        <div className="tema-wrap">
          <h1>Preview Tema Desa</h1>
          <p className="muted">
            Keluaran color derivation engine untuk tiga warna pilihan admin. Halaman perkakas
            internal, hanya tersedia saat <code>next dev</code>.
          </p>

          {/* ── Input ─────────────────────────────────────────── */}
          <form method="get" className="card" style={{ marginTop: 20 }}>
            <div className="form-row">
              {fields.map((field) => (
                <div className="field" key={field.name}>
                  <label htmlFor={`f-${field.name}`}>{field.label}</label>
                  <div className="field-input">
                    <input
                      type="color"
                      id={`f-${field.name}`}
                      name={field.name}
                      defaultValue={field.value}
                      aria-label={`Pilih ${field.label}`}
                    />
                    <code className="muted">{field.value}</code>
                  </div>
                </div>
              ))}
              <button type="submit" className="btn btn-primary">
                Terapkan
              </button>
            </div>
          </form>

          <h3>Preset uji ekstrem</h3>
          <div className="preset-row">
            {PRESETS.map((preset) => (
              <a key={preset.label} href={presetHref(preset.slots)} className="preset">
                <span className="preset-dots">
                  {[
                    preset.slots.warna_primer,
                    preset.slots.warna_sekunder,
                    preset.slots.warna_aksen,
                  ].map((hex) => (
                    <span key={hex} className="preset-dot" style={{ background: hex }} />
                  ))}
                </span>
                {preset.label}
              </a>
            ))}
          </div>

          {/* ── Diagnostik ────────────────────────────────────── */}
          <h2>Guardrail yang aktif</h2>
          <GuardrailTable diagnostics={theme.diagnostics} />

          <h2>Rasio kontras</h2>
          <ContrastTable diagnostics={theme.diagnostics} />

          {/* ── Contoh komponen ───────────────────────────────── */}
          <h2>Contoh komponen</h2>

          <h3>Tombol</h3>
          <div className="btn-row">
            <button type="button" className="btn btn-primary">
              Ajukan Surat
            </button>
            <button type="button" className="btn btn-secondary">
              Lihat Statistik
            </button>
            <button type="button" className="btn btn-accent">
              Sorot
            </button>
            <button type="button" className="btn btn-soft">
              Unduh Data
            </button>
            <button type="button" className="btn btn-outline">
              Batal
            </button>
            <button type="button" className="btn btn-ghost">
              Pelajari
            </button>
            <button type="button" className="btn btn-primary" disabled>
              Nonaktif
            </button>
          </div>

          <h3>Badge</h3>
          <div className="btn-row">
            <span className="badge badge-primary">Layanan</span>
            <span className="badge badge-secondary">Pertanian</span>
            <span className="badge badge-accent">Baru</span>
            <span className="badge badge-solid">Prioritas</span>
          </div>

          <h3>Warna status</h3>
          <StatusSection />

          <h3>Card &amp; teks</h3>
          <div className="card" style={{ maxWidth: 560 }}>
            <h4 style={{ margin: "0 0 6px", fontSize: "1rem", fontWeight: 650 }}>
              Kelompok Tani Sinar Tani
            </h4>
            <p className="muted" style={{ fontSize: "0.85rem" }}>
              Berdiri sejak 1998, beranggotakan 64 kepala keluarga yang mengelola lahan sawah
              seluas 42 hektar di sebelah utara desa.
            </p>
            <p style={{ fontSize: "0.85rem", marginBottom: 14 }}>
              Baca selengkapnya di{" "}
              <a href="/dev/tema" className="inline-link">
                halaman lembaga desa
              </a>
              .
            </p>
            <div className="btn-row">
              <span className="badge badge-secondary">Aktif</span>
              <button type="button" className="btn btn-outline">
                Detail
              </button>
            </div>
          </div>

          <h3>Form input</h3>
          <div className="field" style={{ maxWidth: 320 }}>
            <label htmlFor="contoh-input">Nama Pemohon</label>
            <input
              type="text"
              id="contoh-input"
              defaultValue="Maria Goreti"
              style={{ inlineSize: "100%" }}
            />
          </div>

          <h3>Panel gelap — Navbar, Footer, Hero</h3>
          <div className="panel">
            <strong style={{ fontSize: "1.05rem" }}>Desa Sita</strong>
            <p className="muted" style={{ margin: "4px 0 14px", fontSize: "0.85rem" }}>
              Kec. Rana Mese · Kab. Manggarai Timur · Nusa Tenggara Timur
            </p>
            <div className="btn-row">
              <button type="button" className="btn btn-primary">
                Layanan Surat
              </button>
              <button type="button" className="btn btn-soft">
                Data Desa
              </button>
            </div>
          </div>
          <div className="panel panel-deep" style={{ marginTop: 10 }}>
            <strong>panel-strong</strong>
            <p className="muted" style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>
              Lapisan paling pekat — dasar Hero dan bagian bawah Footer.
            </p>
          </div>

          {/* ── Token ─────────────────────────────────────────── */}
          <h2>Seri chart</h2>
          <ChartSection vars={vars} />

          <h2>Scale</h2>
          <ScaleSection scales={theme.scales} />

          <h2>Semantic token</h2>
          <TokenGrid vars={vars} />

          <div className="tema-note">
            <strong>Catatan.</strong> Seluruh warna di halaman ini — termasuk teks, garis, dan
            latar — berasal dari token engine, tanpa satu pun hex literal. Kalau halaman ini masih
            nyaman dibaca pada preset paling ekstrem, token-nya bisa dipercaya untuk halaman
            publik. Aturan pemakaian tiap token ada di <code>DESIGN.md</code>.
          </div>
        </div>
      </div>
    </>
  );
}
