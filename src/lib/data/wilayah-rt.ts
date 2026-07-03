// Struktur identik tabel `wilayah_rt` — PRD statistik-lanjutan §3.2
export type WilayahRt = {
  id: string;
  nomor: string;
  nama: string;
  urutan: number;
};

export const wilayahRtMock: WilayahRt[] = Array.from({ length: 16 }, (_, i) => {
  const nomor = String(i + 1).padStart(3, "0");
  return { id: `rt-${nomor}`, nomor, nama: `RT ${nomor}`, urutan: i + 1 };
});
