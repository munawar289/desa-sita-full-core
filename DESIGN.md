# DESIGN.md — Sistem Desain Website Desa

**Status:** Aktif · **Tanggal:** 2026-07-22
**Terkait:** [CLAUDE.md](CLAUDE.md) · `src/lib/theme/` (color derivation engine) · `/dev/tema` (preview token)

---

## 1. Arah Desain

**"Desa Indonesia yang modern."** Hangat, membumi, dipercaya warga — tapi bersih dan kontemporer.

Tiga hal yang harus terasa saat halaman dibuka:

1. **Ini desa saya.** Foto asli, nama tempat asli, bahasa yang dipakai sehari-hari.
2. **Ini bisa dipercaya.** Data rapi, tanggal jelas, tidak ada klaim kosong.
3. **Ini gampang.** Warga 60 tahun dengan HP layar 5 inci bisa menemukan yang dicarinya.

Yang **bukan** kita: template pemerintahan kaku (garis biru, logo besar, tabel padat), dan SaaS
dashboard generik (gradient ungu, ilustrasi 3D, jargon).

### Masalah khas sistem desain ini

Warna adalah **variabel per-tenant** — tiap desa memilih tiga warnanya sendiri dari panel admin.
Jadi identitas visual TIDAK boleh bergantung pada warna. Yang membangun identitas adalah elemen
yang **konstan**: tipografi, spacing, radius, pola tekstur, gaya foto, gaya ikon, dan anatomi
komponen. Warna hanya memberi *nada*, bukan *karakter*.

---

## 2. Color System

### 2.1 Prinsip

Admin desa memilih **tiga warna**: utama, sekunder, aksen (kolom `warna_primer`,
`warna_sekunder`, `warna_aksen` di tabel `desa_profil`). Semua warna lain di seluruh situs
**dihitung** dari ketiganya oleh color derivation engine di [`src/lib/theme/`](src/lib/theme/),
lalu diinjeksikan sebagai CSS custom properties di elemen `<html>` root layout.

> **Aturan mutlak.** Jangan pernah menulis nilai warna di komponen — tidak hex, tidak
> `rgb()`, tidak nama warna Tailwind bawaan (`bg-red-500`, `text-slate-700`). Warna hanya boleh
> datang dari token di bawah. Ini bukan preferensi gaya: warna mentah akan salah untuk 99% desa
> yang bukan desa yang kamu lihat saat menulisnya.

### 2.2 Kenapa warna mentah admin tidak dipakai langsung

Engine memaksakan empat guardrail. Tanpa ini, satu pilihan warna yang buruk merusak seluruh situs:

| # | Guardrail | Perilaku |
|---|---|---|
| G1 | **Clamp chroma** | Chroma di atas `0.17` OKLCH dipangkas. Hijau neon `#00ff00` jadi hijau yang bisa dipandang lama. |
| G2 | **Shade efektif** | Warna yang terlalu terang, terlalu tipis bedanya dari surface, atau jatuh di "zona mati" kontras, diganti shade **lebih gelap** dari scale-nya. Warna aslinya tetap hidup di `-soft` dan scale 50–400. |
| G3 | **`on-*` dari kontras** | Teks di atas warna dipilih lewat rasio WCAG: near-white kalau ≥ 4.5:1, kalau tidak near-black. Tidak pernah diasumsikan putih. |
| G4 | **Netral ber-tint** | Surface, border, dan teks mewarisi *hue* warna utama dengan chroma ≤ 0.020 — cukup untuk terasa sebagai kertas hangat, tidak cukup untuk terbaca sebagai berwarna. Bobotnya memuncak di ujung terang: pada lightness tinggi, chroma yang sama jauh lebih tidak terlihat. |

**Zona mati kontras (G2)** perlu dipahami karena sering mengejutkan: warna dengan luminansi
relatif antara ~0.18 dan ~0.24 gagal mencapai 4.5:1 baik terhadap putih maupun terhadap hitam.
Terracotta `#c1602a` — warna default desa Sita — jatuh persis di sana. Karena itu
`--color-primary` untuk tema default adalah `#9e4814`, bukan `#c1602a`. Ini memperbaiki
pelanggaran WCAG yang selama ini ada, bukan mengabaikan pilihan admin.

