import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CurrentPlatformAdmin = {
  id: string;
  email: string | null;
  nama_lengkap: string;
};

/** Landlord yang sedang login — total terpisah dari getCurrentProfile()/getCurrentTenant(). */
export async function getCurrentPlatformAdmin(): Promise<CurrentPlatformAdmin | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: admin } = await supabase
    .from("platform_admins")
    .select("profile_id")
    .eq("profile_id", user.id)
    .maybeSingle();
  if (!admin) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("nama_lengkap")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    nama_lengkap: profile?.nama_lengkap ?? user.email ?? "Admin Platform",
  };
}
