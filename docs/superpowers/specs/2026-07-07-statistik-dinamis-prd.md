# PRD — Statistik Dinamis (Widget Generik) Desa Sita

**Tanggal:** 2026-07-07
**Status:** Draft untuk direview
**Scope:** Refactor tabel `statistik` + 7 halaman publik `/data-desa/*` supaya penambahan/pengubahan konten statistik **tidak butuh campur tangan developer** selama masih dalam bentuk widget yang sudah didukung. **Tidak termasuk** tabel `statistik_rt`, `statistik_pendidikan`, `statistik_kelompok_umur`, `statistik_sektor_usaha`, `sarana_prasarana`, `lembaga` — sudah generik/fixed-enum by design (lihat §7).

---

## 1. Latar Belakang & Tujuan

### 1.1 Masalah saat ini

Tabel `statistik` (kolom `category`, `key`, `label`, `value`) sengaja dibuat bebas — admin bisa mengetik `category`/`key` apa saja lewat form "Tambah Statistik" di `/admin/statistik`, tanpa enum. Tapi 7 halaman publik justru mengonsumsinya dengan **mencocokkan literal string** yang di-hardcode di kode:

```ts
// contoh nyata: src/app/data-desa/wilayah-administratif/page.tsx
const stat = statistik.find((item) => item.category === "wilayah" && item.key === key);
```

Akibatnya: kalau admin menambah `category`/`key` baru (mis. `"jumlah_pengangguran"`), datanya **tersimpan tapi tidak pernah tampil** di halaman manapun — sampai developer menambah kode filter baru secara manual. ✅ Sudah tervalidasi lewat investigasi kode di 7 file:

| Halaman | Category lama yang di-hardcode |
|---|---|
| `data-desa/pendidikan` | `rasio_guru_murid`, `lembaga_pendidikan_negeri`, `lembaga_pendidikan_swasta` |
| `data-desa/kependudukan/penduduk` | `kependudukan` (key `laki_laki`/`perempuan`) |
| `data-desa/wilayah-administratif` | `wilayah` |
| `data-desa/ekonomi/mata-pencaharian` | `mata_pencaharian` |
| `data-desa/ekonomi/kesejahteraan-keluarga` | `kesejahteraan_keluarga` |
| `data-desa/keamanan-kelembagaan` | `keamanan`, `lembaga_kemasyarakatan` |
| `data-desa/kesehatan` | `sarana_kesehatan` |

Pola ini persis seperti bug `wilayah_info` yang sudah diperbaiki sebelumnya (lihat migration `0008_wilayah_info_dinamis.sql`) — bedanya di sana tiap baris adalah blok narasi mandiri (gampang di-loop generik). Di `statistik`, tiap halaman melakukan **komputasi/tata-letak khusus** per pasangan category/key (rasio, cross-tab jenjang × negeri-swasta, chart), jadi tidak bisa diselesaikan hanya dengan "loop semua baris".

### 1.2 Tujuan

- Admin bisa **menambah, mengedit, menghapus, dan mengubah urutan** kartu statistik/baris tabel/section baru pada halaman `/data-desa/*` yang sudah ada, **tanpa developer**, selama bentuknya masih salah satu dari 2 jenis widget yang didukung (§3).
- Menutup total kelas bug "data admin nyangkut diam-diam" — kalau admin bikin entri, entri itu **pasti** dirender di suatu tempat atau eksplisit ditolak validasi (bukan diam-diam hilang).
- Konsisten dengan prinsip PRD utama §9.2: *"admin bisa mengatur urutan tampil, bukan bergantung urutan insert"* dan `updated_at` sebagai tulang punggung indikator "data mutakhir".

### 1.3 Batasan yang disadari (non-goal)

- **Membuat top-level route/menu baru** (mis. halaman `/data-desa/xxx` yang benar-benar baru di navigasi) tetap butuh developer — Next.js pakai file-based routing, dan beberapa halaman (mis. Kesehatan) mencampur data dari tabel lain (`statistik_rt`) plus teks khusus yang tidak generik. Refactor ini membuat **isi** halaman yang sudah ada jadi dikelola penuh oleh admin, bukan menghapus kebutuhan developer selamanya.
- Jenis visualisasi yang benar-benar baru (mis. treemap, peta) tetap butuh kode baru. Yang dihilangkan adalah kebutuhan kode untuk *instance baru dari widget yang sudah ada* (kartu baru, baris tabel baru, section baru dengan chart bar/pie yang sudah ada).

---

## 2. Prinsip Desain

Ganti model "halaman tahu persis category/key apa yang dicari" menjadi **section generik**: satu tabel metadata section (`page` + judul + `kind` + `chart` + urutan), dan baris data (`statistik`) yang menempel ke section itu. Halaman publik jadi *renderer*, bukan *consumer* yang hardcode literal:

```
lama:  page.tsx tahu category="wilayah", key="luas_wilayah" → cari manual
baru:  page.tsx tahu page="wilayah-administratif" → ambil semua section miliknya → render sesuai kind
```

---

## 3. Data Model (Backend)

