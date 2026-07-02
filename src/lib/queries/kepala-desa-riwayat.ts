import {
  kepalaDesaRiwayatMock,
  type KepalaDesaRiwayat,
} from "@/lib/data/kepala-desa-riwayat";
import { withSupabaseFallback } from "./helpers";

export async function getKepalaDesaRiwayat(): Promise<KepalaDesaRiwayat[]> {
  return withSupabaseFallback(
    "kepala_desa_riwayat",
    kepalaDesaRiwayatMock,
    async (client) => {
      const { data, error } = await client
        .from("kepala_desa_riwayat")
        .select("id, nama, periode_mulai, periode_selesai, keterangan, urutan")
        .order("urutan");
      if (error) throw error;
      return data;
    },
  );
}
