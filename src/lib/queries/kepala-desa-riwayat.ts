import { cache } from "react";
import {
  kepalaDesaRiwayatMock,
  type KepalaDesaRiwayat,
} from "@/lib/data/kepala-desa-riwayat";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

export const getKepalaDesaRiwayat = cache(
  async function getKepalaDesaRiwayat(): Promise<KepalaDesaRiwayat[]> {
    const tenant = await getCurrentTenant();
    return withTenantSupabaseFallback(
      "kepala_desa_riwayat",
      tenant.id,
      kepalaDesaRiwayatMock,
      async (client) => {
        const { data, error } = await client
          .from("kepala_desa_riwayat")
          .select("id, nama, periode_mulai, periode_selesai, keterangan, urutan")
          .eq("tenant_id", tenant.id)
          .order("urutan");
        if (error) throw error;
        return data;
      },
    );
  },
);
