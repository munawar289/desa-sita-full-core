import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { StatTable } from "@/components/statistik/StatTable";
import { BarChartKelompokUmur } from "@/components/statistik/charts/BarChartKelompokUmur";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { statistikKelompokUmurMock } from "@/lib/data/statistik-kelompok-umur";

export const metadata: Metadata = {
  title: "Kelompok Umur — Data Desa Sita",
  description: "Sebaran penduduk Desa Sita menurut kelompok usia.",
};

export default function KelompokUmurPage() {
  const data = [...statistikKelompokUmurMock].sort((a, b) => a.urutan - b.urutan);
  const totalPenduduk = data.reduce((sum, item) => sum + item.jumlah, 0);
  const kelompokTerbanyak = data.reduce<(typeof data)[number] | null>(
    (max, item) => (!max || item.jumlah > max.jumlah ? item : max),
    null,
  );

  return (
    <>
      <PageHeader
        title="Kelompok Umur"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Kelompok Umur" },
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
              label: "Kelompok Usia Terbanyak",
              value: kelompokTerbanyak?.kelompok_usia ?? "—",
            },
          ]}
        />

        <div className="rounded-xl border border-kakao-200 bg-white p-4 shadow-sm">
          <BarChartKelompokUmur data={data} />
        </div>

        <StatTable
          columns={[
            { key: "kelompok_usia", label: "Kelompok Usia" },
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
