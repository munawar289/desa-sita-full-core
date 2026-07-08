import { createPublicClient } from "@/lib/supabase/public";
import { TENANT_BASE_DOMAIN, TENANT_STRATEGY } from "../env";
import type {
  Tenant,
  TenantResolverInput,
  TenantResolverStrategy,
  TenantResolution,
} from "../types";

// path-strategy.ts BELUM dibuat (YAGNI) — TenantResolverStrategy sudah
// mengantisipasi (parameter `pathname` disertakan sejak awal) supaya bisa
// ditambah nanti tanpa breaking change.
export class SubdomainTenantResolver implements TenantResolverStrategy {
  async resolve({ host }: TenantResolverInput): Promise<TenantResolution> {
    const client = createPublicClient();

    // Cek domain custom dulu (exact match, lebih spesifik).
    const { data: byDomain, error: domainError } = await client
      .from("tenants")
      .select("id, slug, domain, nama, status")
      .eq("domain", host)
      .maybeSingle();
    if (domainError) throw domainError;
    if (byDomain) return { tenant: byDomain as Tenant, source: "domain" };

    // Fallback: ekstraksi subdomain dari host, cocokkan ke tenants.slug.
    const slug = extractSubdomain(host);
    if (!slug) return { tenant: null, source: "unresolved" };

    const { data: bySlug, error: slugError } = await client
      .from("tenants")
      .select("id, slug, domain, nama, status")
      .eq("slug", slug)
      .maybeSingle();
    if (slugError) throw slugError;
    if (bySlug) return { tenant: bySlug as Tenant, source: "slug" };

    return { tenant: null, source: "unresolved" };
  }
}

function extractSubdomain(host: string): string | null {
  if (!TENANT_BASE_DOMAIN || !host.endsWith(`.${TENANT_BASE_DOMAIN}`)) {
    return null;
  }
  const slug = host.slice(0, -(`.${TENANT_BASE_DOMAIN}`.length));
  return slug.length > 0 && !slug.includes(".") ? slug : null;
}

export function getTenantResolverStrategy(): TenantResolverStrategy {
  switch (TENANT_STRATEGY) {
    case "subdomain":
    default:
      return new SubdomainTenantResolver();
  }
}
