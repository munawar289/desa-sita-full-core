import type { Metadata } from "next";
import Link from "next/link";
import { StatistikRtRow } from "@/components/admin/StatistikRtRow";
import { DETAIL_FIELDS } from "@/lib/validation/statistik-rt";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { StatistikRt } from "@/lib/data/statistik-rt";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Statistik per-RT",
    area: "admin",
    robots: { index: false, follow: false },
  });
}

const CATEGORY_LABELS: Record<string, string> = {
  penduduk: "Penduduk",
  keluarga: "Keluarga",
  pengangguran: "Pengangguran",
  air_bersih: "Cakupan Air Bersih",
  aset_tanaman: "Aset Tanaman",
};

function groupByCategory(rows: StatistikRt[]) {
  const groups = new Map<string, StatistikRt[]>();
  for (const row of rows) {
    const list = groups.get(row.category) ?? [];
    list.push(row);
    groups.set(row.category, list);
  }
  return groups;
}

export default async function AdminStatistikPerRtPage() {
  const supabase = await createSupabaseServerClient();
  const [{ data: rtData, error: rtError }, { data: factData, error: factError }] =
    await Promise.all([
      supabase.from("wilayah_rt").select("id, nomor, nama, urutan").order("urutan"),
      supabase
        .from("statistik_rt")
        .select("id, category, rt_id, value, detail, updated_at")
        .order("category"),
    ]);

  const error = rtError ?? factError;
  const rtById = new Map((rtData ?? []).map((rt) => [rt.id, rt]));

  const rows: StatistikRt[] = error
    ? []
    : (factData ?? [])
        .map((row) => {
          const rt = rtById.get(row.rt_id);
          if (!rt) return null;
          return {
            id: row.id,
            category: row.category,
            value: row.value,
            detail: row.detail as Record<string, number> | null,
            updated_at: row.updated_at,
            rt_nomor: rt.nomor,
            rt_nama: rt.nama,
            rt_urutan: rt.urutan,
          };
        })
        .filter((row): row is StatistikRt => row !== null)
        .sort((a, b) => a.rt_urutan - b.rt_urutan);

  const grouped = groupByCategory(rows);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/statistik" className="text-sm text-kopi-600 hover:underline">
          ← Kembali ke Statistik
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-espresso-950">
          Statistik per-RT
        </h1>
        <p className="mt-1 text-sm text-espresso-800/60">
          16 RT tetap — hanya nilainya yang bisa diedit. Perubahan langsung tampil di situs
          publik.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-tanah-100 px-4 py-3 text-sm text-tanah-500">
          Gagal memuat data statistik per-RT.
        </p>
      )}

      {[...grouped.entries()].map(([category, items]) => {
        const detailFields = DETAIL_FIELDS[category];
        return (
          <section key={category} className="space-y-3">
            <h2 className="font-mono text-xs uppercase tracking-wider text-sawah-700">
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <div className="overflow-hidden rounded-xl border border-kakao-200 bg-white">
              <table className="w-full text-left">
                <thead className="bg-kakao-100">
                  <tr>
                    <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                      RT
                    </th>
                    {detailFields ? (
                      detailFields.map((field) => (
                        <th
                          key={field.key}
                          className="px-3 py-2 text-right text-xs font-mono uppercase tracking-wider text-sawah-700"
                        >
                          {field.label}
                        </th>
                      ))
                    ) : (
                      <th className="px-3 py-2 text-right text-xs font-mono uppercase tracking-wider text-sawah-700">
                        Nilai
                      </th>
                    )}
                    <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-sawah-700">
                      Diperbarui
                    </th>
                    <th className="px-3 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <StatistikRtRow key={`${item.id}:${item.updated_at}`} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
