import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEFAULT_TENANT_ID } from "./constants";
import { DEFAULT_TENANT_SLUG, TENANT_DEV_FORCE_SLUG } from "./env";
import { normalizeHost } from "./normalize";
import { getTenantResolverStrategy } from "./strategies/subdomain-strategy";
import type { Tenant, TenantResolution } from "./types";

// Dipakai HANYA saat Supabase belum dikonfigurasi (mode demo/mock lokal) —
// tidak ada tabel `tenants` sungguhan untuk di-query.
function getMockTenant(slug: string = DEFAULT_TENANT_SLUG): Tenant {
  return {
    id: DEFAULT_TENANT_ID,
    slug,
    domain: null,
    nama: "Desa Sita",
    status: "active",
  };
}

export async function resolveTenantForHost(
  rawHost: string,
): Promise<TenantResolution> {
  const host = normalizeHost(rawHost);

  // Opsi cepat (harian, dev-only): simulasikan tenant tertentu tanpa DNS/hosts.
  if (process.env.NODE_ENV !== "production" && TENANT_DEV_FORCE_SLUG) {
    return {
      tenant: getMockTenant(TENANT_DEV_FORCE_SLUG),
      source: "default-fast-path",
    };
  }

  if (!isSupabaseConfigured()) {
    return { tenant: getMockTenant(), source: "default-fast-path" };
  }

  try {
    const strategy = getTenantResolverStrategy();
    // Tenant tidak ketemu (baik "unresolved" maupun "unknown-subdomain") tidak
    // pernah fallback ke tenant default — semua tenant hanya diakses lewat
    // subdomain sendiri. Middleware yang memutuskan respons (403/404) untuk
    // setiap kasus kegagalan resolusi.
    return await strategy.resolve({ host, pathname: "" });
  } catch (error) {
    console.error("[tenant] Gagal resolve tenant.", error);
    return { tenant: null, source: "unresolved" };
  }
}
