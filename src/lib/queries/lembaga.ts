import { lembagaMock, type Lembaga, type LembagaKategori } from "@/lib/data/lembaga";
import { withSupabaseFallback } from "./helpers";

export async function getLembaga(): Promise<Lembaga[]> {
  return withSupabaseFallback("lembaga", lembagaMock, async (client) => {
    const { data, error } = await client
      .from("lembaga")
      .select("id, kategori, nama, dasar_hukum, jumlah_pengurus, keterangan, urutan")
      .order("kategori")
      .order("urutan");
    if (error) throw error;
    return data.map((row) => ({
      ...row,
      kategori: row.kategori as LembagaKategori,
    }));
  });
}
