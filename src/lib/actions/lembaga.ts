"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { lembagaFormSchema, type LembagaFormValues } from "@/lib/validation/lembaga";
import { logAudit } from "./audit";

export type LembagaActionState = { error: string | null; success?: boolean };

function parseForm(formData: FormData) {
  return lembagaFormSchema.safeParse({
    kategori: formData.get("kategori"),
    nama: formData.get("nama"),
    dasar_hukum: formData.get("dasar_hukum"),
    jumlah_pengurus: formData.get("jumlah_pengurus"),
    keterangan: formData.get("keterangan"),
    urutan: formData.get("urutan"),
  });
}

function toRow(parsed: LembagaFormValues) {
  return {
    kategori: parsed.kategori,
    nama: parsed.nama,
    dasar_hukum: parsed.dasar_hukum === "" ? null : (parsed.dasar_hukum ?? null),
    jumlah_pengurus: parsed.jumlah_pengurus === "" ? null : Number(parsed.jumlah_pengurus),
    keterangan: parsed.keterangan === "" ? null : (parsed.keterangan ?? null),
    urutan: parsed.urutan,
  };
}

function revalidatePublicPaths() {
  revalidatePath("/lembaga-desa");
}

export async function createLembagaAction(
  _prevState: LembagaActionState,
  formData: FormData,
): Promise<LembagaActionState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("lembaga")
    .insert(toRow(parsed.data))
    .select("id")
    .single();

  if (error) return { error: "Gagal menyimpan data." };

  await logAudit(supabase, {
    userId: user?.id,
    tableName: "lembaga",
    recordId: data.id,
    action: "insert",
    oldValue: null,
    newValue: parsed.data,
  });

  revalidatePath("/admin/lembaga");
  revalidatePublicPaths();
  return { error: null, success: true };
}

export async function updateLembagaAction(
  _prevState: LembagaActionState,
  formData: FormData,
): Promise<LembagaActionState> {
  const id = String(formData.get("id") ?? "");
  const parsed = parseForm(formData);
  if (!id) return { error: "ID tidak valid." };
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase.from("lembaga").select("*").eq("id", id).single();

  const { error } = await supabase.from("lembaga").update(toRow(parsed.data)).eq("id", id);
  if (error) return { error: "Gagal menyimpan perubahan." };

  await logAudit(supabase, {
    userId: user?.id,
    tableName: "lembaga",
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  revalidatePath("/admin/lembaga");
  revalidatePublicPaths();
  return { error: null, success: true };
}

export async function deleteLembagaAction(id: string): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase.from("lembaga").select("*").eq("id", id).single();

  const { error } = await supabase.from("lembaga").delete().eq("id", id);
  if (error) return { error: "Gagal menghapus data." };

  await logAudit(supabase, {
    userId: user?.id,
    tableName: "lembaga",
    recordId: id,
    action: "delete",
    oldValue: oldRow,
    newValue: null,
  });

  revalidatePath("/admin/lembaga");
  revalidatePublicPaths();
  return { error: null };
}
