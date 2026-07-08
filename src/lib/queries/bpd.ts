import { cache } from "react";
import { bpdMock, type BpdAnggota } from "@/lib/data/bpd";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getBpd = cache(async function getBpd(): Promise<BpdAnggota[]> {
  const tenant = await getCurrentTenant();
  return withTenantSupabaseFallback(
    "bpd_anggota",
    tenant.id,
    bpdMock,
    async (client) => {
      const { data, error } = await client
        .from("bpd_anggota")
        .select("id, nama, jabatan, pendidikan, urutan")
        .eq("tenant_id", tenant.id)
        .order("urutan");
      if (error) throw error;
      return data;
    },
  );
});
