import { cache } from "react";
import { wilayahRtMock, type WilayahRt } from "@/lib/data/wilayah-rt";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getWilayahRt = cache(async function getWilayahRt(): Promise<WilayahRt[]> {
  const tenant = await getCurrentTenant();
  return withTenantSupabaseFallback(
    "wilayah_rt",
    tenant.id,
    wilayahRtMock,
    async (client) => {
      const { data, error } = await client
        .from("wilayah_rt")
        .select("id, nomor, nama, urutan")
        .eq("tenant_id", tenant.id)
        .order("urutan");
      if (error) throw error;
      return data;
    },
  );
});
