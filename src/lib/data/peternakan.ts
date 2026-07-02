// Struktur identik tabel `peternakan` — PRD §9.1
export type Peternakan = {
  id: string;
  jenis_ternak: string;
  populasi: number | null;
  jumlah_pemilik: number | null;
  urutan: number;
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const peternakanMock: Peternakan[] = [];
