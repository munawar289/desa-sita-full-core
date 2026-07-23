"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  desaProfilFormSchema,
  HERO_GAMBAR_MAX_BYTES,
  HERO_GAMBAR_MIME_TYPES,
} from "@/lib/validation/desa-profil";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
import { logAudit } from "./audit";

export type DesaProfilActionState = { error: string | null; success?: boolean };

const HERO_GAMBAR_BUCKET = "desa-hero";

// URL publik Storage berbentuk `.../object/public/desa-hero/{tenant_id}/{file}`
// — path objek adalah segmen setelah nama bucket, dipakai untuk hapus foto lama.
function extractHeroStoragePath(url: string): string | null {
  const marker = `/${HERO_GAMBAR_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

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
    hero_gambar_alt: String(formData.get("hero_gambar_alt") ?? ""),
    hero_gambar_hapus: String(formData.get("hero_gambar_hapus") ?? ""),
    email: String(formData.get("email") ?? ""),
    jam_layanan: String(formData.get("jam_layanan") ?? ""),
    zona_waktu: String(formData.get("zona_waktu") ?? ""),
    tahun_berdiri: String(formData.get("tahun_berdiri") ?? ""),
    warna_primer: formData.get("warna_primer"),
    warna_sekunder: formData.get("warna_sekunder"),
    warna_aksen: formData.get("warna_aksen"),
    jumlah_rt: String(formData.get("jumlah_rt") ?? ""),
  });
  if (!id) return { error: "ID tidak valid." };
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const heroGambarFileRaw = formData.get("hero_gambar_file");
  const heroGambarFile =
    heroGambarFileRaw instanceof File && heroGambarFileRaw.size > 0 ? heroGambarFileRaw : null;
  if (heroGambarFile) {
    if (heroGambarFile.size > HERO_GAMBAR_MAX_BYTES) {
      return { error: "Ukuran foto hero maksimal 5MB." };
    }
    if (!HERO_GAMBAR_MIME_TYPES.includes(heroGambarFile.type as (typeof HERO_GAMBAR_MIME_TYPES)[number])) {
      return { error: "Format foto hero harus JPG, PNG, atau WEBP." };
    }
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
  if (!oldRow) {
    return { error: "Data tidak ditemukan atau Anda tidak berwenang mengubahnya." };
  }

  let heroGambarUrl = oldRow.hero_gambar_url;
  let heroGambarAlt = parsed.data.hero_gambar_alt;
  let heroStoragePathToDelete: string | null = null;

  if (heroGambarFile) {
    const ext =
      heroGambarFile.type === "image/png" ? "png" : heroGambarFile.type === "image/webp" ? "webp" : "jpg";
    const path = `${tenant.id}/hero-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(HERO_GAMBAR_BUCKET)
      .upload(path, heroGambarFile, { contentType: heroGambarFile.type, upsert: false });
    if (uploadError) {
      return { error: "Gagal mengunggah foto hero." };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(HERO_GAMBAR_BUCKET).getPublicUrl(path);
    heroGambarUrl = publicUrl;
    if (oldRow.hero_gambar_url) {
      heroStoragePathToDelete = extractHeroStoragePath(oldRow.hero_gambar_url);
    }
  } else if (parsed.data.hero_gambar_hapus) {
    if (oldRow.hero_gambar_url) {
      heroStoragePathToDelete = extractHeroStoragePath(oldRow.hero_gambar_url);
    }
    heroGambarUrl = null;
    heroGambarAlt = null;
  }

  if (heroGambarUrl && !heroGambarAlt) {
    return { error: "Alt teks foto hero wajib diisi kalau ada foto (aksesibilitas)." };
  }

  // Jumlah RT dinamis (PRD jumlah-rt-dinamis §K2, K3, K4) — "Jumlah RT" di
  // Identitas Desa satu-satunya kontrol, dua arah: `wilayah_rt` disinkronkan
  // mengikuti angka ini, baik nambah maupun kurang. RT yang dihapus selalu
  // yang bernomor tertinggi (trailing, konsisten "no reorder manual"), dan
  // hanya boleh dihapus kalau belum punya baris statistik_rt sama sekali —
  // mencegah hapus data diam-diam.
  const { data: existingRt, error: rtQueryError } = await supabase
    .from("wilayah_rt")
    .select("id, nomor, urutan")
    .eq("tenant_id", tenant.id)
    .order("urutan", { ascending: false });

  if (rtQueryError) {
    return { error: "Gagal memeriksa data RT saat ini." };
  }

  const existingRtCount = existingRt?.length ?? 0;
  const maxUrutan = existingRt?.[0]?.urutan ?? 0;

  // Urutan operasi (Risiko #1 di PRD): sinkronkan RT dulu (insert/delete) →
  // upsert Statistik lembaga_kemasyarakatan/rt → update desa_profil terakhir.
  // Tidak atomic lintas tabel, tapi urutan ini aman di-retry kalau langkah
  // berikutnya gagal (nomor RT lanjut, tidak pernah dobel).
  if (parsed.data.jumlah_rt > existingRtCount) {
    const newRtRows = Array.from(
      { length: parsed.data.jumlah_rt - existingRtCount },
      (_, i) => {
        const urutan = maxUrutan + i + 1;
        const nomor = String(urutan).padStart(3, "0");
        return { tenant_id: tenant.id, nomor, nama: `RT ${nomor}`, urutan };
      },
    );
    const { error: insertRtError } = await supabase.from("wilayah_rt").insert(newRtRows);
    if (insertRtError) {
      return { error: "Gagal menambah baris RT baru." };
    }
  } else if (parsed.data.jumlah_rt < existingRtCount) {
    const candidates = (existingRt ?? []).slice(0, existingRtCount - parsed.data.jumlah_rt);
    const candidateIds = candidates.map((rt) => rt.id);

    const { data: blockingFacts, error: factQueryError } = await supabase
      .from("statistik_rt")
      .select("rt_id")
      .eq("tenant_id", tenant.id)
      .in("rt_id", candidateIds);

    if (factQueryError) {
      return { error: "Gagal memeriksa data statistik RT." };
    }

    const blockedRtIds = new Set((blockingFacts ?? []).map((fact) => fact.rt_id));
    const blockedNomor = candidates
      .filter((rt) => blockedRtIds.has(rt.id))
      .map((rt) => rt.nomor)
      .sort();

    if (blockedNomor.length > 0) {
      return {
        error: `RT ${blockedNomor.join(", ")} sudah punya data statistik terisi, tidak bisa dihapus dari sini. Kosongkan datanya dulu di Statistik per-RT, atau hubungi tim teknis.`,
      };
    }

    const { error: deleteRtError } = await supabase
      .from("wilayah_rt")
      .delete()
      .eq("tenant_id", tenant.id)
      .in("id", candidateIds);
    if (deleteRtError) {
      return { error: "Gagal menghapus RT." };
    }
  }

  const { error: statistikError } = await supabase.from("statistik").upsert(
    {
      tenant_id: tenant.id,
      category: "lembaga_kemasyarakatan",
      key: "rt",
      label: "Rukun Tetangga (RT)",
      value: String(parsed.data.jumlah_rt),
      updated_by: user?.id ?? null,
    },
    { onConflict: "tenant_id,category,key" },
  );
  if (statistikError) {
    return { error: "Gagal memperbarui statistik jumlah RT." };
  }

  const newValue = {
    nama_desa: parsed.data.nama_desa,
    kecamatan: parsed.data.kecamatan,
    kabupaten: parsed.data.kabupaten,
    provinsi: parsed.data.provinsi,
    hero_deskripsi: parsed.data.hero_deskripsi,
    hero_gambar_url: heroGambarUrl,
    hero_gambar_alt: heroGambarAlt,
    email: parsed.data.email,
    jam_layanan: parsed.data.jam_layanan,
    zona_waktu: parsed.data.zona_waktu,
    tahun_berdiri: parsed.data.tahun_berdiri,
    warna_primer: parsed.data.warna_primer,
    warna_sekunder: parsed.data.warna_sekunder,
    warna_aksen: parsed.data.warna_aksen,
    jumlah_rt: parsed.data.jumlah_rt,
  };

  // Defense-in-depth: filter tenant_id di update, bukan cuma id — RLS
  // (is_tenant_admin) sudah menggerbangi ini, tapi mustahilkan juga secara
  // aplikasi kalau id ditebak/leak dari tenant lain.
  const { error } = await supabase
    .from("desa_profil")
    .update({ ...newValue, updated_by: user?.id ?? null })
    .eq("id", id)
    .eq("tenant_id", tenant.id);

  if (error) {
    return { error: "Gagal menyimpan perubahan." };
  }

  // Best-effort: foto lama sudah tergantikan di baris desa_profil, hapus dari
  // Storage supaya tidak jadi sampah. Kegagalan di sini tidak membatalkan
  // penyimpanan (data sudah konsisten, cuma file lama nyangkut).
  if (heroStoragePathToDelete) {
    await supabase.storage.from(HERO_GAMBAR_BUCKET).remove([heroStoragePathToDelete]);
  }

  await logAudit(supabase, {
    tenantId: tenant.id,
    userId: user?.id,
    tableName: "desa_profil",
    recordId: id,
    action: "update",
    oldValue: oldRow,
    newValue,
  });

  // Identitas desa muncul di hampir semua route (navbar/footer/metadata) —
  // revalidasi seluruh layout, bukan daftar path satu-satu.
  revalidatePath("/", "layout");
  revalidatePath("/admin/statistik");
  revalidatePath("/admin/statistik/per-rt");
  revalidateTag(`tenant:${tenant.id}:desa_profil`);
  revalidateTag(`tenant:${tenant.id}:wilayah_rt`);
  revalidateTag(`tenant:${tenant.id}:statistik`);
  revalidateTag(`tenant:${tenant.id}:statistik_rt`);
  return { error: null, success: true };
}
