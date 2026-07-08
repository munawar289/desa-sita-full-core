import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "./config";

/**
 * Client dengan SERVICE_ROLE_KEY — bypass RLS sepenuhnya, dan satu-satunya
 * cara memanggil Supabase Auth Admin API (mis. inviteUserByEmail). JANGAN
 * PERNAH diimpor dari Client Component atau apa pun yang bisa masuk bundle
 * browser — hanya dipakai dari Server Action `src/lib/actions/platform-*.ts`.
 */
export function createServiceRoleClient(): SupabaseClient<Database> {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY belum diset di environment.");
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
