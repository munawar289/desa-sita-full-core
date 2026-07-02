// Struktur identik tabel `bpd_anggota` — PRD §9.1
export type BpdAnggota = {
  id: string;
  nama: string;
  jabatan: string; // Ketua | Wakil | Sekretaris | Anggota
  pendidikan: string | null;
  urutan: number;
};

// Placeholder struktur BPD Desa Sita — nama anggota menunggu data riil dari
// kantor desa, jangan dianggap nama sungguhan.
export const bpdMock: BpdAnggota[] = [
  { id: "bpd-1", nama: "(Menunggu data)", jabatan: "Ketua", pendidikan: null, urutan: 1 },
  { id: "bpd-2", nama: "(Menunggu data)", jabatan: "Wakil Ketua", pendidikan: null, urutan: 2 },
  { id: "bpd-3", nama: "(Menunggu data)", jabatan: "Sekretaris", pendidikan: null, urutan: 3 },
  { id: "bpd-4", nama: "(Menunggu data)", jabatan: "Anggota", pendidikan: null, urutan: 4 },
  { id: "bpd-5", nama: "(Menunggu data)", jabatan: "Anggota", pendidikan: null, urutan: 5 },
];
