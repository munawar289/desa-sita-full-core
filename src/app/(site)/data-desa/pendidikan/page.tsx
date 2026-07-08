import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { StatTable } from "@/components/statistik/StatTable";
import { BarChartPendidikan } from "@/components/statistik/charts/BarChartPendidikan";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { EmptyState } from "@/components/shared/EmptyState";
import { getStatistikPendidikan } from "@/lib/queries/statistik-pendidikan";
import { getStatistik } from "@/lib/queries/statistik";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Pendidikan",
    description: (profil) =>
      `Tingkat pendidikan, rasio guru-murid, dan lembaga pendidikan Desa ${profil.nama_desa}.`,
  });
}

export const revalidate = 300;

const JENJANG: { key: string; label: string }[] = [
  { key: "paud", label: "PAUD" },
  { key: "tk", label: "TK" },
  { key: "sd", label: "SD" },
  { key: "smp", label: "SMP" },
  { key: "sma", label: "SMA" },
  { key: "smk", label: "SMK" },
  { key: "pt", label: "Perguruan Tinggi" },
];

type BarisLembaga = { id: string; jenjang: string; negeri: string; swasta: string };

export default async function PendidikanPage() {
  const [statistikPendidikan, statistik] = await Promise.all([
    getStatistikPendidikan(),
    getStatistik(),
  ]);

  const data = [...statistikPendidikan].sort((a, b) => a.urutan - b.urutan);
  const totalPenduduk = data.reduce((sum, item) => sum + item.jumlah, 0);
  const tingkatTerbanyak = data.reduce<(typeof data)[number] | null>(
    (max, item) => (!max || item.jumlah > max.jumlah ? item : max),
    null,
  );

  const guru = statistik.find(
    (item) => item.category === "rasio_guru_murid" && item.key === "guru",
  );
  const murid = statistik.find(
    (item) => item.category === "rasio_guru_murid" && item.key === "murid",
  );

  const negeri = statistik.filter((item) => item.category === "lembaga_pendidikan_negeri");
  const swasta = statistik.filter((item) => item.category === "lembaga_pendidikan_swasta");
  const lembagaRows: BarisLembaga[] = JENJANG.filter(
    (j) =>
      negeri.some((item) => item.key === j.key) || swasta.some((item) => item.key === j.key),
  ).map((j) => ({
    id: j.key,
    jenjang: j.label,
    negeri: negeri.find((item) => item.key === j.key)?.value ?? "—",
    swasta: swasta.find((item) => item.key === j.key)?.value ?? "—",
  }));

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

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-espresso-950">
            Tingkat Pendidikan
          </h2>
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
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-espresso-950">
            Rasio Guru dan Murid
          </h2>
          <StatCardGrid
            items={[
              { label: "Guru", value: guru?.value ?? "—" },
              { label: "Murid", value: murid?.value ?? "—" },
            ]}
          />
          {!murid && (
            <p className="text-xs text-espresso-800/50">
              Jumlah murid belum tersedia — rasio belum bisa dihitung.
            </p>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-espresso-950">
            Kelembagaan Pendidikan
          </h2>
          {lembagaRows.length > 0 ? (
            <StatTable<BarisLembaga>
              columns={[
                { key: "jenjang", label: "Jenjang" },
                { key: "negeri", label: "Negeri", align: "right" },
                { key: "swasta", label: "Swasta", align: "right" },
              ]}
              rows={lembagaRows}
            />
          ) : (
            <EmptyState icon={<FileQuestion />} message="Data belum tersedia" />
          )}
        </section>

        <DataUpdatedAt />
      </div>
    </>
  );
}
