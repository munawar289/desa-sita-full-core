import { wilayahRtMock, type WilayahRt } from "@/lib/data/wilayah-rt";
import { withSupabaseFallback } from "./helpers";

export async function getWilayahRt(): Promise<WilayahRt[]> {
  return withSupabaseFallback("wilayah_rt", wilayahRtMock, async (client) => {
    const { data, error } = await client
      .from("wilayah_rt")
      .select("id, nomor, nama, urutan")
      .order("urutan");
    if (error) throw error;
    return data;
  });
}
