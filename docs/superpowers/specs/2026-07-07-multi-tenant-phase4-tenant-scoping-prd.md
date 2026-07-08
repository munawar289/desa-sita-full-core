# PRD — Multi-Tenant Phase 4: Sambungkan Fitur Existing ke Tenant Context

**Tanggal:** 2026-07-07
**Status:** Draft untuk direview
**Scope:** Menyambungkan ~19 tabel bisnis existing + modul auth/membership ke `tenant_id` dari fondasi Phase 3 (lihat `2026-07-07-multi-tenant-foundation-prd.md`, belum diimplementasikan). **Tidak termasuk** membangun fitur `pengaduan` dari nol, tidak menghidupkan `berita`/`galeri`.

---

## 1. Context

Phase 3 (lihat `docs/superpowers/specs/2026-07-07-multi-tenant-foundation-prd.md`, sudah didesain, **belum diimplementasikan**) membangun fondasi: tabel `tenants` + `memberships`, tenant resolver berbasis subdomain di `src/middleware.ts` yang set header `x-tenant-id`/`x-tenant-slug`, dengan fallback aman ke tenant default untuk semua host produksi yang sudah dikenal.

Phase 4 menyambungkan tabel bisnis existing (~19 tabel) dan modul auth/membership ke tenant context tersebut, supaya data benar-benar terisolasi per desa.

**Keputusan yang sudah diambil bersama Anda:** aktifkan resolusi tenant real-time (baca `Host` header via middleware) **sekarang juga** di semua halaman publik — bukan ditunda. Konsekuensinya, root layout (`src/app/layout.tsx`, dipakai SEMUA halaman karena inject tema warna dari `getDesaProfil()`) akan memanggil tenant context di setiap request, yang secara otomatis membuat **seluruh situs publik** (bukan cuma 19 halaman yang tadinya `revalidate=300`, tapi juga 14 halaman statis lainnya) keluar dari static/ISR menjadi full-dynamic — ini konsekuensi mekanis Next.js App Router (dynamic API di layout memaksa seluruh tree di bawahnya dynamic), bukan pilihan implementasi yang bisa dihindari begitu keputusan di atas diambil.

## 2. Temuan Penting yang Mengubah Scope (wajib dibaca sebelum lanjut)

Tervalidasi lewat riset kode langsung — ini bukan asumsi:

1. **`pengaduan` belum diimplementasikan sama sekali di layer aplikasi.** `FormPengaduan.tsx` (`src/components/pengaduan/FormPengaduan.tsx`) murni client-side — submit-nya cuma `console.log`, tidak ada `fetch`/Server Action. Tidak ada `src/lib/actions/pengaduan.ts`, tidak ada halaman admin CRUD-nya. Hanya skema tabel + RLS yang sudah ada di DB. Menyambungkan `pengaduan` ke tenant BUKAN "migrasi tabel existing" seperti modul lain — itu pekerjaan greenfield (bangun Server Action + wiring form dari nol), effort jauh lebih besar. **Keputusan: di luar scope Phase 4** (lihat §7 Modul 4).
2. **`galeri` juga zero-usage** — tidak ada `src/lib/queries/galeri.ts`, tidak ada halaman publik/admin yang memakainya. Kondisinya identik `berita` (dead feature). **Keluarkan dari batch migrasi tabel publik**, gabung ke daftar skip bersama `berita`.
3. **4 unique constraint global akan rusak begitu tenant kedua dibuat** — ini gap paling kritis, bukan sekadar soal isolasi data: `statistik(category, key)`, `wilayah_info(section)`, `statistik_sektor_usaha(jenis, kode)`, `wilayah_rt(nomor)`. Tanpa diubah jadi composite `unique(tenant_id, ...)`, tenant kedua **tidak akan bisa** punya baris `statistik` dengan `key='jumlah_penduduk'` karena tenant pertama sudah memegangnya secara global — akan langsung gagal INSERT, bukan cuma isu keamanan.
4. **`statistik_rt.rt_id → wilayah_rt.id`** adalah FK antar dua tabel yang sama-sama dapat `tenant_id`. FK biasa tidak mencegah baris `statistik_rt` tenant A menunjuk ke `wilayah_rt.id` milik tenant B — butuh composite FK `(tenant_id, rt_id) references wilayah_rt(tenant_id, id)`, yang perlu unique constraint tambahan `wilayah_rt(tenant_id, id)` sebagai target.
5. **`unstable_cache` menekan durasi/biaya-query, BUKAN jumlah invocation serverless.** Root layout memanggil `headers()` → setiap request memicu 1 eksekusi function penuh, cache-hit atau tidak. Biaya Vercel (invocation × durasi) yang naik akibat keputusan full-dynamic di §1 **tidak** hilang lewat caching data — caching hanya mengurangi beban ke Supabase & durasi eksekusi per invocation. Ini harus dikomunikasikan sebagai mitigasi parsial, bukan solusi penuh.