Uji semuanya di **`/dev/tema`** (hanya jalan di `next dev`). Halaman itu menampilkan seluruh
token, diagnostik guardrail mana yang aktif, tabel rasio kontras, dan contoh komponen — dengan
preset warna ekstrem siap pakai.

### 2.3 Semantic token — pakai yang ini

Kolom terakhir memakai tema default desa Sita sebagai contoh nilai.

#### Warna utama — aksi & identitas

| Token | Untuk apa | Contoh |
|---|---|---|
| `--color-primary` | Permukaan tombol utama, tab aktif, indikator terpilih | `#9e4814` |
| `--color-primary-hover` | State `:hover` tombol utama | `#8b3900` |
| `--color-primary-active` | State `:active` / ditekan | `#763000` |
| `--color-primary-soft` | Latar lembut: badge, highlight baris, panel info | `#ffe6da` |
| `--color-on-primary` | **Selalu** untuk teks/ikon di atas `--color-primary` | `#fff7f4` |
| `--color-on-primary-soft` | Teks/ikon di atas `--color-primary-soft` | `#9e4814` |
| `--color-link` | Teks tautan di atas surface terang (dijamin ≥ 4.5:1) | `#9e4814` |
| `--color-link-hover` | Tautan saat hover | `#8b3900` |
| `--color-focus-ring` | Cincin `:focus-visible` | `#9e4814` |

#### Warna sekunder & aksen

Set token yang sama persis: `--color-secondary{,-hover,-active,-soft}`, `--color-on-secondary`,
`--color-on-secondary-soft`, dan padanan `--color-accent…`.

- **Sekunder** — kategori non-aksi: label section, badge kelompok data, seri kedua di chart.
- **Aksen** — sorotan kecil dan jarang: titik eyebrow, garis pemisah dekoratif, penanda "baru".

> **Aksen jarang cocok jadi permukaan tombol.** Warna aksen biasanya terang (emas, kuning),
> sehingga G2 memekatkannya — emas `#d9a441` jadi `--color-accent` `#845d00`. Untuk kesan emas
> yang cerah, pakai `--color-accent-400` (`#d5a755`) sebagai elemen **dekoratif non-teks**, atau
> `--color-accent-soft` sebagai latar.

#### Permukaan, garis, teks

| Token | Untuk apa | Contoh |
|---|---|---|
| `--color-surface` | Permukaan terangkat: card, panel, sheet, baris tabel | `#fff7f4` |
| `--color-surface-alt` | Latar halaman, di belakang card | `#fdede6` |
| `--color-border` | Divider & garis card. Dekoratif, kontras rendah disengaja | `#efded6` |
| `--color-border-strong` | **Batas kontrol form** — input, select, checkbox. Dijamin ≥ 3:1 (WCAG 1.4.11) | `#897f7b` |
| `--color-text` | Teks utama & heading | `#211c1a` |
| `--color-text-muted` | Teks sekunder, caption, label. Dijamin ≥ 4.5:1 | `#6a625e` |

Membedakan `--color-border` dan `--color-border-strong` itu penting. Garis card boleh halus.
Garis input **tidak boleh** — garis itu satu-satunya penanda bahwa kontrolnya ada.

#### Panel gelap

Navbar, Footer, dan dasar Hero. Diturunkan dari shade paling gelap warna **utama**, supaya area
paling menonjol di halaman tetap membawa identitas desa.

| Token | Untuk apa | Contoh |
|---|---|---|
| `--color-panel` | Latar Navbar & Footer | `#472310` |
| `--color-panel-strong` | Lapisan paling pekat: dasar Hero, bagian bawah Footer | `#2c0d00` |
| `--color-panel-border` | Divider di dalam area gelap | `#5b301a` |
| `--color-on-panel` | Teks utama di atas panel | `#fff7f4` |
| `--color-on-panel-muted` | Teks sekunder di atas panel (≥ 4.5:1) | `#aea29d` |

