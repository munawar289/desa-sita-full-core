# PRD — Migrasi Design System ke Color Derivation Engine

**Status:** Eksekusi — Fase 0 & 1 selesai, Fase 2 berikutnya
**Tanggal:** 2026-07-22
**Terkait:** [DESIGN.md](../../../DESIGN.md) · [CLAUDE.md](../../../CLAUDE.md) · [2026-07-06-profil-desa-prd.md](2026-07-06-profil-desa-prd.md) (asal skema warna) · [2026-07-02-fe-design.md](2026-07-02-fe-design.md) (asal palet lama)

---

## 1. Ringkasan

Fase 0 sudah menghasilkan color derivation engine yang menurunkan 72 token semantik dari tiga
warna pilihan admin desa, lengkap dengan guardrail WCAG, dan sudah terinjeksi di root layout —
tapi **belum dikonsumsi satu komponen pun**. Situs masih berjalan di atas palet lama
(`kopi-*`, `espresso-*`, `sawah-*`, `kakao-*`, `krem-*`, `panel-*`, `gold-*`, `tanah-*`) yang
tersebar di **94 berkas dengan 781 pemakaian token dan 36 hex literal**. PRD ini merencanakan
pemindahan seluruh situs ke token baru, penghapusan palet lama, dan pembuangan dua kolom warna
yang kehilangan konsumennya — dipecah jadi sembilan fase yang masing-masing bisa hijau berdiri
sendiri.

---

## 2. Latar Belakang

### 2.1 Masalah palet lama

Palet lama lahir dari [fe-design.md](2026-07-02-fe-design.md) sebagai hex tetap untuk satu desa
(Sita), lalu ditambal jadi multitenant di [profil-desa PRD](2026-07-06-profil-desa-prd.md) dengan
`color-mix(in srgb, …)`. Tiga cacat struktural yang tidak bisa ditambal lagi:

1. **`color-mix` di sRGB tidak perceptually uniform.** Langkah mix yang sama menghasilkan kontras
   yang jauh berbeda antar hue — kuning `75% white` jadi nyaris tak terlihat, biru `75% white`
   masih pekat. Setiap desa dengan hue di luar terracotta mendapat tampilan yang lebih buruk.
2. **Tidak ada `--color-on-primary`.** `--primary-foreground` dihardcode `#ffffff`, sehingga
   kontras teks tombol bergantung sepenuhnya pada disiplin admin. Ini yang memaksa lahirnya
   guard `LUMINANCE_MAX = 0.75` di validasi — solusi yang **menolak input** alih-alih
   memperbaikinya.
3. **Warna default sendiri melanggar WCAG.** Terracotta `#c1602a` + teks putih = **4.23:1**,
   di bawah ambang AA 4.5. Situs yang berjalan hari ini gagal AA di setiap tombol utamanya.

### 2.2 Kenapa sekarang murah

- **Belum launching.** Belum ada desa produksi yang akan terganggu oleh pergeseran warna.
- **Engine-nya sudah jadi dan terverifikasi** (Fase 0), jadi pekerjaan tersisa murni mekanis:
  menukar nama kelas. Tidak ada lagi yang perlu dirancang.
- **Palet lama masih terpusat.** 781 pemakaian terdengar banyak, tapi semuanya kelas Tailwind
  dengan pola yang seragam — bisa dikerjakan per-area dan diverifikasi per-area.
- **Menunda berarti membayar dua kali.** Setiap komponen baru yang ditulis sebelum migrasi akan
  memakai palet lama dan harus dimigrasi juga.

### 2.3 Temuan yang mengubah urutan fase

Rencana awal di [DESIGN.md §8](../../../DESIGN.md) menaruh "registrasi Tailwind" dan "migrasi
komponen" sebagai dua langkah terpisah yang bisa berjalan paralel. **Itu salah.**

Shim transisi di `globals.css` (`body { --color-primary: var(--primary); … }`) membuat isi halaman
tetap melihat *arti lama* dari empat nama token yang bertabrakan. Selama shim itu ada, komponen
yang dimigrasi ke `bg-primary` akan mendapat **nilai lama**, bukan keluaran engine. Jadi shim
harus dibuang **sebelum** migrasi komponen dimulai, bukan sesudah.

Konsekuensinya, ada satu langkah yang jauh lebih efisien daripada yang direncanakan: karena
seluruh komponen `src/components/ui/` (shadcn) mengonsumsi warna lewat variabel perantara
(`--primary`, `--border`, `--muted`, …) di blok `:root`, **menyambungkan blok itu ke token engine
memigrasikan 12 komponen primitif sekaligus tanpa menyentuh satu berkas komponen pun.** Itu jadi
Fase 1.

---

## 3. Keputusan yang Sudah Diambil

