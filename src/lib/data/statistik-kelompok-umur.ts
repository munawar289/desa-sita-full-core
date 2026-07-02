// Struktur identik tabel `statistik_kelompok_umur` — PRD §9.1
export type StatistikKelompokUmur = {
  id: string;
  kelompok_usia: string; // contoh: "0-4 tahun"
  jumlah: number;
  urutan: number;
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const statistikKelompokUmurMock: StatistikKelompokUmur[] = [];