## 3. Tujuan (Goals)

1. Semua tabel bisnis yang masih aktif dipakai (di luar daftar skip §7 Modul 5) punya kolom `tenant_id`, terfilter dengan benar di query publik & Server Action admin.
2. Admin yang login ke subdomain tenant tertentu **hanya** bisa melihat/mengubah data tenant itu — digerbangi RLS (write) + filter aplikasi (read) + defense-in-depth filter di Server Action (update/delete).
3. Auth/membership module tervalidasi: role yang dipakai untuk gating UI adalah role **per-tenant** (dari `memberships`), bukan role global lama (`profiles.role`).
4. Konsekuensi performa (full-dynamic rendering) diterima secara sadar dengan mitigasi caching data sebaik mungkin, dan dipantau pasca-deploy.
5. Provisioning tenant baru punya checklist eksplisit (baris `desa_profil`, seed `wilayah_rt`, dst) supaya tenant baru tidak diam-diam menampilkan data/mock tenant lain.

## 4. Non-Goals

- **Tidak** membangun fitur `pengaduan` dari nol (form + Server Action + admin CRUD) — itu pekerjaan terpisah, di luar scope migrasi tenant. Phase 4 hanya menyiapkan skema `pengaduan` tenant-ready (kolom + RLS) tanpa mengaktifkan fungsionalitasnya.
- **Tidak** menyambungkan `berita`/`galeri` — dead feature, nol kode yang membacanya, ditunda sampai (kalau pernah) dihidupkan lagi.
- **Tidak** membangun UI admin untuk mengelola tenant/mengundang anggota tenant lain — item nav "Pengguna" (`admin-nav.ts`, sudah ada sebagai placeholder `active:false`) tetap nonaktif; provisioning tenant baru masih manual lewat SQL di Phase 4.
- **Tidak** menghapus `is_admin()`/`is_staff()` lama — tetap dipakai tabel yang belum dimigrasi, baru bisa dibersihkan setelah semua modul migrasi selesai (pekerjaan cleanup terpisah, bukan bagian Phase 4).
- **Tidak** menerapkan Partial Prerendering atau restrukturisasi injeksi tema warna di root layout untuk menghindari full-dynamic — dicatat sebagai opsi optimasi masa depan (§11), bukan scope sekarang.

## 5. Isolasi Data — Model Keamanan yang Dipakai

**Baca publik (anon, tanpa login):** RLS `select` tetap `using (true)` untuk tabel konten publik (tidak berubah dari sekarang) — RLS anon secara desain tidak bisa tahu "tenant mana yang sedang dikunjungi" tanpa signal eksplisit per-request. Isolasi baca publik per tenant dilakukan di **layer aplikasi** lewat `.eq('tenant_id', tenant.id)` di setiap query (`src/lib/queries/*.ts`). Ini bukan celah keamanan untuk konten yang memang publik (profil desa, statistik) — datanya memang dimaksudkan terbuka untuk pengunjung, isolasi di sini soal *benar menampilkan desa yang tepat*, bukan soal kerahasiaan.

*(Catatan teknis, tidak dipakai sekarang tapi dicatat untuk referensi masa depan kalau ada tabel publik yang perlu genuine DB-level isolation: PostgREST mengekspos header request sebagai GUC transaction-local `request.headers` yang aman terhadap connection pooling Supavisor — RLS bisa baca `current_setting('request.headers', true)::json->>'x-tenant-id'` kalau suatu saat dibutuhkan. Tidak dipakai di Phase 4 karena kompleksitas tambahan tidak sepadan untuk data yang memang publik.)*

