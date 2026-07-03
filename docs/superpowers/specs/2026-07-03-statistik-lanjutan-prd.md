# PRD — Statistik Lanjutan (Prodeskel) Desa Sita

**Tanggal:** 2026-07-03
**Status:** Draft untuk dieksekusi
**Scope:** Perluasan data statistik publik + dashboard admin. **Tidak termasuk** Berita, Galeri, Form Pengaduan (next pengembangan terpisah).

---

## 1. Latar Belakang & Tujuan

Sumber data: `Template Ragam Data dan Template Tabel daesa Sita.xlsx` (di root project) — 14 sheet, mengikuti struktur **Ragam Data Profil Desa/Kelurahan (Prodeskel) sesuai Permendagri 12 Tahun 2007**.

Sheet pertama (`Lampiran Pertanyaan DESA III.1.`) adalah checklist 37 kategori data wajib desa. Saat ini baru **2 dari 37 (5,4%)** yang tersedia di situs. Tujuan fase ini: menaikkan cakupan itu signifikan dan menyajikannya dengan kualitas UI/UX yang membuat Desa Sita jadi **desa percontohan penyajian data statistik** — bukan sekadar tabel angka, tapi transparan dan mudah dipahami publik.

**Prinsip non-negosiable:** jangan pernah mengarang angka kependudukan/kesehatan/ekonomi. Domain yang datanya kosong di source file harus tampil `EmptyState` di publik sampai admin mengisi data riil lewat dashboard — beda dengan placeholder nama pejabat di Fase 1 yang eksplisit ditandai sementara, data statistik di sini representasi klaim faktual pemerintah desa.

---

## 2. Ringkasan Isi Sumber Data

| Sheet | Domain | Status data di source |
|---|---|---|
| 1 | Checklist Prodeskel (37 kategori) | Referensi (2/37 tersedia) |
| 2 | Pendidikan Masyarakat | Sebagian terisi |
| 3 | Kesehatan Masyarakat | Sebagian besar **kosong** |
| 4 | Aset Ekonomi Masyarakat | Sebagian terisi |
| 5 | Struktur Mata Pencaharian | Terisi |
| 6 | Pendapatan Riil (per sektor) | **Kosong** |
| 7 | Produk Domestik Bruto (per sektor) | **Kosong** |
| 8 | Kesejahteraan Keluarga (BKKBN) | **Kosong** |
| 9 | Data Penduduk (gender, umur, per-RT) | Terisi |
| 10 | Keluarga (per-RT) | Terisi |
| 11 | Pengangguran (per-RT) | **Kosong** |
| 12 | Keamanan & Ketertiban | Terisi |
| 13 | Lembaga Kemasyarakatan | Terisi |
| 14 | Pemerintahan Desa | **Kosong total** |

**Catatan penting — data ini menggantikan sebagian data Fase 1:**
- Total penduduk riil = 1.627 (L) + 1.632 (P) = **3.259 jiwa** — beda dari angka 3.192 yang di-seed Fase 1 (waktu itu diambil dari situs referensi lama, bukan sumber resmi). **Ganti dengan angka ini.**
- Jumlah KK riil = **873** (Fase 1 pakai 859 — ganti).
- Kelompok umur di source pakai rentang 10 tahunan (0-10, 11-20, ..., 81-90) — **beda struktur** dari `statistik_kelompok_umur` Fase 1 (rentang 5 tahunan). Ganti isi tabel, bukan tambah.
- Tingkat pendidikan di source: BLM SEKOLAH, PAUD, SD, SMP, SMA, DIII/DIV, S1/S2 — beda label dari `statistik_pendidikan` Fase 1. Ganti isi tabel.
- Desa masih terstruktur Dusun (4) → RT (16) → RW (8) sesuai sheet Lembaga Kemasyarakatan. `jumlah_dusun=4` di kategori `wilayah` tetap valid; RT & RW adalah level baru, bukan pengganti.

---

## 3. Data Model (Backend)

### 3.1 Prinsip

Sebagian besar domain baru adalah pasangan label→angka sederhana — **tidak butuh tabel baru**, cukup baris baru di tabel `statistik` (category/key/label/value) yang sudah ada dari Fase 1. Admin CRUD, RLS, dan query layer generik sudah berfungsi untuk pola ini tanpa perubahan kode.

