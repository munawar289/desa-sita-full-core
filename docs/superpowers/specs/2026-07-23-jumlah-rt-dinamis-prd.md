# PRD — Jumlah RT Dinamis (lepas dari hardcode 16)

**Status:** Draft
**Tanggal:** 2026-07-23
**Terkait:** [2026-07-03-statistik-lanjutan-prd.md](./2026-07-03-statistik-lanjutan-prd.md) (asal tabel `wilayah_rt`/`statistik_rt`, fixed 16 baris), [2026-07-06-profil-desa-prd.md](./2026-07-06-profil-desa-prd.md) (tabel `desa_profil` / Identitas Desa), migration `0004_statistik_lanjutan.sql`, `0012_tenant_scoping_modul3.sql`

## Ringkasan

Tabel "Menurut RT" di halaman publik (`/data-desa/kependudukan/penduduk`) dan admin "Statistik per-RT" saat ini terikat ke `wilayah_rt`, yang sengaja dibuat **16 baris tetap tanpa write policy** sejak PRD statistik-lanjutan. Angka "16" itu sepenuhnya independen dari entri Statistik `lembaga_kemasyarakatan → Rukun Tetangga (RT)` yang admin edit bebas sebagai teks — sehingga admin bisa mengubah satu ke angka lain (mis. 18) tanpa tabel per-RT publik ikut berubah. PRD ini menambahkan field **"Jumlah RT"** di Identitas Desa (`desa_profil`) sebagai satu-satunya sumber kebenaran yang mengontrol jumlah baris `wilayah_rt`, menggantikan angka statis — **dua arah** (bisa naik maupun turun dari UI, lihat Revisi di bawah), bukan grow-only seperti draft awal.

## Latar Belakang

Investigasi kode menunjukkan opsi "ikut sinkron otomatis ke entri Statistik lembaga_kemasyarakatan/rt" itu mahal: `wilayah_rt` didesain eksplisit sebagai dimensi fixed (komentar migration: *"16 baris, tetap — read-only publik, tanpa CRUD admin"*, *"Tidak ada policy write ... kalau berubah diedit manual via SQL Editor"*), dan filosofi itu ditegaskan ulang di migration multi-tenant (0012). Membuat baris RT bertambah/berkurang otomatis mengikuti sebuah value teks bebas di sistem Statistik generik butuh special-casing besar. Sesuai arahan pengguna, kalau jalur itu rumit, solusi yang lebih murah adalah field baru khusus di Identitas Desa yang jadi satu-satunya tombol untuk mengubah jumlah RT — decoupled dari sistem Statistik generik, tapi tetap membuat entri Statistik lama itu read-only/derived (bukan dua sumber yang bisa drift).

Kondisi yang membuat ini relevan sekarang: fitur statistik per-RT (Fase modul 3) baru dipakai satu desa contoh (Desa Sita, 16 RT) — belum ada tenant lain yang datanya beda, jadi migration & perubahan default masih murah dilakukan sebelum ada banyak data produksi yang bergantung pada asumsi "16 tetap".

### Revisi 2026-07-23 — shrink diizinkan (K3 direvisi)

Draft awal (Fase 1–4, sudah diimplementasi & diverifikasi) membuat `jumlah_rt` **grow-only**: menurunkan angka dari UI ditolak sepenuhnya. Setelah dipakai, muncul skenario nyata yang tidak tertangani: tenant baru di-provisioning dengan default 16 RT dummy, lalu admin ingin menyesuaikan ke jumlah RT sebenarnya (mis. 10) — grow-only memaksa mereka ke SQL Editor manual untuk kasus yang seharusnya rutin.

Pengguna mengarahkan: field "Jumlah RT" tetap **satu-satunya** kontrol (bukan tombol hapus terpisah di halaman Statistik per-RT — itu akan jadi sumber kebenaran kedua yang redundan), dan flow-nya dua arah — daftar `wilayah_rt` selalu disinkronkan mengikuti angka di Identitas Desa, baik nambah maupun kurang. Fase 5 di bawah merevisi K3/K5 dan menambah pengaman: RT yang dihapus (selalu nomor tertinggi/trailing) hanya boleh dihapus kalau belum punya baris `statistik_rt` sama sekali — supaya tetap aman dipakai di tenant yang datanya sudah campur (bukan cuma tenant baru), tanpa membedakan "dummy" vs "asli" secara eksplisit.

