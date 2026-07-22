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
    title: "Struktur Mata Pencaharian",
    description: (profil) =>
      `Struktur mata pencaharian penduduk Desa ${profil.nama_desa} menurut sektor.`,
  });
}

export const revalidate = 300;

type Baris = { id: string; label: string; jumlah: number };

export default async function MataPencaharianPage() {
  const statistik = await getStatistik();
  const mataPencaharian = statistik.filter((item) => item.category === "mata_pencaharian");

  const rows: Baris[] = mataPencaharian.map((item) => ({
    id: item.id,
    label: item.label,
    jumlah: Number(item.value),
  }));
  const chartData = rows.map((row) => ({ label: row.label, value: row.jumlah }));
  const totalPenduduk = rows.reduce((sum, row) => sum + row.jumlah, 0);
  const terbanyak = rows.reduce<Baris | null>(
    (max, row) => (!max || row.jumlah > max.jumlah ? row : max),
    null,
  );
  const latestUpdate = mataPencaharian.sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]
    ?.updated_at;

  return (
    <>
      <PageHeader
        title="Struktur Mata Pencaharian"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Struktur Mata Pencaharian" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        <StatCardGrid
          items={[
            {
              label: "Total Penduduk",
              value: totalPenduduk > 0 ? totalPenduduk.toLocaleString("id-ID") : "—",
            },
            { label: "Terbanyak", value: terbanyak?.label ?? "—" },
          ]}
        />

        <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <BarChartStatistik data={chartData} />
        </div>

        <StatTable<Baris>
          columns={[
            { key: "label", label: "Sektor" },
            { key: "jumlah", label: "Jumlah Penduduk", align: "right" },
          ]}
          rows={rows}
          highlightKey="jumlah"
        />

        <DataUpdatedAt updatedAt={latestUpdate} />
      </div>
    </>
  );
}
