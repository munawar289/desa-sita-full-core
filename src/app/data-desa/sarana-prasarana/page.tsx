import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CardSaranaPrasarana } from "@/components/statistik/charts/CardSaranaPrasarana";
import { DataUpdatedAt } from "@/components/shared/DataUpdatedAt";
import { EmptyState } from "@/components/shared/EmptyState";
import { getSaranaPrasarana } from "@/lib/queries/sarana-prasarana";

export const metadata: Metadata = {
  title: "Sarana & Prasarana — Data Desa Sita",
  description: "Fasilitas umum yang tersedia di Desa Sita.",
};

export const revalidate = 300;

export default async function SaranaPrasaranaPage() {
  const saranaPrasarana = await getSaranaPrasarana();

  return (
    <>
      <PageHeader
        title="Sarana & Prasarana"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Data Desa", href: "/data-desa" },
          { label: "Sarana & Prasarana" },
        ]}
      />

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        {saranaPrasarana.length > 0 ? (
          <CardSaranaPrasarana data={saranaPrasarana} />
        ) : (
          <EmptyState icon={<FileQuestion />} message="Belum ada data tersedia" />
        )}
        <DataUpdatedAt />
      </div>
    </>
  );
}
