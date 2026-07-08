"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { statistikSektorUsahaFormSchema } from "@/lib/validation/statistik-sektor-usaha";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { logAudit } from "./audit";

export type StatistikSektorUsahaActionState = { error: string | null; success?: boolean };

function revalidatePublicPaths() {
  revalidatePath("/data-desa");
  revalidatePath("/data-desa/ekonomi/pdb");
  revalidatePath("/data-desa/ekonomi/pendapatan-riil");
}

export async function updateStatistikSektorUsahaAction(
  _prevState: StatistikSektorUsahaActionState,
  formData: FormData,
): Promise<StatistikSektorUsahaActionState> {
  const parsed = statistikSektorUsahaFormSchema.safeParse({
    id: formData.get("id"),
    nilai_ribu_rupiah: formData.get("nilai_ribu_rupiah"),
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
    .from("statistik_sektor_usaha")
    .select("*")
    .eq("id", parsed.data.id)
    .eq("tenant_id", tenant.id)
    .single();

  const nilai = parsed.data.nilai_ribu_rupiah === "" ? null : Number(parsed.data.nilai_ribu_rupiah);

  const { error } = await supabase
    .from("statistik_sektor_usaha")
    .update({ nilai_ribu_rupiah: nilai, updated_by: user?.id ?? null })
    .eq("id", parsed.data.id)
    .eq("tenant_id", tenant.id);

  if (error) return { error: "Gagal menyimpan perubahan." };

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "statistik_sektor_usaha",
    recordId: parsed.data.id,
    action: "update",
    oldValue: oldRow,
    newValue: { nilai_ribu_rupiah: nilai },
  });

  revalidatePath("/admin/statistik/sektor-usaha");
  revalidatePublicPaths();
  revalidateTag(`tenant:${tenant.id}:statistik_sektor_usaha`);
  return { error: null, success: true };
}
