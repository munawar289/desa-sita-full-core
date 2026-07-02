import { komoditasMock, type Komoditas } from "@/lib/data/komoditas";
import { withSupabaseFallback } from "./helpers";

export async function getKomoditas(): Promise<Komoditas[]> {
  return withSupabaseFallback("komoditas", komoditasMock, async (client) => {
    const { data, error } = await client
      .from("komoditas")
      .select("id, nama, luas_ha, hasil_panen, urutan")
      .order("urutan");
    if (error) throw error;
    return data;
  });
}
