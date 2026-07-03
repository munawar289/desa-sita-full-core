// Struktur identik tabel `statistik` — PRD §9.1
export type Statistik = {
  id: string;
  category: string;
  key: string;
  label: string;
  value: string;
  updated_at: string;
};

// Data awal Desa Sita. Dipakai sebagai fallback saat Supabase belum
// terhubung (lihat src/lib/queries), sekaligus basis untuk supabase/seed.sql.
export const statistikMock: Statistik[] = [
  // Kependudukan — angka riil Prodeskel (PRD statistik-lanjutan §2, §3.4)
  { id: "stat-penduduk", category: "kependudukan", key: "total_penduduk", label: "Total Penduduk", value: "3.259", updated_at: "2026-06-01" },
  { id: "stat-kk", category: "kependudukan", key: "jumlah_kk", label: "Jumlah KK", value: "873", updated_at: "2026-06-01" },
  { id: "stat-laki", category: "kependudukan", key: "laki_laki", label: "Laki-laki", value: "1627", updated_at: "2026-06-01" },
  { id: "stat-perempuan", category: "kependudukan", key: "perempuan", label: "Perempuan", value: "1632", updated_at: "2026-06-01" },
  { id: "stat-luas-kp", category: "kependudukan", key: "luas_wilayah", label: "Luas Wilayah", value: "1.400 ha", updated_at: "2026-06-01" },
  { id: "stat-dusun-kp", category: "kependudukan", key: "jumlah_dusun", label: "Jumlah Dusun", value: "4", updated_at: "2026-06-01" },
  // Wilayah administratif (/data-desa/wilayah-administratif)
  { id: "stat-luas", category: "wilayah", key: "luas_wilayah", label: "Luas Wilayah", value: "1.400 ha", updated_at: "2026-06-01" },
  { id: "stat-dusun", category: "wilayah", key: "jumlah_dusun", label: "Jumlah Dusun", value: "4", updated_at: "2026-06-01" },
  { id: "stat-rt", category: "wilayah", key: "jumlah_rt", label: "Jumlah RT", value: "16", updated_at: "2026-06-01" },
  { id: "stat-rw", category: "wilayah", key: "jumlah_rw", label: "Jumlah RW", value: "8", updated_at: "2026-06-01" },
  { id: "stat-rtrw", category: "wilayah", key: "jumlah_rt_rw", label: "Jumlah RT/RW", value: "16 RT / 8 RW", updated_at: "2026-06-01" },
  { id: "stat-kepadatan", category: "wilayah", key: "kepadatan_penduduk", label: "Kepadatan Penduduk", value: "228 jiwa/km²", updated_at: "2026-06-01" },
  // Ekonomi — Struktur Mata Pencaharian (/data-desa/ekonomi/mata-pencaharian)
  { id: "stat-mp-belum-kerja", category: "mata_pencaharian", key: "belum_kerja", label: "Belum Bekerja", value: "1278", updated_at: "2026-06-01" },
  { id: "stat-mp-petani", category: "mata_pencaharian", key: "petani", label: "Petani", value: "1683", updated_at: "2026-06-01" },
  { id: "stat-mp-honorer", category: "mata_pencaharian", key: "honorer", label: "Honorer", value: "168", updated_at: "2026-06-01" },
  { id: "stat-mp-pns", category: "mata_pencaharian", key: "pns", label: "PNS", value: "99", updated_at: "2026-06-01" },
  { id: "stat-mp-pensiunan", category: "mata_pencaharian", key: "pensiunan", label: "Pensiunan", value: "23", updated_at: "2026-06-01" },
  // Ekonomi — Aset Ekonomi (/data-desa/ekonomi/aset-ekonomi)
  { id: "stat-aset-tanah", category: "aset_tanah", key: "tanah_desa", label: "Tanah Desa", value: "633 m²", updated_at: "2026-06-01" },
  { id: "stat-aset-perumahan", category: "aset_perumahan", key: "jumlah_rumah", label: "Aset Perumahan", value: "672 Rumah", updated_at: "2026-06-01" },
  { id: "stat-aset-transportasi", category: "aset_transportasi", key: "total", label: "Kepemilikan Aset Transportasi Umum (Desa Sita)", value: "12", updated_at: "2026-06-01" },
  { id: "stat-aset-produksi", category: "aset_sarana_produksi", key: "total", label: "Kepemilikan Aset Sarana Produksi (Desa Sita)", value: "12", updated_at: "2026-06-01" },
  // Pendidikan — rasio guru-murid & kelembagaan (/data-desa/pendidikan)
  { id: "stat-guru", category: "rasio_guru_murid", key: "guru", label: "Guru", value: "120", updated_at: "2026-06-01" },
  { id: "stat-lembaga-negeri-sd", category: "lembaga_pendidikan_negeri", key: "sd", label: "SD Negeri", value: "1", updated_at: "2026-06-01" },
  { id: "stat-lembaga-swasta-paud", category: "lembaga_pendidikan_swasta", key: "paud", label: "PAUD Swasta", value: "3", updated_at: "2026-06-01" },
  { id: "stat-lembaga-swasta-sd", category: "lembaga_pendidikan_swasta", key: "sd", label: "SD Swasta", value: "2", updated_at: "2026-06-01" },
  { id: "stat-lembaga-swasta-smp", category: "lembaga_pendidikan_swasta", key: "smp", label: "SMP Swasta", value: "2", updated_at: "2026-06-01" },
  { id: "stat-lembaga-swasta-sma", category: "lembaga_pendidikan_swasta", key: "sma", label: "SMA Swasta", value: "2", updated_at: "2026-06-01" },
  // Kesehatan — sarana & prasarana (/data-desa/kesehatan)
  { id: "stat-sarkes-posyandu", category: "sarana_kesehatan", key: "posyandu", label: "Posyandu", value: "9 Titik", updated_at: "2026-06-01" },
  { id: "stat-sarkes-puskesmas", category: "sarana_kesehatan", key: "puskesmas", label: "Puskesmas", value: "1", updated_at: "2026-06-01" },
  { id: "stat-sarkes-poskesdes", category: "sarana_kesehatan", key: "poskesdes", label: "Poskesdes", value: "1", updated_at: "2026-06-01" },
  { id: "stat-sarkes-polindes", category: "sarana_kesehatan", key: "polindes", label: "Polindes", value: "1", updated_at: "2026-06-01" },
  { id: "stat-sarkes-toko-obat", category: "sarana_kesehatan", key: "toko_obat", label: "Toko Obat", value: "2", updated_at: "2026-06-01" },
  // Keamanan & Kelembagaan (/data-desa/keamanan-kelembagaan)
  { id: "stat-linmas", category: "keamanan", key: "linmas", label: "Linmas Desa Sita", value: "7 Orang", updated_at: "2026-06-01" },
  { id: "stat-lembaga-rt", category: "lembaga_kemasyarakatan", key: "rt", label: "Rukun Tetangga (RT)", value: "16", updated_at: "2026-06-01" },
  { id: "stat-lembaga-rw", category: "lembaga_kemasyarakatan", key: "rw", label: "Rukun Warga (RW)", value: "8", updated_at: "2026-06-01" },
  { id: "stat-lembaga-pkk", category: "lembaga_kemasyarakatan", key: "pkk", label: "PKK", value: "6", updated_at: "2026-06-01" },
  { id: "stat-lembaga-posyandu", category: "lembaga_kemasyarakatan", key: "posyandu", label: "Posyandu", value: "9", updated_at: "2026-06-01" },
  { id: "stat-lembaga-adat", category: "lembaga_kemasyarakatan", key: "lembaga_adat", label: "Lembaga Adat Desa", value: "5", updated_at: "2026-06-01" },
  { id: "stat-lembaga-dusun", category: "lembaga_kemasyarakatan", key: "dusun", label: "Dusun", value: "4", updated_at: "2026-06-01" },
  // kesejahteraan_keluarga & sebagian besar kategori Kesehatan (kualitas
  // bayi/ibu hamil/persalinan, wabah penyakit, gizi balita, imunisasi, KB):
  // sengaja tidak ada mock — kosong total di source, publik menampilkan
  // EmptyState.
];
