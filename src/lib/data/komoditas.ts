// Struktur identik tabel `komoditas` — PRD §9.1
export type Komoditas = {
  id: string;
  nama: string;
  luas_ha: number | null;
  hasil_panen: string | null;
  urutan: number;
};

// Data awal Desa Sita — fallback saat Supabase belum terhubung, basis seed.sql.
export const komoditasMock: Komoditas[] = [
  { id: "kom-kopi", nama: "Kopi", luas_ha: 55.5, hasil_panen: "±0,6 ton/ha/tahun", urutan: 1 },
  { id: "kom-kakao", nama: "Kakao", luas_ha: 88.5, hasil_panen: "±0,5 ton/ha/tahun", urutan: 2 },
  { id: "kom-padi", nama: "Padi Sawah", luas_ha: 178, hasil_panen: "Irigasi, 2x tanam/tahun", urutan: 3 },
  { id: "kom-jagung", nama: "Jagung", luas_ha: 12.5, hasil_panen: "Musiman", urutan: 4 },
];
