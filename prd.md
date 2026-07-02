# PRD — Situs Resmi Desa Sita (Next.js + Tailwind + Supabase + Vercel)

**Versi:** 1.0
**Status:** Draft untuk direview
**Pemilik produk:** Pemerintah Desa Sita, Kecamatan Rana Mese, Kabupaten Manggarai Timur, NTT

---

## 1. Ringkasan

Membangun ulang situs resmi Desa Sita dari static site (HTML/CSS/JS + Google Sheets) menjadi aplikasi web full-stack, supaya:
- Data **statistik desa selalu mutakhir dan bisa diverifikasi** — dikelola lewat dashboard admin sungguhan dengan autentikasi dan hak akses bertingkat, tercatat kapan dan oleh siapa terakhir diubah — bukan lagi edit spreadsheet manual tanpa jejak audit.
- **Pengaduan warga** tersimpan ke database dengan alur status, bukan sekadar kartu informasi statis.
- Situs bisa menampilkan **foto/galeri asli** (lewat Supabase Storage), bukan lagi ilustrasi SVG dekoratif karena keterbatasan hosting statis.
- Fondasi teknis siap dikembangkan lebih lanjut (RPJM, LPPD, IDM, layanan surat online, dll — kategori yang untuk saat ini sengaja tidak masuk lingkup v1).

> **Catatan revisi:** layanan surat online sengaja **tidak masuk lingkup v1** — fokus utama rilis pertama adalah penyajian data statistik yang mutakhir dan bisa dipercaya. Surat online dipindah ke kandidat fase berikutnya (lihat §5.2).

## 2. Latar Belakang

Versi sebelumnya (static HTML + Google Sheets sebagai database, Cloudflare Pages sebagai hosting) berhasil membuktikan konsep dan dipakai untuk meyakinkan pemerintah desa bahwa situs data terbuka itu penting. Namun punya keterbatasan struktural:
- Update data lewat spreadsheet mentah atau Apps Script — tidak ada validasi input, tidak ada log siapa mengubah apa.
- Tidak ada tempat menyimpan pengajuan warga (surat, pengaduan) — hanya ditampilkan sebagai kartu informasi, prosesnya tetap manual/offline sepenuhnya.
- Tidak bisa menyimpan gambar asli.
- Tidak ada manajemen banyak pengguna dengan peran berbeda (Kepala Desa vs Sekdes vs Operator, misalnya).

## 3. Tujuan & Metrik Keberhasilan

| Tujuan | Metrik |
|---|---|
| Data statistik selalu mutakhir | 100% angka statistik punya `updated_at` < 90 hari; update dilakukan tanpa bantuan developer |
| Data bisa dipercaya | Setiap perubahan statistik tercatat di audit log (siapa, kapan, nilai lama → baru) |
| Situs cepat & bisa ditemukan | Lighthouse Performance & SEO ≥ 90, ter-index Google dalam 2 minggu setelah go-live |
| Aman | Tidak ada insiden akses tidak sah ke dashboard dalam 6 bulan pertama |

## 4. Target Pengguna

| Persona | Kebutuhan |
|---|---|
| **Warga & masyarakat umum** | Cari info desa, cek statistik, ajukan surat/pengaduan, baca berita |
| **Operator desa** (staf admin harian) | Update statistik, tulis berita, kelola galeri, tindak lanjuti surat/pengaduan masuk |
| **Kepala Desa / Sekdes** | Lihat ringkasan aktivitas, kelola data pemerintahan/aparatur, kelola akun operator |
| **Pengunjung institusional** (kecamatan, kabupaten, peneliti) | Akses data terbuka yang akurat dan bisa diverifikasi |

## 5. Lingkup (Scope)

### 5.1 Dalam lingkup (v1)
- Seluruh halaman publik yang sudah dirancang sebelumnya (lihat §7).
- Dashboard admin dengan login & role-based access.
- **CRUD statistik desa — ini prioritas utama v1**, termasuk indikator "terakhir diperbarui" yang tampil di halaman publik supaya pengunjung tahu data itu segar atau sudah lama.
- CRUD berita/pengumuman + galeri foto.
- CRUD data kelembagaan, aparatur, komoditas (yang sebelumnya hardcoded di HTML).
- Form pengaduan warga — tersimpan ke database, ada antrean status di dashboard.
- Audit log untuk semua perubahan data lewat dashboard.

