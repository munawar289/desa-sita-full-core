import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentProfile = {
  id: string;
  email: string | null;
  nama_lengkap: string;
  /** null = login sah tapi bukan anggota (memberships) tenant yang diakses. */
  role: "admin" | "operator" | null;
};

/**
 * Profil staf yang sedang login (join sesi Supabase Auth + tabel `profiles`),
 * dengan role di-scope ke tenant aktif lewat `memberships` (Phase 4 Modul 1)
 * — bukan lagi `profiles.role` global. Dipakai untuk gating role di Server
 * Component — pelengkap RLS di database, bukan pengganti (PRD §10).
 */
export async function getCurrentProfile(
  tenantId: string,
): Promise<CurrentProfile | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nama_lengkap")
    .eq("id", user.id)
    .single();
  if (!profile) return null;

  const { data: membership } = await supabase
    .from("memberships")
    .select("role")
    .eq("tenant_id", tenantId)
    .eq("profile_id", user.id)
    .maybeSingle();

  return {
    id: profile.id,
    email: user.email ?? null,
    nama_lengkap: profile.nama_lengkap,
    role: membership?.role ?? null,
  };
}
