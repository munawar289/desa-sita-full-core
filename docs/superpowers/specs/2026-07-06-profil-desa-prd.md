# PRD — Identitas Desa & Tema Warna Editable dari Dashboard (Profil Desa)

**Tanggal:** 2026-07-06
**Status:** Draft untuk dieksekusi
**Scope:** Satu sumber kebenaran untuk identitas desa (nama, kecamatan, kabupaten, provinsi, deskripsi hero, kontak) + kustomisasi warna tema (primer, sekunder, aksen) + halaman admin untuk mengeditnya. **Tidak termasuk** perubahan pada domain statistik, wilayah_info, berita, galeri, atau pengaduan.

---

## 1. Latar Belakang & Tujuan

Situs ini dibangun untuk Desa Sita, tapi identitas desa — nama ("Sita"), kecamatan (Rana Mese), kabupaten (Manggarai Timur), provinsi (NTT), email kontak, jam & zona waktu layanan, tahun berdiri, serta deskripsi/tagline hero banner — saat ini **di-hardcode langsung di 40+ file** (komponen UI inti dan metadata tiap halaman), tanpa satu sumber kebenaran.

Konsekuensinya:
- Kalau template ini dipakai ulang untuk desa lain, atau data lokasi/kontak berubah, harus edit puluhan file manual — rawan ada yang terlewat dan jadi tidak konsisten (mis. tagline hero berbeda dari deskripsi metadata).
- Tidak ada cara bagi staf non-developer untuk mengubah identitas ini; harus lewat developer.

**Tujuan fase ini:** pindahkan identitas desa ke satu baris data di database (**profil desa**), bisa diedit dari dashboard admin, dan seluruh teks identitas di situs (UI inti + metadata semua halaman) membaca dari sumber tunggal itu — bukan literal string lagi.

**Prinsip non-negosiable:** tidak boleh ada regresi tampilan setelah migrasi — nilai default yang tersimpan (mock & seed) harus identik dengan teks **dan warna** yang tampil hari ini, supaya perubahan ini murni infrastruktural, bukan perubahan konten atau desain.

---

## 2. Ringkasan Kondisi Saat Ini

Hasil audit codebase: **tidak ada file konstanta/config terpusat** (tidak ada `config.ts`, `constants.ts`, `site.ts`, dsb). Titik-titik hardcode utama:

| Area | File | Yang di-hardcode |
|---|---|---|
| UI inti | `src/components/beranda/HeroSection.tsx` | Judul "DESA SITA", tagline hero, array lokasi (`Kec. Rana Mese`, `Kab. Manggarai Timur`, `Nusa Tenggara Timur`) |
| UI inti | `src/components/layout/Navbar.tsx` | Brand "Desa Sita" |
| UI inti | `src/components/layout/Footer.tsx` | Nama desa, baris alamat, email kontak, jam & zona layanan (WITA), copyright |
| UI inti | `src/components/beranda/PotensSection.tsx`, `StatistikOverview.tsx` | Judul section menyisipkan "Desa Sita" |
| Metadata root | `src/app/layout.tsx` | `title`/`description` metadata |
| Metadata halaman | ~35 file `page.tsx` di `profil-desa/**`, `pemerintahan/**`, `lembaga-desa/**`, `rencana-pengembangan/**`, `layanan/**`, `data-desa/**`, area admin | Setiap file menuliskan ulang "Desa Sita" di `title`/`description` |
| Konten (di luar lingkup) | `src/lib/data/wilayah-info.ts`, `src/lib/data/statistik.ts` | Narasi & label yang menyebut "Desa Sita" — ini **konten**, sudah editable lewat `/admin/wilayah` & `/admin/statistik`, tidak diubah di fase ini |

Nilai identitas saat ini (jadi nilai default/seed):

| Field | Nilai saat ini |
|---|---|
| Nama desa | Sita |
| Kecamatan | Rana Mese |
| Kabupaten | Manggarai Timur |
| Provinsi | Nusa Tenggara Timur |
| Deskripsi hero | "Desa agraris di kaki pegunungan Rana Mese — hidup dari hasil kebun dan sawah sejak tahun 1966." |
| Email | desasita@ranames.manggaraitimurkab.go.id |
| Jam layanan | Senin–Jumat, 08.00–16.00 |
| Zona waktu | WITA |
| Tahun berdiri | 1966 |

---

## 3. Data Model (Backend)

### 3.1 Prinsip

Ini adalah **profil singleton** (satu baris, hanya di-UPDATE, tidak pernah insert/delete dari klien) — pola berbeda dari tabel konten biasa (`statistik`, `wilayah_info`) yang barisnya banyak. Meniru semangat `wilayah_info` (RLS publik-baca/staf-tulis) tapi bentuknya satu baris tetap.

