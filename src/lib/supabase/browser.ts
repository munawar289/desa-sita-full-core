import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Client sisi browser — satu-satunya tempat yang boleh membaca sesi dari URL
 * fragment (link undangan/reset password Supabase). Dipakai halaman publik
 * `/set-password`, bukan dashboard admin/platform (yang selalu server-side).
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
}
