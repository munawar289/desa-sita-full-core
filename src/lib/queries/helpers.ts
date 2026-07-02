import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Pola baca data publik: pakai Supabase kalau env sudah dikonfigurasi,
 * jatuh ke mock lokal (src/lib/data) kalau belum — supaya situs tetap
 * tampil dan `next build` tetap lolos sebelum project Supabase dihubungkan.
 */
export async function withSupabaseFallback<T>(
  label: string,
  mock: T,
  loader: (client: SupabaseClient<Database>) => Promise<T>,
): Promise<T> {
  if (!isSupabaseConfigured()) return mock;

  try {
    return await loader(createPublicClient());
  } catch (error) {
    console.error(
      `[queries] Gagal memuat "${label}" dari Supabase, fallback ke data lokal.`,
      error,
    );
    return mock;
  }
}
