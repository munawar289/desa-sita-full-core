import type { Metadata } from "next";
import { Mail, FileBarChart, FileSpreadsheet, Gauge } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BadgeKategori } from "@/components/shared/BadgeKategori";

export const metadata: Metadata = {
  title: "Rencana Pengembangan — Desa Sita",
  description: "Layanan dan fitur yang sedang direncanakan untuk Desa Sita.",
};

const rencana = [
  {
    icon: Mail,
    nama: "Layanan Surat Online",
    deskripsi: "Pengajuan surat keterangan desa secara daring tanpa perlu datang langsung.",
  },
  {
    icon: FileBarChart,
    nama: "RPJM / RKP",
    deskripsi: "Dokumen Rencana Pembangunan Jangka Menengah dan Rencana Kerja Pemerintah Desa.",
  },
  {
    icon: FileSpreadsheet,
    nama: "LPPD",
    deskripsi: "Laporan Penyelenggaraan Pemerintahan Desa yang dapat diakses publik.",
  },
  {
    icon: Gauge,
    nama: "IDM",
    deskripsi: "Indeks Desa Membangun sebagai indikator perkembangan Desa Sita.",
  },
];

export default function RencanaPengembanganPage() {
  return (
    <>
      <PageHeader
        title="Rencana Pengembangan"
        breadcrumbItems={[{ label: "Beranda", href: "/" }, { label: "Rencana Pengembangan" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rencana.map(({ icon: Icon, nama, deskripsi }) => (
            <div
              key={nama}
              className="rounded-xl border border-kakao-200 bg-white p-5 shadow-sm"
            >
              <Icon className="size-8 text-kopi-600" />
              <h2 className="mt-3 font-heading text-base font-semibold text-espresso-950">
                {nama}
              </h2>
              <p className="mt-1 text-sm text-espresso-800/70">{deskripsi}</p>
              <BadgeKategori label="Segera Hadir" tone="tanah" className="mt-3" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
