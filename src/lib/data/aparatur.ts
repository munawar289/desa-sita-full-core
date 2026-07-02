// Struktur identik tabel `aparatur` — PRD §9.1
export type Aparatur = {
  id: string;
  nama: string | null;
  jabatan: string;
  pendidikan: string | null;
  urutan: number;
};

// Placeholder struktur jabatan Desa Sita — nama personil menunggu data riil
// dari kantor desa, jangan dianggap nama sungguhan.
export const aparaturMock: Aparatur[] = [
  { id: "apr-1", nama: null, jabatan: "Kepala Desa", pendidikan: null, urutan: 1 },
  { id: "apr-2", nama: null, jabatan: "Sekretaris Desa", pendidikan: null, urutan: 2 },
  { id: "apr-3", nama: null, jabatan: "Kaur Keuangan", pendidikan: null, urutan: 3 },
  { id: "apr-4", nama: null, jabatan: "Kaur Umum & Perencanaan", pendidikan: null, urutan: 4 },
  { id: "apr-5", nama: null, jabatan: "Kasi Pemerintahan", pendidikan: null, urutan: 5 },
  { id: "apr-6", nama: null, jabatan: "Kasi Kesejahteraan", pendidikan: null, urutan: 6 },
  { id: "apr-7", nama: null, jabatan: "Kasi Pelayanan", pendidikan: null, urutan: 7 },
];