## Keputusan yang Sudah Diambil

| Kode | Keputusan | Alasan |
|---|---|---|
| K1 | Sumber baru "Jumlah RT" = kolom `jumlah_rt` di `desa_profil` (Identitas Desa), **bukan** auto-sync dari entri Statistik `lembaga_kemasyarakatan/rt`. | `wilayah_rt` sengaja fixed/no-write-policy by design; sinkronisasi dari sistem Statistik generik butuh special-case besar untuk satu baris saja. Diarahkan langsung oleh pengguna sebagai fallback yang efisien. |
| K2 | Menaikkan `jumlah_rt` → auto-insert baris `wilayah_rt` baru (nomor lanjut, mis. "017"), tanpa data `statistik_rt` (kosong/null). | Konsisten dengan kategori yang sudah kosong by default (`pengangguran`, `aset_tanaman`); admin isi manual belakangan. |
| K3 | ~~Menurunkan `jumlah_rt` dari UI ditolak~~ **[Direvisi 2026-07-23]** Menurunkan `jumlah_rt` dari UI **diizinkan**, dengan pengaman: RT yang dihapus selalu yang bernomor tertinggi (trailing, konsisten "no reorder manual"), dan hanya boleh dihapus kalau RT itu belum punya baris `statistik_rt` sama sekali. Kalau ada satu saja yang bentrok, seluruh operasi ditolak (all-or-nothing) dengan pesan sebut RT mana yang bentrok. | Draft awal (grow-only, "SQL Editor manual kalau perlu mengecilkan") ternyata tidak menangani skenario rutin: tenant baru di-provisioning dengan 16 RT dummy, admin perlu menyesuaikan ke jumlah sebenarnya. Diarahkan ulang oleh pengguna — field Jumlah RT tetap satu-satunya kontrol (bukan tombol hapus terpisah di halaman Statistik per-RT, itu jadi sumber kebenaran kedua yang redundan); guard data tetap dipertahankan supaya aman juga dipakai di tenant yang datanya sudah campur, bukan cuma tenant baru. |
| K4 | Entri Statistik lama (`category=lembaga_kemasyarakatan`, `key=rt`, label "Rukun Tetangga (RT)") dijadikan **read-only & derived**: value-nya di-upsert otomatis tiap kali `jumlah_rt` disimpan lewat Identitas Desa; tombol edit/hapus disembunyikan khusus untuk baris ini di admin. | Dipilih pengguna — mencegah dua angka RT yang bisa saling drift di halaman publik `keamanan-kelembagaan`. |
| K5 | ~~Write policy INSERT-only~~ **[Direvisi 2026-07-23]** Migration menambah kolom `jumlah_rt` di `desa_profil` + write policy **INSERT dan DELETE**, staff+tenant-scoped, di `wilayah_rt` (tetap tanpa UPDATE policy — nomor/nama RT tidak pernah diedit manual per K non-tujuan). | Mengikuti revisi K3: shrink butuh DELETE policy di DB juga. Guard "RT belum punya data" ditegakkan di application layer (`updateDesaProfilAction`), bukan RLS, karena butuh query lintas tabel (`statistik_rt`) yang di luar pola RLS sederhana tenant+role yang dipakai tabel lain di project ini. |
| K6 | Mock data diselaraskan satu sumber: `wilayahRtMock` & `statistikRtMock` (RT_NOMOR) diturunkan dari `desaProfilMock.jumlah_rt`, bukan literal `16`/array 16-baris terpisah di 2 file. | Mencegah drift yang sama juga terjadi di layer mock. |

## Non-Tujuan

- Tidak menambah dimensi baru selain RT (RW, dusun tetap seperti sekarang).
- Tidak membangun UI reorder/rename manual per-RT — nomor & nama tetap auto-generate ("RT 0xx").
- Tidak mengotomasi pengisian `statistik_rt` (penduduk/keluarga/dll) untuk RT baru — tetap manual oleh admin.
- ~~Tidak mengizinkan pengurangan RT dari UI~~ **[Dicabut, lihat Revisi K3]** — pengurangan kini diizinkan lewat field Jumlah RT, dengan guard "belum punya data statistik_rt".
- Tidak ada tombol hapus RT terpisah di halaman admin Statistik per-RT — satu-satunya kontrol tetap field Jumlah RT di Identitas Desa, supaya tidak ada dua sumber kebenaran yang bisa saling drift.
- Tidak ada override/force-delete RT yang masih punya data dari UI — kalau RT trailing yang mau dihapus sudah terisi data, satu-satunya jalan tetap kosongkan datanya dulu manual (via Statistik per-RT) atau SQL Editor.
- Tidak mengubah tabel/skema `statistik` generik (CRUD tetap sama) — hanya menambah pengecualian tampilan untuk satu baris spesifik di komponen admin.

