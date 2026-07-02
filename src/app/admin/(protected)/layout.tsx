import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  // Pengecekan sesi + role di Server Component ini adalah lapis UX kedua —
  // middleware sudah menggerbangi /admin/*, RLS di database tetap otoritas
  // sesungguhnya (PRD §10).
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-krem-50">
      <AdminSidebar role={profile.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar profile={profile} />
        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
