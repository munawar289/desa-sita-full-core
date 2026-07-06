import type { Metadata } from "next";
import { Mountain, TriangleAlert } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buildMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Masuk",
    area: "admin",
    robots: { index: false, follow: false },
  });
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-espresso-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-gold-500 to-kopi-600 text-espresso-950">
            <Mountain className="size-6" />
          </span>
          <h1 className="mt-4 font-heading text-xl font-semibold text-espresso-950">
            Dashboard Admin
          </h1>
          <p className="mt-1 text-sm text-espresso-800/60">Desa Sita</p>
        </div>

        {isSupabaseConfigured() ? (
          <div className="mt-8">
            <LoginForm />
          </div>
        ) : (
          <div className="mt-8 flex items-start gap-3 rounded-lg border border-tanah-100 bg-tanah-100/60 p-4 text-sm text-tanah-500">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <p>
              Supabase belum dikonfigurasi. Isi <code>NEXT_PUBLIC_SUPABASE_URL</code>{" "}
              dan <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> di{" "}
              <code>.env.local</code> — lihat <code>supabase/README.md</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
