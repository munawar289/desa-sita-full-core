-- Seeder Pola Data untuk Tenant Baru — PRD
-- docs/superpowers/specs/2026-07-23-seed-tenant-baru-prd.md (K4-K7, S4).
-- Fungsi `seed_tenant_defaults()` mengisi ke-11 tabel konten dengan pola
-- kategori/key/label/jabatan yang sama seperti tenant referensi (`golo-loni`,
-- 000...0001) per hari ini, tapi value/fakta spesifik diganti dummy yang
-- jelas "belum diisi". Trigger memicu fungsi ini otomatis saat tenant baru
-- dibuat, berdampingan dengan `create_default_desa_profil_for_tenant` (0011).
--
-- Catatan implementasi (di luar literal PRD, untuk menjaga idempotensi & tidak
-- merusak data tenant existing):
-- - `statistik`, `statistik_sektor_usaha`, `wilayah_rt`, `statistik_rt`,
--   `wilayah_info` sudah punya unique constraint tenant-scoped (0012) →
--   pakai `on conflict do nothing` per baris.
-- - `lembaga`, `aparatur`, `bpd_anggota`, `kepala_desa_riwayat`, `komoditas`,
--   `peternakan`, `potensi_desa` TIDAK punya unique constraint → guard di
--   level tabel (`if not exists (select 1 from ... where tenant_id = ...)`)
--   supaya re-run/backfill tidak menghasilkan baris dobel, dan tenant yang
--   sudah punya data sendiri di tabel itu (mis. `compang-kempo.potensi_desa`)
--   tidak ikut ketiban seed.
-- - Jumlah baris `wilayah_rt`/`statistik_rt` mengikuti `desa_profil.jumlah_rt`
--   milik tenant target (bukan literal 16) — supaya backfill tenant yang
--   sudah punya jumlah RT sendiri (mis. `compang-kempo` = 10) tidak ketambahan
--   RT dummy di luar jumlah yang sudah mereka tetapkan.
-- - 3 label `statistik` referensi ("...Desa Sita") digeneralisasi (nama
--   tenant referensi dihapus dari teks label) — konsisten dengan AC4
--   (tidak ada fakta spesifik desa lain yang ikut tersalin), begitu pula
--   judul section `sejarah` wilayah_info ("Sejarah Desa Sita" → "Sejarah Desa").
-- - `kepala_desa_riwayat.periode_mulai` aslinya `int not null` (0001_schema.sql),
--   padahal S4 eksplisit minta null untuk baris placeholder. Dilonggarkan jadi
--   nullable (konsisten dengan `periode_selesai` yang memang sudah nullable,
--   "null = belum diisi/masih menjabat") — publik & admin merender kolom ini
--   apa adanya tanpa validasi tambahan, jadi null tampil kosong (bukan "0"
--   yang terlihat seperti tahun asli yang salah dan ditolak validasi form
--   admin min(1800)).
alter table kepala_desa_riwayat alter column periode_mulai drop not null;

