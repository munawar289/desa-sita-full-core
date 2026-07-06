import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormPengaduan } from "@/components/pengaduan/FormPengaduan";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Form Pengaduan",
    description: (profil) => `Sampaikan pengaduan atau masukan Anda untuk Desa ${profil.nama_desa}.`,
  });
}

export default function PengaduanPage() {
  return (
    <>
      <PageHeader
        title="Form Pengaduan"
        breadcrumbItems={[
          { label: "Beranda", href: "/" },
          { label: "Layanan", href: "/layanan" },
          { label: "Form Pengaduan" },
        ]}
      />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <FormPengaduan />
      </div>
    </>
  );
}