### 5.2 Di luar lingkup (v1) — kandidat fase berikutnya
- **Layanan surat online** (pengajuan surat keterangan, dsb) — sengaja ditunda; fokus v1 adalah data statistik yang solid dulu.
- Pembuatan/penandatanganan dokumen digital otomatis (surat jadi PDF resmi bertanda tangan digital).
- Integrasi SIDESA/OpenSID atau sistem pemerintah lain.
- Notifikasi WhatsApp/SMS otomatis ke pemohon.
- Multi-bahasa.
- RPJM/RKP, LPPD, IDM (kontennya belum ada — tetap ditandai "segera hadir" seperti versi sebelumnya, tapi sekarang strukturnya siap diisi via dashboard begitu dokumennya ada).

## 6. Tech Stack

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | SSR/SSG untuk SEO, Server Actions untuk mutasi tanpa API layer terpisah |
| Styling | **Tailwind CSS** | Konsisten dengan design token yang sudah dirancang (warna kopi/kakao/sawah) |
| Database & Auth | **Supabase** (Postgres + Auth + Storage) | Auth siap pakai, RLS untuk keamanan di level database, Storage untuk galeri |
| Hosting | **Vercel** | Native untuk Next.js, preview deployment per PR, edge caching otomatis |
| Validasi form | **Zod** | Validasi skema konsisten di client & server |
| Rich text (opsional) | **Tiptap** atau textarea markdown sederhana untuk isi berita | Fleksibel tanpa WYSIWYG berat |

### Prinsip arsitektur
- **Server Components secara default**, Client Components hanya untuk elemen interaktif (form, dropdown nav, dashboard).
- **Row Level Security (RLS) aktif di semua tabel** — jangan mengandalkan pengecekan otorisasi di kode aplikasi saja. Kunci utama keamanan Supabase ada di RLS, karena Supabase client bisa dipanggil langsung dari browser.
- **Server Actions** untuk semua mutasi data dari dashboard (bukan REST API terpisah), kecuali ada kebutuhan konsumsi API dari luar di masa depan.
- Data publik dibaca lewat **Server Components + fetch langsung ke Supabase** saat build/request time (ISR — Incremental Static Regeneration) untuk performa, bukan client-side fetching.

## 7. Sitemap & Fitur Halaman Publik

Struktur mengikuti apa yang sudah divalidasi di versi static, tetap dipertahankan supaya navigasi yang sudah dikenal warga tidak berubah drastis.

| Route | Halaman | Sumber data |
|---|---|---|
| `/` | Beranda — hero, ringkasan potensi, statistik utama, teaser berita | `statistik`, `berita` |
| `/profil-desa` | Hub profil | statis + link |
| `/profil-desa/sejarah` | Sejarah & daftar kepala desa | `kepala_desa_riwayat` |
| `/profil-desa/wilayah` | Batas wilayah, luas lahan, iklim, komoditas, peternakan | `komoditas`, `peternakan`, `wilayah_info` |
| `/pemerintahan` | Struktur, aparatur, BPD, (Visi & Misi bila sudah ada) | `aparatur`, `bpd_anggota` |
| `/lembaga-desa` | PKK, Posyandu, Kelompok Tani, dst | `lembaga` |
| `/data-desa` | Hub statistik | `statistik` |
| `/data-desa/wilayah-administratif` | Data administratif & kepadatan | `statistik`, `wilayah_info` |
| `/data-desa/jenis-kelamin` | Komposisi gender | `statistik` |
| `/data-desa/kelompok-umur` | Sebaran usia | `statistik_kelompok_umur` |
| `/data-desa/pendidikan` | Tingkat pendidikan | `statistik_pendidikan` |
| `/data-desa/sarana-prasarana` | Fasilitas desa | `sarana_prasarana` |
| `/berita` | Daftar berita/pengumuman | `berita` |
| `/berita/[slug]` | Detail berita | `berita` |
| `/layanan` | Info layanan + tautan ke form pengaduan | statis |
| `/layanan/pengaduan` | **Form pengaduan warga** | tulis ke `pengaduan` |
| `/rencana-pengembangan` | Kategori yang belum tersedia (surat online, RPJM, LPPD, IDM) | statis |

