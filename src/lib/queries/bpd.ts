import { bpdMock, type BpdAnggota } from "@/lib/data/bpd";
import { withSupabaseFallback } from "./helpers";

export async function getBpd(): Promise<BpdAnggota[]> {
  return withSupabaseFallback("bpd_anggota", bpdMock, async (client) => {
    const { data, error } = await client
      .from("bpd_anggota")
      .select("id, nama, jabatan, pendidikan, urutan")
      .order("urutan");
    if (error) throw error;
    return data;
  });
}
