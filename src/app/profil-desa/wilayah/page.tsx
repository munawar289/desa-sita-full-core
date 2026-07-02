import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatTable } from "@/components/statistik/StatTable";
import { getWilayahInfo } from "@/lib/queries/wilayah-info";
import { getKomoditas } from "@/lib/queries/komoditas";
import { getPeternakan } from "@/lib/queries/peternakan";

export const metadata: Metadata = {
  title: "Wilayah — Desa Sita",
  description: "Batas wilayah, iklim, komoditas, dan peternakan Desa Sita.",
};

export const revalidate = 300;

export default async function WilayahPage() {
  const [wilayahInfo, komoditasData, peternakanData] = await Promise.all([
    getWilayahInfo(),
    getKomoditas(),
    getPeternakan(),
  ]);

  const batasWilayah = wilayahInfo.find((item) => item.section === "batas_wilayah");
  const iklim = wilayahInfo.find((item) => item.section === "iklim");
  const komoditas = [...komoditasData].sort((a, b) => a.urutan - b.urutan);
  const peternakan = [...peternakanData].sort((a, b) => a.urutan - b.urutan);

  return (
    <>
      <PageHeader
        title="Wilayah"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Profil Desa", href: "/profil-desa" },
          { label: "Wilayah" },
        ]}
      />

      <div className="mx-auto max-w-4xl space-y-16 px-4 py-12 sm:px-6">
        <section>
          <SectionHeader eyebrow="Geografi" title="Batas Wilayah" />
          <div className="prose prose-stone mt-6 max-w-none text-espresso-800">
            <p>
              {batasWilayah?.konten ??
                "Informasi batas wilayah akan ditampilkan di sini setelah data tersedia."}
            </p>
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Cuaca" title="Iklim" />
          <div className="prose prose-stone mt-6 max-w-none text-espresso-800">
            <p>
              {iklim?.konten ??
                "Informasi iklim akan ditampilkan di sini setelah data tersedia."}
            </p>
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Pertanian & Perkebunan" title="Komoditas" />
          <div className="mt-6">
            {komoditas.length === 0 ? (
              <EmptyState icon={<FileQuestion />} message="Belum ada data tersedia" />
            ) : (
              <StatTable
                columns={[
                  { key: "nama", label: "Komoditas" },
                  { key: "luas_ha", label: "Luas (Ha)", align: "right" },
                  { key: "hasil_panen", label: "Hasil Panen" },
                ]}
                rows={komoditas}
                highlightKey="luas_ha"
              />
            )}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Peternakan" title="Populasi Ternak" />
          <div className="mt-6">
            {peternakan.length === 0 ? (
              <EmptyState icon={<FileQuestion />} message="Belum ada data tersedia" />
            ) : (
              <StatTable
                columns={[
                  { key: "jenis_ternak", label: "Jenis Ternak" },
                  { key: "populasi", label: "Populasi", align: "right" },
                  { key: "jumlah_pemilik", label: "Jumlah Pemilik", align: "right" },
                ]}
                rows={peternakan}
                highlightKey="populasi"
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
