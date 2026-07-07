import { wilayahInfoMock, type WilayahInfo } from "@/lib/data/wilayah-info";
import { withSupabaseFallback } from "./helpers";

export async function getWilayahInfo(): Promise<WilayahInfo[]> {
  return withSupabaseFallback("wilayah_info", wilayahInfoMock, async (client) => {
    const { data, error } = await client
      .from("wilayah_info")
      .select("id, section, konten, page, judul, eyebrow, urutan, updated_at");
    if (error) throw error;
    return data.map((row) => ({
      ...row,
      page: row.page as WilayahInfo["page"],
    }));
  });
}
