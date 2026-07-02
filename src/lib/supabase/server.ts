import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Client berbasis sesi (cookie) untuk konteks terautentikasi — dashboard admin
 * & Server Actions di Fase 2. Membaca/menyegarkan sesi Supabase Auth dari cookie
 * request. Jangan pakai di halaman publik yang ingin di-ISR (memaksa dynamic).
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `setAll` dipanggil dari Server Component — aman diabaikan bila
          // middleware yang menyegarkan sesi.
        }
      },
    },
  });
}
