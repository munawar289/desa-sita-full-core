import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentProfile = {
  id: string;
  email: string | null;
  nama_lengkap: string;
  role: "admin" | "operator";
};

/**
 * Profil staf yang sedang login (join sesi Supabase Auth + tabel `profiles`).
 * Dipakai untuk gating role di Server Component — pelengkap RLS di database,
 * bukan pengganti (PRD §10: pengecekan dilakukan dua kali).
 */
export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nama_lengkap, role")
    .eq("id", user.id)
    .single();
  if (!profile) return null;

  return {
    id: profile.id,
    email: user.email ?? null,
    nama_lengkap: profile.nama_lengkap,
    role: profile.role,
  };
}
