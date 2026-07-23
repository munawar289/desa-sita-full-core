"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service";
import {
  platformInviteAdminFormSchema,
  platformTenantFormSchema,
} from "@/lib/validation/platform";

export type PlatformTenantActionState = { error: string | null; success?: boolean };

export async function createTenantAction(
  _prevState: PlatformTenantActionState,
  formData: FormData,
): Promise<PlatformTenantActionState> {
  const parsed = platformTenantFormSchema.safeParse({
    slug: formData.get("slug"),
    nama: formData.get("nama"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("tenants").insert(parsed.data);

  if (error) {
    return {
      error: error.code === "23505" ? "Slug sudah dipakai." : "Gagal membuat tenant.",
    };
  }

  revalidatePath("/platform/dashboard");
  return { error: null, success: true };
}

export async function updateTenantStatusAction(
  tenantId: string,
  status: "active" | "suspended",
) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("tenants").update({ status }).eq("id", tenantId);

  revalidatePath("/platform/dashboard");
  revalidatePath(`/platform/dashboard/tenants/${tenantId}`);
}

export type TenantAdmin = {
  id: string;
  role: "admin" | "operator";
  createdAt: string;
  namaLengkap: string;
};

/**
 * Pakai service role, BUKAN client sesi biasa — kebijakan RLS
 * `profiles_select_own_or_admin` masih memakai `is_admin()` (role global
 * lama), bukan `is_platform_admin()`, jadi platform admin yang tidak
 * kebetulan punya `profiles.role = 'admin'` tidak akan bisa membaca
 * `nama_lengkap` admin tenant lain lewat client biasa. Baca-baca via
 * service role di sini sudah cukup karena hanya dipanggil dari halaman
 * platform yang sudah digerbangi sesi landlord di middleware.
 */
export async function getTenantAdmins(tenantId: string): Promise<TenantAdmin[]> {
  const serviceClient = createServiceRoleClient();

  const { data: memberships } = await serviceClient
    .from("memberships")
    .select("id, profile_id, role, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: true });

  if (!memberships || memberships.length === 0) return [];

  const { data: profiles } = await serviceClient
    .from("profiles")
    .select("id, nama_lengkap")
    .in(
      "id",
      memberships.map((m) => m.profile_id),
    );

  return memberships.map((m) => ({
    id: m.id,
    role: m.role,
    createdAt: m.created_at,
    namaLengkap: profiles?.find((p) => p.id === m.profile_id)?.nama_lengkap ?? "—",
  }));
}

/**
 * Cari profileId dari email lewat Auth Admin API (butuh service role — tidak
 * bisa query auth.users dari client biasa). Dibatasi ~20 halaman/4000 user
 * supaya tidak infinite-loop kalau ternyata tidak ketemu.
 */
async function findProfileIdByEmail(
  serviceClient: ReturnType<typeof createServiceRoleClient>,
  email: string,
): Promise<string | null> {
  const perPage = 200;
  const maxPages = 20;
  for (let page = 1; page <= maxPages; page++) {
    const { data, error } = await serviceClient.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (match) return match.id;
    if (data.users.length < perPage) break;
  }
  return null;
}

/**
 * Hapus akses admin tenant ini (baris `memberships`) — BUKAN menghapus akun
 * Supabase Auth-nya, karena satu akun bisa saja anggota tenant lain juga.
 * Lewat client sesi biasa supaya RLS `memberships_admin_write`
 * (is_platform_admin()) yang menegakkan otorisasi, konsisten dengan
 * updateTenantStatusAction.
 */
export async function removeTenantAdminAction(tenantId: string, membershipId: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("memberships").delete().eq("id", membershipId).eq("tenant_id", tenantId);

  revalidatePath(`/platform/dashboard/tenants/${tenantId}`);
}

export type PlatformInviteActionState = { error: string | null; success?: boolean };

export async function inviteTenantAdminAction(
  _prevState: PlatformInviteActionState,
  formData: FormData,
): Promise<PlatformInviteActionState> {
  const parsed = platformInviteAdminFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    tenant_id: formData.get("tenant_id"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }
  const { email, password, tenant_id: tenantId } = parsed.data;

  const serviceClient = createServiceRoleClient();

  let profileId: string | null = null;
  // Dibuat langsung dengan email_confirm: true — tanpa alur invite/verifikasi
  // email, supaya tidak bergantung pada rate limit & konfigurasi SMTP Supabase.
  const { data: created, error: createError } = await serviceClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (created?.user) {
    profileId = created.user.id;
  } else if (createError && /registrat|regist|exist/i.test(createError.message)) {
    // Email sudah terdaftar — tambahkan sebagai admin tenant ini TANPA
    // mengubah kata sandi akun yang sudah ada (password di form diabaikan).
    profileId = await findProfileIdByEmail(serviceClient, email);
  } else if (createError) {
    return { error: "Gagal menambah admin. Coba lagi." };
  }

  if (!profileId) {
    return { error: "Email terdaftar tapi tidak ditemukan. Coba lagi." };
  }

  // Insert membership lewat client biasa (sesi landlord), BUKAN service role
  // — supaya RLS is_platform_admin() yang baru benar-benar teruji jalan.
  const supabase = await createSupabaseServerClient();
  const { error: membershipError } = await supabase
    .from("memberships")
    .upsert(
      { tenant_id: tenantId, profile_id: profileId, role: "admin" },
      { onConflict: "tenant_id,profile_id" },
    );

  if (membershipError) {
    return { error: "Gagal menambah keanggotaan admin." };
  }

  revalidatePath(`/platform/dashboard/tenants/${tenantId}`);
  return { error: null, success: true };
}