| Kode | Keputusan | Alasan |
|---|---|---|
| **K1** | Engine bersumber dari **3 slot**: `warna_primer`, `warna_sekunder`, `warna_aksen` | Tiga warna cukup untuk seluruh sistem; lebih banyak slot berarti lebih banyak cara admin merusak tampilan |
| **K2** | Palet lama **dihapus total**, 94 berkas dimigrasi — bukan dijadikan alias | Alias menyisakan dua sistem warna yang harus dirawat bersamaan dan tidak pernah benar-benar dibuang |
| **K3** | Kolom `warna_latar_gelap` & `warna_latar` **di-drop** | Kehilangan konsumen setelah K4; latar halaman kini diturunkan dari netral ber-tint |
| **K4** | Panel gelap (Navbar/Footer/Hero) = **shade gelap warna primer** | Area paling menonjol halaman tetap membawa identitas desa |
| **K5** | `LUMINANCE_MAX = 0.75` dibiarkan di Fase 0, dilonggarkan di fase akhir | Melonggarkannya lebih awal membuka input yang belum ada guardrail-nya di komponen |
| **K6** | Token diserialisasi **hex sRGB**, bukan `oklch()` CSS | Perhitungan perseptual selesai di server; WebView lama di HP kelas bawah tetap dapat warna identik |
| **K7** | Injeksi lewat **inline style `<html>`** (mekanisme existing) | Tidak mengubah alur backend; mempertahankan trik spesifisitas yang sudah terdokumentasi |
| **K8** | Shim `body { … }` dipasang di Fase 0 agar tampilan tidak bergeser | Fase 0 diminta tidak mengubah tampilan apa pun |
| **K9** | Registrasi token lewat blok `@theme` dengan **nilai default statis** | Tanpa default, `/platform` dan `/set-password` — yang tidak menginjeksi tema tenant — kehilangan seluruh warna |
| **K10** | Netral **dihangatkan**: `MAX_NEUTRAL_CHROMA` 0.012 → 0.020, bobot chroma diperbesar di ujung terang | Chroma yang sama jauh lebih tak terlihat pada lightness tinggi; tanpa ini situs kehilangan karakter "kertas hangat" (S2) |
| **K11** | Chroma panel gelap **diredam ke 75%** | Panel `#4f1d00` 2,4× lebih berwarna dari palet lama; diredam ke `#4a210b` agar tetap membawa identitas desa tanpa menyala (S2b) |
| **K12** | Token status **tetap**, hue dipatok, tidak diturunkan dari tenant | Makna merah/hijau universal — desa berprimer hijau tidak boleh punya pesan galat hijau (S3) |
| **K13** | Seri chart diambil dari **scale yang sudah ada**, bukan hue baru | Tidak pernah memunculkan warna yang tak pernah dipilih admin (S4) |
| **K14** | `/platform` → palet `plat-*`; `/set-password` → token baru dengan default | Panel landlord harus terlihat berbeda dari situs desa dan tidak boleh ikut berganti warna per tenant (S5) |
| **K15** | Blok `.dark` **dihapus** | Kode mati (kelas `dark` tidak pernah dipasang); setelah palet lama dibuang ia mereferensi token yang maknanya berubah (S6) |
| **K16** | Nilai 2 kolom **diarsipkan** sebelum `drop column` | Menghilangkan satu-satunya langkah tak-terbalikkan di seluruh rencana (S7) |

---

## 4. Keputusan Terbuka yang Sudah Dijawab

Ketujuh pertanyaan dijawab 2026-07-22, seluruhnya mengikuti rekomendasi. Bagian ini menyimpan
**nilai konkret yang harus diimplementasikan** beserta trade-off yang secara sadar diterima.

### S1 → K9 · Token didaftarkan di blok `@theme`

Token tersedia sebagai utility Tailwind normal (`bg-primary`, `text-text-muted`,
`border-border-strong`), dengan nilai default statis di `globals.css`.

*Trade-off yang diterima:* nilai default tertulis dua kali (engine + `globals.css`) dan bisa basi
kalau rumus engine berubah. **Wajib** disertai skrip pembanding terhadap
`deriveTheme(DEFAULT_THEME_SLOTS)` — lihat AC2.

### S2 → K10 · Netral dihangatkan

Di [`src/lib/theme/scale.ts`](../../../src/lib/theme/scale.ts):

- `MAX_NEUTRAL_CHROMA`: `0.012` → **`0.020`**
- `NEUTRAL_TINT_FROM_BRAND`: `0.09` → **`0.16`**
- `NEUTRAL_RAMP` diberi bobot chroma lebih besar di ujung terang, karena pada lightness tinggi
  chroma yang sama jauh lebih tidak terlihat:

| Step | l | chromaFactor |
|---|---|---|
| 50 | 0.982 | 0.85 |
| 100 | 0.958 | 1.00 |
| 200 | 0.912 | 1.10 |
| 300 | 0.860 | 1.00 |
| 400 | 0.722 | 0.80 |
| 500 | 0.604 | 0.66 |
| 600 | 0.502 | 0.58 |
| 700 | 0.408 | 0.52 |
| 800 | 0.314 | 0.46 |
| 900 | 0.232 | 0.40 |

