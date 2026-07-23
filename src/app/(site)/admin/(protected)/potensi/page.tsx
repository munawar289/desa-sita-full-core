import type { Metadata } from "next";
import { AddPotensiForm } from "@/components/admin/AddPotensiForm";
import { PotensiRow } from "@/components/admin/PotensiRow";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";
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
  const tenant = await getCurrentTenant();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("potensi_desa")
    .select("id, judul, deskripsi, icon, urutan")
    .eq("tenant_id", tenant.id)
    .order("urutan");

  const rows: Potensi[] = error ? [] : (data as Potensi[]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-text">Potensi Desa</h1>
        <p className="mt-1 text-sm text-text-muted">
          Kartu ini tampil di beranda pada section &ldquo;Sumber Penghidupan Warga&rdquo;.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-on-danger-soft">
          Gagal memuat data potensi desa.
        </p>
      )}

      {rows.length === 0 && !error && (
        <p className="text-sm text-text-muted">Belum ada data potensi desa.</p>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full text-left">
            <thead className="bg-surface-alt">
              <tr>
                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                  Judul
                </th>
                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                  Deskripsi
                </th>
                <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                  Ikon
                </th>
                <th className="px-3 py-2 text-center text-xs font-mono uppercase tracking-wider text-text-muted">
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
