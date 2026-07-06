import Link from "next/link";
import type { Metadata } from "next";
import {
  MapPin,
  Users2,
  Home,
  Briefcase,
  HeartHandshake,
  Landmark,
  TrendingUp,
  Wallet,
  Wheat,
  GraduationCap,
  Building,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { IndeksProdeskelWidget, type ProdeskelResult } from "@/components/data-desa/IndeksProdeskelWidget";
import { PRODESKEL_CHECKLIST } from "@/lib/data/prodeskel-checklist";
import { getStatistik } from "@/lib/queries/statistik";
import { getStatistikRt } from "@/lib/queries/statistik-rt";
import { getStatistikSektorUsaha } from "@/lib/queries/statistik-sektor-usaha";
import { getStatistikKelompokUmur } from "@/lib/queries/statistik-kelompok-umur";
import { getStatistikPendidikan } from "@/lib/queries/statistik-pendidikan";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Data Desa",
    description: (profil) => `Statistik dan data terbuka Desa ${profil.nama_desa}.`,
  });
}

export const revalidate = 300;

// Restrukturisasi mengikuti 7 bab Prodeskel (PRD statistik-lanjutan §4.1).
const kelompok = [
  {
    judul: "Kependudukan",
    halaman: [
      {
        href: "/data-desa/kependudukan/penduduk",
        icon: Users2,
        judul: "Penduduk",
        deskripsi: "Jenis kelamin, kelompok umur, dan sebaran per-RT.",
      },
      {
        href: "/data-desa/kependudukan/keluarga",
        icon: Home,
        judul: "Keluarga",
        deskripsi: "Jumlah keluarga menurut RT.",
      },
      {
        href: "/data-desa/kependudukan/pengangguran",
        icon: Briefcase,
        judul: "Pengangguran",
        deskripsi: "Jumlah penduduk menganggur menurut RT.",
      },
    ],
  },
  {
    judul: "Ekonomi",
    halaman: [
      {
        href: "/data-desa/ekonomi/kesejahteraan-keluarga",
        icon: HeartHandshake,
        judul: "Kesejahteraan Keluarga",
        deskripsi: "Tingkat kesejahteraan keluarga menurut BKKBN.",
      },
      {
        href: "/data-desa/ekonomi/mata-pencaharian",
        icon: Landmark,
        judul: "Struktur Mata Pencaharian",
        deskripsi: "Struktur mata pencaharian penduduk menurut sektor.",
      },
      {
        href: "/data-desa/ekonomi/pdb",
        icon: TrendingUp,
        judul: "Produk Domestik Bruto",
        deskripsi: "PDB desa menurut sektor lapangan usaha.",
      },
      {
        href: "/data-desa/ekonomi/pendapatan-riil",
        icon: Wallet,
        judul: "Pendapatan Riil Keluarga",
        deskripsi: "Pendapatan riil keluarga menurut sektor usaha.",
      },
      {
        href: "/data-desa/ekonomi/aset-ekonomi",
        icon: Wheat,
        judul: "Aset Ekonomi",
        deskripsi: "Penguasaan aset tanah, transportasi, produksi, dan perumahan.",
      },
    ],
  },
  {
    judul: "Pendidikan",
    halaman: [
      {
        href: "/data-desa/pendidikan",
        icon: GraduationCap,
        judul: "Pendidikan",
        deskripsi: "Tingkat pendidikan, rasio guru-murid, dan lembaga pendidikan.",
      },
    ],
  },
  {
    judul: "Kesehatan",
    halaman: [
      {
        href: "/data-desa/kesehatan",
        icon: HeartPulse,
        judul: "Kesehatan",
        deskripsi: "Sarana kesehatan dan cakupan air bersih.",
      },
    ],
  },
  {
    judul: "Keamanan & Kelembagaan",
    halaman: [
      {
        href: "/data-desa/keamanan-kelembagaan",
        icon: ShieldCheck,
        judul: "Keamanan & Kelembagaan",
        deskripsi: "Linmas dan lembaga kemasyarakatan desa.",
      },
    ],
  },
  {
    judul: "Wilayah Administratif",
    halaman: [
      {
        href: "/data-desa/wilayah-administratif",
        icon: MapPin,
        judul: "Wilayah Administratif",
        deskripsi: "Data administratif dan kepadatan penduduk.",
      },
    ],
  },
  {
    judul: "Sarana & Prasarana",
    halaman: [
      {
        href: "/data-desa/sarana-prasarana",
        icon: Building,
        judul: "Sarana & Prasarana",
        deskripsi: "Fasilitas umum yang tersedia di desa.",
      },
    ],
  },
];

function KartuHalaman({
  href,
  icon: Icon,
  judul,
  deskripsi,
}: {
  href: string;
  icon: typeof MapPin;
  judul: string;
  deskripsi: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-kakao-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <Icon className="size-8 text-kopi-600" />
      <h3 className="mt-4 font-heading text-lg font-semibold text-espresso-950 group-hover:text-kopi-600">
        {judul}
      </h3>
      <p className="mt-1 text-sm text-espresso-800/70">{deskripsi}</p>
    </Link>
  );
}

export default async function DataDesaPage() {
  const [statistik, statistikRt, statistikSektorUsaha, statistikKelompokUmur, statistikPendidikan] =
    await Promise.all([
      getStatistik(),
      getStatistikRt(),
      getStatistikSektorUsaha(),
      getStatistikKelompokUmur(),
      getStatistikPendidikan(),
    ]);

  const prodeskelResults: ProdeskelResult[] = PRODESKEL_CHECKLIST.map((item) => ({
    nomor: item.nomor,
    bab: item.bab,
    label: item.label,
    tersedia: item.cek({
      statistik,
      statistikRt,
      statistikSektorUsaha,
      statistikKelompokUmur,
      statistikPendidikan,
    }),
  }));

  return (
    <>
      <PageHeader
        title="Data Desa"
        breadcrumbItems={[{ label: "Beranda", href: "/" }, { label: "Data Desa" }]}
      />

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6">
        <IndeksProdeskelWidget results={prodeskelResults} />

        {kelompok.map((grup) => (
          <section key={grup.judul} className="space-y-4">
            <h2 className="font-heading text-xl font-semibold text-espresso-950">{grup.judul}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grup.halaman.map((halaman) => (
                <KartuHalaman key={halaman.href} {...halaman} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
