import Link from "next/link";
import { ArrowRight, Sprout, Trees, Beef } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getDesaProfil } from "@/lib/queries/desa-profil";

export async function PotensSection() {
  const profil = await getDesaProfil();
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
      deskripsi: `Peternakan warga turut menopang ekonomi rumah tangga di Desa ${profil.nama_desa}.`,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeader
        eyebrow="Potensi Desa"
        title={`Sumber Penghidupan Warga Desa ${profil.nama_desa}`}
        align="center"
        className="mx-auto"
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {potensi.map(({ icon: Icon, judul, deskripsi }) => (
          <div
            key={judul}
            className="group relative overflow-hidden rounded-2xl border border-kakao-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-kopi-400/50 hover:shadow-xl hover:shadow-kopi-600/10"
          >
            {/* Gradient wash saat hover */}
            <div className="absolute inset-0 bg-linear-to-br from-kopi-100/0 to-kopi-100/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-kopi-600 to-kopi-400 text-white shadow-md shadow-kopi-600/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Icon className="size-7" />
            </div>
            <h3 className="relative mt-5 font-heading text-xl font-semibold text-espresso-950">
              {judul}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-espresso-800/70">
              {deskripsi}
            </p>
            <Link
              href="/profil-desa/wilayah"
              className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-kopi-600 transition-all duration-200 hover:text-kopi-400"
            >
              Lihat Detail
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
