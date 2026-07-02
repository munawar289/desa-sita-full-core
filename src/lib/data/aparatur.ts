// Struktur identik tabel `aparatur` — PRD §9.1
export type Aparatur = {
  id: string;
  nama: string | null;
  jabatan: string;
  pendidikan: string | null;
  urutan: number;
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const aparaturMock: Aparatur[] = [];
