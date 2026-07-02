import { beritaMock, type Berita } from "@/lib/data/berita";
import { withSupabaseFallback } from "./helpers";

const BERITA_COLUMNS =
  "id, judul, slug, kategori, ringkasan, konten, cover_image_url, status, published_at, created_at";

/**
 * Nama penulis (author_nama) di-set null untuk data dari Supabase — atribusi
 * penulis lewat join `profiles` menyusul di Fase 2 saat dashboard admin ada.
 */
export async function getBerita(): Promise<Berita[]> {
  return withSupabaseFallback("berita", beritaMock, async (client) => {
    const { data, error } = await client
      .from("berita")
      .select(BERITA_COLUMNS)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data.map((row) => ({
      ...row,
      kategori: row.kategori as Berita["kategori"],
      author_nama: null,
    }));
  });
}

export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  const mockMatch = beritaMock.find((item) => item.slug === slug) ?? null;
  return withSupabaseFallback(`berita/${slug}`, mockMatch, async (client) => {
    const { data, error } = await client
      .from("berita")
      .select(BERITA_COLUMNS)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      ...data,
      kategori: data.kategori as Berita["kategori"],
      author_nama: null,
    };
  });
}
