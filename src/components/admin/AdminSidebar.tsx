"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Mountain } from "lucide-react";
import { adminNavItems } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ role }: { role: "admin" | "operator" }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-espresso-800 px-4 py-6 text-krem-50 md:flex">
      <Link href="/admin" className="flex items-center gap-2.5 px-2">
        <span className="flex size-9 items-center justify-center rounded-[10px] bg-linear-to-br from-gold-500 to-kopi-600 text-espresso-950">
          <Mountain className="size-5" />
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
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-krem-50/35"
              >
                {item.label}
                <Lock className="size-3.5" />
              </span>
            );
          }

          const active = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 hover:text-white",
                active ? "bg-white/10 text-gold-400" : "text-krem-50/80",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
