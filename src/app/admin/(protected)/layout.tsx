import { redirect } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { signOutAction } from "@/lib/actions/auth";
import { getCurrentProfile } from "@/lib/auth/current-profile";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentTenant } from "@/lib/tenant/current-tenant";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login");
  }

  const tenant = await getCurrentTenant();

  // Pengecekan sesi + role di Server Component ini adalah lapis UX kedua —
  // middleware sudah menggerbangi /admin/*, RLS di database tetap otoritas
  // sesungguhnya (PRD §10).
  const profile = await getCurrentProfile(tenant.id);
  if (!profile) {
    redirect("/admin/login");
  }

  // Bedakan dua kemungkinan (Phase 4 Modul 1 §7): resolver Phase 3 gagal
  // senyap dan fallback ke tenant default (bisa dicoba lagi) vs memang bukan
  // anggota tenant yang di-resolve (akses ditolak permanen).
  //
  // PENTING: cek `tenant.source === "unresolved"` DULUAN, terlepas dari
  // `profile.role` — kalau resolver fallback ke tenant default dan akun ini
  // KEBETULAN anggota tenant default itu, tanpa pengecekan ini dashboard akan
  // tampil normal padahal diam-diam beroperasi di tenant yang salah (bukan
  // tenant yang dimaksud subdomain/domain yang diakses). Admin bisa membaca/
  // menulis data tenant default tanpa sadar. Jangan pernah lanjut ke
  // dashboard selama sumber resolusi tidak pasti, apa pun status membership-nya.
  if (tenant.source === "unresolved" || !profile.role) {
    const message =
      tenant.source === "unresolved"
        ? "Gagal memuat informasi desa untuk domain ini. Coba muat ulang halaman beberapa saat lagi."
        : "Akun ini belum terdaftar sebagai anggota pengelola situs desa ini.";

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-krem-50 px-4">
        <div className="flex max-w-sm items-start gap-3 rounded-lg border border-tanah-100 bg-tanah-100/60 p-4 text-sm text-tanah-500">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <p>{message}</p>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="text-sm font-medium text-espresso-800 underline underline-offset-4 hover:text-tanah-500"
          >
            Keluar
          </button>
        </form>
      </div>
    );
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
