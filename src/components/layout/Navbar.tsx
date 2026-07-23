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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  if (pathname.startsWith("/admin")) return null;

  function toggleMobileMenu() {
    setMobileOpen((open) => {
      if (open) return false;
      // Buka menu dengan hanya submenu halaman aktif yang tampil terbuka,
      // bukan semua submenu sekaligus (DESIGN.md §6.5).
      const activeParent = navItems.find(
        (item) => item.children && isActive(pathname, item.href),
      );
      setExpandedItem(activeParent ? activeParent.href : null);
      return true;
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-panel-border bg-panel/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          {/* Gradient dekoratif antar dua step scale yang sama (DESIGN.md §7.1);
              keduanya di ujung terang, jadi ikon neutral-900 selalu lolos AA. */}
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-linear-to-br from-accent-300 to-accent-500 text-neutral-900 shadow-sm shadow-neutral-900/20 transition-transform duration-200 group-hover:scale-105">
            <Mountain className="size-5" aria-hidden />
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-heading text-lg font-semibold tracking-wide text-on-panel">
              Desa {profil.nama_desa}
            </span>
            <span className="mt-0.5 truncate font-mono text-[0.6rem] uppercase tracking-[0.14em] text-on-panel-muted">
              Situs Resmi Desa
            </span>
          </span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-0.5 lg:flex">
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
          className="inline-flex size-11 items-center justify-center rounded-lg border border-panel-border text-on-panel transition-colors hover:bg-on-panel/10 lg:hidden"
          onClick={toggleMobileMenu}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100dvh-4rem)] w-full overflow-y-auto border-t border-panel-border bg-panel lg:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => {
              const itemActive = isActive(pathname, item.href);
              const isExpanded = expandedItem === item.href;
              return (
                <div key={item.href}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex min-h-12 flex-1 items-center rounded-lg px-3 text-sm transition-all duration-200",
                        itemActive
                          ? "border-l-2 border-accent-400 bg-on-panel/10 font-semibold text-on-panel"
                          : "text-on-panel-muted",
                      )}
                      aria-current={itemActive ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedItem((current) => (current === item.href ? null : item.href))
                        }
                        className="flex size-11 shrink-0 items-center justify-center text-on-panel-muted transition-colors hover:bg-on-panel/10"
                        aria-expanded={isExpanded}
                        aria-label={`${isExpanded ? "Tutup" : "Buka"} submenu ${item.label}`}
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-200",
                            isExpanded && "rotate-180",
                          )}
                        />
                      </button>
                    )}
                  </div>
                  {item.children && isExpanded && (
                    <div className="ml-3 flex flex-col gap-1 border-l border-panel-border pl-3">
                      {item.children.slice(1).map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex min-h-12 items-center rounded-lg px-3 text-sm transition-all duration-200",
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
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
