import { statistikRtMock, type StatistikRt } from "@/lib/data/statistik-rt";
import { withSupabaseFallback } from "./helpers";

export async function getStatistikRt(): Promise<StatistikRt[]> {
  return withSupabaseFallback("statistik_rt", statistikRtMock, async (client) => {
    const [rtResult, factResult] = await Promise.all([
      client.from("wilayah_rt").select("id, nomor, nama, urutan").order("urutan"),
      client.from("statistik_rt").select("id, category, rt_id, value, detail, updated_at"),
    ]);
    if (rtResult.error) throw rtResult.error;
    if (factResult.error) throw factResult.error;

    const rtById = new Map(rtResult.data.map((rt) => [rt.id, rt]));

    return factResult.data
      .map((row) => {
        const rt = rtById.get(row.rt_id);
        if (!rt) return null;
        return {
          id: row.id,
          category: row.category,
          value: row.value,
          detail: row.detail as Record<string, number> | null,
          updated_at: row.updated_at,
          rt_nomor: rt.nomor,
          rt_nama: rt.nama,
          rt_urutan: rt.urutan,
        };
      })
      .filter((row): row is StatistikRt => row !== null)
      .sort((a, b) => a.rt_urutan - b.rt_urutan);
  });
}
