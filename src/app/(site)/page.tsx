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

      <section className="px-4 pb-20 pt-4 sm:px-6">
        {/* Pita ajakan memakai warna SEKUNDER supaya beda nada dari Hero yang
            memakai panel gelap. Latarnya rata, bukan gradient: `on-secondary`
            dipilih engine lewat rasio kontras terhadap `secondary` saja. */}
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-secondary px-6 py-14 text-center shadow-xl shadow-neutral-900/20">
          {/* Dekorasi */}
          <div className="animate-float absolute -left-12 -top-12 size-56 rounded-full bg-secondary-400/30 blur-3xl" />
          <div className="animate-float-slow absolute -bottom-16 -right-10 size-56 rounded-full bg-panel-strong/30 blur-3xl" />
          <div className="bg-dot-grid absolute inset-0 opacity-30" />

          <div className="relative">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-on-secondary/15 text-on-secondary backdrop-blur-sm">
              <MessageSquareHeart className="size-7" aria-hidden />
            </div>
            <h2 className="mt-5 font-heading text-2xl font-semibold text-on-secondary sm:text-3xl">
              Ada masukan untuk desa?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-on-secondary/80">
              Sampaikan pengaduan atau masukan Anda untuk kemajuan Desa {profil.nama_desa}.
            </p>
            <Button
              asChild
              size="lg"
              className="group mt-7 rounded-full bg-surface px-6 text-link shadow-lg shadow-neutral-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-alt hover:text-link-hover"
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
