"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { statistikFormSchema } from "@/lib/validation/statistik";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { logAudit } from "./audit";

export type StatistikActionState = { error: string | null; success?: boolean };

function revalidatePublicPaths() {
  // Halaman publik yang menampilkan tabel `statistik` (PRD §7, statistik
  // lanjutan §5) — supaya badge "terakhir diperbarui" tidak menunggu jendela
  // ISR 5 menit.
  revalidatePath("/");
  revalidatePath("/data-desa");
  revalidatePath("/data-desa/wilayah-administratif");
  revalidatePath("/data-desa/kependudukan/penduduk");
  revalidatePath("/data-desa/ekonomi/kesejahteraan-keluarga");
  revalidatePath("/data-desa/ekonomi/mata-pencaharian");
  revalidatePath("/data-desa/ekonomi/aset-ekonomi");
  revalidatePath("/data-desa/pendidikan");
  revalidatePath("/data-desa/kesehatan");
  revalidatePath("/data-desa/keamanan-kelembagaan");
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

  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("statistik")
    .insert({ ...parsed.data, tenant_id: tenant.id, updated_by: user?.id ?? null })
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
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "statistik",
    recordId: data.id,
    action: "insert",
    oldValue: null,
    newValue: parsed.data,
  });

  revalidatePath("/admin/statistik");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:statistik`);
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

  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("statistik")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();

  const { error } = await supabase
    .from("statistik")
    .update({ ...parsed.data, updated_by: user?.id ?? null })
    .eq("id", id)
    .eq("tenant_id", tenant.id);

  if (error) {
    return {
      error:
        error.code === "23505"
          ? "Kombinasi kategori + key sudah ada."
          : "Gagal menyimpan perubahan.",
    };
  }

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "statistik",
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  revalidatePath("/admin/statistik");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:statistik`);
  return { error: null, success: true };
}

export async function deleteStatistikAction(id: string): Promise<{ error: string | null }> {
  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("statistik")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();

  const { error } = await supabase
    .from("statistik")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenant.id);
  if (error) {
    return { error: "Gagal menghapus data." };
  }

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "statistik",
    recordId: id,
    action: "delete",
    oldValue: oldRow,
    newValue: null,
  });

  revalidatePath("/admin/statistik");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:statistik`);
  return { error: null };
}
