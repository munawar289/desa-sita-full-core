import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { EmptyState } from "@/components/shared/EmptyState";
import { getStatistik } from "@/lib/queries/statistik";
import { getStatistikRt } from "@/lib/queries/statistik-rt";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Aset Ekonomi",
    description: (profil) => `Penguasaan aset ekonomi masyarakat Desa ${profil.nama_desa}.`,
  });
}

export const revalidate = 300;

const ASET_CATEGORIES = ["aset_tanah", "aset_transportasi", "aset_sarana_produksi", "aset_perumahan"];

export default async function AsetEkonomiPage() {
  const [statistik, statistikRt] = await Promise.all([getStatistik(), getStatistikRt()]);

  const asetEkonomi = statistik.filter((item) => ASET_CATEGORIES.includes(item.category));
  const asetTanaman = statistikRt.filter((item) => item.category === "aset_tanaman");
  const adaDataTanaman = asetTanaman.some((item) => item.detail !== null);

  const latestUpdate = asetEkonomi.sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]
    ?.updated_at;

  return (
    <>
      <PageHeader
        title="Aset Ekonomi"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Aset Ekonomi" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-espresso-950">
            Penguasaan Aset
          </h2>
          <StatCardGrid
            items={asetEkonomi.map((item) => ({ label: item.label, value: item.value }))}
          />
          <p className="text-xs text-espresso-800/50">
            Baris Aset Transportasi Umum dan Aset Sarana Produksi masih berupa angka desa-wide
            dari source data (belum dipecah per jenis aset) — menunggu klarifikasi pemerintah
            desa.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-espresso-950">
            Aset Tanaman Menurut RT
          </h2>
          {adaDataTanaman ? (
            <p className="text-sm text-espresso-800/70">Data tersedia — lihat tabel di atas.</p>
          ) : (
            <EmptyState icon={<FileQuestion />} message="Data belum tersedia" />
          )}
        </section>

        <DataUpdatedAt updatedAt={latestUpdate} />
      </div>
    </>
  );
}
