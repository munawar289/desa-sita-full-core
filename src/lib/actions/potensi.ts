"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { potensiFormSchema } from "@/lib/validation/potensi";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { logAudit } from "./audit";

export type PotensiActionState = { error: string | null; success?: boolean };

function parseForm(formData: FormData) {
  return potensiFormSchema.safeParse({
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi"),
    icon: formData.get("icon"),
    urutan: formData.get("urutan"),
  });
}

function revalidatePublicPaths() {
  revalidatePath("/");
}

export async function createPotensiAction(
  _prevState: PotensiActionState,
  formData: FormData,
): Promise<PotensiActionState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("potensi_desa")
    .insert({ ...parsed.data, tenant_id: tenant.id })
    .select("id")
    .single();

  if (error) return { error: "Gagal menyimpan data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "potensi_desa",
    recordId: data.id,
    action: "insert",
    oldValue: null,
    newValue: parsed.data,
  });

  revalidatePath("/admin/potensi");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:potensi_desa`);
  return { error: null, success: true };
}

export async function updatePotensiAction(
  _prevState: PotensiActionState,
  formData: FormData,
): Promise<PotensiActionState> {
  const id = String(formData.get("id") ?? "");
  const parsed = parseForm(formData);
  if (!id) return { error: "ID tidak valid." };
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("potensi_desa")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();
  if (!oldRow) {
    return { error: "Data tidak ditemukan atau Anda tidak berwenang mengubahnya." };
  }

  const { error } = await supabase
    .from("potensi_desa")
    .update(parsed.data)
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menyimpan perubahan." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "potensi_desa",
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  revalidatePath("/admin/potensi");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:potensi_desa`);
  return { error: null, success: true };
}

export async function deletePotensiAction(id: string): Promise<{ error: string | null }> {
  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("potensi_desa")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();
  if (!oldRow) {
    return { error: "Data tidak ditemukan atau Anda tidak berwenang menghapusnya." };
  }

  const { error } = await supabase
    .from("potensi_desa")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menghapus data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "potensi_desa",
    recordId: id,
    action: "delete",
    oldValue: oldRow,
    newValue: null,
  });

  revalidatePath("/admin/potensi");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:potensi_desa`);
  return { error: null };
}