**Tulis admin (authenticated):** RLS `using (is_tenant_staff(tenant_id))` — genuine DB-level enforcement, karena ada `auth.uid()` yang valid. Ditambah defense-in-depth: Server Action update/delete selalu menyertakan `.eq('tenant_id', tenant.id)` sebagai filter tambahan (bukan cuma `.eq('id', id)`), supaya mustahil mengubah/menghapus row tenant lain walau `id` ditebak/leak.

**Data sensitif non-publik** (`pengaduan` kalau dibangun nanti, `audit_log`): RLS `select` juga dibatasi `is_tenant_staff(tenant_id)`/`is_tenant_admin(tenant_id)`, bukan `using(true)`.

## 6. Helper RLS Baru (fondasi, dikerjakan sekali di Modul 1)

Tambahan, **tidak mengganti** `is_admin()`/`is_staff()`/`current_user_role()` existing (masih dipakai tabel yang belum dimigrasi):

```sql
create or replace function is_tenant_member(target_tenant_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from memberships
    where tenant_id = target_tenant_id and profile_id = auth.uid()
  );
$$;

create or replace function is_tenant_staff(target_tenant_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from memberships
    where tenant_id = target_tenant_id and profile_id = auth.uid()
      and role in ('admin', 'operator')
  );
$$;

create or replace function is_tenant_admin(target_tenant_id uuid)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from memberships
    where tenant_id = target_tenant_id and profile_id = auth.uid()
      and role = 'admin'
  );
$$;
```

`security definer` + `set search_path = public` mengikuti pola persis `is_staff()` existing — dijalankan sebagai role yang membuat function (biasanya `postgres` lewat SQL Editor) yang *bypass* RLS `memberships` secara owner-privilege, bukan mekanisme "recursive RLS" khusus. Tidak ada risiko infinite loop selama dibuat dengan cara yang sama seperti helper lama.

## 7. Modul & Urutan Pengerjaan

### Modul 1 — Auth/Membership (dikerjakan pertama, fondasi untuk semua modul lain)

- Tambah helper RLS §6.
- **`src/app/admin/(protected)/layout.tsx`**: setelah `getCurrentProfile()` sukses, resolve tenant aktif dari header `x-tenant-id` (di-set middleware Phase 3), lalu cek baris `memberships` untuk `(profile.id, tenant.id)`. Tidak ada → deny/redirect. Karena Phase 3 sudah membackfill semua `profiles` existing jadi `memberships` tenant default, **tidak perlu grace-period/fallback** — admin existing dijamin sudah punya membership saat Phase 4 mulai.
- **Role untuk gating UI** (`AdminSidebar role=`, `admin-nav.ts minRole`) diganti dari `profiles.role` (global) jadi `membership.role` (scoped ke tenant aktif) — perluas `CurrentProfile`/`getCurrentProfile()` di `src/lib/auth/current-profile.ts` untuk membawa role hasil join ke `memberships`, bukan langsung `profiles.role`.
- **Tangani false-lockout dari resolver yang gagal senyap**: desain Phase 3 membuat header `x-tenant-id` identik antara "host memang default" dan "gagal resolve host lain, fallback ke default" — kalau tidak dibedakan, staff tenant B yang mengalami resolver hiccup akan mendapat pesan generik "akses ditolak" yang membingungkan (terlihat seperti kredensial salah). Tambahkan header kedua dari middleware, mis. `x-tenant-source: fast-path|resolved|unresolved`, supaya layout bisa tampilkan pesan berbeda untuk kasus "resolver gagal, coba lagi" vs "memang bukan anggota tenant ini".

### Modul 2 — `desa_profil` (proving ground: high-traffic, dipakai root layout + `buildMetadata()` di ~35 halaman)

