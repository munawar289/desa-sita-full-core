import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDesaProfil } from "@/lib/queries/desa-profil";

export async function HeroSection() {
  const profil = await getDesaProfil();
  const meta = [
    `Kec. ${profil.kecamatan}`,
    `Kab. ${profil.kabupaten}`,
    profil.provinsi,
  ];

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-panel-strong px-4 text-center">
      {/* Base gradient — dua lapis panel gelap, keduanya jauh lebih pekat dari
          on-panel sehingga teks di atasnya aman untuk warna desa apa pun. */}
      <div className="absolute inset-0 bg-linear-to-br from-panel-strong via-panel to-panel-strong" />

      {/* Glow blobs */}
      <div className="animate-float absolute -left-24 top-1/4 size-96 rounded-full bg-primary-600/25 blur-3xl" />
      <div className="animate-float-slow absolute -right-16 bottom-1/4 size-80 rounded-full bg-secondary-700/25 blur-3xl" />
      <div className="animate-pulse-glow absolute left-1/2 top-1/3 size-72 -translate-x-1/2 rounded-full bg-accent-500/15 blur-3xl" />

      {/* Dot pattern + vignette */}
      <div className="bg-dot-grid absolute inset-0 opacity-60 mask-[linear-gradient(to_bottom,transparent,black_35%,black_70%,transparent)]" />
      <div className="absolute inset-0 bg-linear-to-t from-panel-strong via-transparent to-panel-strong/40" />

      <div className="animate-fade-up relative flex flex-col items-center">
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-on-panel-muted">
          <span className="size-1.5 rounded-full bg-accent-400" />
          Situs Resmi Pemerintah Desa
        </span>

        <h1 className="mt-6 font-heading text-6xl font-semibold tracking-wide text-on-panel drop-shadow-sm md:text-8xl">
          DESA{" "}
          <span className="text-gradient-brand">{profil.nama_desa.toUpperCase()}</span>
        </h1>

        <p className="mt-5 max-w-lg text-sm leading-relaxed text-on-panel-muted md:text-base">
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
            className="group rounded-full border-on-panel/30 bg-on-panel/5 px-6 text-on-panel backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-on-panel hover:bg-on-panel hover:text-panel-strong"
          >
            <Link href="/data-desa">
              Data Desa
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-xs text-on-panel-muted">
          {meta.map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span className="size-1 rounded-full bg-on-panel/30" />}
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
