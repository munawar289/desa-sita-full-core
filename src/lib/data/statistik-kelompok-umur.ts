// Struktur identik tabel `statistik_kelompok_umur` — PRD §9.1
export type StatistikKelompokUmur = {
  id: string;
  kelompok_usia: string; // contoh: "0-4 tahun"
  jumlah: number;
  urutan: number;
};

// Data riil Prodeskel (rentang 10 tahunan) — fallback saat Supabase belum
// terhubung, basis seed.sql (PRD statistik-lanjutan §2, §3.4: struktur
// rentang berbeda dari seed Fase 1 yang 5 tahunan — diganti, bukan ditambah).
export const statistikKelompokUmurMock: StatistikKelompokUmur[] = [
  { id: "umur-1", kelompok_usia: "0-10 tahun", jumlah: 548, urutan: 1 },
  { id: "umur-2", kelompok_usia: "11-20 tahun", jumlah: 624, urutan: 2 },
  { id: "umur-3", kelompok_usia: "21-30 tahun", jumlah: 718, urutan: 3 },
  { id: "umur-4", kelompok_usia: "31-40 tahun", jumlah: 469, urutan: 4 },
  { id: "umur-5", kelompok_usia: "41-50 tahun", jumlah: 354, urutan: 5 },
  { id: "umur-6", kelompok_usia: "51-60 tahun", jumlah: 296, urutan: 6 },
  { id: "umur-7", kelompok_usia: "61-70 tahun", jumlah: 177, urutan: 7 },
  { id: "umur-8", kelompok_usia: "71-80 tahun", jumlah: 52, urutan: 8 },
  { id: "umur-9", kelompok_usia: "81-90 tahun", jumlah: 14, urutan: 9 },
];