- Tambah kolom `tenant_id uuid not null references tenants(id) default '00000000-0000-0000-0000-000000000001'` + **`unique(tenant_id)`** (constraint baru — saat ini tabel ini tidak punya unique constraint apa pun, singleton-nya murni konvensi `.limit(1).single()`, jadi ini menyederhanakan sekaligus mengeraskan asumsi lama menjadi constraint DB yang sesungguhnya).
- `getDesaProfil()` (`src/lib/queries/desa-profil.ts`) filter `.eq('tenant_id', tenant.id).single()` — dengan `tenant.id` dari resolusi real (`getCurrentTenant()`).
- **Provisioning tenant baru wajib menjamin baris `desa_profil` ada SEBELUM subdomain dipublikasikan** — kalau tidak, `getDesaProfil()` dapat 0 baris dan `withSupabaseFallback` diam-diam menyajikan `desaProfilMock` (identitas/tema desa contoh) ke pengunjung tenant baru, tanpa error yang kelihatan. Rekomendasi: trigger `after insert on tenants` yang otomatis membuat baris `desa_profil` default untuk tenant baru — konsisten dengan pola `handle_new_user()` existing.
- Ini modul pertama yang benar-benar mengaktifkan `getCurrentTenant()` (baca header) di jalur render publik — titik ini yang membuat seluruh situs jadi full-dynamic (lihat §1, §8).

### Modul 3 — Grup tabel publik generik

Tabel: `statistik`, `statistik_kelompok_umur`, `statistik_pendidikan`, `kepala_desa_riwayat`, `komoditas`, `peternakan`, `sarana_prasarana`, `wilayah_info`, `lembaga`, `aparatur`, `bpd_anggota`, `potensi_desa`, `statistik_sektor_usaha`, `wilayah_rt` + `statistik_rt` (pasangan FK, migrasi bareng).

**(`galeri` DIKELUARKAN dari grup ini** — zero-usage, pindah ke Modul 5/skip.)

Playbook per tabel (lihat §8 untuk detail teknis DDL):
1. Tambah kolom `tenant_id` + default tenant konstan.
2. Perbaiki unique constraint yang bentrok kalau ada (lihat daftar di §2 poin 3): `statistik(category,key)` → `(tenant_id,category,key)`; `wilayah_info(section)` → `(tenant_id,section)`; `statistik_sektor_usaha(jenis,kode)` → `(tenant_id,jenis,kode)`; `wilayah_rt(nomor)` → `(tenant_id,nomor)`.
3. `statistik_rt`+`wilayah_rt` khusus: tambah `unique(tenant_id, id)` di `wilayah_rt` lalu ganti FK `statistik_rt.rt_id` jadi composite `foreign key (tenant_id, rt_id) references wilayah_rt(tenant_id, id)`.
4. Index `tenant_id`.
5. RLS write: drop policy staff-write lama, ganti `using (is_tenant_staff(tenant_id))`. Select tetap `using(true)`.
6. Query layer: tambah `.eq('tenant_id', tenant.id)`, bungkus `unstable_cache` (§9).
7. Action layer: insert sertakan `tenant_id`; update/delete tambah `.eq('tenant_id', tenant.id)`; ganti/tambah `revalidateTag`.

**Checklist provisioning tenant baru juga wajib mencakup seed 16 baris `wilayah_rt`** secara manual (tabel ini tidak punya write policy dari dashboard sama sekali, murni edit manual SQL) — bukan cuma `desa_profil`.

### Modul 4 — Tabel sensitif

- **`audit_log`**: ringan — hanya satu titik masuk (`logAudit()` helper terpusat di `src/lib/actions/audit.ts`), tidak ada UI baca sama sekali saat ini (`active:false` di nav). Tambah kolom `tenant_id`, update `logAudit()` untuk menyertakannya, RLS select jadi `is_tenant_admin(tenant_id)` (ganti dari `is_admin()` global).
- **`pengaduan`**: **skema saja** (kolom `tenant_id` + RLS tenant-ready) — fungsionalitas (Server Action, wiring form, admin CRUD) eksplisit **di luar scope Phase 4** (lihat §4 Non-Goals & §2 poin 1). Dokumentasikan sebagai known gap, bukan "sudah beres".

### Modul 5 — Skip (didokumentasikan, tidak dikerjakan)

`berita` dan `galeri` — keduanya dead feature: nol query file, nol halaman publik/admin yang membacanya. Aman ditunda tanpa risiko kebocoran data lintas tenant (tidak ada yang menampilkannya). Migrasi tenant_id untuk keduanya cukup mengikuti playbook §8 yang sama kelak kalau fiturnya dihidupkan lagi.

