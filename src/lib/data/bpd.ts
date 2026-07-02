// Struktur identik tabel `bpd_anggota` — PRD §9.1
export type BpdAnggota = {
  id: string;
  nama: string;
  jabatan: string; // Ketua | Wakil | Sekretaris | Anggota
  pendidikan: string | null;
  urutan: number;
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const bpdMock: BpdAnggota[] = [];
