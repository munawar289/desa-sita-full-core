import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEFAULT_TENANT_ID } from "./constants";
import {
  DEFAULT_TENANT_HOSTS,
  DEFAULT_TENANT_SLUG,
  TENANT_DEV_FORCE_SLUG,
} from "./env";
import { normalizeHost } from "./normalize";
import { getTenantResolverStrategy } from "./strategies/subdomain-strategy";
import type { Tenant, TenantResolution } from "./types";

function getDefaultTenantFastPath(): Tenant {
  return {
    id: DEFAULT_TENANT_ID,
    slug: DEFAULT_TENANT_SLUG,
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
      tenant: { ...getDefaultTenantFastPath(), slug: TENANT_DEV_FORCE_SLUG },
      source: "default-fast-path",
    };
  }

  if (!isSupabaseConfigured() || DEFAULT_TENANT_HOSTS.includes(host)) {
    return { tenant: getDefaultTenantFastPath(), source: "default-fast-path" };
  }

  try {
    const strategy = getTenantResolverStrategy();
    const result = await strategy.resolve({ host, pathname: "" });
    if (result.tenant) return result;
  } catch (error) {
    console.error("[tenant] Gagal resolve tenant, fallback ke default.", error);
  }

  return { tenant: getDefaultTenantFastPath(), source: "unresolved" };
}
