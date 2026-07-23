# PRD — Seeder Pola Data untuk Tenant Baru

**Status:** Draft
**Tanggal:** 2026-07-23
**Terkait:** [2026-07-23-jumlah-rt-dinamis-prd.md](./2026-07-23-jumlah-rt-dinamis-prd.md) (`wilayah_rt`/`statistik_rt`, `jumlah_rt`), migration `0011_desa_profil_tenant_scoping.sql` (trigger `create_default_desa_profil_for_tenant`, preseden pola provisioning), migration `0012_tenant_scoping_modul3.sql` (RLS tenant-scoped semua tabel konten), audit bug kebocoran data lintas-tenant (sesi ini) yang menemukan tenant baru saat ini efektif kosong/minim data.

## Ringkasan

Saat tenant desa baru dibuat dari `/platform`, hampir semua tabel konten (`statistik`, `statistik_sektor_usaha`, `lembaga`, `wilayah_rt`, dst) mulai dari nol baris — admin tenant baru melihat halaman kosong tanpa tahu kategori/key/struktur apa yang lazim diisi, dan untuk `statistik_sektor_usaha` malah **tidak bisa isi data sama sekali** karena UI-nya hanya "edit value", tanpa form tambah baris. PRD ini menambah seeder otomatis yang terpicu saat tenant baru dibuat: mengisi baris dengan pola label/key/kategori yang sama seperti tenant referensi, tapi dengan **value dummy** yang jelas menandakan "belum diisi/perlu disesuaikan".

## Latar Belakang

Audit sesi ini (lihat percakapan) menemukan bahwa tenant `compang-kempo` (dibuat manual, sudah dipakai testing) hanya punya 2 baris `statistik` dan 0 baris `lembaga`, sementara tenant default (`golo-loni`, `000...0001`) punya 39 baris `statistik` dengan kategori/key yang jauh lebih lengkap (aset_perumahan, aset_sarana_produksi, aset_tanah, aset_transportasi, keamanan, dst). Karena kolom `category`/`key` di tabel `statistik` sifatnya bebas-teks (tidak ada master-list terpusat), admin tenant baru tidak punya cara mengetahui pola penamaan yang konsisten dengan tenant lain kecuali menebak sendiri — berisiko key yang beda-beda gaya antar tenant. `statistik_sektor_usaha` malah 100% bergantung ke seed (17 sektor tetap × 2 jenis = 34 baris) karena tidak ada action `create...` sama sekali di `lib/actions/statistik-sektor-usaha.ts`, hanya `update`.

Kondisi yang membuat ini relevan/murah sekarang: baru ada 3 tenant di database (`golo-loni`, `sita`, `compang-kempo`), platform belum dipakai desa sungguhan, jadi menetapkan pola seed sekarang tidak berisiko migrasi data besar/breaking existing production users.

## Keputusan yang Sudah Diambil

| Kode | Keputusan | Alasan |
|---|---|---|
| K1 | Seeder terpicu **otomatis** saat tenant baru dibuat, bukan tombol manual/on-demand di UI. | Diarahkan pengguna — supaya tenant baru selalu konsisten terisi pola dari hari pertama, tidak bergantung admin platform ingat menjalankannya. |
| K2 | Isi kolom value pakai **dummy placeholder**, bukan angka/isi asli yang disalin dari tenant referensi. | Diarahkan pengguna — tujuannya menunjukkan struktur yang perlu diisi, bukan membocorkan data desa lain sebagai default. |
| K3 | Pola kategori/key/label yang di-seed mengikuti struktur yang sudah ada di tenant referensi hari ini (bukan dirancang ulang dari nol). | Diarahkan pengguna — "label dan key yang ada di tenant default itu akan sama pada semua tenant yang lain". |

## Keputusan Final (setelah klarifikasi pengguna)

| Kode | Keputusan |
|---|---|
| K4 | **DB trigger** (`security definer`, `AFTER INSERT ON tenants`), fungsi baru `seed_tenant_defaults()`, dipasang berdampingan dengan trigger `create_default_desa_profil_for_tenant` yang sudah ada (0011) — bukan menggantikannya. |
| K5 | Template = **snapshot literal** di migration SQL, diambil dari struktur tenant `golo-loni` (`000...0001`) per hari ini. Tidak baca live dari `golo-loni` saat runtime — `golo-loni` tidak dijadikan "master data" permanen. |
| K6 | **Semua tabel konten** di-seed (bukan cuma 3 wajib): `statistik`, `statistik_sektor_usaha`, `wilayah_rt`+`statistik_rt`, `lembaga`, `aparatur`, `bpd_anggota`, `kepala_desa_riwayat`, `komoditas`, `peternakan`, `potensi_desa`, `wilayah_info`. |
| K7 | **Backfill tenant existing** (`compang-kempo`, `sita`) — dijalankan lewat statement `select seed_tenant_defaults(id) from tenants where id in (...)` satu kali setelah trigger dipasang, sebagai bagian dari migration yang sama (idempotent: pakai `on conflict do nothing` per tabel supaya aman dijalankan ulang / tidak dobel kalau tenant kebetulan sudah punya sebagian data — lihat AC5). |

