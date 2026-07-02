// Struktur identik tabel `statistik_pendidikan` — PRD §9.1
export type StatistikPendidikan = {
  id: string;
  tingkat: string;
  jumlah: number;
  urutan: number;
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const statistikPendidikanMock: StatistikPendidikan[] = [];