Hanya 2 kebutuhan struktural yang butuh tabel baru:
1. **Breakdown per-RT** (16 RT), dipakai berulang di banyak domain (penduduk, keluarga, pengangguran, air bersih, aset tanaman) — butuh dimensi RT yang konsisten.
2. **Breakdown sektor usaha** (17 sektor, dipakai identik oleh PDB & Pendapatan Riil) — butuh nilai numeric asli (bukan text) supaya bisa di-chart/sort dengan benar, dan struktur `kode/nama` yang reusable antara 2 jenis data.

### 3.2 Tabel baru

```sql
-- Dimensi RT (16 baris)
create table wilayah_rt (
  id uuid primary key default gen_random_uuid(),
  nomor text not null unique,   -- "001".."016"
  nama text not null,           -- "RT 001"
  urutan int not null
);

-- Fakta per-RT lintas domain (penduduk, keluarga, pengangguran, air_bersih, aset_tanaman)
create table statistik_rt (
  id uuid primary key default gen_random_uuid(),
  category text not null,       -- 'penduduk' | 'keluarga' | 'pengangguran' | 'air_bersih' | 'aset_tanaman'
  rt_id uuid not null references wilayah_rt(id) on delete cascade,
  value numeric,                 -- dipakai category single-metric (penduduk/keluarga/pengangguran)
  detail jsonb,                  -- dipakai category multi-metric:
                                  --   air_bersih: {"pdam": 44, "ledeng": 0}
                                  --   aset_tanaman: {"kopi": 0, "cengkeh": 0, "kakao": 0, "kemiri": 0}
  updated_by uuid references profiles(id),
  updated_at timestamptz default now(),
  unique (category, rt_id)
);

-- PDB & Pendapatan Riil per sektor usaha (17 sektor × 2 jenis = 34 baris)
create table statistik_sektor_usaha (
  id uuid primary key default gen_random_uuid(),
  jenis text not null check (jenis in ('pdb', 'pendapatan_riil')),
  kode text not null,           -- 'A'..'U' (termasuk gabungan "M,N" dan "R,S,T,U" apa adanya dari source)
  nama text not null,
  nilai_ribu_rupiah numeric,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now(),
  urutan int not null,
  unique (jenis, kode)
);
```

RLS: pola identik tabel konten Fase 1 (`statistik_public_read` + `statistik_staff_write` via `is_staff()`), ditambahkan di migration baru `0004_statistik_lanjutan.sql`. `wilayah_rt` read-only publik (tidak perlu CRUD admin — 16 RT tetap, kalau berubah edit manual via SQL Editor).

### 3.3 Kategori baru di tabel `statistik` (tidak perlu migration, hanya seed/insert)

| Category | Key contoh | Sumber sheet | Status |
|---|---|---|---|
| `kesejahteraan_keluarga` | pra_sejahtera, sejahtera_1..3_plus | Kesejahteraan Keluarga | Kosong |
| `mata_pencaharian` | belum_kerja, petani, honorer, pns, pensiunan | Struktur Mata Pencaharian | **Terisi** |
| `rasio_guru_murid` | guru, murid | Pendidikan | Sebagian |
| `lembaga_pendidikan_negeri` | paud, tk, sd, smp, sma, smk, pt | Pendidikan | Sebagian |
| `lembaga_pendidikan_swasta` | paud, tk, sd, smp, sma, smk, pt | Pendidikan | Sebagian |
| `kualitas_bayi` | lahir_sehat, risiko_stunting | Kesehatan | Kosong |
| `kualitas_ibu_hamil` | kehamilan_sehat, kehamilan_patologis, risiko_anemia, risiko_kek, risiko_4t | Kesehatan | Kosong |
| `kualitas_persalinan` | persalinan_sehat, persalinan_risiko | Kesehatan | Kosong |
| `wabah_penyakit` | dbd, malaria, tbc, gatal_gatal, lainnya | Kesehatan | Kosong |
| `gizi_balita` | gizi_baik, gizi_kurang, gizi_buruk | Kesehatan | Kosong |
| `imunisasi` | dpt_hb_hib3, polio_4, campak_mr, hepatitis, lainnya | Kesehatan | Kosong |
| `kb_jangka_panjang` | ius, implan, mow, mop | Kesehatan | Kosong |
| `kb_non_jangka_panjang` | suntik, pil, kondom, lainnya | Kesehatan | Kosong |
| `sarana_kesehatan` | posyandu, puskesmas, poskesdes, polindes, toko_obat | Kesehatan | **Terisi** |
| `keamanan` | linmas | Keamanan & Ketertiban | **Terisi** |
| `lembaga_kemasyarakatan` | rt, rw, pkk, posyandu, lembaga_adat, dusun | Lembaga Kemasyarakatan | **Terisi** |
| `aset_tanah` | tanah_desa | Aset Ekonomi | **Terisi** |
| `aset_transportasi` | (sample "Desa Sita": 12 — ambigu, konfirmasi arti barisnya ke pemdes) | Aset Ekonomi | Sebagian/ambigu |
| `aset_sarana_produksi` | (sample, sama seperti di atas) | Aset Ekonomi | Sebagian/ambigu |
| `aset_perumahan` | jumlah_rumah | Aset Ekonomi | **Terisi** |

