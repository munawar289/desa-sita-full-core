"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, Mountain, X } from "lucide-react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";
import type { DesaProfil } from "@/lib/data/desa-profil";

/**
 * Item aktif ditandai teks `on-panel` PLUS garis bawah aksen (DESIGN.md §6.5).
 * Garisnya bukan hiasan: warna tidak boleh jadi satu-satunya pembawa informasi
 * (WCAG 1.4.1), dan `on-panel` vs `on-panel-muted` saja terlalu tipis bedanya
 * untuk sebagian warna desa.
 */
const NAV_ITEM =
  "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-on-panel/10 hover:text-on-panel";
const NAV_ITEM_ACTIVE =
  "text-on-panel after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-accent-400";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({ profil }: { profil: DesaProfil }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-panel-border bg-panel/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          {/* Gradient dekoratif antar dua step scale yang sama (DESIGN.md §7.1);
              keduanya di ujung terang, jadi ikon neutral-900 selalu lolos AA. */}
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-linear-to-br from-accent-300 to-accent-500 text-neutral-900 shadow-sm shadow-neutral-900/20 transition-transform duration-200 group-hover:scale-105">
            <Mountain className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-lg font-semibold tracking-wide text-on-panel">
              Desa {profil.nama_desa}
            </span>
            <span className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-on-panel-muted">
              Situs Resmi Desa
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(NAV_ITEM, active ? NAV_ITEM_ACTIVE : "text-on-panel-muted")}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    NAV_ITEM,
                    "flex items-center gap-1",
                    active ? NAV_ITEM_ACTIVE : "text-on-panel-muted",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="min-w-56 rounded-xl bg-surface p-2 shadow-xl shadow-neutral-900/20 ring-1 ring-border">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-primary-soft hover:text-on-primary-soft",
                          isActive(pathname, child.href)
                            ? "font-semibold text-link"
                            : "text-text",
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-panel-border p-2 text-on-panel transition-colors hover:bg-on-panel/10 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="w-full border-t border-panel-border bg-panel md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-all duration-200",
                    isActive(pathname, item.href)
                      ? "border-l-2 border-accent-400 bg-on-panel/10 font-semibold text-on-panel"
                      : "text-on-panel-muted",
                  )}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-panel-border pl-3">
                    {item.children.slice(1).map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm transition-all duration-200",
                          isActive(pathname, child.href)
                            ? "border-l-2 border-accent-400 bg-on-panel/10 font-semibold text-on-panel"
                            : "text-on-panel-muted",
                        )}
                        aria-current={isActive(pathname, child.href) ? "page" : undefined}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
