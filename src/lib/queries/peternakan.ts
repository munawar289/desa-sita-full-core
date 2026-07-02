import { peternakanMock, type Peternakan } from "@/lib/data/peternakan";
import { withSupabaseFallback } from "./helpers";

export async function getPeternakan(): Promise<Peternakan[]> {
  return withSupabaseFallback("peternakan", peternakanMock, async (client) => {
    const { data, error } = await client
      .from("peternakan")
      .select("id, jenis_ternak, populasi, jumlah_pemilik, urutan")
      .order("urutan");
    if (error) throw error;
    return data;
  });
}