## Blast Radius

**Fase 1 — Migration & tipe data**
| Berkas | Yang berubah |
|---|---|
| `supabase/migrations/0013_jumlah_rt_desa_profil.sql` (baru) | Kolom `jumlah_rt integer not null default 16 check (jumlah_rt >= 1)` di `desa_profil`; policy INSERT baru di `wilayah_rt` (staff + tenant scoped), tanpa UPDATE/DELETE. |
| `src/lib/data/desa-profil.ts` | Tambah field `jumlah_rt: number` ke type `DesaProfil` + `desaProfilMock.jumlah_rt = 16`. |
| `src/lib/queries/desa-profil.ts` | Select kolom `jumlah_rt`. |
| `src/lib/validation/desa-profil.ts` | Tambah `jumlah_rt: z.coerce.number().int().min(1, ...)` ke `desaProfilFormSchema`. |

**Fase 2 — Action: sinkronisasi grow-only**
| Berkas | Yang berubah |
|---|---|
| `src/lib/actions/desa-profil.ts` | `updateDesaProfilAction`: query jumlah `wilayah_rt` existing (tenant-scoped) → kalau `jumlah_rt` baru < existing, return error tanpa update apa pun; kalau lebih besar, insert baris `wilayah_rt` baru lalu upsert baris `statistik` (`lembaga_kemasyarakatan`/`rt`) dengan value baru, baru update `desa_profil`. |

**Fase 3 — Admin UI**
| Berkas | Yang berubah |
|---|---|
| `src/components/admin/DesaProfilForm.tsx` | Input number baru "Jumlah RT" (min=1, step=1) + helper text "hanya bisa ditambah, tidak bisa dikurangi dari sini". |
| `src/components/admin/StatistikRow.tsx` / `StatistikGroupedList.tsx` | Deteksi baris terkunci (`category === "lembaga_kemasyarakatan" && key === "rt"`): sembunyikan tombol edit & hapus, tampilkan badge kecil "Otomatis dari Identitas Desa". |
| `src/app/(site)/admin/(protected)/statistik/per-rt/page.tsx` | Copy "16 RT tetap — hanya nilainya yang bisa diedit." → dinamis pakai jumlah RT aktual. |

**Fase 4 — Mock data**
| Berkas | Yang berubah |
|---|---|
| `src/lib/data/wilayah-rt.ts` | Generator pakai `desaProfilMock.jumlah_rt` alih-alih literal `16`. |
| `src/lib/data/statistik-rt.ts` | `RT_NOMOR` diturunkan dari `wilayahRtMock` alih-alih daftar literal terpisah; RT tambahan default null di semua kategori. |
| `src/lib/data/statistik.ts` | Tidak berubah nilainya (tetap "16"), hanya dipastikan konsisten dengan mock lain. |

**Fase 5 — Revisi: shrink diizinkan (lihat Revisi 2026-07-23)**
| Berkas | Yang berubah |
|---|---|
| `supabase/migrations/0018_wilayah_rt_shrink.sql` (baru) | Policy DELETE baru di `wilayah_rt` (staff + tenant scoped). |
| `src/lib/actions/desa-profil.ts` | `updateDesaProfilAction`: cabang `jumlah_rt < existing` tidak lagi langsung reject — hitung RT trailing kandidat hapus, cek `statistik_rt` untuk RT-RT itu, reject (all-or-nothing) kalau ada yang terisi, else `delete` baris `wilayah_rt` kandidat sebelum lanjut upsert Statistik & update `desa_profil`. |
| `src/components/admin/DesaProfilForm.tsx` | Helper text field Jumlah RT diperbarui, tidak lagi bilang "hanya bisa ditambah". |

## Roadmap Implementasi

