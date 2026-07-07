import { potensiMock, type Potensi, type PotensiIcon } from "@/lib/data/potensi";
import { withSupabaseFallback } from "./helpers";

export async function getPotensi(): Promise<Potensi[]> {
  return withSupabaseFallback("potensi_desa", potensiMock, async (client) => {
    const { data, error } = await client
      .from("potensi_desa")
      .select("id, judul, deskripsi, icon, urutan")
      .order("urutan");
    if (error) throw error;
    return data.map((row) => ({
      ...row,
      icon: row.icon as PotensiIcon,
    }));
  });
}
