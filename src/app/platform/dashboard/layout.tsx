import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getCurrentPlatformAdmin } from "@/lib/auth/current-platform-admin";
import { platformSignOutAction } from "@/lib/actions/platform-auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function PlatformProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/platform/login");
  }

  const admin = await getCurrentPlatformAdmin();
  if (!admin) {
    redirect("/platform/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-krem-50">
      <header className="flex items-center justify-between border-b border-white/10 bg-espresso-800 px-4 py-3 text-krem-50 sm:px-6">
        <Link href="/platform/dashboard" className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-gold-500 to-kopi-600 text-espresso-950">
            <ShieldCheck className="size-4" />
          </span>
          <span className="font-heading text-sm font-semibold">Panel Platform</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-krem-50/70">{admin.nama_lengkap}</span>
          <form action={platformSignOutAction}>
            <button
              type="submit"
              className="font-medium underline underline-offset-4 hover:text-gold-400"
            >
              Keluar
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