Chroma panel **diredam ke 75%** dari shade 900 warna utama. Tanpa redaman itu, desa yang
memilih warna jenuh mendapat Navbar dan Footer yang menyala sepanjang halaman — identitas desa
tetap terbawa, tapi tidak sampai berteriak.

### 2.4 Scale 50–900 — pakai hanya kalau perlu

Empat scale tersedia: `--color-primary-{50…900}`, `--color-secondary-*`, `--color-accent-*`,
`--color-neutral-*`. Semuanya OKLCH-uniform: jarak antar step terasa sama besar untuk hue apa pun.

**Utamakan selalu semantic token.** Scale mentah hanya untuk kasus yang tidak dijangkau semantic
token, dan dua di antaranya sah:

- **Tekstur & elemen dekoratif non-teks** — `accent-400` untuk titik emas, `primary-100` untuk
  strip.
- **Elevasi/bayangan** — selalu dari `--color-neutral-900` dengan alpha.

Untuk **seri chart, pakai `--color-chart-1…5`** — jangan menyusun sendiri dari step scale.

Kalau kamu memakai step scale untuk **teks atau permukaan interaktif**, hampir pasti ada semantic
token yang lebih tepat. Cari dulu.

Contoh scale tema default:

```
primary    #fff4ef #ffe6da #ffd1bb #fcb592 #ef9569 #db7844 #bf5f28 #9e4814 #7a3203 #4f1d00
secondary  #f3f8f0 #e6f0de #d2e3c5 #b9d1a8 #9dba86 #82a268 #6a8950 #536f3b #3c5328 #233413
accent     #fdf5e9 #f9ead1 #f2d8ae #e6c285 #d5a755 #c08c22 #a47400 #845d00 #634500 #3f2a00
neutral    #fff7f4 #fdede6 #efded6 #ddcdc6 #aea29d #897f7b #6a625e #4f4845 #35302d #211c1a
```

### 2.5 Warna status

Sukses, peringatan, galat, dan info **tidak** diturunkan dari warna tenant — maknanya universal
dan tidak boleh berubah antar desa. Desa berprimer hijau tidak boleh punya pesan galat berwarna
hijau. **Hue-nya dipatok**, sementara lightness & chroma-nya tetap melewati guardrail G1–G3
sehingga kontrasnya dijamin sama seperti warna brand.

| Token | Hue | Permukaan | Latar lembut | Teks di atas permukaan | Teks di atas latar lembut |
|---|---|---|---|---|---|
| `--color-danger` | ~25° merah | `#c13c3b` | `#ffe5e2` | `#fff7f4` | `#ac3434` |
| `--color-warning` | ~85° kuning | `#805f00` | `#faeacb` | `#fff7f4` | `#805f00` |
| `--color-success` | ~145° hijau | `#2a7732` | `#dcf3dc` | `#fff7f4` | `#2a7732` |
| `--color-info` | ~250° biru | `#006bb9` | `#deeeff` | `#fff7f4` | `#0067b2` |

Nama tokennya: `--color-{danger,warning,success,info}`, masing-masing dengan `-soft`,
`--color-on-*`, dan `--color-on-*-soft`. `--destructive` milik shadcn dipetakan ke
`--color-danger`.

> **Kuning tidak akan pernah jadi permukaan cerah.** Tidak ada kuning terang yang sanggup
> memenuhi 3:1 terhadap surface putih, jadi G2 pasti memekatkan `--color-warning` jadi amber tua.
> Itu benar, bukan bug. Kuning cerahnya hidup di `--color-warning-soft` — dan latar memang tempat
> yang tepat untuk kuning, bukan permukaan bertulisan.

Aturan yang tetap berlaku: **warna tidak pernah jadi satu-satunya pembawa informasi.**
Selalu dampingi dengan teks atau ikon Lucide (WCAG 1.4.1).

### 2.6 Seri chart

Lima seri, diambil dari step scale yang **sudah ada** — bukan hue baru. Grafik karena itu tidak
pernah memunculkan warna yang tak pernah dipilih admin desa.