## 8. Dashboard Admin (`/admin`)

| Route | Fungsi | Role minimum |
|---|---|---|
| `/admin/login` | Login (email + password, via Supabase Auth) | — |
| `/admin` | Ringkasan: statistik yang sudah usang (>90 hari), pengaduan baru, berita terakhir | operator |
| `/admin/statistik` | **CRUD nilai statistik, dikelompokkan per kategori — halaman inti dashboard** | operator |
| `/admin/berita` | CRUD berita + upload gambar cover | operator |
| `/admin/galeri` | Upload/hapus foto galeri | operator |
| `/admin/lembaga` | CRUD data lembaga desa | operator |
| `/admin/pemerintahan` | CRUD aparatur & BPD | admin |
| `/admin/layanan/pengaduan` | Antrean pengaduan, ubah status, tanggapan | operator |
| `/admin/pengguna` | Kelola akun staf & peran | admin |
| `/admin/log` | Audit log seluruh perubahan | admin |

### 8.1 Peran (roles)
- **admin** — akses penuh, termasuk kelola pengguna dan data pemerintahan.
- **operator** — akses harian: statistik, berita, galeri, lembaga, layanan masuk. Tidak bisa ubah data aparatur/pengguna.

Role disimpan di tabel `profiles`, dicek lewat RLS policy di setiap tabel (§9.3).

## 9. Data Model (Supabase / Postgres)

### 9.1 Skema inti

```sql
-- Profil pengguna & peran, terhubung ke auth.users bawaan Supabase
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama_lengkap text not null,
  role text not null check (role in ('admin', 'operator')),
  created_at timestamptz default now()
);

-- Statistik utama (menggantikan sheet "Statistik")
create table statistik (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  key text not null,
  label text not null,
  value text not null,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now(),
  unique (category, key)
);

-- Sebaran usia
create table statistik_kelompok_umur (
  id uuid primary key default gen_random_uuid(),
  kelompok_usia text not null,     -- "0-4 tahun"
  jumlah int not null,
  urutan int not null
);

-- Tingkat pendidikan
create table statistik_pendidikan (
  id uuid primary key default gen_random_uuid(),
  tingkat text not null,
  jumlah int not null,
  urutan int not null
);

-- Riwayat kepala desa
create table kepala_desa_riwayat (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  periode_mulai int not null,
  periode_selesai int,             -- null = masih menjabat
  keterangan text,                 -- "Penjabat Antar Waktu", dst
  urutan int not null
);

-- Aparatur desa saat ini
create table aparatur (
  id uuid primary key default gen_random_uuid(),
  nama text,
  jabatan text not null,
  pendidikan text,
  urutan int not null
);

-- Anggota BPD
create table bpd_anggota (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jabatan text not null,           -- Ketua/Wakil/Sekretaris/Anggota
  pendidikan text,
  urutan int not null
);

-- Lembaga desa (PKK, Posyandu, Kelompok Tani, dst)
create table lembaga (
  id uuid primary key default gen_random_uuid(),
  kategori text not null,          -- kemasyarakatan | ekonomi | pendidikan | keamanan
  nama text not null,
  dasar_hukum text,
  jumlah_pengurus int,
  keterangan text,
  urutan int not null
);

-- Komoditas pertanian/perkebunan
create table komoditas (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  luas_ha numeric,
  hasil_panen text,
  urutan int not null
);

-- Peternakan
create table peternakan (
  id uuid primary key default gen_random_uuid(),
  jenis_ternak text not null,
  populasi int,
  jumlah_pemilik int,
  urutan int not null
);

-- Sarana & prasarana
create table sarana_prasarana (
  id uuid primary key default gen_random_uuid(),
  kategori text not null,          -- pendidikan | kesehatan | peribadatan | dst
  nama text not null,
  jumlah text,                     -- teks bebas: "3 unit", "562 siswa"
  urutan int not null
);

-- Info wilayah naratif (batas, luas, iklim — konten prosa, bukan tabel)
create table wilayah_info (
  id uuid primary key default gen_random_uuid(),
  section text not null unique,    -- "batas_wilayah", "iklim", "orbitasi"
  konten text not null,            -- boleh markdown sederhana
  updated_at timestamptz default now()
);

-- Berita & pengumuman
create table berita (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  slug text not null unique,
  kategori text,
  ringkasan text,
  konten text not null,
  cover_image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references profiles(id),
  published_at timestamptz,
  created_at timestamptz default now()
);

-- Galeri foto
create table galeri (
  id uuid primary key default gen_random_uuid(),
  judul text,
  image_url text not null,
  urutan int,
  created_at timestamptz default now()
);

-- Pengaduan warga
create table pengaduan (
  id uuid primary key default gen_random_uuid(),
  nama text,                        -- boleh kosong (anonim)
  no_kontak text,
  kategori text,
  isi text not null,
  status text not null default 'baru' check (status in ('baru', 'ditindaklanjuti', 'selesai')),
  tanggapan text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Audit log
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  table_name text not null,
  record_id uuid,
  action text not null,             -- insert | update | delete
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz default now()
);
```

