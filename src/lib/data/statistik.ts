// Struktur identik tabel `statistik` — PRD §9.1
export type Statistik = {
  id: string;
  category: string;
  key: string;
  label: string;
  value: string;
  updated_at: string;
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const statistikMock: Statistik[] = [];
