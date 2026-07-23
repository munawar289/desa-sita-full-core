"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  DETAIL_FIELDS,
  statistikRtDetailSchema,
  statistikRtSingleValueSchema,
} from "@/lib/validation/statistik-rt";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { logAudit } from "./audit";

export type StatistikRtActionState = { error: string | null; success?: boolean };

function toNumberOrNull(raw: string): number | null {
  return raw === "" ? null : Number(raw);
}

function revalidatePublicPaths() {
  revalidatePath("/data-desa");
  revalidatePath("/data-desa/kependudukan/penduduk");
  revalidatePath("/data-desa/kependudukan/keluarga");
  revalidatePath("/data-desa/kependudukan/pengangguran");
  revalidatePath("/data-desa/ekonomi/aset-ekonomi");
  revalidatePath("/data-desa/kesehatan");
}

export async function updateStatistikRtValueAction(
  _prevState: StatistikRtActionState,
  formData: FormData,
): Promise<StatistikRtActionState> {
  const parsed = statistikRtSingleValueSchema.safeParse({
    id: formData.get("id"),
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

  const { data: oldRow } = await supabase
    .from("statistik_rt")
    .select("*")
    .eq("id", parsed.data.id)
    .eq("tenant_id", tenant.id)
    .single();
  if (!oldRow) {
    return { error: "Data tidak ditemukan atau Anda tidak berwenang mengubahnya." };
  }

  const { error } = await supabase
    .from("statistik_rt")
    .update({ value: toNumberOrNull(parsed.data.value), updated_by: user?.id ?? null })
    .eq("id", parsed.data.id)
    .eq("tenant_id", tenant.id);

  if (error) return { error: "Gagal menyimpan perubahan." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "statistik_rt",
    recordId: parsed.data.id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  revalidatePath("/admin/statistik/per-rt");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:statistik_rt`);
  return { error: null, success: true };
}

export async function updateStatistikRtDetailAction(
  _prevState: StatistikRtActionState,
  formData: FormData,
): Promise<StatistikRtActionState> {
  const category = String(formData.get("category") ?? "");
  const fields = DETAIL_FIELDS[category];
  if (!fields) return { error: "Kategori ini tidak memakai detail multi-metrik." };

  const detail: Record<string, string> = {};
  for (const field of fields) {
    detail[field.key] = String(formData.get(`detail_${field.key}`) ?? "");
  }

  const parsed = statistikRtDetailSchema.safeParse({ id: formData.get("id"), detail });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: oldRow } = await supabase
    .from("statistik_rt")
    .select("*")
    .eq("id", parsed.data.id)
    .eq("tenant_id", tenant.id)
    .single();
  if (!oldRow) {
    return { error: "Data tidak ditemukan atau Anda tidak berwenang mengubahnya." };
  }

  const detailValues = Object.fromEntries(
    Object.entries(parsed.data.detail).map(([key, val]) => [key, toNumberOrNull(val)]),
  );

  const { error } = await supabase
    .from("statistik_rt")
    .update({ detail: detailValues, updated_by: user?.id ?? null })
    .eq("id", parsed.data.id)
    .eq("tenant_id", tenant.id);

  if (error) return { error: "Gagal menyimpan perubahan." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "statistik_rt",
    recordId: parsed.data.id,
    action: "update",
    oldValue: oldRow,
    newValue: detailValues,
  });

  revalidatePath("/admin/statistik/per-rt");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:statistik_rt`);
  return { error: null, success: true };
}
