import Link from "next/link";
import { ArrowRight, MessageSquareHeart } from "lucide-react";
import { HeroSection } from "@/components/beranda/HeroSection";
import { StatistikSnapshot } from "@/components/beranda/StatistikSnapshot";
import { PotensSection } from "@/components/beranda/PotensSection";
import { StatistikOverview } from "@/components/beranda/StatistikOverview";
import { Button } from "@/components/ui/button";
import { getDesaProfil } from "@/lib/queries/desa-profil";

export const revalidate = 300;

export default async function Home() {
  const profil = await getDesaProfil();

  return (
    <>
      <HeroSection />
      <StatistikSnapshot />
      <PotensSection />
      <StatistikOverview />

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6">
        {/* Panel ajakan branded: `secondary` sebagai permukaan penuh, `on-secondary`
            dipilih engine lewat rasio kontras terhadap `secondary` saja — jangan
            asumsikan putih. Blob dekoratif dari step scale tenant yang sama. */}
        <div className="relative flex flex-col items-center gap-10 overflow-hidden rounded-3xl bg-secondary px-6 py-12 shadow-xl shadow-neutral-900/20 md:px-14 md:py-16 lg:flex-row lg:justify-between">
          {/* Dekorasi */}
          <div className="animate-float absolute -left-16 -top-16 size-64 rounded-full bg-secondary-400/25 blur-3xl" />
          <div className="animate-float-slow absolute -bottom-16 -right-12 size-64 rounded-full bg-panel-strong/25 blur-3xl" />
          <div className="bg-dot-grid absolute inset-0 opacity-30" />

          <div className="relative grow text-center lg:text-left">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-on-secondary/15 text-on-secondary lg:mx-0">
              <MessageSquareHeart className="size-7" aria-hidden />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-semibold text-on-secondary sm:text-3xl">
              Suara Anda membangun desa
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-on-secondary/80 lg:mx-0">
              Sampaikan aspirasi, keluhan, atau pertanyaan Anda langsung kepada
              Pemerintah Desa {profil.nama_desa}. Partisipasi warga adalah kunci
              kemajuan kita bersama.
            </p>
          </div>

          <div className="relative shrink-0">
            <Button
              asChild
              size="lg"
              className="group rounded-full bg-surface px-6 text-link shadow-lg shadow-neutral-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-alt hover:text-link-hover"
            >
              <Link href="/layanan/pengaduan">
                Kirim Pengaduan
                <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
