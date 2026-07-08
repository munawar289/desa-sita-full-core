import { cache } from "react";
import { lembagaMock, type Lembaga, type LembagaKategori } from "@/lib/data/lembaga";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getLembaga = cache(async function getLembaga(): Promise<Lembaga[]> {
  const tenant = await getCurrentTenant();
  return withTenantSupabaseFallback(
    "lembaga",
    tenant.id,
    lembagaMock,
    async (client) => {
      const { data, error } = await client
        .from("lembaga")
        .select("id, kategori, nama, dasar_hukum, jumlah_pengurus, keterangan, urutan")
        .eq("tenant_id", tenant.id)
        .order("kategori")
        .order("urutan");
      if (error) throw error;
      return data.map((row) => ({
        ...row,
        kategori: row.kategori as LembagaKategori,
      }));
    },
  );
});
