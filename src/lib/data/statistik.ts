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
  // Kependudukan (dipakai StatistikSnapshot & /data-desa/jenis-kelamin)
  { id: "stat-penduduk", category: "kependudukan", key: "total_penduduk", label: "Total Penduduk", value: "3.192", updated_at: "2026-06-01" },
  { id: "stat-kk", category: "kependudukan", key: "jumlah_kk", label: "Jumlah KK", value: "859", updated_at: "2026-06-01" },
  { id: "stat-laki", category: "kependudukan", key: "laki_laki", label: "Laki-laki", value: "1605", updated_at: "2026-06-01" },
  { id: "stat-perempuan", category: "kependudukan", key: "perempuan", label: "Perempuan", value: "1587", updated_at: "2026-06-01" },
  { id: "stat-luas-kp", category: "kependudukan", key: "luas_wilayah", label: "Luas Wilayah", value: "1.400 ha", updated_at: "2026-06-01" },
  { id: "stat-dusun-kp", category: "kependudukan", key: "jumlah_dusun", label: "Jumlah Dusun", value: "4", updated_at: "2026-06-01" },
  // Wilayah administratif (/data-desa/wilayah-administratif)
  { id: "stat-luas", category: "wilayah", key: "luas_wilayah", label: "Luas Wilayah", value: "1.400 ha", updated_at: "2026-06-01" },
  { id: "stat-dusun", category: "wilayah", key: "jumlah_dusun", label: "Jumlah Dusun", value: "4", updated_at: "2026-06-01" },
  { id: "stat-rtrw", category: "wilayah", key: "jumlah_rt_rw", label: "Jumlah RT/RW", value: "8 RT / 4 RW", updated_at: "2026-06-01" },
  { id: "stat-kepadatan", category: "wilayah", key: "kepadatan_penduduk", label: "Kepadatan Penduduk", value: "228 jiwa/km²", updated_at: "2026-06-01" },
];