### S4 (diputuskan) — Bentuk dummy value per tabel

Prinsip: field **struktural** (nama kategori/jabatan/section — sesuatu yang value-nya sendiri adalah "jenis data apa ini", bukan fakta desa) boleh disalin apa adanya karena memang itu polanya. Field **faktual** (angka, nama orang, nama komoditas spesifik) selalu diganti dummy yang jelas-jelas menandakan "isi ulang".

| Tabel | Field struktural (disalin) | Field faktual (di-dummy-kan) |
|---|---|---|
| `statistik` | `category`, `key`, `label` (39 baris, di-dedupe dari duplikasi `wilayah`/`kependudukan` yang tumpang tindih di golo-loni) | `value = "0"`, `updated_at` mundur 400 hari (otomatis kena badge "Statistik Usang") |
| `statistik_sektor_usaha` | `jenis`, `kode`, `nama` (34 baris, taksonomi baku, reuse `SEKTOR` di `lib/data/statistik-sektor-usaha.ts`) | `nilai_ribu_rupiah = null` |
| `wilayah_rt` | 16 baris `nomor`/`nama` auto-generate ("RT 001"..."RT 016"), samakan `desa_profil.jumlah_rt` default | — (tidak ada field faktual di tabel ini) |
| `statistik_rt` | `category` (penduduk/keluarga/pengangguran/air_bersih/aset_tanaman) × 16 RT | `value = null`, `detail = null` (sama seperti kategori kosong yang sudah ada di mock) |
| `lembaga` | `kategori`, `nama` (7 baris: PKK, Karang Taruna, Posyandu, Kelompok Tani, BUMDes, Komite Sekolah, Linmas — nama institusi generik, bukan fakta desa spesifik) | `dasar_hukum = null`, `jumlah_pengurus = null`, `keterangan = null` |
| `aparatur` | `jabatan` (8 baris: Kepala Desa, Sekretaris Desa, Kaur Keuangan, dst — struktur organisasi baku) | `nama = null`, `pendidikan = null` |
| `bpd_anggota` | `jabatan` (5 baris: Ketua, Wakil Ketua, Sekretaris, Anggota ×2) | `nama = "(Menunggu data)"` — pola ini **sudah dipakai** golo-loni sendiri, tinggal disalin |
| `kepala_desa_riwayat` | `urutan`, jumlah baris (5) | `nama = "(Menunggu data)"`, `periode_mulai = null`, `periode_selesai = null` — **tidak** menyalin tahun 1966–2019 golo-loni (itu fakta sejarah desa lain) |
| `komoditas` | — (nama komoditas spesifik = fakta, bukan struktur) | 1 baris placeholder: `nama = "(Contoh) Ganti dengan nama komoditas"`, `luas_ha = null`, `hasil_panen = null` |
| `peternakan` | — | 1 baris placeholder: `jenis_ternak = "(Contoh) Ganti dengan jenis ternak"`, `populasi = null`, `jumlah_pemilik = null` |
| `potensi_desa` | — | 1 baris placeholder: `judul = "(Contoh) Ganti dengan potensi desa"`, `deskripsi = "Isi deskripsi potensi desa Anda di sini."`, `icon = "Sparkles"` |
| `wilayah_info` | `section`, `page`, `judul`, `eyebrow`, `urutan` (5 section: sejarah, batas_wilayah, iklim, potensi_wisata, orbitasi — struktur halaman, bukan isi) | `konten = "Konten belum diisi — perbarui dari halaman ini."` |

Alasan `komoditas`/`peternakan`/`potensi_desa` beda pola (placeholder generik, bukan salin struktur golo-loni apa adanya): nama komoditas ("Kopi", "Kakao") dan jenis ternak ("Babi", "Sapi") di golo-loni adalah **fakta geografis desa itu**, bukan pola universal seperti kategori statistik atau jabatan aparatur — menyalinnya mentah berisiko salah/menyesatkan buat desa dengan kondisi berbeda (mis. desa pesisir tanpa peternakan babi).

## Non-Tujuan

- Tidak membangun mekanisme sinkronisasi template seed dengan tenant referensi secara berkelanjutan — kalau `golo-loni` dapat kategori statistik baru, tenant yang sudah pernah di-seed **tidak** otomatis ikut dapat baris baru itu.
- Tidak mengubah UI admin (form tambah/edit) — murni menambah data awal di database.
- Tidak menambah master-list/enum resmi untuk `category`/`key` di tabel `statistik` — tetap bebas-teks seperti sekarang, seed hanya memberi contoh awal.
- Tidak menyalin riwayat kepala desa/nama BPD golo-loni sebagai contoh — selalu `"(Menunggu data)"`, konsisten dengan pola yang sudah dipakai golo-loni sendiri untuk 2 tabel ini.

## Blast Radius