| Token | Sumber | Contoh |
|---|---|---|
| `--color-chart-1` | `primary-600` | `#bf5f28` |
| `--color-chart-2` | `secondary-600` | `#6a8950` |
| `--color-chart-3` | `accent-600` | `#a47400` |
| `--color-chart-4` | `primary-300` | `#fcb592` |
| `--color-chart-5` | `secondary-300` | `#b9d1a8` |

Konsekuensinya: desa yang memilih tiga warna berdekatan (mis. tiga nuansa hijau) akan sulit
membedakan kelima seri lewat warna saja. **Beri label langsung pada chart**, jangan andalkan
legenda berwarna.

---

## 3. Tipografi

Karena warna berubah per desa, **tipografi adalah pembawa identitas nomor satu.**

| Peran | Font | Alasan |
|---|---|---|
| Heading | **Fraunces** (variable, `--font-heading`) | Serif humanis dengan kehangatan dan sedikit karakter tulisan tangan. Berwibawa tanpa jadi kaku seperti Times, modern tanpa jadi dingin. |
| Body | **Inter** (variable, `--font-body`) | X-height besar, apertur terbuka, angka jelas — font paling terbukti terbaca di layar HP murah. Prioritas mutlak untuk pembaca lansia. |
| Angka & kode | **IBM Plex Mono** (`--font-mono`) | Untuk label eyebrow, kode wilayah, dan angka tabel yang perlu rata kolom. |

Ketiganya subset `latin` — cukup untuk Bahasa Indonesia — dan dimuat lewat `next/font/google`
sehingga di-selfhost, tanpa request ke domain pihak ketiga, tanpa FOIT.

**Aturan Fraunces:** sumbu `WONK` harus tetap **0**. Sumbu wonky bikin huruf miring-nakal yang
merusak kesan dapat-dipercaya. Sumbu `opsz` dibiarkan otomatis.

### 3.1 Type scale

Mobile-first. Ukuran body sengaja **17px, bukan 16px** — satu langkah kecil yang sangat terasa
bagi pembaca 55 tahun ke atas.

| Peran | Mobile | Desktop | Font | Weight | Line-height | Tracking |
|---|---|---|---|---|---|---|
| Display (Hero) | 2rem / 32px | 3rem / 48px | Fraunces | 600 | 1.1 | −0.02em |
| H1 | 1.75rem / 28px | 2.5rem / 40px | Fraunces | 600 | 1.15 | −0.015em |
| H2 | 1.5rem / 24px | 2rem / 32px | Fraunces | 600 | 1.2 | −0.01em |
| H3 | 1.25rem / 20px | 1.5rem / 24px | Fraunces | 600 | 1.3 | −0.005em |
| H4 | 1.125rem / 18px | 1.25rem / 20px | Inter | 650 | 1.35 | 0 |
| Body besar | 1.125rem / 18px | 1.1875rem / 19px | Inter | 400 | 1.65 | 0 |
| **Body** | **1.0625rem / 17px** | **1.0625rem / 17px** | Inter | 400 | 1.6 | 0 |
| Body kecil | 0.9375rem / 15px | 0.9375rem / 15px | Inter | 400 | 1.55 | 0 |
| Caption | 0.85rem / 13.5px | 0.875rem / 14px | Inter | 400 | 1.45 | 0 |
| Eyebrow | 0.75rem / 12px | 0.75rem / 12px | Plex Mono | 500 | 1.4 | 0.08em, UPPERCASE |

### 3.2 Aturan

- **Jangan pernah di bawah 13.5px.** Termasuk footnote, label chart, dan disclaimer.
- **Panjang baris 60–75 karakter** untuk teks mengalir (`max-width: 65ch`). Lebih panjang dari itu,
  mata kehilangan baris.
- **Heading Fraunces maksimal 2 tingkat per layar.** Serif berkarakter kehilangan dampaknya kalau
  dipakai untuk segalanya.
- **Jangan `text-transform: uppercase`** kecuali pada Eyebrow. Kapital semua memperlambat membaca
  dan terasa berteriak.
- **Angka pakai `font-variant-numeric: tabular-nums`** di semua tabel dan statistik.
- **Rata kiri.** Tidak ada `justify` (bikin sungai putih di layar sempit), tidak ada teks tengah
  untuk paragraf lebih dari 2 baris.

