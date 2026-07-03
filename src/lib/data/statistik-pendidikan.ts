// Struktur identik tabel `statistik_pendidikan` — PRD §9.1
export type StatistikPendidikan = {
  id: string;
  tingkat: string;
  jumlah: number;
  urutan: number;
};

// Data riil Prodeskel — fallback saat Supabase belum terhubung, basis seed.sql
// (PRD statistik-lanjutan §3.4: label & angka mengganti seed Fase 1).
export const statistikPendidikanMock: StatistikPendidikan[] = [
  { id: "didik-1", tingkat: "BLM SEKOLAH", jumlah: 277, urutan: 1 },
  { id: "didik-2", tingkat: "PAUD", jumlah: 125, urutan: 2 },
  { id: "didik-3", tingkat: "SD", jumlah: 1250, urutan: 3 },
  { id: "didik-4", tingkat: "SMP", jumlah: 397, urutan: 4 },
  { id: "didik-5", tingkat: "SMA", jumlah: 895, urutan: 5 },
  { id: "didik-6", tingkat: "DIII/DIV", jumlah: 24, urutan: 6 },
  { id: "didik-7", tingkat: "S1/S2", jumlah: 289, urutan: 7 },
];
