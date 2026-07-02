import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { StatTable } from "@/components/statistik/StatTable";
import { PieChartGender } from "@/components/statistik/charts/PieChartGender";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { getStatistik } from "@/lib/queries/statistik";

export const metadata: Metadata = {
  title: "Jenis Kelamin — Data Desa Sita",
  description: "Komposisi penduduk Desa Sita menurut jenis kelamin.",
};

export const revalidate = 300;

type BarisGender = { id: string; label: string; jumlah: number };

export default async function JenisKelaminPage() {
  const statistik = await getStatistik();
  const gender = statistik.filter(
    (item) => item.category === "kependudukan" && ["laki_laki", "perempuan"].includes(item.key),
  );

  const laki = gender.find((item) => item.key === "laki_laki");
  const perempuan = gender.find((item) => item.key === "perempuan");

  const rows: BarisGender[] = [
    { id: "laki_laki", label: laki?.label ?? "Laki-laki", jumlah: Number(laki?.value ?? 0) },
    {
      id: "perempuan",
      label: perempuan?.label ?? "Perempuan",
      jumlah: Number(perempuan?.value ?? 0),
    },
  ];

  const chartData = rows.map((row) => ({ name: row.label, value: row.jumlah }));
  const latestUpdate = gender.sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]
    ?.updated_at;

  return (
    <>
      <PageHeader
        title="Jenis Kelamin"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Jenis Kelamin" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        <StatCardGrid
          items={rows.map((row) => ({
            label: row.label,
            value: row.jumlah > 0 ? row.jumlah.toLocaleString("id-ID") : "—",
          }))}
        />

        <div className="rounded-xl border border-kakao-200 bg-white p-4 shadow-sm">
          <PieChartGender data={chartData} />
        </div>

        <StatTable<BarisGender>
          columns={[
            { key: "label", label: "Jenis Kelamin" },
            { key: "jumlah", label: "Jumlah", align: "right" },
          ]}
          rows={rows}
          highlightKey="jumlah"
        />

        <DataUpdatedAt updatedAt={latestUpdate} />
      </div>
    </>
  );
}