### 3.1 Tabel baru: `statistik_section`

```sql
create table statistik_section (
  id uuid primary key default gen_random_uuid(),
  page text not null,          -- slug halaman publik, mis. 'pendidikan', 'kependudukan-penduduk'
  judul text,                  -- heading section, mis. "Kelembagaan Pendidikan"; null = tampil tanpa heading (satu section polos per halaman)
  kind text not null check (kind in ('list', 'cross_tab')),
  chart text not null default 'none' check (chart in ('none', 'bar', 'pie')),
  urutan int not null default 0,
  updated_at timestamptz default now()
);
```

- **`kind = 'list'`** — daftar item `{label, value}` sepanjang apapun, dirender sebagai `StatCardGrid` + `StatTable` opsional + chart opsional. Mencakup: rasio guru/murid, gender, wilayah administratif, mata pencaharian, kesejahteraan keluarga, keamanan, lembaga kemasyarakatan, sarana kesehatan — **8 dari 9 section existing**.
- **`kind = 'cross_tab'`** — tabel 2 kolom seri (mis. Negeri/Swasta) × N baris yang key-nya union dari seri yang ada, dirender sebagai `StatTable` multi-kolom. Mencakup: Kelembagaan Pendidikan (1 section existing).
- **`chart`** — `none` (tanpa chart), `bar` (pakai `BarChartStatistik` yang sudah generic label/value), `pie` (khusus 2 kategori, dipakai gender). Chart untuk data per-RT (`BarChartRt`, `BarChartRtGrouped`) tetap di luar scope tabel ini (lihat §7).

### 3.2 Perubahan tabel `statistik`

```sql
alter table statistik
  add column section_id uuid references statistik_section(id) on delete cascade,
  add column seri text,              -- dipakai kind='cross_tab': nama kolom, mis. 'Negeri' / 'Swasta'
  add column urutan int not null default 0;

-- kolom `category` di-deprecate setelah backfill selesai (§5) — grouping sepenuhnya
-- pindah ke section_id supaya tidak ada 2 sumber kebenaran yang bisa saling beda.
```

- `key` tetap dipakai sebagai identitas baris di dalam satu `section` (terutama krusial untuk `cross_tab`: baris "PAUD" milik seri Negeri dan seri Swasta dicocokkan lewat `key = "paud"` yang sama).
- Label baris (mis. "PAUD") diambil dari kolom `label` pada baris manapun yang ada untuk `key` itu — union dari `key` di semua seri dalam satu `section_id`, bukan array hardcode (`JENJANG`) di kode seperti sekarang.
- Untuk `kind='list'` yang butuh ikon (Wilayah Administratif), tambah kolom opsional `icon text` dengan nilai dibatasi ke daftar ikon Lucide yang sudah diwhitelist di kode (pola identik `POTENSI_ICON_OPTIONS` yang sudah ada) — supaya admin pilih dari dropdown ikon, bukan ketik bebas.

### 3.3 Pemetaan section existing → skema baru

| `page` (slug) | `judul` section | `kind` | `chart` | Category lama (jadi baris, dikelompokkan `section_id`) |
|---|---|---|---|---|
| `pendidikan` | Rasio Guru dan Murid | list | none | `rasio_guru_murid` (key `guru`, `murid`) |
| `pendidikan` | Kelembagaan Pendidikan | cross_tab | none | `lembaga_pendidikan_negeri` → seri `Negeri`; `lembaga_pendidikan_swasta` → seri `Swasta` |
| `kependudukan-penduduk` | Menurut Jenis Kelamin | list | pie | `kependudukan` (key `laki_laki`, `perempuan`) |
| `wilayah-administratif` | *(null)* | list | none | `wilayah` (key `luas_wilayah`, `jumlah_dusun`, `jumlah_rt`, `jumlah_rw`, `kepadatan_penduduk` + `icon` per baris) |
| `ekonomi-mata-pencaharian` | *(null)* | list | bar | `mata_pencaharian` |
| `ekonomi-kesejahteraan-keluarga` | *(null)* | list | bar | `kesejahteraan_keluarga` |
| `keamanan-kelembagaan` | Keamanan & Ketertiban | list | none | `keamanan` |
| `keamanan-kelembagaan` | Lembaga Kemasyarakatan | list | bar | `lembaga_kemasyarakatan` |
| `kesehatan` | Sarana & Prasarana Kesehatan | list | none | `sarana_kesehatan` |

Bagian lain di halaman Kesehatan (Cakupan Air Bersih per-RT, daftar 7 kategori Prodeskel yang kosong total) **tidak** dipindah ke sini — sumbernya tabel `statistik_rt` / teks statis yang memang belum ada datanya sama sekali (lihat §7).

---

## 4. Admin UX (`/admin/statistik`)

