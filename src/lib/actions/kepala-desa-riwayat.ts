"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  kepalaDesaRiwayatFormSchema,
  type KepalaDesaRiwayatFormValues,
} from "@/lib/validation/kepala-desa-riwayat";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { logAudit } from "./audit";

export type KepalaDesaRiwayatActionState = { error: string | null; success?: boolean };

function parseForm(formData: FormData) {
  return kepalaDesaRiwayatFormSchema.safeParse({
    nama: formData.get("nama"),
    periode_mulai: formData.get("periode_mulai"),
    periode_selesai: formData.get("periode_selesai"),
    keterangan: formData.get("keterangan"),
    urutan: formData.get("urutan"),
  });
}

function toRow(parsed: KepalaDesaRiwayatFormValues) {
  return {
    nama: parsed.nama,
    periode_mulai: parsed.periode_mulai,
    periode_selesai: parsed.periode_selesai === "" ? null : Number(parsed.periode_selesai),
    keterangan: parsed.keterangan === "" ? null : (parsed.keterangan ?? null),
    urutan: parsed.urutan,
  };
}

function revalidatePublicPaths() {
  revalidatePath("/profil-desa/sejarah");
}

export async function createKepalaDesaRiwayatAction(
  _prevState: KepalaDesaRiwayatActionState,
  formData: FormData,
): Promise<KepalaDesaRiwayatActionState> {
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
    .from("kepala_desa_riwayat")
    .insert({ ...toRow(parsed.data), tenant_id: tenant.id })
    .select("id")
    .single();

  if (error) return { error: "Gagal menyimpan data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "kepala_desa_riwayat",
    recordId: data.id,
    action: "insert",
    oldValue: null,
    newValue: parsed.data,
  });

  revalidatePath("/admin/pemerintahan");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:kepala_desa_riwayat`);
  return { error: null, success: true };
}

export async function updateKepalaDesaRiwayatAction(
  _prevState: KepalaDesaRiwayatActionState,
  formData: FormData,
): Promise<KepalaDesaRiwayatActionState> {
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
    .from("kepala_desa_riwayat")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();
  if (!oldRow) {
    return { error: "Data tidak ditemukan atau Anda tidak berwenang mengubahnya." };
  }

  const { error } = await supabase
    .from("kepala_desa_riwayat")
    .update(toRow(parsed.data))
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menyimpan perubahan." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "kepala_desa_riwayat",
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  revalidatePath("/admin/pemerintahan");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:kepala_desa_riwayat`);
  return { error: null, success: true };
}

export async function deleteKepalaDesaRiwayatAction(id: string): Promise<{ error: string | null }> {
  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("kepala_desa_riwayat")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();
  if (!oldRow) {
    return { error: "Data tidak ditemukan atau Anda tidak berwenang menghapusnya." };
  }

  const { error } = await supabase
    .from("kepala_desa_riwayat")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) return { error: "Gagal menghapus data." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "kepala_desa_riwayat",
    recordId: id,
    action: "delete",
    oldValue: oldRow,
    newValue: null,
  });

  revalidatePath("/admin/pemerintahan");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:kepala_desa_riwayat`);
  return { error: null };
}
