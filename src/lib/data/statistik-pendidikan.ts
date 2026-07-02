// Struktur identik tabel `statistik_pendidikan` — PRD §9.1
export type StatistikPendidikan = {
  id: string;
  tingkat: string;
  jumlah: number;
  urutan: number;
};

// Data awal Desa Sita — fallback saat Supabase belum terhubung, basis seed.sql.
export const statistikPendidikanMock: StatistikPendidikan[] = [
  { id: "didik-1", tingkat: "Belum/Tidak Sekolah", jumlah: 402, urutan: 1 },
  { id: "didik-2", tingkat: "Tidak Tamat SD", jumlah: 318, urutan: 2 },
  { id: "didik-3", tingkat: "SD/Sederajat", jumlah: 894, urutan: 3 },
  { id: "didik-4", tingkat: "SMP/Sederajat", jumlah: 671, urutan: 4 },
  { id: "didik-5", tingkat: "SMA/Sederajat", jumlah: 583, urutan: 5 },
  { id: "didik-6", tingkat: "Diploma/Sarjana", jumlah: 324, urutan: 6 },
];