Rows lengkap + nilai riil ada di sheet asli — jangan re-derive dari tabel di atas, buka file `.xlsx`-nya langsung saat implementasi.

### 3.4 Tabel existing yang datanya perlu **diganti** (bukan ditambah)

- `statistik` category `kependudukan`: `total_penduduk` → 3.259, `jumlah_kk` → 873, `laki_laki` → 1.627, `perempuan` → 1.632.
- `statistik_kelompok_umur`: ganti seluruh baris ke rentang 10-tahunan sesuai source (0-10 s/d 81-90).
- `statistik_pendidikan`: ganti seluruh baris ke label & angka riil source (BLM SEKOLAH, PAUD, SD, SMP, SMA, DIII/DIV, S1/S2).
- `statistik` category `lembaga_desa`/`wilayah`: tambah `jumlah_rt=16`, `jumlah_rw=8` (jangan hapus `jumlah_dusun=4`, tetap relevan — struktur wilayah Dusun→RT).

---

## 4. UI/UX

### 4.1 Restrukturisasi navigasi `/data-desa`

Dari 5 link flat (Fase 1) menjadi hub berkelompok mengikuti bab Prodeskel:

1. **Kependudukan** — Penduduk (gender + umur + per-RT), Keluarga (per-RT), Pengangguran (per-RT)
2. **Ekonomi** — Kesejahteraan Keluarga, Struktur Mata Pencaharian, PDB, Pendapatan Riil, Aset Ekonomi
3. **Pendidikan** — tingkat pendidikan, rasio guru-murid, lembaga pendidikan (perluas halaman existing)
4. **Kesehatan** — seluruh sub-kategori (bisa satu halaman panjang dengan section, atau dipecah — putuskan saat implementasi berdasar volume konten aktual)
5. **Keamanan & Kelembagaan** — Linmas + Lembaga Kemasyarakatan
6. **Wilayah Administratif** — existing, tambah RT/RW
7. **Sarana & Prasarana** — existing, tetap

Route persis (nama folder dsb) adalah keputusan implementasi, tidak dikunci di sini — ikuti pola existing `/data-desa/<slug>/page.tsx` per Fase 1.

### 4.2 Fitur unggulan: Indeks Ketersediaan Data Prodeskel

Widget publik yang mengambil literal isi sheet 1 (checklist 37 kategori): tampilkan "X dari 37 kategori data Prodeskel tersedia" sebagai stat besar di hub `/data-desa`, dengan breakdown per-bab (list 37 item, status ✓/○ per kategori). Ini fitur pembeda utama untuk positioning "desa percontohan" — transparansi tentang apa yang BELUM ada juga bagian dari kredibilitas, bukan cuma yang sudah ada.

Implementasi: tabel kecil baru (atau hardcode array 37 item di `lib/data` karena daftar Permendagri ini tidak berubah) dengan flag `tersedia: boolean` yang di-cross-check terhadap kategori statistik yang benar-benar punya data (`value is not null`) saat render — supaya indeksnya otomatis naik ketika admin mengisi data baru, bukan manual toggle.

### 4.3 Pola komponen untuk data per-RT (16 baris)

- Bar chart horizontal (16 bar, sorted descending) — bukan tabel polos, biar langsung kelihatan RT mana yang menonjol/tertinggal.
- Tabel di bawahnya tetap ada (sortable, highlightKey tertinggi) — reuse `StatTable` existing.
- Untuk kategori 2 metrik (air_bersih: pdam+ledeng; aset_tanaman: 4 jenis pohon) — grouped bar chart atau tabel multi-kolom, bukan flatten jadi 2 chart terpisah.

### 4.4 Pola komponen untuk sektor usaha (PDB/Pendapatan Riil, 17 baris)

