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
  | "unresolved";

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