## 8. Detail Teknis DDL (koreksi presisi, bukan sekadar draft)

`ALTER TABLE ADD COLUMN ... NOT NULL DEFAULT <konstanta>` **saja** metadata-only di Postgres ≥11 (instan, tanpa full table rewrite). **Tapi kalau digabung `REFERENCES` dalam satu statement, bagian FK-nya TIDAK metadata-only** — menambah foreign key memicu validasi (scan tabel yang mereferensi, di bawah `ACCESS EXCLUSIVE lock`). Untuk skala data desa ini (puluhan/ratusan baris) risikonya praktis nol, tapi teknik yang lebih presisi untuk tabel yang mungkin lebih besar: pisah jadi

```sql
alter table X add column tenant_id uuid not null default '00000000-0000-0000-0000-000000000001';
alter table X add constraint X_tenant_id_fkey foreign key (tenant_id) references tenants(id) not valid;
alter table X validate constraint X_tenant_id_fkey; -- hanya butuh SHARE UPDATE EXCLUSIVE, tidak blokir read/write
```

**Kapan drop default**: JANGAN di migrasi/PR yang sama dengan penambahan kolom. Urutan aman: (1) tambah kolom dengan default → kode lama yang belum ter-deploy tetap aman; (2) deploy kode aplikasi yang eksplisit set `tenant_id` di semua insert untuk tabel itu; (3) setelah stabil di production, migrasi terpisah `alter column tenant_id drop default` (metadata-only, instan — penundaan ini murni untuk window rollback kode, bukan soal performa).

## 9. Strategi Caching (mitigasi parsial, bukan solusi penuh)

`withSupabaseFallback` (`src/lib/queries/helpers.ts`) diperluas jadi varian tenant-aware yang membungkus loader dengan `unstable_cache(loader, [label, tenantId], { revalidate: 300, tags: [\`tenant:${tenantId}:${label}\`] })`. Dua aturan wajib:

- **Resolve `tenant.id` DI LUAR fungsi yang dibungkus `unstable_cache`**, teruskan sebagai `keyParts` eksplisit — memanggil `headers()`/`getCurrentTenant()` DI DALAM closure yang di-cache akan error ("dynamic API used inside unstable_cache").
- **Jangan teruskan instance Supabase client sebagai argumen** ke fungsi yang di-cache (bukan primitif serializable). Buat closure yang memanggil `createPublicClient()` (singleton) dari dalam, tanpa parameter — andalkan `keyParts` sebagai satu-satunya sumber cache key.

Server Action tulis (create/update/delete) memanggil `revalidateTag(\`tenant:${tenantId}:${label}\`)` selain `revalidatePath` existing.

**Batas realistis strategi ini**: menekan beban query Supabase & durasi eksekusi per-request (cache-hit tidak perlu round-trip network), TAPI **tidak mengurangi jumlah invocation serverless Vercel** — begitu root layout memanggil `headers()`, setiap request tetap memicu 1 eksekusi function penuh. Biaya Vercel (invocation × durasi) yang naik akibat keputusan §1 tidak hilang lewat caching data. Ini harus dipantau pasca-deploy sebagai risiko nyata, bukan dianggap sudah teratasi.

