"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { bpdFormSchema, type BpdFormValues } from "@/lib/validation/bpd";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { logAudit } from "./audit";

export type BpdActionState = { error: string | null; success?: boolean };

function parseForm(formData: FormData) {
  return bpdFormSchema.safeParse({
    nama: formData.get("nama"),
    jabatan: formData.get("jabatan"),
    pendidikan: formData.get("pendidikan"),
    urutan: formData.get("urutan"),
  });
}

function toRow(parsed: BpdFormValues) {
  return {
    nama: parsed.nama,
    jabatan: parsed.jabatan,
    pendidikan: parsed.pendidikan === "" ? null : (parsed.pendidikan ?? null),
    urutan: parsed.urutan,
  };
}

function revalidatePublicPaths() {
  revalidatePath("/pemerintahan");
}

export async function createBpdAction(
  _prevState: BpdActionState,
  formData: FormData,
): Promise<BpdActionState> {
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
    .from("bpd_anggota")
    .insert({ ...toRow(parsed.data), tenant_id: tenant.id })
    .select("id")
    .single();

  if (error) return { error: "Gagal menyimpan data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "bpd_anggota",
    recordId: data.id,
    action: "insert",
    oldValue: null,
    newValue: parsed.data,
  });

  revalidatePath("/admin/pemerintahan");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:bpd_anggota`);
  return { error: null, success: true };
}

export async function updateBpdAction(
  _prevState: BpdActionState,
  formData: FormData,
): Promise<BpdActionState> {
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
    .from("bpd_anggota")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();

  const { error } = await supabase
    .from("bpd_anggota")
    .update(toRow(parsed.data))
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menyimpan perubahan." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "bpd_anggota",
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  revalidatePath("/admin/pemerintahan");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:bpd_anggota`);
  return { error: null, success: true };
}

export async function deleteBpdAction(id: string): Promise<{ error: string | null }> {
  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("bpd_anggota")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();

  const { error } = await supabase
    .from("bpd_anggota")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menghapus data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "bpd_anggota",
    recordId: id,
    action: "delete",
    oldValue: oldRow,
    newValue: null,
  });

  revalidatePath("/admin/pemerintahan");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:bpd_anggota`);
  return { error: null };
}
