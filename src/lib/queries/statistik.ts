import { cache } from "react";
import { statistikMock, type Statistik } from "@/lib/data/statistik";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getStatistik = cache(async function getStatistik(): Promise<Statistik[]> {
  const tenant = await getCurrentTenant();
  return withTenantSupabaseFallback(
    "statistik",
    tenant.id,
    statistikMock,
    async (client) => {
      const { data, error } = await client
        .from("statistik")
        .select("id, category, key, label, value, updated_at")
        .eq("tenant_id", tenant.id)
        .order("category")
        .order("key");
      if (error) throw error;
      return data;
    },
  );
});
