import { cache } from "react";
import { statistikRtMock, type StatistikRt } from "@/lib/data/statistik-rt";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getStatistikRt = cache(async function getStatistikRt(): Promise<StatistikRt[]> {
  const tenant = await getCurrentTenant();
  return withTenantSupabaseFallback(
    "statistik_rt",
    tenant.id,
    statistikRtMock,
    async (client) => {
      const [rtResult, factResult] = await Promise.all([
        client
          .from("wilayah_rt")
          .select("id, nomor, nama, urutan")
          .eq("tenant_id", tenant.id)
          .order("urutan"),
        client
          .from("statistik_rt")
          .select("id, category, rt_id, value, detail, updated_at")
          .eq("tenant_id", tenant.id),
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
    },
  );
});
