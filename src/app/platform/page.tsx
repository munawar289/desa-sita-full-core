import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  GraduationCap,
  Sprout,
  TrendingUp,
  Users,
} from "lucide-react";
import { PlatformHeader } from "@/components/platform/PlatformHeader";
import { PlatformFooter } from "@/components/platform/PlatformFooter";
import { createPublicClient } from "@/lib/supabase/public";
import { TENANT_BASE_DOMAIN } from "@/lib/tenant/env";

export const metadata: Metadata = {
  title: "Panel Platform — Program Desa Cantik",
  description:
    "Panel administrasi platform situs desa, mendukung Program Desa Cantik (Desa Cinta Statistik) BPS Kabupaten Manggarai Timur.",
  robots: { index: false, follow: false },
};

export const revalidate = 300;

const komponenProgram = [
  {
    icon: GraduationCap,
    judul: "Pembinaan dan Pendampingan",
    deskripsi:
      "BPS memberikan pelatihan teknis kepada perangkat desa mulai dari pengumpulan data (kuesioner), pengolahan, analisis, hingga penyajian data.",
    box: "bg-plat-primary-container text-plat-on-primary-container",
  },
  {
    icon: Users,
    judul: "Agen Statistik",
    deskripsi:
      "Pembentukan agen statistik di tiap kalurahan/desa guna memastikan keberlanjutan pengelolaan data.",
    box: "bg-plat-secondary-container/20 text-plat-secondary",
  },
  {
    icon: BarChart3,
    judul: "Standarisasi Data",
    deskripsi:
      "Mengintegrasikan data desa dengan program nasional seperti SDGs Desa dan Registrasi Sosial Ekonomi (Regsosek) untuk pengentasan kemiskinan ekstrem.",
    box: "bg-plat-tertiary-fixed text-plat-on-tertiary-fixed-variant",
  },
  {
    icon: BookOpenCheck,
    judul: "Publikasi Desa",
    deskripsi:
      "Desa dibimbing untuk menghasilkan publikasi berkala seperti Buku Desa dalam Angka dan memperbarui informasi di portal web desa.",
    box: "bg-plat-surface-container-high text-plat-primary",
  },
];

const pilarChecklist = [
  "Standardisasi pengelolaan data di setiap desa binaan.",
  "Peningkatan literasi statistik perangkat desa.",
  "Integrasi data untuk perencanaan dan kebijakan publik.",
];

const desaCardAccents = [
  "bg-plat-primary-container text-plat-on-primary-container",
  "bg-plat-secondary-container/20 text-plat-secondary",
  "bg-plat-tertiary-fixed text-plat-on-tertiary-fixed-variant",
  "bg-plat-surface-container-high text-plat-primary",
];

function getTenantWebsite(tenant: { slug: string; domain: string | null }) {
  const host = tenant.domain ?? (TENANT_BASE_DOMAIN ? `${tenant.slug}.${TENANT_BASE_DOMAIN}` : null);
  return host ? { host, url: `https://${host}` } : null;
}

