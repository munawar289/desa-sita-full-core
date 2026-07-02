import {
  statistikPendidikanMock,
  type StatistikPendidikan,
} from "@/lib/data/statistik-pendidikan";
import { withSupabaseFallback } from "./helpers";

export async function getStatistikPendidikan(): Promise<StatistikPendidikan[]> {
  return withSupabaseFallback(
    "statistik_pendidikan",
    statistikPendidikanMock,
    async (client) => {
      const { data, error } = await client
        .from("statistik_pendidikan")
        .select("id, tingkat, jumlah, urutan")
        .order("urutan");
      if (error) throw error;
      return data;
    },
  );
}
