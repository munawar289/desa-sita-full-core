import { statistikMock, type Statistik } from "@/lib/data/statistik";
import { withSupabaseFallback } from "./helpers";

export async function getStatistik(): Promise<Statistik[]> {
  return withSupabaseFallback("statistik", statistikMock, async (client) => {
    const { data, error } = await client
      .from("statistik")
      .select("id, category, key, label, value, updated_at")
      .order("category")
      .order("key");
    if (error) throw error;
    return data;
  });
}
