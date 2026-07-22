"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Mountain } from "lucide-react";
import { adminNavItems } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

/**
 * Item aktif ditandai bilah kiri aksen PLUS `font-semibold`, sama seperti nav
 * mobile di Navbar (DESIGN.md §6.5). Warna sendirian tidak boleh jadi pembawa
 * informasi (WCAG 1.4.1), dan `on-panel` vs `on-panel-muted` terlalu tipis
 * bedanya untuk sebagian warna desa.
 */
const NAV_ITEM =
  "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-on-panel/10 hover:text-on-panel";
const NAV_ITEM_ACTIVE =
  "bg-on-panel/10 font-semibold text-on-panel before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-accent-400";

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ role }: { role: "admin" | "operator" }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-panel-border bg-panel px-4 py-6 text-on-panel md:flex">
      <Link href="/admin" className="flex items-center gap-2.5 px-2">
        {/* Gradient dekoratif antar dua step scale yang sama (DESIGN.md §7.1);
            keduanya di ujung terang, jadi ikon neutral-900 selalu lolos AA. */}
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-linear-to-br from-accent-300 to-accent-500 text-neutral-900">
          <Mountain className="size-5" aria-hidden />
        </span>
        <span className="font-heading text-base font-semibold">Admin Desa Sita</span>
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {adminNavItems.map((item) => {
          const disabled = !item.active || (item.minRole === "admin" && role !== "admin");
          if (disabled) {
            return (
              <span
                key={item.href}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-on-panel-muted/60"
              >
                {item.label}
                <Lock className="size-3.5" aria-hidden />
              </span>
            );
          }

          const active = isActivePath(pathname, item.href);
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
        })}
      </nav>
    </aside>
  );
}
