import { cache } from "react";
import {
  statistikKelompokUmurMock,
  type StatistikKelompokUmur,
} from "@/lib/data/statistik-kelompok-umur";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getStatistikKelompokUmur = cache(
  async function getStatistikKelompokUmur(): Promise<StatistikKelompokUmur[]> {
    const tenant = await getCurrentTenant();
    return withTenantSupabaseFallback(
      "statistik_kelompok_umur",
      tenant.id,
      statistikKelompokUmurMock,
      async (client) => {
        const { data, error } = await client
          .from("statistik_kelompok_umur")
          .select("id, kelompok_usia, jumlah, urutan")
          .eq("tenant_id", tenant.id)
          .order("urutan");
        if (error) throw error;
        return data;
      },
    );
  },
);
