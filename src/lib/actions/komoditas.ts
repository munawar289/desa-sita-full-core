"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { komoditasFormSchema, type KomoditasFormValues } from "@/lib/validation/komoditas";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { logAudit } from "./audit";

export type KomoditasActionState = { error: string | null; success?: boolean };

function parseForm(formData: FormData) {
  return komoditasFormSchema.safeParse({
    nama: formData.get("nama"),
    luas_ha: formData.get("luas_ha"),
    hasil_panen: formData.get("hasil_panen"),
    urutan: formData.get("urutan"),
  });
}

function toRow(parsed: KomoditasFormValues) {
  return {
    nama: parsed.nama,
    luas_ha: parsed.luas_ha === "" ? null : Number(parsed.luas_ha),
    hasil_panen: parsed.hasil_panen === "" ? null : (parsed.hasil_panen ?? null),
    urutan: parsed.urutan,
  };
}

function revalidatePublicPaths() {
  revalidatePath("/profil-desa/wilayah");
}

export async function createKomoditasAction(
  _prevState: KomoditasActionState,
  formData: FormData,
): Promise<KomoditasActionState> {
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
    .from("komoditas")
    .insert({ ...toRow(parsed.data), tenant_id: tenant.id })
    .select("id")
    .single();

  if (error) return { error: "Gagal menyimpan data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "komoditas",
    recordId: data.id,
    action: "insert",
    oldValue: null,
    newValue: parsed.data,
  });

  revalidatePath("/admin/wilayah");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:komoditas`);
  return { error: null, success: true };
}

export async function updateKomoditasAction(
  _prevState: KomoditasActionState,
  formData: FormData,
): Promise<KomoditasActionState> {
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
    .from("komoditas")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();

  const { error } = await supabase
    .from("komoditas")
    .update(toRow(parsed.data))
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menyimpan perubahan." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "komoditas",
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  revalidatePath("/admin/wilayah");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:komoditas`);
  return { error: null, success: true };
}

export async function deleteKomoditasAction(id: string): Promise<{ error: string | null }> {
  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("komoditas")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();

  const { error } = await supabase
    .from("komoditas")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menghapus data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "komoditas",
    recordId: id,
    action: "delete",
    oldValue: oldRow,
    newValue: null,
  });

  revalidatePath("/admin/wilayah");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:komoditas`);
  return { error: null };
}
