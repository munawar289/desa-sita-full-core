// Harus identik dengan id tenant seed di supabase/migrations/0009_tenants_foundation.sql
// — lihat PRD §4.3 kenapa id ini harus konstan (bukan gen_random_uuid()).
export const DEFAULT_TENANT_ID = "00000000-0000-0000-0000-000000000001";
