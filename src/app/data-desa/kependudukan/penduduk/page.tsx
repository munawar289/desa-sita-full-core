import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { StatTable } from "@/components/statistik/StatTable";
import { PieChartGender } from "@/components/statistik/charts/PieChartGender";
import { BarChartKelompokUmur } from "@/components/statistik/charts/BarChartKelompokUmur";
import { BarChartRt } from "@/components/statistik/charts/BarChartRt";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { getStatistik } from "@/lib/queries/statistik";
import { getStatistikKelompokUmur } from "@/lib/queries/statistik-kelompok-umur";
import { getStatistikRt } from "@/lib/queries/statistik-rt";

export const metadata: Metadata = {
  title: "Penduduk — Data Desa Sita",
  description: "Komposisi penduduk Desa Sita menurut jenis kelamin, kelompok umur, dan RT.",
};

export const revalidate = 300;

type BarisGender = { id: string; label: string; jumlah: number };
type BarisRt = { id: string; rt_nama: string; value: number };

export default async function PendudukPage() {
  const [statistik, kelompokUmur, statistikRt] = await Promise.all([
    getStatistik(),
    getStatistikKelompokUmur(),
    getStatistikRt(),
  ]);

  const gender = statistik.filter(
    (item) => item.category === "kependudukan" && ["laki_laki", "perempuan"].includes(item.key),
  );
  const laki = gender.find((item) => item.key === "laki_laki");
  const perempuan = gender.find((item) => item.key === "perempuan");
  const genderRows: BarisGender[] = [
    { id: "laki_laki", label: laki?.label ?? "Laki-laki", jumlah: Number(laki?.value ?? 0) },
    {
      id: "perempuan",
      label: perempuan?.label ?? "Perempuan",
      jumlah: Number(perempuan?.value ?? 0),
    },
  ];
  const genderChartData = genderRows.map((row) => ({ name: row.label, value: row.jumlah }));

  const umurData = [...kelompokUmur].sort((a, b) => a.urutan - b.urutan);
  const totalPenduduk = umurData.reduce((sum, item) => sum + item.jumlah, 0);

  const rtRows: BarisRt[] = statistikRt
    .filter((item) => item.category === "penduduk")
    .map((item) => ({ id: item.id, rt_nama: item.rt_nama, value: item.value ?? 0 }));
  const rtChartData = rtRows.map((row) => ({ label: row.rt_nama, value: row.value }));

  const latestUpdate = [...gender, ...statistikRt.filter((i) => i.category === "penduduk")]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]?.updated_at;

  return (
    <>
      <PageHeader
        title="Penduduk"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Penduduk" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-espresso-950">
            Menurut Jenis Kelamin
          </h2>
          <StatCardGrid
            items={genderRows.map((row) => ({
              label: row.label,
              value: row.jumlah > 0 ? row.jumlah.toLocaleString("id-ID") : "—",
            }))}
          />
          <div className="rounded-xl border border-kakao-200 bg-white p-4 shadow-sm">
            <PieChartGender data={genderChartData} />
          </div>
          <StatTable<BarisGender>
            columns={[
              { key: "label", label: "Jenis Kelamin" },
              { key: "jumlah", label: "Jumlah", align: "right" },
            ]}
            rows={genderRows}
            highlightKey="jumlah"
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-espresso-950">
            Menurut Kelompok Umur
          </h2>
          <StatCardGrid
            items={[
              {
                label: "Total Penduduk",
                value: totalPenduduk > 0 ? totalPenduduk.toLocaleString("id-ID") : "—",
              },
            ]}
          />
          <div className="rounded-xl border border-kakao-200 bg-white p-4 shadow-sm">
            <BarChartKelompokUmur data={umurData} />
          </div>
          <StatTable
            columns={[
              { key: "kelompok_usia", label: "Kelompok Usia" },
              { key: "jumlah", label: "Jumlah", align: "right" },
            ]}
            rows={umurData}
            highlightKey="jumlah"
          />
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-espresso-950">Menurut RT</h2>
          <div className="rounded-xl border border-kakao-200 bg-white p-4 shadow-sm">
            <BarChartRt data={rtChartData} />
          </div>
          <StatTable<BarisRt>
            columns={[
              { key: "rt_nama", label: "RT" },
              { key: "value", label: "Jumlah Penduduk", align: "right" },
            ]}
            rows={rtRows}
            highlightKey="value"
          />
        </section>

        <DataUpdatedAt updatedAt={latestUpdate} />
      </div>
    </>
  );
}
