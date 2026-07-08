import { cache } from "react";
import { peternakanMock, type Peternakan } from "@/lib/data/peternakan";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getPeternakan = cache(async function getPeternakan(): Promise<Peternakan[]> {
  const tenant = await getCurrentTenant();
  return withTenantSupabaseFallback(
    "peternakan",
    tenant.id,
    peternakanMock,
    async (client) => {
      const { data, error } = await client
        .from("peternakan")
        .select("id, jenis_ternak, populasi, jumlah_pemilik, urutan")
        .eq("tenant_id", tenant.id)
        .order("urutan");
      if (error) throw error;
      return data;
    },
  );
});
