import { cache } from "react";
import { komoditasMock, type Komoditas } from "@/lib/data/komoditas";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getKomoditas = cache(async function getKomoditas(): Promise<Komoditas[]> {
  const tenant = await getCurrentTenant();
  return withTenantSupabaseFallback(
    "komoditas",
    tenant.id,
    komoditasMock,
    async (client) => {
      const { data, error } = await client
        .from("komoditas")
        .select("id, nama, luas_ha, hasil_panen, urutan")
        .eq("tenant_id", tenant.id)
        .order("urutan");
      if (error) throw error;
      return data;
    },
  );
});
