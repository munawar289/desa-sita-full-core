// Struktur identik tabel `sarana_prasarana` — PRD §9.1
export type SaranaPrasarana = {
  id: string;
  kategori: string; // pendidikan | kesehatan | peribadatan | dst
  nama: string;
  jumlah: string | null; // teks bebas: "3 unit", "562 siswa"
  urutan: number;
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const saranaPrasaranaMock: SaranaPrasarana[] = [];
