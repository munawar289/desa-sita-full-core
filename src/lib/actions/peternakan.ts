"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { peternakanFormSchema, type PeternakanFormValues } from "@/lib/validation/peternakan";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { logAudit } from "./audit";

export type PeternakanActionState = { error: string | null; success?: boolean };

function parseForm(formData: FormData) {
  return peternakanFormSchema.safeParse({
    jenis_ternak: formData.get("jenis_ternak"),
    populasi: formData.get("populasi"),
    jumlah_pemilik: formData.get("jumlah_pemilik"),
    urutan: formData.get("urutan"),
  });
}

function toRow(parsed: PeternakanFormValues) {
  return {
    jenis_ternak: parsed.jenis_ternak,
    populasi: parsed.populasi === "" ? null : Number(parsed.populasi),
    jumlah_pemilik: parsed.jumlah_pemilik === "" ? null : Number(parsed.jumlah_pemilik),
    urutan: parsed.urutan,
  };
}

function revalidatePublicPaths() {
  revalidatePath("/profil-desa/wilayah");
}

export async function createPeternakanAction(
  _prevState: PeternakanActionState,
  formData: FormData,
): Promise<PeternakanActionState> {
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
    .from("peternakan")
    .insert({ ...toRow(parsed.data), tenant_id: tenant.id })
    .select("id")
    .single();

  if (error) return { error: "Gagal menyimpan data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "peternakan",
    recordId: data.id,
    action: "insert",
    oldValue: null,
    newValue: parsed.data,
  });

  revalidatePath("/admin/wilayah");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:peternakan`);
  return { error: null, success: true };
}

export async function updatePeternakanAction(
  _prevState: PeternakanActionState,
  formData: FormData,
): Promise<PeternakanActionState> {
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
    .from("peternakan")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();
  if (!oldRow) {
    return { error: "Data tidak ditemukan atau Anda tidak berwenang mengubahnya." };
  }

  const { error } = await supabase
    .from("peternakan")
    .update(toRow(parsed.data))
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menyimpan perubahan." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "peternakan",
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  revalidatePath("/admin/wilayah");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:peternakan`);
  return { error: null, success: true };
}

export async function deletePeternakanAction(id: string): Promise<{ error: string | null }> {
  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("peternakan")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();
  if (!oldRow) {
    return { error: "Data tidak ditemukan atau Anda tidak berwenang menghapusnya." };
  }

  const { error } = await supabase
    .from("peternakan")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menghapus data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "peternakan",
    recordId: id,
    action: "delete",
    oldValue: oldRow,
    newValue: null,
  });

  revalidatePath("/admin/wilayah");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:peternakan`);
  return { error: null };
}
