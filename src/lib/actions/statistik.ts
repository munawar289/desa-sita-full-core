"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { statistikFormSchema } from "@/lib/validation/statistik";

export type StatistikActionState = { error: string | null; success?: boolean };

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

async function logAudit(
  supabase: SupabaseServerClient,
  params: {
    userId: string | undefined;
    recordId: string | null;
    action: "insert" | "update" | "delete";
    oldValue: unknown;
    newValue: unknown;
  },
) {
  await supabase.from("audit_log").insert({
    user_id: params.userId ?? null,
    table_name: "statistik",
    record_id: params.recordId,
    action: params.action,
    old_value: params.oldValue as never,
    new_value: params.newValue as never,
  });
}

function revalidatePublicPaths() {
  // Halaman publik yang menampilkan tabel `statistik` (PRD §7) — supaya
  // badge "terakhir diperbarui" tidak menunggu jendela ISR 5 menit.
  revalidatePath("/");
  revalidatePath("/data-desa/wilayah-administratif");
  revalidatePath("/data-desa/jenis-kelamin");
}

export async function createStatistikAction(
  _prevState: StatistikActionState,
  formData: FormData,
): Promise<StatistikActionState> {
  const parsed = statistikFormSchema.safeParse({
    category: formData.get("category"),
    key: formData.get("key"),
    label: formData.get("label"),
    value: formData.get("value"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("statistik")
    .insert({ ...parsed.data, updated_by: user?.id ?? null })
    .select("id")
    .single();

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Kombinasi kategori + key sudah ada."
          : "Gagal menyimpan data.",
    };
  }

  await logAudit(supabase, {
    userId: user?.id,
    recordId: data.id,
    action: "insert",
    oldValue: null,
    newValue: parsed.data,
  });

  revalidatePath("/admin/statistik");
  revalidatePublicPaths();
  return { error: null, success: true };
}

export async function updateStatistikAction(
  _prevState: StatistikActionState,
  formData: FormData,
): Promise<StatistikActionState> {
  const id = String(formData.get("id") ?? "");
  const parsed = statistikFormSchema.safeParse({
    category: formData.get("category"),
    key: formData.get("key"),
    label: formData.get("label"),
    value: formData.get("value"),
  });
  if (!id) return { error: "ID tidak valid." };
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("statistik")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("statistik")
    .update({ ...parsed.data, updated_by: user?.id ?? null })
    .eq("id", id);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Kombinasi kategori + key sudah ada."
          : "Gagal menyimpan perubahan.",
    };
  }

  await logAudit(supabase, {
    userId: user?.id,
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  revalidatePath("/admin/statistik");
  revalidatePublicPaths();
  return { error: null, success: true };
}

export async function deleteStatistikAction(id: string): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("statistik")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("statistik").delete().eq("id", id);
  if (error) {
    return { error: "Gagal menghapus data." };
  }

  await logAudit(supabase, {
    userId: user?.id,
    recordId: id,
    action: "delete",
    oldValue: oldRow,
    newValue: null,
  });

  revalidatePath("/admin/statistik");
  revalidatePublicPaths();
  return { error: null };
}
