// Struktur identik tabel `lembaga` — PRD §9.1
export type LembagaKategori = "kemasyarakatan" | "ekonomi" | "pendidikan" | "keamanan";

export type Lembaga = {
  id: string;
  kategori: LembagaKategori;
  nama: string;
  dasar_hukum: string | null;
  jumlah_pengurus: number | null;
  keterangan: string | null;
  urutan: number;
};

// Data awal Desa Sita — fallback saat Supabase belum terhubung, basis seed.sql.
export const lembagaMock: Lembaga[] = [
  { id: "lbg-1", kategori: "kemasyarakatan", nama: "PKK", dasar_hukum: "SK Kepala Desa", jumlah_pengurus: 12, keterangan: "Pemberdayaan kesejahteraan keluarga", urutan: 1 },
  { id: "lbg-2", kategori: "kemasyarakatan", nama: "Karang Taruna", dasar_hukum: "SK Kepala Desa", jumlah_pengurus: 15, keterangan: "Organisasi kepemudaan desa", urutan: 2 },
  { id: "lbg-3", kategori: "kemasyarakatan", nama: "Posyandu", dasar_hukum: "SK Kepala Desa", jumlah_pengurus: 20, keterangan: "Layanan kesehatan ibu dan anak, 4 pos di tiap dusun", urutan: 3 },
  { id: "lbg-4", kategori: "ekonomi", nama: "Kelompok Tani", dasar_hukum: "SK Kepala Desa", jumlah_pengurus: 8, keterangan: "Pendampingan petani kopi, kakao, dan padi", urutan: 4 },
  { id: "lbg-5", kategori: "ekonomi", nama: "BUMDes", dasar_hukum: "Perdes", jumlah_pengurus: 5, keterangan: "Badan Usaha Milik Desa", urutan: 5 },
  { id: "lbg-6", kategori: "pendidikan", nama: "Komite Sekolah", dasar_hukum: "SK Kepala Sekolah", jumlah_pengurus: 6, keterangan: "Mitra pengelolaan sekolah desa", urutan: 6 },
  { id: "lbg-7", kategori: "keamanan", nama: "Linmas", dasar_hukum: "SK Kepala Desa", jumlah_pengurus: 10, keterangan: "Perlindungan masyarakat tingkat desa", urutan: 7 },
];
