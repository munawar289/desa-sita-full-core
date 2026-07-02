// Struktur identik tabel `lembaga` — PRD §9.1
export type LembagaKategori = "kemasyarakatan" | "ekonomi" | "pendidikan" | "keamanan";

export type Lembaga = {
  id: string;
  kategori: LembagaKategori;
  nama: string;
  dasar_hukum: string | null;
  jumlah_pengurus: number | null;
  keterangan: string | null;
  urutan: number;
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const lembagaMock: Lembaga[] = [];
