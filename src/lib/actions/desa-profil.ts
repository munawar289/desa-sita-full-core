"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { desaProfilFormSchema } from "@/lib/validation/desa-profil";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { logAudit } from "./audit";

export type DesaProfilActionState = { error: string | null; success?: boolean };

export async function updateDesaProfilAction(
  _prevState: DesaProfilActionState,
  formData: FormData,
): Promise<DesaProfilActionState> {
  const id = String(formData.get("id") ?? "");
  const parsed = desaProfilFormSchema.safeParse({
    nama_desa: formData.get("nama_desa"),
    kecamatan: formData.get("kecamatan"),
    kabupaten: formData.get("kabupaten"),
    provinsi: formData.get("provinsi"),
    hero_deskripsi: formData.get("hero_deskripsi"),
    email: String(formData.get("email") ?? ""),
    jam_layanan: String(formData.get("jam_layanan") ?? ""),
    zona_waktu: String(formData.get("zona_waktu") ?? ""),
    tahun_berdiri: String(formData.get("tahun_berdiri") ?? ""),
    warna_primer: formData.get("warna_primer"),
    warna_sekunder: formData.get("warna_sekunder"),
    warna_aksen: formData.get("warna_aksen"),
    warna_latar_gelap: formData.get("warna_latar_gelap"),
    warna_latar: formData.get("warna_latar"),
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
    .from("desa_profil")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", tenant.id)
    .single();

  // Defense-in-depth: filter tenant_id di update, bukan cuma id — RLS
  // (is_tenant_admin) sudah menggerbangi ini, tapi mustahilkan juga secara
  // aplikasi kalau id ditebak/leak dari tenant lain.
  const { error } = await supabase
    .from("desa_profil")
    .update({ ...parsed.data, updated_by: user?.id ?? null })
    .eq("id", id)
    .eq("tenant_id", tenant.id);

  if (error) {
    return { error: "Gagal menyimpan perubahan." };
  }

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "desa_profil",
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue: parsed.data,
  });

  // Identitas desa muncul di hampir semua route (navbar/footer/metadata) —
  // revalidasi seluruh layout, bukan daftar path satu-satu.
  revalidatePath("/", "layout");
  revalidateTag(`tenant:${tenant.id}:desa_profil`);
  return { error: null, success: true };
}
