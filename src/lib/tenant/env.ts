export const TENANT_STRATEGY = process.env.TENANT_STRATEGY ?? "subdomain";
export const TENANT_BASE_DOMAIN = process.env.TENANT_BASE_DOMAIN ?? "";
export const DEFAULT_TENANT_SLUG = process.env.DEFAULT_TENANT_SLUG ?? "sita";
export const DEFAULT_TENANT_HOSTS = (process.env.DEFAULT_TENANT_HOSTS ?? "")
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);
// WAJIB berisi semua host produksi existing (custom domain + *.vercel.app)
// supaya tidak ada satupun request produksi hari ini yang lewat jalur DB-lookup.

// Dev-only: paksa resolusi ke slug tertentu tanpa perlu DNS/hosts, aktif hanya
// kalau NODE_ENV !== "production". Lihat resolve-tenant.ts.
export const TENANT_DEV_FORCE_SLUG = process.env.TENANT_DEV_FORCE_SLUG ?? "";

// Dev/preview-only: echo x-tenant-slug ke response header supaya bisa
// diverifikasi lewat `curl -I` tanpa DevTools.
export const TENANT_DEBUG_HEADERS = process.env.TENANT_DEBUG_HEADERS === "true";
