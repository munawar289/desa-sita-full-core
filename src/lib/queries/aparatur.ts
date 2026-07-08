import { cache } from "react";
import { aparaturMock, type Aparatur } from "@/lib/data/aparatur";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getAparatur = cache(async function getAparatur(): Promise<Aparatur[]> {
  const tenant = await getCurrentTenant();
  return withTenantSupabaseFallback(
    "aparatur",
    tenant.id,
    aparaturMock,
    async (client) => {
      const { data, error } = await client
        .from("aparatur")
        .select("id, nama, jabatan, pendidikan, urutan")
        .eq("tenant_id", tenant.id)
        .order("urutan");
      if (error) throw error;
      return data;
    },
  );
});