---

## 4. Spacing, Radius, Elevasi

### 4.1 Spacing

Skala kelipatan 4px (bawaan Tailwind). Yang perlu disepakati adalah **ritmenya**:

| Konteks | Mobile | Desktop |
|---|---|---|
| Padding tepi halaman | 16px (`px-4`) | 24px (`px-6`) |
| Jarak antar section | 48px (`py-12`) | 80px (`py-20`) |
| Jarak judul section → isi | 24px (`mb-6`) | 32px (`mb-8`) |
| Padding dalam card | 16px (`p-4`) | 20px (`p-5`) |
| Jarak antar card dalam grid | 12px (`gap-3`) | 16px (`gap-4`) |
| Jarak antar field form | 16px (`gap-4`) | 20px (`gap-5`) |
| Lebar konten maksimum | — | 1152px (`max-w-6xl`) |

**Prinsip:** jarak antar kelompok harus lebih besar daripada jarak di dalam kelompok. Kalau
sebuah label terlihat "menempel" ke field yang salah, itu masalah spacing, bukan warna.

### 4.2 Border radius

Sumbernya `--radius: 0.875rem` (14px) di `globals.css`, diturunkan lewat rantai `--radius-sm/md/lg/xl`.

| Elemen | Radius |
|---|---|
| Badge, chip, pill, avatar | `9999px` |
| Tombol, input, select | 10px |
| Card, panel, dropdown | 14px (`--radius-lg`) |
| Media besar, blok Hero | 20–24px |

Satu tingkat radius per komponen — jangan mencampur sudut tajam dan bulat dalam satu kartu.

### 4.3 Elevasi

Situs ini **membedakan lapisan dengan garis dan warna permukaan, bukan bayangan.** Bayangan berat
adalah ciri SaaS dashboard yang kita hindari, dan mahal untuk di-render di HP kelas bawah.

| Level | Kapan | Resep |
|---|---|---|
| 0 — datar | Default semua card & section | `background: var(--color-surface)` + `1px solid var(--color-border)` |
| 1 — terangkat | Elemen sticky (Navbar), card yang di-hover | `0 1px 2px color-mix(in srgb, var(--color-neutral-900) 6%, transparent)` |
| 2 — mengambang | Dropdown, popover, modal, sheet mobile | `0 8px 24px color-mix(in srgb, var(--color-neutral-900) 12%, transparent)` |

Bayangan selalu diturunkan dari `--color-neutral-900` — ikut ber-tint hue desa, jadi tidak pernah
terlihat sebagai abu-abu asing di atas permukaan hangat.

---

## 5. Elemen Khas

### 5.1 Pola tekstur — anyaman

Tekstur latar yang terinspirasi anyaman bambu dan tenun ikat. Ini pembawa identitas paling khas
setelah tipografi, dan yang paling membedakan situs ini dari template pemerintahan.

**Aturannya ketat:**

- **Dihasilkan CSS, bukan file gambar.** Nol byte tambahan untuk diunduh.
- **Opacity 0.04–0.06** di atas permukaan terang, **0.05–0.08** di atas panel gelap. Kalau polanya
  langsung terbaca sebagai motif, terlalu kuat — ini tekstur kertas, bukan wallpaper.
- **Maksimal satu section ber-pola per layar.**
- **Selalu `aria-hidden`**, selalu di belakang konten, tidak pernah mengurangi kontras teks.
- Warnanya dari `--color-primary-900` atau `--color-on-panel`, tidak pernah hex.

Resep dasar anyaman silang:

```css
.tekstur-anyaman {
  background-image:
    repeating-linear-gradient(45deg,
      color-mix(in srgb, var(--color-primary-900) 5%, transparent) 0 1px,
      transparent 1px 9px),
    repeating-linear-gradient(-45deg,
      color-mix(in srgb, var(--color-primary-900) 5%, transparent) 0 1px,
      transparent 1px 9px);
}
```

Varian tenun (garis horizontal rapat, kesan kain) dan pilin (titik-titik berselang) boleh
diturunkan dari resep yang sama. Jangan menambah varian ketiga tanpa alasan kuat.

