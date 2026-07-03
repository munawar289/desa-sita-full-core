import {
  statistikSektorUsahaMock,
  type StatistikSektorUsaha,
} from "@/lib/data/statistik-sektor-usaha";
import { withSupabaseFallback } from "./helpers";

export async function getStatistikSektorUsaha(): Promise<StatistikSektorUsaha[]> {
  return withSupabaseFallback(
    "statistik_sektor_usaha",
    statistikSektorUsahaMock,
    async (client) => {
      const { data, error } = await client
        .from("statistik_sektor_usaha")
        .select("id, jenis, kode, nama, nilai_ribu_rupiah, updated_at, urutan")
        .order("jenis")
        .order("urutan");
      if (error) throw error;
      return data;
    },
  );
}
