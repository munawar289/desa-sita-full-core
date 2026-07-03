-- Statistik Lanjutan (Prodeskel) — Kelompok 1: Kependudukan & Ekonomi
-- PRD docs/superpowers/specs/2026-07-03-statistik-lanjutan-prd.md §3.3, §3.4, §6
--
-- Jalankan SETELAH migrations/0004_statistik_lanjutan.sql, lewat Supabase SQL
-- Editor pada project yang SUDAH terisi supabase/seed.sql (Fase 1/2).
-- Beda dengan seed.sql (basis fresh install): file ini mengoreksi baris yang
-- sudah ada + menambah kategori/tabel baru, jadi aman dijalankan satu kali di
-- atas database yang sudah live. Sumber angka: `Template Ragam Data dan
-- Template Tabel daesa Sita.xlsx` (14 sheet Prodeskel).

-- ── 1. Koreksi data kependudukan yang salah di seed Fase 1 (PRD §3.4) ────
-- Angka lama diambil dari situs referensi lama, bukan sumber Prodeskel resmi.
update statistik set value = '3.259', updated_at = now() where category = 'kependudukan' and key = 'total_penduduk';
update statistik set value = '873',   updated_at = now() where category = 'kependudukan' and key = 'jumlah_kk';
update statistik set value = '1627',  updated_at = now() where category = 'kependudukan' and key = 'laki_laki';
update statistik set value = '1632',  updated_at = now() where category = 'kependudukan' and key = 'perempuan';

-- Struktur wilayah: Dusun(4) tetap, RT(16)/RW(8) adalah level baru.
-- `jumlah_rt_rw` versi Fase 1 ("8 RT / 4 RW") ternyata memakai angka yang
-- sama salahnya dengan total_penduduk/jumlah_kk di atas — diperbaiki sekalian.
insert into statistik (category, key, label, value, updated_at) values
  ('wilayah', 'jumlah_rt', 'Jumlah RT', '16', now()),
  ('wilayah', 'jumlah_rw', 'Jumlah RW', '8', now())
on conflict (category, key) do update set value = excluded.value, updated_at = now();

update statistik set value = '16 RT / 8 RW', updated_at = now() where category = 'wilayah' and key = 'jumlah_rt_rw';

-- ── 2. Ganti seluruh isi statistik_kelompok_umur (rentang 10 tahunan) ────
delete from statistik_kelompok_umur;
insert into statistik_kelompok_umur (kelompok_usia, jumlah, urutan) values
  ('0-10 tahun', 548, 1),
  ('11-20 tahun', 624, 2),
  ('21-30 tahun', 718, 3),
  ('31-40 tahun', 469, 4),
  ('41-50 tahun', 354, 5),
  ('51-60 tahun', 296, 6),
  ('61-70 tahun', 177, 7),
  ('71-80 tahun', 52, 8),
  ('81-90 tahun', 14, 9);

-- ── 3. Ganti seluruh isi statistik_pendidikan (label & angka riil source) ─
delete from statistik_pendidikan;
insert into statistik_pendidikan (tingkat, jumlah, urutan) values
  ('BLM SEKOLAH', 277, 1),
  ('PAUD', 125, 2),
  ('SD', 1250, 3),
  ('SMP', 397, 4),
  ('SMA', 895, 5),
  ('DIII/DIV', 24, 6),
  ('S1/S2', 289, 7);

-- ── 4. Kategori baru di `statistik` — domain Ekonomi (Kelompok 1) ───────
insert into statistik (category, key, label, value, updated_at) values
  ('mata_pencaharian', 'belum_kerja', 'Belum Bekerja', '1278', now()),
  ('mata_pencaharian', 'petani', 'Petani', '1683', now()),
  ('mata_pencaharian', 'honorer', 'Honorer', '168', now()),
  ('mata_pencaharian', 'pns', 'PNS', '99', now()),
  ('mata_pencaharian', 'pensiunan', 'Pensiunan', '23', now()),
  ('aset_tanah', 'tanah_desa', 'Tanah Desa', '633 m²', now()),
  ('aset_perumahan', 'jumlah_rumah', 'Aset Perumahan', '672 Rumah', now()),
  -- Baris "Desa Sita: 12" di source tidak dipecah per jenis aset (lihat PRD
  -- §8, pertanyaan terbuka) — diseed apa adanya sebagai total desa, BUKAN
  -- per-RT, sampai ada klarifikasi resmi dari pemdes.
  ('aset_transportasi', 'total', 'Kepemilikan Aset Transportasi Umum (Desa Sita)', '12', now()),
  ('aset_sarana_produksi', 'total', 'Kepemilikan Aset Sarana Produksi (Desa Sita)', '12', now())
on conflict (category, key) do update set value = excluded.value, updated_at = now();

-- kesejahteraan_keluarga, PDB, Pendapatan Riil sengaja TIDAK diinsert di sini
-- (kosong total di source) — halaman publik render EmptyState karena tidak
-- ada baris yang match kategorinya (lihat query layer).

