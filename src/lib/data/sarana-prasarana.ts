// Struktur identik tabel `sarana_prasarana` — PRD §9.1
export type SaranaPrasarana = {
  id: string;
  kategori: string; // pendidikan | kesehatan | peribadatan | dst
  nama: string;
  jumlah: string | null; // teks bebas: "3 unit", "562 siswa"
  urutan: number;
};

// Data awal Desa Sita — fallback saat Supabase belum terhubung, basis seed.sql.
export const saranaPrasaranaMock: SaranaPrasarana[] = [
  { id: "sar-1", kategori: "Pendidikan", nama: "PAUD/TK", jumlah: "2 unit", urutan: 1 },
  { id: "sar-2", kategori: "Pendidikan", nama: "SD", jumlah: "3 unit", urutan: 2 },
  { id: "sar-3", kategori: "Pendidikan", nama: "SMP", jumlah: "1 unit", urutan: 3 },
  { id: "sar-4", kategori: "Kesehatan", nama: "Puskesmas Pembantu", jumlah: "1 unit", urutan: 4 },
  { id: "sar-5", kategori: "Kesehatan", nama: "Posyandu", jumlah: "4 unit", urutan: 5 },
  { id: "sar-6", kategori: "Peribadatan", nama: "Gereja Katolik", jumlah: "3 unit", urutan: 6 },
  { id: "sar-7", kategori: "Peribadatan", nama: "Kapela", jumlah: "4 unit", urutan: 7 },
  { id: "sar-8", kategori: "Umum", nama: "Balai Desa", jumlah: "1 unit", urutan: 8 },
  { id: "sar-9", kategori: "Umum", nama: "Sumber Air Bersih", jumlah: "6 titik", urutan: 9 },
];