### 3.2 Tabel baru

```sql
-- Migration: supabase/migrations/0005_desa_profil.sql
create table desa_profil (
  id uuid primary key default gen_random_uuid(),
  nama_desa text not null,
  kecamatan text not null,
  kabupaten text not null,
  provinsi text not null,
  hero_deskripsi text not null,
  email text,
  jam_layanan text,
  zona_waktu text,
  tahun_berdiri int,
  warna_primer text not null default '#c1602a',
  warna_sekunder text not null default '#5b7a41',
  warna_aksen text not null default '#d9a441',
  updated_by uuid references profiles(id),
  updated_at timestamptz default now()
);

insert into desa_profil (nama_desa, kecamatan, kabupaten, provinsi, hero_deskripsi, email, jam_layanan, zona_waktu, tahun_berdiri, warna_primer, warna_sekunder, warna_aksen)
values (
  'Sita', 'Rana Mese', 'Manggarai Timur', 'Nusa Tenggara Timur',
  'Desa agraris di kaki pegunungan Rana Mese — hidup dari hasil kebun dan sawah sejak tahun 1966.',
  'desasita@ranames.manggaraitimurkab.go.id', 'Senin–Jumat, 08.00–16.00', 'WITA', 1966,
  '#c1602a', '#5b7a41', '#d9a441'
);
```

`warna_primer`/`warna_sekunder`/`warna_aksen` masing-masing satu hex 6-digit (bukan sekumpulan shade) — nilai default identik dengan `--color-kopi-600`, `--color-sawah-400`, dan `--color-gold-500` di `globals.css` saat ini, sehingga baris seed tidak mengubah tampilan. Tint/shade turunan (mis. `-400`/`-100` untuk primer) dihitung dari base ini lewat CSS `color-mix()`, bukan disimpan sebagai kolom terpisah — lihat §3.5.

RLS: pola identik tabel konten (`desa_profil_public_read using (true)`, `desa_profil_staff_write for update using (is_staff())`). **Tidak ada policy INSERT/DELETE dari klien** — baris singleton dijamin ada lewat seed di migration ini, bukan dibuat dari dashboard.

Trigger `set_updated_at` (helper sudah ada dari `0003_triggers.sql`) di-attach ke `desa_profil`.

Regenerasi `src/lib/supabase/database.types.ts` setelah migration jalan.

### 3.3 Layer aplikasi (mengikuti pola domain existing)

- `src/lib/data/desa-profil.ts` — tipe `DesaProfil` + `desaProfilMock` (nilai di §2, dipakai sebagai fallback sebelum Supabase terhubung dan saat `next build` tanpa DB).
- `src/lib/queries/desa-profil.ts` — `getDesaProfil(): Promise<DesaProfil>` via `withSupabaseFallback` (helper existing di `src/lib/queries/helpers.ts`), `.select(...).limit(1).single()` — mengembalikan objek, bukan array (beda dari pola `getWilayahInfo()` yang array).
- `src/lib/validation/desa-profil.ts` — `desaProfilFormSchema` (Zod): 4 field lokasi wajib (trim, max panjang), `hero_deskripsi` wajib (maks ~300 karakter), `email` opsional format email, `jam_layanan`/`zona_waktu` opsional, `tahun_berdiri` opsional integer rentang wajar, `warna_primer`/`warna_sekunder`/`warna_aksen` wajib format hex 6-digit (`/^#[0-9a-fA-F]{6}$/`) **plus guard kontras**: tolak warna yang terlalu terang (relative luminance > ambang, mis. 0.75) karena ketiga slot ini selalu dipasangkan dengan teks putih (`--primary-foreground`, tombol CTA, badge) — tanpa guard ini admin bisa memilih warna yang membuat teks tak terbaca.
- `src/lib/actions/desa-profil.ts` — `updateDesaProfilAction(prevState, formData)` mengikuti pola `updateStatistikAction` (`src/lib/actions/statistik.ts`): `safeParse` → `createSupabaseServerClient()` → ambil `oldRow` untuk audit → `.update(...).eq("id", id)` → `logAudit(...)` → revalidate. Karena identitas muncul di hampir semua route, revalidasi dilakukan lewat `revalidatePath("/", "layout")` (bukan daftar path satu-satu seperti domain statistik).

### 3.5 Penerapan warna ke CSS (tanpa duplikasi shade)

Saat ini `globals.css` mendefinisikan tiap shade brand (`--color-kopi-600/400/100`, `--color-sawah-700/400/100`, `--color-gold-500/400`) sebagai hex literal terpisah, dan token semantik shadcn (`--primary`, `--ring`, `--chart-1..5`) juga hex literal — bukan referensi `var()` ke palet brand. Supaya admin cukup memilih **satu warna per slot** (bukan mengisi 6+ shade manual), `globals.css` direfaktor supaya shade turunan dihitung dari base via `color-mix()`, contoh:

