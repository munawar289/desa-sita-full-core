import { TENANT_BASE_DOMAIN } from "./env";

export function getTenantWebsite(tenant: { slug: string; domain: string | null }) {
  const host = tenant.domain ?? (TENANT_BASE_DOMAIN ? `${tenant.slug}.${TENANT_BASE_DOMAIN}` : null);
  return host ? { host, url: `https://${host}` } : null;
}
