import type { Metadata } from "next";
import { AddLembagaForm } from "@/components/admin/AddLembagaForm";
import { LembagaRow } from "@/components/admin/LembagaRow";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Lembaga } from "@/lib/data/lembaga";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Lembaga Desa",
    area: "admin",
    robots: { index: false, follow: false },
  });
}

function groupByKategori(rows: Lembaga[]) {
  const groups = new Map<string, Lembaga[]>();
  for (const row of rows) {
    const list = groups.get(row.kategori) ?? [];
    list.push(row);
    groups.set(row.kategori, list);
  }
  return groups;
}

export default async function AdminLembagaPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("lembaga")
    .select("id, kategori, nama, dasar_hukum, jumlah_pengurus, keterangan, urutan")
    .order("kategori")
    .order("urutan");

  // kolom `kategori` di database.types.ts bertipe string generik; nilainya
  // dibatasi ke 4 kategori oleh zod di createLembagaAction/updateLembagaAction.
  const rows: Lembaga[] = error ? [] : (data as Lembaga[]);
  const grouped = groupByKategori(rows);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-text">Lembaga Desa</h1>
        <p className="mt-1 text-sm text-text-muted">
          Perubahan langsung tampil di halaman publik /lembaga-desa.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-on-danger-soft">
          Gagal memuat data lembaga.
        </p>
      )}

      {grouped.size === 0 && !error && (
        <p className="text-sm text-text-muted">Belum ada data lembaga.</p>
      )}

      {[...grouped.entries()].map(([kategori, items]) => (
        <section key={kategori} className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-muted">{kategori}</h2>
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                    Nama
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                    Dasar Hukum
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-mono uppercase tracking-wider text-text-muted">
                    Pengurus
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                    Keterangan
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-mono uppercase tracking-wider text-text-muted">
                    Urutan
                  </th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <LembagaRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <AddLembagaForm defaultKategori={[...grouped.keys()][0] as Lembaga["kategori"] | undefined} />
    </div>
  );
}
