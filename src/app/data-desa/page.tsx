import Link from "next/link";
import type { Metadata } from "next";
import { MapPin, Users2, CalendarRange, GraduationCap, Building } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Data Desa — Desa Sita",
  description: "Statistik dan data terbuka Desa Sita.",
};

const subHalaman = [
  {
    href: "/data-desa/wilayah-administratif",
    icon: MapPin,
    judul: "Wilayah Administratif",
    deskripsi: "Data administratif dan kepadatan penduduk.",
  },
  {
    href: "/data-desa/jenis-kelamin",
    icon: Users2,
    judul: "Jenis Kelamin",
    deskripsi: "Komposisi penduduk laki-laki dan perempuan.",
  },
  {
    href: "/data-desa/kelompok-umur",
    icon: CalendarRange,
    judul: "Kelompok Umur",
    deskripsi: "Sebaran penduduk menurut kelompok usia.",
  },
  {
    href: "/data-desa/pendidikan",
    icon: GraduationCap,
    judul: "Pendidikan",
    deskripsi: "Tingkat pendidikan penduduk Desa Sita.",
  },
  {
    href: "/data-desa/sarana-prasarana",
    icon: Building,
    judul: "Sarana & Prasarana",
    deskripsi: "Fasilitas umum yang tersedia di desa.",
  },
];

export default function DataDesaPage() {
  return (
    <>
      <PageHeader
        title="Data Desa"
        breadcrumbItems={[{ label: "Beranda", href: "/" }, { label: "Data Desa" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subHalaman.map(({ href, icon: Icon, judul, deskripsi }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl border border-kakao-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Icon className="size-8 text-kopi-600" />
              <h2 className="mt-4 font-heading text-lg font-semibold text-espresso-950 group-hover:text-kopi-600">
                {judul}
              </h2>
              <p className="mt-1 text-sm text-espresso-800/70">{deskripsi}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
