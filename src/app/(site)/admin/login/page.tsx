import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Building2,
  IdCard,
  Lock,
  LogIn,
  Mountain,
  TriangleAlert,
} from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getDesaProfil } from "@/lib/queries/desa-profil";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Masuk",
    area: "admin",
    robots: { index: false, follow: false },
  });
}

const fiturPanel = [
  { icon: IdCard, label: "Identitas & Profil Desa" },
  { icon: BarChart3, label: "Statistik & Data Desa" },
  { icon: Building2, label: "Potensi & Lembaga Desa" },
];

export default async function AdminLoginPage() {
  const profil = await getDesaProfil();
  const lokasi = `Kec. ${profil.kecamatan} · Kab. ${profil.kabupaten}`;

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] bg-surface-alt">
      {/* Kiri — panel identitas desa, dipakai hanya di layar besar. Foto &
          resep overlay sama dengan Hero beranda (DESIGN.md §5.2): netral dari
          panel-strong, tanpa gradient ungu/biru. */}
      <div className="relative hidden w-full max-w-md shrink-0 overflow-hidden bg-panel-strong lg:block xl:max-w-lg">
        {profil.hero_gambar_url && (
          <Image
            src={profil.hero_gambar_url}
            alt={profil.hero_gambar_alt ?? ""}
            fill
            sizes="480px"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-panel-strong/55 via-panel-strong/70 to-panel-strong/95" />

        {/* Tekstur anyaman (DESIGN.md §5.1) — satu-satunya section berpola di
            layar ini, opacity di batas atas rentang panel gelap (0.08). */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, color-mix(in srgb, var(--color-on-panel) 8%, transparent) 0 1px, transparent 1px 9px), repeating-linear-gradient(-45deg, color-mix(in srgb, var(--color-on-panel) 8%, transparent) 0 1px, transparent 1px 9px)",
          }}
        />

        <div className="animate-fade-up relative flex h-full flex-col justify-between p-10">
          <Link href="/" className="group inline-flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-linear-to-br from-accent-300 to-accent-500 text-neutral-900 shadow-sm shadow-neutral-900/20 transition-transform duration-200 group-hover:scale-105">
              <Mountain className="size-5" aria-hidden />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-heading text-base font-semibold text-on-panel">
                Desa {profil.nama_desa}
              </span>
              <span className="mt-1 text-xs text-on-panel-muted">{lokasi}</span>
            </span>
          </Link>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-on-panel/15 bg-on-panel/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-on-panel backdrop-blur-sm">
              <span className="size-1.5 rounded-full bg-accent-400" />
              Panel Admin Desa
            </span>
            <h2 className="mt-5 font-heading text-2xl font-semibold leading-snug text-on-panel xl:text-3xl">
              Kelola situs resmi desa dari satu tempat.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-on-panel-muted">
              Perbarui profil desa, data statistik, potensi, dan kelembagaan — semuanya tersimpan
              rapi dan bisa diakses kapan saja.
            </p>

            <ul className="mt-7 flex flex-col gap-3 border-t border-on-panel/10 pt-6">
              {fiturPanel.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-on-panel-muted">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-on-panel/15 bg-on-panel/5 text-accent-400">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Kanan — form masuk */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-2.5 lg:hidden">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-linear-to-br from-accent-300 to-accent-500 text-neutral-900">
              <Mountain className="size-5" aria-hidden />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-heading text-sm font-semibold text-text">
                Desa {profil.nama_desa}
              </span>
              <span className="mt-0.5 text-xs text-text-muted">{lokasi}</span>
            </span>
          </Link>

          <div className="animate-fade-up rounded-2xl border border-border bg-surface p-6 shadow-[0_1px_2px_color-mix(in_srgb,var(--color-neutral-900)_6%,transparent)] sm:p-8">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-on-primary-soft shadow-sm shadow-neutral-900/10">
              <LogIn className="size-5" aria-hidden />
            </span>
            <h1 className="mt-5 font-heading text-2xl font-semibold text-text">
              Masuk ke Panel Admin
            </h1>
            <p className="mt-1.5 text-sm text-text-muted">
              Khusus admin dan pengelola situs Desa {profil.nama_desa}.
            </p>

            <div className="mt-7">
              {isSupabaseConfigured() ? (
                <LoginForm />
              ) : (
                <div className="flex items-start gap-3 rounded-lg border border-danger-soft bg-danger-soft/60 p-4 text-sm text-on-danger-soft">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <p>
                    Supabase belum dikonfigurasi. Isi <code>NEXT_PUBLIC_SUPABASE_URL</code>{" "}
                    dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di{" "}
                    <code>.env.local</code> — lihat <code>supabase/README.md</code>.
                  </p>
                </div>
              )}
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-text-muted">
              <Lock className="size-3.5 shrink-0" aria-hidden />
              Koneksi aman — hanya untuk admin terverifikasi.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between px-1 text-xs text-text-muted">
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 font-medium text-link transition-colors hover:text-link-hover"
            >
              <ArrowLeft
                className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                aria-hidden
              />
              Kembali ke beranda
            </Link>
            <span>
              &copy; {new Date().getFullYear()} Desa {profil.nama_desa}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
