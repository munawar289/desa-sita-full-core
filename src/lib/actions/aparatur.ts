"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { aparaturFormSchema, type AparaturFormValues } from "@/lib/validation/aparatur";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { logAudit } from "./audit";

export type AparaturActionState = { error: string | null; success?: boolean };

function parseForm(formData: FormData) {
  return aparaturFormSchema.safeParse({
    nama: formData.get("nama"),
    jabatan: formData.get("jabatan"),
    pendidikan: formData.get("pendidikan"),
    urutan: formData.get("urutan"),
  });
}

function toRow(parsed: AparaturFormValues) {
  return {
    nama: parsed.nama === "" ? null : (parsed.nama ?? null),
    jabatan: parsed.jabatan,
    pendidikan: parsed.pendidikan === "" ? null : (parsed.pendidikan ?? null),
    urutan: parsed.urutan,
  };
}

function revalidatePublicPaths() {
  revalidatePath("/pemerintahan");
}

export async function createAparaturAction(
  _prevState: AparaturActionState,
  formData: FormData,
): Promise<AparaturActionState> {
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
    .from("aparatur")
    .insert({ ...toRow(parsed.data), tenant_id: tenant.id })
    .select("id")
    .single();

  if (error) return { error: "Gagal menyimpan data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "aparatur",
    recordId: data.id,
    action: "insert",
    oldValue: null,
    newValue: parsed.data,
  });

  revalidatePath("/admin/pemerintahan");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:aparatur`);
  return { error: null, success: true };
}

export async function updateAparaturAction(
  _prevState: AparaturActionState,
  formData: FormData,
): Promise<AparaturActionState> {
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
    .from("aparatur")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();
  if (!oldRow) {
    return { error: "Data tidak ditemukan atau Anda tidak berwenang mengubahnya." };
  }

  const { error } = await supabase
    .from("aparatur")
    .update(toRow(parsed.data))
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menyimpan perubahan." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "aparatur",
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  revalidatePath("/admin/pemerintahan");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:aparatur`);
  return { error: null, success: true };
}

export async function deleteAparaturAction(id: string): Promise<{ error: string | null }> {
  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("aparatur")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();
  if (!oldRow) {
    return { error: "Data tidak ditemukan atau Anda tidak berwenang menghapusnya." };
  }

  const { error } = await supabase
    .from("aparatur")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menghapus data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "aparatur",
    recordId: id,
    action: "delete",
    oldValue: oldRow,
    newValue: null,
  });

  revalidatePath("/admin/pemerintahan");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:aparatur`);
  return { error: null };
}
