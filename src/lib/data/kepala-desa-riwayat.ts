// Struktur identik tabel `kepala_desa_riwayat` — PRD §9.1
export type KepalaDesaRiwayat = {
  id: string;
  nama: string;
  periode_mulai: number;
  periode_selesai: number | null; // null = masih menjabat
  keterangan: string | null; // "Penjabat Antar Waktu", dst
  urutan: number;
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const kepalaDesaRiwayatMock: KepalaDesaRiwayat[] = [];