```css
--color-kopi-600: var(--warna-primer);
--color-kopi-400: color-mix(in srgb, var(--warna-primer) 75%, white);
--color-kopi-100: color-mix(in srgb, var(--warna-primer) 15%, white);
```

Pola yang sama dipakai untuk `--color-sawah-*` (dari `--warna-sekunder`) dan `--color-gold-*` (dari `--warna-aksen`), lalu token shadcn yang relevan (`--primary`, `--ring`, `--chart-1` → primer; `--chart-2`/`--chart-5` → sekunder; `--chart-3` → aksen) diarahkan mengikuti variabel yang sama.

`RootLayout` (sudah jadi `async` untuk memanggil `getDesaProfil()` di §4.1) menyisipkan `--warna-primer`/`--warna-sekunder`/`--warna-aksen` sebagai inline style di elemen `<html>` dengan nilai dari database — inline style pada elemen itu punya spesifisitas lebih tinggi dari rule `:root`/`.dark` untuk elemen yang sama, jadi override berlaku di light maupun dark mode tanpa menyentuh token struktural (`--background`, `--foreground`, dst) yang memang tidak ikut di-custom.

---

## 4. UI/UX

### 4.1 Konsumsi identitas di UI publik

- **Server components** (`HeroSection`, `PotensSection`, `StatistikOverview`, `page.tsx` beranda) memanggil `getDesaProfil()` langsung dan merender nama desa, lokasi, dan `hero_deskripsi` dari data, bukan literal.
- **Client components** (`Navbar`, `Footer`) menerima profil lewat props dari `RootLayout` (`src/app/layout.tsx`, jadi `async` function memanggil `getDesaProfil()` sekali lalu diteruskan ke keduanya) — supaya tidak setiap client component query sendiri-sendiri.

### 4.2 Metadata dinamis di semua halaman

Helper baru `src/lib/metadata.ts` — `buildMetadata(opts?: { title?: string; description?: string })`: fetch `getDesaProfil()`, susun `title` (`"{title} — Desa {nama_desa}"`, atau default berbasis lokasi kalau `title` tidak diberikan) dan `description` default berbasis lokasi.

Root layout dan seluruh ~35 halaman yang sebelumnya `export const metadata = {...}` statis diubah menjadi `export async function generateMetadata()` yang memanggil `buildMetadata({ title, description })` dengan judul/deskripsi spesifik halaman itu tetap dipertahankan, hanya bagian nama desa yang jadi dinamis.

### 4.3 Halaman admin

- Route baru `/admin/profil-desa` — server component baca baris `desa_profil`, render form.
- Komponen `DesaProfilForm` (client) — `useActionState(updateDesaProfilAction, ...)`, satu form berisi seluruh field, hidden `id`, tampilkan `state.error`/badge sukses, disable saat pending. Mengikuti pola visual `AddStatistikForm`/`StatistikRow` yang sudah ada.
- Tambah entri di `src/lib/admin-nav.ts`: `{ label: "Identitas Desa", href: "/admin/profil-desa", active: true, minRole: "admin" }` — akses admin-only (bukan operator), karena ini identitas resmi desa, bukan data operasional harian.

### 4.4 Kustomisasi warna tema

Di form yang sama (`DesaProfilForm`), tambah section "Warna Tema" dengan 3 color picker (`<input type="color">` dipasangkan dengan input teks hex agar admin bisa ketik langsung atau pilih visual):

| Slot | Label di form | Default | Dipakai untuk |
|---|---|---|---|
| `warna_primer` | Warna Utama | `#c1602a` (terracotta) | CTA, link, ring focus, highlight hero |
| `warna_sekunder` | Warna Sekunder | `#5b7a41` (olive) | Label section, badge hijau, aksen statistik |
| `warna_aksen` | Warna Aksen | `#d9a441` (gold) | Eyebrow dot, avatar, gradient teks brand |

- Live preview: 3 swatch bulat di sebelah tiap input, update on-change (client-side, sebelum submit) supaya admin lihat warna sebelum simpan — tidak menunggu round-trip server.
- Tombol "Kembalikan ke Default" per slot atau sekaligus (reset ke nilai §3.2), mengisi ulang input tanpa submit — berguna kalau admin salah pilih warna dan lupa hex aslinya.
- Pesan error validasi (§3.3) ditampilkan per field, mis. "Warna terlalu terang, teks putih di atasnya sulit dibaca" — bukan hanya "format tidak valid".

---

## 5. Dashboard Admin

| Route | Fungsi | Role minimum |
|---|---|---|
| `/admin/profil-desa` | Edit nama desa, kecamatan, kabupaten, provinsi, deskripsi hero, email, jam & zona layanan, tahun berdiri, **warna primer/sekunder/aksen** (form singleton, hanya update) | admin |

