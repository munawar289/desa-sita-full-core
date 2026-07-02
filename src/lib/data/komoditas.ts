// Struktur identik tabel `komoditas` — PRD §9.1
export type Komoditas = {
  id: string;
  nama: string;
  luas_ha: number | null;
  hasil_panen: string | null;
  urutan: number;
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const komoditasMock: Komoditas[] = [];
