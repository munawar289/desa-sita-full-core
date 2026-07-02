import Link from "next/link";
import { HeroSection } from "@/components/beranda/HeroSection";
import { StatistikSnapshot } from "@/components/beranda/StatistikSnapshot";
import { PotensSection } from "@/components/beranda/PotensSection";
import { BeritaTeaser } from "@/components/beranda/BeritaTeaser";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatistikSnapshot />
      <PotensSection />
      <BeritaTeaser />

      <section className="bg-sawah-700 px-4 py-12 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
          Ada masukan untuk desa?
        </h2>
        <p className="mt-2 text-sm text-white/80">
          Sampaikan pengaduan atau masukan Anda untuk kemajuan Desa Sita.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 rounded-lg bg-white text-sawah-700 hover:bg-white/90"
        >
          <Link href="/layanan/pengaduan">Kirim Pengaduan &rarr;</Link>
        </Button>
      </section>
    </>
  );
}