Hasil untuk tema default, dibandingkan keadaan sekarang dan palet lama:

| Token | Palet lama | Sebelum K10 | **Setelah K10** |
|---|---|---|---|
| `--color-surface` | `#ffffff` | `#fefbfa` | **`#fff7f4`** |
| `--color-surface-alt` | `#f5efe2` (C 0.0184) | `#f9f5f3` (C 0.0051) | **`#fdede6` (C 0.0200)** |
| `--color-border` | `#e2d8c3` | `#ece6e3` | **`#efded6`** |
| `--color-text` | `#2a2118` | `#221d1b` | **`#211c1a`** |
| `--color-text-muted` | `#5c4f3f` | `#6c6460` | **`#6a625e`** |

Kontras terverifikasi tetap lolos: `text`/`surface` **15,95** · `text-muted`/`surface` **5,66**.

*Trade-off yang diterima:* tint mengikuti hue tenant, jadi desa berwarna dingin (biru, ungu)
mendapat latar yang sedikit kebiruan alih-alih putih bersih. Itu memang tujuannya — terracotta
menghasilkan krem-peach, olive menghasilkan krem-sage.

### S2b → K11 · Chroma panel gelap diredam ke 75%

| Token | Palet lama | Sebelum K11 | **Setelah K11** |
|---|---|---|---|
| `--color-panel` | `#3d2a1d` (C 0.036) | `#4f1d00` (C 0.085) | **`#4a210b`** |
| `--color-panel-strong` | `#2e1f16` | `#2c0d00` | **`#2c0d00`** |

*Trade-off yang diterima:* identitas warna desa di Navbar/Footer sedikit lebih kalem daripada yang
K4 izinkan. Imbalannya panel tidak pernah menyala untuk desa berwarna jenuh.

### S3 → K12 · Token status tetap, hue dipatok

Tambahkan ke engine: `--color-danger`, `--color-warning`, `--color-success`, `--color-info`,
masing-masing beserta `-soft`, `on-*`, dan `on-*-soft`. Hue dipatok — **tidak** diturunkan dari
tenant — sementara lightness & chroma tetap melewati guardrail G1–G3 sehingga kontrasnya dijamin:

| Token | Hue |
|---|---|
| `--color-danger` | ~25° (merah) |
| `--color-warning` | ~85° (kuning) |
| `--color-success` | ~145° (hijau) |
| `--color-info` | ~250° (biru) |

`--destructive` milik shadcn dipetakan ke `--color-danger`.

*Trade-off yang diterima:* payload naik ~12 custom property (~350 byte).

### S4 → K13 · Seri chart dari scale yang ada

| Token | Sumber | Nilai tema default |
|---|---|---|
| `--color-chart-1` | `primary-600` | `#bf5f28` |
| `--color-chart-2` | `secondary-600` | `#6a8950` |
| `--color-chart-3` | `accent-600` | `#a47400` |
| `--color-chart-4` | `primary-300` | `#fcb592` |
| `--color-chart-5` | `secondary-300` | `#b9d1a8` |

*Trade-off yang diterima:* desa yang memilih tiga warna berdekatan (mis. tiga nuansa hijau) akan
sulit membedakan kelima seri. Mitigasinya bukan warna melainkan label langsung pada chart —
pekerjaan terpisah, tidak masuk lingkup PRD ini. AC6 menguji batas ini.

### S5 → K14 · `/platform` ke `plat-*`, `/set-password` ke token default

`/platform` (39 pemakaian palet lama) dimigrasi ke palet `plat-*` Material 3 yang sudah lengkap di
`globals.css`. `/set-password` (7 pemakaian) ke token baru memakai nilai default dari K9.

*Trade-off yang diterima:* dua sistem warna dirawat terpisah. Itu memang sudah kondisinya sekarang
dan disengaja — panel landlord tidak boleh berganti warna mengikuti desa yang kebetulan diakses.

### S6 → K15 · Blok `.dark` dihapus

Dihapus di Fase 7 bersama palet lama. Dark mode **tidak** dibangun ulang dalam lingkup PRD ini.

*Trade-off yang diterima:* kalau dark mode dibuat nanti, harus ditulis dari nol. Itu justru lebih
baik daripada mewarisi blok abu-abu bawaan shadcn yang tidak terhubung tema tenant sama sekali.

### S7 → K16 · Arsipkan sebelum `drop column`

Migration `0015_arsip_warna_latar.sql` menyalin kedua kolom ke `desa_profil_warna_arsip`
(`tenant_id`, `kolom`, `nilai`, `dicatat_pada`) sebelum `0016_drop_warna_latar.sql` menjalankan
`drop`. Keduanya dijalankan sebagai fase terakhir.

*Trade-off yang diterima:* satu tabel yang kemungkinan besar tidak pernah dibaca. Biayanya nyaris
nol dan menghilangkan satu-satunya langkah tak-terbalikkan di seluruh rencana ini.

---

## 5. Non-Tujuan

Yang **sengaja tidak** dikerjakan dalam rencana ini:

