import type { Metadata } from "next";
import { AddPotensiForm } from "@/components/admin/AddPotensiForm";
import { PotensiRow } from "@/components/admin/PotensiRow";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Potensi } from "@/lib/data/potensi";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Potensi Desa",
    area: "admin",
    robots: { index: false, follow: false },
  });
}

export default async function AdminPotensiPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("potensi_desa")
    .select("id, judul, deskripsi, icon, urutan")
    .order("urutan");

  const rows: Potensi[] = error ? [] : (data as Potensi[]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-espresso-950">Potensi Desa</h1>
        <p className="mt-1 text-sm text-espresso-800/60">
          Kartu ini tampil di beranda pada section &ldquo;Sumber Penghidupan Warga&rdquo;.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-tanah-100 px-4 py-3 text-sm text-tanah-500">
          Gagal memuat data potensi desa.
        </p>
      )}

      {rows.length === 0 && !error && (
        <p className="text-sm text-espresso-800/60">Belum ada data potensi desa.</p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-kakao-200 bg-white">
          <table className="w-full text-left">
            <thead className="bg-kakao-100">
              <tr>
                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                  Judul
                </th>
                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                  Deskripsi
                </th>
                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                  Ikon
                </th>
                <th className="px-3 py-2 text-center text-xs font-mono uppercase tracking-wider text-sawah-700">
                  Urutan
                </th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <PotensiRow key={item.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddPotensiForm />
    </div>
  );
}
