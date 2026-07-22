import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { StatTable } from "@/components/statistik/StatTable";
import { BarChartStatistik } from "@/components/statistik/charts/BarChartStatistik";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { getStatistik } from "@/lib/queries/statistik";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Keamanan & Kelembagaan",
    description: (profil) =>
      `Keamanan, ketertiban, dan lembaga kemasyarakatan Desa ${profil.nama_desa}.`,
  });
}

export const revalidate = 300;

type Baris = { id: string; label: string; jumlah: number };

export default async function KeamananKelembagaanPage() {
  const statistik = await getStatistik();

  const keamanan = statistik.filter((item) => item.category === "keamanan");
  const lembaga = statistik.filter((item) => item.category === "lembaga_kemasyarakatan");

  const lembagaRows: Baris[] = lembaga.map((item) => ({
    id: item.id,
    label: item.label,
    jumlah: Number(item.value),
  }));
  const lembagaChartData = lembagaRows.map((row) => ({ label: row.label, value: row.jumlah }));

  const latestUpdate = [...keamanan, ...lembaga].sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at),
  )[0]?.updated_at;

  return (
    <>
      <PageHeader
        title="Keamanan & Kelembagaan"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Keamanan & Kelembagaan" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-text">
            Keamanan & Ketertiban
          </h2>
          <StatCardGrid
            items={keamanan.map((item) => ({ label: item.label, value: item.value }))}
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-text">
            Lembaga Kemasyarakatan
          </h2>
          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            <BarChartStatistik data={lembagaChartData} />
          </div>
          <StatTable<Baris>
            columns={[
              { key: "label", label: "Lembaga" },
              { key: "jumlah", label: "Jumlah", align: "right" },
            ]}
            rows={lembagaRows}
            highlightKey="jumlah"
          />
        </section>

        <DataUpdatedAt updatedAt={latestUpdate} />
      </div>
    </>
  );
}
