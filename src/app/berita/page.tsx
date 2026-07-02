import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { BeritaExplorer } from "@/components/berita/BeritaExplorer";
import { beritaMock } from "@/lib/data/berita";

export const metadata: Metadata = {
  title: "Berita — Desa Sita",
  description: "Berita dan pengumuman terbaru dari Desa Sita.",
};

export default function BeritaPage() {
  return (
    <>
      <PageHeader
        title="Berita"
        breadcrumbItems={[{ label: "Beranda", href: "/" }, { label: "Berita" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <BeritaExplorer data={beritaMock} />
      </div>
    </>
  );
}
