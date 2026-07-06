import { cache } from "react";
import { desaProfilMock, type DesaProfil } from "@/lib/data/desa-profil";
import { withSupabaseFallback } from "./helpers";

// `cache()` dedupe pemanggilan dalam satu render pass — identitas desa kini
// dibaca berulang kali per request (root layout, generateMetadata tiap
// halaman, komponen beranda), jadi tanpa ini query/mock berjalan berkali-kali
// sia-sia untuk data yang sama.
export const getDesaProfil = cache(async function getDesaProfil(): Promise<DesaProfil> {
  return withSupabaseFallback("desa_profil", desaProfilMock, async (client) => {
    const { data, error } = await client
      .from("desa_profil")
      .select(
        "id, nama_desa, kecamatan, kabupaten, provinsi, hero_deskripsi, email, jam_layanan, zona_waktu, tahun_berdiri, warna_primer, warna_sekunder, warna_aksen, warna_latar_gelap, warna_latar, updated_at",
      )
      .limit(1)
      .single();
    if (error) throw error;
    return data;
  });
});
