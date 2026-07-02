import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-espresso-950 to-espresso-800 px-4 text-center">
      <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/60 via-transparent to-transparent opacity-40" />

      <div className="relative flex flex-col items-center">
        <p className="text-sm font-medium tracking-wide text-krem-50/70">
          Selamat Datang di
        </p>
        <h1 className="mt-3 font-heading text-5xl font-bold tracking-wide text-white md:text-7xl">
          DESA SITA
        </h1>
        <p className="mt-4 text-sm text-krem-50/60 md:text-base">
          Kec. Rana Mese &middot; Kab. Manggarai Timur &middot; NTT
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="rounded-lg bg-kopi-600 text-white transition-all duration-200 hover:bg-kopi-600/90"
          >
            <Link href="#statistik-snapshot">Jelajahi Desa &darr;</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-lg border-white text-white transition-all duration-200 hover:bg-white hover:text-espresso-950"
          >
            <Link href="/data-desa">Data Desa &rarr;</Link>
          </Button>
        </div>
      </div>

      <ChevronDown className="absolute bottom-8 size-6 animate-bounce text-white/60" />
    </section>
  );
}
