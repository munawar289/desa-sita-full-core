import { cache } from "react";
import { saranaPrasaranaMock, type SaranaPrasarana } from "@/lib/data/sarana-prasarana";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getSaranaPrasarana = cache(
  async function getSaranaPrasarana(): Promise<SaranaPrasarana[]> {
    const tenant = await getCurrentTenant();
    return withTenantSupabaseFallback(
      "sarana_prasarana",
      tenant.id,
      saranaPrasaranaMock,
      async (client) => {
        const { data, error } = await client
          .from("sarana_prasarana")
          .select("id, kategori, nama, jumlah, urutan")
          .eq("tenant_id", tenant.id)
          .order("kategori")
          .order("urutan");
        if (error) throw error;
        return data;
      },
    );
  },
);
