import type { Metadata } from "next";
import Link from "next/link";
import { StatistikSektorUsahaTabs } from "@/components/admin/StatistikSektorUsahaTabs";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StatistikSektorUsaha } from "@/lib/data/statistik-sektor-usaha";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Sektor Usaha",
    area: "admin",
    robots: { index: false, follow: false },
  });
}

export default async function AdminStatistikSektorUsahaPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("statistik_sektor_usaha")
    .select("id, jenis, kode, nama, nilai_ribu_rupiah, updated_at, urutan")
    .order("jenis")
    .order("urutan");

  const rows: StatistikSektorUsaha[] = error ? [] : data;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/statistik" className="text-sm text-kopi-600 hover:underline">
          ← Kembali ke Statistik
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-espresso-950">
          Sektor Usaha
        </h1>
        <p className="mt-1 text-sm text-espresso-800/60">
          17 sektor usaha tetap — hanya nilainya yang bisa diedit. Perubahan langsung tampil di
          situs publik.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-tanah-100 px-4 py-3 text-sm text-tanah-500">
          Gagal memuat data sektor usaha.
        </p>
      )}

      {!error && <StatistikSektorUsahaTabs rows={rows} />}
    </div>
  );
}