Audit log: pola sama seperti domain lain (`logAudit` helper), `table_name = "desa_profil"`.

---

## 6. Fase Pengerjaan

| Kelompok | Cakupan | Keluaran |
|---|---|---|
| **1 — Backend & UI inti** | Migration `0005_desa_profil.sql` (tabel + RLS + trigger + seed, termasuk 3 kolom warna), regenerasi types, layer data/query/validasi/action, halaman & form `/admin/profil-desa`, konsumsi di Hero/Navbar/Footer/beranda | Identitas desa editable dari dashboard, tampil benar di UI inti, tanpa regresi visual |
| **2 — Metadata menyeluruh** | Helper `buildMetadata()`, migrasi root layout + seluruh ~35 `page.tsx` dari `metadata` statis ke `generateMetadata()` dinamis | Title/description semua halaman ikut berubah saat identitas diedit dari dashboard |
| **3 — Tema warna kustom** | Refaktor `globals.css` ke `color-mix()` (§3.5), injeksi CSS var di `RootLayout`, 3 color picker + preview di `DesaProfilForm` (§4.4), guard kontras di validasi (§3.3) | Warna primer/sekunder/aksen bisa diganti dari dashboard dan langsung terlihat di seluruh situs, tanpa regresi warna saat nilai masih default |

Checkpoint di antara tiap kelompok — verifikasi build/typecheck/lint + cek visual beranda & satu halaman `data-desa/*` sebelum lanjut ke kelompok berikutnya. Untuk Kelompok 3 khususnya, cek juga: light mode & dark mode, dan minimal satu kombinasi warna non-default (mis. ganti primer ke biru) untuk memastikan override benar-benar tembus ke semua komponen yang memakai `--color-kopi-*`/`--primary`/`--chart-1`.

---

## 7. Yang Tidak Termasuk

- Narasi di `wilayah_info` (sejarah, batas wilayah, iklim, orbitasi) dan label di `statistik` — ini konten yang sudah editable lewat `/admin/wilayah` & `/admin/statistik`, tidak dipindah ke tabel profil.
- Komentar kode dan dokumentasi (`README.md`, `prd.md`, `docs/**`) — tidak memengaruhi runtime, dibiarkan menyebut "Desa Sita" apa adanya.
- Logo/gambar identitas desa (hero banner saat ini murni gradient CSS, tidak ada file gambar) — di luar lingkup, ikon `Mountain` di Navbar/Footer tetap generik.
- Multi-tenant / multi-desa dalam satu instance database — fase ini hanya membuat identitas *editable*, bukan mendukung banyak desa sekaligus di satu deployment.
- Palet warna di luar 3 slot (primer/sekunder/aksen) — token struktural (`--background`, `--foreground`, `--card`, `--border`, `--destructive`) tetap tetap/fixed, tidak ikut di-custom, supaya kontras teks & layout dasar tidak bisa dirusak dari dashboard.
- Tema gelap (dark mode) kustom terpisah — 3 slot warna yang sama dipakai di light maupun dark mode (§3.5); tidak ada set warna kedua khusus untuk dark mode di fase ini.
- Preset/galeri tema siap pakai (mis. pilihan "Hijau", "Biru", "Merah" sekali klik) — admin mengisi hex manual atau lewat color picker, bukan memilih dari daftar preset.

## 8. Pertanyaan Terbuka

- Apakah field `tahun_berdiri` perlu ditampilkan otomatis di tempat lain (mis. "sejak tahun {tahun_berdiri}" di narasi `wilayah_info`), atau cukup dipakai di hero banner saja seperti sekarang? Default: hanya hero banner, karena narasi `wilayah_info` adalah teks bebas yang dikelola terpisah.
- Role minimum `/admin/profil-desa` diasumsikan **admin** (bukan operator) di §4.3 — perlu konfirmasi ini sesuai kebijakan akses yang diinginkan, karena identitas resmi desa dianggap data sensitif dibanding statistik operasional harian.
- Ambang luminance untuk guard kontras di §3.3 (usulan: tolak jika relative luminance > 0.75) masih perlu divalidasi manual terhadap beberapa warna terang (mis. kuning muda, pastel) supaya tidak terlalu ketat (menolak warna yang sebenarnya masih layak) atau terlalu longgar (meloloskan warna yang bikin teks putih tak terbaca).
- Apakah warna kustom perlu ikut disuntikkan ke halaman admin (dashboard) juga, atau dashboard tetap pakai palet netral shadcn default agar konsisten dipakai admin dari desa mana pun? Default: hanya UI publik yang mengikuti warna kustom; area `/admin/**` tetap netral.
