import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Client anonim tanpa sesi/cookie — dipakai untuk membaca data publik di
 * Server Components dengan ISR. Karena tidak menyentuh cookie, halaman tetap
 * bisa di-render statis / di-cache. Tulis (mutasi) TIDAK lewat client ini.
 */
let cached: SupabaseClient<Database> | null = null;

export function createPublicClient(): SupabaseClient<Database> {
  if (cached) return cached;
  cached = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
