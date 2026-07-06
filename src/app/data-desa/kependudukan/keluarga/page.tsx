import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { StatTable } from "@/components/statistik/StatTable";
import { BarChartRt } from "@/components/statistik/charts/BarChartRt";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { getStatistikRt } from "@/lib/queries/statistik-rt";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Keluarga",
    description: (profil) => `Jumlah keluarga Desa ${profil.nama_desa} menurut RT.`,
  });
}

export const revalidate = 300;

type BarisRt = { id: string; rt_nama: string; value: number };

export default async function KeluargaPage() {
  const statistikRt = await getStatistikRt();
  const keluarga = statistikRt.filter((item) => item.category === "keluarga");

  const rows: BarisRt[] = keluarga.map((item) => ({
    id: item.id,
    rt_nama: item.rt_nama,
    value: item.value ?? 0,
  }));
  const chartData = rows.map((row) => ({ label: row.rt_nama, value: row.value }));
  const totalKeluarga = rows.reduce((sum, row) => sum + row.value, 0);
  const latestUpdate = keluarga.sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]
    ?.updated_at;

  return (
    <>
      <PageHeader
        title="Keluarga"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Keluarga" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        <StatCardGrid
          items={[
            {
              label: "Total Keluarga",
              value: totalKeluarga > 0 ? totalKeluarga.toLocaleString("id-ID") : "—",
            },
          ]}
        />

        <div className="rounded-xl border border-kakao-200 bg-white p-4 shadow-sm">
          <BarChartRt data={chartData} />
        </div>

        <StatTable<BarisRt>
          columns={[
            { key: "rt_nama", label: "RT" },
            { key: "value", label: "Jumlah Keluarga", align: "right" },
          ]}
          rows={rows}
          highlightKey="value"
        />

        <DataUpdatedAt updatedAt={latestUpdate} />
      </div>
    </>
  );
}
