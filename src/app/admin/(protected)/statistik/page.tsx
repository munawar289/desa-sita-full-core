import type { Metadata } from "next";
import { AddStatistikForm } from "@/components/admin/AddStatistikForm";
import { StatistikRow } from "@/components/admin/StatistikRow";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Statistik } from "@/lib/data/statistik";

export const metadata: Metadata = {
  title: "Statistik — Admin Desa Sita",
  robots: { index: false, follow: false },
};

function groupByCategory(rows: Statistik[]) {
  const groups = new Map<string, Statistik[]>();
  for (const row of rows) {
    const list = groups.get(row.category) ?? [];
    list.push(row);
    groups.set(row.category, list);
  }
  return groups;
}

export default async function AdminStatistikPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("statistik")
    .select("id, category, key, label, value, updated_at")
    .order("category")
    .order("key");

  const rows = error ? [] : data;
  const grouped = groupByCategory(rows);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-espresso-950">Statistik</h1>
          <p className="mt-1 text-sm text-espresso-800/60">
            Perubahan langsung tampil di situs publik (revalidasi otomatis).
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-tanah-100 px-4 py-3 text-sm text-tanah-500">
          Gagal memuat data statistik.
        </p>
      )}

      {grouped.size === 0 && !error && (
        <p className="text-sm text-espresso-800/60">Belum ada data statistik.</p>
      )}

      {[...grouped.entries()].map(([category, items]) => (
        <section key={category} className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-wider text-sawah-700">
            {category}
          </h2>
          <div className="overflow-hidden rounded-xl border border-kakao-200 bg-white">
            <table className="w-full text-left">
              <thead className="bg-kakao-100">
                <tr>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Label
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Key
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Nilai
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                    Diperbarui
                  </th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <StatistikRow key={`${item.id}:${item.updated_at}`} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <AddStatistikForm defaultCategory={[...grouped.keys()][0]} />
    </div>
  );
}