1. **Redesign tata letak atau copy.** Ini migrasi token warna. Struktur halaman, hierarki, dan
   teks tidak disentuh. Perubahan tampilan yang terjadi murni akibat pergantian nilai warna.
2. **Menambah fitur atau mock data baru.** Tidak ada hero slider, testimoni, atau statistik baru.
3. **Mengubah alur backend selain K3.** Routes, controllers, services, RLS, resolusi tenant,
   middleware, dan auth tidak berubah.
4. **Menerapkan tipografi/spacing/pattern dari DESIGN.md.** Type scale 17px, pola anyaman, dan
   aturan elevasi didokumentasikan tapi penerapannya adalah pekerjaan terpisah setelah warna beres.
5. **Dark mode.** Lihat S6 — dihapus, bukan diimplementasikan.
6. **Menyatukan `/platform` dengan tema tenant.** Lihat S5.
7. **Mengubah `components.json` atau meng-upgrade shadcn.** Primitif yang ada dipakai apa adanya.

---

## 6. Blast Radius

### Fase 1 — Jembatan shadcn & registrasi token

| Berkas | Yang berubah |
|---|---|
| `src/app/globals.css` | Blok `:root` shadcn dipetakan ke token engine; blok `@theme` baru berisi default 72+ token; **shim `body { … }` dihapus** |
| `src/lib/theme/scale.ts` | `MAX_NEUTRAL_CHROMA` → 0.020, `NEUTRAL_TINT_FROM_BRAND` → 0.16, `NEUTRAL_RAMP` baru (K10); chroma panel × 0.75 (K11) |
| `src/lib/theme/tokens.ts` | 4 token status hue-dipatok (K12) + `--color-chart-1…5` (K13) |
| `src/lib/theme/css.ts` | Serialisasi token baru |
| `src/app/dev/tema/*` | Tampilkan token status & chart |
| `DESIGN.md` | Perbarui nilai contoh, G4 (chroma netral 0.012 → 0.020), dan §2.5 warna status |

Tidak ada berkas komponen yang disentuh. 12 primitif di `src/components/ui/` ikut berpindah lewat
jembatan `:root`.

### Fase 2 — Layout & shared (10 berkas, 78 pemakaian)

| Berkas | Yang berubah |
|---|---|
| `src/components/layout/Navbar.tsx` | 22 pemakaian → `--color-panel`, `--color-on-panel`, `--color-accent-400` untuk penanda aktif |
| `src/components/layout/Footer.tsx` | 13 → `--color-panel-strong`, `--color-on-panel-muted` |
| `src/components/layout/PageHeader.tsx` | 4 → `--color-panel`, `--color-on-panel` |
| `src/components/shared/StatCard.tsx` | 8 → `--color-surface`, `--color-border`, `--color-text-muted` |
| `src/components/shared/BadgeKategori.tsx` | 8 → varian badge DESIGN.md §6.3 |
| `src/components/shared/ErrorState.tsx` | 7 → token status (S3) |
| `src/components/shared/SectionHeader.tsx` | 4 → `--color-text`, eyebrow `--color-text-muted` |
| `src/components/shared/BreadcrumbNav.tsx` | 3 → `--color-link`, `--color-text-muted` |
| `src/components/shared/EmptyState.tsx` | 3 → `--color-surface-alt`, `--color-text-muted` |
| `src/components/shared/DataUpdatedAt.tsx` | 1 → `--color-text-muted` |

### Fase 3 — Halaman & komponen publik (24 berkas, 148 pemakaian)

| Berkas | Yang berubah |
|---|---|
| `src/components/beranda/HeroSection.tsx` | 24 → `--color-panel-strong` + blob dekoratif dari scale |
| `src/components/beranda/PotensSection.tsx` | 12 → card & badge |
| `src/components/beranda/StatistikOverview.tsx` | 4 → angka `--color-text`, label muted |
| `src/components/pengaduan/FormPengaduan.tsx` | 14 → input `--color-border-strong`, galat token status |
| `src/components/data-desa/IndeksProdeskelWidget.tsx` | 14 → scale primer untuk tingkat indeks |
| `src/components/lembaga/LembagaExplorer.tsx` | 11 → card, filter chip |
| `src/components/pemerintahan/AparaturCard.tsx` | 6 → card & avatar |
| `src/components/pemerintahan/StrukturOrganisasi.tsx` | 2 → garis hubung `--color-border` |
| `src/app/(site)/layanan/page.tsx` | 14 → card layanan |
| `src/app/(site)/data-desa/**` (12 berkas) | 35 → heading, card, tabel; 2 hex di `kesehatan/page.tsx` |
| `src/app/(site)/profil-desa/**` (3 berkas) | 12 → heading & prose |
| `src/app/(site)/page.tsx` | 6 → section wrapper |
| `src/app/(site)/rencana-pengembangan/page.tsx` | 4 → timeline |
| `src/app/(site)/layout.tsx` | 1 → `bg-background text-espresso-800` → token baru |

