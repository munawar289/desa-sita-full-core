"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { navItems } from "@/lib/nav";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-kakao-200 bg-krem-50/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-lg font-bold tracking-wide text-espresso-950"
        >
          Desa Sita
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:text-kopi-400",
                    active ? "font-semibold text-kopi-600" : "text-espresso-800",
                  )}
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
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:text-kopi-400",
                    active ? "font-semibold text-kopi-600" : "text-espresso-800",
                  )}
                >
                  {item.label}
                  <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="min-w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-kakao-200">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-kopi-100 hover:text-kopi-600",
                          isActive(pathname, child.href)
                            ? "font-semibold text-kopi-600"
                            : "text-espresso-800",
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
          className="inline-flex items-center justify-center rounded-lg p-2 text-espresso-800 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="w-full border-t border-kakao-200 bg-krem-50 md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-all duration-200",
                    isActive(pathname, item.href)
                      ? "font-semibold text-kopi-600"
                      : "text-espresso-800",
                  )}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 flex flex-col gap-1 border-l border-kakao-200 pl-3">
                    {item.children.slice(1).map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm transition-all duration-200",
                          isActive(pathname, child.href)
                            ? "font-semibold text-kopi-600"
                            : "text-espresso-800/80",
                        )}
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