Bar chart horizontal sorted descending (skip kalau semua nilai null → EmptyState). Recharts sudah include komponen `Treemap` — pertimbangkan untuk PDB spesifik kalau datanya sudah terisi dan variasi nilai antar sektor besar (treemap lebih baik dari bar chart untuk >15 kategori dengan skala berbeda jauh).

### 4.5 Kebijakan data kosong

Domain/kategori dengan `value`/`nilai` semuanya null → halaman publik render `<EmptyState message="Data belum tersedia" />` (komponen sudah ada dari Fase 1), **bukan** angka 0 atau dihilangkan diam-diam. Admin tetap bisa lihat & isi form-nya di dashboard meski publik belum menampilkan apa-apa.

---

## 5. Dashboard Admin

- `/admin/statistik` (existing dari Fase 2) otomatis menangani semua category baru di tabel `statistik` tanpa perubahan kode — tapi dengan ~20 category baru, pertimbangkan tambah **search/filter category** di halaman itu (saat ini cuma grouped list, bisa kepanjangan).
- Butuh 2 halaman/section admin baru untuk 2 tabel baru:
  - `/admin/statistik/per-rt` — CRUD `statistik_rt`, di-group per category, tabel 16 baris per category dengan inline edit (pola sama seperti `StatistikRow` Fase 2).
  - `/admin/statistik/sektor-usaha` — CRUD `statistik_sektor_usaha`, toggle jenis (PDB/Pendapatan Riil), tabel 17 baris.
- Audit log: pola sama seperti Fase 2 (`logAudit` helper), tinggal extend `table_name` ke `statistik_rt` dan `statistik_sektor_usaha`.

---

## 6. Fase Pengerjaan

| Kelompok | Cakupan | Keluaran |
|---|---|---|
| **1 — Kependudukan & Ekonomi** | Migration `0004_statistik_lanjutan.sql` (2 tabel baru + RLS), seed data riil (penduduk/keluarga/mata pencaharian/aset tanah&perumahan), ganti data existing yang salah (§3.4), halaman `/data-desa/kependudukan/*` (penduduk+RT, keluarga+RT, pengangguran+RT — EmptyState), halaman `/data-desa/ekonomi/*` (kesejahteraan keluarga — EmptyState, mata pencaharian, PDB — EmptyState, pendapatan riil — EmptyState, aset ekonomi), admin CRUD untuk 2 tabel baru | Domain Kependudukan+Ekonomi live, sebagian EmptyState menanti data admin |
| **2 — Pendidikan, Kesehatan, Keamanan, Kelembagaan, Indeks Prodeskel** | Ganti data pendidikan existing, tambah rasio guru-murid + lembaga pendidikan, halaman Kesehatan (banyak EmptyState — sarana kesehatan & sebagian air bersih yang terisi), halaman Keamanan & Kelembagaan (terisi), restrukturisasi hub `/data-desa` final, widget Indeks Ketersediaan Data Prodeskel | Seluruh 12 domain baru live, fitur Indeks Prodeskel tayang |

Checkpoint di antara kedua kelompok — verifikasi build/typecheck/lint + review visual sebelum lanjut Kelompok 2, mengikuti pola kerja Fase 1/2 sebelumnya.

---

## 7. Yang Tidak Termasuk

- Berita, Galeri, Form Pengaduan (CRUD/tulis-DB) — next pengembangan terpisah, jangan disentuh di fase ini.
- Peta/GIS batas wilayah per-RT (source tidak menyediakan data geospasial, hanya nama+angka).
- Rate limiting/captcha (tidak relevan, tidak ada form publik baru di fase ini).

## 8. Pertanyaan Terbuka (perlu dikonfirmasi ke pemerintah desa sebelum/selama implementasi)

- Baris "Desa Sita: 12" di **Aset Transportasi** & **Aset Sarana Produksi** — apakah itu angka desa-wide (bukan per-RT, beda dari pola tabel aset lain) atau template belum diisi detail per jenis aset? Perlu klarifikasi sebelum di-seed.
- Data **Pengangguran per-RT**, **Kesejahteraan Keluarga**, **PDB**, **Pendapatan Riil**, sebagian besar **Kesehatan**, dan **Pemerintahan Desa** kosong total di source — siapa di pemdes yang bertanggung jawab mengisi lewat dashboard, dan kapan?
- Tabel **Air Bersih per-RT**: entri sumber tidak konsisten (RT 001-013 kolom PDAM terisi, RT 014-016 malah kolom "Air Ledeng" yang terisi, bukan PDAM) — perlu konfirmasi apakah itu memang 2 sumber air berbeda per RT atau salah kolom saat pengisian template.
