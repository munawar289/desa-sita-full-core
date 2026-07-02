import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { BeritaExplorer } from "@/components/berita/BeritaExplorer";
import { getBerita } from "@/lib/queries/berita";

export const metadata: Metadata = {
  title: "Berita — Desa Sita",
  description: "Berita dan pengumuman terbaru dari Desa Sita.",
};

export const revalidate = 300;

export default async function BeritaPage() {
  const berita = await getBerita();

  return (
    <>
      <PageHeader
        title="Berita"
        breadcrumbItems={[{ label: "Beranda", href: "/" }, { label: "Berita" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <BeritaExplorer data={berita} />
      </div>
    </>
  );
}
