"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mountain } from "lucide-react";
import { footerNavItems } from "@/lib/nav";
import type { DesaProfil } from "@/lib/data/desa-profil";

export function Footer({ profil }: { profil: DesaProfil }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const jamLayanan = [profil.jam_layanan, profil.zona_waktu].filter(Boolean).join(" ");

  return (
    <footer className="bg-panel-strong text-on-panel">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-[10px] bg-linear-to-br from-accent-300 to-accent-500 text-neutral-900">
              <Mountain className="size-5" aria-hidden />
            </span>
            <p className="font-heading text-lg font-semibold">Desa {profil.nama_desa}</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-on-panel-muted">
            Kecamatan {profil.kecamatan}, Kabupaten {profil.kabupaten},{" "}
            {profil.provinsi}
          </p>
        </div>

        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-on-panel">
            Navigasi
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {footerNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-on-panel-muted transition-all duration-200 hover:text-on-panel"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-on-panel">
            Kontak
          </p>
          <ul className="mt-3 space-y-2 text-sm text-on-panel-muted">
            {profil.email && <li>{profil.email}</li>}
            {jamLayanan && <li>{jamLayanan}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-panel-border px-4 py-4 text-center text-xs text-on-panel-muted sm:px-6">
        &copy; {new Date().getFullYear()} Pemerintah Desa {profil.nama_desa}. Seluruh hak cipta dilindungi.
      </div>
    </footer>
  );
}
