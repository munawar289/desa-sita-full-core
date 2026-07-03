import type { Metadata } from "next";
import Link from "next/link";
import { StatistikGroupedList } from "@/components/admin/StatistikGroupedList";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Statistik } from "@/lib/data/statistik";

export const metadata: Metadata = {
  title: "Statistik — Admin Desa Sita",
  robots: { index: false, follow: false },
};

export default async function AdminStatistikPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("statistik")
    .select("id, category, key, label, value, updated_at")
    .order("category")
    .order("key");

  const rows: Statistik[] = error ? [] : data;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-espresso-950">Statistik</h1>
          <p className="mt-1 text-sm text-espresso-800/60">
            Perubahan langsung tampil di situs publik (revalidasi otomatis).
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link
            href="/admin/statistik/per-rt"
            className="rounded-full border border-kakao-200 px-4 py-2 font-medium text-kopi-600 transition-colors duration-200 hover:bg-kopi-100/50"
          >
            Statistik per-RT
          </Link>
          <Link
            href="/admin/statistik/sektor-usaha"
            className="rounded-full border border-kakao-200 px-4 py-2 font-medium text-kopi-600 transition-colors duration-200 hover:bg-kopi-100/50"
          >
            Sektor Usaha
          </Link>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-tanah-100 px-4 py-3 text-sm text-tanah-500">
          Gagal memuat data statistik.
        </p>
      )}

      {!error && rows.length === 0 && (
        <p className="text-sm text-espresso-800/60">Belum ada data statistik.</p>
      )}

      {!error && rows.length > 0 && <StatistikGroupedList rows={rows} />}
    </div>
  );
}
