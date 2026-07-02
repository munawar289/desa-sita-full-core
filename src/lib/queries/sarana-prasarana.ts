import { saranaPrasaranaMock, type SaranaPrasarana } from "@/lib/data/sarana-prasarana";
import { withSupabaseFallback } from "./helpers";

export async function getSaranaPrasarana(): Promise<SaranaPrasarana[]> {
  return withSupabaseFallback(
    "sarana_prasarana",
    saranaPrasaranaMock,
    async (client) => {
      const { data, error } = await client
        .from("sarana_prasarana")
        .select("id, kategori, nama, jumlah, urutan")
        .order("kategori")
        .order("urutan");
      if (error) throw error;
      return data;
    },
  );
}
