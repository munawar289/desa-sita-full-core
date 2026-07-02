import Link from "next/link";
import { Sprout, Trees, Beef } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const potensi = [
  {
    icon: Sprout,
    judul: "Pertanian",
    deskripsi: "Lahan pertanian warga menghasilkan berbagai komoditas pangan unggulan desa.",
  },
  {
    icon: Trees,
    judul: "Perkebunan",
    deskripsi: "Komoditas perkebunan menjadi salah satu sumber penghidupan utama masyarakat.",
  },
  {
    icon: Beef,
    judul: "Peternakan",
    deskripsi: "Peternakan warga turut menopang ekonomi rumah tangga di Desa Sita.",
  },
];

export function PotensSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionHeader
        eyebrow="Potensi Desa"
        title="Sumber Penghidupan Warga Desa Sita"
        align="center"
        className="mx-auto"
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {potensi.map(({ icon: Icon, judul, deskripsi }) => (
          <div
            key={judul}
            className="rounded-xl bg-kopi-100 p-6 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <Icon className="size-10 text-kopi-600" />
            <h3 className="mt-4 font-heading text-xl font-semibold text-espresso-950">
              {judul}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-espresso-800/70">
              {deskripsi}
            </p>
            <Link
              href="/profil-desa/wilayah"
              className="mt-4 inline-block text-sm font-semibold text-kopi-600 transition-all duration-200 hover:text-kopi-400"
            >
              Lihat Detail &rarr;
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
