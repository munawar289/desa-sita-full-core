import { cache } from "react";
import {
  statistikSektorUsahaMock,
  type StatistikSektorUsaha,
} from "@/lib/data/statistik-sektor-usaha";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getStatistikSektorUsaha = cache(
  async function getStatistikSektorUsaha(): Promise<StatistikSektorUsaha[]> {
    const tenant = await getCurrentTenant();
    return withTenantSupabaseFallback(
      "statistik_sektor_usaha",
      tenant.id,
      statistikSektorUsahaMock,
      async (client) => {
        const { data, error } = await client
          .from("statistik_sektor_usaha")
          .select("id, jenis, kode, nama, nilai_ribu_rupiah, updated_at, urutan")
          .eq("tenant_id", tenant.id)
          .order("jenis")
          .order("urutan");
        if (error) throw error;
        return data;
      },
    );
  },
);
