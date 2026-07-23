import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDesaProfil } from "@/lib/queries/desa-profil";
import { heroMedia } from "@/mock/hero";

export async function HeroSection() {
  const profil = await getDesaProfil();
  const lokasi = [
    `Kec. ${profil.kecamatan}`,
    `Kab. ${profil.kabupaten}`,
    profil.provinsi,
  ];

  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden bg-panel-strong px-4 py-24 text-center">
      {/* Foto asli desa sebagai latar (DESIGN.md §5.2). `priority`: Hero adalah
          satu-satunya gambar yang tidak lazy-load. */}
      <Image
        src={heroMedia.src}
        alt={heroMedia.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Overlay netral & bisa diprediksi dari `panel-strong` saja — tidak ada
          gradient ungu/biru. Lapisan bawah lebih pekat agar location bar &
          judul tetap ≥ AA di atas foto seterang apa pun. */}
      <div className="absolute inset-0 bg-panel-strong/65" />
      <div className="absolute inset-0 bg-linear-to-t from-panel-strong via-panel-strong/20 to-panel-strong/50" />

      <div className="animate-fade-up relative flex flex-col items-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-on-panel/15 bg-on-panel/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-on-panel">
          <span className="size-1.5 rounded-full bg-accent-400" />
          Situs Resmi Pemerintah Desa
        </span>

        <h1 className="mt-7 font-heading text-5xl font-semibold tracking-wide text-on-panel drop-shadow-sm sm:text-6xl md:text-7xl">
          DESA{" "}
          <span className="text-gradient-brand">{profil.nama_desa.toUpperCase()}</span>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-on-panel-muted md:text-base">
          {profil.hero_deskripsi}
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group rounded-full px-6 shadow-lg shadow-neutral-900/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-neutral-900/40"
          >
            <Link href="#statistik-snapshot">
              Kenali Desa Kami
              <ChevronDown className="transition-transform duration-200 group-hover:translate-y-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="group rounded-full border-on-panel/30 bg-on-panel/5 px-6 text-on-panel transition-all duration-200 hover:-translate-y-0.5 hover:border-on-panel hover:bg-on-panel hover:text-panel-strong"
          >
            <Link href="/data-desa">
              Data Desa
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Location bar — permukaan solid dari token, bukan kartu kaca. */}
        <div className="mt-14 inline-flex items-center gap-2.5 rounded-full border border-on-panel/10 bg-panel-strong/60 px-5 py-2.5 text-xs font-medium text-on-panel-muted sm:text-sm">
          <MapPin className="size-4 shrink-0 text-accent-400" aria-hidden />
          <span>{lokasi.join(" · ")}</span>
        </div>
      </div>
    </section>
  );
}