### 9.2 Catatan desain skema
- **`urutan` (integer) dipakai di banyak tabel** supaya admin bisa mengatur urutan tampil (drag-and-drop di dashboard nanti), bukan bergantung urutan insert.
- **`updated_at` di tabel `statistik` adalah tulang punggung fitur "data mutakhir"** — dipakai untuk badge "Diperbarui X hari lalu" di halaman publik, dan untuk daftar "statistik usang" di ringkasan dashboard (§8).
- Tabel `statistik` tetap mempertahankan pola `category.key` dari versi Sheets supaya konsep dan mental model untuk admin tidak berubah drastis saat transisi.

### 9.3 Contoh RLS Policy

```sql
alter table statistik enable row level security;

-- Publik boleh membaca
create policy "statistik_public_read"
  on statistik for select
  using (true);

-- Hanya operator/admin yang login boleh mengubah
create policy "statistik_operator_write"
  on statistik for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'operator')
    )
  );
```
Pola yang sama diterapkan ke semua tabel konten, dengan penyesuaian: tabel `pengaduan` mengizinkan **INSERT publik tanpa login** (form warga), tapi SELECT/UPDATE hanya untuk operator/admin. Tabel `pengguna`/`profiles` hanya bisa diubah oleh role `admin`.

## 10. Autentikasi & Otorisasi

- **Supabase Auth**, metode email + password untuk staf (bukan magic link, supaya tidak bergantung akses email real-time saat login — desa dengan koneksi terbatas).
- Setelah user baru dibuat lewat Supabase Auth, **trigger otomatis membuat baris di `profiles`** dengan role default `operator`; admin bisa naikkan jadi `admin` lewat dashboard `/admin/pengguna`.
- Middleware Next.js mengecek sesi di setiap request ke `/admin/*`, redirect ke `/admin/login` kalau belum login.
- Pengecekan role dilakukan **dua kali**: di middleware/Server Component (UX — sembunyikan menu yang tidak relevan) **dan** di RLS database (keamanan sesungguhnya). Jangan pernah mengandalkan pengecekan di sisi client saja.

## 11. Kebutuhan Non-Fungsional

### 11.1 Performa
- Skor Lighthouse Performance ≥ 90 di halaman utama (mobile).
- Gunakan `next/image` untuk semua gambar (galeri, cover berita) — otomatis optimasi ukuran & format.
- Halaman publik pakai ISR (revalidate tiap beberapa menit) — bukan full client-side fetching seperti versi static+Sheets sebelumnya.

