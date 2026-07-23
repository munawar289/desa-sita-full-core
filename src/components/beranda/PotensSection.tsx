import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { getDesaProfil } from "@/lib/queries/desa-profil";
import { getPotensi } from "@/lib/queries/potensi";
import { potensiIconMap } from "@/lib/data/potensi";
import { potensiMediaByIcon } from "@/mock/potensi-media";

export async function PotensSection() {
  const [profil, potensi] = await Promise.all([getDesaProfil(), getPotensi()]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Potensi Desa"
          title={`Sumber Penghidupan Warga Desa ${profil.nama_desa}`}
          description="Kekayaan alam dan kreativitas warga jadi tumpuan kemandirian ekonomi desa."
        />
        <Link
          href="/profil-desa/wilayah"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-link transition-colors duration-200 hover:text-link-hover"
        >
          Eksplor Semua Potensi
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
        {potensi.map(({ id, icon, judul, deskripsi }) => {
          const Icon = potensiIconMap[icon];
          const media = potensiMediaByIcon[icon];
          return (
            <div
              key={id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-border-strong hover:shadow-xl hover:shadow-neutral-900/10"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                {media ? (
                  <Image
                    src={media.src}
                    alt={media.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  // Placeholder saat foto belum ada (DESIGN.md §5.2) — blok
                  // surface-alt + ikon Lucide, bukan stock photo.
                  <div className="flex size-full items-center justify-center bg-surface-alt">
                    <Icon className="size-10 text-text-muted" aria-hidden />
                  </div>
                )}
              </div>

              <div className="flex grow flex-col p-6">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-on-primary-soft">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="mt-4 font-heading text-xl font-semibold text-text">
                  {judul}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {deskripsi}
                </p>
                <Link
                  href="/profil-desa/wilayah"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-link transition-all duration-200 hover:gap-2.5 hover:text-link-hover"
                >
                  Lihat Detail
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
