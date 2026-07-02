import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LembagaExplorer } from "@/components/lembaga/LembagaExplorer";
import { getLembaga } from "@/lib/queries/lembaga";

export const metadata: Metadata = {
  title: "Lembaga Desa — Desa Sita",
  description: "Daftar lembaga kemasyarakatan, ekonomi, pendidikan, dan keamanan Desa Sita.",
};

export const revalidate = 300;

export default async function LembagaDesaPage() {
  const lembaga = await getLembaga();

  return (
    <>
      <PageHeader
        title="Lembaga Desa"
        breadcrumbItems={[{ label: "Beranda", href: "/" }, { label: "Lembaga Desa" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <LembagaExplorer data={lembaga} />
      </div>
    </>
  );
}
