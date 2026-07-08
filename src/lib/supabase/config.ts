/**
 * Konfigurasi koneksi Supabase.
 *
 * Selama project cloud belum dihubungkan (env kosong), `isSupabaseConfigured`
 * mengembalikan false sehingga query layer otomatis jatuh ke mock lokal —
 * situs publik tetap tampil & `next build` tetap lolos tanpa database.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
// Hanya dipakai server-side (Server Action) lewat createServiceRoleClient() —
// lihat src/lib/supabase/service.ts. JANGAN pernah diekspos ke client bundle.
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}
