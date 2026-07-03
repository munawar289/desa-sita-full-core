import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatTable } from "@/components/statistik/StatTable";
import { BarChartRt } from "@/components/statistik/charts/BarChartRt";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { EmptyState } from "@/components/shared/EmptyState";
import { getStatistikRt } from "@/lib/queries/statistik-rt";

export const metadata: Metadata = {
  title: "Pengangguran — Data Desa Sita",
  description: "Jumlah penduduk menganggur Desa Sita menurut RT.",
};

export const revalidate = 300;

type BarisRt = { id: string; rt_nama: string; value: number };

export default async function PengangguranPage() {
  const statistikRt = await getStatistikRt();
  const pengangguran = statistikRt.filter((item) => item.category === "pengangguran");
  const adaData = pengangguran.some((item) => item.value !== null);

  const rows: BarisRt[] = pengangguran.map((item) => ({
    id: item.id,
    rt_nama: item.rt_nama,
    value: item.value ?? 0,
  }));
  const chartData = rows.map((row) => ({ label: row.rt_nama, value: row.value }));
  const latestUpdate = pengangguran.sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]
    ?.updated_at;

  return (
    <>
      <PageHeader
        title="Pengangguran"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Pengangguran" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        {adaData ? (
          <>
            <div className="rounded-xl border border-kakao-200 bg-white p-4 shadow-sm">
              <BarChartRt data={chartData} />
            </div>
            <StatTable<BarisRt>
              columns={[
                { key: "rt_nama", label: "RT" },
                { key: "value", label: "Jumlah Menganggur", align: "right" },
              ]}
              rows={rows}
              highlightKey="value"
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
