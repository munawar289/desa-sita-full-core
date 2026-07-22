import type { Metadata } from "next";
import { AddWilayahInfoForm } from "@/components/admin/AddWilayahInfoForm";
import { WilayahInfoCard } from "@/components/admin/WilayahInfoCard";
import { EmptyWilayahInfoCard } from "@/components/admin/EmptyWilayahInfoCard";
import { AddKomoditasForm } from "@/components/admin/AddKomoditasForm";
import { KomoditasRow } from "@/components/admin/KomoditasRow";
import { AddPeternakanForm } from "@/components/admin/AddPeternakanForm";
import { PeternakanRow } from "@/components/admin/PeternakanRow";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WilayahInfo } from "@/lib/data/wilayah-info";
import { WILAYAH_INFO_PRESETS } from "@/lib/data/wilayah-info-sections";
import type { Komoditas } from "@/lib/data/komoditas";
import type { Peternakan } from "@/lib/data/peternakan";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Profil Desa & Wilayah",
    area: "admin",
    robots: { index: false, follow: false },
  });
}

export default async function AdminWilayahPage() {
  const supabase = await createSupabaseServerClient();
  const [wilayahInfoResult, komoditasResult, peternakanResult] = await Promise.all([
    supabase
      .from("wilayah_info")
      .select("id, section, konten, page, judul, eyebrow, urutan, updated_at")
      .order("section"),
    supabase.from("komoditas").select("id, nama, luas_ha, hasil_panen, urutan").order("urutan"),
    supabase
      .from("peternakan")
      .select("id, jenis_ternak, populasi, jumlah_pemilik, urutan")
      .order("urutan"),
  ]);

  const wilayahInfo: WilayahInfo[] = wilayahInfoResult.error
    ? []
    : wilayahInfoResult.data.map((row) => ({ ...row, page: row.page as WilayahInfo["page"] }));
  const komoditas: Komoditas[] = komoditasResult.error ? [] : komoditasResult.data;
  const peternakan: Peternakan[] = peternakanResult.error ? [] : peternakanResult.data;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-text">
          Profil Desa & Wilayah
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Perubahan langsung tampil di /profil-desa/sejarah dan /profil-desa/wilayah.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wider text-text-muted">
          Info Naratif (Sejarah, Batas Wilayah, Iklim, dst)
        </h2>
        {wilayahInfoResult.error ? (
          <p className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-on-danger-soft">
            Gagal memuat data info wilayah.
          </p>
        ) : (
          <div className="space-y-3">
            {WILAYAH_INFO_PRESETS.map((preset) => {
              const item = wilayahInfo.find((row) => row.section === preset.key);
              return item ? (
                <WilayahInfoCard key={preset.key} item={item} />
              ) : (
                <EmptyWilayahInfoCard key={preset.key} preset={preset} />
              );
            })}
            {wilayahInfo
              .filter((row) => !WILAYAH_INFO_PRESETS.some((s) => s.key === row.section))
              .map((item) => (
                <WilayahInfoCard key={item.id} item={item} />
              ))}
          </div>
        )}
        <AddWilayahInfoForm />
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wider text-text-muted">Komoditas</h2>
        {komoditasResult.error ? (
          <p className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-on-danger-soft">
            Gagal memuat data komoditas.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                    Nama
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-mono uppercase tracking-wider text-text-muted">
                    Luas (Ha)
                  </th>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                    Hasil Panen
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-mono uppercase tracking-wider text-text-muted">
                    Urutan
                  </th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {komoditas.map((item) => (
                  <KomoditasRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AddKomoditasForm />
      </section>

      <section className="space-y-3">
        <h2 className="font-mono text-xs uppercase tracking-wider text-text-muted">Peternakan</h2>
        {peternakanResult.error ? (
          <p className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-on-danger-soft">
            Gagal memuat data peternakan.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-3 py-2 text-xs font-mono uppercase tracking-wider text-text-muted">
                    Jenis Ternak
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-mono uppercase tracking-wider text-text-muted">
                    Populasi
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-mono uppercase tracking-wider text-text-muted">
                    Jumlah Pemilik
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-mono uppercase tracking-wider text-text-muted">
                    Urutan
                  </th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {peternakan.map((item) => (
                  <PeternakanRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AddPeternakanForm />
      </section>
    </div>
  );
}
