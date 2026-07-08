import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, TriangleAlert } from "lucide-react";
import { PlatformLoginForm } from "@/components/platform/PlatformLoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Masuk — Panel Platform",
  robots: { index: false, follow: false },
};

export default function PlatformLoginPage() {
  return (
    <div className="flex min-h-screen bg-plat-surface">
      {/* Kiri — panel brand, mengadopsi pola hero landing page /platform */}
      <div className="relative hidden w-full max-w-xl shrink-0 overflow-hidden lg:block">
        <Image
          src="/images/ranamese.jpg"
          alt="Danau Ranamese, Taman Wisata Alam Ruteng, Manggarai Timur"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-plat-primary/60 via-plat-primary/70 to-plat-primary/95" />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <Link href="/platform" className="group inline-flex items-center gap-2.5">
            <span className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/images/logo.webp"
                alt="Logo Desa Cantik BPS Kabupaten Manggarai Timur"
                fill
                sizes="36px"
                className="object-contain p-1"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-heading text-sm font-semibold text-plat-on-primary">
                Desa Cantik
              </span>
              <span className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-plat-on-primary/60">
                Manggarai Timur
              </span>
            </span>
          </Link>

          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-plat-secondary-container backdrop-blur-sm">
              <ShieldCheck className="size-4" />
              Panel Admin Platform
            </span>
            <blockquote className="mt-6 font-heading text-3xl font-semibold leading-snug text-plat-on-primary xl:text-4xl">
              &ldquo;Tanpa data, Anda hanyalah orang lain dengan pendapat.&rdquo;
            </blockquote>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-plat-on-primary/70">
              Kelola desa binaan, admin tenant, dan konten Program Desa Cantik dari satu panel
              terpusat.
            </p>
          </div>
        </div>
      </div>

      {/* Kanan — form masuk */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-16">
        <div className="w-full max-w-sm">
          <Link href="/platform" className="mb-8 inline-flex items-center gap-2.5 lg:hidden">
            <span className="relative flex size-9 shrink-0 items-center justify-center">
              <Image
                src="/images/logo.webp"
                alt="Logo Desa Cantik BPS Kabupaten Manggarai Timur"
                fill
                sizes="36px"
                className="object-contain"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-heading text-sm font-semibold text-plat-primary">
                Desa Cantik
              </span>
              <span className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-plat-on-surface-variant">
                Manggarai Timur
              </span>
            </span>
          </Link>

          <span className="flex size-12 items-center justify-center rounded-2xl bg-plat-primary-container text-plat-on-primary-container">
            <ShieldCheck className="size-6" />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-semibold text-plat-primary">
            Masuk ke Panel Platform
          </h1>
          <p className="mt-1.5 text-sm text-plat-on-surface-variant">
            Khusus admin platform (landlord) Desa Cantik.
          </p>

          <div className="mt-8">
            {isSupabaseConfigured() ? (
              <PlatformLoginForm />
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-plat-tertiary-fixed bg-plat-tertiary-fixed/40 p-4 text-sm text-plat-on-tertiary-fixed-variant">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                <p>
                  Supabase belum dikonfigurasi. Isi <code>NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                  dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di{" "}
                  <code>.env.local</code> — lihat <code>supabase/README.md</code>.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-plat-outline-variant/40 pt-6 text-xs text-plat-on-surface-variant">
            <Link
              href="/platform"
              className="group inline-flex items-center gap-1.5 font-medium text-plat-primary transition-colors hover:text-plat-secondary"
            >
              <ArrowLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Kembali ke beranda
            </Link>
            <span>&copy; {new Date().getFullYear()} BPS Matim</span>
          </div>
        </div>
      </div>
    </div>
  );
}
