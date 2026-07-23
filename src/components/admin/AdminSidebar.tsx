"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, type LucideIcon, Mountain } from "lucide-react";
import { adminNavItems, type AdminNavItem } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

/**
 * Item aktif ditandai bilah kiri aksen PLUS `font-semibold`, sama seperti nav
 * mobile di Navbar (DESIGN.md §6.5). Warna sendirian tidak boleh jadi pembawa
 * informasi (WCAG 1.4.1), dan `on-panel` vs `on-panel-muted` terlalu tipis
 * bedanya untuk sebagian warna desa.
 */
const NAV_ITEM =
  "relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-on-panel/10 hover:text-on-panel";
const NAV_ITEM_ACTIVE =
  "bg-on-panel/10 font-semibold text-on-panel before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-accent-400";
const NAV_ITEM_CHILD =
  "relative rounded-lg px-3 py-1.5 text-sm transition-all duration-200 hover:bg-on-panel/10 hover:text-on-panel";

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function LockedItem({ label, icon: Icon }: { label: string; icon?: LucideIcon }) {
  return (
    <span className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-on-panel-muted/60">
      <span className="flex items-center gap-2.5">
        {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
        {label}
      </span>
      <Lock className="size-3.5 shrink-0" aria-hidden />
    </span>
  );
}

export function AdminSidebar({
  role,
  namaDesa,
}: {
  role: "admin" | "operator";
  namaDesa: string;
}) {
  const pathname = usePathname();

  function isVisible(item: AdminNavItem) {
    return item.active && !(item.minRole === "admin" && role !== "admin");
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-panel-border bg-panel px-4 py-6 text-on-panel md:flex">
      <Link href="/admin" className="flex items-center gap-2.5 px-2">
        {/* Gradient dekoratif antar dua step scale yang sama (DESIGN.md §7.1);
            keduanya di ujung terang, jadi ikon neutral-900 selalu lolos AA. */}
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-linear-to-br from-accent-300 to-accent-500 text-neutral-900">
          <Mountain className="size-5" aria-hidden />
        </span>
        <span className="font-heading text-base font-semibold">Admin Desa {namaDesa}</span>
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {adminNavItems
          .filter((item) => item.active)
          .map((item) => {
            if (item.minRole === "admin" && role !== "admin") {
              return <LockedItem key={item.href} label={item.label} icon={item.icon} />;
            }

            const Icon = item.icon;
            const children = (item.children ?? []).filter(isVisible);
            const childActive = children.some((child) => isActivePath(pathname, child.href));
            // Kalau punya children, "aktif penuh" (bar + bold) hanya untuk halaman
            // induk itu sendiri — bukan prefix match — supaya tidak dobel dengan
            // bar milik child saat child yang sebenarnya aktif (lihat childActive).
            const active = children.length > 0 ? pathname === item.href : isActivePath(pathname, item.href);

            return (
              <div key={item.href} className="flex flex-col gap-1">
                <Link
                  href={item.href}
                  className={cn(
                    NAV_ITEM,
                    active ? NAV_ITEM_ACTIVE : "text-on-panel-muted",
                    childActive && "text-on-panel",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {Icon && <Icon className="size-4 shrink-0" aria-hidden />}
                  {item.label}
                </Link>
                {children.length > 0 && (active || childActive) && (
                  <div className="flex flex-col gap-1 border-l border-on-panel/15 pl-3">
                    {children.map((child) => {
                      const childIsActive = isActivePath(pathname, child.href);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            NAV_ITEM_CHILD,
                            childIsActive ? NAV_ITEM_ACTIVE : "text-on-panel-muted",
                          )}
                          aria-current={childIsActive ? "page" : undefined}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
      </nav>
    </aside>
  );
}
