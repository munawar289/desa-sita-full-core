import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { StatTable } from "@/components/statistik/StatTable";
import { BarChartRtGrouped } from "@/components/statistik/charts/BarChartRtGrouped";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { EmptyState } from "@/components/shared/EmptyState";
import { getStatistik } from "@/lib/queries/statistik";
import { getStatistikRt } from "@/lib/queries/statistik-rt";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Kesehatan",
    description: (profil) => `Sarana kesehatan dan cakupan air bersih Desa ${profil.nama_desa}.`,
  });
}

export const revalidate = 300;

// Sub-kategori Prodeskel yang masih kosong total di source (PRD §2) —
// ditampilkan sebagai satu EmptyState gabungan, bukan 7 blok kosong terpisah.
const KATEGORI_KOSONG = [
  "Kualitas Ibu Hamil",
  "Kualitas Bayi",
  "Kualitas Persalinan",
  "Cakupan Imunisasi",
  "Keluarga Berencana",
  "Wabah Penyakit",
  "Status Gizi Balita",
];

type BarisAirBersih = { id: string; rt_nama: string; pdam: number; ledeng: number };

export default async function KesehatanPage() {
  const [statistik, statistikRt] = await Promise.all([getStatistik(), getStatistikRt()]);

  const saranaKesehatan = statistik.filter((item) => item.category === "sarana_kesehatan");

  const airBersih = statistikRt.filter((item) => item.category === "air_bersih");
  const adaAirBersih = airBersih.some((item) => item.detail !== null);
  const airBersihRows: BarisAirBersih[] = airBersih.map((item) => ({
    id: item.id,
    rt_nama: item.rt_nama,
    pdam: item.detail?.pdam ?? 0,
    ledeng: item.detail?.ledeng ?? 0,
  }));
  const airBersihChartData = airBersihRows
    .map((row) => ({ label: row.rt_nama, pdam: row.pdam, ledeng: row.ledeng }))
    .sort((a, b) => b.pdam + b.ledeng - (a.pdam + a.ledeng));

  const latestUpdate = [...saranaKesehatan, ...airBersih].sort((a, b) =>
    b.updated_at.localeCompare(a.updated_at),
  )[0]?.updated_at;

  return (
    <>
      <PageHeader
        title="Kesehatan"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Kesehatan" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-text">
            Sarana & Prasarana Kesehatan
          </h2>
          {saranaKesehatan.length > 0 ? (
            <StatCardGrid
              items={saranaKesehatan.map((item) => ({ label: item.label, value: item.value }))}
            />
          ) : (
            <EmptyState icon={<FileQuestion />} message="Data belum tersedia" />
          )}
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-text">
            Cakupan Pemenuhan Air Bersih Menurut RT
          </h2>
          {adaAirBersih ? (
            <>
              <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                <BarChartRtGrouped
                  data={airBersihChartData}
                  series={[
                    { key: "pdam", label: "PDAM", color: "#C1602A" },
                    { key: "ledeng", label: "Air Ledeng", color: "#5B7A41" },
                  ]}
                />
              </div>
              <StatTable<BarisAirBersih>
                columns={[
                  { key: "rt_nama", label: "RT" },
                  { key: "pdam", label: "PDAM", align: "right" },
                  { key: "ledeng", label: "Air Ledeng", align: "right" },
                ]}
                rows={airBersihRows}
              />
              <p className="text-xs text-text-muted">
                Setiap RT tercatat memakai satu sumber air bersih (PDAM atau Air Ledeng), sesuai
                data yang dilaporkan — belum ada RT yang tercatat memakai kedua sumber sekaligus.
              </p>
            </>
          ) : (
            <EmptyState icon={<FileQuestion />} message="Data belum tersedia" />
          )}
        </section>

        <section className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-text">
            Data Kesehatan Lainnya
          </h2>
          <EmptyState
            icon={<FileQuestion />}
            message={`Data belum tersedia: ${KATEGORI_KOSONG.join(", ")}.`}
          />
        </section>

        <DataUpdatedAt updatedAt={latestUpdate} />
      </div>
    </>
  );
}
