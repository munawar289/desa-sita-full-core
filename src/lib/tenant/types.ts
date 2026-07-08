export interface Tenant {
  id: string;
  slug: string;
  domain: string | null;
  nama: string;
  status: "active" | "suspended";
}

export type TenantResolutionSource =
  | "default-fast-path"
  | "domain"
  | "slug"
  | "unresolved"
  // Host punya bentuk subdomain tenant (mis. desaxx.lvh.me) tapi slug-nya
  // tidak cocok tenant manapun — BEDA dari "unresolved" (host yang memang
  // tidak punya struktur subdomain sama sekali, aman fallback ke default).
  // Middleware merespons 403 untuk source ini, TIDAK fallback ke default.
  | "unknown-subdomain";

export interface TenantResolution {
  tenant: Tenant | null;
  source: TenantResolutionSource;
}

export interface TenantResolverInput {
  host: string;
  pathname: string;
}

export interface TenantResolverStrategy {
  resolve(input: TenantResolverInput): Promise<TenantResolution>;
}
