import type { Metadata } from "next";
import { Map, LandPlot, Users, Home } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCardGrid } from "@/components/statistik/StatCardGrid";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { statistikMock } from "@/lib/data/statistik";

export const metadata: Metadata = {
  title: "Wilayah Administratif — Data Desa Sita",
  description: "Data administratif dan kepadatan penduduk Desa Sita.",
};

const keys = [
  { key: "luas_wilayah", label: "Luas Wilayah", icon: LandPlot },
  { key: "jumlah_dusun", label: "Jumlah Dusun", icon: Map },
  { key: "jumlah_rt_rw", label: "Jumlah RT/RW", icon: Home },
  { key: "kepadatan_penduduk", label: "Kepadatan Penduduk", icon: Users },
];

export default function WilayahAdministratifPage() {
  const items = keys.map(({ key, label, icon }) => {
    const stat = statistikMock.find(
      (item) => item.category === "wilayah" && item.key === key,
    );
    return { label: stat?.label ?? label, value: stat?.value ?? "—", icon };
  });

  const latestUpdate = statistikMock
    .filter((item) => item.category === "wilayah")
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]?.updated_at;

  return (
    <>
      <PageHeader
        title="Wilayah Administratif"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Wilayah Administratif" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        <StatCardGrid items={items} />
        <DataUpdatedAt updatedAt={latestUpdate} />
      </div>
    </>
  );
}