export default async function PlatformLandingPage() {
  const supabase = createPublicClient();
  const { data: desaBinaan } = await supabase
    .from("tenants")
    .select("id, slug, domain, nama")
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(12);

  return (
    <div className="min-h-screen bg-plat-surface">
      <PlatformHeader />

      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden px-4 py-24 text-center sm:px-6">
        <Image
          src="/images/ranamese.jpg"
          alt="Danau Ranamese, Taman Wisata Alam Ruteng, Manggarai Timur"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-plat-primary/55 via-plat-primary/60 to-plat-primary/90" />
        <div className="pointer-events-none absolute bottom-0 right-0 hidden select-none pl-8 opacity-[0.08] lg:block">
          <span className="text-[220px] font-bold leading-none text-white">MATIM</span>
        </div>

        <div className="animate-fade-up relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-plat-secondary-container backdrop-blur-sm">
            <Sprout className="size-4" />
            Program Nasional BPS
          </span>

          <h1 className="mt-6 font-heading text-4xl font-semibold leading-tight text-plat-on-primary sm:text-5xl">
            Desa Cantik: Wujudkan Pembangunan Berbasis Data di Manggarai Timur
          </h1>

          <p className="mt-6 text-base leading-relaxed text-plat-on-primary/75 sm:text-lg">
            Meningkatkan literasi data dan kemandirian statistik di tingkat desa untuk
            perencanaan yang tepat sasaran demi masa depan yang lebih cerah.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#tentang"
              className="group inline-flex items-center gap-2 rounded-full bg-plat-secondary-container px-6 py-3 text-sm font-semibold text-plat-on-secondary-container shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105"
            >
              Pelajari Program
              <ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" />
            </Link>
            <Link
              href="/platform/login"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-plat-on-primary backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-plat-primary"
            >
              Masuk sebagai Admin Platform
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tentang */}
      <section id="tentang" className="scroll-mt-16 bg-white px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/images/leftimage.jpg"
                alt="Aparatur desa mengelola data di Kabupaten Manggarai Timur"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 max-w-xs rounded-2xl border border-white/40 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:-bottom-8 sm:-right-8">
              <p className="font-heading text-2xl font-semibold text-plat-primary">176+</p>
              <p className="mt-1 text-sm text-plat-on-surface-variant">
                Desa &amp; kelurahan siap bertransformasi menjadi Desa Cantik.
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-plat-secondary">
              <span className="size-1.5 rounded-full bg-plat-on-tertiary-container" />
              Visi Strategis
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-plat-primary sm:text-4xl">
              Apa itu Desa Cantik?
            </h2>

            <div className="mt-6 space-y-5">
              <p className="text-base leading-relaxed text-plat-on-surface-variant">
                Desa Cinta Statistik (Desa Cantik) adalah program nasional yang dikembangkan oleh
                Badan Pusat Statistik (BPS) untuk meningkatkan kompetensi aparatur desa dalam
                pengelolaan dan pemanfaatan data.
              </p>
              <p className="text-base leading-relaxed text-plat-on-surface-variant">
                Di Kabupaten Manggarai Timur, program ini diadaptasi dengan kearifan lokal untuk
                memastikan pembangunan dimulai dari fondasi yang paling kuat:{" "}
                <span className="font-semibold text-plat-primary">Data Desa yang Akurat.</span>
              </p>

              <ul className="space-y-3 pt-2">
                {pilarChecklist.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-plat-on-tertiary-container" />
                    <span className="text-sm text-plat-on-surface">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Komponen Program */}
      <section id="program" className="scroll-mt-16 bg-plat-surface-container-low px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-plat-secondary">
              <span className="size-1.5 rounded-full bg-plat-on-tertiary-container" />
              Pilar Utama
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-plat-primary sm:text-4xl">
              Komponen Utama Program
            </h2>
            <p className="mt-3 text-base leading-relaxed text-plat-on-surface-variant">
              Strategi komprehensif untuk membangun ekosistem data yang sehat dan berkelanjutan di
              setiap sudut Manggarai Timur.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {komponenProgram.map((item) => (
              <div
                key={item.judul}
                className="group rounded-2xl border border-plat-outline-variant/30 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${item.box}`}
                >
                  <item.icon className="size-7" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-plat-primary">
                  {item.judul}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-plat-on-surface-variant">
                  {item.deskripsi}
                </p>
                <div className="mt-5 h-1 w-12 rounded-full bg-plat-secondary-container transition-all duration-300 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bento */}
      <section className="bg-white px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl bg-plat-primary p-10 text-plat-on-primary md:col-span-2 md:p-12">
            <BarChart3
              className="pointer-events-none absolute -bottom-10 -right-10 size-64 text-plat-on-primary/5"
              strokeWidth={1}
            />
            <div className="relative">
              <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
                Mengapa Data Itu Penting?
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-plat-on-primary/75 sm:text-base">
                &ldquo;Tanpa data, Anda hanyalah orang lain dengan pendapat.&rdquo; Desa Cantik
                membuktikan bahwa kebijakan yang tepat sasaran selalu berawal dari angka-angka
                yang jujur di lapangan.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[Users, GraduationCap, BookOpenCheck].map((Icon, i) => (
                    <span
                      key={i}
                      className="flex size-11 items-center justify-center rounded-full border-2 border-plat-primary bg-plat-secondary-container text-plat-on-secondary-container"
                    >
                      <Icon className="size-5" />
                    </span>
                  ))}
                </div>
                <span className="text-sm text-plat-on-primary/60">
                  {desaBinaan?.length ?? 0} Desa Binaan
                </span>
              </div>
            </div>
          </div>
 
          <div className="flex flex-col items-center justify-center rounded-3xl border border-plat-secondary-container/30 bg-plat-secondary-container/10 p-10 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-white text-plat-secondary shadow-sm">
              <TrendingUp className="size-8" />
            </span>
            <p className="mt-6 font-heading text-4xl font-semibold text-plat-primary">92%</p>
            <p className="mt-2 text-sm text-plat-on-surface-variant">
              Peningkatan literasi data perangkat desa.
            </p>
          </div>
        </div>
      </section>

      {/* Desa Binaan */}
      <section id="desa-binaan" className="scroll-mt-16 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-plat-secondary">
              <span className="size-1.5 rounded-full bg-plat-on-tertiary-container" />
              Jaringan Desa Cantik
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-plat-primary sm:text-4xl">
              Desa Binaan
            </h2>
            <p className="mt-3 text-base leading-relaxed text-plat-on-surface-variant">
              Situs resmi desa yang telah bergabung dan dikelola melalui platform Desa Cantik.
            </p>
          </div>

          {!desaBinaan || desaBinaan.length === 0 ? (
            <p className="mt-12 text-center text-sm text-plat-on-surface-variant">
              Belum ada desa binaan yang terdaftar.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {desaBinaan.map((tenant, i) => {
                const website = getTenantWebsite(tenant);
                return (
                  <div
                    key={tenant.id}
                    className="group rounded-2xl border border-plat-outline-variant/30 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <div
                      className={`flex size-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${desaCardAccents[i % desaCardAccents.length]}`}
                    >
                      <Building2 className="size-7" />
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-semibold text-plat-primary">
                      {tenant.nama}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-plat-on-surface-variant">
                      {website?.host ?? tenant.slug}
                    </p>
                    {website ? (
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-plat-primary transition-colors duration-200 hover:text-plat-secondary"
                      >
                        Kunjungi Situs
                        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    ) : (
                      <span className="mt-5 inline-flex text-sm font-medium text-plat-on-surface-variant/50">
                        Situs belum tersedia
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <PlatformFooter />
    </div>
  );
}