- **Section** jadi entitas yang dikelola eksplisit (bukan lagi tersirat dari string `category`): daftar section per halaman, masing-masing bisa "Tambah Section" baru (isi: pilih halaman dari dropdown daftar `page` yang sudah ada, judul, kind, chart) atau **Tambah Baris** ke section yang sudah ada (label, value, key, seri jika `kind=cross_tab`, urutan).
- Form "Tambah Baris" **menyesuaikan field yang tampil** berdasarkan `kind` section yang dipilih — pola sama seperti form admin lain di project ini yang sudah field-nya kondisional (mis. `AddPotensiForm` dengan dropdown ikon).
- Validasi server (`statistikFormSchema`) menolak baris tanpa `section_id` valid — tidak ada lagi jalur untuk membuat baris "melayang" tanpa section.
- Reorder (`urutan`) section maupun baris di dalamnya, konsisten dengan pola `urutan` yang sudah dipakai di `komoditas`/`peternakan`/`potensi_desa`.

## 5. Halaman Publik — Rendering Generik

Tiap `page.tsx` yang disebut di §3.3 disederhanakan jadi:

```ts
const sections = await getStatistikSections("wilayah-administratif"); // urut oleh `urutan`
// sections.map(section => render <ListWidget> atau <CrossTabWidget> sesuai section.kind)
```

Dua komponen generik baru menggantikan logika bespoke yang sekarang ada di 7 file:
- `<StatSectionList section={...} />` — render `StatCardGrid` + chart (`bar`/`pie`/none) + `StatTable`, generik atas jumlah baris berapapun.
- `<StatSectionCrossTab section={...} />` — hitung union `key` dari seluruh seri dalam section, render `StatTable` multi-kolom.

Logika **spesifik non-generik** yang tetap boleh tinggal di masing-masing `page.tsx` (bukan bagian dari widget system ini): pesan "rasio belum bisa dihitung" di Pendidikan, blok Air Bersih & Kategori Kosong di Kesehatan (sumber data beda tabel).

## 6. Migrasi Data & Rollout

1. Migration baru: buat `statistik_section`, tambah kolom ke `statistik` (§3.2) — additive, tidak menghapus `category`/`key` dulu (masa transisi).
2. Script backfill satu kali: buat 9 baris `statistik_section` sesuai tabel §3.3, lalu `update statistik set section_id = ..., seri = ...` berdasarkan `category` lama.
3. Ganti 7 `page.tsx` + query layer ke model baru, pasang komponen generik (§5).
4. Setelah verifikasi publik + admin cocok, migration lanjutan: `alter table statistik drop column category` (kolom `key` tetap dipakai, sekarang scoped per `section_id`, bukan per `category` global — perlu unique constraint baru `unique (section_id, key, seri)` menggantikan constraint lama yang mungkin berbasis `(category, key)`).
5. Checkpoint wajib di antara langkah 3 dan 4 — jangan drop `category` sebelum semua 7 halaman + dashboard admin dikonfirmasi jalan (pola checkpoint yang sama dipakai di PRD Statistik Lanjutan §6).

## 7. Yang Tidak Termasuk (tetap seperti sekarang, sudah dikonfirmasi aman)

- **`statistik_rt`** — breakdown 16 RT tetap, tidak ada CRUD tambah-kategori, out of scope.
- **`statistik_pendidikan`, `statistik_kelompok_umur`, `statistik_sektor_usaha`** — sudah generik (baris = admin bebas tambah/edit/urut lewat CRUD existing), tidak butuh perubahan.
- **`sarana_prasarana`** — tidak punya CRUD admin sama sekali (di luar scope PRD ini).
- **`lembaga.kategori`** — enum tetap (`kemasyarakatan`/`ekonomi`/`pendidikan`/`keamanan`) by design, sengaja dibatasi.
- Rate limiting, auth, RLS baru — pola RLS `statistik_section` mengikuti pola `statistik_public_read` + `statistik_staff_write` yang sudah ada (§9.3 PRD utama), tidak ada policy baru yang perlu didesain dari nol.

## 8. Risiko & Pertanyaan Terbuka

- **Urutan kolom pada `cross_tab`** (mis. Negeri di kiri, Swasta di kanan) — perlu aturan eksplisit saat implementasi: urut berdasarkan `urutan` minimum baris di tiap `seri`, atau tambah kolom `seri_urutan` di `statistik_section` kalau butuh kontrol lebih presisi. Belum dikunci di PRD ini.
- **Ikon untuk Wilayah Administratif** — perlu daftar whitelist ikon Lucide baru (mirip `POTENSI_ICON_OPTIONS`) yang relevan untuk konteks statistik administratif (luas, kepadatan, jumlah RT/RW, dsb) — perlu disusun saat implementasi.
- **Drop kolom `category`** (langkah 4 di §6) bersifat destruktif — pastikan tidak ada kode/dashboard lain yang masih baca kolom itu sebelum dieksekusi (grep menyeluruh sebagai bagian dari checkpoint).
- **Siapa yang akan pakai fitur "Tambah Section" ini secara rutin?** Sama seperti catatan risiko di PRD utama §14 soal komitmen SDM untuk update statistik — kalau tidak ada operator yang aktif memanfaatkannya, kompleksitas tambahan (section+kind+chart) di form admin berisiko jadi overhead UX tanpa manfaat nyata. Perlu konfirmasi ke pemerintah desa sebelum implementasi dimulai.
