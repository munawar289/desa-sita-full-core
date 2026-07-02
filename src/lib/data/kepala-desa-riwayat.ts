// Struktur identik tabel `kepala_desa_riwayat` — PRD §9.1
export type KepalaDesaRiwayat = {
  id: string;
  nama: string;
  periode_mulai: number;
  periode_selesai: number | null; // null = masih menjabat
  keterangan: string | null; // "Penjabat Antar Waktu", dst
  urutan: number;
};

// Placeholder riwayat Kepala Desa Sita sejak berdiri (1966) — nama menunggu
// data riil dari kantor desa, jangan dianggap nama sungguhan.
export const kepalaDesaRiwayatMock: KepalaDesaRiwayat[] = [
  { id: "kades-1", nama: "(Menunggu data)", periode_mulai: 1966, periode_selesai: 1980, keterangan: null, urutan: 1 },
  { id: "kades-2", nama: "(Menunggu data)", periode_mulai: 1980, periode_selesai: 1998, keterangan: null, urutan: 2 },
  { id: "kades-3", nama: "(Menunggu data)", periode_mulai: 1998, periode_selesai: 2007, keterangan: null, urutan: 3 },
  { id: "kades-4", nama: "(Menunggu data)", periode_mulai: 2007, periode_selesai: 2019, keterangan: null, urutan: 4 },
  { id: "kades-5", nama: "(Menunggu data)", periode_mulai: 2019, periode_selesai: null, keterangan: null, urutan: 5 },
];