-- ── 5. statistik_rt — kategori dalam scope Kelompok 1 ────────────────────
-- wilayah_rt (16 baris, dipakai lintas domain termasuk Kelompok 2 nanti)
insert into wilayah_rt (nomor, nama, urutan) values
  ('001', 'RT 001', 1), ('002', 'RT 002', 2), ('003', 'RT 003', 3), ('004', 'RT 004', 4),
  ('005', 'RT 005', 5), ('006', 'RT 006', 6), ('007', 'RT 007', 7), ('008', 'RT 008', 8),
  ('009', 'RT 009', 9), ('010', 'RT 010', 10), ('011', 'RT 011', 11), ('012', 'RT 012', 12),
  ('013', 'RT 013', 13), ('014', 'RT 014', 14), ('015', 'RT 015', 15), ('016', 'RT 016', 16)
on conflict (nomor) do nothing;

-- penduduk per RT (terisi)
insert into statistik_rt (category, rt_id, value, updated_at)
select 'penduduk', wr.id, v.jumlah, now()
from (values
  ('001', 157), ('002', 154), ('003', 220), ('004', 159),
  ('005', 195), ('006', 243), ('007', 212), ('008', 168),
  ('009', 176), ('010', 215), ('011', 147), ('012', 287),
  ('013', 159), ('014', 334), ('015', 191), ('016', 242)
) as v(nomor, jumlah)
join wilayah_rt wr on wr.nomor = v.nomor
on conflict (category, rt_id) do update set value = excluded.value, updated_at = now();

-- keluarga per RT (terisi)
insert into statistik_rt (category, rt_id, value, updated_at)
select 'keluarga', wr.id, v.jumlah, now()
from (values
  ('001', 44), ('002', 44), ('003', 61), ('004', 41),
  ('005', 51), ('006', 65), ('007', 55), ('008', 46),
  ('009', 50), ('010', 59), ('011', 42), ('012', 72),
  ('013', 42), ('014', 86), ('015', 51), ('016', 64)
) as v(nomor, jumlah)
join wilayah_rt wr on wr.nomor = v.nomor
on conflict (category, rt_id) do update set value = excluded.value, updated_at = now();

-- pengangguran per RT — kosong total di source, tapi baris tetap dibuat
-- (value null) supaya admin punya 16 baris siap isi di /admin/statistik/per-rt.
insert into statistik_rt (category, rt_id, value, updated_at)
select 'pengangguran', wr.id, null, now()
from wilayah_rt wr
on conflict (category, rt_id) do nothing;

-- aset_tanaman per RT (Kepemilikan Aset Lainnya: kopi/cengkeh/kakao/kemiri)
-- — kosong total di source, detail null, siap isi admin.
insert into statistik_rt (category, rt_id, detail, updated_at)
select 'aset_tanaman', wr.id, null, now()
from wilayah_rt wr
on conflict (category, rt_id) do nothing;

-- ── 6. statistik_sektor_usaha — PDB & Pendapatan Riil (Kelompok 1) ───────
-- Kosong total di source untuk kedua jenis — baris 17 sektor tetap dibuat
-- (nilai null) supaya admin punya kerangka siap isi di
-- /admin/statistik/sektor-usaha.
insert into statistik_sektor_usaha (jenis, kode, nama, nilai_ribu_rupiah, urutan)
select j.jenis, s.kode, s.nama, null, s.urutan
from (values ('pdb'), ('pendapatan_riil')) as j(jenis)
cross join (values
  ('A', 'Pertanian, Kehutanan, dan Perikanan', 1),
  ('B', 'Pertambangan dan Penggalian', 2),
  ('C', 'Industri Pengolahan', 3),
  ('D', 'Pengadaan Listrik dan Gas', 4),
  ('E', 'Pengadaan Air, Pengelolaan Sampah, Limbah dan Daur Ulang', 5),
  ('F', 'Konstruksi', 6),
  ('G', 'Perdagangan Besar dan Eceran; Reparasi Mobil dan Sepeda Motor', 7),
  ('H', 'Transportasi dan Pergudangan', 8),
  ('I', 'Penyediaan Akomodasi dan Makan Minum', 9),
  ('J', 'Informasi dan Komunikasi', 10),
  ('K', 'Jasa Keuangan dan Asuransi', 11),
  ('L', 'Real Estate', 12),
  ('M,N', 'Jasa Perusahaan', 13),
  ('O', 'Administrasi Pemerintahan, Pertahanan dan Jaminan Sosial Wajib', 14),
  ('P', 'Jasa Pendidikan', 15),
  ('Q', 'Jasa Kesehatan dan Kegiatan Sosial', 16),
  ('R,S,T,U', 'Jasa lainnya', 17)
) as s(kode, nama, urutan)
on conflict (jenis, kode) do nothing;
