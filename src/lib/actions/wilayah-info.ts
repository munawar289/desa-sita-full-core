"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { wilayahInfoFormSchema } from "@/lib/validation/wilayah-info";
import { logAudit } from "./audit";

export type WilayahInfoActionState = { error: string | null; success?: boolean };

function parseForm(formData: FormData) {
  return wilayahInfoFormSchema.safeParse({
    section: formData.get("section"),
    konten: formData.get("konten"),
    page: formData.get("page"),
    judul: formData.get("judul"),
    eyebrow: formData.get("eyebrow"),
    urutan: formData.get("urutan"),
  });
}

function revalidatePublicPaths() {
  revalidatePath("/profil-desa/wilayah");
  revalidatePath("/profil-desa/sejarah");
}

export async function createWilayahInfoAction(
  _prevState: WilayahInfoActionState,
  formData: FormData,
): Promise<WilayahInfoActionState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("wilayah_info")
    .insert(parsed.data)
    .select("id")
    .single();

  if (error) {
    return {
      error: error.code === "23505" ? "Section ini sudah ada." : "Gagal menyimpan data.",
    };
  }

  await logAudit(supabase, {
    userId: user?.id,
    tableName: "wilayah_info",
    recordId: data.id,
    action: "insert",
    oldValue: null,
    newValue: parsed.data,
  });

  revalidatePath("/admin/wilayah");
  revalidatePublicPaths();
  return { error: null, success: true };
}

export async function updateWilayahInfoAction(
  _prevState: WilayahInfoActionState,
  formData: FormData,
): Promise<WilayahInfoActionState> {
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

  const { data: oldRow } = await supabase
    .from("wilayah_info")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("wilayah_info").update(parsed.data).eq("id", id);
  if (error) {
    return {
      error: error.code === "23505" ? "Section ini sudah ada." : "Gagal menyimpan perubahan.",
    };
  }

  await logAudit(supabase, {
    userId: user?.id,
    tableName: "wilayah_info",
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  revalidatePath("/admin/wilayah");
  revalidatePublicPaths();
  return { error: null, success: true };
}

export async function deleteWilayahInfoAction(id: string): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("wilayah_info")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("wilayah_info").delete().eq("id", id);
  if (error) return { error: "Gagal menghapus data." };

  await logAudit(supabase, {
    userId: user?.id,
    tableName: "wilayah_info",
    recordId: id,
    action: "delete",
    oldValue: oldRow,
    newValue: null,
  });

  revalidatePath("/admin/wilayah");
  revalidatePublicPaths();
  return { error: null };
}
