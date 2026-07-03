import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { StatTable } from "@/components/statistik/StatTable";
import { BarChartStatistik } from "@/components/statistik/charts/BarChartStatistik";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { EmptyState } from "@/components/shared/EmptyState";
import { getStatistik } from "@/lib/queries/statistik";

export const metadata: Metadata = {
  title: "Kesejahteraan Keluarga — Data Desa Sita",
  description: "Jumlah keluarga Desa Sita menurut tingkat kesejahteraan (BKKBN).",
};

export const revalidate = 300;

type Baris = { id: string; label: string; jumlah: number };

export default async function KesejahteraanKeluargaPage() {
  const statistik = await getStatistik();
  const kesejahteraan = statistik.filter((item) => item.category === "kesejahteraan_keluarga");

  const rows: Baris[] = kesejahteraan.map((item) => ({
    id: item.id,
    label: item.label,
    jumlah: Number(item.value),
  }));
  const chartData = rows.map((row) => ({ label: row.label, value: row.jumlah }));
  const totalKeluarga = rows.reduce((sum, row) => sum + row.jumlah, 0);
  const latestUpdate = kesejahteraan.sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]
    ?.updated_at;

  return (
    <>
      <PageHeader
        title="Kesejahteraan Keluarga"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Kesejahteraan Keluarga" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        {rows.length > 0 ? (
          <>
            <StatCardGrid
              items={[
                {
                  label: "Total Keluarga",
                  value: totalKeluarga > 0 ? totalKeluarga.toLocaleString("id-ID") : "—",
                },
              ]}
            />
            <div className="rounded-xl border border-kakao-200 bg-white p-4 shadow-sm">
              <BarChartStatistik data={chartData} />
            </div>
            <StatTable<Baris>
              columns={[
                { key: "label", label: "Tingkat Kesejahteraan" },
                { key: "jumlah", label: "Jumlah", align: "right" },
              ]}
              rows={rows}
              highlightKey="jumlah"
            />
          </>
        ) : (
          <EmptyState icon={<FileQuestion />} message="Data belum tersedia" />
        )}

        <DataUpdatedAt updatedAt={latestUpdate} />
      </div>
    </>
  );
}