create or replace function public.seed_tenant_defaults(target_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_jumlah_rt integer;
begin
  select coalesce(
    (select jumlah_rt from desa_profil where tenant_id = target_tenant_id),
    16
  ) into v_jumlah_rt;

  -- ── statistik (39 baris: category/key/label disalin, value & updated_at didummy) ─
  insert into statistik (tenant_id, category, key, label, value, updated_at)
  values
    (target_tenant_id, 'aset_perumahan', 'jumlah_rumah', 'Aset Perumahan', '0', now() - interval '400 days'),
    (target_tenant_id, 'aset_sarana_produksi', 'total', 'Kepemilikan Aset Sarana Produksi', '0', now() - interval '400 days'),
    (target_tenant_id, 'aset_tanah', 'tanah_desa', 'Tanah Desa', '0', now() - interval '400 days'),
    (target_tenant_id, 'aset_transportasi', 'total', 'Kepemilikan Aset Transportasi Umum', '0', now() - interval '400 days'),
    (target_tenant_id, 'keamanan', 'linmas', 'Linmas Desa', '0', now() - interval '400 days'),
    (target_tenant_id, 'kependudukan', 'jumlah_dusun', 'Jumlah Dusun', '0', now() - interval '400 days'),
    (target_tenant_id, 'kependudukan', 'jumlah_kk', 'Jumlah KK', '0', now() - interval '400 days'),
    (target_tenant_id, 'kependudukan', 'laki_laki', 'Laki-laki', '0', now() - interval '400 days'),
    (target_tenant_id, 'kependudukan', 'luas_wilayah', 'Luas Wilayah', '0', now() - interval '400 days'),
    (target_tenant_id, 'kependudukan', 'perempuan', 'Perempuan', '0', now() - interval '400 days'),
    (target_tenant_id, 'kependudukan', 'total_penduduk', 'Total Penduduk', '0', now() - interval '400 days'),
    (target_tenant_id, 'lembaga_kemasyarakatan', 'dusun', 'Dusun', '0', now() - interval '400 days'),
    (target_tenant_id, 'lembaga_kemasyarakatan', 'lembaga_adat', 'Lembaga Adat Desa', '0', now() - interval '400 days'),
    (target_tenant_id, 'lembaga_kemasyarakatan', 'pkk', 'PKK', '0', now() - interval '400 days'),
    (target_tenant_id, 'lembaga_kemasyarakatan', 'posyandu', 'Posyandu', '0', now() - interval '400 days'),
    (target_tenant_id, 'lembaga_kemasyarakatan', 'rt', 'Rukun Tetangga (RT)', '0', now() - interval '400 days'),
    (target_tenant_id, 'lembaga_kemasyarakatan', 'rw', 'Rukun Warga (RW)', '0', now() - interval '400 days'),
    (target_tenant_id, 'lembaga_pendidikan_negeri', 'sd', 'SD Negeri', '0', now() - interval '400 days'),
    (target_tenant_id, 'lembaga_pendidikan_swasta', 'paud', 'PAUD Swasta', '0', now() - interval '400 days'),
    (target_tenant_id, 'lembaga_pendidikan_swasta', 'sd', 'SD Swasta', '0', now() - interval '400 days'),
    (target_tenant_id, 'lembaga_pendidikan_swasta', 'sma', 'SMA Swasta', '0', now() - interval '400 days'),
    (target_tenant_id, 'lembaga_pendidikan_swasta', 'smp', 'SMP Swasta', '0', now() - interval '400 days'),
    (target_tenant_id, 'mata_pencaharian', 'belum_kerja', 'Belum Bekerja', '0', now() - interval '400 days'),
    (target_tenant_id, 'mata_pencaharian', 'honorer', 'Honorer', '0', now() - interval '400 days'),
    (target_tenant_id, 'mata_pencaharian', 'pensiunan', 'Pensiunan', '0', now() - interval '400 days'),
    (target_tenant_id, 'mata_pencaharian', 'petani', 'Petani', '0', now() - interval '400 days'),
    (target_tenant_id, 'mata_pencaharian', 'pns', 'PNS', '0', now() - interval '400 days'),
    (target_tenant_id, 'rasio_guru_murid', 'guru', 'Guru', '0', now() - interval '400 days'),
    (target_tenant_id, 'sarana_kesehatan', 'polindes', 'Polindes', '0', now() - interval '400 days'),
    (target_tenant_id, 'sarana_kesehatan', 'poskesdes', 'Poskesdes', '0', now() - interval '400 days'),
    (target_tenant_id, 'sarana_kesehatan', 'posyandu', 'Posyandu', '0', now() - interval '400 days'),
    (target_tenant_id, 'sarana_kesehatan', 'puskesmas', 'Puskesmas', '0', now() - interval '400 days'),
    (target_tenant_id, 'sarana_kesehatan', 'toko_obat', 'Toko Obat', '0', now() - interval '400 days'),
    (target_tenant_id, 'wilayah', 'jumlah_dusun', 'Jumlah Dusun', '0', now() - interval '400 days'),
    (target_tenant_id, 'wilayah', 'jumlah_rt', 'Jumlah RT', '0', now() - interval '400 days'),
    (target_tenant_id, 'wilayah', 'jumlah_rt_rw', 'Jumlah RT/RW', '0', now() - interval '400 days'),
    (target_tenant_id, 'wilayah', 'jumlah_rw', 'Jumlah RW', '0', now() - interval '400 days'),
    (target_tenant_id, 'wilayah', 'kepadatan_penduduk', 'Kepadatan Penduduk', '0', now() - interval '400 days'),
    (target_tenant_id, 'wilayah', 'luas_wilayah', 'Luas Wilayah', '0', now() - interval '400 days')
  on conflict (tenant_id, category, key) do nothing;

  -- ── statistik_sektor_usaha (34 baris: 17 sektor x 2 jenis, nilai null) ──
  insert into statistik_sektor_usaha (tenant_id, jenis, kode, nama, nilai_ribu_rupiah, urutan)
  select target_tenant_id, j.jenis, s.kode, s.nama, null, s.urutan
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
  on conflict (tenant_id, jenis, kode) do nothing;

  -- ── wilayah_rt (mengikuti desa_profil.jumlah_rt tenant target) ─────────
  insert into wilayah_rt (tenant_id, nomor, nama, urutan)
  select target_tenant_id, lpad(gs::text, 3, '0'), 'RT ' || lpad(gs::text, 3, '0'), gs
  from generate_series(1, v_jumlah_rt) as gs
  on conflict (tenant_id, nomor) do nothing;

  -- ── statistik_rt (5 kategori x baris wilayah_rt tenant target, semua kosong) ─
  insert into statistik_rt (tenant_id, category, rt_id, value, detail)
  select target_tenant_id, c.category, wr.id, null, null
  from wilayah_rt wr
  cross join (values
    ('penduduk'), ('keluarga'), ('pengangguran'), ('aset_tanaman'), ('air_bersih')
  ) as c(category)
  where wr.tenant_id = target_tenant_id
  on conflict (tenant_id, category, rt_id) do nothing;

  -- ── wilayah_info (5 section: struktur disalin, konten didummy) ─────────
  insert into wilayah_info (tenant_id, section, page, judul, eyebrow, urutan, konten)
  values
    (target_tenant_id, 'sejarah', 'sejarah', 'Sejarah Desa', 'Narasi', 0, 'Konten belum diisi — perbarui dari halaman ini.'),
    (target_tenant_id, 'batas_wilayah', 'wilayah', 'Batas Wilayah', 'Geografi', 0, 'Konten belum diisi — perbarui dari halaman ini.'),
    (target_tenant_id, 'iklim', 'wilayah', 'Iklim', 'Cuaca', 1, 'Konten belum diisi — perbarui dari halaman ini.'),
    (target_tenant_id, 'potensi_wisata', 'wilayah', 'Desa Wisata', 'Potensi Wisata', 1, 'Konten belum diisi — perbarui dari halaman ini.'),
    (target_tenant_id, 'orbitasi', 'wilayah', 'Orbitasi', 'Jarak Tempuh', 2, 'Konten belum diisi — perbarui dari halaman ini.')
  on conflict (tenant_id, section) do nothing;

  -- ── lembaga (7 baris, guard tabel — tidak ada unique constraint natural) ─
  if not exists (select 1 from lembaga where tenant_id = target_tenant_id) then
    insert into lembaga (tenant_id, kategori, nama, dasar_hukum, jumlah_pengurus, keterangan, urutan)
    values
      (target_tenant_id, 'kemasyarakatan', 'PKK', null, null, null, 1),
      (target_tenant_id, 'kemasyarakatan', 'Karang Taruna', null, null, null, 2),
      (target_tenant_id, 'kemasyarakatan', 'Posyandu', null, null, null, 3),
      (target_tenant_id, 'ekonomi', 'Kelompok Tani', null, null, null, 4),
      (target_tenant_id, 'ekonomi', 'BUMDes', null, null, null, 5),
      (target_tenant_id, 'pendidikan', 'Komite Sekolah', null, null, null, 6),
      (target_tenant_id, 'keamanan', 'Linmas', null, null, null, 7);
  end if;

  -- ── aparatur (8 baris, guard tabel) ─────────────────────────────────────
  if not exists (select 1 from aparatur where tenant_id = target_tenant_id) then
    insert into aparatur (tenant_id, nama, jabatan, pendidikan, urutan)
    values
      (target_tenant_id, null, 'Kepala Desa', null, 1),
      (target_tenant_id, null, 'Sekretaris Desa', null, 2),
      (target_tenant_id, null, 'Kaur Keuangan', null, 3),
      (target_tenant_id, null, 'Kaur Umum & Perencanaan', null, 4),
      (target_tenant_id, null, 'Kasi Pemerintahan', null, 5),
      (target_tenant_id, null, 'Kasi Kesejahteraan', null, 6),
      (target_tenant_id, null, 'Kasi Pelayanan', null, 7),
      (target_tenant_id, null, 'Kaur Perencanaan', null, 8);
  end if;

  -- ── bpd_anggota (5 baris, guard tabel) ──────────────────────────────────
  if not exists (select 1 from bpd_anggota where tenant_id = target_tenant_id) then
    insert into bpd_anggota (tenant_id, nama, jabatan, pendidikan, urutan)
    values
      (target_tenant_id, '(Menunggu data)', 'Ketua', null, 1),
      (target_tenant_id, '(Menunggu data)', 'Wakil Ketua', null, 2),
      (target_tenant_id, '(Menunggu data)', 'Sekretaris', null, 3),
      (target_tenant_id, '(Menunggu data)', 'Anggota', null, 4),
      (target_tenant_id, '(Menunggu data)', 'Anggota', null, 5);
  end if;

  -- ── kepala_desa_riwayat (5 baris, guard tabel) ──────────────────────────
  if not exists (select 1 from kepala_desa_riwayat where tenant_id = target_tenant_id) then
    insert into kepala_desa_riwayat (tenant_id, nama, periode_mulai, periode_selesai, keterangan, urutan)
    values
      (target_tenant_id, '(Menunggu data)', null, null, null, 1),
      (target_tenant_id, '(Menunggu data)', null, null, null, 2),
      (target_tenant_id, '(Menunggu data)', null, null, null, 3),
      (target_tenant_id, '(Menunggu data)', null, null, null, 4),
      (target_tenant_id, '(Menunggu data)', null, null, null, 5);
  end if;

  -- ── komoditas (1 baris placeholder, guard tabel) ────────────────────────
  if not exists (select 1 from komoditas where tenant_id = target_tenant_id) then
    insert into komoditas (tenant_id, nama, luas_ha, hasil_panen, urutan)
    values (target_tenant_id, '(Contoh) Ganti dengan nama komoditas', null, null, 1);
  end if;

  -- ── peternakan (1 baris placeholder, guard tabel) ───────────────────────
  if not exists (select 1 from peternakan where tenant_id = target_tenant_id) then
    insert into peternakan (tenant_id, jenis_ternak, populasi, jumlah_pemilik, urutan)
    values (target_tenant_id, '(Contoh) Ganti dengan jenis ternak', null, null, 1);
  end if;

  -- ── potensi_desa (1 baris placeholder, guard tabel) ─────────────────────
  if not exists (select 1 from potensi_desa where tenant_id = target_tenant_id) then
    insert into potensi_desa (tenant_id, judul, deskripsi, icon, urutan)
    values (target_tenant_id, '(Contoh) Ganti dengan potensi desa', 'Isi deskripsi potensi desa Anda di sini.', 'Sparkles', 1);
  end if;
end;
$$;

-- Wrapper trigger (fungsi trigger tidak boleh menerima argumen eksplisit /
-- harus returns trigger) — memanggil seed_tenant_defaults(new.id) di atas.
-- seed_tenant_defaults() sendiri tetap fungsi biasa (returns void) supaya
-- bisa dipanggil langsung untuk backfill (K7, lihat statement di akhir file).
create or replace function public.seed_tenant_defaults_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.seed_tenant_defaults(new.id);
  return new;
end;
$$;

-- Nama trigger sengaja diurutkan setelah "on_tenant_created_desa_profil"
-- (0011) secara alfabetis ('d' < 's') — Postgres menjalankan AFTER INSERT
-- trigger per nama, jadi desa_profil (sumber jumlah_rt) sudah ada saat
-- seed_tenant_defaults() membaca v_jumlah_rt.
create trigger on_tenant_created_seed_defaults
  after insert on tenants
  for each row execute function public.seed_tenant_defaults_trigger();

-- ── Backfill tenant existing (K7) ─────────────────────────────────────────
-- compang-kempo & sita dibuat sebelum trigger ini dipasang, jadi dipanggil
-- manual sekali di sini. Idempotent: aman dijalankan ulang (guard tabel +
-- on conflict do nothing di atas), dan tidak menyentuh baris yang sudah ada
-- (mis. 2 baris statistik & 1 baris potensi_desa existing compang-kempo).
select public.seed_tenant_defaults(id)
from tenants
where id in (
  'be99ad57-4ac5-4d8a-a34e-e53e987a0500', -- compang-kempo
  'ec18a5da-5d45-4b77-9c7c-b3156f9955b5'  -- sita
);
