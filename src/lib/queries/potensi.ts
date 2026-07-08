import { cache } from "react";
import { potensiMock, type Potensi, type PotensiIcon } from "@/lib/data/potensi";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getPotensi = cache(async function getPotensi(): Promise<Potensi[]> {
  const tenant = await getCurrentTenant();
  return withTenantSupabaseFallback(
    "potensi_desa",
    tenant.id,
    potensiMock,
    async (client) => {
      const { data, error } = await client
        .from("potensi_desa")
        .select("id, judul, deskripsi, icon, urutan")
        .eq("tenant_id", tenant.id)
        .order("urutan");
      if (error) throw error;
      return data.map((row) => ({
        ...row,
        icon: row.icon as PotensiIcon,
      }));
    },
  );
});
