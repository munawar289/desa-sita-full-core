// Struktur identik tabel `peternakan` — PRD §9.1
export type Peternakan = {
  id: string;
  jenis_ternak: string;
  populasi: number | null;
  jumlah_pemilik: number | null;
  urutan: number;
};

// Data awal Desa Sita — fallback saat Supabase belum terhubung, basis seed.sql.
export const peternakanMock: Peternakan[] = [
  { id: "ternak-babi", jenis_ternak: "Babi", populasi: 612, jumlah_pemilik: 287, urutan: 1 },
  { id: "ternak-ayam", jenis_ternak: "Ayam Kampung", populasi: 1840, jumlah_pemilik: 401, urutan: 2 },
  { id: "ternak-sapi", jenis_ternak: "Sapi", populasi: 214, jumlah_pemilik: 96, urutan: 3 },
  { id: "ternak-kerbau", jenis_ternak: "Kerbau", populasi: 58, jumlah_pemilik: 22, urutan: 4 },
];
