# Setup Supabase — Desa Sita (Fase 1)

Fase 1 (lihat PRD §13) baru mencakup **fondasi baca-saja**: skema, RLS, dan
seed data. Belum ada dashboard admin/login — itu Fase 2.

## Menghubungkan project

1. Buat project baru di [supabase.com](https://supabase.com/dashboard).
2. Buka **SQL Editor**, jalankan berurutan:
   - `migrations/0001_schema.sql`
   - `migrations/0002_rls.sql`
   - `migrations/0003_triggers.sql`
   - `seed.sql`
3. Salin `.env.example` di root project ke `.env.local`, isi dari
   **Project Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Jalankan `npm run dev` — situs publik otomatis membaca dari Supabase.

Selama `.env.local` belum diisi, semua halaman tetap tampil memakai data
fallback di `src/lib/data/*.ts` (lihat `src/lib/queries/helpers.ts`), jadi
`next build` tidak pernah gagal karena Supabase belum terhubung.

## Kalau pakai Supabase CLI + Docker (opsional)

Tidak wajib untuk Fase 1, tapi kalau mau develop offline:

```bash
brew install supabase/tap/supabase   # atau npm i -g supabase
supabase init
supabase start
supabase db reset   # menjalankan migrations/ + seed.sql otomatis
```

## Urutan data riil menggantikan placeholder

Beberapa baris seed sengaja ditandai `(Menunggu data)` / `nama = null`
(aparatur, BPD, riwayat kepala desa) karena nama personel tidak boleh
ditebak. Update lewat SQL Editor manual sampai dashboard admin (Fase 2) siap:

```sql
update bpd_anggota set nama = 'Nama Sebenarnya' where jabatan = 'Ketua';
```
