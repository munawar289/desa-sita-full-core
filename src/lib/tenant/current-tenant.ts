import { cache } from "react";
import { headers } from "next/headers";
import type { Tenant, TenantResolutionSource } from "./types";

// PERINGATAN (Phase 4+): memanggil headers() di Server Component memaksa
// route itu keluar dari static/ISR menjadi full-dynamic — mulai dipakai sejak
// Phase 4 Modul 2 (getDesaProfil()), dimitigasi via unstable_cache per tenant
// (lihat src/lib/queries/helpers.ts).
//
// Tidak ada fallback tenant default di sini — middleware sudah menolak
// (403/404) request yang gagal resolusi tenant sebelum sampai ke sini, jadi
// header x-tenant-id/x-tenant-slug seharusnya selalu ada untuk route tenant.
export const getCurrentTenant = cache(async function getCurrentTenant(): Promise<
  Pick<Tenant, "id" | "slug" | "status"> & { source: TenantResolutionSource }
> {
  const headerList = await headers();
  const id = headerList.get("x-tenant-id");
  const slug = headerList.get("x-tenant-slug");
  if (!id || !slug) {
    throw new Error(
      "getCurrentTenant() dipanggil tanpa header x-tenant-id/x-tenant-slug — route ini belum melalui resolusi tenant di middleware.",
    );
  }
  return {
    id,
    slug,
    status: (headerList.get("x-tenant-status") as Tenant["status"] | null) ?? "active",
    source:
      (headerList.get("x-tenant-source") as TenantResolutionSource | null) ?? "unresolved",
  };
});
