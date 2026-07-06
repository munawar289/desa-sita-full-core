# Situs Resmi Desa Sita

Situs resmi **Desa Sita**, Kecamatan Rana Mese, Kabupaten Manggarai Timur, NTT.
Aplikasi web full-stack untuk menyajikan **data & statistik desa yang mutakhir dan
bisa diverifikasi**, plus dashboard admin untuk mengelolanya tanpa perlu developer.

Proyek ini menggantikan situs lama (HTML statis + Google Sheets) supaya data punya
jejak audit (siapa mengubah apa, kapan), pengaduan warga tersimpan ke database, dan
angka statistik selalu menampilkan indikator "terakhir diperbarui".

> Ringkasan produk lengkap ada di [prd.md](prd.md).

## Fitur Utama

- **Halaman publik** — profil desa, data & statistik (kependudukan, ekonomi,
  pendidikan, kesehatan, keamanan-kelembagaan), pemerintahan, lembaga desa,
  dan rencana pengembangan. Semua dilengkapi grafik interaktif.
- **Dashboard admin** — login dengan role (`admin` / `operator`) untuk CRUD
  statistik, aparatur, lembaga, komoditas, dan data wilayah. Setiap perubahan
  tercatat di audit log.
- **Form pengaduan warga** — tersimpan ke database, bukan sekadar kartu statis.
- **Mode fallback tanpa Supabase** — selama variabel Supabase belum diisi, situs
  otomatis memakai data contoh di [src/lib/data/](src/lib/data/) sehingga
  `npm run dev` dan `npm run build` tetap jalan. Cocok untuk mulai ngoprek cepat.

## Teknologi

| Bagian | Teknologi |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) + React 19 |
| Bahasa | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com) (Radix UI) |
| Grafik | [Recharts](https://recharts.org) |
| Backend & DB | [Supabase](https://supabase.com) (Postgres, Auth, RLS) |
| Validasi | [Zod](https://zod.dev) |
| Deploy | [Vercel](https://vercel.com) |

## Prasyarat

- **Node.js 18.18+** (disarankan versi LTS terbaru) dan npm.
- (Opsional) Akun [Supabase](https://supabase.com) — hanya perlu kalau ingin data
  asli & dashboard admin. Tanpa ini pun situs tetap jalan dengan data contoh.

## Cara Menjalankan (Quick Start)

```bash
# 1. Install dependency
npm install

# 2. Siapkan environment variable (boleh dibiarkan kosong dulu)
cp .env.example .env.local

# 3. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser. Halaman
otomatis ter-update saat kamu mengedit file.

Untuk pertama kali, **kamu tidak perlu Supabase** — situs langsung tampil pakai
data contoh. Lanjut ke bagian di bawah kalau butuh data asli & login admin.

## Menghubungkan Supabase (opsional)

Diperlukan hanya untuk data asli dan dashboard admin. Langkah lengkap ada di
[supabase/README.md](supabase/README.md). Ringkasnya:

1. Buat project baru di [dashboard Supabase](https://supabase.com/dashboard).
2. Buka **SQL Editor**, jalankan berurutan:
   `migrations/0001_schema.sql` → `0002_rls.sql` → `0003_triggers.sql` →
   `0004_statistik_lanjutan.sql` → `seed.sql` (lalu `seed_lanjutan_*.sql`).
3. Isi [.env.local](.env.example) dari **Project Settings → API**:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...   # rahasia — jangan diberi prefix NEXT_PUBLIC_
   ```

4. Restart `npm run dev`. Situs publik otomatis membaca dari Supabase.

**Membuat akun admin:** buat user lewat **Authentication → Users** di dashboard
Supabase, lalu tambahkan barisnya di tabel `profiles` dengan `role` = `admin`.
Login di [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Perintah yang Tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server (hot reload) |
| `npm run build` | Build untuk production |
| `npm run start` | Menjalankan hasil build production |
| `npm run lint` | Cek kualitas kode dengan ESLint |

## Struktur Folder

```
src/
├── app/                  # Halaman & routing (App Router)
│   ├── page.tsx          # Beranda
│   ├── data-desa/        # Halaman data & statistik publik
│   ├── profil-desa/      # Profil, sejarah, wilayah
│   ├── layanan/          # Layanan & form pengaduan
│   └── admin/            # Dashboard admin (login + CRUD)
├── components/           # Komponen React (ui, layout, statistik, admin, dll)
└── lib/
    ├── data/             # Data fallback (dipakai saat Supabase kosong)
    ├── queries/          # Query baca ke Supabase
    ├── actions/          # Server Actions (tulis/CRUD + auth)
    ├── validation/       # Skema Zod
    └── supabase/         # Konfigurasi klien Supabase
supabase/                 # Migrations & seed SQL
docs/                     # Spesifikasi & PRD teknis
```

## Deploy

Cara termudah adalah lewat [Vercel](https://vercel.com/new). Import repo ini,
lalu isi environment variable yang sama seperti di `.env.local` pada
**Project Settings → Environment Variables**. Lihat
[dokumentasi deploy Next.js](https://nextjs.org/docs/app/building-your-application/deploying)
untuk detail.
