import { cache } from "react";
import { desaProfilMock, type DesaProfil } from "@/lib/data/desa-profil";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { withTenantSupabaseFallback } from "./helpers";

// `cache()` dedupe pemanggilan dalam satu render pass — identitas desa kini
// dibaca berulang kali per request (root layout, generateMetadata tiap
// halaman, komponen beranda), jadi tanpa ini query/mock berjalan berkali-kali
// sia-sia untuk data yang sama.
export const getDesaProfil = cache(async function getDesaProfil(): Promise<DesaProfil> {
  const tenant = await getCurrentTenant();

  return withTenantSupabaseFallback(
    "desa_profil",
    tenant.id,
    desaProfilMock,
    async (client) => {
      const { data, error } = await client
        .from("desa_profil")
        .select(
          "id, nama_desa, kecamatan, kabupaten, provinsi, hero_deskripsi, email, jam_layanan, zona_waktu, tahun_berdiri, warna_primer, warna_sekunder, warna_aksen, updated_at",
        )
        .eq("tenant_id", tenant.id)
        .single();
      if (error) throw error;
      return data;
    },
  );
});
