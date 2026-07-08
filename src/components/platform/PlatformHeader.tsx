"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Beranda", href: "#" },
  { label: "Tentang", href: "#tentang" },
  { label: "Program", href: "#program" },
  { label: "Desa Binaan", href: "#desa-binaan" },
];

export function PlatformHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-plat-surface/80 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="#" className="group flex items-center gap-2.5">
          <span className="relative flex size-9 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-105">
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

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-plat-on-surface-variant transition-colors duration-200 hover:text-plat-primary"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/platform/login"
            className="hidden rounded-full bg-plat-primary px-5 py-2.5 text-sm font-semibold text-plat-on-primary shadow-sm shadow-plat-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 sm:inline-flex"
          >
            Masuk
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-plat-outline-variant p-2 text-plat-primary transition-colors hover:bg-plat-surface-container-low md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-plat-outline-variant bg-plat-surface md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-plat-on-surface-variant transition-colors hover:bg-plat-surface-container-low hover:text-plat-primary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/platform/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 rounded-full bg-plat-primary px-4 py-2.5 text-center text-sm font-semibold text-plat-on-primary sm:hidden"
            >
              Masuk
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