### Fase 4 — Chart (9 berkas, 13 pemakaian + 34 hex)

| Berkas | Yang berubah |
|---|---|
| `charts/BarChartStatistik.tsx` | 7 hex → `--color-chart-*` |
| `charts/BarChartPendidikan.tsx` | 7 hex → `--color-chart-*` |
| `charts/BarChartKelompokUmur.tsx` | 6 hex → `--color-chart-*` |
| `charts/BarChartRt.tsx` | 6 hex → `--color-chart-*` |
| `charts/BarChartRtGrouped.tsx` | 5 hex → `--color-chart-*` |
| `charts/PieChartGender.tsx` | 3 hex + 2 token |
| `charts/CardSaranaPrasarana.tsx` | 4 token → card |
| `statistik/StatTable.tsx` | 7 token → stripe & border tabel |
| `statistik/StatCardGrid.tsx` | wrapper grid, cek ulang |

Recharts menerima warna lewat prop JS, bukan kelas CSS — nilainya harus dibaca dari CSS variable
di runtime atau dioper dari server. Perlu keputusan implementasi saat fase ini dikerjakan.

### Fase 5 — Admin (40 berkas, 481 pemakaian)

| Kelompok | Berkas | Yang berubah |
|---|---|---|
| Form tambah | `Add*.tsx` (9) | ~54 → input `--color-border-strong`, tombol primer |
| Baris tabel | `*Row.tsx` (10) | ~75 → stripe, aksi ghost, tombol hapus token status |
| Layout admin | `AdminSidebar.tsx`, `AdminTopbar.tsx` | ~30 → panel gelap |
| Form & kartu | `DesaProfilForm.tsx`, `WilayahInfoCard.tsx`, `EmptyWilayahInfoCard.tsx`, `StatistikGroupedList.tsx`, `StatistikSektorUsahaTabs.tsx`, `LoginForm.tsx`, `DeleteEntityButton.tsx`, `DeleteStatistikButton.tsx` | ~120 |
| Halaman | `src/app/(site)/admin/**` (11) | 151 |

Fase paling besar. **Wajib dipecah jadi beberapa PR** — lihat S6 roadmap.

### Fase 6 — Platform & set-password (8 berkas, 46 pemakaian)

| Berkas | Yang berubah |
|---|---|
| `src/app/platform/**` (4) | 30 → palet `plat-*` (S5) |
| `src/components/platform/**` (2) | 9 → palet `plat-*` |
| `src/app/set-password/**` (2) | 7 → token baru dengan nilai default |

### Fase 7 — Pembersihan

| Berkas | Yang berubah |
|---|---|
| `src/app/globals.css` | Hapus blok `@theme` palet lama (27 baris), hapus blok `.dark` (32 baris), hapus `::selection` hex, hapus `.text-gradient-kopi` bila tak terpakai |

### Fase 8 — Drop kolom

| Berkas | Yang berubah |
|---|---|
| `supabase/migrations/0015_arsip_warna_latar.sql` | **Baru** — salin nilai ke tabel arsip (S7) |
| `supabase/migrations/0016_drop_warna_latar.sql` | **Baru** — `drop column`, dengan `down()` yang mengembalikan kolom + default |
| `src/lib/supabase/database.types.ts` | Hapus 2 field dari Row/Insert/Update |
| `src/lib/data/desa-profil.ts` | Hapus 2 field dari type & mock |
| `src/lib/queries/desa-profil.ts` | Hapus 2 kolom dari `select` |
| `src/lib/validation/desa-profil.ts` | Hapus `warna_latar_gelap`, `warna_latar`, dan helper `warnaLatarField` |
| `src/lib/actions/desa-profil.ts` | Hapus 2 field dari parsing FormData |
| `src/components/admin/DesaProfilForm.tsx` | Hapus 2 slot dari `WARNA_SLOTS` & state |
| `src/app/(site)/layout.tsx` | Hapus 2 var dari injeksi |
| `supabase/seed.sql` | Sesuaikan seed |

### Fase 9 — Longgarkan validasi

| Berkas | Yang berubah |
|---|---|
| `src/lib/validation/desa-profil.ts` | Hapus `LUMINANCE_MAX` & `relativeLuminance`; sisakan validasi format hex |
| `src/components/admin/DesaProfilForm.tsx` | Perbarui teks bantuan tiap slot sesuai peran barunya |

---

## 7. Roadmap Implementasi

Legenda: `[ ]` belum · `[~]` jalan · `[x]` selesai & terverifikasi

### `[x]` Fase 0 — Fondasi *(selesai 2026-07-22)*

- [x] Engine OKLCH + guardrail G1–G4 — `src/lib/theme/`
- [x] Injeksi 72 token per tenant di root layout `(site)` — K7
- [x] Shim `body { … }` agar tampilan tidak bergeser — K8
- [x] Halaman preview `/dev/tema` dengan 7 preset ekstrem
- [x] DESIGN.md
- [x] Verifikasi: `tsc` bersih, `lint` bersih, `build` 42/42, 10 lolos / 0 gagal kontras pada 4 skenario warna