- [x] **Fase 1 — Migration & tipe data** (K1, K5, K6 · AC1, AC2)
- [x] **Fase 2 — Action sync grow-only + upsert Statistik lembaga_kemasyarakatan** (K2, K3, K4 · AC3, AC4, AC5)
- [x] **Fase 3 — Admin UI (form Identitas Desa, lock baris Statistik, copy per-RT)** (K4 · AC6, AC7, AC8)
- [x] **Fase 4 — Mock data alignment** (K6 · AC9)
- [x] **Fase 5 — Revisi: shrink dengan guard data-kosong** (K3, K5 · AC4, AC10)

## Acceptance Criteria

1. Kolom `jumlah_rt` ada di `desa_profil`, default 16, `not null`, `check >= 1`.
2. Form Identitas Desa punya input "Jumlah RT" tervalidasi integer ≥ 1.
3. Menaikkan `jumlah_rt` dari admin otomatis menambah baris `wilayah_rt` baru bernomor berurutan, tanpa data `statistik_rt` terisi.
4. Menurunkan `jumlah_rt` dari admin: kalau semua RT trailing yang mau dihapus belum punya baris `statistik_rt`, berhasil — baris `wilayah_rt` kandidat terhapus, sisanya tidak tersentuh. Kalau ada satu saja yang sudah terisi data, seluruh operasi ditolak dengan pesan jelas menyebut RT mana yang bentrok; tidak ada baris `wilayah_rt`/`desa_profil` yang berubah (all-or-nothing).
5. Setelah `jumlah_rt` berhasil disimpan, baris Statistik `lembaga_kemasyarakatan/rt` otomatis ter-upsert mengikuti angka baru.
6. Baris Statistik `lembaga_kemasyarakatan/rt` tidak bisa diedit/dihapus manual dari admin panel (tombol tersembunyi), disertai keterangan sumbernya.
7. Halaman admin "Statistik per-RT" menampilkan jumlah RT aktual (bukan literal "16") di teks penjelasan.
8. Tabel "Menurut RT" di halaman publik `data-desa/kependudukan/penduduk` menampilkan jumlah baris sesuai `wilayah_rt` terbaru tanpa perubahan kode di halaman itu sendiri (sudah query dinamis by design).
9. `desaProfilMock`, `wilayahRtMock`, `statistikRtMock`, `statistikMock` konsisten satu sama lain (16 di semua tempat, diturunkan dari satu sumber mock).
10. Tidak ada tombol/aksi hapus RT di halaman admin Statistik per-RT — satu-satunya cara mengubah jumlah RT (naik/turun) tetap lewat field Jumlah RT di Identitas Desa.

## Risiko

| Risiko | Mitigasi |
|---|---|
| Insert `wilayah_rt` & update `desa_profil` tidak atomic (Supabase JS tanpa transaksi lintas tabel) — bisa gagal di tengah. | Urutan operasi: insert RT dulu → upsert statistik → update `desa_profil` terakhir; insert RT idempotent-safe (pakai nomor lanjut, retry aman kalau langkah berikutnya gagal). Didokumentasikan sebagai limitasi, bukan blocker. |
| Baris Statistik `lembaga_kemasyarakatan/rt` yang terkunci membingungkan admin yang terbiasa edit manual. | Badge + keterangan jelas di admin, arahkan ke Identitas Desa. |
| Insert/delete `wilayah_rt` salah tenant (multi-tenant). | Ikuti pola existing (`.eq("tenant_id", tenant.id)` di semua query/insert/delete) + RLS INSERT/DELETE policy tenant-scoped sebagai lapisan kedua. |
| **[Revisi]** Admin mengecilkan `jumlah_rt` dan tidak sadar data penduduk/keluarga RT tertentu ikut terhapus. | Guard "RT trailing harus kosong dulu" (K3 revisi) — operasi ditolak all-or-nothing kalau ada RT bentrok yang sudah terisi data, tidak pernah cascade-delete data yang ada isinya. Helper text di form menjelaskan syarat ini di muka. |
| **[Revisi]** Race condition: dua admin submit form Identitas Desa bersamaan saat shrink, salah satu berdasarkan data RT yang sudah stale. | Di luar scope PRD ini (project belum punya locking/optimistic-concurrency di form manapun) — risiko sama seperti update konkuren field lain, didokumentasikan sebagai limitasi existing, bukan regresi baru. |
