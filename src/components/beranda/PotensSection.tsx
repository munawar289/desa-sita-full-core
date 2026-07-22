import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getDesaProfil } from "@/lib/queries/desa-profil";
import { getPotensi } from "@/lib/queries/potensi";
import { potensiIconMap } from "@/lib/data/potensi";

export async function PotensSection() {
  const [profil, potensi] = await Promise.all([getDesaProfil(), getPotensi()]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <SectionHeader
        eyebrow="Potensi Desa"
        title={`Sumber Penghidupan Warga Desa ${profil.nama_desa}`}
        align="center"
        className="mx-auto"
      />

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {potensi.map(({ id, icon, judul, deskripsi }) => {
          const Icon = potensiIconMap[icon];
          return (
            <div
              key={id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-border-strong hover:shadow-xl hover:shadow-neutral-900/10"
            >
              {/* Gradient wash saat hover */}
              <div className="absolute inset-0 bg-linear-to-br from-primary-soft/0 to-primary-soft/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Gradient primary → primary-active: keduanya sisi gelap dari warna
                  yang sama, jadi `on-primary` tetap terbaca di seluruh sapuannya. */}
              <div className="relative flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary-active text-on-primary shadow-md shadow-neutral-900/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Icon className="size-7" aria-hidden />
              </div>
              <h3 className="relative mt-5 font-heading text-xl font-semibold text-text">
                {judul}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-text-muted">
                {deskripsi}
              </p>
              <Link
                href="/profil-desa/wilayah"
                className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-link transition-all duration-200 hover:text-link-hover"
              >
                Lihat Detail
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
