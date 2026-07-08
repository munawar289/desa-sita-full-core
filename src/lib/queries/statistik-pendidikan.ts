import { cache } from "react";
import {
  statistikPendidikanMock,
  type StatistikPendidikan,
} from "@/lib/data/statistik-pendidikan";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getStatistikPendidikan = cache(
  async function getStatistikPendidikan(): Promise<StatistikPendidikan[]> {
    const tenant = await getCurrentTenant();
    return withTenantSupabaseFallback(
      "statistik_pendidikan",
      tenant.id,
      statistikPendidikanMock,
      async (client) => {
        const { data, error } = await client
          .from("statistik_pendidikan")
          .select("id, tingkat, jumlah, urutan")
          .eq("tenant_id", tenant.id)
          .order("urutan");
        if (error) throw error;
        return data;
      },
    );
  },
);