### `[x]` Fase 1 — Jembatan shadcn, token status & chart, buang shim *(selesai 2026-07-22)* → **AC1, AC2, AC7**

- [x] Hangatkan netral: knob + `NEUTRAL_RAMP` baru di `scale.ts` (K10, tabel di §4 S2)
- [x] Redam chroma panel ke 75% (K11) — hasil `#472310`
- [x] Tambah 4 token status dengan hue dipatok (K12)
- [x] Tambah `--color-chart-1…5` (K13)
- [x] Blok `@theme static` berisi default seluruh 93 token (K9)
- [x] Petakan blok `:root` shadcn ke token engine (tabel di bawah)
- [x] **Hapus shim `body { … }`**
- [x] Skrip penjaga sinkronisasi `npm run theme:check` / `theme:sync` → AC2
- [x] Perbarui DESIGN.md: nilai contoh, G4, §2.5 warna status, §2.6 seri chart, §8
- [x] Perbarui `/dev/tema`: bagian warna status, seri chart, dan 8 baris kontras status
- [x] Verifikasi: `theme:check` 93 token sinkron, `tsc` bersih, `lint` bersih, `build` 42/42

#### Penyimpangan dari rencana: tabel pemetaan direvisi

Tabel pemetaan versi rencana **tidak bisa dijalankan apa adanya.** Ia memetakan `--secondary` →
`--color-surface-alt` dan `--accent` → `--color-primary-soft`, padahal engine sudah memiliki
`--color-secondary` dan `--color-accent` di namespace `--color-*` milik Tailwind. Begitu shim
dibuang, utility `bg-secondary`/`bg-accent` **pasti** resolve ke token engine — persis tabrakan
yang selama ini ditutupi shim. Dua nama itu tidak bisa punya dua arti sekaligus.

Diputuskan 2026-07-22: **engine yang menang**, karena DESIGN.md §2.3 sudah mendokumentasikan
kedua nama itu sebagai warna tenant dan 94 berkas berikutnya akan memakainya.

| Variabel shadcn | → token engine | Catatan |
|---|---|---|
| `--background` | `--color-surface-alt` | |
| `--foreground` | `--color-text` | |
| `--card`, `--popover` | `--color-surface` | |
| `--card-foreground`, `--popover-foreground` | `--color-text` | |
| `--primary` | `--color-primary` | |
| `--primary-foreground` | `--color-on-primary` | |
| `--secondary` | `--color-secondary` | **Direvisi** — warna sekunder tenant; `Button`/`Badge` varian `secondary` jadi persis tombol sekunder DESIGN.md §6.1 |
| `--secondary-foreground` | `--color-on-secondary` | **Direvisi** |
| `--muted` | `--color-surface-alt` | |
| `--muted-foreground` | `--color-text-muted` | |
| ~~`--accent`~~ | — | **Dihapus.** `bg-accent` kini berarti warna aksen tenant. Satu-satunya pemakainya, `ui/select.tsx`, diubah ke `bg-primary-soft`/`text-on-primary-soft` |
| ~~`--accent-foreground`~~ | — | **Dihapus**, ikut di atas |
| `--destructive` | `--color-danger` | |
| `--border` | `--color-border` | |
| `--input` | `--color-border-strong` | Naik pekat, sesuai WCAG 1.4.11 |
| `--ring` | `--color-focus-ring` | |
| `--chart-1…5` | `--color-chart-1…5` | |
| `--sidebar*` | `--color-surface`/`-text`/`-primary`/`-border` | |

Konsekuensi lain: Fase 1 menyentuh **satu** berkas komponen (`ui/select.tsx`, 1 baris), bukan nol
seperti yang direncanakan.

### `[x]` Fase 2 — Layout & shared *(selesai 2026-07-22)* → **AC3, AC4, AC5**

- [x] `layout/` — Navbar, Footer, PageHeader
- [x] `shared/` — 7 berkas
- [x] Penanda nav aktif tidak lagi bergantung warna saja: garis bawah `accent-400` di desktop,
      bilah kiri + `font-semibold` di mobile, plus `aria-current="page"`
- [x] Verifikasi: `grep` palet lama di `layout/` & `shared/` = 0, `tsc`/`lint` bersih,
      `build` 42/42, utility baru terkonfirmasi ada di CSS terkompilasi

Tiga keputusan yang diambil saat eksekusi:

