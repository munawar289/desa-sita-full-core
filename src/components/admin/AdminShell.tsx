"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import type { CurrentProfile } from "@/lib/auth/current-profile";

export function AdminShell({
  role,
  namaDesa,
  profile,
  children,
}: {
  role: "admin" | "operator";
  namaDesa: string;
  profile: CurrentProfile;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Kunci scroll halaman di belakang drawer saat terbuka di mobile — tanpa
  // ini pengguna bisa menggeser konten yang tertutup overlay, membingungkan.
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen bg-surface-alt">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <AdminSidebar role={role} namaDesa={namaDesa} open={mobileOpen} onNavigate={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar profile={profile} onMenuClick={() => setMobileOpen((open) => !open)} />
        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
