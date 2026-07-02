import { aparaturMock, type Aparatur } from "@/lib/data/aparatur";
import { withSupabaseFallback } from "./helpers";

export async function getAparatur(): Promise<Aparatur[]> {
  return withSupabaseFallback("aparatur", aparaturMock, async (client) => {
    const { data, error } = await client
      .from("aparatur")
      .select("id, nama, jabatan, pendidikan, urutan")
      .order("urutan");
    if (error) throw error;
    return data;
  });
}