## 10. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Unique constraint global (`statistik`, `wilayah_info`, dll) bikin tenant kedua gagal insert | Wajib diperbaiki jadi composite `unique(tenant_id, ...)` di Modul 3, bukan opsional (lihat §2 poin 3, §7 Modul 3) |
| `statistik_rt` menunjuk `wilayah_rt` milik tenant lain | Composite FK `(tenant_id, rt_id) references wilayah_rt(tenant_id, id)` (§7 Modul 3) |
| Tenant baru tampil dengan data/tema desa mock/desa lain karena baris `desa_profil`/`wilayah_rt` belum di-seed | Checklist provisioning eksplisit + trigger auto-create `desa_profil` default (§7 Modul 2) |
| Resolver Phase 3 gagal senyap → staff tenant sendiri di-lockout dengan pesan membingungkan | Header `x-tenant-source` dari middleware untuk membedakan "unresolved" vs "memang bukan member" (§7 Modul 1) |
| Kenaikan biaya/latensi Vercel akibat full-dynamic tidak tertangani caching data | Dipantau eksplisit pasca-deploy sebagai risiko nyata (§9); opsi lanjutan Partial Prerendering dicatat di §11, bukan scope sekarang |
| FK `add constraint ... references` mengunci tabel lebih lama dari perkiraan pada tabel yang tumbuh besar | Pola `NOT VALID` + `VALIDATE CONSTRAINT` terpisah (§8) untuk tabel yang berisiko |
| Server Action lupa filter `.eq('tenant_id', ...)` di update/delete → bisa mengubah row tenant lain kalau RLS punya celah | Defense-in-depth wajib di setiap action (§5), bukan hanya andalkan RLS |

## 11. Catatan Forward-Looking (di luar scope Phase 4, hanya dicatat)

- Kalau jumlah invocation serverless jadi masalah nyata pasca-deploy, opsi lanjutan adalah Partial Prerendering — tapi sulit diterapkan di codebase ini karena tema warna disuntik lewat inline `style` di elemen `<html>`/`<body>` pada root layout, persis bagian shell yang PPR asumsikan statis. Menerapkannya butuh restrukturisasi taruh CSS var injection di boundary Suspense terpisah — pekerjaan besar tersendiri, bukan bagian Phase 4.
- Cleanup `is_admin()`/`is_staff()` lama (setelah semua tabel selesai dimigrasi ke `is_tenant_*`) — pekerjaan housekeeping terpisah, dilakukan setelah Modul 1-4 selesai dan stabil.
- Fitur `pengaduan` (bangun dari nol) dan menghidupkan kembali `berita`/`galeri` — kalau pernah dibutuhkan, ikuti playbook §8 yang sama.

## 12. Testing Checklist

- [ ] Admin tenant A login di subdomain tenant A → hanya lihat/bisa edit data tenant A di semua modul yang sudah dimigrasi.
- [ ] Admin tenant A mencoba akses subdomain tenant B (kalau kredensial somehow dicoba) → ditolak oleh membership check di `AdminProtectedLayout` (Modul 1).
- [ ] Insert baris `statistik`/`wilayah_info`/`statistik_sektor_usaha`/`wilayah_rt` untuk tenant kedua dengan `key`/`section`/`nomor` yang sama seperti tenant pertama → berhasil (constraint composite bekerja).
- [ ] `statistik_rt` tenant A tidak bisa dibuat menunjuk `wilayah_rt.id` milik tenant B (composite FK menolak).
- [ ] Tenant baru yang baru di-provision (dengan checklist §7 Modul 2 diikuti) menampilkan identitas/tema/`wilayah_rt` miliknya sendiri, bukan mock/data desa lain.
- [ ] Matikan/rusak resolusi tenant sementara (simulasi resolver unresolved) → staff mendapat pesan yang membedakan "coba lagi" vs "akses ditolak permanen", bukan pesan generik.
- [ ] `npm run build` sukses; halaman publik yang sudah dimigrasi terkonfirmasi full-dynamic (cek header `x-nextjs-cache`/perilaku render, bukan lagi ISR).
- [ ] `revalidateTag` di Server Action terbukti membuat perubahan admin langsung terlihat di halaman publik (tidak nunggu 300 detik).

### Critical Files

- `supabase/migrations/0009_tenants_foundation.sql` (referensi `DEFAULT_TENANT_ID`, harus konsisten dengan migrasi Phase 4)
- `supabase/migrations/0002_rls.sql`, `0004_statistik_lanjutan.sql`, `0005_desa_profil.sql` (pola RLS & unique constraint yang diubah)
- `src/lib/queries/helpers.ts` (titik ubah `withSupabaseFallback` → tenant-aware + `unstable_cache`)
- `src/lib/auth/current-profile.ts`, `src/app/admin/(protected)/layout.tsx` (Modul 1)
- `src/app/layout.tsx`, `src/lib/metadata.ts` (Modul 2, sumber utama full-dynamic)
- `src/lib/actions/audit.ts` (Modul 4)