### 5.2 Fotografi

- **Foto asli kegiatan desa selalu menang** atas ilustrasi, ikon besar, atau stock photo. Musyawarah
  di balai desa, panen, posyandu, kerja bakti, pasar. Foto HP yang jujur lebih baik daripada stock
  yang mengkilap.
- **Wajah orang boleh dan bagus** — asalkan warga desa itu sendiri dan sudah berizin.
- **Rasio:** 3:2 untuk foto kegiatan, 4:3 untuk potret aparatur, 16:9 hanya untuk banner Hero.
- **Jangan diberi filter berat**, jangan di-duotone dengan warna tenant, jangan diberi overlay
  gradient ungu/biru. Kalau teks harus di atas foto, pakai overlay `--color-panel-strong` dengan
  opacity 0.55–0.7 — netral dan bisa diprediksi.
- **Wajib:** `next/image`, `loading="lazy"` kecuali gambar Hero, `sizes` yang benar, dan `alt`
  deskriptif dalam Bahasa Indonesia ("Warga bergotong royong memperbaiki jembatan Wae Rii", bukan
  "foto kegiatan").
- Placeholder saat foto belum ada: blok `--color-surface-alt` dengan ikon Lucide `--color-text-muted`
  — **bukan** ilustrasi generik.

### 5.3 Ikon

- **Satu library: Lucide React.** Tidak ada campuran dengan Heroicons, Font Awesome, atau SVG lepas.
- **Satu ketebalan: `strokeWidth={1.75}`** di seluruh situs.
- **Ukuran:** 16px inline dalam teks, 20px dalam tombol dan navigasi, 24px sebagai ikon fitur,
  32px maksimum. Ikon dekoratif besar (48px+) adalah ciri SaaS — hindari.
- **Ikon selalu `aria-hidden`** kalau didampingi teks. Ikon yang berdiri sendiri sebagai tombol
  wajib punya `aria-label`.
- **Ikon mewarisi `currentColor`.** Jangan pernah beri warna sendiri.
- **Emoji bukan ikon.** Tidak di navigasi, tidak di badge, tidak di heading, tidak di empty state.

---

## 6. Komponen Inti

Semua kontrol interaktif: **target sentuh minimal 44 × 44px**, `:focus-visible` terlihat jelas,
dan transisi ≤ 150ms yang dimatikan saat `prefers-reduced-motion: reduce`.

Cincin fokus standar, seragam di seluruh situs:

```css
outline: 2px solid var(--color-focus-ring);
outline-offset: 2px;
```

### 6.1 Tombol

| Varian | Kapan | Permukaan | Teks |
|---|---|---|---|
| `primary` | Satu aksi utama per layar | `--color-primary` | `--color-on-primary` |
| `secondary` | Aksi pendamping | `--color-secondary` | `--color-on-secondary` |
| `soft` | Aksi tersier, aksi dalam card | `--color-primary-soft` | `--color-on-primary-soft` |
| `outline` | Batal, aksi netral | `--color-surface` + garis `--color-border-strong` | `--color-link` |
| `ghost` | Aksi dalam toolbar/tabel | transparan | `--color-link` |

**Ukuran:** `sm` tinggi 36px / `default` 44px / `lg` 52px. `sm` hanya boleh dipakai di dalam baris
tabel padat pada layar desktop — tidak pernah sebagai aksi utama di mobile.

**State:**

| State | Perilaku |
|---|---|
| `:hover` | `--color-primary-hover` (varian solid), `--color-primary-soft` sebagai latar (outline/ghost) |
| `:active` | `--color-primary-active` |
| `:focus-visible` | Cincin fokus standar |
| `:disabled` | `opacity: 0.45`, `cursor: not-allowed`, **tanpa** perubahan hue |
| memuat | Ikon `Loader2` berputar + teks tetap ada. Jangan mengubah lebar tombol. |

Satu tombol `primary` per layar. Dua tombol primer berdampingan berarti keputusannya belum dibuat.

### 6.2 Card

