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
};

// TODO: menunggu data riil dari Desa Sita sebelum diisi.
export const beritaMock: Berita[] = [];
