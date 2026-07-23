// MOCK DATA — menunggu dukungan backend. Lihat BACKEND_TODO.md
//
// Foto pendamping kartu potensi di beranda. Tabel `potensi_desa` baru punya
// kolom teks (judul, deskripsi, icon), belum ada kolom gambar. Sementara itu
// foto dipetakan lewat `icon` potensi. Potensi tanpa foto memakai placeholder
// bertoken (DESIGN.md §5.2) — bukan stock photo (§7.4).

import type { PotensiIcon } from "@/lib/data/potensi";

export type PotensiMedia = {
  src: string;
  alt: string;
};

// Sengaja partial: hanya icon yang punya foto asli lokal yang diisi. Sisanya
// jatuh ke placeholder ikon di komponen.
export const potensiMediaByIcon: Partial<Record<PotensiIcon, PotensiMedia>> = {
  Sprout: {
    src: "/images/leftimage.jpg",
    alt: "Hamparan terasering sawah warga di perbukitan Desa Sita",
  },
  Trees: {
    src: "/images/ranamese.jpg",
    alt: "Kawasan hutan dan kebun di sekitar Danau Ranamese",
  },
};
