import { TENANT_BASE_DOMAIN, TENANT_DEV_FORCE_SLUG, TENANT_STRATEGY } from "./env";
import { normalizeHost } from "./normalize";

/**
 * True kalau host adalah root TENANT_BASE_DOMAIN TANPA subdomain apa pun
 * (mis. `lvh.me:3000`, bukan `coba.lvh.me:3000`) — host ini didedikasikan
 * untuk /platform (landlord), bukan tenant manapun. Dipakai src/middleware.ts
 * supaya route tenant (publik maupun /admin) tidak diam-diam fallback ke
 * tenant default di domain landlord.
 *
 * DEFAULT_TENANT_HOSTS (mis. localhost:3000, domain produksi lama) SENGAJA
 * tidak dianggap landlord host di sini — itu tetap fast-path ke tenant
 * default seperti sebelumnya, tidak terpengaruh perubahan ini.
 */
export function isLandlordOnlyHost(rawHost: string): boolean {
  if (process.env.NODE_ENV !== "production" && TENANT_DEV_FORCE_SLUG) return false;
  if (TENANT_STRATEGY !== "subdomain" || !TENANT_BASE_DOMAIN) return false;
  const host = normalizeHost(rawHost);
  const base = normalizeHost(TENANT_BASE_DOMAIN);
  // `www.<base>` diperlakukan sama seperti root — konvensi umum domain
  // custom, bukan "tenant bernama www".
  return host === base || host === `www.${base}`;
}
