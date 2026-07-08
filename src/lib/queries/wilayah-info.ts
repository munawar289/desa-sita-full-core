import { cache } from "react";
import { wilayahInfoMock, type WilayahInfo } from "@/lib/data/wilayah-info";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getWilayahInfo = cache(async function getWilayahInfo(): Promise<WilayahInfo[]> {
  const tenant = await getCurrentTenant();
  return withTenantSupabaseFallback(
    "wilayah_info",
    tenant.id,
    wilayahInfoMock,
    async (client) => {
      const { data, error } = await client
        .from("wilayah_info")
        .select("id, section, konten, page, judul, eyebrow, urutan, updated_at")
        .eq("tenant_id", tenant.id);
      if (error) throw error;
      return data.map((row) => ({
        ...row,
        page: row.page as WilayahInfo["page"],
      }));
    },
  );
});
