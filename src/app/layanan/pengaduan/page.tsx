import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { FormPengaduan } from "@/components/pengaduan/FormPengaduan";

export const metadata: Metadata = {
  title: "Form Pengaduan — Desa Sita",
  description: "Sampaikan pengaduan atau masukan Anda untuk Desa Sita.",
};

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