### 11.2 SEO
- Metadata per halaman (title, description, Open Graph) lewat Next.js Metadata API.
- `sitemap.xml` dan `robots.txt` otomatis (built-in Next.js).
- Structured data (`schema.org/GovernmentOrganization`) di halaman Beranda.

### 11.3 Keamanan & Privasi Data
- **Data kontak pada pengaduan (nama, no. kontak bila diisi) tetap data pribadi** — akses ke tabel `pengaduan` dibatasi role operator/admin lewat RLS, tidak pernah diekspos ke endpoint publik. Opsi mengirim secara anonim (kolom `nama` boleh kosong) tetap dipertahankan.
- Rate limiting pada form pengaduan untuk mencegah spam — pakai Vercel/Supabase edge function sederhana atau captcha ringan (misalnya Cloudflare Turnstile, gratis).
- Environment variable sensitif (`SUPABASE_SERVICE_ROLE_KEY`) hanya dipakai di Server Actions/Route Handlers, **tidak pernah** diekspos ke client bundle.
- Backup otomatis database (fitur bawaan Supabase, aktifkan point-in-time recovery bila tersedia di paketnya).

### 11.4 Aksesibilitas
- Kontras warna WCAG AA (palet kopi/kakao/krem yang sudah dipakai sebelumnya sudah diuji cukup kontras, pertahankan).
- Semua form punya label yang terasosiasi (`<label for>`), pesan error yang jelas per field.
- Navigasi bisa dioperasikan penuh lewat keyboard.

## 12. Migrasi Data

Data yang sudah diekstrak dari dokumen Profil Desa Sita (statistik, komoditas, peternakan, kelembagaan, sejarah, aparatur — semua yang sudah dipakai di versi static sebelumnya) di-seed ke Supabase lewat migration script satu kali, bukan diinput ulang manual. Berupa file `seed.sql` yang mengisi seluruh tabel di §9 dengan data yang sudah tervalidasi dari versi sebelumnya.

## 13. Fase Pengerjaan

| Fase | Cakupan | Keluaran |
|---|---|---|
| **1. Fondasi** | Setup Next.js + Tailwind + Supabase project + skema database + RLS + seed data | Situs publik baca-saja (semua halaman §7) tayang di Vercel |
| **2. Auth & Dashboard statistik** | Login, role, **CRUD statistik + badge "terakhir diperbarui"**, audit log | Operator bisa update statistik lewat dashboard, publik lihat kapan data terakhir berubah |
| **3. Konten dinamis** | CRUD berita + galeri (Storage) + CRUD lembaga/aparatur | Berita & galeri publik aktif |
| **4. Layanan pengaduan** | Form pengaduan + antrean admin | Warga bisa mengirim pengaduan online |
| **5. Pengerasan (hardening)** | Rate limiting, captcha, review keamanan RLS, uji aksesibilitas | Siap dianggap produksi penuh |

> Fase 2 sengaja diprioritaskan di awal (bukan fase 3/4) karena statistik mutakhir adalah tujuan utama v1 — berita, galeri, dan pengaduan dibangun setelah fondasi data statistik solid.

## 14. Risiko & Pertanyaan Terbuka

- **Siapa yang akan jadi role `admin` vs `operator`?** Perlu keputusan dari pemerintah desa sebelum fase 2 mulai.
- **Siapa yang bertanggung jawab update statistik secara rutin?** Fitur badge "terakhir diperbarui" hanya berguna kalau ada komitmen SDM untuk benar-benar mengecek dan mengupdate angka — kalau tidak, badge itu justru akan menonjolkan bahwa data sudah usang.
- **Siapa yang bertanggung jawab menulis berita rutin?** Sama seperti catatan di versi sebelumnya, jangan aktifkan fitur berita ke publik sebelum ada kepastian ini.
- Paket gratis Supabase punya batas proyek non-aktif (auto-pause setelah tidak ada aktivitas dalam periode tertentu) — perlu dicek kebijakan terbaru saat provisioning, supaya situs tidak tiba-tiba "tidur" karena jarang diakses.