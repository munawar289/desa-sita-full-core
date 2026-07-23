// Struktur identik tabel `wilayah_rt` — PRD statistik-lanjutan §3.2
import { desaProfilMock } from "./desa-profil";

export type WilayahRt = {
  id: string;
  nomor: string;
  nama: string;
  urutan: number;
};

// Jumlah baris diturunkan dari `desaProfilMock.jumlah_rt` — satu sumber
// kebenaran, jangan literal 16 terpisah (PRD jumlah-rt-dinamis §K6).
export const wilayahRtMock: WilayahRt[] = Array.from(
  { length: desaProfilMock.jumlah_rt },
  (_, i) => {
    const nomor = String(i + 1).padStart(3, "0");
    return { id: `rt-${nomor}`, nomor, nama: `RT ${nomor}`, urutan: i + 1 };
  },
);
