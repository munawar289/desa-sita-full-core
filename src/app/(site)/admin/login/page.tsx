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
    <div className="flex min-h-screen items-center justify-center bg-panel-strong px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-accent-300 to-accent-500 text-neutral-900">
            <Mountain className="size-6" />
          </span>
          <h1 className="mt-4 font-heading text-xl font-semibold text-text">
            Dashboard Admin
          </h1>
          <p className="mt-1 text-sm text-text-muted">Desa Sita</p>
        </div>

        {isSupabaseConfigured() ? (
          <div className="mt-8">
            <LoginForm />
          </div>
        ) : (
          <div className="mt-8 flex items-start gap-3 rounded-lg border border-danger-soft bg-danger-soft/60 p-4 text-sm text-on-danger-soft">
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
