// Struktur identik tabel `statistik_kelompok_umur` — PRD §9.1
export type StatistikKelompokUmur = {
  id: string;
  kelompok_usia: string; // contoh: "0-4 tahun"
  jumlah: number;
  urutan: number;
};

// Data awal Desa Sita — fallback saat Supabase belum terhubung, basis seed.sql.
export const statistikKelompokUmurMock: StatistikKelompokUmur[] = [
  { id: "umur-1", kelompok_usia: "0-4 tahun", jumlah: 312, urutan: 1 },
  { id: "umur-2", kelompok_usia: "5-9 tahun", jumlah: 341, urutan: 2 },
  { id: "umur-3", kelompok_usia: "10-14 tahun", jumlah: 328, urutan: 3 },
  { id: "umur-4", kelompok_usia: "15-19 tahun", jumlah: 289, urutan: 4 },
  { id: "umur-5", kelompok_usia: "20-24 tahun", jumlah: 264, urutan: 5 },
  { id: "umur-6", kelompok_usia: "25-29 tahun", jumlah: 251, urutan: 6 },
  { id: "umur-7", kelompok_usia: "30-39 tahun", jumlah: 412, urutan: 7 },
  { id: "umur-8", kelompok_usia: "40-49 tahun", jumlah: 386, urutan: 8 },
  { id: "umur-9", kelompok_usia: "50-59 tahun", jumlah: 297, urutan: 9 },
  { id: "umur-10", kelompok_usia: "60 tahun ke atas", jumlah: 312, urutan: 10 },
];
