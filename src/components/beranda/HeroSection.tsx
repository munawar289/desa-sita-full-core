import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const meta = [
  "Kec. Rana Mese",
  "Kab. Manggarai Timur",
  "Nusa Tenggara Timur",
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-espresso-950 px-4 text-center">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-espresso-950 via-espresso-800 to-espresso-950" />

      {/* Glow blobs */}
      <div className="animate-float absolute -left-24 top-1/4 size-96 rounded-full bg-kopi-600/25 blur-3xl" />
      <div className="animate-float-slow absolute -right-16 bottom-1/4 size-80 rounded-full bg-sawah-700/25 blur-3xl" />
      <div className="animate-pulse-glow absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-gold-500/15 blur-3xl" />

      {/* Dot pattern + vignette */}
      <div className="bg-dot-grid absolute inset-0 opacity-60 mask-[linear-gradient(to_bottom,transparent,black_35%,black_70%,transparent)]" />
      <div className="absolute inset-0 bg-linear-to-t from-espresso-950 via-transparent to-espresso-950/40" />

      <div className="animate-fade-up relative flex flex-col items-center">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-gold-400">
          <span className="size-1.5 rounded-full bg-gold-500" />
          Situs Resmi Pemerintah Desa
        </span>

        <h1 className="mt-6 font-heading text-6xl font-semibold tracking-wide text-krem-50 drop-shadow-sm md:text-8xl">
          DESA <span className="text-gradient-kopi">SITA</span>
        </h1>

        <p className="mt-5 max-w-lg text-sm leading-relaxed text-krem-50/70 md:text-base">
          Desa agraris di kaki pegunungan Rana Mese — hidup dari hasil kebun dan
          sawah sejak tahun 1966.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group rounded-full bg-kopi-600 px-6 text-white shadow-lg shadow-kopi-600/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-tanah-500 hover:shadow-xl hover:shadow-kopi-600/40"
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
            className="group rounded-full border-krem-50/30 bg-white/5 px-6 text-krem-50 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-krem-50 hover:bg-krem-50 hover:text-espresso-950"
          >
            <Link href="/data-desa">
              Data Desa
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-xs text-krem-50/45">
          {meta.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span className="size-1 rounded-full bg-krem-50/25" />}
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
