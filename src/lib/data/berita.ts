// Struktur identik tabel `berita` — PRD §9.1
export type Berita = {
  id: string;
  judul: string;
  slug: string;
  kategori: "Berita" | "Pengumuman" | null;
  ringkasan: string | null;
  konten: string;
  cover_image_url: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  // Denormalized dari join `profiles` (author_id) — dipakai untuk meta "penulis".
  author_nama: string | null;
};

// Konten contoh/placeholder untuk keperluan tampilan — ganti dengan berita
// riil lewat dashboard admin begitu tersedia.
export const beritaMock: Berita[] = [
  {
    id: "berita-1",
    judul: "Situs Resmi Desa Sita Resmi Diluncurkan",
    slug: "situs-resmi-desa-sita-diluncurkan",
    kategori: "Pengumuman",
    ringkasan:
      "Pemerintah Desa Sita meluncurkan situs resmi sebagai satu pintu informasi data desa, layanan, dan pengaduan warga.",
    konten:
      "Pemerintah Desa Sita meluncurkan situs resmi sebagai satu pintu informasi data desa, layanan, dan pengaduan warga. Situs ini menyajikan data kependudukan, potensi desa, serta profil pemerintahan secara terbuka dan mudah diakses oleh warga maupun pihak luar.",
    cover_image_url: null,
    status: "published",
    published_at: "2026-06-15T08:00:00+08:00",
    created_at: "2026-06-15T08:00:00+08:00",
    author_nama: "Admin Desa",
  },
  {
    id: "berita-2",
    judul: "Jadwal Pelayanan Kantor Desa Selama Bulan Berjalan",
    slug: "jadwal-pelayanan-kantor-desa",
    kategori: "Pengumuman",
    ringkasan:
      "Kantor Desa Sita melayani warga setiap Senin–Jumat pukul 08.00–16.00 WITA.",
    konten:
      "Kantor Desa Sita melayani warga setiap Senin–Jumat pukul 08.00–16.00 WITA. Warga yang memerlukan layanan administrasi dapat datang langsung ke kantor desa atau menghubungi kontak yang tersedia di halaman Layanan.",
    cover_image_url: null,
    status: "published",
    published_at: "2026-06-10T08:00:00+08:00",
    created_at: "2026-06-10T08:00:00+08:00",
    author_nama: "Admin Desa",
  },
  {
    id: "berita-3",
    judul: "Musim Panen Kopi dan Kakao Segera Tiba",
    slug: "musim-panen-kopi-kakao",
    kategori: "Berita",
    ringkasan:
      "Petani di Desa Sita bersiap menyambut musim panen kopi dan kakao, dua komoditas unggulan desa.",
    konten:
      "Petani di Desa Sita bersiap menyambut musim panen kopi dan kakao, dua komoditas unggulan desa yang menopang ekonomi rumah tangga warga. Kelompok tani setempat terus mendampingi proses pemeliharaan hingga pascapanen agar hasil kebun tetap terjaga kualitasnya.",
    cover_image_url: null,
    status: "published",
    published_at: "2026-06-05T08:00:00+08:00",
    created_at: "2026-06-05T08:00:00+08:00",
    author_nama: "Admin Desa",
  },
];
