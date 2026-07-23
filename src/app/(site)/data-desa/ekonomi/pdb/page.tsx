import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { StatTable } from "@/components/statistik/StatTable";
import { BarChartRt } from "@/components/statistik/charts/BarChartRt";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { EmptyState } from "@/components/shared/EmptyState";
import { getStatistikSektorUsaha } from "@/lib/queries/statistik-sektor-usaha";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Produk Domestik Bruto",
    description: (profil) =>
      `Produk Domestik Bruto Desa ${profil.nama_desa} menurut sektor lapangan usaha.`,
  });
}

export const revalidate = 300;

type Baris = { id: string; nama: string; nilai: number };

export default async function PdbPage() {
  const sektorUsaha = await getStatistikSektorUsaha();
  const pdb = sektorUsaha.filter((item) => item.jenis === "pdb");
  const adaData = pdb.some((item) => item.nilai_ribu_rupiah !== null);

  const rows: Baris[] = pdb.map((item) => ({
    id: item.id,
    nama: item.nama,
    nilai: item.nilai_ribu_rupiah ?? 0,
  }));
  const chartData = rows.map((row) => ({ label: row.nama, value: row.nilai }));
  const totalPdb = rows.reduce((sum, row) => sum + row.nilai, 0);
  const latestUpdate = pdb.sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]
    ?.updated_at;

  return (
    <>
      <PageHeader
        title="Produk Domestik Bruto"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Produk Domestik Bruto" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        {adaData ? (
          <>
            <StatCardGrid
              items={[
                {
                  label: "Total PDB",
                  value: `Rp ${totalPdb.toLocaleString("id-ID")} ribu`,
                },
              ]}
            />
            <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
              <BarChartRt data={chartData} />
            </div>
            <StatTable<Baris>
              columns={[
                { key: "nama", label: "Sektor Usaha" },
                { key: "nilai", label: "Nilai (Ribu Rupiah)", align: "right" },
              ]}
              rows={rows}
              highlightKey="nilai"
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
