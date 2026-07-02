import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { StatTable } from "@/components/statistik/StatTable";
import { BarChartPendidikan } from "@/components/statistik/charts/BarChartPendidikan";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { getStatistikPendidikan } from "@/lib/queries/statistik-pendidikan";

export const metadata: Metadata = {
  title: "Pendidikan — Data Desa Sita",
  description: "Tingkat pendidikan penduduk Desa Sita.",
};

export const revalidate = 300;

export default async function PendidikanPage() {
  const statistikPendidikan = await getStatistikPendidikan();
  const data = [...statistikPendidikan].sort((a, b) => a.urutan - b.urutan);
  const totalPenduduk = data.reduce((sum, item) => sum + item.jumlah, 0);
  const tingkatTerbanyak = data.reduce<(typeof data)[number] | null>(
    (max, item) => (!max || item.jumlah > max.jumlah ? item : max),
    null,
  );

  return (
    <>
      <PageHeader
        title="Pendidikan"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Pendidikan" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        <StatCardGrid
          items={[
            {
              label: "Total Penduduk",
              value: totalPenduduk > 0 ? totalPenduduk.toLocaleString("id-ID") : "—",
            },
            {
              label: "Tingkat Terbanyak",
              value: tingkatTerbanyak?.tingkat ?? "—",
            },
          ]}
        />

        <div className="rounded-xl border border-kakao-200 bg-white p-4 shadow-sm">
          <BarChartPendidikan data={data} />
        </div>

        <StatTable
          columns={[
            { key: "tingkat", label: "Tingkat Pendidikan" },
            { key: "jumlah", label: "Jumlah", align: "right" },
          ]}
          rows={data}
          highlightKey="jumlah"
        />

        <DataUpdatedAt />
      </div>
    </>
  );
}
