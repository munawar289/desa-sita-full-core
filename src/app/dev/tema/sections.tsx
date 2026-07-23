import {
  CONTRAST_TEXT_AA,
  CONTRAST_UI_AA,
  oklchToHex,
  SCALE_STEPS,
  STATUS_NAMES,
  type ColorScale,
  type ThemeCssVariables,
  type ThemeDiagnostics,
} from "@/lib/theme";

/**
 * Bagian laporan halaman /dev/tema: diagnostik guardrail, tabel rasio kontras,
 * dan tampilan seluruh token. Dipisah dari page.tsx yang menyimpan kerangka
 * halaman dan contoh komponennya.
 */

function ContrastRow({ label, value, min }: { label: string; value: number; min: number }) {
  const ok = value >= min;
  return (
    <tr>
      <td>{label}</td>
      <td className="num">{value.toFixed(2)}</td>
      <td className="num">{min.toFixed(1)}</td>
      <td>
        <span className={ok ? "pass" : "fail"}>{ok ? "Lolos" : "Gagal"}</span>
      </td>
    </tr>
  );
}

export function GuardrailTable({ diagnostics }: { diagnostics: ThemeDiagnostics }) {
  const rows = [
    { label: "Primer", value: diagnostics.primer },
    { label: "Sekunder", value: diagnostics.sekunder },
    { label: "Aksen", value: diagnostics.aksen },
  ];

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Slot</th>
            <th>Input</th>
            <th>Chroma dipangkas</th>
            <th>Digeser ke shade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, value }) => (
            <tr key={label}>
              <td>{label}</td>
              <td>
                <code>{value.input}</code>
              </td>
              <td>{value.chromaClamped ? "Ya — warna terlalu jenuh" : "Tidak"}</td>
              <td>
                {value.shiftedToStep === null
                  ? "Tidak — warna asli dipakai"
                  : `Ya — ke step ${value.shiftedToStep}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Label Bahasa Indonesia untuk tiap warna status. */
const STATUS_LABEL: Record<(typeof STATUS_NAMES)[number], string> = {
  danger: "Galat",
  warning: "Peringatan",
  success: "Berhasil",
  info: "Informasi",
};

export function ContrastTable({ diagnostics }: { diagnostics: ThemeDiagnostics }) {
  const { contrast } = diagnostics;
  const statusRows = STATUS_NAMES.flatMap((name) => [
    {
      label: `on-${name} di atas ${name}`,
      value: diagnostics.status[name].on,
      min: CONTRAST_TEXT_AA,
    },
    {
      label: `on-${name}-soft di atas ${name}-soft`,
      value: diagnostics.status[name].onSoft,
      min: CONTRAST_TEXT_AA,
    },
  ]);
  const rows: ReadonlyArray<{ label: string; value: number; min: number }> = [
    { label: "on-primary di atas primary", value: contrast.onPrimary, min: CONTRAST_TEXT_AA },
    { label: "on-secondary di atas secondary", value: contrast.onSecondary, min: CONTRAST_TEXT_AA },
    { label: "on-accent di atas accent", value: contrast.onAccent, min: CONTRAST_TEXT_AA },
    {
      label: "on-primary-soft di atas primary-soft",
      value: contrast.onPrimarySoft,
      min: CONTRAST_TEXT_AA,
    },
    { label: "text di atas surface", value: contrast.textOnSurface, min: CONTRAST_TEXT_AA },
    {
      label: "text-muted di atas surface",
      value: contrast.textMutedOnSurface,
      min: CONTRAST_TEXT_AA,
    },
    { label: "link di atas surface", value: contrast.linkOnSurface, min: CONTRAST_TEXT_AA },
    { label: "on-panel di atas panel", value: contrast.onPanel, min: CONTRAST_TEXT_AA },
    {
      label: "primary di atas surface (batas komponen)",
      value: contrast.primaryOnSurface,
      min: CONTRAST_UI_AA,
    },
    {
      label: "border-strong di atas surface (batas kontrol)",
      value: contrast.borderStrongOnSurface,
      min: CONTRAST_UI_AA,
    },
    ...statusRows,
  ];

  return (
    <div className="card">
      <table>
        <thead>
          <tr>
            <th>Pasangan</th>
            <th className="num">Rasio</th>
            <th className="num">Min</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <ContrastRow key={row.label} {...row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Ramp({ scale }: { scale: ColorScale }) {
  return (
    <div className="ramp">
      {SCALE_STEPS.map((step) => {
        const hex = oklchToHex(scale[step]);
        // Label ditaruh di atas chip-nya sendiri, jadi warnanya harus mengikuti
        // gelap/terangnya step — pakai ambang lightness OKLCH langsung.
        const label = scale[step].l > 0.6 ? "#111" : "#fff";
        return (
          <div key={step} className="ramp-step" style={{ background: hex, color: label }}>
            {step}
          </div>
        );
      })}
    </div>
  );
}

export function ScaleSection({
  scales,
}: {
  scales: Record<"primary" | "secondary" | "accent" | "neutral", ColorScale>;
}) {
  return (
    <>
      {(["primary", "secondary", "accent", "neutral"] as const).map((name) => (
        <div key={name}>
          <h3>{name} 50–900</h3>
          <Ramp scale={scales[name]} />
        </div>
      ))}
    </>
  );
}

/**
 * Warna status. Hue-nya dipatok, jadi bagian ini harus tetap terbaca sebagai
 * merah/kuning/hijau/biru pada preset seekstrem apa pun — itu yang diuji.
 * Tiap contoh selalu punya teks, tidak pernah warna sendirian (WCAG 1.4.1).
 */
export function StatusSection() {
  return (
    <>
      <div className="btn-row">
        {STATUS_NAMES.map((name) => (
          <span key={name} className="badge" data-status={name}>
            {STATUS_LABEL[name]}
          </span>
        ))}
      </div>
      <div className="btn-row" style={{ marginTop: 10 }}>
        {STATUS_NAMES.map((name) => (
          <button key={name} type="button" className="btn" data-status-solid={name}>
            {STATUS_LABEL[name]}
          </button>
        ))}
      </div>
      <div className="alert" data-status="danger" style={{ marginTop: 14 }}>
        <strong>Nomor Induk Kependudukan belum diisi.</strong> Isi 16 digit NIK sesuai kartu
        keluarga sebelum mengirim permohonan.
      </div>
    </>
  );
}

/** Lima seri chart, diambil dari step scale yang sudah ada (bukan hue baru). */
export function ChartSection({ vars }: { vars: ThemeCssVariables }) {
  return (
    <div className="chart-row">
      {[1, 2, 3, 4, 5].map((index) => {
        const name = `--color-chart-${index}`;
        return (
          <div key={name} className="chart-series">
            <span className="chart-bar" style={{ background: vars[name] }} />
            <span className="swatch-value">
              chart-{index} · {vars[name]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function TokenGrid({ vars }: { vars: ThemeCssVariables }) {
  // Semantic token = semua nama yang TIDAK berakhiran angka step scale.
  const names = Object.keys(vars).filter((name) => !/-\d{2,3}$/.test(name));

  return (
    <div className="swatch-grid">
      {names.map((name) => (
        <div className="swatch" key={name}>
          <div className="swatch-chip" style={{ background: vars[name] }} />
          <div className="swatch-meta">
            <div className="swatch-name">{name}</div>
            <div className="swatch-value">{vars[name]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
