-- Seed data awal Desa Sita — PRD §12
-- Sumber: profil desa versi sebelumnya. Nilai identik dengan fallback mock di
-- src/lib/data/*.ts supaya publik melihat tampilan yang sama sebelum & sesudah
-- Supabase terhubung. Baris bertanda "(Menunggu data)" perlu diganti data riil
-- lewat dashboard admin begitu tersedia.

-- ── Statistik ────────────────────────────────────────────────────────────
-- Sumber angka kependudukan & domain lanjutan: `Template Ragam Data dan
-- Template Tabel daesa Sita.xlsx` (Prodeskel, PRD statistik-lanjutan §2, §3.4).
insert into statistik (category, key, label, value, updated_at) values
  ('kependudukan', 'total_penduduk', 'Total Penduduk', '3.259', '2026-06-01'),
  ('kependudukan', 'jumlah_kk', 'Jumlah KK', '873', '2026-06-01'),
  ('kependudukan', 'laki_laki', 'Laki-laki', '1627', '2026-06-01'),
  ('kependudukan', 'perempuan', 'Perempuan', '1632', '2026-06-01'),
  ('kependudukan', 'luas_wilayah', 'Luas Wilayah', '1.400 ha', '2026-06-01'),
  ('kependudukan', 'jumlah_dusun', 'Jumlah Dusun', '4', '2026-06-01'),
  ('wilayah', 'luas_wilayah', 'Luas Wilayah', '1.400 ha', '2026-06-01'),
  ('wilayah', 'jumlah_dusun', 'Jumlah Dusun', '4', '2026-06-01'),
  ('wilayah', 'jumlah_rt', 'Jumlah RT', '16', '2026-06-01'),
  ('wilayah', 'jumlah_rw', 'Jumlah RW', '8', '2026-06-01'),
  ('wilayah', 'jumlah_rt_rw', 'Jumlah RT/RW', '16 RT / 8 RW', '2026-06-01'),
  ('wilayah', 'kepadatan_penduduk', 'Kepadatan Penduduk', '228 jiwa/km²', '2026-06-01'),
  ('mata_pencaharian', 'belum_kerja', 'Belum Bekerja', '1278', '2026-06-01'),
  ('mata_pencaharian', 'petani', 'Petani', '1683', '2026-06-01'),
  ('mata_pencaharian', 'honorer', 'Honorer', '168', '2026-06-01'),
  ('mata_pencaharian', 'pns', 'PNS', '99', '2026-06-01'),
  ('mata_pencaharian', 'pensiunan', 'Pensiunan', '23', '2026-06-01'),
  ('aset_tanah', 'tanah_desa', 'Tanah Desa', '633 m²', '2026-06-01'),
  ('aset_perumahan', 'jumlah_rumah', 'Aset Perumahan', '672 Rumah', '2026-06-01'),
  ('aset_transportasi', 'total', 'Kepemilikan Aset Transportasi Umum (Desa Sita)', '12', '2026-06-01'),
  ('aset_sarana_produksi', 'total', 'Kepemilikan Aset Sarana Produksi (Desa Sita)', '12', '2026-06-01'),
  ('rasio_guru_murid', 'guru', 'Guru', '120', '2026-06-01'),
  ('lembaga_pendidikan_negeri', 'sd', 'SD Negeri', '1', '2026-06-01'),
  ('lembaga_pendidikan_swasta', 'paud', 'PAUD Swasta', '3', '2026-06-01'),
  ('lembaga_pendidikan_swasta', 'sd', 'SD Swasta', '2', '2026-06-01'),
  ('lembaga_pendidikan_swasta', 'smp', 'SMP Swasta', '2', '2026-06-01'),
  ('lembaga_pendidikan_swasta', 'sma', 'SMA Swasta', '2', '2026-06-01'),
  ('sarana_kesehatan', 'posyandu', 'Posyandu', '9 Titik', '2026-06-01'),
  ('sarana_kesehatan', 'puskesmas', 'Puskesmas', '1', '2026-06-01'),
  ('sarana_kesehatan', 'poskesdes', 'Poskesdes', '1', '2026-06-01'),
  ('sarana_kesehatan', 'polindes', 'Polindes', '1', '2026-06-01'),
  ('sarana_kesehatan', 'toko_obat', 'Toko Obat', '2', '2026-06-01'),
  ('keamanan', 'linmas', 'Linmas Desa Sita', '7 Orang', '2026-06-01'),
  ('lembaga_kemasyarakatan', 'rt', 'Rukun Tetangga (RT)', '16', '2026-06-01'),
  ('lembaga_kemasyarakatan', 'rw', 'Rukun Warga (RW)', '8', '2026-06-01'),
  ('lembaga_kemasyarakatan', 'pkk', 'PKK', '6', '2026-06-01'),
  ('lembaga_kemasyarakatan', 'posyandu', 'Posyandu', '9', '2026-06-01'),
  ('lembaga_kemasyarakatan', 'lembaga_adat', 'Lembaga Adat Desa', '5', '2026-06-01'),
  ('lembaga_kemasyarakatan', 'dusun', 'Dusun', '4', '2026-06-01')
on conflict (category, key) do nothing;
-- kesejahteraan_keluarga, PDB, Pendapatan Riil, dan sebagian besar kategori
-- Kesehatan (kualitas bayi/ibu hamil/persalinan, wabah penyakit, gizi
-- balita, imunisasi, KB) sengaja tidak diseed di sini (kosong total di
-- source) — publik menampilkan EmptyState.

-- ── Kelompok umur (rentang 10 tahunan, sesuai source Prodeskel) ──────────
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

-- ── Pendidikan (label & angka riil source Prodeskel) ──────────────────────
insert into statistik_pendidikan (tingkat, jumlah, urutan) values
  ('BLM SEKOLAH', 277, 1),
  ('PAUD', 125, 2),
  ('SD', 1250, 3),
  ('SMP', 397, 4),
  ('SMA', 895, 5),
  ('DIII/DIV', 24, 6),
  ('S1/S2', 289, 7);

-- ── Wilayah RT (16 baris) ──────────────────────────────────────────────
insert into wilayah_rt (nomor, nama, urutan) values
  ('001', 'RT 001', 1), ('002', 'RT 002', 2), ('003', 'RT 003', 3), ('004', 'RT 004', 4),
  ('005', 'RT 005', 5), ('006', 'RT 006', 6), ('007', 'RT 007', 7), ('008', 'RT 008', 8),
  ('009', 'RT 009', 9), ('010', 'RT 010', 10), ('011', 'RT 011', 11), ('012', 'RT 012', 12),
  ('013', 'RT 013', 13), ('014', 'RT 014', 14), ('015', 'RT 015', 15), ('016', 'RT 016', 16)
on conflict (nomor) do nothing;

-- ── Statistik per-RT — kategori dalam scope Kelompok 1 ───────────────────
insert into statistik_rt (category, rt_id, value)
select 'penduduk', wr.id, v.jumlah
from (values
  ('001', 157), ('002', 154), ('003', 220), ('004', 159),
  ('005', 195), ('006', 243), ('007', 212), ('008', 168),
  ('009', 176), ('010', 215), ('011', 147), ('012', 287),
  ('013', 159), ('014', 334), ('015', 191), ('016', 242)
) as v(nomor, jumlah)
join wilayah_rt wr on wr.nomor = v.nomor
on conflict (category, rt_id) do nothing;

insert into statistik_rt (category, rt_id, value)
select 'keluarga', wr.id, v.jumlah
from (values
  ('001', 44), ('002', 44), ('003', 61), ('004', 41),
  ('005', 51), ('006', 65), ('007', 55), ('008', 46),
  ('009', 50), ('010', 59), ('011', 42), ('012', 72),
  ('013', 42), ('014', 86), ('015', 51), ('016', 64)
) as v(nomor, jumlah)
join wilayah_rt wr on wr.nomor = v.nomor
on conflict (category, rt_id) do nothing;

-- pengangguran & aset_tanaman per RT: kosong total di source, baris tetap
-- dibuat (nilai null) supaya admin punya kerangka 16-baris siap isi.
insert into statistik_rt (category, rt_id, value)
select 'pengangguran', wr.id, null from wilayah_rt wr
on conflict (category, rt_id) do nothing;

insert into statistik_rt (category, rt_id, detail)
select 'aset_tanaman', wr.id, null from wilayah_rt wr
on conflict (category, rt_id) do nothing;

-- Cakupan air bersih per RT — lihat catatan asumsi PDAM/Air Ledeng di
-- seed_lanjutan_kelompok2.sql.
insert into statistik_rt (category, rt_id, detail)
select 'air_bersih', wr.id, jsonb_build_object('pdam', v.pdam, 'ledeng', v.ledeng)
from (values
  ('001', 44, 0), ('002', 44, 0), ('003', 61, 0), ('004', 41, 0),
  ('005', 51, 0), ('006', 65, 0), ('007', 55, 0), ('008', 46, 0),
  ('009', 50, 0), ('010', 59, 0), ('011', 42, 0), ('012', 72, 0),
  ('013', 42, 0), ('014', 0, 86), ('015', 0, 51), ('016', 0, 64)
) as v(nomor, pdam, ledeng)
join wilayah_rt wr on wr.nomor = v.nomor
on conflict (category, rt_id) do nothing;

-- ── Sektor usaha — PDB & Pendapatan Riil (kosong total di source) ────────
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

-- ── Komoditas ────────────────────────────────────────────────────────────
insert into komoditas (nama, luas_ha, hasil_panen, urutan) values
  ('Kopi', 55.5, '±0,6 ton/ha/tahun', 1),
  ('Kakao', 88.5, '±0,5 ton/ha/tahun', 2),
  ('Padi Sawah', 178, 'Irigasi, 2x tanam/tahun', 3),
  ('Jagung', 12.5, 'Musiman', 4);

-- ── Peternakan ───────────────────────────────────────────────────────────
insert into peternakan (jenis_ternak, populasi, jumlah_pemilik, urutan) values
  ('Babi', 612, 287, 1),
  ('Ayam Kampung', 1840, 401, 2),
  ('Sapi', 214, 96, 3),
  ('Kerbau', 58, 22, 4);

-- ── Potensi desa (kartu beranda) ─────────────────────────────────────────
insert into potensi_desa (judul, deskripsi, icon, urutan) values
  ('Pertanian', 'Lahan pertanian warga menghasilkan berbagai komoditas pangan unggulan desa.', 'Sprout', 1),
  ('Perkebunan', 'Komoditas perkebunan menjadi salah satu sumber penghidupan utama masyarakat.', 'Trees', 2),
  ('Peternakan', 'Peternakan warga turut menopang ekonomi rumah tangga di desa.', 'Beef', 3);

-- ── Sarana & prasarana ───────────────────────────────────────────────────
insert into sarana_prasarana (kategori, nama, jumlah, urutan) values
  ('Pendidikan', 'PAUD/TK', '2 unit', 1),
  ('Pendidikan', 'SD', '3 unit', 2),
  ('Pendidikan', 'SMP', '1 unit', 3),
  ('Kesehatan', 'Puskesmas Pembantu', '1 unit', 4),
  ('Kesehatan', 'Posyandu', '4 unit', 5),
  ('Peribadatan', 'Gereja Katolik', '3 unit', 6),
  ('Peribadatan', 'Kapela', '4 unit', 7),
  ('Umum', 'Balai Desa', '1 unit', 8),
  ('Umum', 'Sumber Air Bersih', '6 titik', 9);

-- ── Info wilayah naratif ─────────────────────────────────────────────────
insert into wilayah_info (section, konten, page, judul, eyebrow, urutan, updated_at) values
  ('sejarah', 'Narasi sejarah berdirinya Desa Sita akan ditampilkan di sini setelah dokumen profil desa tersedia.', 'sejarah', 'Sejarah Desa Sita', 'Narasi', 0, '2026-06-01'),
  ('batas_wilayah', 'Desa Sita berada di kaki pegunungan Rana Mese, Kecamatan Rana Mese, Kabupaten Manggarai Timur, Nusa Tenggara Timur. Sebelah utara berbatasan dengan kawasan hutan lindung, sebelah selatan dengan desa tetangga, sebelah timur dan barat dengan wilayah perkebunan dan persawahan warga.', 'wilayah', 'Batas Wilayah', 'Geografi', 0, '2026-06-01'),
  ('iklim', 'Desa Sita beriklim tropis pegunungan dengan curah hujan tinggi pada musim hujan (November–April) dan suhu udara sejuk sepanjang tahun, cocok untuk komoditas kopi dan kakao.', 'wilayah', 'Iklim', 'Cuaca', 1, '2026-06-01'),
  ('orbitasi', 'Jarak ke ibu kota kecamatan sekitar 6 km, ke ibu kota kabupaten sekitar 45 km, ditempuh dengan kendaraan roda dua maupun roda empat.', 'wilayah', 'Orbitasi', 'Jarak Tempuh', 2, '2026-06-01')
on conflict (section) do nothing;

-- ── Aparatur (nama menunggu data riil, jabatan sudah representatif) ─────
insert into aparatur (nama, jabatan, pendidikan, urutan) values
  (null, 'Kepala Desa', null, 1),
  (null, 'Sekretaris Desa', null, 2),
  (null, 'Kaur Keuangan', null, 3),
  (null, 'Kaur Umum & Perencanaan', null, 4),
  (null, 'Kasi Pemerintahan', null, 5),
  (null, 'Kasi Kesejahteraan', null, 6),
  (null, 'Kasi Pelayanan', null, 7);

-- ── BPD (nama menunggu data riil) ────────────────────────────────────────
insert into bpd_anggota (nama, jabatan, pendidikan, urutan) values
  ('(Menunggu data)', 'Ketua', null, 1),
  ('(Menunggu data)', 'Wakil Ketua', null, 2),
  ('(Menunggu data)', 'Sekretaris', null, 3),
  ('(Menunggu data)', 'Anggota', null, 4),
  ('(Menunggu data)', 'Anggota', null, 5);

-- ── Riwayat Kepala Desa (nama menunggu data riil) ───────────────────────
insert into kepala_desa_riwayat (nama, periode_mulai, periode_selesai, keterangan, urutan) values
  ('(Menunggu data)', 1966, 1980, null, 1),
  ('(Menunggu data)', 1980, 1998, null, 2),
  ('(Menunggu data)', 1998, 2007, null, 3),
  ('(Menunggu data)', 2007, 2019, null, 4),
  ('(Menunggu data)', 2019, null, null, 5);

-- ── Lembaga desa ─────────────────────────────────────────────────────────
insert into lembaga (kategori, nama, dasar_hukum, jumlah_pengurus, keterangan, urutan) values
  ('kemasyarakatan', 'PKK', 'SK Kepala Desa', 12, 'Pemberdayaan kesejahteraan keluarga', 1),
  ('kemasyarakatan', 'Karang Taruna', 'SK Kepala Desa', 15, 'Organisasi kepemudaan desa', 2),
  ('kemasyarakatan', 'Posyandu', 'SK Kepala Desa', 20, 'Layanan kesehatan ibu dan anak, 4 pos di tiap dusun', 3),
  ('ekonomi', 'Kelompok Tani', 'SK Kepala Desa', 8, 'Pendampingan petani kopi, kakao, dan padi', 4),
  ('ekonomi', 'BUMDes', 'Perdes', 5, 'Badan Usaha Milik Desa', 5),
  ('pendidikan', 'Komite Sekolah', 'SK Kepala Sekolah', 6, 'Mitra pengelolaan sekolah desa', 6),
  ('keamanan', 'Linmas', 'SK Kepala Desa', 10, 'Perlindungan masyarakat tingkat desa', 7);

-- ── Berita (konten contoh — ganti lewat dashboard admin di Fase 3) ──────
insert into berita (judul, slug, kategori, ringkasan, konten, status, published_at) values
  (
    'Situs Resmi Desa Sita Resmi Diluncurkan',
    'situs-resmi-desa-sita-diluncurkan',
    'Pengumuman',
    'Pemerintah Desa Sita meluncurkan situs resmi sebagai satu pintu informasi data desa, layanan, dan pengaduan warga.',
    'Pemerintah Desa Sita meluncurkan situs resmi sebagai satu pintu informasi data desa, layanan, dan pengaduan warga. Situs ini menyajikan data kependudukan, potensi desa, serta profil pemerintahan secara terbuka dan mudah diakses oleh warga maupun pihak luar.',
    'published',
    '2026-06-15T08:00:00+08:00'
  ),
  (
    'Jadwal Pelayanan Kantor Desa Selama Bulan Berjalan',
    'jadwal-pelayanan-kantor-desa',
    'Pengumuman',
    'Kantor Desa Sita melayani warga setiap Senin–Jumat pukul 08.00–16.00 WITA.',
    'Kantor Desa Sita melayani warga setiap Senin–Jumat pukul 08.00–16.00 WITA. Warga yang memerlukan layanan administrasi dapat datang langsung ke kantor desa atau menghubungi kontak yang tersedia di halaman Layanan.',
    'published',
    '2026-06-10T08:00:00+08:00'
  ),
  (
    'Musim Panen Kopi dan Kakao Segera Tiba',
    'musim-panen-kopi-kakao',
    'Berita',
    'Petani di Desa Sita bersiap menyambut musim panen kopi dan kakao, dua komoditas unggulan desa.',
    'Petani di Desa Sita bersiap menyambut musim panen kopi dan kakao, dua komoditas unggulan desa yang menopang ekonomi rumah tangga warga. Kelompok tani setempat terus mendampingi proses pemeliharaan hingga pascapanen agar hasil kebun tetap terjaga kualitasnya.',
    'published',
    '2026-06-05T08:00:00+08:00'
  )
on conflict (slug) do nothing;
