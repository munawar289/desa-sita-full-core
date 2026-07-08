import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "#" },
  { label: "Tentang", href: "#tentang" },
  { label: "Program", href: "#program" },
  { label: "Masuk Admin", href: "/platform/login" },
];

export function PlatformFooter() {
  return (
    <footer className="bg-plat-primary text-plat-on-primary">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
              <Image
                src="/images/logo.webp"
                alt="Logo Desa Cantik BPS Kabupaten Manggarai Timur"
                fill
                sizes="36px"
                className="object-contain p-1"
              />
            </span>
            <p className="font-heading text-lg font-semibold">Desa Cantik</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-plat-on-primary/70">
            Badan Pusat Statistik Kabupaten Manggarai Timur — mendukung pembangunan desa
            berbasis data melalui platform situs desa yang terstandarisasi.
          </p>
        </div>

        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-plat-secondary-fixed-dim">
            Navigasi
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {navLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-plat-on-primary/70 transition-colors duration-200 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-plat-secondary-fixed-dim">
            Kantor Kami
          </p>
          <p className="mt-3 text-sm leading-relaxed text-plat-on-primary/70">
            Jl. Ki Hajar Dewantara - Satar Peot - Borong
            <br />
            Kabupaten Manggarai Timur, 86571
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-plat-on-primary/60">
            <Mail className="size-4" />
            <span>bps5319@bps.go.id</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-plat-on-primary/50 sm:px-6">
        &copy; {new Date().getFullYear()} BPS Kabupaten Manggarai Timur — Program Desa Cantik.
      </div>
    </footer>
  );
}
