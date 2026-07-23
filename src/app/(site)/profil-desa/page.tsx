import Link from "next/link";
import type { Metadata } from "next";
import { History, Map } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Profil Desa",
    description: (profil) => `Sejarah, wilayah, dan profil umum Desa ${profil.nama_desa}.`,
  });
}

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
              className="group rounded-xl border border-border bg-surface p-6 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Icon className="size-8 text-primary" aria-hidden />
              <h2 className="mt-4 font-heading text-lg font-semibold text-text group-hover:text-link">
                {judul}
              </h2>
              <p className="mt-1 text-sm text-text-muted">{deskripsi}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
