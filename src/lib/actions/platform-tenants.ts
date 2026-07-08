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

export type PlatformInviteActionState = { error: string | null; success?: boolean };

export async function inviteTenantAdminAction(
  _prevState: PlatformInviteActionState,
  formData: FormData,
): Promise<PlatformInviteActionState> {
  const parsed = platformInviteAdminFormSchema.safeParse({
    email: formData.get("email"),
    tenant_id: formData.get("tenant_id"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }
  const { email, tenant_id: tenantId } = parsed.data;

  const serviceClient = createServiceRoleClient();

  let profileId: string | null = null;
  const { data: invited, error: inviteError } = await serviceClient.auth.admin.inviteUserByEmail(
    email,
    { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/set-password` },
  );

  if (invited?.user) {
    profileId = invited.user.id;
  } else if (inviteError && /registrat|regist|exist/i.test(inviteError.message)) {
    profileId = await findProfileIdByEmail(serviceClient, email);
  } else if (inviteError) {
    return { error: "Gagal mengundang admin. Coba lagi." };
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