```
┌─ border 1px --color-border, radius 14px, bg --color-surface ─┐
│  [media opsional — radius atas 14px, rasio tetap]            │
│  padding 16px (mobile) / 20px (desktop)                      │
│    Eyebrow      Plex Mono 12px, --color-text-muted  (opsional)│
│    Judul        H4, --color-text                              │
│    Deskripsi    Body kecil, --color-text-muted, maks 3 baris  │
│    ─────────── --color-border (opsional)                      │
│    Footer       badge / tombol ghost / tanggal                │
└───────────────────────────────────────────────────────────────┘
```

- Card yang bisa diklik: **seluruh card** adalah target, bukan hanya judulnya. Hover menaikkan ke
  elevasi 1 dan menggelapkan border ke `--color-border-strong`.
- Tinggi card dalam satu grid harus seragam (`items-stretch`), footer menempel ke bawah.
- Jangan menumpuk card di dalam card.

### 6.3 Badge

Pill, `border-radius: 9999px`, padding `4px 10px`, Body kecil, weight 600.

| Varian | Latar | Teks | Untuk |
|---|---|---|---|
| Netral | `--color-surface-alt` | `--color-text-muted` | Metadata, jumlah |
| Primer | `--color-primary-soft` | `--color-on-primary-soft` | Kategori utama, layanan |
| Sekunder | `--color-secondary-soft` | `--color-on-secondary-soft` | Kelompok data |
| Aksen | `--color-accent-soft` | `--color-on-accent-soft` | Penanda "Baru", sorotan |
| Solid | `--color-primary` | `--color-on-primary` | Prioritas — jarang, maks 1 per layar |

Badge tidak pernah bisa diklik. Kalau perlu diklik, itu chip filter — komponen lain.

### 6.4 Input form

```
Label            Body kecil, weight 600, --color-text
Petunjuk         Caption, --color-text-muted        (opsional, di ATAS field)
┌──────────────────────────────────────────┐  tinggi 44px, radius 10px
│  bg --color-surface                      │  border 1px --color-border-strong
└──────────────────────────────────────────┘
Pesan galat      Caption + ikon AlertCircle          (opsional)
```

- **Petunjuk di atas field, bukan di bawah.** Pengguna membacanya sebelum mengisi, dan di mobile
  teks di bawah field tertutup keyboard.
- **`--color-border-strong`, bukan `--color-border`.** Garis input adalah satu-satunya penanda
  bahwa kontrolnya ada.
- Placeholder **bukan pengganti label**. Label selalu terlihat.
- Galat disampaikan lewat **teks + ikon**, bukan hanya border merah. Field yang galat memakai
  `aria-invalid` dan `aria-describedby`.
- `inputMode` yang benar untuk field angka (NIK, tahun, jumlah) — keyboard numerik di HP.

### 6.5 Navigasi

- Latar `--color-panel`, teks `--color-on-panel`, sticky, tinggi 64px.
- **Mobile adalah default**: tombol menu 44px, panel geser penuh, item menu tinggi 48px.
- Item aktif ditandai **teks `--color-on-panel` + garis bawah `--color-accent-400`**; item tidak
  aktif `--color-on-panel-muted`. Jangan menandai aktif hanya dengan warna.
- Kedalaman menu maksimal 2 tingkat. Tidak ada mega-menu.
- Halaman selain beranda wajib punya breadcrumb.

### 6.6 Footer

- Latar `--color-panel-strong`, teks `--color-on-panel-muted`, judul kolom `--color-on-panel`.
- Isi wajib: identitas desa (nama, kecamatan, kabupaten, provinsi), kontak, jam layanan, navigasi
  ringkas, dan **tanggal pembaruan data terakhir** — penanda kepercayaan paling murah yang kita punya.
- Tautan footer tetap 44px tinggi target sentuhnya walau tampak sebagai teks biasa.

---

## 7. Larangan Eksplisit

Yang berikut ini **tidak boleh masuk**, tanpa perlu diskusi:

1. **Gradient ungu/biru ala SaaS.** Tidak ada `from-purple-500 to-blue-600` dalam bentuk apa pun.
   Gradient hanya boleh antar dua step dari scale tenant yang sama, dan hanya untuk elemen dekoratif.