| | Keputusan | Alasan |
|---|---|---|
| **E1** | `BadgeKategori` ganti nama varian: `kopi/sawah/tanah` → `primer/sekunder/aksen`, tambah `solid` | Nama varian ikut palet lama; setelah palet dibuang namanya jadi omong kosong. Ikut DESIGN.md §6.3. Menyentuh 2 pemanggil di luar lingkup fase (`rencana-pengembangan/page.tsx`, `statistik/StatTable.tsx`) — 1 kata per berkas, tak terhindarkan supaya kode tetap kompilasi |
| **E2** | `PageHeader` jadi latar **rata** `--color-panel`, bukan gradient `kopi-600 → panel-800` | `--color-on-panel` dipilih engine berdasarkan kontras terhadap `--color-panel`; begitu latarnya menyapu ke shade lain, kontras teksnya tidak lagi dijamin untuk warna desa apa pun |
| **E3** | Tombol "Coba Lagi" di `ErrorState` jadi varian **netral** (§6.1 outline), bukan berwarna danger | `--color-danger` dijamin 3:1 terhadap surface (batas komponen), bukan 4.5:1 (teks). Makna galat sudah dibawa ikon + kalimatnya |

### `[ ]` Fase 3 — Halaman & komponen publik → **AC3, AC4, AC5**

Dipecah jadi 3 PR agar tiap PR bisa direview dengan mata:

- [x] **3a** — Beranda (`beranda/` + `app/(site)/page.tsx` + `app/(site)/layout.tsx`) *(selesai 2026-07-22)*
- [ ] 3b — Data desa (`data-desa/` + 12 halaman `app/(site)/data-desa/**`)
- [ ] 3c — Profil, pemerintahan, lembaga, layanan, rencana

Keputusan tambahan di 3a:

| | Keputusan | Alasan |
|---|---|---|
| **E4** | Varian `Button` diperbaiki di `ui/button.tsx`: `hover:bg-primary/80` → `hover:bg-primary-hover`, `destructive` → `bg-danger-soft`/`text-on-danger-soft`, `link` → `text-link` | `bg-primary/80` menerangkan tombol dengan mencampurnya ke latar halaman, sehingga `on-primary` bisa jatuh di bawah AA justru saat tombol disentuh. Primitif adalah lapisan yang benar untuk memperbaikinya — kalau tidak, tiap pemanggil harus menambalnya sendiri |
| **E5** | `.text-gradient-kopi` → `.text-gradient-brand`, kedua ujungnya dari step **300** | Judul Hero dipakai di atas panel gelap. Step 300 sama-sama terang untuk hue apa pun, jadi teksnya terbaca berapa pun warna desa. Rencana semula membuang utility ini di Fase 7; ternyata masih terpakai |
| **E6** | Pita ajakan di beranda jadi `bg-secondary` rata, bukan gradient `sawah-700 → panel-800` | Sama seperti E2 — `on-secondary` dipilih engine lewat kontras terhadap `secondary` saja |
| **E7** | Ubin ikon `PotensSection` pakai gradient `primary → primary-active` | Keduanya sisi gelap warna yang sama, jadi `on-primary` tetap terbaca di seluruh sapuan gradient. Ini pengganti yang aman untuk gradient lintas-skala `kopi-600 → kopi-400` |

### `[ ]` Fase 4 — Chart → **AC4, AC6**

- [ ] Putuskan cara mengoper warna ke Recharts (baca CSS var di runtime vs oper dari server) — satu-satunya keputusan implementasi yang tersisa
- [ ] 6 berkas chart + `StatTable` + `StatCardGrid` + `CardSaranaPrasarana`
- [ ] Verifikasi: seri masih bisa dibedakan pada preset "Hijau neon" dan "Abu-abu"

### `[ ]` Fase 5 — Admin → **AC3, AC4, AC5**

Dipecah jadi 4 PR:

- [ ] 5a — Layout admin (`AdminSidebar`, `AdminTopbar`, `LoginForm`)
- [ ] 5b — Form tambah (`Add*.tsx`, 9 berkas)
- [ ] 5c — Baris tabel & aksi (`*Row.tsx`, tombol hapus, 12 berkas)
- [ ] 5d — Halaman admin (11 berkas) + `DesaProfilForm`, `WilayahInfoCard`, dkk

### `[ ]` Fase 6 — Platform & set-password → **AC3, AC8**

- [ ] `/platform` → palet `plat-*` (K14)
- [ ] `/set-password` → token baru dengan default
- [ ] Verifikasi: `/platform` tidak berubah warna saat diakses dari host desa manapun

### `[ ]` Fase 7 — Pembersihan → **AC7, AC9**

- [ ] Hapus blok `@theme` palet lama
- [ ] Hapus blok `.dark` (K15)
- [ ] Hapus `::selection` hex & utility warna sisa
- [ ] Verifikasi: `grep` untuk `espresso-|kopi-|kakao-|krem-|sawah-|tanah-|gold-|panel-` menghasilkan **0** di `src/`

### `[ ]` Fase 8 — Drop kolom → **AC10**

- [ ] Migration arsip `0015_arsip_warna_latar.sql` (K16)
- [ ] Migration `drop column` dengan `down()` terisi
- [ ] Bersihkan type, query, validation, action, form admin, seed, layout
- [ ] Verifikasi: buat tenant baru dari `/platform`, pastikan profil tersimpan tanpa 2 kolom itu

### `[ ]` Fase 9 — Longgarkan validasi → **AC11**

