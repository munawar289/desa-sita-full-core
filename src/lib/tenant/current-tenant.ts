import { cache } from "react";
import { headers } from "next/headers";
import { DEFAULT_TENANT_ID } from "./constants";
import { DEFAULT_TENANT_SLUG } from "./env";
import type { Tenant, TenantResolutionSource } from "./types";

// PERINGATAN (Phase 4+): memanggil headers() di Server Component memaksa
// route itu keluar dari static/ISR menjadi full-dynamic — mulai dipakai sejak
// Phase 4 Modul 2 (getDesaProfil()), dimitigasi via unstable_cache per tenant
// (lihat src/lib/queries/helpers.ts).
export const getCurrentTenant = cache(async function getCurrentTenant(): Promise<
  Pick<Tenant, "id" | "slug"> & { source: TenantResolutionSource }
> {
  const headerList = await headers();
  return {
    id: headerList.get("x-tenant-id") ?? DEFAULT_TENANT_ID,
    slug: headerList.get("x-tenant-slug") ?? DEFAULT_TENANT_SLUG,
    source:
      (headerList.get("x-tenant-source") as TenantResolutionSource | null) ??
      "default-fast-path",
  };
});
