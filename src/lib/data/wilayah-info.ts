// Struktur identik tabel `wilayah_info` — PRD §9.1
export type WilayahInfo = {
  id: string;
  section: "batas_wilayah" | "iklim" | "orbitasi";
  konten: string; // boleh markdown sederhana
  updated_at: string;
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const wilayahInfoMock: WilayahInfo[] = [];
