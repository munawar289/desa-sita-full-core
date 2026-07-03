// Struktur identik tabel `wilayah_info` — PRD §9.1
// `section` bertipe text bebas di database (tanpa CHECK constraint) — admin
// bisa menambah section baru lewat /admin/wilayah, tidak dibatasi ke 3 nilai
// awal ini.
export type WilayahInfo = {
  id: string;
  section: string;
  konten: string; // boleh markdown sederhana
  updated_at: string;
};

// Data awal Desa Sita — fallback saat Supabase belum terhubung, basis seed.sql.
export const wilayahInfoMock: WilayahInfo[] = [
  {
    id: "wil-sejarah",
    section: "sejarah",
    konten:
      "Narasi sejarah berdirinya Desa Sita akan ditampilkan di sini setelah dokumen profil desa tersedia.",
    updated_at: "2026-06-01",
  },
  {
    id: "wil-batas",
    section: "batas_wilayah",
    konten:
      "Desa Sita berada di kaki pegunungan Rana Mese, Kecamatan Rana Mese, Kabupaten Manggarai Timur, Nusa Tenggara Timur. Sebelah utara berbatasan dengan kawasan hutan lindung, sebelah selatan dengan desa tetangga, sebelah timur dan barat dengan wilayah perkebunan dan persawahan warga.",
    updated_at: "2026-06-01",
  },
  {
    id: "wil-iklim",
    section: "iklim",
    konten:
      "Desa Sita beriklim tropis pegunungan dengan curah hujan tinggi pada musim hujan (November–April) dan suhu udara sejuk sepanjang tahun, cocok untuk komoditas kopi dan kakao.",
    updated_at: "2026-06-01",
  },
  {
    id: "wil-orbitasi",
    section: "orbitasi",
    konten:
      "Jarak ke ibu kota kecamatan sekitar 6 km, ke ibu kota kabupaten sekitar 45 km, ditempuh dengan kendaraan roda dua maupun roda empat.",
    updated_at: "2026-06-01",
  },
];
