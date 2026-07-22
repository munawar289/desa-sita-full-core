/**
 * CSS halaman preview tema. Dipisah dari page.tsx supaya berkas halaman tetap
 * terbaca sebagai struktur, bukan tembok string.
 *
 * SETIAP warna di sini datang dari token engine — tidak ada satu pun hex
 * literal. Itu memang inti pengujiannya: kalau halaman ini masih terbaca dan
 * enak dilihat untuk warna input seekstrem apa pun, token-nya bekerja.
 */
export const previewCss = `
.tema {
  background: var(--color-surface-alt);
  color: var(--color-text);
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  min-height: 100%;
  padding: 24px 16px 96px;
  line-height: 1.55;
}
.tema-wrap { max-width: 1040px; margin: 0 auto; }
.tema h1 { font-size: 1.6rem; font-weight: 700; letter-spacing: -0.01em; margin: 0 0 4px; }
.tema h2 { font-size: 1.05rem; font-weight: 650; margin: 40px 0 12px; letter-spacing: -0.005em; }
.tema h3 { font-size: 0.8rem; font-weight: 600; margin: 20px 0 8px; color: var(--color-text-muted);
  text-transform: uppercase; letter-spacing: 0.06em; }
.tema p { margin: 0 0 12px; }
.tema .muted { color: var(--color-text-muted); }
.tema code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.78rem; }

.tema-note {
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-accent);
  background: var(--color-surface);
  border-radius: 10px; padding: 12px 14px; margin: 16px 0 0; font-size: 0.85rem;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 18px;
}

/* ── Kontrol input ─────────────────────────────────────────────── */
.form-row { display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-end; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 0.78rem; font-weight: 600; color: var(--color-text-muted); }
.field-input { display: flex; align-items: center; gap: 8px; }
input[type="color"] {
  inline-size: 48px; block-size: 44px; padding: 3px; cursor: pointer;
  border: 1px solid var(--color-border-strong); border-radius: 10px;
  background: var(--color-surface);
}
input[type="text"] {
  block-size: 44px; padding: 0 12px; font-family: ui-monospace, monospace; font-size: 0.85rem;
  border: 1px solid var(--color-border-strong); border-radius: 10px;
  background: var(--color-surface); color: var(--color-text); inline-size: 110px;
}
input:focus-visible, .btn:focus-visible, a:focus-visible {
  outline: 2px solid var(--color-focus-ring); outline-offset: 2px;
}

/* ── Tombol ────────────────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  min-block-size: 44px; padding: 0 18px; border-radius: 10px;
  font-size: 0.88rem; font-weight: 600; cursor: pointer;
  border: 1px solid transparent; text-decoration: none;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
}
.btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
.btn-primary:hover { background: var(--color-primary-hover); }
.btn-primary:active { background: var(--color-primary-active); }
.btn-secondary { background: var(--color-secondary); color: var(--color-on-secondary); }
.btn-secondary:hover { background: var(--color-secondary-hover); }
.btn-accent { background: var(--color-accent); color: var(--color-on-accent); }
.btn-accent:hover { background: var(--color-accent-hover); }
.btn-soft { background: var(--color-primary-soft); color: var(--color-on-primary-soft); }
.btn-outline {
  background: var(--color-surface); color: var(--color-link);
  border-color: var(--color-border-strong);
}
.btn-outline:hover { background: var(--color-primary-soft); }
.btn-ghost { background: transparent; color: var(--color-link); }
.btn-ghost:hover { background: var(--color-primary-soft); }
.btn:disabled, .btn[aria-disabled="true"] { opacity: 0.45; cursor: not-allowed; }
.btn-row { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }

/* ── Badge ─────────────────────────────────────────────────────── */
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 600;
}
.badge-primary { background: var(--color-primary-soft); color: var(--color-on-primary-soft); }
.badge-secondary { background: var(--color-secondary-soft); color: var(--color-on-secondary-soft); }
.badge-accent { background: var(--color-accent-soft); color: var(--color-on-accent-soft); }
.badge-solid { background: var(--color-primary); color: var(--color-on-primary); }

/* ── Warna status ──────────────────────────────────────────────── */
.badge[data-status="danger"] { background: var(--color-danger-soft); color: var(--color-on-danger-soft); }
.badge[data-status="warning"] { background: var(--color-warning-soft); color: var(--color-on-warning-soft); }
.badge[data-status="success"] { background: var(--color-success-soft); color: var(--color-on-success-soft); }
.badge[data-status="info"] { background: var(--color-info-soft); color: var(--color-on-info-soft); }
.btn[data-status-solid="danger"] { background: var(--color-danger); color: var(--color-on-danger); }
.btn[data-status-solid="warning"] { background: var(--color-warning); color: var(--color-on-warning); }
.btn[data-status-solid="success"] { background: var(--color-success); color: var(--color-on-success); }
.btn[data-status-solid="info"] { background: var(--color-info); color: var(--color-on-info); }
.alert {
  border-radius: 10px; padding: 12px 14px; font-size: 0.85rem; max-inline-size: 560px;
}
.alert[data-status="danger"] {
  background: var(--color-danger-soft); color: var(--color-on-danger-soft);
  border-inline-start: 3px solid var(--color-danger);
}

/* ── Seri chart ────────────────────────────────────────────────── */
.chart-row { display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; }
.chart-series { display: flex; flex-direction: column; gap: 6px; }
.chart-bar { display: block; inline-size: 76px; block-size: 76px; border-radius: 8px; }

.tema a.inline-link { color: var(--color-link); text-underline-offset: 3px; }
.tema a.inline-link:hover { color: var(--color-link-hover); }

/* ── Panel gelap (Navbar/Footer/Hero) ──────────────────────────── */
.panel {
  background: var(--color-panel); color: var(--color-on-panel);
  border-radius: 14px; padding: 20px; border: 1px solid var(--color-panel-border);
}
.panel-deep { background: var(--color-panel-strong); }
.panel .muted { color: var(--color-on-panel-muted); }

/* ── Grid token & scale ────────────────────────────────────────── */
.swatch-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); gap: 10px; }
.swatch {
  border: 1px solid var(--color-border); border-radius: 10px; overflow: hidden;
  background: var(--color-surface);
}
.swatch-chip { block-size: 46px; }
.swatch-meta { padding: 7px 9px; font-size: 0.68rem; line-height: 1.35; }
.swatch-name { font-weight: 600; word-break: break-all; }
.swatch-value { color: var(--color-text-muted); font-family: ui-monospace, monospace; }

.ramp { display: flex; border-radius: 10px; overflow: hidden; border: 1px solid var(--color-border); }
.ramp-step { flex: 1; padding: 34px 4px 6px; font-size: 0.6rem; text-align: center;
  font-family: ui-monospace, monospace; }

/* ── Tabel diagnostik ──────────────────────────────────────────── */
table { inline-size: 100%; border-collapse: collapse; font-size: 0.82rem; }
th, td { text-align: left; padding: 8px 10px; border-block-end: 1px solid var(--color-border); }
th { color: var(--color-text-muted); font-weight: 600; font-size: 0.72rem;
  text-transform: uppercase; letter-spacing: 0.05em; }
td.num { font-family: ui-monospace, monospace; text-align: right; }
.pass { color: var(--color-on-secondary-soft); background: var(--color-secondary-soft);
  padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; }
.fail { color: var(--color-on-primary); background: var(--color-primary);
  padding: 2px 8px; border-radius: 999px; font-size: 0.7rem; font-weight: 600; }

.preset-row { display: flex; flex-wrap: wrap; gap: 8px; }
.preset {
  display: inline-flex; align-items: center; gap: 7px; text-decoration: none;
  border: 1px solid var(--color-border-strong); border-radius: 999px;
  padding: 7px 13px; font-size: 0.78rem; font-weight: 500;
  color: var(--color-text); background: var(--color-surface);
}
.preset:hover { background: var(--color-primary-soft); }
.preset-dots { display: inline-flex; }
.preset-dot { inline-size: 12px; block-size: 12px; border-radius: 50%;
  border: 1px solid var(--color-border-strong); margin-inline-start: -4px; }
.preset-dot:first-child { margin-inline-start: 0; }

@media (prefers-reduced-motion: reduce) {
  .btn { transition: none; }
}
`;
