import {
  statistikKelompokUmurMock,
  type StatistikKelompokUmur,
} from "@/lib/data/statistik-kelompok-umur";
import { withSupabaseFallback } from "./helpers";

export async function getStatistikKelompokUmur(): Promise<StatistikKelompokUmur[]> {
  return withSupabaseFallback(
    "statistik_kelompok_umur",
    statistikKelompokUmurMock,
    async (client) => {
      const { data, error } = await client
        .from("statistik_kelompok_umur")
        .select("id, kelompok_usia, jumlah, urutan")
        .order("urutan");
      if (error) throw error;
      return data;
    },
  );
}