- [ ] Hapus `LUMINANCE_MAX` & `relativeLuminance` dari validasi
- [ ] Perbarui teks bantuan slot warna di form admin
- [ ] Verifikasi: admin bisa menyimpan `#ffd400`, dan tombol utama tetap lolos AA

---

## 8. Acceptance Criteria

1. **AC1** — Seluruh token yang didokumentasikan di DESIGN.md §2.3 tersedia sebagai utility
   Tailwind, dan `bg-primary` pada tema default menghasilkan `#9e4814` (keluaran engine), bukan
   `#c1602a` (warna mentah).
2. **AC2** — Nilai default di blok `@theme` identik dengan keluaran
   `deriveTheme(DEFAULT_THEME_SLOTS)`; ada pemeriksaan otomatis yang gagal kalau keduanya
   menyimpang.
3. **AC3** — `grep -rE "espresso-|kopi-|kakao-|krem-|sawah-|tanah-|gold-|panel-" src/` menghasilkan
   **0 hasil** setelah Fase 7.
4. **AC4** — `grep -rE "#[0-9a-fA-F]{6}" src/components src/app` menghasilkan **0 hasil** di luar
   `src/lib/theme/`, `src/app/dev/`, dan blok palet `plat-*` di `globals.css`.
5. **AC5** — Untuk ketujuh preset di `/dev/tema`, setiap halaman publik dan halaman admin lolos
   kontras WCAG AA: teks normal ≥ 4.5:1, batas kontrol form ≥ 3:1.
6. **AC6** — Pada preset "Hijau neon" dan "Abu-abu", kelima seri chart tetap bisa dibedakan satu
   sama lain, dan keempat warna status tetap terbaca sebagai merah/kuning/hijau/biru apa pun warna tenant.
7. **AC7** — Shim `body { … }` dan blok `.dark` tidak lagi ada di `globals.css`, dan tidak ada
   variabel CSS yang didefinisikan di dua tempat dengan arti berbeda.
8. **AC8** — `/platform` menampilkan warna yang identik apa pun host yang diakses, dan tidak
   memanggil `getDesaProfil()`/`getCurrentTenant()`.
9. **AC9** — `npm run build` hijau, `tsc --noEmit` bersih, `npm run lint` bersih di setiap akhir fase.
10. **AC10** — Setelah Fase 8, `desa_profil` tidak lagi punya kolom `warna_latar_gelap` dan
    `warna_latar`; membuat tenant baru dari `/platform` tetap berhasil; `down()` migration
    mengembalikan kolom beserta default-nya.
11. **AC11** — Setelah Fase 9, admin bisa menyimpan `warna_primer = #ffd400`, dan tombol utama yang
    dihasilkan tetap lolos AA (`--color-primary` = `#796300`, `--color-on-primary` = near-white).
12. **AC12** — Tidak ada perubahan pada routes, middleware, resolusi tenant, RLS, atau alur auth di
    seluruh fase.

---

## 9. Risiko

| Risiko | Mitigasi |
|---|---|
| **Migrasi 94 berkas menghasilkan regresi visual yang tidak terdeteksi** | Pecah per-area jadi 12 PR kecil; tiap PR direview dengan membuka halaman terkait di `next dev`; `/dev/tema` dipakai untuk memeriksa preset ekstrem sebelum merge |
| **Nilai default di `@theme` basi terhadap rumus engine** | AC2: skrip pembanding yang gagal saat menyimpang (K9) |
| **Situs kehilangan kehangatan dan terasa seperti template generik** | K10/K11 dikerjakan di Fase 1, sehingga seluruh migrasi memakai netral & panel yang sudah benar — bukan diperbaiki belakangan saat 94 berkas sudah terlanjur |
| **`drop column` menghapus preferensi warna tenant secara permanen** | K16: tabel arsip + jalankan sebagai fase terakhir setelah verifikasi produksi |
| **Recharts tidak bisa membaca CSS variable** | Diputuskan eksplisit di Fase 4 sebelum menyentuh berkas; opsi cadangan: oper hex dari server component yang sudah punya hasil `deriveTheme()` |
| **Fase 5 (admin, 481 pemakaian) terlalu besar dan mandek** | Dipecah jadi 4 PR dengan batas yang jelas; admin bukan halaman publik sehingga regresi kecil tidak terlihat warga |
| **`/platform` kehilangan warna karena tidak menginjeksi tema** | K9 (default di `@theme`) + K14 (migrasi ke `plat-*`); AC8 menguji ini eksplisit |
| **Palet lama kembali dipakai oleh kode baru selama migrasi berjalan** | Setelah Fase 1, tambahkan aturan ESLint atau pemeriksaan CI yang menolak kelas palet lama pada berkas yang sudah dimigrasi |
| **Perubahan warna dianggap bug oleh pemangku kepentingan** | Dokumentasikan di PR Fase 1 bahwa terracotta bergeser `#c1602a` → `#9e4814` karena warna lama gagal WCAG AA (4.23:1), dengan tangkapan layar sebelum/sesudah |
