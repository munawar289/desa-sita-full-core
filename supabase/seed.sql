-- Seed data awal Desa Sita — PRD §12
-- Sumber: profil desa versi sebelumnya. Nilai identik dengan fallback mock di
-- src/lib/data/*.ts supaya publik melihat tampilan yang sama sebelum & sesudah
-- Supabase terhubung. Baris bertanda "(Menunggu data)" perlu diganti data riil
-- lewat dashboard admin begitu tersedia.

-- ── Statistik ────────────────────────────────────────────────────────────
insert into statistik (category, key, label, value, updated_at) values
  ('kependudukan', 'total_penduduk', 'Total Penduduk', '3.192', '2026-06-01'),
  ('kependudukan', 'jumlah_kk', 'Jumlah KK', '859', '2026-06-01'),
  ('kependudukan', 'laki_laki', 'Laki-laki', '1605', '2026-06-01'),
  ('kependudukan', 'perempuan', 'Perempuan', '1587', '2026-06-01'),
  ('kependudukan', 'luas_wilayah', 'Luas Wilayah', '1.400 ha', '2026-06-01'),
  ('kependudukan', 'jumlah_dusun', 'Jumlah Dusun', '4', '2026-06-01'),
  ('wilayah', 'luas_wilayah', 'Luas Wilayah', '1.400 ha', '2026-06-01'),
  ('wilayah', 'jumlah_dusun', 'Jumlah Dusun', '4', '2026-06-01'),
  ('wilayah', 'jumlah_rt_rw', 'Jumlah RT/RW', '8 RT / 4 RW', '2026-06-01'),
  ('wilayah', 'kepadatan_penduduk', 'Kepadatan Penduduk', '228 jiwa/km²', '2026-06-01');

-- ── Kelompok umur ────────────────────────────────────────────────────────
insert into statistik_kelompok_umur (kelompok_usia, jumlah, urutan) values
  ('0-4 tahun', 312, 1),
  ('5-9 tahun', 341, 2),
  ('10-14 tahun', 328, 3),
  ('15-19 tahun', 289, 4),
  ('20-24 tahun', 264, 5),
  ('25-29 tahun', 251, 6),
  ('30-39 tahun', 412, 7),
  ('40-49 tahun', 386, 8),
  ('50-59 tahun', 297, 9),
  ('60 tahun ke atas', 312, 10);

-- ── Pendidikan ───────────────────────────────────────────────────────────
insert into statistik_pendidikan (tingkat, jumlah, urutan) values
  ('Belum/Tidak Sekolah', 402, 1),
  ('Tidak Tamat SD', 318, 2),
  ('SD/Sederajat', 894, 3),
  ('SMP/Sederajat', 671, 4),
  ('SMA/Sederajat', 583, 5),
  ('Diploma/Sarjana', 324, 6);

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
insert into wilayah_info (section, konten, updated_at) values
  ('batas_wilayah', 'Desa Sita berada di kaki pegunungan Rana Mese, Kecamatan Rana Mese, Kabupaten Manggarai Timur, Nusa Tenggara Timur. Sebelah utara berbatasan dengan kawasan hutan lindung, sebelah selatan dengan desa tetangga, sebelah timur dan barat dengan wilayah perkebunan dan persawahan warga.', '2026-06-01'),
  ('iklim', 'Desa Sita beriklim tropis pegunungan dengan curah hujan tinggi pada musim hujan (November–April) dan suhu udara sejuk sepanjang tahun, cocok untuk komoditas kopi dan kakao.', '2026-06-01'),
  ('orbitasi', 'Jarak ke ibu kota kecamatan sekitar 6 km, ke ibu kota kabupaten sekitar 45 km, ditempuh dengan kendaraan roda dua maupun roda empat.', '2026-06-01');

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
  );
