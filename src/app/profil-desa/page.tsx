import Link from "next/link";
import type { Metadata } from "next";
import { History, Map } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Profil Desa — Desa Sita",
  description: "Sejarah, wilayah, dan profil umum Desa Sita.",
};

const subHalaman = [
  {
    href: "/profil-desa/sejarah",
    icon: History,
    judul: "Sejarah",
    deskripsi: "Riwayat berdirinya Desa Sita dan daftar kepala desa dari masa ke masa.",
  },
  {
    href: "/profil-desa/wilayah",
    icon: Map,
    judul: "Wilayah",
    deskripsi: "Batas wilayah, luas lahan, iklim, komoditas, dan peternakan.",
  },
];

export default function ProfilDesaPage() {
  return (
    <>
      <PageHeader
        title="Profil Desa"
        breadcrumbItems={[{ label: "Beranda", href: "/" }, { label: "Profil Desa" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
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