2. **Glassmorphism berlebihan.** `backdrop-blur` hanya untuk Navbar sticky. Tidak ada card kaca
   bertumpuk, tidak ada border putih transparan, tidak ada blob berpendar.
3. **Emoji sebagai ikon.** Di mana pun. Pakai Lucide.
4. **Stock photo orang barat.** Termasuk ilustrasi generik "orang kantoran", karakter 3D, dan
   maskot. Foto asli warga desa, atau tidak sama sekali.
5. **Dark pattern.** Tidak ada hitungan mundur palsu, tidak ada tombol batal yang disamarkan, tidak
   ada "konfirmshaming", tidak ada opt-out tersembunyi. Warga datang untuk mengurus keperluannya,
   bukan untuk dikonversi.
6. **Warna hardcode di komponen.** Termasuk palet Tailwind bawaan (`bg-slate-100`, `text-gray-500`).
7. **Warna sebagai satu-satunya pembawa makna.** Selalu ada teks atau ikon pendamping.
8. **Animasi masuk yang menunda konten.** Tidak ada fade-in bertahap saat scroll pada teks atau data.
   Konten muncul langsung. Animasi hanya untuk umpan balik interaksi.
9. **Istilah teknis di UI.** "Layanan Surat", bukan "Document Service". "Data Desa", bukan
   "Dashboard". "Belum ada data", bukan "No records found".
10. **Library berat untuk kebutuhan kecil.** Tidak ada library animasi untuk satu transisi, tidak
    ada library ikon kedua, tidak ada library tanggal untuk satu format.

---

## 8. Status & Roadmap Migrasi

Seluruh token di dokumen ini **sudah terdaftar sebagai utility Tailwind** (`bg-primary`,
`text-text-muted`, `border-border-strong`) dan **sudah dikonsumsi ke-12 primitif** di
`src/components/ui/`. Isi halaman di luar itu masih berjalan di atas palet lama (`kopi-*`,
`espresso-*`, `sawah-*`, `kakao-*`, `krem-*`, `panel-*`, `gold-*`, `tanah-*`).

**Sudah selesai**

- [x] **Fase 0** — Color derivation engine `src/lib/theme/` (OKLCH, guardrail G1–G4, WCAG),
      injeksi per tenant di root layout `(site)`, halaman preview `/dev/tema`, DESIGN.md
- [x] **Fase 1** — 93 token terdaftar di `@theme static`, warna status & seri chart, netral
      dihangatkan, chroma panel diredam, jembatan shadcn dibalik arahnya, shim `body { … }`
      dibuang

**Rencana migrasi selengkapnya:**
[docs/superpowers/specs/2026-07-22-migrasi-design-system-prd.md](docs/superpowers/specs/2026-07-22-migrasi-design-system-prd.md)

### Tiga hal yang wajib dipahami sebelum menyentuh `globals.css`

1. **Arah jembatannya satu arah, dan tidak boleh dibalik.** Blok `:root` memetakan nama shadcn
   *ke* token engine (`--primary: var(--color-primary)`), bukan sebaliknya. Namespace `--color-*`
   dimiliki engine dan nilainya di-override per tenant lewat inline style `<html>`. Membalik
   arahnya membekukan seluruh situs di nilai default apa pun warna yang dipilih desa.
2. **Nilai default di `@theme static` dihasilkan mesin.** Jangan diedit tangan — jalankan
   `npm run theme:sync`. `npm run theme:check` gagal kalau ia menyimpang dari
   `deriveTheme(DEFAULT_THEME_SLOTS)`. Blok itu ada karena `/platform` dan `/set-password`
   sengaja tidak memanggil resolusi tenant.
3. **Tiga nama shadcn sengaja tidak berarti seperti aslinya.** `--secondary` = warna sekunder
   **tenant** (varian tombol sekunder §6.1), bukan permukaan redam; `--input` naik ke
   `--color-border-strong`; dan `accent` bawaan shadcn tidak dipakai sama sekali — `bg-accent`
   sekarang berarti warna aksen tenant, jadi permukaan hover memakai `--color-primary-soft`.
