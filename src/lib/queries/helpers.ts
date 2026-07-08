import { unstable_cache } from "next/cache";
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

/**
 * Varian tenant-aware `withSupabaseFallback` (Phase 4 §9) — membungkus loader
 * dengan `unstable_cache` per tenant supaya query publik yang sekarang harus
 * baca `getCurrentTenant()` (full-dynamic) tidak selalu round-trip ke Supabase.
 *
 * Dua aturan wajib dari PRD, jangan dilanggar:
 * - `tenantId` HARUS di-resolve di luar closure ini (pemanggil sudah panggil
 *   `getCurrentTenant()` sebelum masuk sini) — memanggil `headers()` di dalam
 *   closure yang di-cache akan error ("dynamic API used inside unstable_cache").
 * - Loader TIDAK menerima instance Supabase client sebagai argumen (bukan
 *   primitif serializable) — closure membuat client sendiri lewat
 *   `createPublicClient()`, cache key murni dari `keyParts`.
 */
export async function withTenantSupabaseFallback<T>(
  label: string,
  tenantId: string,
  mock: T,
  loader: (client: SupabaseClient<Database>) => Promise<T>,
): Promise<T> {
  if (!isSupabaseConfigured()) return mock;

  const cachedLoader = unstable_cache(
    () => loader(createPublicClient()),
    [label, tenantId],
    { revalidate: 300, tags: [`tenant:${tenantId}:${label}`] },
  );

  try {
    return await cachedLoader();
  } catch (error) {
    console.error(
      `[queries] Gagal memuat "${label}" dari Supabase (tenant ${tenantId}), fallback ke data lokal.`,
      error,
    );
    return mock;
  }
}