| Berkas | Yang berubah |
|---|---|
| `supabase/migrations/0019_seed_tenant_defaults.sql` (baru) | Fungsi `seed_tenant_defaults(target_tenant_id uuid)` (insert ke 11 tabel dengan `on conflict do nothing`), trigger `on_tenant_created_seed_defaults` (`AFTER INSERT ON tenants`, memanggil fungsi di atas), lalu 1 statement backfill untuk tenant existing (`compang-kempo`, `sita`) di akhir file yang sama. |

Tidak ada perubahan kode TypeScript sama sekali — murni migration SQL (sesuai K4/S1: pola trigger, konsisten dengan `create_default_desa_profil_for_tenant`).

## Roadmap Implementasi

**Fase 1 — Migration seeder + trigger + backfill (satu PR)**
- [ ] Tulis fungsi `seed_tenant_defaults()` + trigger, sesuai tabel field struktural/faktual di atas (K4, K5, K6, S4).
- [ ] Statement backfill untuk `compang-kempo` (`be99ad57...`) dan `sita` (`ec18a5da...`) di file migration yang sama (K7).
- [ ] Jalankan migration, verifikasi lewat query manual: tenant baru test (`insert into tenants ...`) otomatis dapat semua baris; `compang-kempo`/`sita` bertambah barisnya tanpa dobel data lama (2 baris statistik existing `compang-kempo` tetap ada, bukan ketiban `on conflict`).
- [ ] Cek admin UI (`/admin/statistik`, `/admin/lembaga`, dst) untuk tenant `compang-kempo` menampilkan baris baru dengan benar, termasuk badge "Statistik Usang" di dashboard Ringkasan.

## Acceptance Criteria

1. Tenant baru yang dibuat lewat `/platform` (`createTenantAction`) langsung punya baris di ke-11 tabel sesuai tabel struktural/faktual di atas, tanpa perlu aksi admin apa pun.
2. `statistik_sektor_usaha` tenant baru berisi 34 baris (17 sektor × 2 jenis) dengan `nilai_ribu_rupiah = null` — halaman "Sektor Usaha" langsung bisa dipakai (bukan kosong permanen).
3. Semua baris `statistik` hasil seed muncul di dashboard Ringkasan sebagai "Statistik Usang" (karena `updated_at` mundur jauh) sampai admin memperbarui nilainya.
4. Tidak ada nama orang/fakta spesifik desa lain (mis. "Kopi", tahun kepemimpinan golo-loni) yang ikut tersalin ke tenant baru — hanya struktur + placeholder eksplisit.
5. Migration aman dijalankan ulang (idempotent) — tenant `compang-kempo` yang sudah punya 2 baris `statistik` tidak kehilangan/dobel data setelah backfill, dan re-run migration tidak menghasilkan baris duplikat di tenant mana pun.
6. `desa_profil.jumlah_rt` (default 16) dan jumlah baris `wilayah_rt` hasil seed konsisten (16 baris) sejak tenant dibuat — tidak perlu admin membuka & menyimpan Identitas Desa dulu.

## Risiko

| Risiko | Mitigasi |
|---|---|
| Dummy value kelupaan, ke-publish ke situs publik sebagai data "asli" (mis. "0" dianggap angka sungguhan). | Mekanisme "Statistik Usang" (AC3) menyorot baris seed di dashboard admin sejak hari pertama; placeholder tabel lain eksplisit berlabel "(Contoh)"/"(Menunggu data)". |
| Template seed (snapshot SQL) makin usang seiring `golo-loni` berkembang. | Didokumentasikan eksplisit sebagai Non-Tujuan; evaluasi ulang kalau jumlah tenant sudah banyak dan pola makin stabil. |
| Backfill (K7) menimpa/dobel data `compang-kempo` yang sudah ada (2 baris statistik). | `on conflict do nothing` per tabel (kunci unik `tenant_id`+kolom identitas) — diverifikasi eksplisit di AC5 sebelum migration dianggap selesai. |
| Trigger DB gagal (mis. constraint bentrok) bikin insert tenant baru ikut gagal (satu transaksi). | Pola sama seperti `create_default_desa_profil_for_tenant` yang sudah terbukti jalan sejak migration 0011 — risiko sudah diterima desain sebelumnya. |

## Risiko

| Risiko | Mitigasi |
|---|---|
| Dummy value kelupaan, ke-publish ke situs publik sebagai data "asli" (mis. "0" dianggap angka sungguhan). | Manfaatkan mekanisme "Statistik Usang" (S4) supaya baris dummy langsung tersorot di dashboard admin sejak hari pertama. |
| Template seed (snapshot SQL) makin usang seiring `golo-loni` berkembang. | Didokumentasikan eksplisit sebagai Non-Tujuan; evaluasi ulang kalau jumlah tenant sudah banyak dan pola makin stabil. |
| Trigger DB gagal (mis. constraint bentrok) bikin insert tenant baru ikut gagal (satu transaksi). | Pola sama seperti `create_default_desa_profil_for_tenant` yang sudah terbukti jalan sejak migration 0011 — risiko sudah diterima desain sebelumnya. |
